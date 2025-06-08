// assets/js/book-reader.js
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!window.flamea || !window.flamea.auth) {
        console.error("Firebase is not initialized.");
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
    let bookId = '';

    const fetchBookContent = async (bookFileName) => {
        try {
            const response = await fetch(`assets/documents/${bookFileName}.txt`);
            if (!response.ok) throw new Error('Book file not found');
            return await response.text();
        } catch (error) {
            console.error("Error fetching book:", error);
            contentContainer.innerHTML = '<p class="text-red-400">Could not load book content. Please ensure the link is correct.</p>';
            return '';
        }
    };

    const paginate = () => {
        paginatedContent = [];
        const words = fullBookText.split(/\s+/);
        let pageText = '';
        const maxCharsPerPage = 1500; // Increased for a better reading experience

        for (let i = 0; i < words.length; i++) {
            if (pageText.length + words[i].length > maxCharsPerPage) {
                paginatedContent.push(pageText);
                pageText = '';
            }
            pageText += words[i] + ' ';
        }
        paginatedContent.push(pageText);
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
        if (user && bookId) {
            try {
                const userProgressRef = doc(db, "users", user.uid, "readingProgress", bookId);
                await setDoc(userProgressRef, { page: currentPage });
            } catch (error) { console.error("Error saving progress:", error); }
        } else if (bookId) {
            sessionStorage.setItem(bookId, currentPage);
        }
    };

    const loadProgress = async () => {
        const user = auth.currentUser;
        let savedPage = 0;
        if (user && bookId) {
            try {
                const userProgressRef = doc(db, "users", user.uid, "readingProgress", bookId);
                const docSnap = await getDoc(userProgressRef);
                if (docSnap.exists()) savedPage = docSnap.data().page;
                if (printBtn) printBtn.classList.remove('hidden');
            } catch (error) { console.error("Error loading progress:", error); }
        } else if (bookId) {
            const pageFromSession = sessionStorage.getItem(bookId);
            if (pageFromSession) savedPage = parseInt(pageFromSession, 10);
            if (printBtn) printBtn.classList.add('hidden');
        }
        displayPage(savedPage);
    };
    
    const initializeReader = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        bookId = urlParams.get('book');

        if (!bookId) {
            bookTitleEl.textContent = "No Book Selected";
            contentContainer.innerHTML = '<p>Please select a book from the <a href="publications.html" class="underline">Publications</a> page.</p>';
            return;
        }

        fullBookText = await fetchBookContent(bookId);
        if (fullBookText) {
            bookTitleEl.textContent = "Now Reading";
            chapterTitleEl.textContent = bookId.replace(/_/g, ' ').replace('BK-', '');
            paginate();
            await loadProgress();
        }
    };

    prevBtn.addEventListener('click', () => displayPage(currentPage - 1));
    nextBtn.addEventListener('click', () => displayPage(currentPage + 1));

    if (printBtn) {
        printBtn.addEventListener('click', () => {
            if (!auth.currentUser) {
                alert("You must be registered to print excerpts.");
                return;
            }
            const excerptChars = Math.floor(fullBookText.length * 0.30);
            const excerptText = fullBookText.substring(0, excerptChars);
            const printableArea = document.getElementById('printable-excerpt');
            printableArea.innerHTML = `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 1rem;">${chapterTitleEl.textContent} - Excerpt</h1><div style="font-size: 14px; line-height: 1.6;">${excerptText.replace(/\n/g, '<br>')}</div>`;
            window.print();
        });
    }

    auth.onAuthStateChanged((user) => {
        initializeReader();
    });
});
