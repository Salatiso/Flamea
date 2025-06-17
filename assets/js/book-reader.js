import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bookSelect = document.getElementById('book-select');
    const bookTitleEl = document.getElementById('book-title');
    const contentContainer = document.getElementById('book-content-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumEl = document.getElementById('page-num');
    const totalPagesEl = document.getElementById('total-pages');

    // --- State Management ---
    let isUserRegistered = false;
    let pages = [];
    let currentPage = 1;
    const wordsPerPage = 350; // Adjust for comfortable reading on a page

    const bookData = {
        homeschooling: {
            title: "The Homeschooling Father",
            textFile: "assets/documents/BK-HomeSchooling_Father.txt"
        },
        reckoning: {
            title: "Goliath's Reckoning",
            textFile: "assets/documents/BK-Goliaths_Reckoning.txt"
        },
        redress: {
            title: "Beyond Redress",
            textFile: "assets/documents/BK-Beyond_Redress.txt"
        }
    };

    // --- Initialization ---

    // Listen for authentication changes to show full book or preview
    onAuthStateChanged(auth, (user) => {
        isUserRegistered = !!user;
        // Reload the current book to apply the correct view
        if (bookSelect && bookSelect.value) {
            loadBook(bookSelect.value);
        }
    });

    // Populate the dropdown menu with available books
    function populateBookSelect() {
        if (!bookSelect) return;
        for (const key in bookData) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = bookData[key].title;
            bookSelect.appendChild(option);
        }
        bookSelect.addEventListener('change', (e) => loadBook(e.target.value));
    }

    /**
     * Fetches the text for a selected book and starts the pagination process.
     * @param {string} bookKey - The key from the bookData object.
     */
    async function loadBook(bookKey) {
        if (!bookKey || !contentContainer) return;
        const book = bookData[bookKey];
        contentContainer.innerHTML = "<p class='p-4'>Loading...</p>";
        if(bookTitleEl) bookTitleEl.textContent = book.title;
        currentPage = 1;

        try {
            const response = await fetch(book.textFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const fullText = await response.text();
            paginateBook(fullText);
            displayPage();
        } catch (error) {
            console.error("Error fetching book content:", error);
            contentContainer.innerHTML = "<p class='p-4 text-red-500'>Error loading book content. Please try again.</p>";
        }
    }

    /**
     * Splits the book's full text into an array of pages.
     * @param {string} text - The full text content of the book.
     */
    function paginateBook(text) {
        const words = text.split(/\s+/);
        let tempPages = [];
        for (let i = 0; i < words.length; i += wordsPerPage) {
            tempPages.push(words.slice(i, i + wordsPerPage).join(' '));
        }

        if (!isUserRegistered) {
            // For guests, show only the first 30% of pages
            const previewPageCount = Math.ceil(tempPages.length * 0.3);
            pages = tempPages.slice(0, previewPageCount);
            
            // Add a registration prompt to the last page of the preview
            if (pages.length > 0) {
                 pages[pages.length - 1] += 
                `<br><br><div class="text-center p-4 bg-gray-200 rounded-lg border border-gray-300 mt-4">
                    <p class="font-bold text-gray-800">You've reached the end of the free preview.</p>
                    <a href="login.html" class="text-blue-600 font-bold hover:underline">Register for free</a> to read the full book and save your progress.
                </div>`;
            }
        } else {
            pages = tempPages;
        }
    }

    /**
     * Displays the content for the current page number.
     */
    function displayPage() {
        if (pages.length === 0 || !contentContainer) return;
        contentContainer.innerHTML = pages[currentPage - 1].replace(/\n/g, '<br><br>');
        contentContainer.scrollTop = 0; // Scroll to top of page
        updateNav();
    }

    /**
     * Updates the page number indicator and enables/disables navigation buttons.
     */
    function updateNav() {
        if (!pageNumEl || !totalPagesEl || !prevBtn || !nextBtn) return;
        pageNumEl.textContent = currentPage;
        totalPagesEl.textContent = pages.length;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= pages.length; // Use >= to account for preview message
    }

    // --- Event Listeners ---
    if(prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPage();
            }
        });
    }

    if(nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentPage < pages.length) {
                currentPage++;
                displayPage();
            }
        });
    }

    // --- Initial Load ---
    populateBookSelect();
    if(bookSelect) loadBook(bookSelect.value); // Load the default selected book
});
