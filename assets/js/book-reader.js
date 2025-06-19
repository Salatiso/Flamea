document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Element Selection ---
    // Get references to all the necessary elements in the book-reader.html file.
    const bookContentEl = document.getElementById('book-content');
    const bookTitleEl = document.getElementById('book-title');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumSpan = document.getElementById('page-num');
    const totalPagesSpan = document.getElementById('total-pages');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const fontDisplay = document.getElementById('font-display');

    // --- State Variables ---
    // Initialize variables to hold the book's content and manage pagination.
    let fullBookContent = '';
    let currentPage = 1;
    let totalPages = 0;
    const charsPerPage = 2500; // The number of characters to display on each page.

    /**
     * Retrieves a URL query parameter by its name.
     * This is used to figure out which book to load based on the URL.
     * e.g., book-reader.html?book=BK-Know_Yourself.txt
     * @param {string} param - The name of the parameter to get.
     * @returns {string|null} The value of the parameter, or null if not found.
     */
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Displays a specific page of the book.
     * It calculates the part of the text to show and updates the HTML.
     * @param {number} page - The page number to display.
     */
    function displayPage(page) {
        if (!fullBookContent) return;
        const start = (page - 1) * charsPerPage;
        const end = start + charsPerPage;
        // Extract the text for the current page and format it by replacing newlines with <br> tags.
        const pageText = fullBookContent.substring(start, end).replace(/\n/g, '<br>');
        bookContentEl.innerHTML = `<div class="prose max-w-none">${pageText}</div>`;
        pageNumSpan.textContent = page;
        window.scrollTo(0, 0); // Scroll to the top of the page on page turn.
        updatePaginationButtons();
    }

    /**
     * Updates the state of the 'Previous' and 'Next' buttons.
     * It disables the buttons when the user is on the first or last page.
     */
    function updatePaginationButtons() {
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        // Apply different styles for enabled/disabled states
        prevPageBtn.classList.toggle('opacity-50', prevPageBtn.disabled);
        prevPageBtn.classList.toggle('cursor-not-allowed', prevPageBtn.disabled);
        nextPageBtn.classList.toggle('opacity-50', nextPageBtn.disabled);
        nextPageBtn.classList.toggle('cursor-not-allowed', nextPageBtn.disabled);
    }

    /**
     * Updates the font size of the book content based on the slider.
     */
    function updateFontSize() {
        const fontSize = fontSizeSlider.value;
        bookContentEl.style.fontSize = `${fontSize}px`;
        fontDisplay.textContent = `${fontSize}px`;
    }

    // --- Main Logic ---
    // Get the book file name from the URL.
    const bookFile = getQueryParam('book');

    if (bookFile) {
        // If a book file is specified in the URL, fetch and load it.
        const bookPath = `assets/books/${bookFile}`;
        fetch(bookPath)
            .then(response => {
                if (!response.ok) {
                    // If the book file can't be found or another error occurs.
                    throw new Error(`Network response was not ok. Could not load ${bookPath}`);
                }
                return response.text();
            })
            .then(text => {
                // --- Book Loaded Successfully ---
                fullBookContent = text;
                totalPages = Math.ceil(fullBookContent.length / charsPerPage);
                
                // Set the book title in the H1 tag
                const formattedTitle = bookFile.replace(/_/g, ' ').replace('.txt', '').replace('BK-', '');
                bookTitleEl.textContent = formattedTitle;
                
                // Display the first page and update pagination info.
                totalPagesSpan.textContent = totalPages;
                displayPage(currentPage);
            })
            .catch(error => {
                // --- Error Handling ---
                console.error('Error fetching book:', error);
                bookContentEl.innerHTML = `<p class="text-red-500 text-center">We're sorry, but the book could not be loaded. Please ensure you have selected a valid book from the <a href="publications.html" class="font-bold">Publications</a> page.</p>`;
                bookTitleEl.textContent = 'Error';
            });
    } else {
        // --- No Book Specified ---
        // If the URL doesn't specify a book, show a message prompting the user.
        // This was the line with the syntax error. Corrected to use double quotes.
        bookTitleEl.textContent = 'No Book Selected';
        bookContentEl.innerHTML = "<p class='text-center'>It looks like you're trying to access the reader directly. Please go back to the <a href='publications.html' class='font-bold text-blue-600 hover:underline'>Publications</a> page and select a book to read.</p>";
    }

    // --- Event Listeners ---
    // Set up click events for the pagination buttons.
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
        }
    });

    // Set up the event listener for the font size slider.
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', updateFontSize);
        // Set initial font size display
        fontDisplay.textContent = `${fontSizeSlider.value}px`;
    }
});
