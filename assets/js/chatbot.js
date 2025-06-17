// We import the specific Firestore instance for the chatbot from its dedicated config file.
import { chatbotDb } from './firebase-chatbot-config.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const chatModal = document.getElementById('chatbot-modal');
    if (!chatModal) return; // Stop if the modal isn't on the page

    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const formButton = chatForm ? chatForm.querySelector('button') : null;
    const typingIndicator = document.getElementById('typing-indicator');

    if (!chatForm || !chatInput || !formButton || !chatMessagesContainer) {
        return;
    }

    // --- FORM SUBMISSION EVENT LISTENER ---
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // --- UI & STATE MANAGEMENT ---
        chatInput.disabled = true;
        formButton.disabled = true;
        if(typingIndicator) typingIndicator.style.display = 'block';

        appendMessage(messageText, 'user');
        chatInput.value = '';

        try {
            // =================================================================
            // KNOWLEDGE BASE HOOK (Coming in the next step)
            // In the future, we will first search our Firestore knowledge base
            // for content from your books related to `messageText`.
            // const contextFromBooks = await searchKnowledgeBase(messageText);
            // =================================================================

            // --- Call the Gemini API for a response ---
            const botResponse = await getGeminiResponse(messageText); // We'll pass `contextFromBooks` here later

            // Display the bot's response
            appendMessage(botResponse.replace(/\n/g, '<br>'), 'bot');

            // --- DATA PERSISTENCE ---
            // Save the conversation turn to Firestore
            await addDoc(collection(chatbotDb, 'conversations'), {
                user_message: messageText,
                bot_response: botResponse,
                timestamp: serverTimestamp(),
                // We could add a user ID here if they are logged in
            });

        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage = "Sorry, I encountered a problem. Please try again later.";
            appendMessage(errorMessage, 'bot-error');
        } finally {
            // --- CLEANUP ---
            chatInput.disabled = false;
            formButton.disabled = false;
            if(typingIndicator) typingIndicator.style.display = 'none';
            chatInput.focus();
        }
    });

    /**
     * Appends a new message bubble to the chat window.
     * @param {string} htmlContent - The HTML content of the message.
     * @param {string} type - The type of message ('user', 'bot', or 'bot-error').
     */
    function appendMessage(htmlContent, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', `${type}-message`);
        messageElement.innerHTML = htmlContent; // Using innerHTML to render line breaks (<br>)

        chatMessagesContainer.appendChild(messageElement);
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
        // In the future, we will add content from your books here.
        const prompt = `You are a helpful legal information assistant for South Africa, named Flamea. Your expertise is strictly in South African Family Law. Your purpose is to provide general information, not legal advice. Do not answer questions outside of this scope. Based on this, answer the following user question: "${userMessage}"`;

        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }]
        };

        const apiKey = ""; // This is handled by the execution environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();
        const botText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botText) {
            return botText;
        } else {
            console.error("Invalid response structure from API:", JSON.stringify(result, null, 2));
            throw new Error("Received an invalid response from the AI service.");
        }
    }
});
