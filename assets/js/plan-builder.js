// assets/js/plan-builder.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let currentStep = 1;
    const totalSteps = 5;
    const planData = {
        step1: {}, // Parties & Children
        step2: {}, // Residence & Custody
        step3: {}, // Financial Contributions
        step4: {}, // Schedule
    };

    // --- DOM ELEMENTS ---
    const prevBtn = document.getElementById('prev-step-btn');
    const nextBtn = document.getElementById('next-step-btn');
    const stepIndicators = document.querySelectorAll('.step-indicator');

    // --- EVENT LISTENERS ---
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepView();
        }
    });

    nextBtn.addEventListener('click', () => {
        // Here we will add validation later before proceeding
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepView();
        } else {
            // This is the final step, button might change to "Generate Plan"
            console.log("Finalizing plan...", planData);
            alert("Ready to generate your plan!");
        }
    });

    // --- CORE FUNCTIONS ---

    /**
     * Updates the entire view to show the correct step and button states.
     * This is the central controller for the UI.
     */
    function updateStepView() {
        // Hide all step content
        document.querySelectorAll('.step-content').forEach(stepEl => {
            stepEl.classList.remove('active');
        });

        // Show the current step content
        document.getElementById(`step-${currentStep}`).classList.add('active');

        // Update the button states and text
        updateNavigationButtons();
        
        // Update the step indicators at the top
        updateStepIndicators();
    }

    /**
     * Manages the visibility and text of the Next/Previous buttons.
     */
    function updateNavigationButtons() {
        // Handle Previous button visibility
        if (currentStep === 1) {
            prevBtn.style.visibility = 'hidden';
        } else {
            prevBtn.style.visibility = 'visible';
        }

        // Handle Next button text and functionality
        if (currentStep === totalSteps) {
            nextBtn.textContent = 'Generate Plan';
            // In the future, this button will trigger the final review and download
        } else {
            nextBtn.textContent = 'Next Step';
        }
    }
    
    /**
     * Updates the visual style of the step indicators to show progress.
     */
    function updateStepIndicators() {
        stepIndicators.forEach((indicator, index) => {
            const stepNum = index + 1;
            indicator.classList.remove('active', 'completed'); // Reset styles

            if (stepNum < currentStep) {
                // Mark previous steps as completed
                indicator.classList.add('completed', 'bg-green-700', 'text-white');
            } else if (stepNum === currentStep) {
                // Mark the current step as active
                indicator.classList.add('active', 'bg-green-500', 'text-white', 'font-bold');
            } else {
                // Default style for upcoming steps
                indicator.classList.add('bg-gray-700', 'text-gray-400');
            }
        });
    }

    // --- INITIALIZATION ---
    // Set the initial view when the page loads
    updateStepView();

});
