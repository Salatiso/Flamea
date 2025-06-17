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

    // New elements for the cover view
    const coverView = document.getElementById('cover-view');
    const readerView = document.getElementById('reader-view');
    const coverImg = document.getElementById('book-cover-img');
    const coverTitle = document.getElementById('cover-title');
    const coverAuthor = document.getElementById('cover-author');
    const startReadingBtn = document.getElementById('start-reading-btn');

    // --- State Management ---
    let isUserRegistered = false;
    let pages = [];
    let currentPage = 1;
    const wordsPerPage = 350;

    // Updated book data with cover image paths
    const bookData = {
        homeschooling: {
            title: "The Homeschooling Father",
            author: "Salatiso Mdeni",
            cover: "assets/images/homeschooling_father.jpg",
            textFile: "assets/documents/BK-HomeSchooling_Father.txt"
        },
        reckoning: {
            title: "Goliath's Reckoning",
            author: "Salatiso Mdeni",
            cover: "assets/images/goliath.jpg", // As per user instruction
            textFile: "assets/documents/BK-Goliaths_Reckoning.txt"
        },
        redress: {
            title: "Beyond Redress",
            author: "Salatiso Mdeni",
            cover: "assets/images/redress.jpg",
            textFile: "assets/documents/BK-Beyond_Redress.txt"
        }
    };

    // --- Authentication ---
    onAuthStateChanged(auth, (user) => {
        isUserRegistered = !!user;
        if (bookSelect?.value) {
            loadBook(bookSelect.value);
        }
    });

    // --- Core Functions ---
    function populateBookSelect() {
        if (!bookSelect) return;
        Object.keys(bookData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = bookData[key].title;
            bookSelect.appendChild(option);
        });
        bookSelect.addEventListener('change', (e) => loadBook(e.target.value));
    }

    async function loadBook(bookKey) {
        if (!bookKey) return;
        
        // Show loading state and reset views
        showCoverView();
        coverTitle.textContent = 'Loading...';
        coverAuthor.textContent = '';
        coverImg.src = 'https://placehold.co/300x450/1f2937/FFFFFF?text=...';
        
        const book = bookData[bookKey];
        if (bookTitleEl) bookTitleEl.textContent = book.title;
        currentPage = 1;

        try {
            const response = await fetch(book.textFile);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const fullText = await response.text();
            
            // Update cover view with actual book info
            coverImg.src = book.cover;
            coverTitle.textContent = book.title;
            coverAuthor.textContent = `by ${book.author}`;
            startReadingBtn.disabled = false;

            paginateBook(fullText);
        } catch (error) {
            console.error("Error fetching book content:", error);
            coverTitle.textContent = 'Error Loading Book';
            startReadingBtn.disabled = true;
        }
    }

    function paginateBook(text) {
        const words = text.split(/\s+/);
        let tempPages = [];
        for (let i = 0; i < words.length; i += wordsPerPage) {
            tempPages.push(words.slice(i, i + wordsPerPage).join(' '));
        }

        if (!isUserRegistered) {
            const previewPageCount = Math.ceil(tempPages.length * 0.3);
            pages = tempPages.slice(0, previewPageCount || 1); // Show at least one page
            if (pages.length > 0) {
                pages[pages.length - 1] += 
                `<br><br><div class="text-center p-4 bg-gray-200 rounded-lg border border-gray-300 mt-4">
                    <p class="font-bold text-gray-800">You've reached the end of the free preview.</p>
                    <a href="login.html" class="text-blue-600 font-bold hover:underline">Register for free</a> to read the full book.
                </div>`;
            }
        } else {
            pages = tempPages;
        }
    }

    function displayPage() {
        if (pages.length === 0 || !contentContainer) return;
        contentContainer.innerHTML = `<div class="prose max-w-none">${pages[currentPage - 1].replace(/\n/g, '<br><br>')}</div>`;
        contentContainer.scrollTop = 0;
        updateNav();
    }

    function updateNav() {
        if (!pageNumEl || !totalPagesEl || !prevBtn || !nextBtn) return;
        pageNumEl.textContent = currentPage;
        totalPagesEl.textContent = pages.length;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage >= pages.length;
    }

    function showReaderView() {
        coverView.classList.add('hidden');
        readerView.classList.remove('hidden');
        displayPage();
    }

    function showCoverView() {
        coverView.classList.remove('hidden');
        readerView.classList.add('hidden');
    }

    // --- Event Listeners ---
    if(startReadingBtn) startReadingBtn.addEventListener('click', showReaderView);
    if(prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; displayPage(); } });
    if(nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < pages.length) { currentPage++; displayPage(); } });

    // --- Initial Load ---
    populateBookSelect();
    if(bookSelect) loadBook(bookSelect.value);
});
