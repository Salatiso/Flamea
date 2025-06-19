import { auth } from './firebase-config.js';
import { onAuthStateChanged, getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bookSelect = document.getElementById('book-select');
    const bookTitleEl = document.getElementById('book-title');
    const bookContainer = document.getElementById('book');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumEl = document.getElementById('page-num');
    const totalPagesEl = document.getElementById('total-pages');
    const coverView = document.getElementById('cover-view');
    const readerView = document.getElementById('reader-view');
    const coverImg = document.getElementById('book-cover-img');
    const coverTitle = document.getElementById('cover-title');
    const coverAuthor = document.getElementById('cover-author');
    const startReadingBtn = document.getElementById('start-reading-btn');
    const fontIncreaseBtn = document.getElementById('font-increase');
    const fontDecreaseBtn = document.getElementById('font-decrease');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const bookmarkBtn = document.getElementById('bookmark-btn');

    // --- State Management ---
    let isUserRegistered = false;
    let pages = [];
    let currentPage = 1;
    let fontSize = 16; // Default font size in pixels
    let zoomLevel = 1; // Default zoom level
    const wordsPerPage = 350;
    let copiedWords = 0;
    let totalWords = 0;
    const copyLimit = 0.3; // 30% of total content
    const db = getFirestore();

    // Book data
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
            cover: "assets/images/goliath.jpg",
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
            totalWords = fullText.split(/\s+/).length;

            // Update cover view
            coverImg.src = book.cover;
            coverTitle.textContent = book.title;
            coverAuthor.textContent = `by ${book.author}`;
            startReadingBtn.disabled = false;

            // Paginate and load bookmark
            paginateBook(fullText);
            if (isUserRegistered) {
                loadBookmark(bookKey);
            }
            initializeTurnJs();
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
            pages = tempPages.slice(0, previewPageCount || 1);
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

        // Render pages for Turn.js
        bookContainer.innerHTML = '';
        // Add cover page
        bookContainer.innerHTML += `<div class="hard"><img src="${bookData[bookSelect.value].cover}" alt="Cover" class="w-full h-full object-cover"></div>`;
        bookContainer.innerHTML += `<div class="hard"></div>`; // Back of cover
        pages.forEach((page, index) => {
            bookContainer.innerHTML += `<div><div class="prose max-w-none p-6" style="font-size: ${fontSize}px">${page.replace(/\n/g, '<br><br>')}</div></div>`;
        });
        // Add back cover
        bookContainer.innerHTML += `<div class="hard"></div>`;
        bookContainer.innerHTML += `<div class="hard"><img src="${bookData[bookSelect.value].cover}" alt="Back Cover" class="w-full h-full object-cover"></div>`;
    }

    function initializeTurnJs() {
        $('#book').turn({
            width: 800,
            height: 600,
            autoCenter: true,
            display: 'double',
            acceleration: true,
            gradients: true,
            when: {
                turning: function(event, page, view) {
                    currentPage = Math.floor(page / 2) + 1;
                    updateNav();
                }
            }
        });
        updateNav();
    }

    function displayPage() {
        $('#book').turn('page', (currentPage - 1) * 2 + 2);
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
        $('#book').turn('destroy');
    }

    async function saveBookmark(bookKey) {
        if (!isUserRegistered) return;
        const user = auth.currentUser;
        if (!user) return;
        try {
            await setDoc(doc(db, 'bookmarks', `${user.uid}_${bookKey}`), {
                bookKey: bookKey,
                page: currentPage,
                timestamp: new Date().toISOString()
            });
            alert('Bookmark saved!');
        } catch (error) {
            console.error('Error saving bookmark:', error);
        }
    }

    async function loadBookmark(bookKey) {
        if (!isUserRegistered) return;
        const user = auth.currentUser;
        if (!user) return;
        try {
            const docSnap = await getDoc(doc(db, 'bookmarks', `${user.uid}_${bookKey}`));
            if (docSnap.exists()) {
                currentPage = docSnap.data().page;
                showReaderView();
            }
        } catch (error) {
            console.error('Error loading bookmark:', error);
        }
    }

    function adjustFontSize(increase) {
        fontSize = increase ? Math.min(fontSize + 2, 24) : Math.max(fontSize - 2, 12);
        document.querySelectorAll('#book .prose').forEach(el => {
            el.style.fontSize = `${fontSize}px`;
        });
    }

    function adjustZoom(increase) {
        zoomLevel = increase ? Math.min(zoomLevel + 0.1, 1.5) : Math.max(zoomLevel - 0.1, 0.5);
        $('#book').css('transform', `scale(${zoomLevel})`);
    }

    function handleCopy(event) {
        if (!isUserRegistered) {
            event.preventDefault();
            alert('Please register to copy content.');
            return;
        }
        const selection = window.getSelection();
        const selectedText = selection.toString();
        const selectedWords = selectedText.split(/\s+/).length;
        if (copiedWords + selectedWords > totalWords * copyLimit) {
            event.preventDefault();
            alert('Copy limit reached. You can only copy up to 30% of the book.');
        } else {
            copiedWords += selectedWords;
        }
    }

    // --- Event Listeners ---
    if (startReadingBtn) startReadingBtn.addEventListener('click', showReaderView);
    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage();
        }
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentPage < pages.length) {
            currentPage++;
            displayPage();
        }
    });
    if (fontIncreaseBtn) fontIncreaseBtn.addEventListener('click', () => adjustFontSize(true));
    if (fontDecreaseBtn) fontDecreaseBtn.addEventListener('click', () => adjustFontSize(false));
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => adjustZoom(true));
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => adjustZoom(false));
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', () => saveBookmark(bookSelect.value));
    document.addEventListener('copy', handleCopy);

    // --- Initial Load ---
    populateBookSelect();
    if (bookSelect) loadBook(bookSelect.value);
});