import { getFirestore, collection, query, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// This script assumes that auth.js has already initialized Firebase and exposed the 'auth' and 'db' objects.
document.addEventListener('DOMContentLoaded', () => {
    const auth = window.flamea.auth;
    const db = window.flamea.db;

    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');
    const welcomeHeading = document.getElementById('dashboard-welcome');
    const plansListContainer = document.getElementById('parenting-plans-list');
    const logsListContainer = document.getElementById('dispute-logs-list');

    let plansListener = null;
    let logsListener = null;

    const renderDocuments = (container, docs, type) => {
        container.innerHTML = ''; // Clear "Loading..." message
        if (docs.length === 0) {
            container.innerHTML = `<p class="text-gray-500 text-sm p-4 bg-gray-900 bg-opacity-50 rounded-lg">You have no saved ${type} yet.</p>`;
            return;
        }

        docs.forEach(doc => {
            const docElement = document.createElement('div');
            docElement.className = 'bg-gray-900 bg-opacity-75 p-4 rounded-lg shadow-md flex justify-between items-center';
            
            const docDate = doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('en-ZA') : 'Date not available';
            
            docElement.innerHTML = `
                <div>
                    <h4 class="font-bold text-green-400">${doc.title || 'Untitled Log'}</h4>
                    <p class="text-xs text-gray-400">Saved on: ${docDate}</p>
                </div>
                <div>
                    <a href="#" class="text-blue-400 hover:underline text-sm font-semibold">View/Edit</a>
                </div>
            `;
            container.appendChild(docElement);
        });
    };

    const setupFirestoreListeners = (userId) => {
        // --- Listener for Parenting Plans ---
        const plansRef = collection(db, "users", userId, "parentingPlans");
        const plansQuery = query(plansRef, orderBy("createdAt", "desc"));
        
        plansListener = onSnapshot(plansQuery, (snapshot) => {
            const plans = [];
            snapshot.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));
            renderDocuments(plansListContainer, plans, 'parenting plans');
        }, (error) => {
            console.error("Error fetching parenting plans:", error);
            plansListContainer.innerHTML = `<p class="text-red-500 text-sm">Could not load saved plans.</p>`;
        });

        // --- Listener for Dispute Logs ---
        const logsRef = collection(db, "users", userId, "disputeLogs");
        const logsQuery = query(logsRef, orderBy("createdAt", "desc"));

        logsListener = onSnapshot(logsQuery, (snapshot) => {
            const logs = [];
            snapshot.forEach(doc => logs.push({ id: doc.id, ...doc.data() }));
            renderDocuments(logsListContainer, logs, 'dispute logs');
        }, (error) => {
            console.error("Error fetching dispute logs:", error);
            logsListContainer.innerHTML = `<p class="text-red-500 text-sm">Could not load saved logs.</p>`;
        });
    };

    const cleanupListeners = () => {
        if (plansListener) plansListener(); // Unsubscribe
        if (logsListener) logsListener(); // Unsubscribe
        plansListener = null;
        logsListener = null;
    };

    // --- Main Auth Observer ---
    auth.onAuthStateChanged(user => {
        if (!dashboardContainer || !loginPrompt) return; 

        if (user) {
            dashboardContainer.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
            if (welcomeHeading) welcomeHeading.textContent = `Welcome, ${user.displayName || user.email.split('@')[0]}`;
            
            cleanupListeners();
            setupFirestoreListeners(user.uid);
            
        } else {
            dashboardContainer.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            loginPrompt.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
            cleanupListeners(); 
        }
    });
});
