// This script assumes a Firebase configuration is available via main.js or a similar global setup.

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const elements = {
        titleHeader: document.getElementById('book-title-header'),
        loadingSpinner: document.getElementById('loading-spinner'),
        coverView: document.getElementById('book-cover-view'),
        coverImg: document.getElementById('book-cover-img'),
        contentContainer: document.getElementById('book-content-container'),
        bookContent: document.getElementById('book-content'), // This will be our main viewport
        progressBar: document.getElementById('progress-bar'),
        pageIndicator: document.getElementById('page-indicator'),
        prevPageBtn: document.getElementById('prev-page-btn'),
        nextPageBtn: document.getElementById('next-page-btn'),
        viewSingleBtn: document.getElementById('view-single-btn'),
        viewColumnsBtn: document.getElementById('view-columns-btn'), // Represents "Two Page" view
        fontIncBtn: document.getElementById('font-inc-btn'),
        fontDecBtn: document.getElementById('font-dec-btn'),
        fontSelect: document.getElementById('font-select'),
        themeToggleBtn: document.getElementById('theme-toggle-btn'),
    };

    // --- State Management ---
    const state = {
        bookText: null,
        pages: [], // We will split the book text into an array of pages
        totalPages: 1,
        currentPage: 0, // Use 0-based index for pages array
        bookId: null,
        settings: {
            fontSize: 18,
            fontFamily: 'font-lora',
            // Default view mode. 'double' for two-page spread, 'single' for one page.
            viewMode: window.innerWidth > 768 ? 'double' : 'single',
            theme: 'dark',
        }
    };

    // --- Book Database ---
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
        if (content) {
            content.style.display = 'block';
            content.innerHTML = `<div class="p-8 text-center text-red-400"><h2>Error</h2><p>${message}</p><a href="publications.html" class="text-blue-500 underline">Return to Publications</a></div>`;
        }
    };

    /**
     * Splits the book's text into pages and populates the state.pages array.
     * This is a simplified pagination based on character count.
     */
    const paginateText = () => {
        const charsPerPage = 2000; // Adjust this value to fit more or less text per page
        const text = state.bookText;
        state.pages = [];
        if (!text) return;

        for (let i = 0; i < text.length; i += charsPerPage) {
            state.pages.push(text.substring(i, i + charsPerPage));
        }
        state.totalPages = state.pages.length;
    };
    
    /**
     * Renders the current page(s) into the DOM with a fade effect.
     */
    const renderCurrentPages = () => {
        if (state.pages.length === 0) return;

        const content = elements.bookContent;
        
        // Add fade-out effect
        content.style.opacity = 0;

        setTimeout(() => {
            // After fade-out, update the content
            let newHtml = '';
            const pageNum = state.currentPage; // Current page index
            
            if (state.settings.viewMode === 'double' && window.innerWidth > 768) {
                content.className = 'book-spread'; // Use the class from your CSS
                // Ensure the left page is always even, right is odd. Start with page 0 as a blank cover inside.
                const leftPageNum = (pageNum % 2 === 0) ? pageNum : pageNum -1;
                const rightPageNum = leftPageNum + 1;

                const leftPageContent = state.pages[leftPageNum] ? state.pages[leftPageNum].replace(/\n/g, '<br>') : '';
                const rightPageContent = state.pages[rightPageNum] ? state.pages[rightPageNum].replace(/\n/g, '<br>') : '';

                newHtml = `
                    <div class="book-page"><div class="page-content">${leftPageContent}</div><div class="page-number">${leftPageNum + 1}</div></div>
                    <div class="book-page"><div class="page-content">${rightPageContent}</div><div class="page-number">${rightPageNum + 1}</div></div>
                `;

            } else {
                // Single page view
                content.className = 'book-spread single-view';
                const pageContent = state.pages[pageNum].replace(/\n/g, '<br>');
                newHtml = `<div class="book-page"><div class="page-content">${pageContent}</div><div class="page-number">${pageNum + 1}</div></div>`;
            }
            content.innerHTML = newHtml;

            // Fade back in
            content.style.opacity = 1;

            updatePaginationUI();
        }, 200); // This duration should match the CSS transition
    };
    
    const goToPage = (pageIndex) => {
        const increment = (state.settings.viewMode === 'double' && window.innerWidth > 768) ? 2 : 1;
        
        if (pageIndex === 'next') {
            state.currentPage = Math.min(state.currentPage + increment, state.totalPages - 1);
        } else if (pageIndex === 'prev') {
            state.currentPage = Math.max(state.currentPage - increment, 0);
        } else {
            state.currentPage = pageIndex;
        }
        renderCurrentPages();
    };

    const updatePaginationUI = () => {
        if(elements.pageIndicator) elements.pageIndicator.textContent = `Page ${state.currentPage + 1} of ${state.totalPages}`;
        if(elements.progressBar) {
             const progress = state.totalPages > 1 ? ((state.currentPage + 1) / state.totalPages) * 100 : 100;
             elements.progressBar.style.width = `${progress}%`;
        }
        if(elements.prevPageBtn) elements.prevPageBtn.disabled = state.currentPage === 0;
        if(elements.nextPageBtn) elements.nextPageBtn.disabled = state.currentPage >= state.totalPages - 1;
    };
    
    const applySettings = () => {
        const { contentContainer } = elements;
        const { settings } = state;
        
        contentContainer.style.fontSize = `${settings.fontSize}px`;
        contentContainer.className = 'book-content-container'; // Reset classes
        contentContainer.classList.add(settings.fontFamily);

        document.documentElement.className = settings.theme;
        if(elements.themeToggleBtn) elements.themeToggleBtn.innerHTML = settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Re-render the pages with the new settings
        renderCurrentPages();
    };

    const startReading = () => {
        if (!state.bookText) {
            displayError('Book content has not been loaded. Cannot start reading.');
            return;
        }
        paginateText();
        elements.coverView.style.display = 'none';
        elements.contentContainer.style.display = 'block';
        elements.bookContent.style.transition = 'opacity 0.2s ease-in-out'; // Add transition for fade effect
        
        applySettings();
        goToPage(0); // Go to the first page
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

    const setupEventListeners = () => {
        if(elements.prevPageBtn) elements.prevPageBtn.addEventListener('click', () => goToPage('prev'));
        if(elements.nextPageBtn) elements.nextPageBtn.addEventListener('click', () => goToPage('next'));
        
        window.addEventListener('resize', () => {
            // Adjust view mode on resize
            const newMode = window.innerWidth > 768 ? 'double' : 'single';
            if (newMode !== state.settings.viewMode) {
                state.settings.viewMode = newMode;
                renderCurrentPages();
            }
        });

        // Toolbar Buttons
        if(elements.viewSingleBtn) elements.viewSingleBtn.addEventListener('click', () => {
            state.settings.viewMode = 'single';
            applySettings();
        });
        if(elements.viewColumnsBtn) elements.viewColumnsBtn.addEventListener('click', () => {
            state.settings.viewMode = 'double';
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
