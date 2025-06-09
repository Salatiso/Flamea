// This file initializes Firebase for the entire application.

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
  authDomain: "flamea.firebaseapp.com",
  projectId: "flamea",
  storageBucket: "flamea.appspot.com",
  messagingSenderId: "681868881622",
  appId: "1:681868881622:web:d20687c688b2d1d943a377",
  measurementId: "G-MX7X9JQE51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // NEW: Initialize and export Storage
