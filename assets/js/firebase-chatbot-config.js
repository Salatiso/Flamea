// assets/js/firebase-chatbot-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configuration for the AI Chatbot project
const chatbotFirebaseConfig = {
  apiKey: "AIzaSyCUzKEzNZWNaOXBIV4yxv1Il8RwWgCuMgE", // This is the key for flamea-ai-app
  authDomain: "flamea-ai-app.firebaseapp.com",
  projectId: "flamea-ai-app",
  storageBucket: "flamea-ai-app.firebasestorage.app",
  messagingSenderId: "761216371067",
  appId: "1:761216371067:web:a17cd633305a954edf95de"
};

// Initialize a secondary Firebase app instance specifically for the chatbot.
// We give it a unique name 'chatbot' to avoid conflicts with the main 'flamea' app.
const chatbotApp = initializeApp(chatbotFirebaseConfig, 'chatbot');

// Get a Firestore instance from our chatbot app
const chatbotDb = getFirestore(chatbotApp);

// Export the chatbot's Firestore instance
export { chatbotDb };
