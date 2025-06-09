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
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');
    const authReminder = document.getElementById('auth-reminder');

    if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        if (authLinksDesktop) {
            authLinksDesktop.innerHTML = `
                <div class="text-white text-sm">Welcome, ${displayName}</div>
                <a href="#" id="logout-btn" class="text-red-400 hover:underline text-sm">Logout</a>
            `;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        }
        if (authReminder) authReminder.style.display = 'none';
        
        // For dashboard page
        if(dashboardContainer && loginPrompt) {
            dashboardContainer.classList.remove('hidden');
            loginPrompt.classList.add('hidden');
        }

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
        if (authReminder) authReminder.style.display = 'block';

        // For dashboard page
         if(dashboardContainer && loginPrompt) {
            dashboardContainer.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
        }

        if (window.flamea) window.flamea.user = null;
    }
});


// --- Logout Handler ---
const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        console.log('User signed out');
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }).catch((error) => {
        console.error('Sign out error', error);
    });
};

// --- Login/Register Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const googleBtn = document.getElementById('google-signin-btn');
    const messageDiv = document.getElementById('auth-message');

    if (!loginForm) return; // Exit if not on the login page

    const showMessage = (message, isError = false) => {
        messageDiv.textContent = message;
        messageDiv.className = `p-2 text-center ${isError ? 'text-red-400' : 'text-green-400'}`;
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
            .then((userCredential) => updateProfile(auth.currentUser, { displayName: name }))
            .then(() => {
                 showMessage('Registration successful! Redirecting...');
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
