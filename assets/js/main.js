document.addEventListener('DOMContentLoaded', () => {

    // --- UNIVERSAL MODAL CONTROLLER ---
    
    // Find all buttons that are supposed to open a modal
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    
    // Find all buttons that are supposed to close a modal
    const closeModalButtons = document.querySelectorAll('[data-modal-close]');

    // Add a click event listener to each "open" button
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the target modal's ID from the button's attribute
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                // Add the 'active' class to show the modal
                modal.classList.add('active');
            }
        });
    });

    // Add a click event listener to each "close" button
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the modal that contains this button and remove the 'active' class
            const modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Optional: Add functionality to close a modal by clicking its dark background
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (event) => {
            // If the user clicked directly on the modal background (not the content inside)
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // --- OTHER GLOBAL SCRIPTS CAN GO HERE ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
