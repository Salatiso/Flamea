// In assets/js/firebase-config.js

export function getFirebaseConfig() {
    const firebaseConfig = {
        apiKey: "AIzaSyCUzKEzNZWNaOXBIV4yxv1Il8RwWgCuMgE",
        authDomain: "flamea-ai-app.firebaseapp.com",
        projectId: "flamea-ai-app",
        storageBucket: "flamea-ai-app.appspot.com", // Corrected this line
        messagingSenderId: "761216371067",
        appId: "1:761216371067:web:3534c47c6a85b833df95de"
    };
    return firebaseConfig;
}