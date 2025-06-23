document.addEventListener('DOMContentLoaded', () => {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const body = document.querySelector('body');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalFile = trigger.getAttribute('data-modal-target');
            
            // Check if modal is already loaded
            if (document.getElementById('chatbot-modal-container')) {
                document.getElementById('chatbot-modal-container').remove();
            }

            fetch(modalFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(html => {
                    const modalContainer = document.createElement('div');
                    modalContainer.id = 'chatbot-modal-container';
                    modalContainer.innerHTML = html;
                    body.appendChild(modalContainer);

                    // Add event listener to the new close button
                    const closeBtn = modalContainer.querySelector('#close-chatbot-btn');
                    if (closeBtn) {
                        closeBtn.addEventListener('click', () => {
                            modalContainer.remove();
                        });
                    }
                })
                .catch(error => {
                    console.error('Error loading modal:', error);
                    alert('Could not load the chatbot. Please try again later.');
                });
        });
    });
});
