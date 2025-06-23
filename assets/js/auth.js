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

            // (Removed incomplete function definition here)
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

            function removeEventListeners() {
                events.forEach(event => document.removeEventListener(event, resetTimer, true));
            }

            return {
                start() {
                    addEventListeners();
                    resetTimer();
                },
                stop() {
                    removeEventListeners();
                    clearTimeout(timeout);
                },
                reset: resetTimer
            };
        })();

        // --- User Profile Management ---
        function updateUserProfile(displayName, photoURL) {
            const user = auth.currentUser;
            if (user) {
                import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((authModule) => {
                    const { updateProfile } = authModule;
                    return updateProfile(user, {
                        displayName: displayName,
                        photoURL: photoURL
                    });
                }).then(() => {
                    console.log("User profile updated successfully");
                    if (userDisplay) {
                        userDisplay.textContent = displayName || user.email;
                    }
                }).catch((error) => {
                    console.error("Error updating profile:", error);
                });
            }
        }

        // --- Password Reset Function ---
        function resetPassword(email) {
            import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((authModule) => {
                const { sendPasswordResetEmail } = authModule;
                return sendPasswordResetEmail(auth, email);
            }).then(() => {
                alert("Password reset email sent. Please check your inbox.");
            }).catch((error) => {
                console.error("Password reset error:", error);
                alert(`Error: ${error.message}`);
            });
        }

        // --- Email Verification ---
        function sendEmailVerification() {
            const user = auth.currentUser;
            if (user && !user.emailVerified) {
                import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((authModule) => {
                    const { sendEmailVerification } = authModule;
                    return sendEmailVerification(user);
                }).then(() => {
                    alert("Verification email sent. Please check your inbox.");
                }).catch((error) => {
                    console.error("Email verification error:", error);
                    alert(`Error: ${error.message}`);
                });
            }
        }

        // --- Expose functions globally for use in other scripts ---
        window.flameaAuth = {
            updateUserProfile,
            resetPassword,
            sendEmailVerification,
            getCurrentUser: () => auth.currentUser,
            signOut: () => signOut(auth),
            inactivityTimer
        };

        // --- Handle password reset form (if it exists) ---
        const resetPasswordForm = document.getElementById('reset-password-form');
        const resetPasswordEmail = document.getElementById('reset-password-email');
        const resetPasswordBtn = document.getElementById('reset-password-btn');

        if (resetPasswordForm && resetPasswordEmail && resetPasswordBtn) {
            resetPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = resetPasswordEmail.value.trim();
                if (email) {
                    resetPassword(email);
                } else {
                    alert("Please enter a valid email address.");
                }
            });
        }

        // --- Handle profile update form (if it exists) ---
        const profileUpdateForm = document.getElementById('profile-update-form');
        const profileDisplayName = document.getElementById('profile-display-name');
        const profilePhotoURL = document.getElementById('profile-photo-url');
        const updateProfileBtn = document.getElementById('update-profile-btn');

        if (profileUpdateForm && profileDisplayName) {
            profileUpdateForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const displayName = profileDisplayName.value.trim();
                const photoURL = profilePhotoURL ? profilePhotoURL.value.trim() : '';
                updateUserProfile(displayName, photoURL);
            });
        }

        // --- Handle email verification button (if it exists) ---
        const verifyEmailBtn = document.getElementById('verify-email-btn');
        if (verifyEmailBtn) {
            verifyEmailBtn.addEventListener('click', sendEmailVerification);
        }

        // --- Session persistence ---
        import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((authModule) => {
            const { setPersistence, browserSessionPersistence, browserLocalPersistence } = authModule;
            
            // Set persistence based on user preference or default to local
            const persistenceType = localStorage.getItem('flamea-auth-persistence') === 'session' 
                ? browserSessionPersistence 
                : browserLocalPersistence;
            
            setPersistence(auth, persistenceType).catch((error) => {
                console.error("Error setting auth persistence:", error);
            });
        });

        // --- Handle remember me checkbox (if it exists) ---
        const rememberMeCheckbox = document.getElementById('remember-me');
        if (rememberMeCheckbox) {
            rememberMeCheckbox.addEventListener('change', (e) => {
                const persistenceType = e.target.checked ? 'local' : 'session';
                localStorage.setItem('flamea-auth-persistence', persistenceType);
            });
        }

        console.log("Flamea Auth module initialized successfully.");

    }).catch((error) => {
        console.error("Error loading Firebase Auth module:", error);
    });
});

// --- Utility Functions ---
function isUserAuthenticated() {
    return window.firebaseAuth && window.firebaseAuth.currentUser !== null;
}

function requireAuth(redirectUrl = '/login.html') {
    if (!isUserAuthenticated()) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// --- Export for use in other modules ---
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isUserAuthenticated,
        requireAuth
    };
}

// --- Global error handler for authentication errors ---
window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.code && event.reason.code.includes('auth/')) {
        console.error("Unhandled authentication error:", event.reason);
        // Handle specific auth errors
        switch (event.reason.code) {
            case 'auth/network-request-failed':
                console.warn("Network error. Please check your connection.");
                break;
            case 'auth/too-many-requests':
                alert("Too many failed attempts. Please try again later.");
                break;
            case 'auth/user-disabled':
                alert("Your account has been disabled. Please contact support.");
                break;
            default:
                console.error("Authentication error:", event.reason.message);
        }
    }
});