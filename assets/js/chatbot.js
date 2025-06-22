// /assets/js/chatbot.js
// This script powers the iSazi chatbot interface, connecting to the Gemini API for responses.

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    // --- Chat History ---
    // We start with a system message to set the context for the AI
    const chatHistory = [{
        role: "system",
        parts: [{ text: "You are iSazi, a wise, empathetic, and knowledgeable AI assistant for South African fathers. Your purpose is to provide guidance on fatherhood, family law, cultural matters, and personal growth, grounded in the context of the South African constitution. You are not a lawyer and must not give legal advice, but you can explain legal concepts and suggest when to seek professional legal help. Your tone should be supportive, respectful, and encouraging, like a wise elder or 'uMalume'. Respond in clear, accessible English. Do not use markdown formatting." }]
    }];

    // --- Functions ---

    /**
     * Appends a message to the chat window.
     * @param {string} message The text content of the message.
     * @param {string} sender 'user' or 'bot'.
     */
    function appendMessage(message, sender) {
        const messageDiv = document.createElement('div');
        if (sender === 'user') {
            messageDiv.className = 'flex items-start gap-3 mb-4 justify-end';
            messageDiv.innerHTML = `
                <div class="bg-gray-700 text-white p-3 rounded-lg rounded-br-none max-w-md">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.className = 'flex items-start gap-3 mb-4';
            messageDiv.innerHTML = `
                <div class="bg-blue-500 text-white p-3 rounded-lg rounded-bl-none max-w-md">
                    <p id="bot-thinking">...</p>
                </div>
            `;
        }
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
        return messageDiv; // Return the message element to update it later
    }

    /**
     * Handles sending the user's message and getting a response from the AI.
     */
    async function handleSendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        // Display user's message
        appendMessage(userMessage, 'user');
        chatInput.value = '';
        
        // Add user message to history
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        // Display thinking indicator
        const botMessageDiv = appendMessage('', 'bot');
        const botParagraph = botMessageDiv.querySelector('#bot-thinking');

        try {
            // --- Gemini API Call ---
            // The API key is left as an empty string. The Canvas environment will provide it.
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            // We create a payload with the entire chat history for context
            const payload = { contents: chatHistory };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(`API Error: ${response.status} - ${errorBody.error?.message || 'Unknown error'}`);
            }

            const result = await response.json();
            
            // Safely access the response text
            const botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (botResponse) {
                // Update bot's message with the actual response
                botParagraph.textContent = botResponse;
                // Add bot response to history
                chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
            } else {
                throw new Error("Received an empty or invalid response from the AI.");
            }

        } catch (error) {
            console.error("Chatbot Error:", error);
            botParagraph.textContent = "I'm sorry, I encountered an error and cannot respond right now. Please try again later.";
        }
    }

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    console.log("iSazi Chatbot initialized.");
    // Note: This chatbot does not use Firebase for storing chat history.
    // The history is stored in memory for the duration of the session.
});
