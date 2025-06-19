<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flamea Book Reader</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&family=Lora:ital,wght@0,400..700;1,400..700&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <style>
        body { overflow: hidden; }
        .reader-container {
            display: grid;
            grid-template-rows: auto 1fr auto;
            height: 100vh;
            background-color: #1a202c;
        }
        #reader-main {
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #book-content {
            column-width: 350px;
            column-gap: 40px;
            column-rule: 1px solid #4a5568;
            height: 100%;
            padding: 2rem;
            text-align: justify;
            transition: all 0.3s ease;
        }
        #book-content p { margin-bottom: 1em; }
        #book-content.single-page {
            column-width: auto;
            max-width: 800px;
        }
        .font-lora { font-family: 'Lora', serif; }
        .font-opensans { font-family: 'Open Sans', sans-serif; }
        .font-robotoslab { font-family: 'Roboto Slab', serif; }
        ::selection { background: #fde047; color: #1a202c; }
    </style>
</head>
<body class="bg-gray-800 text-gray-300">
    <div class="reader-container">
        <!-- HEADER / TOOLBAR -->
        <header class="bg-gray-900/80 backdrop-blur-sm p-3 flex justify-between items-center shadow-lg border-b border-gray-700 z-20">
            <a href="publications.html" class="text-gray-300 hover:text-white transition-colors"><i class="fas fa-arrow-left mr-2"></i>Back to Library</a>
            <h1 id="book-title-header" class="text-lg font-bold text-white">Loading...</h1>
            <div class="flex items-center gap-3">
                <!-- View Modes -->
                <button id="view-single-btn" title="Single Page View" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-file-alt"></i></button>
                <button id="view-columns-btn" title="Book View" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-book-open"></i></button>
                <div class="border-l border-gray-600 h-6"></div>
                <!-- Font Controls -->
                <button id="font-dec-btn" title="Decrease Font Size" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-font" style="font-size: 0.8em;"></i>-</button>
                <button id="font-inc-btn" title="Increase Font Size" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-font" style="font-size: 0.8em;"></i>+</button>
                <select id="font-select" class="bg-gray-700 border-gray-600 rounded p-1 text-sm">
                    <option value="font-lora">Lora (Serif)</option>
                    <option value="font-opensans">Open Sans</option>
                    <option value="font-robotoslab">Roboto Slab</option>
                </select>
                <!-- Theme -->
                <button id="theme-toggle-btn" title="Toggle Light/Dark Mode" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-moon"></i></button>
            </div>
        </header>

        <!-- MAIN READER AREA -->
        <main id="reader-main">
            <div id="loading-spinner" class="text-center">
                <i class="fas fa-spinner fa-spin text-5xl text-yellow-400"></i>
                <p class="mt-4 text-lg">Loading your book...</p>
            </div>
            <div id="book-cover-view" class="hidden">
                 <img id="book-cover-img" src="" alt="Book Cover" class="max-h-[80vh] rounded-lg shadow-2xl">
            </div>
            <div id="book-content-container" class="hidden h-full w-full overflow-y-auto">
                <div id="book-content" class="font-lora text-lg leading-relaxed">
                    <!-- Book text will be injected here -->
                </div>
            </div>
        </main>
        
        <!-- FOOTER / PROGRESS BAR -->
        <footer class="bg-gray-900 p-2 text-center text-sm z-10 border-t border-gray-700">
             <div class="flex items-center justify-between max-w-4xl mx-auto">
                 <button id="prev-page-btn" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-chevron-left"></i></button>
                 <div class="flex-grow mx-4">
                     <span id="page-indicator">Page 1 of 1</span>
                     <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
                         <div id="progress-bar" class="bg-yellow-400 h-2 rounded-full" style="width: 0%;"></div>
                     </div>
                 </div>
                 <button id="next-page-btn" class="p-2 rounded hover:bg-gray-700"><i class="fas fa-chevron-right"></i></button>
             </div>
        </footer>
    </div>
    
    <!-- Modals and Popups -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
        <div class="bg-gray-800 p-8 rounded-lg text-center max-w-md w-full border border-yellow-500 shadow-xl">
            <h2 class="text-2xl font-bold text-yellow-400 mb-4">Save Your Progress</h2>
            <p class="text-gray-300 mb-6">To save your notes, highlights, and bookmarks permanently, please register for a free account or log in.</p>
            <div class="flex justify-center gap-4">
                <a href="login.html" class="py-2 px-6 rounded-lg bg-green-600 text-white hover:bg-green-700">Login / Register</a>
                <button id="close-auth-modal" class="py-2 px-6 rounded-lg bg-gray-600 hover:bg-gray-500">Continue without saving</button>
            </div>
        </div>
    </div>

    <script>
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

            // --- Book Data (FIXED: Added missing commas) ---
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
            }

            /**
             * Hides cover and shows the paginated text content.
             */
            function startReading() {
                bookCoverView.style.display = 'none';
                contentContainer.style.display = 'block';
                bookContent.innerHTML = bookText; // Load full text
                applySettings();
                calculatePages();
                goToPage(1);
            }

            /**
             * Calculates total pages based on scroll width and client width.
             */
            function calculatePages() {
                if (settings.viewMode === 'single') {
                    totalPages = 1;
                } else {
                     // Ensure content is visible to measure
                    const initialDisplay = contentContainer.style.display;
                    contentContainer.style.display = 'block';

                    const scrollWidth = bookContent.scrollWidth;
                    const clientWidth = bookContent.clientWidth;
                    totalPages = Math.max(1, Math.round(scrollWidth / clientWidth));
                    
                    contentContainer.style.display = initialDisplay;
                }
                updatePagination();
            }
            
            /**
             * Navigates to a specific page.
             */
            function goToPage(pageNumber) {
                currentPage = Math.max(1, Math.min(pageNumber, totalPages));
                if (settings.viewMode === 'columns') {
                     bookContent.style.transform = `translateX(-${(currentPage - 1) * 100}%)`;
                }
                updatePagination();
            }

            /**
             * Updates the progress bar and page indicator text.
             */
            function updatePagination() {
                pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
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

                // View mode
                if (settings.viewMode === 'single') {
                    bookContent.classList.add('single-page');
                    bookContent.style.transform = 'translateX(0)';
                } else {
                    bookContent.classList.remove('single-page');
                }
                
                // Theme
                document.documentElement.className = settings.theme;
                themeToggleBtn.innerHTML = settings.theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

                // Recalculate pages as settings change layout
                setTimeout(calculatePages, 50);
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
            window.addEventListener('resize', () => {
                calculatePages();
                goToPage(currentPage);
            });

            // Toolbar
            viewSingleBtn.addEventListener('click', () => {
                settings.viewMode = 'single';
                applySettings();
                goToPage(1); // Reset to first page in single view
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
    </script>
</body>
</html>