import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, serverTimestamp, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getFirebaseConfig } from './firebase-config.js';

// --- INITIALIZATION ---
const firebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

let userId = null;
let activityLogsListener = null;

// --- DOM ELEMENTS ---
const trackerContainer = document.getElementById('tracker-tool-container');
const loginPrompt = document.getElementById('tracker-login-prompt');
const activityForm = document.getElementById('activity-log-form');
const logsContainer = document.getElementById('log-entries-container');
const logsPlaceholder = document.getElementById('logs-placeholder');

// --- AUTHENTICATION ---
onAuthStateChanged(auth, user => {
    if (user) {
        userId = user.uid;
        loginPrompt.classList.add('hidden');
        trackerContainer.classList.remove('hidden');
        setupActivityListener();
    } else {
        userId = null;
        if (activityLogsListener) activityLogsListener(); // Unsubscribe
        trackerContainer.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
    }
});

// --- FIRESTORE REAL-TIME LISTENER ---
function setupActivityListener() {
    if (!userId) return;
    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(activitiesRef, orderBy('date', 'desc'));

    activityLogsListener = onSnapshot(q, (snapshot) => {
        const activities = [];
        snapshot.forEach(doc => {
            activities.push({ id: doc.id, ...doc.data() });
        });
        renderActivities(activities);
        updateDashboard(activities);
    }, (error) => {
        console.error("Error fetching activities:", error);
        logsPlaceholder.textContent = "Could not load activities.";
    });
}

// --- RENDERING UI ---
function renderActivities(activities) {
    logsContainer.innerHTML = ''; // Clear existing
    if (activities.length === 0) {
        logsContainer.appendChild(logsPlaceholder);
        logsPlaceholder.textContent = "No activities logged yet. Add one above to get started.";
        return;
    }

    activities.forEach(activity => {
        const activityEl = document.createElement('div');
        activityEl.className = 'bg-gray-900 p-4 rounded-lg flex justify-between items-center';
        
        let valueDisplay = '';
        if (activity.type === 'financial') {
            valueDisplay = `<span class="font-bold text-green-400">R ${parseFloat(activity.value).toFixed(2)}</span>`;
        } else if (activity.type === 'time') {
            valueDisplay = `<span class="font-bold text-teal-400">${activity.value} Hrs</span>`;
        }

        const formattedDate = new Date(activity.date).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

        activityEl.innerHTML = `
            <div>
                <p class="font-bold text-lg">${activity.title}</p>
                <p class="text-sm text-gray-400">${formattedDate} - You contributed ${activity.userContribution}%</p>
            </div>
            <div class="flex items-center gap-4">
                ${valueDisplay}
                <button data-id="${activity.id}" class="delete-btn text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
            </div>
        `;
        logsContainer.appendChild(activityEl);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const docId = e.currentTarget.dataset.id;
            if (confirm('Are you sure you want to delete this entry?')) {
                await deleteDoc(doc(db, 'users', userId, 'activities', docId));
            }
        });
    });
}

function updateDashboard(activities) {
    let totalFinancial = 0;
    let totalTime = 0;

    activities.forEach(act => {
        const userPortion = (act.userContribution || 0) / 100;
        if (act.type === 'financial') {
            totalFinancial += (parseFloat(act.value) || 0) * userPortion;
        } else if (act.type === 'time') {
            totalTime += (parseFloat(act.value) || 0) * userPortion;
        }
    });

    document.getElementById('user-financial-total').textContent = `R ${totalFinancial.toFixed(2)}`;
    document.getElementById('user-time-total').textContent = `${totalTime.toFixed(1)} Hrs`;
}


// --- FORM HANDLING ---
activityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!userId) {
        alert("You must be logged in to save an activity.");
        return;
    }

    const title = document.getElementById('activity-title').value;
    const date = document.getElementById('activity-date').value;
    const type = document.getElementById('activity-type').value;
    const value = document.getElementById('activity-value').value;
    const userContribution = document.getElementById('contribution-slider').value;

    if (!title || !date) {
        alert("Please fill in the title and date.");
        return;
    }

    try {
        await addDoc(collection(db, 'users', userId, 'activities'), {
            title,
            date,
            type,
            value: type === 'general' ? 0 : parseFloat(value) || 0,
            userContribution: parseInt(userContribution),
            createdAt: serverTimestamp()
        });
        activityForm.reset();
        document.getElementById('activity-date').valueAsDate = new Date(); // Reset date to today
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("There was an error saving your activity.");
    }
});

// Show/hide value input based on activity type
document.getElementById('activity-type').addEventListener('change', (e) => {
    const valueContainer = document.getElementById('value-input-container');
    if (e.target.value === 'general') {
        valueContainer.classList.add('hidden');
    } else {
        valueContainer.classList.remove('hidden');
    }
});
// Set default date
document.getElementById('activity-date').valueAsDate = new Date();


// --- REPORTING MODAL ---
const reportModal = document.getElementById('report-modal');
document.getElementById('generate-report-btn').addEventListener('click', () => {
    reportModal.classList.add('active');
});
document.getElementById('cancel-report-btn').addEventListener('click', () => {
    reportModal.classList.remove('active');
});

// NOTE: The PDF generation logic for the report is complex and would be added here.
// It would involve fetching the data again for the selected date range,
// analyzing it, and then using a library like jsPDF to construct the branded document.
document.getElementById('confirm-generate-report-btn').addEventListener('click', () => {
    alert("Report generation is a future premium feature. Stay tuned!");
    // Placeholder for actual report generation logic
});
