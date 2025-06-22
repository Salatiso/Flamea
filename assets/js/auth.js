// /assets/js/auth.js
// This script handles all authentication logic for the main Flamea app.
// It includes Google & Apple sign-in, inactivity timeout, and user state management.

document.addEventListener('DOMContentLoaded', () => {
    // Make sure the main firebase config is loaded
    if (!firebase.apps.length) {
        console.error("Firebase is not initialized. Make sure firebase-config.js is loaded first.");
        return;
    }

    const auth = firebase.auth();

    // --- Provider Initialization ---
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const appleProvider = new firebase.auth.OAuthProvider('apple.com');

    // --- DOM Elements (assuming they exist on login.html) ---
    const loginWithGoogleBtn = document.getElementById('login-google');
    const loginWithAppleBtn = document.getElementById('login-apple');
    const logoutBtn = document.getElementById('logout-button'); // Assume this ID exists in your sidebar/header
    const userDisplay = document.getElementById('user-display'); // To show logged-in user info

    // --- Sign-in Functions ---
    if (loginWithGoogleBtn) {
        loginWithGoogleBtn.addEventListener('click', () => {
            auth.signInWithPopup(googleProvider)
                .then((result) => {
                    console.log("Signed in with Google:", result.user.displayName);
                    window.location.href = '/dashboard.html'; // Redirect to dashboard after login
                }).catch((error) => {
                    console.error("Google Sign-in Error:", error);
                    alert(`Error: ${error.message}`);
                });
        });
    }

    if (loginWithAppleBtn) {
        loginWithAppleBtn.addEventListener('click', () => {
            // IMPORTANT: For Apple Sign-In to work, you MUST enable it in your
            // Firebase Console -> Authentication -> Sign-in method -> Add Apple.
            auth.signInWithPopup(appleProvider)
                .then((result) => {
                    console.log("Signed in with Apple:", result.user.displayName);
                    window.location.href = '/dashboard.html'; // Redirect to dashboard after login
                }).catch((error) => {
                    console.error("Apple Sign-in Error:", error);
                    // Common error is "operation-not-allowed" if not enabled in Firebase console
                    alert(`Error: ${error.message}. Please ensure Apple Sign-in is enabled in the Firebase console.`);
                });
        });
    }

    // --- Logout Function ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                console.log("User signed out.");
                window.location.href = '/login.html'; // Redirect to login page after logout
            }).catch(error => console.error("Sign out error", error));
        });
    }


    // --- Auth State Observer ---
    // This function runs on every page load and when the auth state changes.
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in.
            console.log("Current user:", user.email || user.providerData[0].uid);
            if (userDisplay) {
                userDisplay.textContent = user.displayName || user.email;
            }
            // Start the inactivity timer
            inactivityTimer.start();

        } else {
            // User is signed out.
            console.log("No user is signed in.");
            // Stop the inactivity timer
            inactivityTimer.stop();
            // If not on the login page, redirect there
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/') {
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
            auth.signOut().then(() => {
                alert("You have been logged out due to inactivity.");
                window.location.href = '/login.html';
            });
        }

        function addEventListeners() {
            events.forEach(event => document.addEventListener(event, resetTimer, true));
        }

        function removeEventListeners() {
             events.forEach(event => document.removeEventListener(event, resetTimer, true));
             clearTimeout(timeout);
        }

        return {
            start: () => {
                removeEventListeners(); // Clean up first
                addEventListeners();
                resetTimer();
                console.log("Inactivity timer started.");
            },
            stop: () => {
                removeEventListeners();
                console.log("Inactivity timer stopped.");
            }
        };
    })();

});
