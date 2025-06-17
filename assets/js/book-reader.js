import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const bookSelect = document.getElementById('book-select');
    const bookTitleEl = document.getElementById('book-title');
    const contentContainer = document.getElementById('book-content-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumEl = document.getElementById('page-num');
    const totalPagesEl = document.getElementById('total-pages');

    let isUserRegistered = false;
    let pages = [];
    let currentPage = 1;

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

    onAuthStateChanged(auth, (user) => {
        isUserRegistered = !!user;
        // Reload the current book to apply the correct preview/full logic
        if(bookSelect.value) {
            loadBook(bookSelect.value);
        }
    });

    function populateBookSelect() {
        for (const key in bookData) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = bookData[key].title;
            bookSelect.appendChild(option);
        }
        bookSelect.addEventListener('change', (e) => loadBook(e.target.value));
    }

    async function loadBook(bookKey) {
        if (!bookKey) return;
        const book = bookData[bookKey];
        contentContainer.innerHTML = "<p>Loading...</p>";
        bookTitleEl.textContent = book.title;
        currentPage = 1;

        try {
            const response = await fetch(book.textFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const fullText = await response.text();
            paginateBook(fullText);
            displayPage();
        } catch (error) {
            console.error("Error fetching book content:", error);
            contentContainer.innerHTML = "<p>Error loading book content. Please try again.</p>";
        }
    }

    function paginateBook(text) {
        const words = text.split(/\s+/);
        const wordsPerPage = 350;
        let tempPages = [];
        for (let i = 0; i < words.length; i += wordsPerPage) {
            tempPages.push(words.slice(i, i + wordsPerPage).join(' '));
        }

        if (!isUserRegistered) {
            const previewPages = Math.ceil(tempPages.length * 0.3);
            pages = tempPages.slice(0, previewPages);
            const lastPage = pages[pages.length - 1] || "";
            pages[pages.length - 1] = lastPage + 
            `<br><br><div class="text-center p-4 bg-gray-200 rounded-lg">
                <p class="font-bold">You've reached the end of the free preview.</p>
                <a href="login.html" class="text-blue-600 font-bold hover:underline">Register for free</a> to read the full book and save your progress.
            </div>`;
        } else {
            pages = tempPages;
        }
    }

    function displayPage() {
        if (pages.length === 0) return;
        contentContainer.innerHTML = pages[currentPage - 1].replace(/\n/g, '<br><br>');
        contentContainer.scrollTop = 0;
        updateNav();
    }

    function updateNav() {
        pageNumEl.textContent = currentPage;
        totalPagesEl.textContent = pages.length;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === pages.length;
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length) {
            currentPage++;
            displayPage();
        }
    });

    // Initial Load
    populateBookSelect();
    loadBook(bookSelect.value);
});
