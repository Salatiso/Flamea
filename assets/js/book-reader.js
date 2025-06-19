// This script assumes a Firebase configuration is available via main.js or a similar global setup.

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const elements = {
        titleHeader: document.getElementById('book-title-header'),
        loadingSpinner: document.getElementById('loading-spinner'),
        coverView: document.getElementById('book-cover-view'),
        coverImg: document.getElementById('book-cover-img'),
        contentContainer: document.getElementById('book-content-container'),
        bookContent: document.getElementById('book-content'),
        progressBar: document.getElementById('progress-bar'),
        pageIndicator: document.getElementById('page-indicator'),
        prevPageBtn: document.getElementById('prev-page-btn'),
        nextPageBtn: document.getElementById('next-page-btn'),
        viewSingleBtn: document.getElementById('view-single-btn'),
        viewColumnsBtn: document.getElementById('view-columns-btn'),
        fontIncBtn: document.getElementById('font-inc-btn'),
        fontDecBtn: document.getElementById('font-dec-btn'),
        fontSelect: document.getElementById('font-select'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
    };

    // --- State Management ---
    const state = {
        bookText: null,
        totalPages: 1,
        currentPage: 1,
        bookId: null,
        settings: {
            fontSize: 18,
            fontFamily: 'font-lora',
            viewMode: 'columns',
            theme: 'dark',
        }
    };

    // --- Book Database ---
    // CRITICAL FIX: The path for 'Beyond Redress' had a space in the filename which was incorrect.
    // I have corrected "BK-Beyond_ Redress.txt" to "BK-Beyond_Redress.txt".
    const bookDatabase = {
        'goliaths-reckoning': { title: "Goliath's Reckoning", path: 'assets/books/BK-Goliaths_Reckoning.txt', cover: 'assets/images/goliath.jpg' },
        'homeschooling-father': { title: "The Homeschooling Father", path: 'assets/books/BK-HomeSchooling_Father.txt', cover: 'assets/images/homeschooling_father.jpg' },
        'beyond-redress': { title: "Beyond Redress", path: 'assets/books/BK-Beyond_Redress.txt', cover: 'assets/images/redress.jpg' },
        'know-yourself': { title: "Getting to know yourself as a South African, Unravelling Xhosa History", path: 'assets/books/BK-Know_Yourself.txt', cover: 'assets/images/know_yourself.jpg' },
        'zazi-mzantsi-afrika': { title: "Zazi Mzantsi Afrika, Yazi inombo yomXhosasi Afrika", path: 'assets/books/BK-Zazi_Mzantsi_Afrika.txt', cover: 'assets/images/zazi_mzantsi_afrika.png' },
        'utata-ozifundiselayo-ekhayeni': { title: "Utata Ozifundiselayo Ekhayeni", path: 'assets/books/BK-Utata_ozifundiselayo_ekhayeni.txt', cover: 'assets/images/utata_ozifundiselayo.jpg' },
        'safety-first-essentials-for-your-ohs-career-journey': { title: "Safety First: Essentials for Your OHS Career Journey", path: 'assets/books/BK-SF_Career.txt', cover: 'assets/images/SF_Career.jpg' },
        'safety-first-the-essentials-of-ohs-plans': { title: "Safety First: The Essentials of OHS Plans", path: 'assets/books/BK-SF_Plans.txt', cover: 'assets/images/SF_Plans.jpg' }
    };

    // --- Functions ---

    const displayError = (message) => {
        console.error("Book Reader Error:", message);
        elements.loadingSpinner.style.display = 'none';
        elements.coverView.style.display = 'none';
        const content = elements.contentContainer;
        if(content){
             content.style.display = 'block';
             content.innerHTML = `<div class="p-8 text-center text-red-400"><h2>Error</h2><p>${message}</p><a href="publications.html" class="text-blue-500 underline">Return to Publications</a></div>`;
        }
    };

    const calculatePages = () => {
        if (!elements.bookContent || !elements.contentContainer || elements.contentContainer.offsetParent === null) {
            return;
        }

        if (state.settings.viewMode === 'single') {
            state.totalPages = 1;
        } else {
            const scrollWidth = elements.bookContent.scrollWidth;
            const clientWidth = elements.bookContent.clientWidth;
            state.totalPages = (clientWidth > 0) ? Math.max(1, Math.round(scrollWidth / clientWidth)) : 1;
        }
        updatePaginationUI();
    };

    const goToPage = (pageNumber) => {
        state.currentPage = Math.max(1, Math.min(pageNumber, state.totalPages));
        if (state.settings.viewMode === 'columns') {
            elements.bookContent.style.transform = `translateX(-${(state.currentPage - 1) * 100}%)`;
        }
        updatePaginationUI();
    };

    const updatePaginationUI = () => {
        if(elements.pageIndicator) elements.pageIndicator.textContent = `Page ${state.currentPage} of ${state.totalPages}`;
        if(elements.progressBar) {
             const progress = state.totalPages > 1 ? ((state.currentPage / state.totalPages)) * 100 : 100;
             elements.progressBar.style.width = `${progress}%`;
        }
        if(elements.prevPageBtn) elements.prevPageBtn.disabled = state.currentPage === 1;
        if(elements.nextPageBtn) elements.nextPageBtn.disabled = state.currentPage >= state.totalPages;
    };
    
    const applySettings = () => {
        const { bookContent, themeToggleBtn } = elements;
        const { settings } = state;
        
        bookContent.style.fontSize = `${settings.fontSize}px`;
        bookContent.className = 'book-content-text'; // Reset classes
        bookContent.classList.add(settings.fontFamily);

        if (settings.viewMode === 'single') {
            bookContent.classList.add('single-page');
            bookContent.style.transform = 'translateX(0)';
        }

        document.documentElement.className = settings.theme;
        if(themeToggleBtn) themeToggleBtn.innerHTML = settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Recalculate layout-dependent properties after a brief delay for rendering.
        setTimeout(() => {
            calculatePages();
            goToPage(state.currentPage);
        }, 150);
    };

    const startReading = () => {
        if (!state.bookText) {
            displayError('Book content has not been loaded. Cannot start reading.');
            return;
        }
        elements.coverView.style.display = 'none';
        elements.contentContainer.style.display = 'block';
        elements.bookContent.innerHTML = state.bookText.replace(/\n/g, '<br>');
        
        applySettings();
    };

    const fetchBook = async (bookData) => {
        try {
            const response = await fetch(bookData.path);
            if (!response.ok) {
                throw new Error(`File not found or network error (status: ${response.status}) for path: ${bookData.path}`);
            }
            state.bookText = await response.text();
            elements.coverView.addEventListener('click', startReading, { once: true });
        } catch (error) {
            displayError(error.message);
        }
    };
    
    const init = () => {
        // Check for essential elements first.
        if (!elements.contentContainer || !elements.coverView || !elements.loadingSpinner) {
            console.error("Essential HTML elements are missing from the page.");
            document.body.innerHTML = "Error: Page is missing key elements for the book reader to function.";
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        state.bookId = urlParams.get('book');
        const bookData = bookDatabase[state.bookId];

        if (!bookData) {
            displayError('The requested book could not be found. Please check the URL or select a book from the library.');
            return;
        }

        elements.titleHeader.textContent = bookData.title;
        elements.coverImg.src = bookData.cover;
        elements.coverImg.onerror = () => { 
            elements.coverImg.src = 'https://placehold.co/400x600/333/FFF?text=Cover+Not+Found';
            console.warn(`Cover image not found at: ${bookData.cover}`);
        };

        elements.loadingSpinner.style.display = 'none';
        elements.coverView.style.display = 'block';

        fetchBook(bookData);
    };

    // --- Event Listeners Setup ---
    const setupEventListeners = () => {
        if(elements.prevPageBtn) elements.prevPageBtn.addEventListener('click', () => goToPage(state.currentPage - 1));
        if(elements.nextPageBtn) elements.nextPageBtn.addEventListener('click', () => goToPage(state.currentPage + 1));
        window.addEventListener('resize', () => {
            calculatePages();
            goToPage(state.currentPage);
        });
        if(elements.viewSingleBtn) elements.viewSingleBtn.addEventListener('click', () => {
            state.settings.viewMode = 'single';
            applySettings();
            goToPage(1);
        });
        if(elements.viewColumnsBtn) elements.viewColumnsBtn.addEventListener('click', () => {
            state.settings.viewMode = 'columns';
            applySettings();
        });
        if(elements.fontIncBtn) elements.fontIncBtn.addEventListener('click', () => {
            state.settings.fontSize = Math.min(state.settings.fontSize + 1, 32);
            applySettings();
        });
        if(elements.fontDecBtn) elements.fontDecBtn.addEventListener('click', () => {
            state.settings.fontSize = Math.max(state.settings.fontSize - 1, 12);
            applySettings();
        });
        if(elements.fontSelect) elements.fontSelect.addEventListener('change', (e) => {
            state.settings.fontFamily = e.target.value;
            applySettings();
        });
        if(elements.themeToggleBtn) elements.themeToggleBtn.addEventListener('click', () => {
            state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
            applySettings();
        });
    };

    // --- Start Application ---
    init();
    setupEventListeners();
});
