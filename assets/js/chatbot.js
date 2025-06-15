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
  storageBucket: "flamea-ai-app.appspot.com", // Corrected storage bucket format
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
```javascript
// assets/js/chatbot.js

// We import the specific Firestore instance for the chatbot from its dedicated config file.
import { chatbotDb } from './firebase-chatbot-config.js'; 
import { collection, addDoc, serverTimestamp } from "[https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js](https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js)";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const formButton = chatForm ? chatForm.querySelector('button') : null;

    // If the chat form doesn't exist on the page, stop execution.
    if (!chatForm || !chatInput || !formButton) {
        return;
    }

    // --- FORM SUBMISSION EVENT LISTENER ---
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // --- UI & STATE MANAGEMENT ---
        // Disable the form to prevent multiple submissions
        chatInput.disabled = true;
        formButton.disabled = true;

        // Immediately display the user's message
        appendMessage(messageText, 'user');
        chatInput.value = ''; // Clear the input field

        // Display a "thinking" indicator for the bot's response
        const thinkingIndicator = appendMessage('<i class="fas fa-spinner fa-spin"></i>', 'bot');
        
        // --- DATA PERSISTENCE & API CALL ---
        try {
            // Save the user's message to the dedicated chatbot Firestore instance
            await addDoc(collection(chatbotDb, 'messages'), {
                text: messageText,
                timestamp: serverTimestamp(),
                sender: 'user',
                response_needed: true // Flag for the backend/Cloud Function
            });

            // --- Call the Gemini API for a response ---
            const botResponse = await getGeminiResponse(messageText);
            
            // Update the thinking indicator with the actual response from the bot
            thinkingIndicator.innerHTML = botResponse.replace(/\n/g, '<br>');

        } catch (error) {
            console.error("Chatbot Error:", error);
            // If an error occurs, update the thinking indicator with an error message
            thinkingIndicator.innerHTML = "Sorry, I encountered a problem. Please try again later.";
            thinkingIndicator.classList.remove('bot-message');
            thinkingIndicator.classList.add('bot-error'); // Style it as an error
        } finally {
            // --- CLEANUP ---
            // Re-enable the form regardless of success or failure
            chatInput.disabled = false;
            formButton.disabled = false;
            chatInput.focus(); // Set focus back to the input field
        }
    });

    /**
     * Appends a new message bubble to the chat window.
     * @param {string} htmlContent - The HTML content of the message.
     * @param {string} type - The type of message ('user' or 'bot' or 'bot-error').
     * @returns {HTMLElement} The created message element.
     */
    function appendMessage(htmlContent, type) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = htmlContent;
        // Apply appropriate classes based on the message type
        messageElement.classList.add('message-bubble', `${type}-message`);
        
        chatMessagesContainer.appendChild(messageElement);
        // Automatically scroll to the latest message
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        return messageElement;
    }

    /**
     * Sends a prompt to the Gemini API and returns the text response.
     * @param {string} userMessage - The message typed by the user.
     * @returns {Promise<string>} A promise that resolves with the bot's text response.
     */
    async function getGeminiResponse(userMessage) {
        // Construct the prompt with specific instructions for the AI model
        const prompt = `You are a helpful legal information assistant for South Africa, named Flamea. Your expertise is strictly in South African Family Law. Your purpose is to provide general information, not legal advice. Do not answer questions outside of this scope. Based on this, answer the following user question: "${userMessage}"`;
        
        // Prepare the payload for the Gemini API
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const apiKey = ""; // API key is handled by the execution environment.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        // Make the POST request to the API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Check if the network request itself was successful
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();
        
        // Safely access the response text
        const botText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botText) {
            return botText;
        } else {
            // Handle cases where the API returns a valid but empty or unexpected response
            console.error("Invalid response structure from API:", JSON.stringify(result, null, 2));
            throw new Error("Received an invalid response from the AI service.");
        }
    }
});
