// assets/js/firebase-chatbot-config.js

// Import the necessary functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration for the AI Chatbot project (flamea-ai-app)
// IMPORTANT: This uses a separate Firebase project to keep chat data isolated.
const chatbotFirebaseConfig = {
  apiKey: "AIzaSyCUzKEzNZWNaOXBIV4yxv1Il8RwWgCuMgE",
  authDomain: "flamea-ai-app.firebaseapp.com",
  projectId: "flamea-ai-app",
  storageBucket: "flamea-ai-app.appspot.com",
  messagingSenderId: "761216371067",
  appId: "1:761216371067:web:a17cd633305a954edf95de"
};

// Initialize a secondary Firebase app instance specifically for the chatbot.
// We give it a unique name 'chatbot' to avoid conflicts with the main 'flamea' app instance.
const chatbotApp = initializeApp(chatbotFirebaseConfig, 'chatbot');

// Get a Firestore instance from our dedicated chatbot app
const chatbotDb = getFirestore(chatbotApp);

// Export the chatbot's Firestore instance for use in other scripts
export { chatbotDb };
