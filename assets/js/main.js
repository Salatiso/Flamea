/**
 * Flamea.org - main.js
 * This file contains the core sitewide JavaScript functionality.
 * - Manages all modal pop-ups (AI Assistant, Podcast, etc.) in a generic way.
 * - Handles the mobile menu toggling.
 * - Controls the accordion UI elements.
 * - Dynamically updates the year in the footer.
 * - Note: Header and Footer are now part of each HTML file directly for better performance and SEO.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. DYNAMIC FOOTER YEAR ---
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- 2. MOBILE MENU TOGGLE ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu'); // Assuming you'll have a mobile menu div
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 3. GENERIC MODAL CONTROL SYSTEM ---
    function setupModalControls() {
        const openModalButtons = document.querySelectorAll('[data-modal-target]');
        const closeModalButtons = document.querySelectorAll('[data-modal-close]');

        openModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active'); // Use 'active' class as per your CSS
                    
                    // Special trigger for podcast player if it hasn't loaded episodes yet
                    if (modalId === 'podcast-modal' && typeof window.loadPodcastEpisodes === 'function') {
                        window.loadPodcastEpisodes();
                    }
                }
            });
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal, .custom-modal');
                if (modal) {
                    modal.classList.remove('active');
                    // If closing the podcast modal, pause the audio
                    const audioPlayer = modal.querySelector('audio');
                    if(audioPlayer) {
                        audioPlayer.pause();
                    }
                }
            });
        });

        // Close modal by clicking on the background overlay
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal') || event.target.classList.contains('custom-modal')) {
                event.target.classList.remove('active');
                 const audioPlayer = event.target.querySelector('audio');
                if(audioPlayer) {
                    audioPlayer.pause();
                }
            }
        });
    }

    // --- 4. GENERIC ACCORDION CONTROL ---
    function setupAccordion() {
        document.querySelectorAll('.accordion-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('i.fa-chevron-down');
                
                // Toggle visibility for the clicked accordion
                const isHidden = content.classList.contains('hidden');
                content.classList.toggle('hidden', !isHidden);
                if (icon) {
                    icon.classList.toggle('rotate-180', isHidden);
                }

                // If using max-height for transition (from about.html)
                if (content.classList.contains('accordion-content')) {
                     if (content.style.maxHeight) {
                        content.style.maxHeight = null;
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px";
                    }
                }
            });
        });
    }

    // --- INITIALIZE ALL SITE-WIDE LISTENERS ---
    setupModalControls();
    setupAccordion();
});
