// assets/js/dashboard.js

// Import Firebase services from the central configuration file.
// This ensures we use the same Firebase instance across the app.
import { auth, db, storage } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    // This section maps all the interactive elements from the HTML to JavaScript variables.
    const loadingState = document.getElementById('loading-state');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');
    const welcomeElement = document.getElementById('dashboard-welcome');
    const emailElement = document.getElementById('dashboard-email');
    
    // Profile picture elements
    const avatarElements = [
        document.getElementById('user-avatar-1'),
        document.getElementById('user-avatar-2'),
        document.getElementById('user-avatar-3')
    ];
    const profileImageUploads = document.querySelectorAll('.profile-image-upload');
    
    // Form and tab elements
    const profileForm = document.getElementById('profile-form');
    const tabsContainer = document.getElementById('dashboard-tabs');
    const tabContents = document.querySelectorAll('.tab-content');
    const cvUpload = document.getElementById('cv-upload');
    const cvLink = document.getElementById('cv-link');
    const skillsInput = document.getElementById('skills');
    const skillsTagsContainer = document.getElementById('skills-tags');
    const calendarContainer = document.getElementById('visitation-calendar-container');

    // Share Profile Modal Elements
    const shareProfileBtn = document.getElementById('share-profile-btn');
    const shareModal = document.getElementById('share-modal');
    const cancelShareBtn = document.getElementById('cancel-share-btn');
    const generateLinkBtn = document.getElementById('generate-link-btn');
    const generatedLinkContainer = document.getElementById('generated-link-container');
    const generatedLinkInput = document.getElementById('generated-link-input');
    const copyLinkBtn = document.getElementById('copy-link-btn');


    // --- State Variable ---
    // This holds the current user object when logged in.
    let currentUser = null;

    // --- Main Authentication Listener ---
    // This is the core function that runs when the page loads.
    // It listens for changes in the user's login state.
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // If a user is logged in:
            currentUser = user;
            loginPrompt.classList.add('hidden'); // Hide the "please log in" message
            dashboardContainer.classList.remove('hidden'); // Show the dashboard content
            loadingState.classList.add('hidden'); // Hide the loading spinner
            loadUserProfile(user); // Fetch and display the user's profile data
            loadCalendar(); // Fetch and load the calendar component
        } else {
            // If no user is logged in:
            currentUser = null;
            loginPrompt.classList.remove('hidden'); // Show the "please log in" message
            dashboardContainer.classList.add('hidden'); // Hide the dashboard content
            loadingState.classList.add('hidden'); // Hide the loading spinner
        }
    });

    // --- Profile Data Handling ---

    /**
     * Fetches user profile data from Firestore and populates the form fields.
     * @param {object} user - The authenticated user object from Firebase Auth.
     */
    async function loadUserProfile(user) {
        // Set basic welcome messages
        welcomeElement.textContent = `Welcome, ${user.displayName || 'User'}!`;
        emailElement.textContent = user.email;

        try {
            // Get the user's specific document from the 'users' collection in Firestore.
            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Populate form fields with data from Firestore.
                // Use empty string as fallback to prevent 'null' or 'undefined' in fields.
                profileForm.displayName.value = data.displayName || user.displayName || '';
                profileForm.bio.value = data.bio || '';
                profileForm.linkedinUrl.value = data.linkedinUrl || '';
                profileForm.websiteUrl.value = data.websiteUrl || '';
                profileForm.hobbies.value = data.hobbies || '';
                profileForm.familyActivities.value = data.familyActivities || '';
                profileForm.diyProjects.value = data.diyProjects || '';
                
                // Set profile pictures, using placeholders if not available.
                avatarElements[0].src = data.photoURL1 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+1';
                avatarElements[1].src = data.photoURL2 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+2';
                avatarElements[2].src = data.photoURL3 || 'https://placehold.co/128x128/374151/FFFFFF?text=Pic+3';

                // Display the link to the uploaded CV if it exists.
                if (data.cvUrl) {
                    cvLink.href = data.cvUrl;
                    cvLink.innerHTML = `<i class="fas fa-file-alt mr-2"></i>View Uploaded CV`;
                    cvLink.target = "_blank";
                    cvLink.classList.remove('hidden');
                }
                
                // Populate skills
                if (data.skills) {
                    skillsInput.value = data.skills;
                    renderSkillsTags(data.skills);
                }

            } else {
                console.log("No profile data found, using defaults.");
                // If no profile exists, still show the user's name from their auth account.
                profileForm.displayName.value = user.displayName || '';
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
            alert("Could not load your profile data.");
        }
    }

    /**
     * Handles the profile form submission.
     * @param {Event} e - The form submission event.
     */
    async function handleProfileUpdate(e) {
        e.preventDefault(); // Prevent the browser from reloading the page.
        if (!currentUser) return; // Safety check.

        // Create an object with the data from the form.
        const userRef = doc(db, 'users', currentUser.uid);
        const data = {
            displayName: profileForm.displayName.value,
            bio: profileForm.bio.value,
            linkedinUrl: profileForm.linkedinUrl.value,
            websiteUrl: profileForm.websiteUrl.value,
            skills: profileForm.skills.value,
            hobbies: profileForm.hobbies.value,
            familyActivities: profileForm.familyActivities.value,
            diyProjects: profileForm.diyProjects.value,
            lastUpdated: serverTimestamp() // Add a timestamp for the last update.
        };

        try {
            // Use setDoc with { merge: true } to create or update the document without overwriting existing fields.
            await setDoc(userRef, data, { merge: true });
            welcomeElement.textContent = `Welcome, ${data.displayName}!`; // Update welcome message immediately.
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    }
    
    /**
     * Renders comma-separated skills from the input into visual tags.
     * @param {string} skillsString - A string of skills, e.g., "Art, Design, Coding".
     */
    function renderSkillsTags(skillsString) {
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

    // --- File Upload Handling ---

    /**
     * Handles the process of uploading a file (CV or profile picture) to Firebase Storage.
     * @param {Event} e - The file input change event.
     * @param {string} type - The type of file being uploaded ('cv' or 'profile-picture').
     */
    async function handleFileUpload(e, type) {
        const file = e.target.files[0];
        if (!file || !currentUser) return;

        let filePath;
        // Determine the storage path based on file type.
        if (type === 'profile-picture') {
            const imgNum = e.target.dataset.imgNum; // Get which picture slot (1, 2, or 3)
            filePath = `users/${currentUser.uid}/profile-pictures/profile-${imgNum}`;
        } else if (type === 'cv') {
            filePath = `users/${currentUser.uid}/cv/${file.name}`;
        } else {
            return;
        }

        const storageRef = ref(storage, filePath);
        alert(`Uploading ${type}... please wait.`);

        try {
            // Upload the file.
            const snapshot = await uploadBytes(storageRef, file);
            // Get the public URL for the uploaded file.
            const downloadURL = await getDownloadURL(snapshot.ref);
            const userRef = doc(db, 'users', currentUser.uid);
            
            // Update the user's document in Firestore with the new file URL.
            if (type === 'profile-picture') {
                const imgNum = e.target.dataset.imgNum;
                await updateDoc(userRef, { [`photoURL${imgNum}`]: downloadURL });
                document.getElementById(`user-avatar-${imgNum}`).src = downloadURL;
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
    
    // --- Share Profile Logic ---

    /**
     * Generates a unique shareable link for the user's profile.
     */
    async function generateShareableLink() {
        if (!currentUser) return;
        
        // Collect which sections the user wants to share.
        const options = document.querySelectorAll('#share-options input:checked');
        const sectionsToShare = Array.from(options).map(cb => cb.value);

        const shareData = {
            userId: currentUser.uid,
            sections: sectionsToShare,
            createdAt: serverTimestamp()
        };
        
        try {
            // Add a new document to the 'sharedProfiles' collection.
            // Firestore will automatically generate a unique ID for this document.
            const docRef = await addDoc(collection(db, "sharedProfiles"), shareData);
            
            // Construct the public URL using the new document's ID.
            const shareableLink = `${window.location.origin}/public-profile.html?id=${docRef.id}`;
            
            // Display the link to the user.
            generatedLinkInput.value = shareableLink;
            generatedLinkContainer.classList.remove('hidden');
            
        } catch (error) {
            console.error("Error generating shareable link: ", error);
            alert("Could not generate a shareable link. Please try again.");
        }
    }


    // --- Component Loaders ---
    
    /**
     * Asynchronously loads the visitation calendar HTML content into the dashboard.
     */
    async function loadCalendar() {
        try {
            const response = await fetch('visitation-calendar.html');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const calendarContent = doc.querySelector('.main-content'); // Assuming main content is in this class
            if(calendarContent) {
                calendarContainer.innerHTML = ''; // Clear "Loading..." message
                calendarContainer.appendChild(calendarContent);
                // We may need to re-initialize the calendar's JS if it has any.
                // For now, this just loads the HTML structure.
            } else {
                 calendarContainer.innerHTML = '<p>Could not load calendar content.</p>';
            }
        } catch (error) {
            console.error("Failed to load calendar:", error);
            calendarContainer.innerHTML = '<p>Error loading calendar. Please try refreshing.</p>';
        }
    }


    // --- Event Listeners ---
    
    // Handle form submission.
    profileForm.addEventListener('submit', handleProfileUpdate);

    // Handle CV file selection.
    cvUpload.addEventListener('change', (e) => handleFileUpload(e, 'cv'));
    
    // Handle profile picture file selection for all three upload inputs.
    profileImageUploads.forEach(uploadInput => {
        uploadInput.addEventListener('change', (e) => handleFileUpload(e, 'profile-picture'));
    });
    
    // Update skill tags in real-time as the user types.
    skillsInput.addEventListener('keyup', (e) => renderSkillsTags(e.target.value));

    // Handle tab switching.
    tabsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
            const tabId = e.target.dataset.tab;

            // Update button styles
            tabsContainer.querySelector('.active').classList.remove('active');
            e.target.classList.add('active');

            // Show the correct content
            tabContents.forEach(content => {
                content.classList.add('hidden');
                if (content.id === `${tabId}-content`) {
                    content.classList.remove('hidden');
                }
            });
        }
    });
    
    // Share modal listeners
    shareProfileBtn.addEventListener('click', () => shareModal.classList.remove('hidden'));
    cancelShareBtn.addEventListener('click', () => shareModal.classList.add('hidden'));
    generateLinkBtn.addEventListener('click', generateShareableLink);
    copyLinkBtn.addEventListener('click', () => {
        generatedLinkInput.select();
        document.execCommand('copy');
        alert("Link copied to clipboard!");
    });
});
