// /assets/js/dashboard.js

import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const loadingEl = document.getElementById('dashboard-loading');
    const contentEl = document.getElementById('dashboard-content');
    
    if (!contentEl) return; // Only run on dashboard page

    onAuthStateChanged(auth, user => {
        if (user) {
            loadingEl.style.display = 'none';
            contentEl.classList.remove('hidden');
            loadUserProfile(user);
        } else {
            // If no user, redirect to login page
            window.location.href = 'login.html';
        }
    });

    async function loadUserProfile(user) {
        const welcomeMessage = document.getElementById('welcome-message');
        const userEmail = document.getElementById('user-email');
        const userAvatar = document.getElementById('user-avatar');
        const displayNameInput = document.getElementById('displayName');

        // --- Populate basic info from auth object ---
        userEmail.textContent = user.email;
        if (user.photoURL) {
            userAvatar.src = user.photoURL;
        }

        // --- Fetch extended profile from Firestore ---
        try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                welcomeMessage.textContent = `Welcome, ${data.displayName || user.email}!`;
                displayNameInput.value = data.displayName || '';
            } else {
                // This might happen if Firestore doc creation failed during signup
                welcomeMessage.textContent = `Welcome, ${user.email}!`;
                displayNameInput.value = user.displayName || '';
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
            welcomeMessage.textContent = `Welcome!`;
        }

        // --- Add listener for profile form submission ---
        const profileForm = document.getElementById('profile-form');
        const profileMessage = document.getElementById('profile-message');

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            profileMessage.textContent = 'Saving...';
            const newDisplayName = displayNameInput.value;

            try {
                const userRef = doc(db, 'users', user.uid);
                await updateDoc(userRef, {
                    displayName: newDisplayName
                });
                
                // Also update the auth profile if you want it to be consistent
                // await updateProfile(auth.currentUser, { displayName: newDisplayName });

                profileMessage.textContent = 'Profile updated successfully!';
                welcomeMessage.textContent = `Welcome, ${newDisplayName}!`;
                setTimeout(() => profileMessage.textContent = '', 3000);
            } catch (error) {
                console.error("Error updating profile:", error);
                profileMessage.textContent = 'Failed to update profile.';
            }
        });
    }
});
