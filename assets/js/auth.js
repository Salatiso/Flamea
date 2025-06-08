// assets/js/auth.js

// Import the functions you need from the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your web app's Firebase configuration for the 'flamea' project
const firebaseConfig = {
    apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
    authDomain: "flamea.firebaseapp.com",
    projectId: "flamea",
    storageBucket: "flamea.firebasestorage.app",
    messagingSenderId: "681868881622",
    appId: "1:681868881622:web:d20687c688b2d1d943a377",
    measurementId: "G-MX7X9JQE51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// --- Make key functions globally accessible ---
// This allows other scripts on the page to call them.
window.flamea = {
    auth: auth,
    db: db,
    saveDocument: async (collectionName, data) => {
        if (!auth.currentUser) {
            alert("You must be logged in to save your document.");
            return null;
        }
        try {
            // Create a reference to a new document in a subcollection under the user's ID
            const userDocRef = collection(db, "users", auth.currentUser.uid, collectionName);
            const docRef = await addDoc(userDocRef, {
                ...data,
                ownerId: auth.currentUser.uid,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            return docRef.id; // Return the new document's ID
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("There was an error saving your document. Please try again.");
            return null;
        }
    },
    handleLogout: async () => {
        try {
            await signOut(auth);
            console.log("User signed out.");
            window.location.href = 'index.html'; // Redirect to home on logout
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
};

// --- DOM Elements ---
// This part is mainly for the login.html page
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const googleSigninBtn = document.getElementById('google-signin-btn');
const errorMessageDiv = document.getElementById('error-message');
const loginLink = document.getElementById('login-link'); // For switching forms on login page

// --- Functions for login.html ---
const saveUserToFirestore = async (user) => {
    const userRef = doc(db, "users", user.uid);
    try {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            createdAt: new Date().toISOString()
        }, { merge: true });
    } catch (error) { console.error("Error saving user to Firestore:", error); }
};

// --- Event Listeners for login.html ---
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageDiv.textContent = '';
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await saveUserToFirestore(userCredential.user);
            window.location.href = 'tools.html';
        } catch (error) { errorMessageDiv.textContent = `Registration failed: ${error.message}`; }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessageDiv.textContent = '';
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'tools.html';
        } catch (error) { errorMessageDiv.textContent = `Login failed: ${error.message}`; }
    });
}

if (googleSigninBtn) {
    googleSigninBtn.addEventListener('click', async () => {
        errorMessageDiv.textContent = '';
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await saveUserToFirestore(result.user);
            window.location.href = 'tools.html';
        } catch (error) { errorMessageDiv.textContent = `Google sign-in failed: ${error.message}`; }
    });
}

// Logic for switching tabs on login.html
const loginTab = document.getElementById('login-tab');
if (loginTab) { // Check if we are on the login page
    window.showTab = (tabName) => {
        const registerTab = document.getElementById('register-tab');
        const loginFormContainer = document.getElementById('login-form-container');
        const registerFormContainer = document.getElementById('register-form-container');
        if (tabName === 'login') {
            loginTab.classList.add('active'); registerTab.classList.remove('active');
            loginFormContainer.classList.remove('hidden'); registerFormContainer.classList.add('hidden');
        } else {
            loginTab.classList.remove('active'); registerTab.classList.add('active');
            loginFormContainer.classList.add('hidden'); registerFormContainer.classList.remove('hidden');
        }
    }
}


// --- Global Auth State Observer ---
// This runs on every page that includes this script.
onAuthStateChanged(auth, (user) => {
    // --- Update Header UI ---
    const authLinksDesktop = document.getElementById('auth-links-desktop');
    const authLinksMobile = document.getElementById('auth-links-mobile');
    if (authLinksDesktop && authLinksMobile) {
        if (user) {
            const userName = user.displayName || user.email.split('@')[0];
            authLinksDesktop.innerHTML = `<span class="font-semibold text-gray-700">Hi, ${userName}</span> <button id="logout-btn-desktop" class="font-semibold text-gray-700 hover:text-blue-600">Logout</button>`;
            authLinksMobile.innerHTML = `<button id="logout-btn-mobile" class="w-full text-center text-sm bg-red-500 text-white hover:bg-red-600 py-2 px-4 rounded-lg font-semibold">Logout</button>`;
            document.getElementById('logout-btn-desktop')?.addEventListener('click', window.flamea.handleLogout);
            document.getElementById('logout-btn-mobile')?.addEventListener('click', window.flamea.handleLogout);
        } else {
            authLinksDesktop.innerHTML = `<a href="login.html" class="text-sm bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold inline-flex items-center gap-2">Login</a>`;
            authLinksMobile.innerHTML = `<a href="login.html" class="w-full text-center text-sm bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg font-semibold inline-flex justify-center gap-2">Login</a>`;
        }
    }

    // --- Update Tools Page UI ---
    const memberWelcome = document.getElementById('member-welcome');
    if (memberWelcome) {
        const nonMemberPrompt = document.getElementById('non-member-prompt');
        if (user) {
            memberWelcome.classList.remove('hidden');
            nonMemberPrompt.classList.add('hidden');
            memberWelcome.querySelector('h1').textContent = `Welcome Back, ${user.displayName || 'Tata'}!`;
        } else {
            memberWelcome.classList.add('hidden');
            nonMemberPrompt.classList.remove('hidden');
        }
    }
    
    // --- Update Parenting Plan Page UI ---
    const saveBtn = document.getElementById('save-btn');
    if(saveBtn) {
        saveBtn.disabled = !user;
        if(!user) {
            saveBtn.title = "You must be logged in to save.";
            saveBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            saveBtn.title = "";
            saveBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
});
