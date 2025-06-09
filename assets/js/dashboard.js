import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, addDoc, query, where, orderBy, updateDoc, deleteDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";
import { getFirebaseConfig } from './firebase-config.js';

// --- INITIALIZATION ---
const firebaseApp = initializeApp(getFirebaseConfig());
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

let userId = null;
let profileCompletenessChart = null;

// --- DOM ELEMENTS ---
const loadingState = document.getElementById('loading-state');
const dashboardContainer = document.getElementById('dashboard-container');
const loginPrompt = document.getElementById('dashboard-login-prompt');

// --- AUTHENTICATION LISTENER ---
onAuthStateChanged(auth, user => {
    if (user) {
        userId = user.uid;
        loadingState.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        initializeDashboard();
    } else {
        userId = null;
        loadingState.classList.add('hidden');
        dashboardContainer.classList.add('hidden');
        // A login prompt specific to the old dashboard code is referenced.
        // I will assume there's a login prompt on the new page to show.
        const newLoginPrompt = document.querySelector('#dashboard-container + div');
        if(newLoginPrompt) newLoginPrompt.classList.remove('hidden');
    }
});

// --- MAIN INITIALIZER ---
function initializeDashboard() {
    setupTabs();
    loadProfileData();
    loadActivitySummary();
    setupTodoSystem();
    setupSkillsSystem();
    setupDocumentSystem();
    // Keep other initializers like for achievements if they exist
}

// --- TAB MANAGEMENT ---
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.toggle('active', content.id === target);
            });
        });
    });
}

// --- PROFILE & OVERVIEW WIDGETS ---
async function loadProfileData() {
    const docRef = doc(db, 'users', userId);
    onSnapshot(docRef, (docSnap) => {
        const profileData = docSnap.exists() ? docSnap.data().profile || {} : {};
        // Populate Life CV (re-using old logic if available)
        // For now, let's just update the welcome message
        document.getElementById('dashboard-welcome').textContent = `Welcome, ${profileData.name || 'User'}`;
        updateProfileCompleteness(profileData);
    });
}

function updateProfileCompleteness(profile) {
    let score = 0;
    const fields = ['name', 'summary', 'linkedin', 'skills', 'experience'];
    fields.forEach(field => {
        if (profile[field] && (typeof profile[field] === 'string' ? profile[field].trim() !== '' : profile[field].length > 0)) {
            score += 1;
        }
    });
    const percentage = Math.round((score / fields.length) * 100);

    const ctx = document.getElementById('profile-completeness-chart').getContext('2d');
    document.getElementById('profile-completeness-text').textContent = `${percentage}%`;

    if (profileCompletenessChart) profileCompletenessChart.destroy();
    
    profileCompletenessChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [percentage, 100 - percentage],
                backgroundColor: ['#34D399', '#4B5563'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            cutout: '80%',
            plugins: { tooltip: { enabled: false } }
        }
    });
}

// --- ACTIVITY TRACKER SUMMARY ---
function loadActivitySummary() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activitiesRef = collection(db, 'users', userId, 'activities');
    const q = query(activitiesRef, where("date", ">=", thirtyDaysAgo.toISOString().split('T')[0]), orderBy("date", "desc"));
    
    onSnapshot(q, (snapshot) => {
        let totalFinancial = 0;
        let totalTime = 0;
        const recentActivities = [];

        snapshot.forEach(doc => {
            const act = doc.data();
            const userPortion = (act.userContribution || 0) / 100;
             if (act.type === 'financial') {
                totalFinancial += (parseFloat(act.value) || 0) * userPortion;
            } else if (act.type === 'time') {
                totalTime += (parseFloat(act.value) || 0) * userPortion;
            }
            if(recentActivities.length < 3) recentActivities.push(act);
        });

        document.getElementById('summary-financial').textContent = `R ${totalFinancial.toFixed(2)}`;
        document.getElementById('summary-time').textContent = `${totalTime.toFixed(1)} Hrs`;
        renderRecentActivities(recentActivities);
    });
}

function renderRecentActivities(activities) {
    const listEl = document.getElementById('recent-activities-list');
    listEl.innerHTML = '';
    if (activities.length === 0) {
        listEl.innerHTML = '<p class="text-gray-500">No activities logged in the last 30 days.</p>';
        return;
    }
    activities.forEach(act => {
        const item = document.createElement('div');
        item.className = 'bg-gray-800 p-3 rounded-lg flex justify-between items-center';
        item.innerHTML = `<p>${act.title}</p><p class="text-sm text-gray-400">${act.date}</p>`;
        listEl.appendChild(item);
    });
}


// --- TO-DO LIST SYSTEM ---
function setupTodoSystem() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDueDate = document.getElementById('todo-due-date');

    todoForm.addEventListener('submit', async e => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        if (taskText) {
            await addDoc(collection(db, 'users', userId, 'todos'), {
                text: taskText,
                completed: false,
                dueDate: todoDueDate.value || null,
                createdAt: serverTimestamp()
            });
            todoForm.reset();
        }
    });
    
    document.getElementById('add-todo-quick-btn').addEventListener('click', () => {
        document.querySelector('.tab-button[data-tab="todos"]').click();
        todoInput.focus();
    });

    // Listen for changes
    const todosRef = collection(db, 'users', userId, 'todos');
    const q = query(todosRef, orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
        const todos = [];
        snapshot.forEach(doc => todos.push({ id: doc.id, ...doc.data() }));
        renderTodoList(todos);
    });
}

function renderTodoList(todos) {
    const todoListEl = document.getElementById('todo-list');
    const upcomingListEl = document.getElementById('upcoming-todos-list');
    todoListEl.innerHTML = '';
    upcomingListEl.innerHTML = '';
    let overdueCount = 0;
    
    if (todos.length === 0) {
        todoListEl.innerHTML = '<p class="text-gray-500">No tasks yet. Add one above!</p>';
    }

    const today = new Date().toISOString().split('T')[0];

    todos.forEach(todo => {
        const itemEl = document.createElement('div');
        itemEl.className = `todo-item flex items-center justify-between bg-gray-800 p-3 rounded-lg ${todo.completed ? 'completed' : ''}`;
        
        const isOverdue = todo.dueDate && todo.dueDate < today && !todo.completed;
        if(isOverdue) overdueCount++;

        itemEl.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" data-id="${todo.id}" class="h-5 w-5" ${todo.completed ? 'checked' : ''}>
                <div>
                    <p>${todo.text}</p>
                    ${todo.dueDate ? `<p class="text-xs ${isOverdue ? 'text-red-400' : 'text-gray-400'}">Due: ${todo.dueDate}</p>` : ''}
                </div>
            </div>
            <button data-id="${todo.id}" class="delete-todo-btn text-red-500 hover:text-red-700"><i class="fas fa-trash"></i></button>
        `;
        todoListEl.appendChild(itemEl);

        // Populate upcoming list
        if(!todo.completed && upcomingListEl.children.length < 3) {
             upcomingListEl.appendChild(itemEl.cloneNode(true));
        }
    });
    if (upcomingListEl.children.length === 0) upcomingListEl.innerHTML = '<p class="text-gray-500">No upcoming tasks.</p>';
    
    document.getElementById('overdue-tasks-alert').classList.toggle('hidden', overdueCount === 0);

    // Add event listeners
    todoListEl.querySelectorAll('input[type="checkbox"]').forEach(box => box.addEventListener('change', toggleTodoStatus));
    todoListEl.querySelectorAll('.delete-todo-btn').forEach(btn => btn.addEventListener('click', deleteTodo));
}

async function toggleTodoStatus(e) {
    const todoId = e.target.dataset.id;
    await updateDoc(doc(db, 'users', userId, 'todos', todoId), {
        completed: e.target.checked
    });
}

async function deleteTodo(e) {
    const todoId = e.currentTarget.dataset.id;
    await deleteDoc(doc(db, 'users', userId, 'todos', todoId));
}


// --- SKILLS CABINET SYSTEM ---
function setupSkillsSystem() {
    // Modal handling
    const modal = document.getElementById('skill-modal');
    const addBtn = document.getElementById('add-skill-btn');
    const cancelBtn = document.getElementById('cancel-skill-btn');
    const skillForm = document.getElementById('skill-form');

    addBtn.addEventListener('click', () => { 
        skillForm.reset();
        document.getElementById('skill-id').value = '';
        modal.classList.add('active'); 
    });
    cancelBtn.addEventListener('click', () => { modal.classList.remove('active'); });

    // Form submission
    skillForm.addEventListener('submit', async e => {
        e.preventDefault();
        const skillData = {
            name: document.getElementById('skill-name').value,
            type: document.getElementById('skill-type').value,
            proficiency: parseInt(document.getElementById('skill-proficiency').value),
            proof: document.getElementById('skill-proof').value,
        };

        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        const existingProfile = docSnap.exists() ? docSnap.data().profile || {} : {};
        const skills = existingProfile.skills || [];
        
        // This is a simple implementation. A real app would handle edits vs. adds.
        skills.push(skillData);
        
        await setDoc(docRef, { profile: { ...existingProfile, skills } }, { merge: true });
        modal.classList.remove('active');
    });

    // Listen for skills data
    const docRef = doc(db, 'users', userId);
    onSnapshot(docRef, (docSnap) => {
        const skills = docSnap.exists() ? (docSnap.data().profile || {}).skills || [] : [];
        renderSkills(skills);
    });
}

function renderSkills(skills) {
    const listEl = document.getElementById('skills-list');
    listEl.innerHTML = '';
    if (skills.length === 0) {
        listEl.innerHTML = '<p class="text-gray-500 text-center">No skills logged. Click "Add New Skill" to start.</p>';
        return;
    }
    skills.forEach(skill => {
        const itemEl = document.createElement('div');
        itemEl.className = 'bg-gray-800 p-4 rounded-lg';
        itemEl.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-lg">${skill.name}</h4>
                    <span class="text-xs font-semibold ${skill.type === 'formal' ? 'bg-blue-500' : 'bg-green-500'} px-2 py-1 rounded-full">${skill.type}</span>
                </div>
                <button class="text-gray-400 hover:text-white"><i class="fas fa-edit"></i></button>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-400">Proficiency:</p>
                <div class="w-full bg-gray-700 rounded-full h-2.5">
                    <div class="bg-blue-500 h-2.5 rounded-full" style="width: ${skill.proficiency}%"></div>
                </div>
            </div>
            ${skill.proof ? `<a href="${skill.proof}" target="_blank" class="text-blue-400 text-sm mt-2 inline-block hover:underline">View Proof <i class="fas fa-external-link-alt ml-1"></i></a>` : ''}
        `;
        listEl.appendChild(itemEl);
    });
}

// --- DOCUMENT CABINET SYSTEM ---
function setupDocumentSystem() {
    const fileInput = document.getElementById('doc-file-input');
    const uploadContainer = document.getElementById('doc-upload-container');

    fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            uploadDocument(file);
        }
    });
    
    // Listen for documents
    const docsRef = collection(db, 'users', userId, 'documents');
    onSnapshot(docsRef, (snapshot) => {
        const docs = [];
        snapshot.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
        renderDocuments(docs);
    });
}

function uploadDocument(file) {
    const progressEl = document.getElementById('upload-progress');
    const filePath = `users/${userId}/documents/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progressEl.textContent = `Uploading: ${Math.round(progress)}%`;
            progressEl.classList.remove('hidden');
        }, 
        (error) => {
            console.error("Upload failed:", error);
            progressEl.textContent = 'Upload Failed!';
        }, 
        async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, 'users', userId, 'documents'), {
                name: file.name,
                url: downloadURL,
                type: file.type,
                size: file.size,
                uploadedAt: serverTimestamp()
            });
            progressEl.classList.add('hidden');
        }
    );
}

function renderDocuments(docs) {
    const listEl = document.getElementById('document-list');
    listEl.innerHTML = '';
    if (docs.length === 0) {
        listEl.innerHTML = '<p class="text-gray-500 col-span-full text-center">No documents uploaded.</p>';
        return;
    }
    docs.forEach(doc => {
        const itemEl = document.createElement('a');
        itemEl.href = doc.url;
        itemEl.target = '_blank';
        itemEl.className = 'bg-gray-900 p-4 rounded-lg block hover:bg-gray-800';
        // Simple icon logic
        let icon = 'fa-file';
        if (doc.type.includes('pdf')) icon = 'fa-file-pdf';
        if (doc.type.includes('image')) icon = 'fa-file-image';

        itemEl.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${icon} text-3xl text-blue-400"></i>
                <p class="ml-4 font-semibold truncate">${doc.name}</p>
            </div>
        `;
        listEl.appendChild(itemEl);
    });
}
