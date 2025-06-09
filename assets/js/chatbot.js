document.addEventListener('DOMContentLoaded', () => {
    // Find all the necessary elements within the chatbot modal
    const chatbotModal = document.getElementById('chatbot-modal');
    // If the chatbot modal doesn't exist on this page, do nothing.
    if (!chatbotModal) {
        return;
    }

    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('messages-container');

    // This array will store the conversation history for context
    let chatHistory = [];

    // This is the core instruction that defines the AI's persona and rules.
    const systemPrompt = `You are "The Flamea Guide," an expert AI assistant for the South African organization FLAMEA. Your purpose is to provide clear, helpful, and empowering information about South African family law, the Children's Act, and co-parenting strategies specifically for fathers. 
    Your tone must be supportive, encouraging, and factual. You must be professional and objective.
    You MUST end every single response with the following disclaimer on a new line: "Disclaimer: I am an AI assistant and this is not legal advice. Please consult a qualified legal professional for your specific situation."
    If a user asks a question outside the scope of South African family law, fatherhood, or parenting, you must politely decline and restate your purpose. For example: "My purpose is to assist with matters related to family law in South Africa. I cannot help with [unrelated topic]."`;

    /**
     * Adds a new message bubble to the chat window.
     * @param {string} text - The message content.
     * @param {string} sender - 'user' or 'bot'.
     */
    const addMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        // Apply different styles based on who sent the message
        messageElement.classList.add('message-bubble', sender === 'user' ? 'user-message' : 'bot-message');
        // Replace newline characters from the AI with HTML line breaks for proper display
        messageElement.innerHTML = text.replace(/\n/g, '<br>');
        messagesContainer.appendChild(messageElement);
        // Automatically scroll to the bottom to show the new message
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    /**
     * Shows or hides the "typing..." indicator.
     * @param {boolean} show - Whether to show or hide the indicator.
     */
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
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }
    };

    // Handle the form submission when the user sends a message
    chatbotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        if (!userMessage) return;

        addMessage(userMessage, 'user');
        chatbotInput.value = '';
        showTypingIndicator(true);

        // Establish the AI's persona with the system prompt if this is the first message
        if (chatHistory.length === 0) {
            chatHistory.push({ role: "user", parts: [{ text: systemPrompt }] });
            // Add a "pre-canned" model response to acknowledge the prompt
            chatHistory.push({ role: "model", parts: [{ text: "Understood. I am The Flamea Guide. I will provide supportive, factual information on South African family law for fathers and always include the disclaimer." }] });
        }
        // Add the user's actual message to the history
        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        try {
            // The API Key is an empty string here because the platform will inject it automatically.
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
            
            // Send the recent history to the API for context
            const payload = { contents: chatHistory };

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
            
            // Safely get the response text from the API result
            if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0].text) {
                const botResponse = result.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
                // Add the AI's response to the history for future context
                chatHistory.push({ role: "model", parts: [{ text: botResponse }] });
            } else {
                 addMessage("I'm sorry, I couldn't generate a response. There might be a content safety issue or an API error. Please try rephrasing.", 'bot');
            }

        } catch (error) {
            showTypingIndicator(false);
            console.error("Chatbot API Error:", error);
            addMessage("I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again later.", 'bot');
        }
    });
});
