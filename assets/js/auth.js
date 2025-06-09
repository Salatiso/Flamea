import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { auth } from './firebase-config.js';

// --- Global Auth State Manager ---
// This function listens for changes in authentication state (login/logout)
// and updates the UI across the entire site.
onAuthStateChanged(auth, (user) => {
    const authLinksDesktop = document.getElementById('auth-links-desktop');
    const authReminder = document.getElementById('auth-reminder');

    if (user) {
        // User is signed in
        const displayName = user.displayName || user.email.split('@')[0];
        if (authLinksDesktop) {
            authLinksDesktop.innerHTML = `
                <div class="text-white text-sm">Welcome, ${displayName}</div>
                <a href="#" id="logout-btn" class="text-red-400 hover:underline text-sm">Logout</a>
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
        // User is signed out
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
        // Redirect to homepage after logout
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
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
    const messageDiv = document.getElementById('auth-message');

    const showMessage = (message, isError = false) => {
        if(messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = isError ? 'text-red-400 text-center p-2' : 'text-green-400 text-center p-2';
            messageDiv.style.display = 'block';
        }
    };
    
    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    showMessage('Login successful! Redirecting...');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                })
                .catch((error) => {
                    showMessage(error.message, true);
                });
        });
    }

    // Register Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Update the user's profile with their name
                    return updateProfile(auth.currentUser, {
                        displayName: name
                    });
                })
                .then(() => {
                     showMessage('Registration successful! Redirecting to your new dashboard...');
                     setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
                })
                .catch((error) => {
                    showMessage(error.message, true);
                });
        });
    }
});
