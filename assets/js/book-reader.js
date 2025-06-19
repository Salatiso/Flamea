import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    collection,
    addDoc, 
    query, 
    where, 
    getDocs,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const auth = getAuth();
    const db = getFirestore();
    let currentUser = null;

    const bookData = {
        'beyond-redress': {
            title: "Beyond Redress",
            path: 'assets/documents/BK-Beyond_ Redress.txt',
            cover: 'assets/images/redress.jpg'
        },
        'homeschooling-father': {
            title: "The Homeschooling Father",
            path: 'assets/documents/BK-HomeSchooling_Father.txt',
            cover: 'assets/images/homeschooling_father.jpg'
        },
        'goliaths-stand': {
            title: "Goliath's Stand",
            path: 'assets/documents/BK-Goliaths_Stand.txt',
            cover: 'assets/images/goliath.jpg'
        }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book');
    const book = bookData[bookId];

    const flipbook = $('#flipbook');
    const pageIndicator = document.getElementById('page-indicator');
    let currentFontSize = 16;
    let currentZoom = 1;

    async function loadBook() {
        if (!book) {
            flipbook.html('<div class="page">Book not found.</div>');
            return;
        }

        const response = await fetch(book.path);
        const text = await response.text();

        const pages = paginate(text, 250); // words per page
        
        // Add cover
        flipbook.append(`<div class="hard"><img src="${book.cover}" class="w-full h-full object-cover"/></div>`);
        flipbook.append('<div class="hard"></div>');

        pages.forEach(pageContent => {
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            pageDiv.innerHTML = `<div class="p-5" style="font-size: ${currentFontSize}px;">${pageContent.replace(/\n/g, '<br>')}</div>`;
            flipbook.append(pageDiv);
        });

        // Add back cover
        flipbook.append('<div class="hard"></div>');
        flipbook.append(`<div class="hard"></div>`);

        flipbook.turn({
            width: '100%',
            height: '100%',
            autoCenter: true,
            display: 'double',
            acceleration: true,
            gradients: true,
            when: {
                turned: function(event, page, view) {
                    pageIndicator.textContent = `Page ${page} of ${flipbook.turn('pages')}`;
                    if(currentUser) saveBookmark(page);
                }
            }
        });

        parseAndDisplayTOC(text);
        if (currentUser) {
            loadBookmark();
            loadHighlightsAndNotes();
        }
    }
    
    function paginate(text, wordsPerPage) {
        const words = text.split(/\s+/);
        const pages = [];
        for (let i = 0; i < words.length; i += wordsPerPage) {
            pages.push(words.slice(i, i + wordsPerPage).join(' '));
        }
        return pages;
    }

    function parseAndDisplayTOC(text) {
        const tocList = document.getElementById('content-list');
        const lines = text.split('\n');
        const toc = lines.filter(line => /^\d+\..*/.test(line.trim()));

        toc.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.trim();
            li.className = "cursor-pointer hover:text-blue-400";
            // This is a simplified jump-to-page. A real implementation would need to map titles to page numbers.
            li.onclick = () => { /* ... */ };
            tocList.appendChild(li);
        });
    }

    // Toolbar controls
    document.getElementById('prev-page-btn').addEventListener('click', () => flipbook.turn('previous'));
    document.getElementById('next-page-btn').addEventListener('click', () => flipbook.turn('next'));

    document.getElementById('font-inc-btn').addEventListener('click', () => {
        currentFontSize += 1;
        $('.page > div').css('font-size', `${currentFontSize}px`);
    });
    document.getElementById('font-dec-btn').addEventListener('click', () => {
        currentFontSize -= 1;
        $('.page > div').css('font-size', `${currentFontSize}px`);
    });
     document.getElementById('zoom-in-btn').addEventListener('click', () => {
        currentZoom += 0.1;
        $('#flipbook-container').css('transform', `scale(${currentZoom})`);
    });
    document.getElementById('zoom-out-btn').addEventListener('click', () => {
        currentZoom -= 0.1;
        $('#flipbook-container').css('transform', `scale(${currentZoom})`);
    });

    document.getElementById('toggle-sidebar-btn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('closed');
    });

    // Authentication and Firestore logic
    onAuthStateChanged(auth, user => {
        currentUser = user;
        loadBook();

        if (!user) {
            window.addEventListener('beforeunload', (event) => {
                event.returnValue = "Your progress will be lost unless you register. Are you sure you want to exit?";
                return "Your progress will be lost unless you register. Are you sure you want to exit?";
            });
        }
    });

    async function saveBookmark(page) {
        if (!currentUser) return;
        const bookmarkRef = doc(db, `users/${currentUser.uid}/bookmarks`, bookId);
        await setDoc(bookmarkRef, { page });
    }

    async function loadBookmark() {
        if (!currentUser) return;
        const bookmarkRef = doc(db, `users/${currentUser.uid}/bookmarks`, bookId);
        const docSnap = await getDoc(bookmarkRef);
        if (docSnap.exists()) {
            flipbook.turn('page', docSnap.data().page);
        }
    }
    
    // Note taking and highlighting logic
    const highlightPopup = document.getElementById('highlight-popup');
    let currentSelection;

    flipbook.on('mouseup', '.page', (e) => {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            currentSelection = selection.getRangeAt(0).cloneRange();
            highlightPopup.style.left = `${e.clientX}px`;
            highlightPopup.style.top = `${e.clientY}px`;
            highlightPopup.classList.remove('hidden');
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (!highlightPopup.contains(e.target)) {
            highlightPopup.classList.add('hidden');
        }
    });

    // ... Note saving and sharing logic to be implemented here
});

