// assets/js/book-reader.js
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Ensure the flamea global object and its properties are ready
    if (!window.flamea || !window.flamea.auth) {
        console.error("Firebase is not initialized. Make sure auth.js is loaded correctly.");
        return;
    }
    const auth = window.flamea.auth;
    const db = window.flamea.db;

    const bookTitleEl = document.getElementById('book-title');
    const chapterTitleEl = document.getElementById('chapter-title');
    const contentContainer = document.getElementById('book-content-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageNumEl = document.getElementById('page-num');
    const totalPagesEl = document.getElementById('total-pages');
    const printBtn = document.getElementById('print-excerpt-btn');

    let fullBookText = '';
    let paginatedContent = [];
    let currentPage = 0;
    let bookId = 'BK-Goliaths_Stand'; // Default book to load

    const fetchBookContent = async (bookFileName) => {
        try {
            const response = await fetch(`assets/documents/${bookFileName}.txt`);
            if (!response.ok) {
                throw new Error('Book file not found');
            }
            return await response.text();
        } catch (error) {
            console.error("Error fetching book:", error);
            contentContainer.innerHTML = '<p class="text-red-400">Could not load book content. Please try again later.</p>';
            return '';
        }
    };

    const paginate = () => {
        paginatedContent = [];
        const words = fullBookText.split(' ');
        let pageText = '';
        const maxCharsPerPage = 1200; // Adjust this value based on your desired page density

        for (let i = 0; i < words.length; i++) {
            if (pageText.length + words[i].length > maxCharsPerPage) {
                paginatedContent.push(pageText);
                pageText = '';
            }
            pageText += words[i] + ' ';
        }
        paginatedContent.push(pageText); // Add the last page
        totalPagesEl.textContent = paginatedContent.length;
    };

    const displayPage = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < paginatedContent.length) {
            currentPage = pageNumber;
            contentContainer.innerHTML = `<p>${paginatedContent[currentPage].replace(/\n/g, '</p><p>')}</p>`;
            pageNumEl.textContent = currentPage + 1;

            prevBtn.disabled = currentPage === 0;
            nextBtn.disabled = currentPage === paginatedContent.length - 1;

            saveProgress();
        }
    };

    const saveProgress = async () => {
        const user = auth.currentUser;
        if (user) {
            // Logged-in user: save to Firestore
            try {
                const userProgressRef = doc(db, "users", user.uid, "readingProgress", bookId);
                await setDoc(userProgressRef, { page: currentPage });
            } catch (error) {
                console.error("Error saving progress to Firestore:", error);
            }
        } else {
            // Guest user: save to sessionStorage
            sessionStorage.setItem(bookId, currentPage);
        }
    };

    const loadProgress = async () => {
        const user = auth.currentUser;
        let savedPage = 0;
        if (user) {
            // Logged-in user: load from Firestore
            try {
                const userProgressRef = doc(db, "users", user.uid, "readingProgress", bookId);
                const docSnap = await getDoc(userProgressRef);
                if (docSnap.exists()) {
                    savedPage = docSnap.data().page;
                }
                 printBtn.classList.remove('hidden');
            } catch (error) {
                console.error("Error loading progress from Firestore:", error);
            }
        } else {
            // Guest user: load from sessionStorage
            const pageFromSession = sessionStorage.getItem(bookId);
            if (pageFromSession) {
                savedPage = parseInt(pageFromSession, 10);
            }
            printBtn.classList.add('hidden');
        }
        displayPage(savedPage);
    };
    
    const initializeReader = async () => {
        // Here you could add logic to select a book, e.g., from URL params
        // For now, we load the default book.
        fullBookText = await fetchBookContent(bookId);
        if(fullBookText) {
            // For now, we'll just use the book ID as the title.
            bookTitleEl.textContent = bookId.replace(/_/g, ' ').replace('BK-', '');
            chapterTitleEl.textContent = "Full Text";
            paginate();
            await loadProgress();
        }
    };

    prevBtn.addEventListener('click', () => displayPage(currentPage - 1));
    nextBtn.addEventListener('click', () => displayPage(currentPage + 1));

    printBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) {
            alert("You must be a registered member to print excerpts.");
            return;
        }

        const excerptChars = Math.floor(fullBookText.length * 0.30);
        const excerptText = fullBookText.substring(0, excerptChars);

        const printableArea = document.getElementById('printable-excerpt');
        printableArea.innerHTML = `<h1 class="text-2xl font-bold mb-4">${bookTitleEl.textContent} - Excerpt</h1><p>${excerptText.replace(/\n/g, '</p><p>')}</p>`;
        
        window.print();
    });

    auth.onAuthStateChanged((user) => {
        // When auth state changes, re-initialize to load/save progress correctly
        initializeReader();
    });
});
