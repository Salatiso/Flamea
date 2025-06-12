/**
 * Flamea.org - Unified main.js
 * * This file contains the core sitewide JavaScript functionality, merged and improved from original sources.
 * - Dynamically injects a consistent header on every page.
 * - Manages all modal pop-ups (AI Assistant, Podcast, etc.).
 * - Handles the mobile menu toggling and header scroll effects.
 * - Controls the accordion UI elements.
 * - Dynamically updates the year in the footer.
 */
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. UNIFIED HEADER INJECTION ---
    // This function builds and injects the header into any page with a <header id="main-header"> element.
    const createHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return; // Exit if no header element is on the page

        // Determine the active page to highlight the correct nav link.
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        // A helper function to check if a link should be active.
        const isActive = (page) => currentPage === page;
        
        // This is the HTML for the consistent header.
        const headerHTML = `
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="index.html" class="logo-text text-xl md:text-2xl font-bold font-roboto text-white transition-colors duration-300">
                    Flame<span class="text-green-400">a›</span>
                </a>
                <nav class="hidden md:flex space-x-4 items-center">
                    <a href="index.html" class="nav-link ${isActive('index.html') ? 'active' : ''}"><i class="fas fa-home mr-2 opacity-80"></i>Home</a>
                    <a href="tools.html" class="nav-link ${isActive('tools.html') || isActive('parenting-plan.html') ? 'active' : ''}"><i class="fas fa-tools mr-2 opacity-80"></i>Tools & Templates</a>
                    <a href="about.html" class="nav-link ${isActive('about.html') ? 'active' : ''}"><i class="fas fa-info-circle mr-2 opacity-80"></i>About Us</a>
                    <a href="community.html" class="nav-link ${isActive('community.html') ? 'active' : ''}"><i class="fas fa-users mr-2 opacity-80"></i>Community</a>
                    <a href="training.html" class="nav-link ${isActive('training.html') ? 'active' : ''}"><i class="fas fa-chalkboard-teacher mr-2 opacity-80"></i>Training</a>
                    <div id="auth-links-desktop" class="flex items-center gap-4 ml-4">
                        <!-- Auth buttons will be inserted here by auth.js -->
                    </div>
                </nav>
                <button id="mobile-menu-button" class="md:hidden mobile-btn-icon text-white focus:outline-none transition-colors duration-300">
                    <ion-icon name="menu-outline" class="text-3xl"></ion-icon>
                </button>
            </div>
            <div id="mobile-menu" class="hidden md:hidden bg-white shadow-lg py-2 absolute w-full left-0 top-full z-50">
                <a href="index.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Home</a>
                <a href="tools.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Tools & Templates</a>
                <a href="about.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">About Us</a>
                <a href="community.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Community</a>
                 <a href="training.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Training</a>
                <div id="auth-links-mobile" class="px-6 py-3"></div>
            </div>
        `;
        headerContainer.innerHTML = headerHTML;
    };
    
    // Run all setup functions after the DOM is ready.
    createHeader(); // 1. Build the header first.
    
    // --- 2. HEADER SCROLL & MOBILE MENU LOGIC ---
    // This logic now finds the elements created by createHeader().
    const header = document.getElementById('main-header');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run on page load for correct initial state.
    }
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const mobileMenuIcon = mobileMenuButton.querySelector('ion-icon');
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenuIcon.setAttribute('name', isHidden ? 'menu-outline' : 'close-outline');
        });
        // Close mobile menu when a link is clicked.
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { 
                mobileMenu.classList.add('hidden');
                mobileMenuButton.querySelector('ion-icon').setAttribute('name', 'menu-outline');
             });
        });
    }

    // --- 3. GENERIC MODAL CONTROL SYSTEM ---
    const setupModalControls = () => {
        document.querySelectorAll('[data-modal-target]').forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    // Special trigger for podcast player.
                    if (modalId === 'podcast-modal' && typeof window.loadPodcastEpisodes === 'function' && !modal.dataset.loaded) {
                        window.loadPodcastEpisodes();
                        modal.dataset.loaded = 'true'; // Ensure it only loads once.
                    }
                }
            });
        });

        document.querySelectorAll('[data-modal-close]').forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal, .custom-modal');
                if (modal) {
                    modal.classList.remove('active');
                    const audioPlayer = modal.querySelector('audio');
                    if(audioPlayer) audioPlayer.pause();
                }
            });
        });

        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal') || event.target.classList.contains('custom-modal')) {
                event.target.classList.remove('active');
                const audioPlayer = event.target.querySelector('audio');
                if(audioPlayer) audioPlayer.pause();
            }
        });
    }

    // --- 4. GENERIC ACCORDION CONTROL ---
    const setupAccordion = () => {
        document.querySelectorAll('.accordion-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('i.fa-chevron-down');
                content.classList.toggle('hidden');
                if (icon) icon.classList.toggle('rotate-180');
            });
        });
    }

    // --- 5. DYNAMIC FOOTER YEAR ---
    const setupFooter = () => {
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    }

    // --- INITIALIZE ALL SITE-WIDE COMPONENTS ---
    setupModalControls();
    setupAccordion();
    setupFooter();
});
