// /assets/js/firebase-config.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Your web app's Firebase configuration, provided by you.
const firebaseConfig = {
  apiKey: "AIzaSyBsUGuJuPYfaaK3Xwyjoya8FbicrHJLUrc",
  authDomain: "legalhelp-b02c8.firebaseapp.com",
  projectId: "legalhelp-b02c8",
  storageBucket: "legalhelp-b02c8.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "361046136255",
  appId: "1:361046136255:web:f4f39e3b71d3eaec6f7d0a",
  measurementId: "G-NZMFF1M6C0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Auth Providers
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

// Export the necessary instances for other scripts to use
export { app, auth, db, googleProvider, appleProvider };
