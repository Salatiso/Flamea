// assets/js/chatbot.js

// We import the specific Firestore instance for the chatbot
import { chatbotDb } from './firebase-chatbot-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatWidget = document.getElementById('chat-widget');
    const openChatButton = document.getElementById('open-chat-button');
    const closeChatButton = document.getElementById('close-chat-button');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    // Toggle chat widget visibility
    if(openChatButton) {
        openChatButton.addEventListener('click', () => chatWidget.classList.remove('hidden'));
    }
    if(closeChatButton) {
        closeChatButton.addEventListener('click', () => chatWidget.classList.add('hidden'));
    }

    // Handle message submission
    if(chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (messageText === '') return;

            // Display user's message immediately
            appendMessage(messageText, 'user');
            chatInput.value = '';

            try {
                // Save user message to the chatbot's Firestore
                await addDoc(collection(chatbotDb, 'messages'), {
                    text: messageText,
                    timestamp: serverTimestamp(),
                    sender: 'user'
                });

                // Display a thinking indicator
                const thinkingIndicator = appendMessage('...', 'bot');
                
                // --- Call to a Gemini-like function would go here ---
                // For now, we will simulate a response.
                setTimeout(() => {
                    const botResponse = "I am a simulated AI. The connection to the real AI will be configured soon.";
                    thinkingIndicator.textContent = botResponse; // Update the thinking indicator with the real response
                }, 1500);

            } catch (error) {
                console.error("Error sending message:", error);
                appendMessage("Sorry, I couldn't send your message.", 'bot-error');
            }
        });
    }

    function appendMessage(text, type) {
        const messageElement = document.createElement('div');
        messageElement.textContent = text;
        messageElement.classList.add('p-2', 'rounded-lg', 'mb-2', 'max-w-xs');

        if (type === 'user') {
            messageElement.classList.add('bg-blue-500', 'text-white', 'self-end');
        } else if (type === 'bot') {
            messageElement.classList.add('bg-gray-200', 'text-gray-800', 'self-start');
        } else if (type === 'bot-error') {
            messageElement.classList.add('bg-red-200', 'text-red-800', 'self-start');
        }
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        return messageElement;
    }
});
