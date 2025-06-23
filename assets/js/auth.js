// /assets/js/auth.js
// This script handles all authentication logic for the main Flamea app.
// Updated to work with Firebase v9 modular syntax

document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available through the global window object
    if (!window.firebaseAuth) {
        console.log("Firebase auth not yet initialized. Auth functionality will be limited.");
        return;
    }

    const auth = window.firebaseAuth;

    // --- Provider Initialization (using v9 syntax) ---
    import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((authModule) => {
        const { GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged } = authModule;
        
        const googleProvider = new GoogleAuthProvider();
        const appleProvider = new OAuthProvider('apple.com');

        // --- DOM Elements (assuming they exist on login.html) ---
        const loginWithGoogleBtn = document.getElementById('login-google');
        const loginWithAppleBtn = document.getElementById('login-apple');
        const logoutBtn = document.getElementById('logout-button');
        const userDisplay = document.getElementById('user-display');

        // --- Sign-in Functions ---
        if (loginWithGoogleBtn) {
            loginWithGoogleBtn.addEventListener('click', () => {
                signInWithPopup(auth, googleProvider)
                    .then((result) => {
                        console.log("Signed in with Google:", result.user.displayName);
                        window.location.href = '/dashboard.html';
                    }).catch((error) => {
                        console.error("Google Sign-in Error:", error);
                        alert(`Error: ${error.message}`);
                    });
            });
        }

        if (loginWithAppleBtn) {
            loginWithAppleBtn.addEventListener('click', () => {
                signInWithPopup(auth, appleProvider)
                    .then((result) => {
                        console.log("Signed in with Apple:", result.user.displayName);
                        window.location.href = '/dashboard.html';
                    }).catch((error) => {
                        console.error("Apple Sign-in Error:", error);
                        alert(`Error: ${error.message}. Please ensure Apple Sign-in is enabled in the Firebase console.`);
                    });
            });
        }

        // --- Logout Function ---
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                signOut(auth).then(() => {
                    console.log("User signed out.");
                    window.location.href = '/login.html';
                }).catch(error => console.error("Sign out error", error));
            });
        }

        // --- Auth State Observer ---
        onAuthStateChanged(auth, user => {
            if (user) {
                console.log("Current user:", user.email || user.uid);
                if (userDisplay) {
                    userDisplay.textContent = user.displayName || user.email;
                }
                inactivityTimer.start();
            } else {
                console.log("No user is signed in.");
                inactivityTimer.stop();
                // Only redirect if not on login or home page
                if (window.location.pathname !== '/login.html' && 
                    window.location.pathname !== '/' && 
                    window.location.pathname !== '/index.html') {
                    // Commenting out redirect for now to allow anonymous access
                    // window.location.href = '/login.html';
                }
            }
        });

        // --- Inactivity Timeout Logic ---
        const inactivityTimer = (() => {
            let timeout;
            const waitingTime = 60 * 60 * 1000; // 60 minutes in milliseconds

            const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

            function resetTimer() {
                clearTimeout(timeout);
                timeout = setTimeout(logoutUser, waitingTime);
            }

            function logoutUser() {
                console.log("User inactive, signing out.");
                signOut(auth).then(() => {
                    alert("You have been logged out due to inactivity.");
                    window.location.href = '/login.html';
                });
            }

            function addEventListeners() {
                events.forEach(event => document.addEventListener(event, resetTimer, true));
            }

            function remove