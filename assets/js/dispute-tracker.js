import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// This script assumes that auth.js has already initialized Firebase and exposed the 'auth' and 'db' objects.
document.addEventListener('DOMContentLoaded', () => {
    // Ensure the flamea global object and its properties are ready
    if (!window.flamea || !window.flamea.auth || !window.flamea.db) {
        console.error("Firebase is not initialized. Make sure auth.js is loaded correctly.");
        return;
    }

    const auth = window.flamea.auth;
    const db = window.flamea.db;

    const trackerContainer = document.getElementById('tracker-tool-container');
    const loginPrompt = document.getElementById('tracker-login-prompt');
    const form = document.getElementById('dispute-log-form');
    const entriesContainer = document.getElementById('log-entries-container');
    const logsPlaceholder = document.getElementById('logs-placeholder');

    let logsListener = null;

    const renderLogEntries = (entries) => {
        if (!entriesContainer || !logsPlaceholder) return;

        if (entries.length === 0) {
            logsPlaceholder.textContent = 'No log entries found. Add your first one above!';
            logsPlaceholder.classList.remove('hidden');
            entriesContainer.innerHTML = '';
            return;
        }

        logsPlaceholder.classList.add('hidden');
        entriesContainer.innerHTML = '';

        entries.sort((a, b) => new Date(b.date) - new Date(a.date));

        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'bg-gray-900 bg-opacity-75 p-6 rounded-lg shadow-md border border-gray-700';
            const entryDate = entry.date ? new Date(entry.date).toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short'}) : 'No date';
            
            entryElement.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-lg text-green-400">${entry.title}</h3>
                    <p class="text-sm text-gray-400 flex-shrink-0 ml-4">${entryDate}</p>
                </div>
                <p class="text-gray-300 whitespace-pre-wrap">${entry.description}</p>
            `;
            entriesContainer.appendChild(entryElement);
        });
    };

    const setupFirestoreListener = (userId) => {
        const logsCollectionRef = collection(db, "users", userId, "disputeLogs");
        const q = query(logsCollectionRef, orderBy("date", "desc"));

        logsListener = onSnapshot(q, (querySnapshot) => {
            const entries = [];
            querySnapshot.forEach((doc) => {
                entries.push({ id: doc.id, ...doc.data() });
            });
            renderLogEntries(entries);
        }, (error) => {
            console.error("Error listening to log entries: ", error);
            if(logsPlaceholder) logsPlaceholder.textContent = 'Could not load your log entries. Please refresh the page.';
        });
    };

    const cleanupListeners = () => {
        if (logsListener) {
            logsListener();
            logsListener = null;
        }
    };

    auth.onAuthStateChanged(user => {
        if (!trackerContainer || !loginPrompt) return;

        if (user) {
            trackerContainer.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
            cleanupListeners();
            setupFirestoreListener(user.uid);
        } else {
            trackerContainer.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            loginPrompt.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
            cleanupListeners();
        }
    });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) {
                alert("You must be logged in to save an entry.");
                return;
            }

            const logData = {
                date: document.getElementById('log-date').value,
                title: document.getElementById('log-title').value,
                description: document.getElementById('log-description').value,
                createdAt: new Date().toISOString() // Add a creation timestamp
            };
            
            if (!logData.date || !logData.title || !logData.description) {
                alert("Please fill in all fields.");
                return;
            }

            try {
                const logsCollectionRef = collection(db, "users", user.uid, "disputeLogs");
                await addDoc(logsCollectionRef, logData);
                form.reset();
            } catch (error) {
                console.error("Error adding log entry: ", error);
                alert("Failed to save log entry. Please try again.");
            }
        });
    }
});
