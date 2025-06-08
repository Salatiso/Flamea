// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- UNIFIED HEADER INJECTION ---
    // This function builds and injects the header into any page that has a <header id="main-header"> element.
    const createHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return; // Don't run if there's no header element on the page

        // Determine the active page to highlight the correct nav link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const headerHTML = `
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="index.html" class="logo-text text-xl md:text-2xl font-bold font-roboto text-white transition-colors duration-300">
                    Flame<span class="text-green-400">a›</span>
                </a>
                <nav class="hidden md:flex space-x-4 items-center">
                    <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}"><i class="fas fa-home mr-2 opacity-80"></i>Home</a>
                    <a href="tools.html" class="nav-link ${currentPage === 'tools.html' || currentPage === 'parenting-plan.html' || currentPage === 'journal.html' || currentPage === 'locator.html' ? 'active' : ''}"><i class="fas fa-tools mr-2 opacity-80"></i>Tools</a>
                    <a href="about.html" class="nav-link ${currentPage === 'about.html' ? 'active' : ''}"><i class="fas fa-info-circle mr-2 opacity-80"></i>About Us</a>
                    <a href="community.html" class="nav-link ${currentPage === 'community.html' ? 'active' : ''}"><i class="fas fa-users mr-2 opacity-80"></i>Community</a>
                    <div id="auth-links-desktop" class="flex items-center gap-4 ml-4">
                        <!-- Auth buttons will be inserted here by auth.js -->
                    </div>
                </nav>
                <button id="mobile-menu-button" class="md:hidden mobile-btn-icon text-white focus:outline-none transition-colors duration-300">
                    <ion-icon name="menu-outline" class="text-3xl"></ion-icon>
                </button>
            </div>
            <div id="mobile-menu" class="hidden md:hidden bg-white shadow-lg py-2 absolute w-full left-0 top-full">
                <a href="index.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Home</a>
                <a href="tools.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Tools</a>
                <a href="about.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">About Us</a>
                <a href="community.html" class="block px-6 py-3 text-gray-700 hover:bg-gray-100 font-semibold">Community</a>
                <div id="auth-links-mobile" class="px-6 py-3"></div>
            </div>
        `;
        headerContainer.innerHTML = headerHTML;
    };
    
    createHeader(); // Build the header as soon as the DOM is ready

    // --- HEADER SCROLL & MOBILE MENU LOGIC ---
    // This logic now finds the elements created by createHeader()
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
        handleScroll(); // Run on page load to set initial state correctly
    }
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const mobileMenuIcon = mobileMenuButton.querySelector('ion-icon');
            mobileMenuIcon.setAttribute('name', mobileMenu.classList.contains('hidden') ? 'menu-outline' : 'close-outline');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => { mobileMenu.classList.add('hidden'); });
        });
    }

    // --- OTHER GLOBAL SCRIPTS ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
