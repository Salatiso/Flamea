document.addEventListener('DOMContentLoaded', async () => {
    // --- Basic Elements ---
    const bookTitleHeader = document.getElementById('book-title-header');
    const loadingSpinner = document.getElementById('loading-spinner');
    const bookCoverView = document.getElementById('book-cover-view');
    const bookCoverImg = document.getElementById('book-cover-img');
    const contentContainer = document.getElementById('book-content-container');
    const bookContent = document.getElementById('book-content');
    const progressBar = document.getElementById('progress-bar');
    const pageIndicator = document.getElementById('page-indicator');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    
    // --- Toolbar Elements ---
    const viewSingleBtn = document.getElementById('view-single-btn');
    const viewColumnsBtn = document.getElementById('view-columns-btn');
    const fontIncBtn = document.getElementById('font-inc-btn');
    const fontDecBtn = document.getElementById('font-dec-btn');
    const fontSelect = document.getElementById('font-select');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // --- State Variables ---
    let bookText = '';
    let totalPages = 1;
    let currentPage = 1;
    let bookId = '';
    
    const settings = {
        fontSize: 18, // in pixels
        fontFamily: 'font-lora',
        viewMode: 'columns', // 'columns' or 'single'
        theme: 'dark',
    };

    // --- Book Data ---
    const bookDatabase = {
        'goliaths-reckoning': { title: "Goliath's Reckoning", path: 'assets/books/BK-Goliaths_Reckoning.txt', cover: 'assets/images/goliath.jpg' },
        'homeschooling-father': { title: "The Homeschooling Father", path: 'assets/books/BK-HomeSchooling_Father.txt', cover: 'assets/images/homeschooling_father.jpg' },
        'beyond-redress': { title: "Beyond Redress", path: 'assets/books/BK-Beyond_Redress.txt', cover: 'assets/images/redress.jpg' },
        'know-yourself': { title: "Getting to know yourself as a South African, Unravelling Xhosa History", path: 'assets/books/BK-Know_Yourself.txt', cover: 'assets/images/know_yourself.jpg' },
        'zazi-mzantsi-afrika': { title: "Zazi Mzantsi Afrika, Yazi inombo yomXhosasi Afrika", path: 'assets/books/BK-Zazi_Mzantsi_Afrika.txt', cover: 'assets/images/zazi_mzantsi_afrika.png' },
        'utata-ozifundiselayo-ekhayeni': { title: "Utata Ozifundiselayo Ekhayeni", path: 'assets/books/BK-Utata_Ozifundiselayo_Ekhayeni.txt', cover: 'assets/images/utata_ozifundiselayo.jpg' },
        'safety-first-essentials-for-your-ohs-career-journey': { title: "Safety First: Essentials for Your OHS Career Journey", path: 'assets/books/BK-SF_Career.txt', cover: 'assets/images/SF_Career.jpg' },
        'safety-first-the-essentials-of-ohs-plans': { title: "Safety First: The Essentials of OHS Plans", path: 'assets/books/BK-SF_Plans.txt', cover: 'assets/images/SF_Plans.jpg' }
    };

    // --- CORE FUNCTIONS ---

    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        bookId = urlParams.get('book');
        console.log('Book ID:', bookId); // Debugging log
        const bookData = bookDatabase[bookId];
        console.log('Book Data:', bookData); // Debugging log

        if (!bookData) {
            displayError('Book not found.');
            return;
        }

        bookTitleHeader.textContent = bookData.title;
        bookCoverImg.src = bookData.cover;
        
        // Show cover first
        loadingSpinner.style.display = 'none';
        bookCoverView.style.display = 'block';
        
        // Add a click listener to the cover to start reading
        bookCoverView.addEventListener('click', startReading, { once: true });
        
        // Pre-fetch book content
        try {
            const response = await fetch(bookData.path);
            console.log('Fetch response:', response); // Debugging log
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            bookText = await response.text();
            console.log('Book text loaded:', bookText.substring(0, 100)); // Debugging log
        } catch (error) {
            console.error('Error fetching book content:', error);
            displayError('Could not load book text.');
        }
    }

    function startReading() {
        console.log('Starting reading with bookText:', bookText.substring(0, 100)); // Debugging log
        console.log('Book content element:', bookContent); // Debugging log
        if (!bookText) {
            displayError('Book text not loaded. Please try again.');
            return;
        }
        bookCoverView.style.display = 'none';
        contentContainer.style.display = 'block';
        bookContent.innerHTML = bookText;
        applySettings();
        calculatePages();
        goToPage(1);
    }

    function calculatePages() {
        if (settings.viewMode === 'single') {
            totalPages = 1;
        } else {
            const initialDisplay = contentContainer.style.display;
            contentContainer.style.display = 'block';
            setTimeout(() => {
                const scrollWidth = bookContent.scrollWidth;
                const clientWidth = bookContent.clientWidth;
                totalPages = Math.max(1, Math.round(scrollWidth / clientWidth));
                contentContainer.style.display = initialDisplay;
                updatePagination();
            }, 50);
        }
    }

    function goToPage(pageNumber) {
        currentPage = Math.max(1, Math.min(pageNumber, totalPages));
        if (settings.viewMode === 'columns') {
            bookContent.style.transform = `translateX(-${(currentPage - 1) * 100}%)`;
        }
        updatePagination();
    }

    function updatePagination() {
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        const progress = totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;
        progressBar.style.width = `${progress}%`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    function applySettings() {
        bookContent.style.fontSize = `${settings.fontSize}px`;
        bookContent.classList.remove('font-lora', 'font-opensans', 'font-robotoslab');
        bookContent.classList.add(settings.fontFamily);
        if (settings.viewMode === 'single') {
            bookContent.classList.add('single-page');
            bookContent.style.transform = 'translateX(0)';
        } else {
            bookContent.classList.remove('single-page');
        }
        document.documentElement.className = settings.theme;
        themeToggleBtn.innerHTML = settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        setTimeout(calculatePages, 50);
    }

    function displayError(message) {
        loadingSpinner.style.display = 'none';
        contentContainer.style.display = 'block';
        bookContent.innerHTML = `<p class="text-red-400 text-center">${message}</p>`;
    }

    // --- EVENT LISTENERS ---

    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    window.addEventListener('resize', () => {
        calculatePages();
        goToPage(currentPage);
    });

    viewSingleBtn.addEventListener('click', () => {
        settings.viewMode = 'single';
        applySettings();
        goToPage(1);
    });
    viewColumnsBtn.addEventListener('click', () => {
        settings.viewMode = 'columns';
        applySettings();
    });

    fontIncBtn.addEventListener('click', () => {
        settings.fontSize = Math.min(settings.fontSize + 1, 32);
        applySettings();
    });
    fontDecBtn.addEventListener('click', () => {
        settings.fontSize = Math.max(settings.fontSize - 1, 12);
        applySettings();
    });
    fontSelect.addEventListener('change', (e) => {
        settings.fontFamily = e.target.value;
        applySettings();
    });

    themeToggleBtn.addEventListener('click', () => {
        settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
        applySettings();
    });

    // Authentication modal (if present)
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        document.getElementById('close-auth-modal').addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    }

    // --- Start the application ---
    init();
});