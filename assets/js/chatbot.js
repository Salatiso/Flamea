// assets/js/chatbot.js

// We import the specific Firestore instance for the chatbot
import { chatbotDb } from './firebase-chatbot-config.js'; 
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const formButton = chatForm.querySelector('button');

    if(chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (messageText === '') return;

            // Disable form while processing
            chatInput.disabled = true;
            formButton.disabled = true;

            // Display user's message immediately
            appendMessage(messageText, 'user');
            chatInput.value = '';

            // Save user message to the chatbot's Firestore
            try {
                await addDoc(collection(chatbotDb, 'messages'), {
                    text: messageText,
                    timestamp: serverTimestamp(),
                    sender: 'user'
                });
            } catch (error) {
                console.error("Error saving message to Firestore:", error);
                // Non-critical error, so we continue
            }
            
            // Display a thinking indicator
            const thinkingIndicator = appendMessage('<i class="fas fa-spinner fa-spin"></i>', 'bot');
            
            // --- Call the Gemini API ---
            try {
                // Pre-prompt to keep the AI focused on South African law
                const prompt = `You are an expert legal assistant specializing in South African Family Law. Answer the following question concisely, based on South African law and legal precedent. Do not provide advice, only information. Question: "${messageText}"`;
                
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = ""; // API key will be injected by the environment
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const result = await response.json();

                if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts.length > 0) {
                    const botResponse = result.candidates[0].content.parts[0].text;
                    thinkingIndicator.innerHTML = botResponse.replace(/\n/g, '<br>'); // Update indicator with the real response
                } else {
                    throw new Error("Invalid response structure from API.");
                }

            } catch (error) {
                console.error("Error fetching from Gemini API:", error);
                thinkingIndicator.innerHTML = "Sorry, I encountered an error trying to get an answer. Please check the console and try again.";
                thinkingIndicator.classList.remove('bot-message');
                thinkingIndicator.classList.add('bot-error');
            } finally {
                 // Re-enable form
                chatInput.disabled = false;
                formButton.disabled = false;
                chatInput.focus();
            }
        });
    }

    function appendMessage(htmlContent, type) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = htmlContent;
        messageElement.classList.add('message-bubble', `${type}-message`);
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        return messageElement;
    }
});
