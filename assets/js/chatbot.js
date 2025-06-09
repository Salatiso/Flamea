// This function will set up the chatbot, but only when it's called.
function initializeChatbot() {
    const chatbotModal = document.getElementById('chatbot-modal');
    if (!chatbotModal) return; // Exit if modal not on page

    // Check if the chatbot has already been initialized to prevent errors
    if (chatbotModal.dataset.initialized === 'true') {
        return;
    }

    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('messages-container');
    
    // This is a critical check. If these elements don't exist, we stop.
    if (!chatbotForm || !chatbotInput || !messagesContainer) {
        console.error("Chatbot elements not found!");
        return;
    }

    let chatHistory = [];
    const systemPrompt = `You are "The Flamea Guide," an expert AI assistant for the South African organization FLAMEA. Your purpose is to provide clear, helpful, and empowering information about South African family law, the Children's Act, and co-parenting strategies specifically for fathers. Your tone must be supportive, encouraging, and factual. You MUST end every single response with the following disclaimer on a new line: "Disclaimer: I am an AI assistant and this is not legal advice. Please consult a qualified legal professional for your specific situation." If a user asks a question outside the scope of South African family law, fatherhood, or parenting, you must politely decline and restate your purpose.`;

    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble', sender === 'user' ? 'user-message' : 'bot-message');
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
                typingIndicator.classList.add('message-bubble', 'bot-message');
                typingIndicator.innerHTML = '<span class="animate-pulse">The Guide is thinking...</span>';
                messagesContainer.appendChild(typingIndicator);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } else {
            if (typingIndicator) typingIndicator.remove();
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
            chatHistory.push({ role: "model", parts: [{ text: "Understood. I am The Flamea Guide. I will provide supportive, factual information and always include the disclaimer." }] });
        }
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        try {
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            const payload = { contents: chatHistory };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

            const result = await response.json();
            showTypingIndicator(false);
            
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
                const botResponse = result.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
                chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
            } else {
                 addMessage("I'm sorry, I couldn't generate a response. Please try rephrasing.", 'bot');
            }
        } catch (error) {
            showTypingIndicator(false);
            console.error("Chatbot API Error:", error);
            addMessage("I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    });

    // Mark the chatbot as initialized so we don't add the listener again.
    chatbotModal.dataset.initialized = 'true';
}

// Listen for clicks on ANY button that opens a modal
document.addEventListener('click', (event) => {
    const targetButton = event.target.closest('[data-modal-target]');
    if (targetButton) {
        // If the button is for the chatbot, initialize it now.
        if (targetButton.getAttribute('data-modal-target') === 'chatbot-modal') {
            initializeChatbot();
        }
    }
});
