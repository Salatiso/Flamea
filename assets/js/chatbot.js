// We import the specific Firestore instance for the chatbot from its dedicated config file.
import { chatbotDb } from './firebase-chatbot-config.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, limit } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENT SELECTION ---
    const chatModal = document.getElementById('chatbot-modal');
    if (!chatModal) return;

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
            // --- 1. RETRIEVE KNOWLEDGE FROM FIRESTORE (RAG) ---
            const contextFromBooks = await searchKnowledgeBase(messageText);

            // --- 2. GENERATE RESPONSE WITH GEMINI ---
            const botResponse = await getGeminiResponse(messageText, contextFromBooks);

            appendMessage(botResponse.replace(/\n/g, '<br>'), 'bot');

            // --- 3. PERSIST CONVERSATION ---
            await addDoc(collection(chatbotDb, 'conversations'), {
                user_message: messageText,
                bot_response: botResponse,
                retrieved_context: contextFromBooks, // Save what context was used
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage = "Sorry, I had trouble finding an answer. My knowledge base might be updating. Please try again.";
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
     * Searches the Firestore 'knowledge_base' for relevant content.
     * @param {string} userMessage The user's query.
     * @returns {Promise<string>} A string containing the relevant text chunks.
     */
    async function searchKnowledgeBase(userMessage) {
        console.log("Searching knowledge base for:", userMessage);
        const knowledgeBaseRef = collection(chatbotDb, "knowledge_base");

        // Simple keyword extraction (can be improved with more advanced NLP)
        const keywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);
        if (keywords.length === 0) return ""; // No useful keywords

        try {
            // Create a query to find documents where the 'content' contains any of the keywords.
            // Note: Firestore does not support full-text search natively. This is a basic workaround.
            // For production, a dedicated search service like Algolia or Elasticsearch is recommended.
            // This query is a placeholder for a more robust keyword search.
            const q = query(knowledgeBaseRef, where("keywords", "array-contains-any", keywords), limit(3));
            const querySnapshot = await getDocs(q);

            let context = "";
            if (!querySnapshot.empty) {
                querySnapshot.forEach(doc => {
                    context += doc.data().content + "\n\n";
                });
                console.log("Found relevant context from books.");
                return context;
            } else {
                 console.log("No specific context found, using general knowledge.");
                 return ""; // Return empty string if no docs found
            }
        } catch (error) {
             console.error("Error searching knowledge base:", error);
             // This might fail if the composite index is not created. Firestore provides a link in the error console to create it.
             return "";
        }
    }


    /**
     * Appends a new message bubble to the chat window.
     * @param {string} htmlContent The HTML content of the message.
     * @param {string} type The type of message ('user', 'bot', or 'bot-error').
     */
    function appendMessage(htmlContent, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', `${type}-message`);
        messageElement.innerHTML = htmlContent;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    /**
     * Sends a prompt to the Gemini API, augmented with context from Firestore.
     * @param {string} userMessage The message from the user.
     * @param {string} context The context retrieved from the knowledge base.
     * @returns {Promise<string>} The bot's text response.
     */
    async function getGeminiResponse(userMessage, context) {
        let prompt;

        if (context) {
            prompt = `Based on the following information from my books: \n\n---START OF BOOK CONTENT---\n${context}\n---END OF BOOK CONTENT---\n\nNow, as a helpful legal information assistant for South African Family Law named Flamea, answer the following user question. Prioritize information from the book content provided. Do not provide legal advice. User question: "${userMessage}"`;
        } else {
            prompt = `You are a helpful legal information assistant for South Africa, named Flamea. Your expertise is strictly in South African Family Law. Your purpose is to provide general information, not legal advice. Do not answer questions outside of this scope. Based on this, answer the following user question: "${userMessage}"`;
        }

        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        const apiKey = ""; // Handled by execution environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const result = await response.json();
        const botText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botText) {
            return botText;
        } else {
            throw new Error("Received an invalid response from the AI service.");
        }
    }
});
