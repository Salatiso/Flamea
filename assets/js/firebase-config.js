// /assets/js/firebase-config.js
// This file contains the Firebase configuration for the MAIN Flamea web application.
// It should be included in all HTML files EXCEPT chatbot.html.

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

// Initialize Firebase for the main app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("Main Firebase App (flamea) initialized.");
}
