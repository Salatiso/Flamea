// assets/js/dashboard.js

import { auth, db, storage } from './firebase-config.js';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    const loadingState = document.getElementById('loading-state');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');
    const welcomeElement = document.getElementById('dashboard-welcome');
    const emailElement = document.getElementById('dashboard-email');
    const profileForm = document.getElementById('profile-form');
    
    let currentUser = null;

    // Listen for our custom event from auth.js
    document.addEventListener('auth-state-changed', ({ detail }) => {
        const { user } = detail;
        if (user) {
            currentUser = user;
            displayDashboard(user);
        } else {
            currentUser = null;
            displayLoginPrompt();
        }
    });

    function displayDashboard(user) {
        loadingState.classList.add('hidden');
        loginPrompt.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        loadUserProfile(user);
        // Any other dashboard-specific initializations would go here
    }

    function displayLoginPrompt() {
        loadingState.classList.add('hidden');
        dashboardContainer.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
    }

    async function loadUserProfile(user) {
        welcomeElement.textContent = `Welcome, ${user.displayName || 'User'}!`;
        emailElement.textContent = user.email;

        try {
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                profileForm.displayName.value = data.displayName || user.displayName || '';
                // ... (rest of your profile loading logic remains the same)
                profileForm.bio.value = data.bio || '';
                profileForm.linkedinUrl.value = data.linkedinUrl || '';
                profileForm.websiteUrl.value = data.websiteUrl || '';
                profileForm.hobbies.value = data.hobbies || '';
                profileForm.familyActivities.value = data.familyActivities || '';
                profileForm.diyProjects.value = data.diyProjects || '';

                const avatarElements = [document.getElementById('user-avatar-1'), document.getElementById('user-avatar-2'), document.getElementById('user-avatar-3')];
                avatarElements[0].src = data.photoURL1 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+1';
                avatarElements[1].src = data.photoURL2 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+2';
                avatarElements[2].src = data.photoURL3 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+3';
                
                const cvLink = document.getElementById('cv-link');
                if (data.cvUrl) {
                    cvLink.href = data.cvUrl;
                    cvLink.classList.remove('hidden');
                }

                const skillsInput = document.getElementById('skills');
                 if (data.skills) {
                    skillsInput.value = data.skills;
                    renderSkillsTags(data.skills);
                }

            } else {
                 profileForm.displayName.value = user.displayName || '';
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
    }
    
    // All your other functions (handleProfileUpdate, handleFileUpload, etc.) remain here
    // ...
    function renderSkillsTags(skillsString) {
        const skillsTagsContainer = document.getElementById('skills-tags');
        skillsTagsContainer.innerHTML = '';
        if(!skillsString) return;
        
        skillsString.split(',')
            .map(skill => skill.trim())
            .filter(skill => skill)
            .forEach(skill => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.textContent = skill;
                skillsTagsContainer.appendChild(tag);
            });
    }

    // Initial check in case auth state is already known
    if (auth.currentUser) {
        currentUser = auth.currentUser;
        displayDashboard(auth.currentUser);
    } else {
         // If not logged in, wait for the event. The loading spinner will show by default.
    }
});
