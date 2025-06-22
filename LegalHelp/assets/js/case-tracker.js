import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, addDoc, setDoc, onSnapshot, collection, query, updateDoc, arrayUnion, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// This function will be exported and called from the HTML file
export function initializeCaseTracker(firebaseConfig, appId) {
    // --- VARIABLE DECLARATIONS ---
    let app, auth, db;
    let currentUserId = null;
    let currentCaseId = null;
    let casesUnsubscribe = null; // To detach the Firestore listener
    let stepsUnsubscribe = null;  // To detach the listener for a single case's steps

    // --- DOM ELEMENT REFERENCES ---
    const loginGate = document.getElementById('login-gate');
    const mainContent = document.getElementById('main-content');
    const userIdDisplay = document.getElementById('user-id-display');
    const dashboardView = document.getElementById('dashboard-view');
    const casesList = document.getElementById('cases-list');
    const noCasesMessage = document.getElementById('no-cases-message');
    const detailView = document.getElementById('detail-view');
    const detailCaseName = document.getElementById('detail-case-name');
    const detailCaseType = document.getElementById('detail-case-type');
    const stepsContainer = document.getElementById('steps-container');
    const startNewCaseBtn = document.getElementById('start-new-case-btn');
    const backToDashboardBtn = document.getElementById('back-to-dashboard-btn');
    const newCaseModal = document.getElementById('new-case-modal');
    const newCaseForm = document.getElementById('new-case-form');
    const cancelNewCaseBtn = document.getElementById('cancel-new-case-btn');
    const customStepArea = document.getElementById('custom-step-area');
    const addCustomStepBtn = document.getElementById('add-custom-step-btn');
    const customStepNameInput = document.getElementById('custom-step-name');
    const customStepDescInput = document.getElementById('custom-step-desc');

    // --- PREDEFINED CASE TEMPLATES ---
    const caseTemplates = {
        childrensCourt: {
            name: "Children's Court Case",
            steps: [
                { name: "Initiation: File Documents", description: "Complete and file the correct forms (e.g., Form 2) and any supporting affidavits at the Children's Court clerk.", documents: [{name: "Form 2", acquired: false}, {name: "Supporting Affidavit", acquired: false}] },
                { name: "Service of Documents", description: "Arrange for the documents to be served on the other party. You can use the SAPS (free) or a Sheriff (paid).", documents: [{name: "Proof of Service", acquired: false}]},
                { name: "First Court Appearance", description: "Both parties attend court. The magistrate may issue a preliminary order, final order, or postpone the case.", documents: [{name: "Notice of Set Down", acquired: false}]},
                { name: "Family Advocate Referral (if applicable)", description: "If ordered by the court, attend an appointment with the Family Advocate for an investigation and report.", documents: [{name: "Court Order", acquired: false}]},
                { name: "Receive Family Advocate Report", description: "The Family Advocate's report and recommendations are made available to both parties and the court." , documents: [{name: "Family Advocate Report", acquired: false}]},
                { name: "Submit Final Arguments", description: "File your final heads of argument by the date provided by the court.", documents: [{name: "Heads of Argument", acquired: false}]},
                { name: "Final Hearing & Judgment", description: "Attend the final hearing where a judgment will be handed down.", documents: [{name: "Final Court Order", acquired: false}]},
            ]
        },
        smallClaims: {
            name: "Small Claims Court Case",
            steps: [
                { name: "Send Letter of Demand", description: "Send a formal Letter of Demand to the person you are claiming from, giving them 14 days to pay.", documents: [{name: "Copy of Letter of Demand", acquired: false}, {name: "Proof of Sending (e.g., registered mail slip)", acquired: false}]},
                { name: "Issue Summons", description: "If not paid, go to the Small Claims Court clerk to issue a summons. The clerk will help you.", documents: [{name: "Summons", acquired: false}]},
                { name: "Serve the Summons", description: "The summons must be served by the Sheriff of the Court.", documents: [{name: "Sheriff's Return of Service", acquired: false}]},
                { name: "Court Hearing", description: "Attend the court hearing on the specified date. No lawyers are allowed. Present your case to the Commissioner.", documents: []},
                { name: "Judgment", description: "The Commissioner will make a judgment either on the day or at a later date.", documents: [{name: "Written Judgment", acquired: false}]},
            ]
        },
        lobola: {
            name: "Lobola Negotiations",
            steps: [
                { name: "Initial Family Meeting (Groom's side)", description: "The groom's family meets to discuss the intention to marry and appoint negotiators (oonozakuzaku).", documents: []},
                { name: "Sending the Letter (or delegation)", description: "A formal request for a meeting is sent from the groom's family to the bride's family.", documents: [{name: "Copy of Letter (if applicable)", acquired: false}]},
                { name: "Bride's Family Acceptance & Preparation", description: "The bride's family receives the request, discusses it, and prepares to host the delegation.", documents: []},
                { name: "First Negotiation Meeting", description: "The delegations meet. This often starts with 'imvulamlomo' (the mouth opener) and the negotiators state their purpose.", documents: []},
                { name: "Agreement on Lobola Amount/Items", description: "After discussions, an agreement is reached on the lobola amount (e.g., number of cows or monetary equivalent).", documents: [{name: "Written Agreement / Notes", acquired: false}]},
                { name: "First Payment / Delivery", description: "A portion of the lobola is paid or delivered as a sign of commitment.", documents: []},
                { name: "Welcoming the Bride (if applicable)", description: "Cultural ceremonies to formally welcome the bride into her new family.", documents: []},
            ]
        },
        custom: { name: "Custom Process", steps: [] }
    };

    // --- INITIALIZATION & AUTH ---
    function initializeFirebase() {
        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            auth = getAuth(app);
            setupAuthListener();
        } catch (error) {
            console.error("Firebase Initialization Error:", error);
        }
    }

    async function setupAuthListener() {
        await setPersistence(auth, browserLocalPersistence);
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUserId = user.uid;
                userIdDisplay.textContent = currentUserId;
                loginGate.style.display = 'none';
                mainContent.style.display = 'block';
                fetchAndRenderCases(currentUserId);
            } else {
                 try {
                     const token = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
                     if (token) { await signInWithCustomToken(auth, token); } 
                     else { await signInAnonymously(auth); }
                 } catch (error) {
                    console.error("Authentication failed:", error);
                    currentUserId = null;
                    userIdDisplay.textContent = 'Not authenticated';
                    mainContent.style.display = 'none';
                    loginGate.style.display = 'block';
                    if (casesUnsubscribe) casesUnsubscribe();
                    if (stepsUnsubscribe) stepsUnsubscribe();
                 }
            }
        });
    }

    // --- DATA FETCHING & RENDERING ---
    function fetchAndRenderCases(userId) {
        if (casesUnsubscribe) casesUnsubscribe();
        const casesRef = collection(db, "artifacts", appId, "users", userId, "cases");
        const q = query(casesRef);
        casesUnsubscribe = onSnapshot(q, (querySnapshot) => {
            if (querySnapshot.empty) {
                casesList.innerHTML = '';
                noCasesMessage.style.display = 'block';
            } else {
                noCasesMessage.style.display = 'none';
                casesList.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    casesList.appendChild(createCaseCard(doc.id, doc.data()));
                });
            }
        }, console.error);
    }
    
    function createCaseCard(id, data) {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col';
        card.dataset.caseId = id;
        
        const totalSteps = data.steps?.length || 0;
        const completedSteps = data.steps?.filter(step => step.status === 'done').length || 0;
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

        card.innerHTML = `
            <h3 class="font-bold text-xl text-white mb-2 flex-grow">${data.caseName}</h3>
            <p class="text-sm text-gray-400 mb-4 font-mono">${data.templateName || 'Custom Process'}</p>
            <div class="w-full bg-gray-700 rounded-full h-2.5">
                <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${progress}%"></div>
            </div>
            <p class="text-xs text-gray-500 mt-2">${completedSteps} of ${totalSteps} steps completed</p>
        `;
        card.addEventListener('click', () => showDetailView(id));
        return card;
    }

    function renderCaseDetails(caseId) {
        if (stepsUnsubscribe) stepsUnsubscribe();
        const caseRef = doc(db, "artifacts", appId, "users", currentUserId, "cases", caseId);
        stepsUnsubscribe = onSnapshot(caseRef, (doc) => {
            if (!doc.exists()) return showDashboardView();
            const caseData = doc.data();
            currentCaseId = doc.id;
            detailCaseName.textContent = caseData.caseName;
            detailCaseType.textContent = caseData.templateName || 'Custom Process';
            stepsContainer.innerHTML = '';
            
            if (caseData.steps?.length) {
                caseData.steps.forEach((step, index) => {
                    stepsContainer.appendChild(createStepElement(step, index, doc.id));
                });
            } else {
                stepsContainer.innerHTML = `<p class="text-gray-500 italic">No steps here yet.</p>`;
            }
            customStepArea.style.display = caseData.caseType === 'custom' ? 'block' : 'none';
        }, console.error);
    }

    function createStepElement(step, index, caseId) {
        const div = document.createElement('div');
        div.className = `step-item p-4 rounded-r-lg bg-gray-800/50 status-${step.status || 'todo'}`;
        
        const documentsHTML = !step.documents?.length ? '<p class="text-xs text-gray-500 mt-2">No documents listed.</p>' : step.documents.map((doc, docIndex) => `
            <label class="flex items-center space-x-2 text-sm text-gray-300">
                <input type="checkbox" data-doc-index="${docIndex}" ${doc.acquired ? 'checked' : ''} class="form-checkbox h-4 w-4 bg-gray-600 border-gray-500 text-indigo-500 rounded focus:ring-indigo-600">
                <span>${doc.name}</span>
            </label>
        `).join('');
        
        div.innerHTML = `
            <div class="flex justify-between items-start gap-4">
                <div class="flex-grow">
                    <h4 class="font-bold text-lg text-white">${step.name}</h4>
                    <p class="text-gray-400 text-sm mt-1">${step.description || ''}</p>
                </div>
                <select data-step-index="${index}" class="status-dropdown p-2 text-sm rounded-md bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="todo" ${step.status === 'todo' ? 'selected' : ''}>To Do</option>
                    <option value="inprogress" ${step.status === 'inprogress' ? 'selected' : ''}>In Progress</option>
                    <option value="done" ${step.status === 'done' ? 'selected' : ''}>Done</option>
                    <option value="postponed" ${step.status === 'postponed' ? 'selected' : ''}>Postponed</option>
                </select>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-700">
                <h5 class="font-semibold text-sm mb-2 text-gray-300">Required Documents</h5>
                <div class="space-y-1">${documentsHTML}</div>
            </div>
             <div class="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-400 mb-1">Target Date</label>
                  <input type="date" value="${step.targetDate || ''}" data-date-type="targetDate" class="w-full rounded-md form-input p-2 text-sm">
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-400 mb-1">Outcome / Notes</label>
                  <textarea rows="1" data-outcome-text class="w-full rounded-md form-input p-2 text-sm">${step.outcome || ''}</textarea>
                </div>
            </div>
        `;

        // Add event listeners
        let debounceTimer;
        const update = (field, value) => {
             clearTimeout(debounceTimer);
             debounceTimer = setTimeout(() => updateStepField(caseId, index, field, value), 800);
        };
        
        div.querySelector('.status-dropdown').addEventListener('change', e => updateStepField(caseId, index, 'status', e.target.value));
        div.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', e => updateStepDocument(caseId, index, e.target.dataset.docIndex, e.target.checked)));
        div.querySelector('input[type="date"]').addEventListener('input', e => update('targetDate', e.target.value));
        div.querySelector('[data-outcome-text]').addEventListener('input', e => update('outcome', e.target.value));
        
        return div;
    }

    // --- DATA MODIFICATION ---
    async function handleCreateCase(e) {
        e.preventDefault();
        const caseName = newCaseForm.querySelector('#case-name').value;
        const caseType = newCaseForm.querySelector('#case-type').value;
        if (!caseName || !caseType || !currentUserId) return;

        const template = caseTemplates[caseType];
        const newCaseData = {
            userId: currentUserId,
            caseName, caseType,
            templateName: template.name,
            createdAt: serverTimestamp(),
            steps: template.steps.map(step => ({ ...step, status: 'todo' }))
        };

        try {
            await addDoc(collection(db, "artifacts", appId, "users", currentUserId, "cases"), newCaseData);
            closeModal(newCaseModal);
            newCaseForm.reset();
        } catch (error) { console.error("Error creating case: ", error); }
    }
    
    const updateStepInFirestore = async (caseId, updatedSteps) => {
        const caseRef = doc(db, "artifacts", appId, "users", currentUserId, "cases", caseId);
        try {
            await updateDoc(caseRef, { steps: updatedSteps });
        } catch (error) { console.error("Error updating step in Firestore:", error); }
    };
    
    async function getSteps(caseId) {
        const caseRef = doc(db, "artifacts", appId, "users", currentUserId, "cases", caseId);
        const caseSnap = await getDoc(caseRef);
        return caseSnap.exists() ? [...caseSnap.data().steps] : null;
    }

    async function updateStepField(caseId, stepIndex, field, value) {
        const steps = await getSteps(caseId);
        if (steps && steps[stepIndex]) {
            steps[stepIndex][field] = value;
            await updateStepInFirestore(caseId, steps);
        }
    }
    
    async function updateStepDocument(caseId, stepIndex, docIndex, isAcquired) {
        const steps = await getSteps(caseId);
        if (steps && steps[stepIndex]?.documents[docIndex]) {
           steps[stepIndex].documents[docIndex].acquired = isAcquired;
           await updateStepInFirestore(caseId, steps);
        }
    }

    async function handleAddCustomStep() {
        const stepName = customStepNameInput.value;
        const stepDesc = customStepDescInput.value;
        if (!stepName || !currentCaseId) return;

        const newStep = { name: stepName, description: stepDesc, documents: [], status: 'todo' };
        const caseRef = doc(db, "artifacts", appId, "users", currentUserId, "cases", currentCaseId);
        try {
            await updateDoc(caseRef, { steps: arrayUnion(newStep) });
            customStepNameInput.value = '';
            customStepDescInput.value = '';
        } catch (error) { console.error("Error adding custom step: ", error); }
    }

    // --- UI & NAVIGATION ---
    const showDashboardView = () => {
        if (stepsUnsubscribe) stepsUnsubscribe();
        currentCaseId = null;
        detailView.style.display = 'none';
        dashboardView.style.display = 'block';
    };
    
    const showDetailView = (caseId) => {
        dashboardView.style.display = 'none';
        detailView.style.display = 'block';
        renderCaseDetails(caseId);
    };
    
    const openModal = (modal) => modal.classList.add('active');
    const closeModal = (modal) => modal.classList.remove('active');

    // --- EVENT LISTENERS ---
    startNewCaseBtn.addEventListener('click', () => openModal(newCaseModal));
    cancelNewCaseBtn.addEventListener('click', () => closeModal(newCaseModal));
    newCaseModal.addEventListener('click', (e) => { if (e.target === newCaseModal) closeModal(newCaseModal); });
    newCaseForm.addEventListener('submit', handleCreateCase);
    backToDashboardBtn.addEventListener('click', showDashboardView);
    addCustomStepBtn.addEventListener('click', handleAddCustomStep);

    // --- KICK IT ALL OFF ---
    initializeFirebase();
}
