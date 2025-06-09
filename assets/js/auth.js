// assets/js/auth.js

import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider // Import GoogleAuthProvider directly
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { app, db } from './firebase-config.js'; // Use the direct exports

// --- Initialize Auth and Provider ---
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(); // Create a new instance of the provider

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const googleSignInButton = document.getElementById('google-signin');
const logoutButtons = document.querySelectorAll('.logout-button'); // Use querySelectorAll to catch all instances

// --- Event Listeners ---

// Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully with email.");
            // Redirect is handled by onAuthStateChanged
        } catch (error) {
            console.error("Login Error:", error);
            alert(`Login Failed: ${error.message}`);
        }
    });
}

// Signup Form Submission
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const name = signupForm.name.value; // Assuming you have a 'name' field in your signup form
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User signed up successfully:", user.uid);
            
            // Create a user profile document in Firestore
            await createUserProfile(user, { name: name || 'New Member' });
            // Redirect is handled by onAuthStateChanged
        } catch (error) {
            console.error("Signup Error:", error);
            alert(`Signup Failed: ${error.message}`);
        }
    });
}

// Google Sign-In
if (googleSignInButton) {
    googleSignInButton.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User signed in with Google:", user.uid);
            
            // Check if user profile already exists, if not, create one
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                 await createUserProfile(user);
            }
            // Redirect is handled by onAuthStateChanged
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            if (error.code !== 'auth/popup-closed-by-user') {
               alert(`Google Sign-In Failed: ${error.message}`);
            }
        }
    });
}

// Logout Buttons
logoutButtons.forEach(button => {
    button.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("User logged out.");
            window.location.replace('/index.html');
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    });
});

// --- User Profile Management ---
async function createUserProfile(user, additionalData = {}) {
    try {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || additionalData.name || 'New Member',
            email: user.email,
            photoURL: user.photoURL || '/assets/images/default-avatar.png',
            createdAt: new Date(),
            skills: [],
            cvUrl: '',
        }, { merge: true });
        console.log("User profile created/updated in Firestore for:", user.uid);
    } catch (error) {
        console.error("Error creating user profile:", error);
    }
}

// --- Auth State Observer ---
onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split("/").pop();
    const protectedPages = ['dashboard.html', 'parenting-plan.html', 'forms.html', 'tools.html', 'book-reader.html'];
    const isAuthPage = ['login.html', 'signup.html'].includes(currentPage);

    if (user) {
        // User is signed in.
        if (isAuthPage) {
            window.location.replace('/dashboard.html');
        }
    } else {
        // User is signed out.
        if (protectedPages.includes(currentPage)) {
            window.location.replace('/login.html');
        }
    }
});

// --- Update UI based on Auth State ---
function updateUserUI(user) {
    const userWelcome = document.getElementById('user-welcome');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.querySelectorAll('.logout-button');

    if (user) {
        if(userWelcome) userWelcome.textContent = `Welcome, ${user.displayName || user.email}`;
        if(loginLink) loginLink.style.display = 'none';
        logoutLink.forEach(b => b.style.display = 'block');
    } else {
        if(userWelcome) userWelcome.textContent = '';
        if(loginLink) loginLink.style.display = 'block';
        logoutLink.forEach(b => b.style.display = 'none');
    }
}

// Final check on page load
onAuthStateChanged(auth, user => {
    updateUserUI(user);
});
