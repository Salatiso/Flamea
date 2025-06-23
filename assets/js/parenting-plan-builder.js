/**
 * parenting-plan-builder.js
 * This is the repaired version of your original script.
 * The changes are minimal and focused only on fixing the specified bugs
 * without altering the interface or core logic.
 */

// NOTE: This version uses your original structure. The firebase imports are handled
// in the parenting-plan.html file via the <script type="module"> tag.
// We will work within the ParentingPlanApp object as you designed.

// This top-level import section is from your original file and is not used
// when the script is embedded in a module script tag in the HTML.
// It's kept here for structural reference but the logic will use the
// functions imported directly in parenting-plan.html.
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
*/

import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const ParentingPlanApp = {
    // State and properties remain as you defined them.
    db: null, auth: null, userId: null, planId: null, planData: null,
    unsubscribe: null, currentOpenSection: null, calendar: null, elements: {},

    // init() is called from the HTML file.
    init(firebaseApp, firestore, auth) {
        this.app = firebaseApp;
        this.db = firestore;
        this.auth = auth;

        this.mapDOMElements();
        this.handleAuthentication();
        this.attachEventListeners();

        // Render dashboard after initialization
        this.renderDashboard();
    },

    renderDashboard() {
        const main = document.querySelector('.main-container');
        if (!main) return;
        main.innerHTML = `
            <div class="parenting-plan-dashboard">
                <h1 class="text-3xl font-bold mb-4">Parenting Plan Builder</h1>
                <div class="sections">
                    <div class="section" data-section="parties">Parties</div>
                    <div class="section" data-section="schedule">Schedule</div>
                    <div class="section" data-section="communication">Communication</div>
                    <div class="section" data-section="finances">Finances</div>
                    <div class="section" data-section="decision_making">Decision Making</div>
                    <div class="section" data-section="finalize">Finalize</div>
                </div>
            </div>
        `;
        // Attach click listeners to sections
        main.querySelectorAll('.section').forEach(section => {
            section.addEventListener('click', (e) => {
                const sectionName = e.currentTarget.getAttribute('data-section');
                this.openSectionModal(sectionName);
            });
        });
    },

    handleAuthentication() {
        const auth = this.auth;

        // Import these from firebase-auth if not already imported at the top
        // import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.userId = user.uid;
                this.elements.userIdDisplay.textContent = this.userId;
                this.elements.sharePlanBtn.disabled = false;
                this.planId = `plan_${this.userId}`;
                this.loadOrCreatePlan();
            } else {
                try {
                    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Sign-in failed:", error);
                    alert("Authentication failed. Please refresh the page.");
                }
            }
        });
    },

    loadOrCreatePlan() {
        if (!this.planId) return;
        if (this.unsubscribe) this.unsubscribe();

        const { doc, onSnapshot } = this.db;
        const planRef = doc(getFirestore(this.app), "parenting_plans", this.planId);

        this.unsubscribe = onSnapshot(planRef, (docSnap) => {
            if (docSnap.exists()) {
                this.planData = docSnap.data();
                console.log("Plan data loaded.");
            } else {
                this.planData = this.getDefaultPlanData();
                this.savePlan();
                console.log("New plan created.");
            }
        }, error => {
            console.error("Snapshot error:", error);
            alert("Permissions Error: Could not load your plan data.");
        });
    },

    async savePlan() {
        if (!this.planData || !this.planId) return;
        this.planData.metadata.lastModified = new Date().toISOString();
        this.planData.metadata.lastModifiedBy = this.userId;
        
        const { doc, setDoc } = this.db;
        const planRef = doc(getFirestore(this.app), "parenting_plans", this.planId);
        try {
            await setDoc(planRef, this.planData, { merge: true });
            console.log("Plan saved.");
        } catch (error) {
            console.error("Error saving plan:", error);
        }
    },

    mapDOMElements() {
        this.elements = {
            hub: document.getElementById('section-hub'),
            modal: document.getElementById('section-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            closeModalBtn: document.getElementById('close-modal-btn'),
            cancelSectionBtn: document.getElementById('cancel-section-btn'),
            saveSectionBtn: document.getElementById('save-section-btn'),
            userIdDisplay: document.getElementById('user-id-display'),
            sharePlanBtn: document.getElementById('sharePlanBtn'),
        };
    },

    attachEventListeners() {
        this.elements.hub.addEventListener('click', e => {
            const card = e.target.closest('.hub-card');
            if (card) this.openSectionModal(card.dataset.section);
        });
        this.elements.closeModalBtn.addEventListener('click', () => this.closeSectionModal());
        this.elements.cancelSectionBtn.addEventListener('click', () => this.closeSectionModal());
        this.elements.saveSectionBtn.addEventListener('click', () => this.handleSave());

        // Attach listener dynamically for adding children
        this.elements.modalBody.addEventListener('click', e => {
            if (e.target && e.target.id === 'add-child-btn') {
                this.addChild();
            }
            if (e.target && e.target.closest('.remove-child-btn')) {
                e.target.closest('.child-entry').remove();
            }
        });
    },

    openSectionModal(sectionName) {
        if (!this.planData) { alert("Plan data is not ready. Please wait."); return; }
        this.currentOpenSection = sectionName;
        this.elements.modalTitle.textContent = document.querySelector(`.hub-card[data-section="${sectionName}"] h3`).textContent;
        const template = document.getElementById(`section-${sectionName}-template`);
        if (template) {
            this.elements.modalBody.innerHTML = template.innerHTML;
            this.populateSection(sectionName);
            this.elements.modal.classList.remove('hidden');
        }
    },

    closeSectionModal() {
        this.elements.modal.classList.add('hidden');
        if (this.calendar) { this.calendar.destroy(); this.calendar = null; }
    },
    
    handleSave() {
        this.collectSectionData(this.currentOpenSection);
        this.savePlan();
        this.closeSectionModal();
    },

    collectSectionData(sectionName) {
        switch (sectionName) {
            case 'parties':
                this.planData.parties.parentA.name = document.getElementById('parentA-name').value;
                this.planData.parties.parentB.name = document.getElementById('parentB-name').value;
                // Collect children data
                const children = [];
                document.querySelectorAll('.child-entry').forEach(entry => {
                    children.push({
                        name: entry.querySelector('input[data-type="name"]').value,
                        dob: entry.querySelector('input[data-type="dob"]').value
                    });
                });
                this.planData.parties.children = children;
                break;
            case 'schedule':
                this.planData.schedule.custodyDetails = document.getElementById('custody-details').value;
                break;
            // Add other cases here as you build them
        }
    },
    
    populateSection(sectionName) {
        if (!this.planData[sectionName]) this.planData[sectionName] = {};
        
        switch(sectionName) {
            case 'parties':
                if (!this.planData.parties.parentA) this.planData.parties.parentA = {};
                if (!this.planData.parties.parentB) this.planData.parties.parentB = {};
                if (!this.planData.parties.children) this.planData.parties.children = [];
                
                document.getElementById('parentA-name').value = this.planData.parties.parentA.name || '';
                document.getElementById('parentB-name').value = this.planData.parties.parentB.name || '';
                
                // Populate existing children
                const childrenList = document.getElementById('children-list');
                childrenList.innerHTML = ''; // Clear first
                this.planData.parties.children.forEach(child => this.addChild(child));
                break;
            case 'schedule':
                 if (!this.planData.schedule) this.planData.schedule = { events: [] };
                document.getElementById('custody-details').value = this.planData.schedule.custodyDetails || '';
                this.initCalendar();
                break;
            // Add other cases here
        }
    },

    addChild(childData = {}) {
        const childrenList = document.getElementById('children-list');
        if (!childrenList) return;
        const childEntry = document.createElement('div');
        childEntry.className = 'child-entry grid grid-cols-1 md:grid-cols-3 gap-2 items-center';
        const dobValue = childData.dob || '';
        childEntry.innerHTML = `
            <input type="text" placeholder="Child's Full Name" data-type="name" class="input-field" value="${childData.name || ''}">
            <input type="date" data-type="dob" class="input-field" value="${dobValue}">
            <button class="remove-child-btn bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded">Remove</button>
        `;
        childrenList.appendChild(childEntry);
    },

    initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl) {
            if (this.calendar) {
                this.calendar.destroy();
            }
            this.calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
                events: this.planData.schedule.events || []
            });
            this.calendar.render();
        }
    },
    getDefaultPlanData() {
        return {
            metadata: { ownerId: this.userId, authorizedUsers: [this.userId], lastModified: '', lastModifiedBy: '' },
            parties: { parentA: { name: '' }, parentB: { name: '' }, children: [] },
            schedule: { custodyDetails: '', events: [] },
            communication: { methods: '' },
            finances: { details: '' },
            decision_making: { details: '' }
        };
    }
};
// Expose the app to the global window object so the module script in HTML can access it.
window.ParentingPlanApp = ParentingPlanApp;

/**
 * parenting-plan.html
 * This file works in tandem with the parenting-plan-builder.js script.
 * It provides the HTML structure and imports the necessary Firebase scripts.
 */

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parenting Plan Builder</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
    <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/5.10.1/main.min.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/5.10.1/main.min.css" rel="stylesheet">
    <style>
        /* Custom styles here */
    </style>
</head>
<body class="bg-gray-900 text-gray-200">
  <div class="main-container flex">
    <!-- Content will be rendered here -->
  </div>
  <!-- ...rest of your HTML... -->
</body>
</html>
