/**
 * parenting-plan-builder.js
 * Complete functional version with all features working
 */

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- MAIN APPLICATION OBJECT ---
const ParentingPlanApp = {
    // --- STATE MANAGEMENT ---
    planId: null,
    userId: null,
    isAuthReady: false,
    planData: {},
    db: null,
    auth: null,
    unsubscribe: null,
    calendar: null,
    isDataLoaded: false,
    currentSection: null,

    // --- INITIALIZATION ---
    async init() {
        console.log("Initializing The Ultimate Family Management Tool...");
        this.mapDOMElements();
        this.initFirebase();
        this.attachEventListeners();
        
        // Wait for authentication to be ready
        await this.waitForAuth();
        await this.loadOrCreatePlan();
    },
    
    // --- FIREBASE SETUP & AUTHENTICATION ---
    initFirebase() {
        const firebaseConfig = {
            apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
            authDomain: "flamea.firebaseapp.com",
            projectId: "flamea",
            storageBucket: "flamea.appspot.com",
            messagingSenderId: "681868881622",
            appId: "1:681868881622:web:d20687c688b2d1d943a377",
            measurementId: "G-MX7X9JQE51"
        };

        try {
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.auth = getAuth(app);
            console.log("Firebase initialized successfully.");
            this.updateConnectionStatus("Connected");

            // Listen for authentication state changes
            onAuthStateChanged(this.auth, async (user) => {
                if (user) {
                    this.userId = user.uid;
                    console.log("User is signed in:", this.userId);
                    this.elements.userIdDisplay.textContent = this.userId.substring(0, 8) + "...";
                } else {
                    console.log("User is not signed in. Attempting anonymous sign-in.");
                    try {
                        await signInAnonymously(this.auth);
                    } catch (error) {
                        console.error("Anonymous sign-in failed:", error);
                        this.updateConnectionStatus("Authentication Failed");
                    }
                }
                this.isAuthReady = true;
            });
        } catch (error) {
            console.error("Error initializing Firebase:", error);
            this.updateConnectionStatus("Connection Failed");
        }
    },
    
    updateConnectionStatus(status) {
        if (this.elements.connectionStatus) {
            this.elements.connectionStatus.textContent = status;
            this.elements.connectionStatus.className = status === "Connected" ? "text-green-400" : 
                                                       status.includes("Failed") ? "text-red-400" : "text-yellow-400";
        }
    },
    
    // Utility to pause execution until Firebase Auth state is resolved
    waitForAuth() {
        return new Promise(resolve => {
            const checkAuth = () => {
                if (this.isAuthReady) {
                    resolve();
                } else {
                    setTimeout(checkAuth, 50);
                }
            };
            checkAuth();
        });
    },

    // --- DATA MANAGEMENT ---
    getDefaultPlanData() {
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

    async loadOrCreatePlan() {
        if (!this.userId) {
            console.error("Cannot load plan: userId is not set.");
            return;
        }

        this.planId = `plan_${this.userId}`;
        this.elements.planIdDisplay.textContent = this.planId.substring(0, 15) + "...";
        const planRef = doc(this.db, "parenting_plans", this.planId);
        
        // Detach any existing listener before creating a new one
        if (this.unsubscribe) this.unsubscribe();

        try {
            // First, try to get the document to see if it exists
            const docSnap = await getDoc(planRef);
            
            if (!docSnap.exists()) {
                console.log("No existing plan found. Creating a new one.");
                this.planData = this.getDefaultPlanData();
                await this.savePlan();
            }

            // Now set up the real-time listener
            this.unsubscribe = onSnapshot(planRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Plan data loaded from Firestore.");
                    this.planData = docSnap.data();
                    
                    // Ensure all required data structures exist
                    this.validateDataStructure();
                    
                    this.isDataLoaded = true;
                    this.updateConnectionStatus("Connected");
                    this.updateUIFromState();
                } else {
                    console.error("Document does not exist even after creation attempt.");
                    this.updateConnectionStatus("Data Load Failed");
                }
            }, (error) => {
                console.error("Error listening to plan updates:", error);
                this.updateConnectionStatus("Connection Error");
            });

        } catch (error) {
            console.error("Error in loadOrCreatePlan:", error);
            this.updateConnectionStatus("Load Failed");
        }
    },

    validateDataStructure() {
        // Ensure all required nested objects exist
        if (!this.planData.schedule) {
            this.planData.schedule = { custodyStatus: 'mutual_agreement', custodyDetails: '', events: [] };
        }
        if (!this.planData.schedule.events || !Array.isArray(this.planData.schedule.events)) {
            this.planData.schedule.events = [];
        }
        if (!this.planData.parties) {
            this.planData.parties = {
                parentA: { role: 'Father', name: '', addresses: [], contacts: [] },
                parentB: { role: 'Mother', name: '', addresses: [], contacts: [] },
                children: []
            };
        }
        if (!this.planData.communication) {
            this.planData.communication = { methods: '', disputeResolution: '' };
        }
        if (!this.planData.finances) {
            this.planData.finances = { categories: [] };
        }
        if (!this.planData.activityLog) {
            this.planData.activityLog = [];
        }
    },

    async savePlan() {
        if (!this.planId || !this.userId) {
            console.error("Cannot save: planId or userId is not set.");
            return;
        }
        
        console.log("Saving plan data to Firestore...");
        
        // Ensure the data structure is valid
        if (!this.planData.metadata) {
            this.planData.metadata = {
                version: "2.0",
                createdAt: new Date().toISOString(),
                ownerId: this.userId,
                authorizedUsers: [this.userId],
            };
        }
        
        this.planData.metadata.lastModified = new Date().toISOString();
        
        const planRef = doc(this.db, "parenting_plans", this.planId);
        try {
            await setDoc(planRef, this.planData, { merge: true });
            console.log("Plan saved successfully.");
            this.updateConnectionStatus("Saved");
            
            // Reset status after 2 seconds
            setTimeout(() => {
                this.updateConnectionStatus("Connected");
            }, 2000);
        } catch (error) {
            console.error("Error saving plan to Firestore:", error);
            this.updateConnectionStatus("Save Failed");
        }
    },
    
    updateUIFromState() {
        console.log("Updating UI from state...");
        // Update calendar if it exists and is visible
        if (this.calendar && this.planData.schedule && this.planData.schedule.events) {
            this.calendar.removeAllEvents();
            this.calendar.addEventSource(this.planData.schedule.events);
        }
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
            cancelBtn: document.getElementById('cancel-btn'),
            planIdDisplay: document.getElementById('plan-id-display'),
            userIdDisplay: document.getElementById('user-id-display'),
            connectionStatus: document.getElementById('connection-status'),
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
        this.elements.cancelBtn.addEventListener('click', () => this.closeSectionModal());
        this.elements.saveSectionBtn.addEventListener('click', () => this.saveCurrentSection());
        
        // Close modal when clicking outside
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeSectionModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown