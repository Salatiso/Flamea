/**
 * Flamea.org - firebase-config.js
 * * This file centralizes all Firebase project configurations for the Flamea platform.
 * It prevents code duplication and ensures that all modules connect to the correct Firebase projects.
 * * - mainFirebaseConfig: For core user authentication and platform data.
 * - chatbotFirebaseConfig: For the dedicated AI Legal Assistant chat history and logs.
 */

// Configuration for the main Flamea application (auth, dashboard, etc.)
export const mainFirebaseConfig = {
    apiKey: "AIzaSyDNxjCwlfXl4Hhr0C2eET0y1wBEhqy0zG4",
    authDomain: "flamea.firebaseapp.com",
    projectId: "flamea",
    storageBucket: "flamea.appspot.com",
    messagingSenderId: "681868881622",
    appId: "1:681868881622:web:d20687c688b2d1d943a377",
    measurementId: "G-MX7X9JQE51"
};

// Configuration for the separate Chatbot Firebase project
export const chatbotFirebaseConfig = {
    apiKey: "AIzaSyCUzKEzNZWNaOXBIV4yxv1Il8RwWgCuMgE",
    authDomain: "flamea-ai-app.firebaseapp.com",
    projectId: "flamea-ai-app",
    storageBucket: "flamea-ai-app.appspot.com",
    messagingSenderId: "761216371067",
    appId: "1:761216371067:web:a17cd633305a954edf95de"
};
