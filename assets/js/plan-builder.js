// --- GLOBAL SCOPE FOR GOOGLE MAPS CALLBACK ---
let initMap;

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let currentStep = 1;
    const totalSteps = 5;
    const planData = {
        step1: { fatherName: '', motherName: '', children: [], },
        step2: { fatherAddress: { text: '' }, motherAddress: { text: '' } },
        step3: { contributions: [ /* Default items */ ] },
        step4: { events: [] },
        step5: { disclaimerAccepted: false }
    };

    // --- DOM ELEMENTS ---
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');

    // --- CALENDAR VARIABLES ---
    let calendar;

    // --- MAIN INITIALIZATION ---
    function initializeApp() {
        // Event Listeners
        prevBtn.addEventListener('click', handlePrevStep);
        nextBtn.addEventListener('click', handleNextStep);
        closeCheckoutBtn.addEventListener('click', () => checkoutModal.classList.add('hidden'));
        
        // Initial View
        updateStepView();
    }
    
    // --- GOOGLE MAPS API CALLBACK (from previous immersive) ---
    initMap = () => { /* ... existing Google Maps init logic ... */ };

    // --- EVENT HANDLERS ---
    function handlePrevStep() { if (currentStep > 1) { currentStep--; updateStepView(); } }
    function handleNextStep() {
        if (saveCurrentStepData()) {
            if (currentStep < totalSteps) {
                currentStep++;
                updateStepView();
            } else {
                if (planData.step5.disclaimerAccepted) {
                    checkoutModal.classList.remove('hidden');
                } else {
                    alert('You must accept the disclaimer before proceeding.');
                }
            }
        }
    }
    
    // --- CORE LOGIC ---
    function updateStepView() {
        document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        // Step-specific render functions
        if (currentStep === 3) { /* ... renderContributions() ... */ }
        if (currentStep === 4) initCalendar();
        if (currentStep === 5) renderReviewPane();

        updateNavigationButtons();
        updateStepIndicators();
    }

    function saveCurrentStepData() {
        // Save logic for steps 1, 2, 3...
        if (currentStep === 5) {
            planData.step5.disclaimerAccepted = document.getElementById('disclaimer-checkbox').checked;
        }
        return true;
    }

    // --- STEP 4: CALENDAR & SCHEDULING ---
    function initCalendar() {
        if (calendar) return; // Don't re-initialize
        calendar = new VanillaCalendar('#schedule-calendar', {
            settings: {
                visibility: { theme: 'dark' },
            },
            actions: {
                clickDay(e, dates) {
                    if (dates[0]) {
                        document.getElementById('event-date').value = dates[0];
                    }
                },
            },
        });
        calendar.init();
        
        document.getElementById('add-event-btn').addEventListener('click', addScheduleEvent);
        renderEvents();
    }

    function addScheduleEvent() {
        const newEvent = {
            id: Date.now(),
            date: document.getElementById('event-date').value,
            description: document.getElementById('event-description').value,
            recurring: document.getElementById('event-recurring').value,
        };
        if (!newEvent.date || !newEvent.description) {
            alert('Please provide a date and description for the event.');
            return;
        }
        planData.step4.events.push(newEvent);
        renderEvents();
    }

    function renderEvents() {
        const logContainer = document.getElementById('events-log-container');
        if (planData.step4.events.length === 0) {
            logContainer.innerHTML = `<p class="text-gray-500">No events scheduled yet.</p>`;
            return;
        }
        logContainer.innerHTML = '';
        const markedDates = [];
        planData.step4.events.forEach(event => {
            logContainer.innerHTML += `<div class="bg-gray-700 p-2 rounded flex justify-between"><span>${event.date}: ${event.description}</span><span>${event.recurring}</span></div>`;
            markedDates.push(event.date);
        });
        calendar.settings.selected.dates = markedDates;
        calendar.update();
    }

    // --- STEP 5: REVIEW PANE ---
    function renderReviewPane() {
        const reviewPane = document.getElementById('review-pane');
        reviewPane.innerHTML = `
            <div class="flex justify-between items-center pb-2 border-b border-gray-700">
                <div><h4 class="font-bold">Parties Involved</h4><p class="text-sm text-gray-400">Father: ${planData.step1.fatherName || 'N/A'}</p></div>
                <button type="button" class="edit-btn" data-step="1">Edit</button>
            </div>
             <div class="flex justify-between items-center pt-4 pb-2 border-b border-gray-700">
                <div><h4 class="font-bold">Residence</h4><p class="text-sm text-gray-400">Father's Address: ${planData.step2.fatherAddress.text || 'N/A'}</p></div>
                <button type="button" class="edit-btn" data-step="2">Edit</button>
            </div>
            <!-- Add more review sections for other steps -->
        `;
        // Add event listeners to new edit buttons
        reviewPane.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentStep = parseInt(e.target.dataset.step);
                updateStepView();
            });
        });
    }

    // --- Other helper functions (updateNavigationButtons, etc.) ---
    function updateNavigationButtons() { /* ... */ }
    function updateStepIndicators() { /* ... */ }
    
    initializeApp();
});
