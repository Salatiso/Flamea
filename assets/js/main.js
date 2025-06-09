// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- UNIFIED HEADER INJECTION ---
    const createHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // The header has a dark, semi-transparent background on scroll, so we use the 'dark' logo version
        const headerHTML = `
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <!-- START: New SVG Logo -->
                <a href="/index.html" class="flamea-logo dark">
                    <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-label="Flamea Home">
                        <text class="logo-text" x="0" y="45" font-family="Inter, sans-serif" font-size="50" font-weight="400">Flame</text>
                        <g transform="translate(135, 0)">
                            <path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"/>
                        </g>
                        <line x1="0" y1="58" x2="171" y2="58" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </a>
                <!-- END: New SVG Logo -->
                
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
    
    createHeader();

    // --- HEADER SCROLL & MOBILE MENU LOGIC (No changes needed here) ---
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
        handleScroll();
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
