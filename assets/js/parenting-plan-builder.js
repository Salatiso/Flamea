/**
 * parenting-plan-builder.js
 * * This script powers the new modular and Firebase-integrated Ultimate Family Management Tool.
 * It replaces the old step-by-step wizard with a flexible, hub-based navigation system.
 * All data is managed in a central state object and persisted to Firestore for real-time collaboration.
 */

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- MAIN APPLICATION OBJECT ---
const ParentingPlanApp = {
    // --- STATE MANAGEMENT ---
    planId: null,      // Will hold the unique ID for the parenting plan document
    userId: null,      // Will hold the current user's UID
    isAuthReady: false,// Flag to ensure auth state is known before DB operations
    planData: {},      // The single source of truth for all plan data
    db: null,          // Firestore database instance
    auth: null,        // Firebase auth instance
    unsubscribe: null, // To detach the Firestore listener on cleanup

    // --- INITIALIZATION ---
    async init() {
        console.log("Initializing The Ultimate Family Management Tool...");
        this.mapDOMElements();
        this.initFirebase();
        this.attachEventListeners();
        
        // Wait for authentication to be ready
        await this.waitForAuth();

        this.loadOrCreatePlan();
    },
    
    // --- FIREBASE SETUP & AUTHENTICATION ---
    initFirebase() {
        // This configuration should ideally be in a separate, non-public file,
        // but is included here as per the user's provided details.
        const firebaseConfig = {
            apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
            authDomain: "flamea.firebaseapp.com",
            projectId: "flamea",
            storageBucket: "flamea.appspot.com", // Corrected from firebasestorage.app
            messagingSenderId: "681868881622",
            appId: "1:681868881622:web:d20687c688b2d1d943a377",
            measurementId: "G-MX7X9JQE51"
        };

        try {
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.auth = getAuth(app);
            console.log("Firebase initialized successfully.");

            // Listen for authentication state changes
            onAuthStateChanged(this.auth, async (user) => {
                if (user) {
                    this.userId = user.uid;
                    console.log("User is signed in:", this.userId);
                    this.elements.userIdDisplay.textContent = this.userId;
                } else {
                    console.log("User is not signed in. Attempting anonymous sign-in.");
                    // For development, we sign in anonymously. In production, you'd redirect to a login page.
                    await signInAnonymously(this.auth).catch(error => {
                        console.error("Anonymous sign-in failed:", error);
                    });
                }
                this.isAuthReady = true; // Auth state is now confirmed
            });
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            alert("Could not connect to the database. Please check your connection and try again.");
        }
    },
    
    // Utility to pause execution until Firebase Auth state is resolved
    waitForAuth() {
        return new Promise(resolve => {
            const checkAuth = () => {
                if (this.isAuthReady) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 50); // Check again shortly
                }
            };
            checkAuth();
        });
    },

    // --- DATA MANAGEMENT ---
    getDefaultPlanData() {
        // Returns a fresh, empty structure for a new plan
        return {
            metadata: {
                version: "2.0",
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                ownerId: this.userId,
                authorizedUsers: [this.userId],
            },
            parties: {
                parentA: { role: 'Father', name: '', addresses: [{ type: 'Primary', value: '' }], contacts: [{ type: 'Mobile', value: '' }] },
                parentB: { role: 'Mother', name: '', addresses: [{ type: 'Primary', value: '' }], contacts: [{ type: 'Mobile', value: '' }] },
                children: []
            },
            schedule: {
                custodyStatus: 'mutual_agreement',
                custodyDetails: '',
                events: []
            },
            finances: {
                categories: []
            },
            communication: {
                methods: '',
                disputeResolution: ''
            },
            activityLog: []
        };
    },

    loadOrCreatePlan() {
        // For simplicity, we'll use a single planId per user. A real app might have a list of plans.
        this.planId = `plan_${this.userId}`;
        this.elements.planIdDisplay.textContent = this.planId;
        const planRef = doc(this.db, "parenting_plans", this.planId);
        
        // Detach any existing listener before creating a new one
        if (this.unsubscribe) this.unsubscribe();

        // Listen for real-time updates to the plan
        this.unsubscribe = onSnapshot(planRef, (docSnap) => {
            if (docSnap.exists()) {
                console.log("Plan data loaded from Firestore.");
                this.planData = docSnap.data();
            } else {
                console.log("No existing plan found. Creating a new one.");
                this.planData = this.getDefaultPlanData();
                this.savePlan(); // Initial save for a new plan
            }
            // Ensure UI reflects the latest data after any update
            this.updateUIFromState();
        }, (error) => {
            console.error("Error listening to plan updates:", error);
        });
    },

    async savePlan() {
        if (!this.planId || !this.userId) {
            console.error("Cannot save: planId or userId is not set.");
            return;
        }
        console.log("Saving plan data to Firestore...");
        this.planData.metadata.lastModified = new Date().toISOString();
        const planRef = doc(this.db, "parenting_plans", this.planId);
        try {
            // Using setDoc with merge:true is like an "upsert" - it creates or updates.
            await setDoc(planRef, this.planData, { merge: true });
            console.log("Plan saved successfully.");
        } catch (error) {
            console.error("Error saving plan to Firestore:", error);
        }
    },
    
    // Populates the entire UI based on the current planData state
    updateUIFromState() {
        console.log("Updating UI from state...");
        // Example: if you had an input for Parent A's name
        const parentANameInput = document.querySelector('#parentA-name'); // Assuming this exists in a modal
        if (parentANameInput) {
            parentANameInput.value = this.planData.parties.parentA.name;
        }
        // ... more UI updates would go here as sections are built
    },

    // --- DOM & EVENT HANDLING ---
    mapDOMElements() {
        this.elements = {
            hub: document.getElementById('section-hub'),
            modal: document.getElementById('section-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            closeModalBtn: document.getElementById('close-modal-btn'),
            saveSectionBtn: document.getElementById('save-section-btn'),
            planIdDisplay: document.getElementById('plan-id-display'),
            userIdDisplay: document.getElementById('user-id-display'),
            pdfOutput: document.getElementById('pdf-output'),
            // Add other static elements here
        };
    },

    attachEventListeners() {
        // Hub navigation
        this.elements.hub.addEventListener('click', (e) => {
            const card = e.target.closest('.hub-card');
            if (card) {
                const section = card.dataset.section;
                this.openSectionModal(section);
            }
        });

        // Modal controls
        this.elements.closeModalBtn.addEventListener('click', () => this.closeSectionModal());
        this.elements.saveSectionBtn.addEventListener('click', () => {
            this.savePlan();
            this.closeSectionModal();
        });
    },
    
    // --- MODAL & SECTION LOGIC ---
    openSectionModal(sectionName) {
        this.elements.modalTitle.textContent = this.getSectionTitle(sectionName);
        this.elements.modalBody.innerHTML = this.getSectionTemplate(sectionName);
        this.elements.modal.classList.remove('hidden');

        // After injecting HTML, initialize section-specific logic
        if (sectionName === 'schedule') {
            this.initCalendar();
        }
        
        // Populate the opened section with data from the state
        this.populateSection(sectionName);
    },

    closeSectionModal() {
        this.elements.modal.classList.add('hidden');
        this.elements.modalBody.innerHTML = ''; // Clear content to prevent ID conflicts
        if (this.calendar) {
            this.calendar.destroy();
            this.calendar = null;
        }
    },
    
    getSectionTitle(sectionName) {
        const titles = {
            parties: 'The Parties & Children',
            schedule: 'Contact Schedule & Arrangements',
            finances: 'Financial Contributions',
            communication: 'Communication Plan',
            'activity-tracker': 'Family Activity Log',
            finalize: 'Finalise, Download & Pledge'
        };
        return titles[sectionName] || 'Edit Section';
    },

    getSectionTemplate(sectionName) {
        const template = document.getElementById(`section-${sectionName}-template`);
        return template ? template.innerHTML : `<p>Section content for "${sectionName}" is under construction.</p>`;
    },

    populateSection(sectionName) {
        // This function would populate the form fields in the modal
        // based on the data in this.planData[sectionName]
        console.log(`Populating modal for section: ${sectionName}`);
    },

    initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            this.calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                },
                editable: true,
                events: this.planData.schedule.events || [],
                // Add event handlers to update this.planData on changes
            });
            this.calendar.render();
        }
    },
    
};


// --- DOCUMENT READY ---
// Ensures the entire DOM is loaded before we try to manipulate it
document.addEventListener('DOMContentLoaded', () => {
    // We attach the app object to the window to make the initMap callback accessible
    window.parentingPlanApp = ParentingPlanApp; 
    ParentingPlanApp.init();
});
