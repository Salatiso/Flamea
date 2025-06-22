// /assets/js/auth.js

import { app, auth, db, googleProvider, appleProvider } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    updateProfile,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on a page that needs auth logic
    const authContainer = document.getElementById('auth-container');
    const signOutBtn = document.getElementById('sign-out-btn');

    if (authContainer) {
        setupLoginPage();
    }
    
    // Universal auth state listener for header updates
    onAuthStateChanged(auth, (user) => {
        updateHeaderUI(user);
    });

    function setupLoginPage() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const googleBtn = document.getElementById('google-signin-btn');
        const appleBtn = document.getElementById('apple-signin-btn');
        const messageEl = document.getElementById('auth-message');

        const showRegisterLink = document.getElementById('show-register-link');
        const showLoginLink = document.getElementById('show-login-link');
        const emailPassForms = document.getElementById('email-password-forms');
        const registerFormContainer = document.getElementById('register-form-container');

        // Toggle between login and register forms
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            emailPassForms.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.classList.add('hidden');
            emailPassForms.classList.remove('hidden');
        });
        
        // --- Event Listeners ---
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageEl.textContent = '';
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                await createUserProfileDocument(userCredential.user);
                window.location.href = 'dashboard.html';
            } catch (error) {
                messageEl.textContent = error.message;
                console.error("Registration Error:", error);
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            messageEl.textContent = '';
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'dashboard.html';
            } catch (error) {
                messageEl.textContent = "Invalid email or password.";
                console.error("Login Error:", error);
            }
        });

        googleBtn.addEventListener('click', () => socialSignIn(googleProvider));
        appleBtn.addEventListener('click', () => socialSignIn(appleProvider));
    }
    
    async function socialSignIn(provider) {
        const messageEl = document.getElementById('auth-message');
        messageEl.textContent = '';
        try {
            const result = await signInWithPopup(auth, provider);
            await createUserProfileDocument(result.user, true); // Check if new user
            window.location.href = 'dashboard.html';
        } catch (error) {
            messageEl.textContent = "Could not sign in. Please try again.";
            console.error("Social Sign-In Error:", error);
        }
    }

    async function createUserProfileDocument(user, isSocialSignIn = false) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        // If the user document doesn't exist, create it.
        // This handles both new registrations and first-time social logins.
        if (!docSnap.exists()) {
            const { email, displayName, photoURL } = user;
            try {
                await setDoc(userRef, {
                    displayName,
                    email,
                    photoURL: photoURL || null,
                    createdAt: serverTimestamp(),
                    lastLogin: serverTimestamp(),
                });
            } catch (error) {
                console.error("Error creating user document:", error);
            }
        } else {
            // If user exists, just update their last login time
             try {
                await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
            } catch (error) {
                console.error("Error updating last login:", error);
            }
        }
    }

    function updateHeaderUI(user) {
        const loginLink = document.querySelector('a[href="login.html"]');
        if (!loginLink) return;

        if (user) {
            // User is logged in
            loginLink.textContent = 'Dashboard';
            loginLink.href = 'dashboard.html';

            // Add a sign-out button if it doesn't exist
            if (!document.getElementById('sign-out-btn')) {
                const signOutButton = document.createElement('button');
                signOutButton.id = 'sign-out-btn';
                signOutButton.className = 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors hidden sm:block';
                signOutButton.textContent = 'Sign Out';
                signOutButton.addEventListener('click', async () => {
                    await signOut(auth);
                    window.location.href = 'index.html';
                });
                loginLink.parentElement.appendChild(signOutButton);
            }
        } else {
            // User is logged out
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            const signOutButton = document.getElementById('sign-out-btn');
            if (signOutButton) {
                signOutButton.remove();
            }
        }
    }
});
