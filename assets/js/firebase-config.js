// assets/js/firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, GoogleAuthProvider, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";

// Your web app's Firebase configuration for the main Flamea project
const firebaseConfig = {
  apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
  authDomain: "flamea.firebaseapp.com",
  projectId: "flamea",
  storageBucket: "flamea.firebasestorage.app",
  messagingSenderId: "681868881622",
  appId: "1:681868881622:web:d20687c688b2d1d943a377",
  measurementId: "G-MX7X9JQE51"
};

// Initialize Firebase main application
const app = initializeApp(firebaseConfig, "flamea"); // Named initialization

// Initialize and export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Export providers for use in auth.js
const googleProvider = new GoogleAuthProvider();
const emailProvider = new EmailAuthProvider();

export { app, auth, db, storage, analytics, googleProvider, emailProvider };