// ===================================================================
// FILE: assets/js/modules/ui-module.js
// Contains shared UI logic like the home page slider and chatbot.
// ===================================================================

import { translatePage, setLanguage as setLangPref, translations } from '../translations.js';

export function initTranslation() {
    const lang = localStorage.getItem('legalHelpLanguage') || 'en';
    translatePage(lang);
}

export function initLanguageSwitcher() {
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
        languageSwitcher.value = localStorage.getItem('legalHelpLanguage') || 'en';
        languageSwitcher.addEventListener('change', (e) => {
            setLangPref(e.target.value);
        });
    }
}

export function initSlider() {
    const mainContainer = document.getElementById('mainContainer');
    if (!mainContainer) return;
    
    // Logic for home page horizontal slider remains the same...
    console.log("Slider Initialized");
}

export function initChatbot() {
    const openBtn = document.getElementById('open-chatbot-modal');
    const modalContainer = document.getElementById('modal-container');
    if (openBtn && modalContainer) {
        openBtn.addEventListener('click', () => {
            // In an SPA, it's better to have the template in index.html, 
            // but for now we can fetch it if it's simple.
            // A better approach would be to have a <template id="template-chatbot">
            modalContainer.innerHTML = `
                <div class="chatbot-modal-content">
                    <div class="flex justify-between items-center p-4 border-b border-gray-700">
                        <h3 class="text-xl font-bold text-indigo-400"><i class="fas fa-robot mr-3"></i>LegalHelp Assistant</h3>
                        <button data-modal-close class="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    <div class="flex-grow p-4 overflow-y-auto">...</div>
                    <form id="chat-form" class="p-4 border-t border-gray-700 flex gap-2">...</form>
                </div>
            `;
            modalContainer.classList.add('active');
            // Attach listeners for the newly added chatbot modal
            modalContainer.querySelector('[data-modal-close]').addEventListener('click', () => modalContainer.classList.remove('active'));
        });
    }
}


// ===================================================================
// FILE: assets/js/modules/auth-module.js
// Handles all authentication logic.
// ===================================================================

import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// ... other auth imports if needed for login page ...

export function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        updateHeaderUI(user);
    });
}

export function updateHeaderUI(user) {
    const loginLink = document.getElementById('login-or-dashboard-link');
    const signOutBtn = document.getElementById('sign-out-btn');
    if (!loginLink || !signOutBtn) return;

    if (user) {
        loginLink.textContent = 'Dashboard';
        loginLink.href = 'dashboard.html'; // Direct link to the separate dashboard page
        signOutBtn.classList.remove('hidden');
        signOutBtn.addEventListener('click', handleSignOut);
    } else {
        loginLink.textContent = 'Login';
        loginLink.href = 'login.html';
        signOutBtn.classList.add('hidden');
    }
}

export async function handleSignOut() {
    try {
        await signOut(auth);
        // Redirect to home page after sign out
        window.location.hash = '/';
    } catch (error) {
        console.error("Sign out error:", error);
    }
}

// NOTE: The logic for handling the actual login/registration forms would
// still live in a script loaded ONLY by login.html, since it's a separate page.

// ===================================================================
// FILE: assets/js/modules/forms-module.js
// Logic for the Forms page.
// ===================================================================
export function initForms() {
    // All of the logic from the original forms.js file goes here.
    // This ensures it only runs when the Forms "page" is rendered by the router.
    console.log("Forms Module Initialized");
    const wizardBtn = document.getElementById('start-wizard-btn');
    if (!wizardBtn) return;

    const explorerBtn = document.getElementById('explore-forms-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    
    wizardBtn.addEventListener('click', () => {
        wizardSection.classList.remove('hidden');
        explorerSection.classList.add('hidden');
        // renderWizard();
    });

    explorerBtn.addEventListener('click', () => {
        explorerSection.classList.remove('hidden');
        wizardSection.classList.add('hidden');
        // renderExplorer();
    });
}


// ===================================================================
// FILE: assets/js/modules/locator-module.js
// Logic for the Resource Compass.
// ===================================================================
import { masterDB } from '../legalhelp-master-db.js';

export function initLocator() {
    // The locator logic is now wrapped in this function, called by the router.
    const locatorApp = {
        // ... (entire locatorApp object from previous version)
        init() {
            if (!document.getElementById('selection-view')) return;
            this.attachEventListeners();
            this.populateFilters();
            // If the map API is already loaded, init the map.
            if (window.google && window.google.maps) {
                this.initMap();
            }
        },
        async initMap() {
            // ... (map logic from previous version)
        },
        // ... (all other locatorApp methods)
    };
    
    // Attach the app object to the window so the global Google Maps callback can find it
    window.locatorApp = locatorApp;
    locatorApp.init();
}


// ===================================================================
// FILE: assets/js/modules/casetracker-module.js
// Logic for the Case Tracker page.
// ===================================================================
import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, addDoc, onSnapshot, collection, query, updateDoc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

export function initCaseTracker() {
    const loadingState = document.getElementById('loading-state-casetracker');
    const mainContent = document.getElementById('main-content-casetracker');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadingState.classList.remove('active');
            mainContent.classList.add('active');
            runCaseTrackerLogic(user);
        } else {
            // If user is not logged in, redirect them to the main login page
            window.location.href = 'login.html';
        }
    });
}

function runCaseTrackerLogic(user) {
    // All of the logic from the original case-tracker.js file goes here.
    console.log("Case Tracker Initialized for user:", user.uid);
    // ... all the getElementById calls, event listeners, and data functions
}
