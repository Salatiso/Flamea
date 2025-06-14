/**
 * Flamea.org - Centralized Authentication Script (Corrected)
 * This file manages all user authentication processes sitewide.
 * - Handles new user registration (Email/Password & Google).
 * - Handles existing user login.
 * - Creates user profiles in Firestore.
 * - Manages login/logout state and redirects.
 * - Exports the UI update function to be called by the sidebar loader.
 */

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
// Import the initialized services from our central config file
import { auth, db } from './firebase-config.js';

// --- Initialize Auth Provider ---
const googleProvider = new GoogleAuthProvider();

// --- DOM Elements for Login/Register Page ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form'); 
const googleSignInButton = document.getElementById('google-signin-btn'); 
const authMessage = document.getElementById('auth-message');

// --- Helper function to display messages on login/register page ---
function showMessage(message, isError = false) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `mb-4 text-center h-6 ${isError ? 'text-red-400' : 'text-green-400'}`;
    }
}

// --- Event Listeners for Forms (Only run if the forms exist on the current page) ---

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Signing in...', false);
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect is handled by the onAuthStateChanged listener below
        } catch (error) {
            console.error("Login Error:", error.message);
            showMessage(error.message, true);
        }
    });
}

// Register Form Submission
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Creating account...', false);
        const name = registerForm.name.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update the new user's profile with their name
            await updateProfile(userCredential.user, { displayName: name });
            // Create a document for them in Firestore
            await createUserProfileDocument(userCredential.user, { displayName: name });
            // Redirect is handled by onAuthStateChanged
        } catch (error) {
            console.error("Registration Error:", error.message);
            showMessage(error.message, true);
        }
    });
}

// Google Sign-In Button
if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
        showMessage('Redirecting to Google...', false);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            // Check if user is new, if so, create a profile doc
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await createUserProfileDocument(user);
            }
            // Redirect is handled by onAuthStateChanged
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
            showMessage(error.message, true);
        }
    });
}

// --- Firestore User Profile Creation ---
async function createUserProfileDocument(user, additionalData = {}) {
    if (!user) return;
    const userRef = doc(db, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = serverTimestamp();
        try {
            await setDoc(userRef, {
                displayName,
                email,
                photoURL,
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
}

// --- GLOBAL AUTH STATE OBSERVER ---
// This listener is the single source of truth for the user's login state.
onAuthStateChanged(auth, (user) => {
    // When the state changes, update the UI.
    updateAuthUI(user);

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isAuthPage = ['login.html'].includes(currentPage);
    
    if (user && isAuthPage) {
        // If user is logged in and on the login page, send them to the dashboard.
        window.location.replace('dashboard.html');
    } else if (!user) {
        const protectedPages = ['dashboard.html', 'activity-tracker.html', 'plan-builder.html'];
        // If user is logged out and on a protected page, send them to login.
        if (protectedPages.includes(currentPage)) {
            window.location.replace('login.html');
        }
    }
});


// --- UI UPDATE FUNCTION (EXPORTED) ---
// This function can now be called by any script that imports it, like sidebar-loader.js
export function updateAuthUI(user) {
    const authLinksContainer = document.getElementById('sidebar-auth-links');
    if (!authLinksContainer) {
        // If the container isn't ready, do nothing.
        // The sidebar-loader will call this again once the sidebar is in the DOM.
        return;
    }

    if (user) {
        // User is logged in: show dashboard and logout buttons
        authLinksContainer.innerHTML = `
            <a href="dashboard.html" class="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-2">My Dashboard</a>
            <button id="sidebar-logout-btn" class="text-sm text-gray-400 hover:text-white hover:underline">Logout</button>
        `;
    } else {
        // User is logged out: show login button
        authLinksContainer.innerHTML = `
            <a href="login.html" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">Login / Register</a>
        `;
    }

    // Add event listener for the newly created logout button
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error("Logout Error:", error));
        });
    }
}
