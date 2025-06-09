import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { auth } from './firebase-config.js';

// --- Global Auth State Manager ---
onAuthStateChanged(auth, (user) => {
    const authLinksDesktop = document.getElementById('auth-links-desktop');
    const authReminder = document.getElementById('auth-reminder');

    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        if (authLinksDesktop) {
            authLinksDesktop.innerHTML = `
                <div class="text-white text-sm mb-2">Welcome, ${displayName}</div>
                <div>
                    <a href="dashboard.html" class="text-green-400 hover:underline text-sm mr-4">My Dashboard</a>
                    <a href="#" id="logout-btn" class="text-red-400 hover:underline text-sm">Logout</a>
                </div>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        }
        if (authReminder) {
            authReminder.style.display = 'none';
        }
        // Expose user object globally for other scripts to use
        if (!window.flamea) window.flamea = {};
        window.flamea.user = user;

    } else {
        if (authLinksDesktop) {
            authLinksDesktop.innerHTML = `
                <a href="login.html" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Login / Register
                </a>
            `;
        }
        if (authReminder) {
            authReminder.style.display = 'block';
        }
         if (window.flamea) window.flamea.user = null;
    }
});


// --- Logout Handler ---
const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        console.log('User signed out');
        // Redirect to homepage after logout if not already there
        if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('index.html')) {
            window.location.href = 'index.html';
        }
    }).catch((error) => {
        console.error('Sign out error', error);
    });
};


// --- Login/Register Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the login page before proceeding
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return; 

    const registerForm = document.getElementById('register-form');
    const googleBtn = document.getElementById('google-signin-btn');
    const messageDiv = document.getElementById('auth-message');

    const showMessage = (message, isError = false) => {
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `p-2 text-center rounded ${isError ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`;
        }
    };
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, e.target.email.value, e.target.password.value)
            .then(() => {
                showMessage('Login successful! Redirecting...');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            })
            .catch((error) => showMessage(error.message.replace('Firebase: ', ''), true));
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Now update the profile
                return updateProfile(auth.currentUser, { displayName: name });
            })
            .then(() => {
                 showMessage('Registration successful! Redirecting to your new dashboard...');
                 setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
            })
            .catch((error) => showMessage(error.message.replace('Firebase: ', ''), true));
    });
    
    googleBtn.addEventListener('click', () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                showMessage('Google sign-in successful! Redirecting...');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
            })
            .catch((error) => showMessage(error.message.replace('Firebase: ', ''), true));
    });
});
