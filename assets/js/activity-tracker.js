// assets/js/activity-tracker.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    // In a real app, this would be loaded from Firestore for members
    const activities = []; 

    // --- DOM ELEMENTS ---
    const activityForm = document.getElementById('activity-form');
    const logContainer = document.getElementById('activity-log-container');

    // --- EVENT LISTENERS ---
    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Gather data from the form
        const newActivity = {
            id: Date.now(), // Simple unique ID
            date: document.getElementById('activity-date').value,
            category: document.getElementById('activity-category').value,
            description: document.getElementById('activity-description').value,
            amount: document.getElementById('activity-amount').value || 0,
        };

        // Basic validation
        if (!newActivity.date || !newActivity.description) {
            alert("Please fill in at least the date and description.");
            return;
        }

        addActivity(newActivity);
        activityForm.reset();
    });

    // --- CORE FUNCTIONS ---

    /**
     * Adds a new activity to the state and re-renders the log.
     * @param {object} activity - The activity object to add.
     */
    function addActivity(activity) {
        activities.unshift(activity); // Add to the beginning of the array
        renderActivityLog();
    }

    /**
     * Renders the list of all activities in the log container.
     */
    function renderActivityLog() {
        if (activities.length === 0) {
            logContainer.innerHTML = `<p class="text-center text-gray-500">No activities logged yet.</p>`;
            return;
        }

        logContainer.innerHTML = ''; // Clear the container

        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item bg-gray-700 p-4 rounded-lg flex justify-between items-start';
            
            // Icon based on category
            const icon = getCategoryIcon(activity.category);

            // Amount display
            const amountDisplay = activity.amount > 0 ? `<span class="font-bold text-green-400">R${parseFloat(activity.amount).toFixed(2)}</span>` : '';

            activityElement.innerHTML = `
                <div class="flex items-center">
                    <div class="text-2xl mr-4">${icon}</div>
                    <div>
                        <p class="font-bold">${activity.category}</p>
                        <p class="text-sm text-gray-300">${activity.description}</p>
                        <p class="text-xs text-gray-500 mt-1">Logged on: ${new Date(activity.date).toLocaleDateString('en-ZA')}</p>
                    </div>
                </div>
                <div class="text-right">
                    ${amountDisplay}
                </div>
            `;
            logContainer.appendChild(activityElement);
        });
    }

    /**
     * Returns an icon for a given activity category.
     * @param {string} category - The category of the activity.
     * @returns {string} - An HTML string for the icon.
     */
    function getCategoryIcon(category) {
        switch(category) {
            case 'Financial Contribution': return '<i class="fas fa-money-bill-wave text-green-500"></i>';
            case 'School/Education': return '<i class="fas fa-graduation-cap text-blue-500"></i>';
            case 'Healthcare': return '<i class="fas fa-briefcase-medical text-red-500"></i>';
            case 'Visitation/Contact Time': return '<i class="fas fa-calendar-check text-purple-500"></i>';
            case 'Shared Task/Duty': return '<i class="fas fa-tasks text-yellow-500"></i>';
            case 'Dispute/Incident': return '<i class="fas fa-exclamation-triangle text-orange-500"></i>';
            default: return '<i class="fas fa-clipboard-list"></i>';
        }
    }
    
    // --- INITIALIZATION ---
    renderActivityLog();
});
