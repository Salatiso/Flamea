import { chatbotDb } from './firebase-chatbot-config.js';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
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

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        chatInput.disabled = true;
        formButton.disabled = true;
        if(typingIndicator) typingIndicator.style.display = 'block';

        appendMessage(messageText, 'user');
        chatInput.value = '';

        try {
            const contextFromBooks = await searchKnowledgeBase(messageText);
            const botResponse = await getGeminiResponse(messageText, contextFromBooks);
            const formattedResponse = botResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            appendMessage(formattedResponse, 'bot');
            
            await addDoc(collection(chatbotDb, 'conversations'), {
                user_message: messageText,
                bot_response: botResponse,
                retrieved_context: contextFromBooks,
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("Chatbot Error:", error);
            const errorMessage = "Sorry, I had trouble finding an answer. My knowledge base might be updating or the AI service is currently unavailable. Please try again later.";
            appendMessage(errorMessage, 'bot-error');
        } finally {
            chatInput.disabled = false;
            formButton.disabled = false;
            if(typingIndicator) typingIndicator.style.display = 'none';
            chatInput.focus();
        }
    });

    async function searchKnowledgeBase(userMessage) {
        console.log("Searching knowledge base for:", userMessage);
        const knowledgeBaseRef = collection(chatbotDb, "knowledge_base");
        const keywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 4); // Use more specific keywords
        if (keywords.length === 0) return "";

        try {
            // FIX: Instead of a complex query that fails without an index, 
            // fetch a limited number of recent documents and filter client-side.
            // This is less efficient for large datasets but works without backend setup.
            const q = query(knowledgeBaseRef, orderBy("timestamp", "desc"), limit(50));
            const querySnapshot = await getDocs(q);
            
            let relevantChunks = [];
            querySnapshot.forEach(doc => {
                const content = doc.data().content.toLowerCase();
                // Check if any keyword appears in the content
                if (keywords.some(keyword => content.includes(keyword))) {
                    relevantChunks.push(doc.data().content);
                }
            });

            if (relevantChunks.length > 0) {
                console.log(`Found ${relevantChunks.length} relevant context chunks.`);
                // Join the most relevant chunks (up to a certain limit to manage prompt size)
                return relevantChunks.slice(0, 3).join("\n\n---\n\n");
            } else {
                 console.log("No specific context found, using general knowledge.");
                 return "";
            }
        } catch (error) {
             console.error("Error searching knowledge base:", error);
             return "";
        }
    }

    function appendMessage(htmlContent, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', `${type}-message`);
        messageElement.innerHTML = htmlContent;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    async function getGeminiResponse(userMessage, context) {
        let prompt;

        if (context) {
            prompt = `Based *only* on the following information from my books: \n\n---START OF BOOK CONTENT---\n${context}\n---END OF BOOK CONTENT---\n\nNow, as a helpful legal information assistant for South African Family Law named iSazi, answer the following user question. If the answer is not in the provided book content, state that you cannot find the information in the provided texts. Do not provide legal advice. User question: "${userMessage}"`;
        } else {
            prompt = `You are a helpful legal information assistant for South Africa, named iSazi. Your expertise is strictly in South African Family Law. Your purpose is to provide general information, not legal advice. Do not answer questions outside of this scope. Based on this, answer the following user question: "${userMessage}"`;
        }
        
        // Use the appropriate Gemini model for this task
        const model = 'gemini-2.0-flash';
        const apiKey = ""; // Will be populated by the environment.
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }],
            // Add safety settings to reduce chances of getting blocked responses
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            ],
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed: ${response.statusText}. Body: ${errorBody}`);
        }

        const result = await response.json();
        const botText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (botText) {
            return botText;
        } else {
            console.warn("Invalid response structure from AI service:", result);
            throw new Error("Received no text in the response from the AI service.");
        }
    }
});
