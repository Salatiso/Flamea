import { loadTranslations, translatePage, setLanguage } from './translations.js';

document.addEventListener('DOMContentLoaded', async () => {
    // --- SHARED ELEMENTS & STATE ---
    const modalContainer = document.getElementById('modal-container');
    let currentLanguage = 'en'; // Default language

    // --- INITIALIZE SITE-WIDE FEATURES ---
    loadHeader();
    await loadTranslations();
    initLanguageSwitcher();
    initChatbot();


    // --- SPECIFIC PAGE LOGIC ---
    // This script will run on all pages, so we check for elements before acting.
    
    // Logic for the Horizontal Slider on index.html
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        initSlider();
    }


    // --- FUNCTION DEFINITIONS ---

    /**
     * Loads the shared header into its placeholder.
     */
    function loadHeader() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            fetch('header.html')
                .then(response => response.ok ? response.text() : Promise.reject('Header not found'))
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    // Re-run translation for the newly loaded header content
                    translatePage(currentLanguage); 
                    // Re-attach listeners for the new header elements
                    initLanguageSwitcher(); 
                    initSliderNav();
                })
                .catch(error => console.error('Error loading header:', error));
        }
    }

    /**
     * Initializes the language switcher dropdown.
     */
    function initLanguageSwitcher() {
        const languageSwitcher = document.getElementById('language-switcher');
        if (languageSwitcher) {
            languageSwitcher.addEventListener('change', (e) => {
                currentLanguage = e.target.value;
                setLanguage(currentLanguage); // Save preference
                translatePage(currentLanguage);
            });
            // Set initial value from storage if available
            currentLanguage = localStorage.getItem('legalHelpLanguage') || 'en';
            languageSwitcher.value = currentLanguage;
            setLanguage(currentLanguage); // Update page on initial load
        }
    }
    
    /**
     * Initializes the main horizontal slider functionality.
     */
    function initSlider() {
        const sections = mainContainer.querySelectorAll('.section');
        const totalSections = sections.length;
        let currentSectionIndex = 0;
        let isWheeling = false;

        window.navigateToSection = (sectionIndex) => {
            if (sectionIndex >= 0 && sectionIndex < totalSections) {
                mainContainer.style.transform = `translateX(-${sectionIndex * (100 / totalSections)}%)`;
                currentSectionIndex = sectionIndex;

                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[data-section='${sectionIndex}']`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
        
        // Initial call to set the active state correctly
        navigateToSection(0);


        // Swipe gesture support
        let touchstartX = 0;
        mainContainer.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, { passive: true });
        mainContainer.addEventListener('touchend', e => {
            const touchendX = e.changedTouches[0].screenX;
            // Swiped left
            if (touchendX < touchstartX - 50 && currentSectionIndex < totalSections - 1) {
                navigateToSection(currentSectionIndex + 1);
            }
            // Swiped right
            if (touchendX > touchstartX + 50 && currentSectionIndex > 0) {
                navigateToSection(currentSectionIndex - 1);
            }
        }, { passive: true });

        // Mouse wheel support for navigation
        mainContainer.addEventListener('wheel', (e) => {
            if (isWheeling) return;
            isWheeling = true;
            if (e.deltaY > 0) { // Scrolling down/right
                if (currentSectionIndex < totalSections - 1) navigateToSection(currentSectionIndex + 1);
            } else { // Scrolling up/left
                if (currentSectionIndex > 0) navigateToSection(currentSectionIndex - 1);
            }
            setTimeout(() => { isWheeling = false; }, 800); // Debounce wheel event
        }, { passive: true });
    }
    
    /**
     * Attaches click listeners to the slider navigation links in the header.
     */
     function initSliderNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        if (navLinks) {
             navLinks.forEach(link => {
                // Check if it's a slider link before adding slider-specific logic
                if(link.hasAttribute('data-section')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const sectionIndex = parseInt(e.target.closest('.nav-link').dataset.section);
                        if (typeof window.navigateToSection === 'function') {
                            window.navigateToSection(sectionIndex);
                        }
                    });
                }
            });
        }
    }


    /**
     * Initializes the chatbot functionality.
     */
    function initChatbot() {
        const openBtn = document.getElementById('open-chatbot-modal');
        if (openBtn) {
            openBtn.addEventListener('click', () => {
                fetch('chatbot.html')
                    .then(response => response.ok ? response.text() : Promise.reject('Chatbot HTML not found'))
                    .then(html => {
                        modalContainer.innerHTML = html;
                        modalContainer.classList.add('active');
                        attachChatbotListeners();
                    })
                    .catch(error => console.error('Error loading chatbot:', error));
            });
        }
    }
    
    /**
     * Attaches listeners to a newly loaded chatbot modal.
     */
    function attachChatbotListeners() {
        const closeBtn = modalContainer.querySelector('[data-modal-close]');
        const chatForm = modalContainer.querySelector('#chat-form');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => modalContainer.classList.remove('active'));
        }
        
        // Close on overlay click
        modalContainer.addEventListener('click', (e) => {
            if(e.target === modalContainer) modalContainer.classList.remove('active');
        });

        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                // Chat logic would go here
                console.log("Chat submitted");
            });
        }
    }
});
