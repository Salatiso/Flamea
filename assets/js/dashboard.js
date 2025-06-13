<!-- dashboard.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FLAMEA - Your Command Centre</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body { font-family: 'Open Sans', sans-serif; }
        .main-container { display: grid; grid-template-columns: 280px 1fr; height: 100vh; width: 100vw; overflow: hidden; }
        .main-content { overflow-y: auto; scroll-behavior: smooth; }
        .sidebar-direct-link { transition: all 0.3s ease; }
        .sidebar-direct-link:hover, .sidebar-direct-link.active { background-color: #2563EB; color: white; }
        .tab-button { transition: all 0.2s; border-bottom: 3px solid transparent; }
        .tab-button.active { border-color: #34D399; color: #6EE7B7; }
        .tab-content { display: none; animation: fadeIn 0.5s; }
        .tab-content.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .todo-item.completed label { text-decoration: line-through; color: #6b7280; }
    </style>
</head>
<body class="bg-gray-800 text-white">
    <div class="main-container">
        <!-- Sidebar Navigation -->
        <aside class="bg-gray-900 p-6 flex flex-col">
            <div class="mb-12 flex justify-center">
                <a href="index.html" class="flamea-logo dark">
                    <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" aria-label="Flamea Home">
                        <text class="logo-text" x="0" y="45" font-family="Roboto Slab, serif" font-size="50" font-weight="700" fill="white">Flame</text>
                        <g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"/></g>
                        <line x1="0" y1="58" x2="171" y2="58" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </a>
            </div>
            <nav id="main-nav" class="flex flex-col space-y-2 flex-grow">
                <a href="index.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-home w-6 text-center mr-3"></i> Home</a>
                <a href="dashboard.html" class="sidebar-direct-link active flex items-center p-3 rounded-lg bg-blue-600"><i class="fas fa-tachometer-alt w-6 text-center mr-3"></i> Dashboard</a>
                <a href="tools.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-tools w-6 text-center mr-3"></i> Our Tools</a>
                <a href="training.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-chalkboard-teacher w-6 text-center mr-3"></i> Training Hub</a>
                <a href="resources.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-book-open w-6 text-center mr-3"></i> Resources</a>
                <a href="community.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-users w-6 text-center mr-3"></i> Community</a>
                <div class="border-t border-gray-700 my-2"></div>
                <button data-modal-target="chatbot-modal" class="sidebar-direct-link flex items-center p-3 rounded-lg w-full text-left"><i class="fas fa-robot w-6 text-center mr-3 text-purple-400"></i> AI Legal Assistant</button>
                <button data-modal-target="podcast-modal" class="sidebar-direct-link flex items-center p-3 rounded-lg w-full text-left"><i class="fas fa-podcast w-6 text-center mr-3 text-pink-400"></i> FLAMEA Podcast</button>
                <a href="assessment.html" class="sidebar-direct-link flex items-center p-3 rounded-lg"><i class="fas fa-clipboard-check w-6 text-center mr-3 text-teal-400"></i> Needs Assessment</a>
            </nav>
            <div class="mt-auto text-center">
                <div id="auth-links-desktop" class="mb-4">
                    <!-- Auth links will be populated by auth.js -->
                </div>
                <p class="text-xs text-gray-500">&copy; <span id="currentYear"></span> Flamea.org</p>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content p-8 md:p-12">
            <!-- Loading State -->
            <div id="loading-state" class="text-center mt-20">
                <i class="fas fa-spinner fa-spin text-4xl text-green-400"></i>
                <p class="text-lg mt-4">Loading Your Command Centre...</p>
            </div>
            
            <!-- Main Dashboard Container (hidden by default) -->
            <div id="dashboard-container" class="max-w-7xl mx-auto hidden">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 id="dashboard-welcome" class="text-4xl font-bold font-roboto-slab text-white">My Command Centre</h2>
                        <p id="dashboard-email" class="text-lg text-gray-400">Your central hub for growth.</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <img id="user-avatar" src="https://placehold.co/64x64/374151/9ca3af?text=Avatar" alt="User Avatar" class="w-16 h-16 rounded-full border-2 border-green-400 object-cover">
                        <label for="profile-image-upload" class="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            <i class="fas fa-camera mr-2"></i> Change
                            <input type="file" id="profile-image-upload" class="hidden" accept="image/*">
                        </label>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div class="border-b border-gray-700 mb-8">
                    <nav id="dashboard-tabs" class="flex flex-wrap -mb-px" aria-label="Tabs">
                        <button class="tab-button active text-lg py-4 px-6 font-medium" data-tab="overview"><i class="fas fa-chart-line mr-2"></i> Overview</button>
                        <button class="tab-button text-lg py-4 px-6 font-medium" data-tab="profile"><i class="fas fa-user-edit mr-2"></i> My Profile</button>
                        <button class="tab-button text-lg py-4 px-6 font-medium" data-tab="documents"><i class="fas fa-file-archive mr-2"></i> Document Vault</button>
                        <button class="tab-button text-lg py-4 px-6 font-medium" data-tab="achievements"><i class="fas fa-award mr-2"></i> Achievements</button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div>
                    <div id="overview-tab" class="tab-content active">
                        <h3 class="text-2xl font-bold mb-4">Welcome Back!</h3>
                        <p class="text-gray-300">This is your overview. Here you'll find quick stats, recent activity, and shortcuts to your most-used tools. (Content coming soon)</p>
                    </div>
                    <div id="profile-tab" class="tab-content">
                        <h3 class="text-2xl font-bold mb-4">Edit Your Profile</h3>
                         <form id="profile-form" class="max-w-md space-y-4">
                            <div>
                               <label for="displayName" class="block text-sm font-medium text-gray-400">Display Name</label>
                               <input type="text" id="displayName" name="displayName" class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500">
                            </div>
                            <button type="submit" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                         </form>
                    </div>
                    <div id="documents-tab" class="tab-content">
                        <h3 class="text-2xl font-bold mb-4">My Document Vault</h3>
                        <p class="text-gray-300">Securely store and manage your parenting plans, legal documents, and Life CV.</p>
                         <div class="mt-4">
                            <label for="cv-upload" class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                <i class="fas fa-upload mr-2"></i> Upload "Life CV"
                                <input type="file" id="cv-upload" class="hidden" accept=".pdf,.doc,.docx">
                            </label>
                            <a href="#" id="cv-link" class="hidden ml-4 text-green-400 hover:underline"></a>
                         </div>
                    </div>
                    <div id="achievements-tab" class="tab-content">
                        <h3 class="text-2xl font-bold mb-4">My Achievements</h3>
                        <p class="text-gray-300">View all the certificates and badges you've earned from our training modules and assessments. (Content coming soon)</p>
                    </div>
                </div>
            </div>

            <!-- Shown if user is not logged in -->
            <div id="dashboard-login-prompt" class="text-center mt-20 hidden">
                 <i class="fas fa-lock text-6xl text-blue-500 mx-auto"></i>
                 <h2 class="text-3xl font-bold text-white mt-4">This is Your Personal Dashboard</h2>
                 <p class="mt-2 text-lg text-gray-400">Please <a href="login.html" class="font-bold text-blue-400 hover:underline">log in or register</a> to access your Command Centre.</p>
            </div>
        </main>
    </div>

    <!-- MODALS (Chatbot, Podcast, etc.) -->
    <div id="chatbot-modal" class="modal fixed inset-0 bg-black bg-opacity-80 items-end justify-center sm:justify-end z-50 p-4">
        <!-- Chatbot content will be loaded by chatbot.js -->
    </div>
    <div id="podcast-modal" class="modal fixed inset-0 bg-black bg-opacity-75 items-center justify-center z-50 p-4">
        <!-- Podcast player content will be loaded by podcast-player.js -->
    </div>
    
    <!-- Scripts -->
    <script type="module" src="assets/js/main.js"></script>
    <script type="module" src="assets/js/auth.js"></script>
    <script type="module" src="assets/js/dashboard.js"></script>
    <script type="module" src="assets/js/chatbot.js"></script>
    <script type="module" src="assets/js/podcast-player.js"></script>
</body>
</html>
```javascript
// assets/js/dashboard.js

import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js)";
import { doc, getDoc, updateDoc } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js)";
import { ref, uploadBytes, getDownloadURL } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js)";

document.addEventListener('DOMContentLoaded', () => {
    // --- Dashboard Specific DOM Elements ---
    const loadingState = document.getElementById('loading-state');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');

    // Profile and Welcome elements
    const welcomeElement = document.getElementById('dashboard-welcome');
    const emailElement = document.getElementById('dashboard-email');
    const avatarElement = document.getElementById('user-avatar');
    
    // Form and upload elements
    const profileImageUpload = document.getElementById('profile-image-upload');
    const profileForm = document.getElementById('profile-form');
    const displayNameInput = document.getElementById('displayName');
    const cvUpload = document.getElementById('cv-upload');
    const cvLink = document.getElementById('cv-link');
    
    // Tab elements
    const tabsContainer = document.getElementById('dashboard-tabs');
    const tabContents = document.querySelectorAll('.tab-content');

    let currentUser = null;

    // --- Main Auth Listener ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = user;
            loginPrompt.classList.add('hidden');
            fetchUserData(user);
        } else {
            // User is not logged in, show the prompt
            loadingState.classList.add('hidden');
            dashboardContainer.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
        }
    });

    // --- Data Fetching and Display ---
    async function fetchUserData(user) {
        loadingState.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
        
        try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                displayUserData(user, userData);
            } else {
                // This case happens for users who signed up before profile creation was implemented
                console.warn("No user profile found for:", user.uid, "Displaying default data.");
                displayUserData(user, {}); // Display with default data
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
            loadingState.innerHTML = '<p class="text-red-400">Error loading your data. Please refresh.</p>';
        } finally {
            // Show the dashboard regardless of profile existence
            loadingState.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
        }
    }

    function displayUserData(user, data) {
        const displayName = data.displayName || user.displayName || 'Valued Member';
        welcomeElement.textContent = `Welcome, ${displayName}`;
        emailElement.textContent = user.email;
        avatarElement.src = data.photoURL || user.photoURL || '[https://placehold.co/64x64/374151/9ca3af?text=](https://placehold.co/64x64/374151/9ca3af?text=)...';
        
        if(displayNameInput) {
            displayNameInput.value = data.displayName || user.displayName || '';
        }

        if (cvLink) {
            if (data.cvUrl) {
                cvLink.href = data.cvUrl;
                cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                cvLink.target = "_blank";
                cvLink.classList.remove('hidden');
            } else {
                cvLink.classList.add('hidden');
            }
        }
    }

    // --- Tab Switching Logic ---
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const tabId = e.target.dataset.tab;

                // Update button styles
                tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update content visibility
                tabContents.forEach(content => {
                    if (content.id === `${tabId}-tab`) {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            }
        });
    }

    // --- Profile Update Handlers ---
    if (profileImageUpload) {
        profileImageUpload.addEventListener('change', (e) => handleFileUpload(e, 'profile-picture'));
    }
    if (cvUpload) {
        cvUpload.addEventListener('change', (e) => handleFileUpload(e, 'cv'));
    }
    if(profileForm){
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    async function handleProfileUpdate(e) {
        e.preventDefault();
        if (!currentUser) return;
        
        const newDisplayName = displayNameInput.value.trim();
        if(!newDisplayName) {
            alert("Display name cannot be empty.");
            return;
        }

        const userRef = doc(db, 'users', currentUser.uid);
        try {
            await updateDoc(userRef, { displayName: newDisplayName });
            welcomeElement.textContent = `Welcome, ${newDisplayName}`;
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    }

    async function handleFileUpload(e, type) {
        const file = e.target.files[0];
        if (!file || !currentUser) return;
        
        const filePath = `users/${currentUser.uid}/${type}/${file.name}`;
        const storageRef = ref(storage, filePath);
        
        alert(`Uploading ${type}... please wait.`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const userRef = doc(db, 'users', currentUser.uid);
            let updateData = {};

            if (type === 'profile-picture') {
                updateData = { photoURL: downloadURL };
                avatarElement.src = downloadURL;
                alert("Profile picture updated!");
            } else if (type === 'cv') {
                updateData = { cvUrl: downloadURL };
                cvLink.href = downloadURL;
                cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                cvLink.target = "_blank";
                cvLink.classList.remove('hidden');
                alert("CV uploaded successfully!");
            }

            await updateDoc(userRef, updateData);

        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(`Failed to upload ${type}. Please try again.`);
        }
    }
});
