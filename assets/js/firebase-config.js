// assets/js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

// Your web app's Firebase configuration for the MAIN Flamea project
// This is used for user authentication, dashboard data, etc.
const mainFirebaseConfig = {
    apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
    authDomain: "flamea.firebaseapp.com",
    projectId: "flamea",
    storageBucket: "flamea.appspot.com", // Corrected from firebasestorage.app
    messagingSenderId: "681868881622",
    appId: "1:681868881622:web:d20687c688b2d1d943a377",
    measurementId: "G-MX7X9JQE51"
};

// Initialize the main Firebase app
const app = initializeApp(mainFirebaseConfig);

// Initialize and export Firebase services to be used by other scripts
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// NOTE: The separate chatbot configuration is handled in its own file
// to avoid confusion and conflicts.
