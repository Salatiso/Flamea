// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- UNIFIED HEADER INJECTION ---
    const createHeader = () => {
        const headerContainer = document.getElementById('main-header');
        if (!headerContainer) return;

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const headerHTML = `
            <div class="container mx-auto px-6 py-3 flex justify-between items-center">
                <!-- SVG Logo -->
                <a href="/index.html" class="flamea-logo dark">
                    <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-label="Flamea Home"><text class="logo-text" x="0" y="45" font-family="Inter, sans-serif" font-size="50" font-weight="400">Flame</text><g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"/></g><line x1="0" y1="58" x2="171" y2="58" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/></svg>
                </a>
                
                <nav class="hidden md:flex space-x-4 items-center">
                    <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}"><i class="fas fa-home mr-2 opacity-80"></i>Home</a>
                    <a href="tools.html" class="nav-link ${currentPage === 'tools.html' ? 'active' : ''}"><i class="fas fa-tools mr-2 opacity-80"></i>Tools</a>
                    <button id="podcast-launch-btn" class="nav-link"><i class="fas fa-podcast mr-2 opacity-80"></i>Podcast</button>
                    <a href="community.html" class="nav-link ${currentPage === 'community.html' ? 'active' : ''}"><i class="fas fa-users mr-2 opacity-80"></i>Community</a>
                    <div id="auth-links-desktop" class="flex items-center gap-4 ml-4"></div>
                </nav>
                <button id="mobile-menu-button" class="md:hidden mobile-btn-icon text-white focus:outline-none"><ion-icon name="menu-outline" class="text-3xl"></ion-icon></button>
            </div>
            <!-- Mobile Menu Structure -->
        `;
        headerContainer.innerHTML = headerHTML;
    };
    
    // --- UNIFIED PODCAST PLAYER INJECTION ---
    const createPodcastPlayer = () => {
        const playerHTML = `
            <div id="podcast-player" class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg transform translate-y-full transition-transform duration-300 z-50">
                <div class="container mx-auto flex justify-between items-center"><h4 class="font-bold">Flamea Podcast</h4><audio id="audio-player" controls class="w-1/2"></audio><button id="close-podcast-player" class="text-2xl">&times;</button></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', playerHTML);
    };

    // --- INITIALIZE ALL COMPONENTS AND THEN ADD LISTENERS ---
    createHeader();
    createPodcastPlayer();

    // --- SETUP EVENT LISTENERS (CRITICAL: DO THIS *AFTER* ELEMENTS ARE CREATED) ---
    const podcastLaunchBtn = document.getElementById('podcast-launch-btn');
    const podcastPlayer = document.getElementById('podcast-player');
    const audioPlayer = document.getElementById('audio-player');
    const closePodcastPlayerBtn = document.getElementById('close-podcast-player');
    
    if (podcastLaunchBtn && podcastPlayer && audioPlayer && closePodcastPlayerBtn) {
        const episodeUrl = 'https://anchor.fm/s/10357aacc/podcast/play/24784748/https%3A%2F%2Fd3ctxlq1ktw2nl.cloudfront.net%2Fstaging%2F2020-12-28%2F151199395-44100-2-d10d65bde709.m4a';

        podcastLaunchBtn.addEventListener('click', () => {
            if (audioPlayer.src !== episodeUrl) {
                audioPlayer.src = episodeUrl;
            }
            podcastPlayer.classList.remove('translate-y-full');
            audioPlayer.play();
        });

        closePodcastPlayerBtn.addEventListener('click', () => {
            podcastPlayer.classList.add('translate-y-full');
            audioPlayer.pause();
        });
    }

    // Mobile menu and other logic...
});
