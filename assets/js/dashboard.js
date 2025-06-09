// assets/js/dashboard.js

import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const loadingIndicator = document.getElementById('loading-indicator');
    const mainContent = document.getElementById('main-content');

    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const userAvatarElement = document.getElementById('user-avatar');
    const profileImageUpload = document.getElementById('profile-image-upload');
    const cvUpload = document.getElementById('cv-upload');
    const cvLink = document.getElementById('cv-link');
    const profileForm = document.getElementById('profile-form');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            fetchUserData(user.uid);
        } else {
            // This is already handled by auth.js, but as a safeguard:
            window.location.replace('/login.html');
        }
    });

    async function fetchUserData(userId) {
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';

        try {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                displayUserData(userData);
            } else {
                console.warn("No user profile found for:", userId);
                if (loadingIndicator) loadingIndicator.textContent = 'Welcome! Your profile is being set up.';
            }

        } catch (error) {
            console.error("Error fetching user data:", error);
            if (loadingIndicator) loadingIndicator.textContent = 'Error loading your data.';
        } finally {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
        }
    }

    function displayUserData(data) {
        if (userNameElement) userNameElement.textContent = data.name || 'N/A';
        if (userEmailElement) userEmailElement.textContent = data.email || 'N/A';
        if (userAvatarElement) userAvatarElement.src = data.photoURL || '/assets/images/default-avatar.png';
        
        if (cvLink) {
            if (data.cvUrl) {
                cvLink.href = data.cvUrl;
                cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                cvLink.target = "_blank";
                cvLink.style.display = 'inline-block';
            } else {
                cvLink.style.display = 'none';
            }
        }
    }

    // --- Event Listeners for Profile Updates ---

    if (profileImageUpload) {
        profileImageUpload.addEventListener('change', (e) => handleFileUpload(e, 'profile-picture'));
    }
    if (cvUpload) {
        cvUpload.addEventListener('change', (e) => handleFileUpload(e, 'cv'));
    }

    async function handleFileUpload(e, type) {
        const file = e.target.files[0];
        if (!file) return;

        const user = auth.currentUser;
        if (!user) return;
        
        const filePath = `users/${user.uid}/${type}/${file.name}`;
        const storageRef = ref(storage, filePath);
        
        alert(`Uploading ${type}... please wait.`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const userRef = doc(db, 'users', user.uid);
            if (type === 'profile-picture') {
                await updateDoc(userRef, { photoURL: downloadURL });
                if (userAvatarElement) userAvatarElement.src = downloadURL;
                alert("Profile picture updated!");
            } else if (type === 'cv') {
                await updateDoc(userRef, { cvUrl: downloadURL });
                if (cvLink) {
                    cvLink.href = downloadURL;
                    cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                    cvLink.target = "_blank";
                    cvLink.style.display = 'inline-block';
                }
                alert("CV uploaded successfully!");
            }
        } catch (error) {
            console.error(`Error uploading ${type}:`, error);
            alert(`Failed to upload ${type}. Please try again.`);
        }
    }
});
