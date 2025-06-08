// assets/js/main.js
// This file is for truly global JavaScript functions that need to run on every page.
// With our new modular design, many scripts are page-specific (e.g., auth.js, chatbot.js).

document.addEventListener('DOMContentLoaded', function() {
    
    // Set the current year in the footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // A small global helper function to initialize any modals on a page.
    // It finds all modal triggers and modals and hooks them up.
    const initializeModals = () => {
        const modalTriggers = document.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => {
            const modalId = trigger.dataset.modalTarget;
            const modal = document.getElementById(modalId);
            const closeButtons = modal ? modal.querySelectorAll('[data-modal-close]') : [];
            
            if (modal) {
                trigger.addEventListener('click', () => modal.classList.add('flex'));
                closeButtons.forEach(button => {
                    button.addEventListener('click', () => modal.classList.remove('flex'));
                });
            }
        });
    };

    initializeModals(); 
    
    // You can add other global functions here in the future if needed.
    // For now, our design keeps things simple and clean.
});
