// In assets/js/chatbot.js

function initializeChatbot() {
    const chatbotModal = document.getElementById('chatbot-modal');
    if (!chatbotModal || chatbotModal.dataset.initialized === 'true') {
        return; // Do nothing if it's not on the page or already set up
    }

    const chatbotForm = document.getElementById('chatbot-form');
    if (!chatbotForm) return; // Exit if the form isn't found

    // The rest of your chatbot logic from the previous turn goes here...
    // (the part with addMessage, showTypingIndicator, the form submission, etc.)

    // Mark as initialized
    chatbotModal.dataset.initialized = 'true';
}

// Listen for clicks on the whole page
document.addEventListener('click', (event) => {
    // Find the button that was clicked, if it's a modal opener
    const targetButton = event.target.closest('[data-modal-target]');
    if (targetButton) {
        // If the specific button for the chatbot was clicked, initialize it now
        if (targetButton.getAttribute('data-modal-target') === 'chatbot-modal') {
            initializeChatbot();
        }
    }
});