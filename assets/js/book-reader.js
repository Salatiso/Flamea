// This script assumes a Firebase configuration is available via main.js or a similar global setup.
// For now, it will use localStorage and alert for non-logged-in users.

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
    
    // --- New Column Control Elements ---
    const columnControlContainer = document.createElement('div');
    columnControlContainer.className = 'flex items-center gap-2 ml-4';
    columnControlContainer.innerHTML = `
        <label class="text-sm font-medium">Columns:</label>
        <select id="column-select" class="px-2 py-1 rounded border bg-white dark:bg-gray-800 dark:border-gray-600 text-sm">
            <option value="1">1 Column</option>
            <option value="2" selected>2 Columns</option>
        </select>
    `;
    
    // Insert column control after view mode buttons
    viewColumnsBtn.parentNode.insertBefore(columnControlContainer, viewColumnsBtn.nextSibling);
    const columnSelect = document.getElementById('column-select');
    
    // --- State Variables ---
    let bookText = '';
    let bookPages = []; // Store individual pages of text
    let totalPages = 1;
    let currentPage = 1;
    let bookId = '';
    
    const settings = {
        fontSize: 18, // in pixels
        fontFamily: 'font-lora',
        viewMode: 'columns', // 'columns' or 'single'
        columnsPerView: 2, // Number of columns to display
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

    /**
     * Initializes the reader by getting book ID from URL and loading data.
     */
    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        bookId = urlParams.get('book');
        const bookData = bookDatabase[bookId];

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
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            bookText = await response.text();
        } catch (error) {
            console.error('Error fetching book content:', error);
            displayError('Could not load book text.');
        }
        
        // Auto-detect orientation and set default columns
        updateColumnsBasedOnOrientation();
        window.addEventListener('orientationchange', () => {
            setTimeout(updateColumnsBasedOnOrientation, 100);
        });
        window.addEventListener('resize', updateColumnsBasedOnOrientation);
    }

    /**
     * Updates column count based on screen orientation
     */
    function updateColumnsBasedOnOrientation() {
        const isPortrait = window.innerHeight > window.innerWidth;
        const newColumns = isPortrait ? 1 : 2;
        
        settings.columnsPerView = newColumns;
        columnSelect.value = newColumns.toString();
        
        if (bookPages.length > 0) {
            applySettings();
        }
    }

    /**
     * Hides cover and shows the paginated text content.
     */
    function startReading() {
        bookCoverView.style.display = 'none';
        contentContainer.style.display = 'block';
        paginateText();
        applySettings();
        goToPage(1);
    }

    /**
     * Splits the book text into pages based on container height and column settings
     */
    function paginateText() {
        bookPages = [];
        
        // Create temporary container to measure text
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.height = `${bookContent.clientHeight}px`;
        tempContainer.style.width = `${bookContent.clientWidth / settings.columnsPerView}px`;
        tempContainer.style.fontSize = `${settings.fontSize}px`;
        tempContainer.className = bookContent.className;
        document.body.appendChild(tempContainer);

        // Split text into paragraphs
        const paragraphs = bookText.split('\n\n').filter(p => p.trim());
        let currentPageContent = '';
        let pageIndex = 0;

        for (let i = 0; i < paragraphs.length; i++) {
            const testContent = currentPageContent + (currentPageContent ? '\n\n' : '') + paragraphs[i];
            tempContainer.innerHTML = testContent.replace(/\n/g, '<br>');
            
            if (tempContainer.scrollHeight > tempContainer.clientHeight && currentPageContent) {
                // Current page is full, save it and start new page
                bookPages[pageIndex] = currentPageContent;
                pageIndex++;
                currentPageContent = paragraphs[i];
            } else {
                currentPageContent = testContent;
            }
        }
        
        // Add the last page
        if (currentPageContent) {
            bookPages[pageIndex] = currentPageContent;
        }

        document.body.removeChild(tempContainer);
        totalPages = Math.ceil(bookPages.length / settings.columnsPerView);
        updatePagination();
    }
    
    /**
     * Navigates to a specific page with smooth page-turning effect.
     */
    function goToPage(pageNumber) {
        const oldPage = currentPage;
        currentPage = Math.max(1, Math.min(pageNumber, totalPages));
        
        if (oldPage !== currentPage) {
            // Add page turning effect
            bookContent.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            bookContent.style.opacity = '0.8';
            
            setTimeout(() => {
                renderCurrentPage();
                bookContent.style.opacity = '1';
                setTimeout(() => {
                    bookContent.style.transition = '';
                }, 100);
            }, 300);
        } else {
            renderCurrentPage();
        }
        
        updatePagination();
    }

    /**
     * Renders the current page content based on column settings
     */
    function renderCurrentPage() {
        if (settings.viewMode === 'single') {
            bookContent.innerHTML = bookText.replace(/\n/g, '<br>');
            return;
        }

        const startPageIndex = (currentPage - 1) * settings.columnsPerView;
        let html = '<div class="book-spread flex h-full">';
        
        for (let i = 0; i < settings.columnsPerView; i++) {
            const pageIndex = startPageIndex + i;
            const pageContent = pageIndex < bookPages.length ? bookPages[pageIndex] : '';
            
            html += `
                <div class="book-page flex-1 px-8 py-6 ${i > 0 ? 'border-l border-gray-300 dark:border-gray-600' : ''}">
                    <div class="page-content h-full overflow-hidden">
                        ${pageContent.replace(/\n/g, '<br>')}
                    </div>
                    ${pageContent ? `<div class="page-number text-center text-sm text-gray-500 dark:text-gray-400 mt-4">${pageIndex + 1}</div>` : ''}
                </div>
            `;
        }
        
        html += '</div>';
        bookContent.innerHTML = html;
    }

    /**
     * Updates the progress bar and page indicator text.
     */
    function updatePagination() {
        const startPage = (currentPage - 1) * settings.columnsPerView + 1;
        const endPage = Math.min(startPage + settings.columnsPerView - 1, bookPages.length);
        
        if (settings.viewMode === 'single') {
            pageIndicator.textContent = `Page 1 of 1`;
        } else {
            if (settings.columnsPerView === 1) {
                pageIndicator.textContent = `Page ${startPage} of ${bookPages.length}`;
            } else {
                pageIndicator.textContent = `Pages ${startPage}-${endPage} of ${bookPages.length}`;
            }
        }
        
        const progress = totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 100;
        progressBar.style.width = `${progress}%`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    /**
     * Applies all current settings (font, view mode) to the content.
     */
    function applySettings() {
        // Font size
        bookContent.style.fontSize = `${settings.fontSize}px`;
        
        // Font family
        bookContent.classList.remove('font-lora', 'font-opensans', 'font-robotoslab');
        bookContent.classList.add(settings.fontFamily);

        // Theme
        document.documentElement.className = settings.theme;
        themeToggleBtn.innerHTML = settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        // Re-paginate and render if text is loaded
        if (bookText && settings.viewMode === 'columns') {
            paginateText();
            renderCurrentPage();
        } else if (bookText && settings.viewMode === 'single') {
            bookContent.innerHTML = bookText.replace(/\n/g, '<br>');
            totalPages = 1;
            currentPage = 1;
            updatePagination();
        }
    }
    
    /**
     * Displays an error message in the reader.
     */
    function displayError(message) {
        loadingSpinner.style.display = 'none';
        contentContainer.style.display = 'block';
        bookContent.innerHTML = `<p class="text-red-400 text-center">${message}</p>`;
    }

    // --- EVENT LISTENERS ---
    
    // Navigation
    prevPageBtn.addEventListener('click', () => goToPage(currentPage - 1));
    nextPageBtn.addEventListener('click', () => goToPage(currentPage + 1));
    
    // Keyboard navigation for page turning
    document.addEventListener('keydown', (e) => {
        if (contentContainer.style.display !== 'block') return;
        
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            e.preventDefault();
            goToPage(currentPage + 1);
        }
    });

    window.addEventListener('resize', () => {
        if (bookText && settings.viewMode === 'columns') {
            setTimeout(() => {
                paginateText();
                renderCurrentPage();
            }, 100);
        }
    });

    // Toolbar
    viewSingleBtn.addEventListener('click', () => {
        settings.viewMode = 'single';
        applySettings();
        goToPage(1);
    });
    
    viewColumnsBtn.addEventListener('click', () => {
        settings.viewMode = 'columns';
        applySettings();
    });

    // Column selection
    columnSelect.addEventListener('change', (e) => {
        settings.columnsPerView = parseInt(e.target.value);
        if (settings.viewMode === 'columns') {
            applySettings();
            goToPage(1); // Reset to first page when changing columns
        }
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

    // Authentication modal
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        document.getElementById('close-auth-modal').addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    }
    
    // --- Start the application ---
    init();
});
