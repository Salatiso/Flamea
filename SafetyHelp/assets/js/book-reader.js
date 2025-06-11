/**
 * @file book-reader.js
 * This script powers the book reader functionality on the FLAMEA website.
 * It fetches book content, handles pagination, and manages UI elements
 * for an interactive reading experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. GET DOM ELEMENTS ---
    // Get all necessary elements from the book-reader.html page.
    const bookTitleEl = document.getElementById('book-title');
    const chapterTitleEl = document.getElementById('chapter-title');
    const contentContainer = document.getElementById('book-content-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumEl = document.getElementById('page-num');
    const totalPagesEl = document.getElementById('total-pages');
    const printExcerptBtn = document.getElementById('print-excerpt-btn');
    const printableExcerptContainer = document.getElementById('printable-excerpt');

    // --- 2. DEFINE STATE AND METADATA ---
    // These variables will hold the book's data and current reading state.
    let fullText = '';
    let pages = [];
    let currentPage = 1;
    // This determines how many characters fit on a page. You can adjust this value.
    const CHARS_PER_PAGE = 2200; 

    // A map to link book IDs from the URL to their title and file path.
    // Ensure the file paths are correct.
    const bookData = {
        'BK-Goliaths_Reckoning': {
            title: "Goliath's Reckoning",
            path: 'assets/documents/BK-Goliaths_Reckoning.txt'
        },
        'BK-Beyond_ Redress': {
            title: 'Beyond Redress',
            path: 'assets/documents/BK-Beyond_ Redress.txt'
        },
        'BK-HomeSchooling_Father': {
            title: 'The Homeschooling Father',
            path: 'assets/documents/BK-HomeSchooling_Father.txt'
        }
    };

    // --- 3. INITIALIZE THE READER ---
    // Get the book ID from the URL (e.g., ...?book=BK-Goliaths_Reckoning)
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('book');
    const currentBook = bookData[bookId];

    if (currentBook) {
        // If the book ID is valid, load its content.
        loadBook(currentBook);
    } else {
        // If the book ID is missing or invalid, show an error.
        displayError('The requested book could not be found. Please return to the publications page and try again.');
    }

    // --- 4. CORE FUNCTIONS ---

    /**
     * Fetches and loads the book content from the server.
     * @param {object} book - The book object from bookData.
     */
    async function loadBook(book) {
        // Update the main titles on the page.
        bookTitleEl.textContent = "FLAMEA Library";
        chapterTitleEl.textContent = book.title;

        try {
            // Fetch the text file.
            const response = await fetch(book.path);
            if (!response.ok) {
                // If the file is not found or another error occurs.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fullText = await response.text();
            
            // Paginate and render the first page.
            paginate(fullText);
            renderPage(currentPage);
            updateUI();

        } catch (error) {
            console.error('Error loading book:', error);
            displayError('Could not load the book content. Please ensure the file exists at the specified path and the server is running.');
        }
    }

    /**
     * Splits the full text into an array of pages.
     * @param {string} text - The full text content of the book.
     */
    function paginate(text) {
        pages = [];
        if (!text) return;
        // Create an array of pages based on the character limit.
        for (let i = 0; i < text.length; i += CHARS_PER_PAGE) {
            pages.push(text.substring(i, i + CHARS_PER_PAGE));
        }
        if (pages.length === 0) {
            pages.push("This book has no content.");
        }
    }

    /**
     * Renders the content for the currently selected page.
     * @param {number} pageNumber - The page to display.
     */
    function renderPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > pages.length) {
            return; // Invalid page number
        }
        // Format text: replace newline characters with HTML line breaks for proper paragraph spacing.
        const pageContent = pages[pageNumber - 1].replace(/\n/g, '<br><br>');
        // Using Tailwind's 'prose' class for beautiful typography.
        contentContainer.innerHTML = `<div class="prose max-w-none prose-lg prose-invert">${pageContent}</div>`;
    }

    /**
     * Updates the page counter and enables/disables navigation buttons.
     */
    function updateUI() {
        pageNumEl.textContent = currentPage;
        totalPagesEl.textContent = pages.length;

        // Disable 'Previous' on the first page, and 'Next' on the last page.
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === pages.length;
    }
    
    /**
     * Displays an error message in the content area.
     * @param {string} message - The error message to show the user.
     */
    function displayError(message) {
        chapterTitleEl.textContent = "Error";
        contentContainer.innerHTML = `<p class="text-red-400 text-center p-8">${message}</p>`;
        // Disable all controls.
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        printExcerptBtn.classList.add('hidden');
    }

    // --- 5. EVENT LISTENERS ---

    // Go to the previous page.
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            updateUI();
            contentContainer.scrollTop = 0; // Scroll to top of the new page.
        }
    });

    // Go to the next page.
    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length) {
            currentPage++;
            renderPage(currentPage);
            updateUI();
            contentContainer.scrollTop = 0; // Scroll to top of the new page.
        }
    });
    
    // Show the 'Print Excerpt' button only when text is selected.
    document.addEventListener('mouseup', () => {
        const selection = window.getSelection().toString().trim();
        if (selection.length > 10) { // Require a minimum selection length
            printExcerptBtn.classList.remove('hidden');
        } else {
            printExcerptBtn.classList.add('hidden');
        }
    });

    // Handle the printing of the selected excerpt.
    printExcerptBtn.addEventListener('click', () => {
        const selection = window.getSelection().toString();
        if (selection.length > 0) {
            // Populate the hidden printable div with the selection.
            printableExcerptContainer.innerHTML = `<h1>Excerpt from ${currentBook.title}</h1><hr><p>${selection.replace(/\n/g, '<br>')}</p>`;
            // Trigger the browser's print dialog.
            window.print();
        }
    });
});
