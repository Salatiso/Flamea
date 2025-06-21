document.addEventListener('DOMContentLoaded', () => {
    // --- DATA ---
    const bookDatabase = {
        'goliaths-reckoning': { title: "Goliath's Reckoning", path: 'assets/books/BK-Goliaths_Reckoning.txt', cover: 'assets/images/goliath.jpg' },
        'homeschooling-father': { title: "The Homeschooling Father", path: 'assets/books/BK-HomeSchooling_Father.txt', cover: 'assets/images/homeschooling_father.jpg' },
        'beyond-redress': { title: "Beyond Redress", path: 'assets/books/BK-Beyond_Redress.txt', cover: 'assets/images/redress.jpg' },
        'know-yourself': { title: "Getting to know yourself", path: 'assets/books/BK-Know_Yourself.txt', cover: 'assets/images/know_yourself.jpg' },
        'zazi-mzantsi-afrika': { title: "Zazi Mzantsi Afrika", path: 'assets/books/BK-Zazi_Mzantsi_Afrika.txt', cover: 'assets/images/zazi_mzantsi_afrika.png' },
        'utata-ozifundiselayo-ekhayeni': { title: "Utata Ozifundiselayo Ekhayeni", path: 'assets/books/BK-Utata_ozifundiselayo_ekhayeni.txt', cover: 'assets/images/utata_ozifundiselayo.jpg' },
        'safety-first-career': { title: "Safety First: OHS Career Journey", path: 'assets/books/BK-SF_Career.txt', cover: 'assets/images/SF_Career.jpg' },
        'safety-first-plans': { title: "Safety First: The Essentials of OHS Plans", path: 'assets/books/BK-SF_Plans.txt', cover: 'assets/images/SF_Plans.jpg' }
    };

    // --- STATE ---
    const state = {
        fullText: '',
        pages: [],
        currentPageIndex: 0, // This is the index in the pages array
        viewMode: 'double', // 'double' or 'single'
        fontSize: 18,
        fontFamily: 'font-lora',
        theme: 'dark'
    };

    // --- DOM ELEMENTS ---
    const elements = {
        container: document.getElementById('reader-container'),
        titleHeader: document.getElementById('book-title-header'),
        spinner: document.getElementById('loading-spinner'),
        coverView: document.getElementById('book-cover-view'),
        coverImg: document.getElementById('book-cover-img'),
        viewport: document.getElementById('book-viewport'),
        pageLeft: document.getElementById('page-left').querySelector('.page-content'),
        pageRight: document.getElementById('page-right').querySelector('.page-content'),
        pageLeftNumber: document.getElementById('page-left').querySelector('.page-number'),
        pageRightNumber: document.getElementById('page-right').querySelector('.page-number'),
        prevBtn: document.getElementById('prev-page-btn'),
        nextBtn: document.getElementById('next-page-btn'),
        pageIndicator: document.getElementById('page-indicator'),
        progressBar: document.getElementById('progress-bar'),
        fontDecBtn: document.getElementById('font-dec-btn'),
        fontIncBtn: document.getElementById('font-inc-btn'),
        fontSizeDisplay: document.getElementById('font-size-display'),
        fontSelect: document.getElementById('font-select'),
        themeLightBtn: document.getElementById('theme-light-btn'),
        themeSepiaBtn: document.getElementById('theme-sepia-btn'),
        themeDarkBtn: document.getElementById('theme-dark-btn'),
        viewSingleBtn: document.getElementById('view-single-btn'),
        viewDoubleBtn: document.getElementById('view-double-btn'),
    };
    
    // --- CORE FUNCTIONS ---

    /**
     * The heart of the e-reader. This function takes the entire book text and intelligently
     * splits it into pages that fit perfectly within the visible area.
     */
    const paginate = () => {
        elements.spinner.style.display = 'flex';
        elements.viewport.classList.add('hidden');
        state.pages = [];
        
        // This is a necessary evil to ensure we get correct measurements
        setTimeout(() => {
            // 1. Create a hidden 'measurer' div to calculate text fit.
            const measurer = document.createElement('div');
            measurer.style.position = 'absolute';
            measurer.style.left = '-9999px'; // Move it off-screen
            measurer.style.width = elements.pageLeft.clientWidth + 'px';
            measurer.style.height = 'auto';
            measurer.style.font = `${state.fontSize}px ${window.getComputedStyle(elements.pageLeft.parentElement).fontFamily}`;
            measurer.style.lineHeight = window.getComputedStyle(elements.pageLeft.parentElement).lineHeight;
            measurer.style.textAlign = 'justify';
            measurer.style.hyphens = 'auto';
            document.body.appendChild(measurer);

            const pageHeight = elements.pageLeft.clientHeight;
            const words = state.fullText.split(/\s+/);
            let currentPageText = '';

            // 2. Iterate through all words, adding them to the measurer one by one.
            for (const word of words) {
                const testText = currentPageText ? `${currentPageText} ${word}` : word;
                measurer.textContent = testText;
                
                // 3. If adding the word makes the measurer taller than the page,
                //    the current page is full.
                if (measurer.scrollHeight > pageHeight) {
                    state.pages.push(currentPageText); // Finalize the current page
                    currentPageText = word; // The new word starts the next page
                } else {
                    currentPageText = testText; // Otherwise, keep adding to the current page
                }
            }
            state.pages.push(currentPageText); // Add the very last page

            document.body.removeChild(measurer);
            elements.spinner.style.display = 'none';
            elements.viewport.classList.remove('hidden');
            
            renderCurrentPage();
        }, 50); // A small delay allows the DOM to update styles before we measure.
    };
    
    /**
     * Renders the content of the current page(s) into the view.
     */
    const renderCurrentPage = () => {
        const isDouble = state.viewMode === 'double' && window.innerWidth > 768;
        elements.viewport.classList.toggle('single-view', !isDouble);
        
        let leftIndex = state.currentPageIndex;
        // In double-page view, the left page should always be an even index.
        if (isDouble && leftIndex % 2 !== 0) {
            leftIndex--;
        }

        elements.pageLeft.innerHTML = state.pages[leftIndex]?.replace(/\n/g, '<br>') || '';
        elements.pageRight.innerHTML = isDouble ? (state.pages[leftIndex + 1]?.replace(/\n/g, '<br>') || '') : '';

        updateUI(leftIndex, isDouble);
    };

    /**
     * Updates all UI elements like buttons, progress bar, and page numbers.
     */
    const updateUI = (currentLeftIndex, isDouble) => {
        const totalPages = state.pages.length;

        // Page Indicator Text
        const pageNumLeft = currentLeftIndex + 1;
        const pageNumRight = currentLeftIndex + 2;
        if (isDouble) {
            elements.pageIndicator.textContent = totalPages > pageNumLeft ? `Pages ${pageNumLeft} - ${pageNumRight} of ${totalPages}` : `Page ${pageNumLeft} of ${totalPages}`;
        } else {
            elements.pageIndicator.textContent = `Page ${pageNumLeft} of ${totalPages}`;
        }

        // Page Numbers on the pages themselves
        elements.pageLeftNumber.textContent = pageNumLeft;
        elements.pageRightNumber.textContent = isDouble ? pageNumRight : '';
        elements.pageRightNumber.style.display = isDouble && state.pages[pageNumRight-1] ? 'block' : 'none';


        // Progress Bar
        const progress = totalPages > 1 ? (Math.min(pageNumLeft, totalPages) / totalPages) * 100 : 100;
        elements.progressBar.style.width = `${progress}%`;

        // Button States
        elements.prevBtn.disabled = currentLeftIndex === 0;
        const nextIncrement = isDouble ? 2 : 1;
        elements.nextBtn.disabled = currentLeftIndex >= totalPages - nextIncrement;

        // Styles
        elements.container.className = `reader-container ${state.theme}`;
        [elements.pageLeft, elements.pageRight].forEach(p => {
            p.parentElement.style.fontSize = `${state.fontSize}px`;
            p.parentElement.className = `page ${state.fontFamily}`;
        });
        elements.fontSizeDisplay.textContent = `${state.fontSize}px`;
    };

    const changePage = (direction) => {
        const isDouble = state.viewMode === 'double' && window.innerWidth > 768;
        const increment = isDouble ? 2 : 1;
        
        if (direction === 'next') {
            state.currentPageIndex += increment;
        } else if (direction === 'prev') {
            state.currentPageIndex -= increment;
        }
        // Clamp the index to be within bounds
        state.currentPageIndex = Math.max(0, Math.min(state.currentPageIndex, state.pages.length - 1));
        renderCurrentPage();
    };

    // --- EVENT LISTENERS ---
    elements.nextBtn.addEventListener('click', () => changePage('next'));
    elements.prevBtn.addEventListener('click', () => changePage('prev'));

    const handleSettingChange = (repaginate = false) => {
        if (repaginate) {
            paginate();
        } else {
            renderCurrentPage();
        }
    };

    elements.fontIncBtn.addEventListener('click', () => { state.fontSize++; handleSettingChange(true); });
    elements.fontDecBtn.addEventListener('click', () => { state.fontSize--; handleSettingChange(true); });
    elements.fontSelect.addEventListener('change', (e) => { state.fontFamily = e.target.value; handleSettingChange(true); });
    
    elements.themeLightBtn.addEventListener('click', () => { state.theme = 'light'; handleSettingChange(); });
    elements.themeSepiaBtn.addEventListener('click', () => { state.theme = 'sepia'; handleSettingChange(); });
    elements.themeDarkBtn.addEventListener('click', () => { state.theme = 'dark'; handleSettingChange(); });

    elements.viewSingleBtn.addEventListener('click', () => { state.viewMode = 'single'; handleSettingChange(); });
    elements.viewDoubleBtn.addEventListener('click', () => { state.viewMode = 'double'; handleSettingChange(); });
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => handleSettingChange(true), 300);
    });
    
    elements.coverView.addEventListener('click', () => {
        elements.coverView.classList.add('hidden');
        paginate(); // First pagination happens here
    }, { once: true });


    // --- INITIALIZATION ---
    const init = async () => {
        const bookId = new URLSearchParams(window.location.search).get('book');
        const bookData = bookDatabase[bookId];

        if (!bookData) {
            elements.spinner.innerHTML = `<p class="text-red-400 text-center">Book not found. Please <a href="publications.html" class="underline">return to the library</a>.</p>`;
            return;
        }

        elements.titleHeader.textContent = bookData.title;
        
        // Show the cover first
        if (bookData.cover) {
            elements.coverImg.src = bookData.cover;
            elements.coverImg.alt = bookData.title;
            elements.coverView.classList.remove('hidden');
        } else {
            // If no cover, just start pagination
            paginate();
        }

        // Pre-fetch the book text in the background
        try {
            const response = await fetch(bookData.path);
            if (!response.ok) throw new Error('Network response was not ok');
            state.fullText = await response.text();
            // Hide main spinner once text is loaded. Pagination spinner will take over.
            elements.spinner.style.display = 'none';
        } catch (error) {
            console.error("Failed to fetch book:", error);
            elements.spinner.innerHTML = `<p class="text-red-400 text-center">Could not load book content. Please try again.</p>`;
        }
    };
    
    init();
});
