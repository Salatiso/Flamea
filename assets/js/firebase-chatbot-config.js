// /assets/js/firebase-chatbot-config.js
// This file contains the Firebase configuration for the iSazi CHATBOT application.
// It should ONLY be included in chatbot.html.

// Your web app's Firebase configuration for the chatbot project
const firebaseConfigChatbot = {
  apiKey: "AIzaSyCUzKEzNZWNaOXBIV4yxv1Il8RwWgCuMgE",
  authDomain: "flamea-ai-app.firebaseapp.com",
  projectId: "flamea-ai-app",
  storageBucket: "flamea-ai-app.firebasestorage.app",
  messagingSenderId: "761216371067",
  appId: "1:761216371067:web:3534c47c6a85b833df95de"
};

// Initialize a secondary Firebase app for the chatbot
// We give it a unique name to avoid conflicts with the main app
let chatbotApp;
try {
    chatbotApp = firebase.app('chatbot');
} catch (e) {
    chatbotApp = firebase.initializeApp(firebaseConfigChatbot, 'chatbot');
    console.log("Secondary Firebase App (flamea-ai-app) for chatbot initialized.");
}

// You can now access the chatbot's firestore and other services via this app instance
// const chatbotDb = chatbotApp.firestore();

