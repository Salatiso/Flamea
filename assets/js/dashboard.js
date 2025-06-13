// assets/js/dashboard.js

import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const loadingState = document.getElementById('loading-state');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');
    const welcomeElement = document.getElementById('dashboard-welcome');
    const emailElement = document.getElementById('dashboard-email');
    const avatarElement = document.getElementById('user-avatar');
    const profileImageUpload = document.getElementById('profile-image-upload');
    const profileForm = document.getElementById('profile-form');
    const displayNameInput = document.getElementById('displayName');
    const cvUpload = document.getElementById('cv-upload');
    const cvLink = document.getElementById('cv-link');
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
                console.warn("No user profile found. Displaying default data.");
                displayUserData(user, {}); 
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            loadingState.innerHTML = '<p class="text-red-400">Error loading your data. Please refresh.</p>';
        } finally {
            loadingState.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
        }
    }

    function displayUserData(user, data) {
        const displayName = data.displayName || user.displayName || 'Valued Member';
        welcomeElement.textContent = `Welcome, ${displayName}`;
        emailElement.textContent = user.email;
        avatarElement.src = data.photoURL || user.photoURL || 'https://placehold.co/64x64/374151/9ca3af?text=...';
        displayNameInput.value = data.displayName || user.displayName || '';

        if (data.cvUrl) {
            cvLink.href = data.cvUrl;
            cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
            cvLink.target = "_blank";
            cvLink.classList.remove('hidden');
        } else {
            cvLink.classList.add('hidden');
        }
    }

    // --- Tab Switching Logic ---
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const tabId = e.target.dataset.tab;
                tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.toggle('active', content.id === `${tabId}-tab`);
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
            
            if (type === 'profile-picture') {
                await updateDoc(userRef, { photoURL: downloadURL });
                avatarElement.src = downloadURL;
                alert("Profile picture updated!");
            } else if (type === 'cv') {
                await updateDoc(userRef, { cvUrl: downloadURL });
                cvLink.href = downloadURL;
                cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                cvLink.target = "_blank";
                cvLink.classList.remove('hidden');
                alert("CV uploaded successfully!");
            }
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(`Failed to upload ${type}. Please try again.`);
        }
    }
});
