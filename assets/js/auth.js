// assets/js/auth.js

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
// Import the initialized services from our config file
import { auth, db } from './firebase-config.js';

// --- Initialize Auth Provider ---
const googleProvider = new GoogleAuthProvider();

// --- DOM Elements ---
// Select elements from the login/register page
const loginForm = document.getElementById('login-form');
// FIX: Changed from 'signup-form' to 'register-form' to match the HTML
const registerForm = document.getElementById('register-form'); 
// FIX: Changed from 'google-signin' to 'google-signin-btn' to match the HTML
const googleSignInButton = document.getElementById('google-signin-btn'); 
const authMessage = document.getElementById('auth-message');

// Select logout buttons, which can appear on any page
const logoutButtons = document.querySelectorAll('.logout-button');

// --- Helper function to display messages ---
function showMessage(message, isError = false) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `mb-4 text-center h-6 ${isError ? 'text-red-400' : 'text-green-400'}`;
    }
}

// --- Event Listeners for Auth Forms ---

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Signing in...', false);
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect is handled by onAuthStateChanged listener
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
            // Redirect will be handled by onAuthStateChanged
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

// --- User Profile Document Creation ---
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

// --- Auth State Observer (Handles Redirects and UI Updates) ---
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isAuthPage = ['login.html'].includes(currentPage);

    if (user) {
        // User is signed in.
        console.log(`User logged in: ${user.email}. Current page: ${currentPage}`);
        // If they are on the login page, redirect them to the dashboard.
        if (isAuthPage) {
            window.location.replace('dashboard.html');
        }
    } else {
        // User is signed out.
        console.log(`User logged out. Current page: ${currentPage}`);
        const protectedPages = ['dashboard.html', 'activity-tracker.html', 'plan-builder.html', 'forms.html'];
        // If they are on a protected page, redirect them to the login page.
        if (protectedPages.includes(currentPage)) {
            window.location.replace('login.html');
        }
    }
    // Update UI elements like login/logout buttons sitewide
    updateAuthUI(user);
});


// --- Logout Button ---
logoutButtons.forEach(button => {
    button.addEventListener('click', () => {
        signOut(auth).catch(error => console.error("Logout Error:", error));
    });
});


// --- Function to update UI elements based on auth state ---
function updateAuthUI(user) {
    const authLinksDesktop = document.getElementById('auth-links-desktop');
    const authLinksMobile = document.getElementById('auth-links-mobile');

    if (user) {
        // User is logged in: show dashboard and logout buttons
        const loggedInHTML = `
            <a href="dashboard.html" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">Dashboard</a>
            <button class="logout-button text-gray-300 hover:text-white">Logout</button>
        `;
        if (authLinksDesktop) authLinksDesktop.innerHTML = loggedInHTML;
        if (authLinksMobile) authLinksMobile.innerHTML = loggedInHTML;
    } else {
        // User is logged out: show login button
        const loggedOutHTML = `
            <a href="login.html" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors block">Login / Register</a>
        `;
        if (authLinksDesktop) authLinksDesktop.innerHTML = loggedOutHTML;
        if (authLinksMobile) authLinksMobile.innerHTML = loggedOutHTML;
    }

    // Re-add event listener for newly created logout buttons
    document.querySelectorAll('.logout-button').forEach(button => {
        button.addEventListener('click', () => {
            signOut(auth).catch(error => console.error("Logout Error:", error));
        });
    });
}