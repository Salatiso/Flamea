/**
 * Flamea.org - Centralized Authentication Script (Corrected)
 * This file manages all user authentication processes sitewide.
 * - Handles new user registration (Email/Password & Google).
 * - Handles existing user login.
 * - Creates user profiles in Firestore.
 * - Manages login/logout state and UI updates.
 * - It NO LONGER handles redirects, allowing each page to manage its own content visibility.
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
import { auth, db } from './firebase-config.js';

const googleProvider = new GoogleAuthProvider();

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const googleSignInButton = document.getElementById('google-signin-btn');
const authMessage = document.getElementById('auth-message');

function showMessage(message, isError = false) {
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `mb-4 text-center h-6 ${isError ? 'text-red-400' : 'text-green-400'}`;
    }
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Signing in...', false);
        try {
            await signInWithEmailAndPassword(auth, loginForm.email.value, loginForm.password.value);
            // SUCCESS: onAuthStateChanged will handle the rest.
        } catch (error) {
            console.error("Login Error:", error.message);
            showMessage(getFriendlyAuthError(error.code), true);
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showMessage('Creating account...', false);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, registerForm.email.value, registerForm.password.value);
            await updateProfile(userCredential.user, { displayName: registerForm.name.value });
            await createUserProfileDocument(userCredential.user, { displayName: registerForm.name.value });
            // SUCCESS: onAuthStateChanged will handle the rest.
        } catch (error) {
            console.error("Registration Error:", error.message);
            showMessage(getFriendlyAuthError(error.code), true);
        }
    });
}

if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
        showMessage('Redirecting to Google...', false);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await createUserProfileDocument(result.user);
            // SUCCESS: onAuthStateChanged will handle the rest.
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
            showMessage(getFriendlyAuthError(error.code), true);
        }
    });
}

async function createUserProfileDocument(user, additionalData = {}) {
    if (!user) return;
    const userRef = doc(db, `users/${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = serverTimestamp();
        try {
            await setDoc(userRef, {
                displayName: displayName || additionalData.displayName,
                email,
                photoURL: photoURL || 'https://placehold.co/128x128/374151/FFFFFF?text=User',
                createdAt,
                ...additionalData
            });
        } catch (error) {
            console.error("Error creating user profile:", error);
        }
    }
}

function getFriendlyAuthError(errorCode) {
    switch (errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password. Please try again.';
        case 'auth/email-already-in-use':
            return 'This email address is already registered.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
            return 'An unexpected error occurred. Please try again.';
    }
}

onAuthStateChanged(auth, (user) => {
    updateAuthUI(user);
    const event = new CustomEvent('auth-state-changed', { detail: { user } });
    document.dispatchEvent(event);

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const isAuthPage = ['community.html'].includes(currentPage);

    if (user && isAuthPage) {
        window.location.replace('dashboard.html');
    }
});

export function updateAuthUI(user) {
    const authLinksContainer = document.getElementById('sidebar-auth-links');
    if (!authLinksContainer) return;

    if (user) {
        authLinksContainer.innerHTML = `
            <a href="dashboard.html" class="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-2">My Dashboard</a>
            <button id="sidebar-logout-btn" class="text-sm text-gray-400 hover:text-white hover:underline">Logout</button>
        `;
    } else {
        authLinksContainer.innerHTML = `
            <a href="community.html" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">Login / Register</a>
        `;
    }

    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).catch(error => console.error("Logout Error:", error));
        });
    }
}
