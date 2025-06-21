/**
 * parenting-plan-builder.js
 * Fixed version with proper error handling and data synchronization
 */

// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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
    calendar: null,    // Store calendar instance
    isDataLoaded: false, // Flag to track if initial data is loaded

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

            // Listen for authentication state changes
            onAuthStateChanged(this.auth, async (user) => {
                if (user) {
                    this.userId = user.uid;
                    console.log("User is signed in:", this.userId);
                    this.elements.userIdDisplay.textContent = this.userId;
                } else {
                    console.log("User is not signed in. Attempting anonymous sign-in.");
                    try {
                        await signInAnonymously(this.auth);
                    } catch (error) {
                        console.error("Anonymous sign-in failed:", error);
                        alert("Authentication failed. Please refresh the page and try again.");
                    }
                }
                this.isAuthReady = true;
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
                events: [] // Ensure this is always an array
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
        this.elements.planIdDisplay.textContent = this.planId;
        const planRef = doc(this.db, "parenting_plans", this.planId);
        
        // Detach any existing listener before creating a new one
        if (this.unsubscribe) this.unsubscribe();

        try {
            // First, try to get the document to see if it exists
            const docSnap = await getDoc(planRef);
            
            if (!docSnap.exists()) {
                console.log("No existing plan found. Creating a new one.");
                this.planData = this.getDefaultPlanData();
                await this.savePlan(); // Create the initial document
            }

            // Now set up the real-time listener
            this.unsubscribe = onSnapshot(planRef, (docSnap) => {
                if (docSnap.exists()) {
                    console.log("Plan data loaded from Firestore.");
                    this.planData = docSnap.data();
                    
                    // Ensure schedule.events exists and is an array
                    if (!this.planData.schedule) {
                        this.planData.schedule = { custodyStatus: 'mutual_agreement', custodyDetails: '', events: [] };
                    }
                    if (!this.planData.schedule.events || !Array.isArray(this.planData.schedule.events)) {
                        this.planData.schedule.events = [];
                    }
                    
                    this.isDataLoaded = true;
                    this.updateUIFromState();
                } else {
                    console.error("Document does not exist even after creation attempt.");
                }
            }, (error) => {
                console.error("Error listening to plan updates:", error);
                alert("Error loading plan data. Please check your connection and refresh the page.");
            });

        } catch (error) {
            console.error("Error in loadOrCreatePlan:", error);
            alert("Error accessing plan data. Please refresh the page and try again.");
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
        } catch (error) {
            console.error("Error saving plan to Firestore:", error);
            alert("Error saving plan. Please try again.");
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
            planIdDisplay: document.getElementById('plan-id-display'),
            userIdDisplay: document.getElementById('user-id-display'),
            pdfOutput: document.getElementById('pdf-output'),
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
        
        // Close modal when clicking outside
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeSectionModal();
            }
        });
    },
    
    // --- MODAL & SECTION LOGIC ---
    openSectionModal(sectionName) {
        // Don't open modal if data isn't loaded yet
        if (!this.isDataLoaded) {
            console.log("Data not loaded yet, please wait...");
            return;
        }

        this.elements.modalTitle.textContent = this.getSectionTitle(sectionName);
        this.elements.modalBody.innerHTML = this.getSectionTemplate(sectionName);
        this.elements.modal.classList.remove('hidden');

        // After injecting HTML, initialize section-specific logic
        if (sectionName === 'schedule') {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                this.initCalendar();
            }, 100);
        }
        
        // Populate the opened section with data from the state
        this.populateSection(sectionName);
    },

    closeSectionModal() {
        this.elements.modal.classList.add('hidden');
        this.elements.modalBody.innerHTML = '';
        
        // Clean up calendar instance
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
        console.log(`Populating modal for section: ${sectionName}`);
        
        // Example: populate schedule section
        if (sectionName === 'schedule' && this.planData.schedule) {
            const custodySelect = document.getElementById('custody-status');
            const custodyDetails = document.getElementById('custody-details');
            
            if (custodySelect && this.planData.schedule.custodyStatus) {
                custodySelect.value = this.planData.schedule.custodyStatus;
            }
            
            if (custodyDetails && this.planData.schedule.custodyDetails) {
                custodyDetails.value = this.planData.schedule.custodyDetails;
            }
        }
    },

    initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) {
            console.error("Calendar element not found!");
            return;
        }

        // Ensure we have events data
        const events = (this.planData.schedule && this.planData.schedule.events) ? this.planData.schedule.events : [];
        
        try {
            this.calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,listWeek'
                },
                editable: true,
                selectable: true,
                events: events,
                
                // Event handlers
                eventClick: (info) => {
                    console.log('Event clicked:', info.event);
                },
                
                select: (info) => {
                    const title = prompt('Enter event title:');
                    if (title) {
                        const newEvent = {
                            title: title,
                            start: info.startStr,
                            end: info.endStr,
                            id: Date.now().toString() // Simple ID generation
                        };
                        
                        // Add to calendar
                        this.calendar.addEvent(newEvent);
                        
                        // Add to data and save
                        if (!this.planData.schedule.events) {
                            this.planData.schedule.events = [];
                        }
                        this.planData.schedule.events.push(newEvent);
                        this.savePlan();
                    }
                    this.calendar.unselect();
                }
            });
            
            this.calendar.render();
            console.log("Calendar initialized successfully");
            
        } catch (error) {
            console.error("Error initializing calendar:", error);
        }
    },
};

// --- DOCUMENT READY ---
document.addEventListener('DOMContentLoaded', () => {
    window.parentingPlanApp = ParentingPlanApp; 
    ParentingPlanApp.init();
});