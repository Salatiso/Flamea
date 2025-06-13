/**
 * Flamea.org - Unified main.js
 * This file contains the core sitewide JavaScript functionality.
 * - Manages all modal pop-ups (AI Assistant, Podcast, etc.).
 * - Handles the accordion UI elements centrally.
 * - Dynamically updates the year in the footer.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. GENERIC MODAL CONTROL SYSTEM ---
    const setupModalControls = () => {
        // Function to open a modal
        const openModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                // Special trigger for podcast player if it exists
                if (modalId === 'podcast-modal' && typeof window.loadPodcastEpisodes === 'function' && !modal.dataset.loaded) {
                    window.loadPodcastEpisodes();
                    modal.dataset.loaded = 'true'; // Ensure it only loads once.
                }
            }
        };

        // Function to close a modal
        const closeModal = (modal) => {
            if (modal) {
                modal.classList.remove('active');
                const audioPlayer = modal.querySelector('audio');
                if (audioPlayer) audioPlayer.pause(); // Stop audio when closing modal
            }
        };

        // Event delegation for opening modals
        document.body.addEventListener('click', (event) => {
            const button = event.target.closest('[data-modal-target]');
            if (button) {
                event.preventDefault();
                const modalId = button.getAttribute('data-modal-target');
                openModal(modalId);
            }
        });

        // Event delegation for closing modals
        document.body.addEventListener('click', (event) => {
            const button = event.target.closest('[data-modal-close]');
            if (button) {
                event.preventDefault();
                closeModal(button.closest('.modal, .custom-modal'));
            }
            // Also close if clicking on the modal background
            if (event.target.classList.contains('modal') || event.target.classList.contains('custom-modal')) {
                closeModal(event.target);
            }
        });
    };

    // --- 2. CENTRALIZED ACCORDION CONTROL ---
    const setupAccordion = () => {
        // Use event delegation on the body for all accordion toggles
        document.body.addEventListener('click', (event) => {
            const button = event.target.closest('.accordion-toggle');
            if (button) {
                const content = button.nextElementSibling;
                const icon = button.querySelector('i.fa-chevron-down');

                if (content && content.classList.contains('accordion-content')) {
                    // Toggle the 'open' class which controls visibility via CSS
                    content.classList.toggle('open');
                    if (icon) {
                        icon.classList.toggle('rotate-180');
                    }
                }
            }
        });
    };

    // --- 3. DYNAMIC FOOTER YEAR ---
    const setupFooter = () => {
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    };

    // --- INITIALIZE ALL SITE-WIDE COMPONENTS ---
    setupModalControls();
    setupAccordion();
    setupFooter();
});
