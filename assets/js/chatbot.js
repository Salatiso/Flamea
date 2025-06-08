// assets/js/chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    const aiToolCard = document.getElementById('ai-tool-card');
    const chatbotModal = document.getElementById('chatbot-modal');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('messages-container');

    // This handles the new modal setup from main.js
    if (aiToolCard && chatbotModal) {
         aiToolCard.setAttribute('data-modal-target', 'chatbot-modal');
         closeChatbotBtn.setAttribute('data-modal-close', 'chatbot-modal');
    }

    let chatHistory = [];

    // System prompt to guide the AI's persona
    const systemPrompt = `You are "The Flamea Guide," an expert AI assistant for the South African organization FLAMEA. Your role is to provide clear, helpful, and empowering information about South African family law, specifically for fathers. 
    Your tone must be supportive and encouraging, but also direct and factual. 
    You MUST always include this disclaimer at the end of every response, on a new line: "Disclaimer: I am an AI assistant and this is not legal advice. Please consult a qualified attorney for your specific situation."
    Do not answer questions outside the scope of South African family law, fatherhood, or parenting. If asked an unrelated question, politely decline and restate your purpose.`;

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', sender === 'user' ? 'user-message' : 'bot-message');
        // A simple way to render newlines from the AI response
        messageElement.innerHTML = text.replace(/\n/g, '<br>');
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    const showTypingIndicator = (show) => {
        let typingIndicator = document.getElementById('typing-indicator');
        if (show) {
            if (!typingIndicator) {
                typingIndicator = document.createElement('div');
                typingIndicator.id = 'typing-indicator';
                typingIndicator.classList.add('bot-message');
                typingIndicator.innerHTML = '<span class="animate-pulse">The Guide is thinking...</span>';
                messagesContainer.appendChild(typingIndicator);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } else {
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    };

    chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user');
        chatbotInput.value = '';
        showTypingIndicator(true);

        if (chatHistory.length === 0) {
            chatHistory.push({ role: "user", parts: [{ text: systemPrompt }] });
            chatHistory.push({ role: "model", parts: [{ text: "Understood. I am The Flamea Guide. I will provide supportive, factual information on South African family law for fathers and always include the disclaimer." }] });
        }
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        try {
            const apiKey = ""; // The platform will provide this
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            // We only send the last few messages to keep the context relevant and the payload small
            const recentHistory = chatHistory.slice(-6); // System prompt + 2 pairs of user/model messages
            const payload = { contents: recentHistory };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            showTypingIndicator(false);
            
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
                const botResponse = result.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
                chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
            } else {
                 addMessage("I'm sorry, I encountered an issue and couldn't generate a response. Please try rephrasing your question.", 'bot');
            }

        } catch (error) {
            showTypingIndicator(false);
            console.error("Chatbot API Error:", error);
            addMessage("I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again.", 'bot');
        }
    });
});
