// assets/js/book-reader.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const bookSelect = document.getElementById('book-select');
    const bookCover = document.getElementById('book-cover');
    const bookTitle = document.getElementById('book-title');
    const contentContainer = document.getElementById('book-content-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    // --- STATE MANAGEMENT ---
    let currentBook = 'goliath';
    let fullBookText = '';
    let totalPages = 0;
    let currentPage = 1;
    const isUserRegistered = false; // Placeholder for user auth status

    const bookData = {
        goliath: {
            title: "Goliath's Stand",
            author: "By Salatiso Mdeni",
            cover: "assets/images/goliath.jpg",
            textFile: "assets/documents/BK-Goliaths_Stand.txt"
        },
        homeschooling: {
            title: "The Homeschooling Father",
            author: "By Salatiso Mdeni",
            cover: "assets/images/homeschooling_father.jpg",
            textFile: "assets/documents/BK-HomeSchooling_Father.txt"
        },
        redress: {
            title: "Beyond Redress",
            author: "By Salatiso Mdeni",
            cover: "assets/images/redress.jpg",
            textFile: "assets/documents/BK-Beyond_Redress.txt"
        }
    };
    
    // --- EVENT LISTENERS ---
    bookSelect.addEventListener('change', (e) => {
        loadBook(e.target.value);
    });
    
    // Note: Pagination logic will be more complex and will be implemented next.
    // This is a placeholder for the concept.
    prevPageBtn.addEventListener('click', () => alert("Previous page functionality coming soon!"));
    nextPageBtn.addEventListener('click', () => alert("Next page functionality coming soon!"));


    // --- CORE FUNCTIONS ---

    /**
     * Fetches and loads the content for a selected book.
     * @param {string} bookKey - The key for the book in the bookData object.
     */
    async function loadBook(bookKey) {
        currentBook = bookKey;
        const book = bookData[bookKey];
        
        if (!book) {
            console.error("Book not found:", bookKey);
            contentContainer.innerHTML = "<p>Sorry, this book could not be loaded.</p>";
            return;
        }

        // Update UI
        bookTitle.textContent = book.title;
        bookCover.src = book.cover;
        contentContainer.innerHTML = "<p>Loading...</p>";

        try {
            const response = await fetch(book.textFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            fullBookText = await response.text();
            
            // FUTURE: Paginate text here. For now, display a preview.
            displayBookContent();

        } catch (error) {
            console.error("Error fetching book content:", error);
            contentContainer.innerHTML = "<p>Error loading book content. Please try again.</p>";
        }
    }

    /**
     * Displays the book content, respecting user registration status.
     */
    function displayBookContent() {
        let contentToShow = fullBookText;

        if (!isUserRegistered) {
            // Show only first 30% for non-registered users
            const previewLength = Math.floor(fullBookText.length * 0.3);
            contentToShow = fullBookText.substring(0, previewLength) + 
            `<br><br><div class="text-center p-4 bg-gray-700 rounded-lg">
                <p class="font-bold">You've reached the end of the free preview.</p>
                <a href="login.html" class="text-green-400 font-bold hover:underline">Register for free</a> to read the full book, save your progress, and more.
            </div>`;
        }
        
        // Simple display for now. True pagination is a future step.
        contentContainer.innerHTML = contentToShow.replace(/\n/g, '<br>');
        contentContainer.scrollTop = 0; // Scroll to top
        pageIndicator.textContent = `Preview`; // Update later with actual pages
    }

    // --- INITIALIZATION ---
    loadBook(currentBook);
});
