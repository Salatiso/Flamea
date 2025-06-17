/**
 * Flamea.org - Global Modal Loader
 * This script is responsible for dynamically loading the HTML and functionality 
 * for modals that are accessible sitewide (e.g., from the sidebar).
 */

document.addEventListener('DOMContentLoaded', () => {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        console.warn('Modal container not found. Global modals will not be loaded.');
        return;
    }

    // List of global modals to load
    const modalsToLoad = [
        { id: 'chatbot-modal', htmlPath: 'chatbot.html', scriptPath: 'assets/js/chatbot.js' },
        { id: 'podcast-modal', htmlPath: 'podcast-player.html', scriptPath: 'assets/js/podcast-player.js' }
    ];

    modalsToLoad.forEach(modalInfo => {
        loadModal(modalInfo);
    });

    /**
     * Fetches the HTML for a modal, injects it into the container, and loads its associated script.
     * @param {object} modalInfo - Contains the id, htmlPath, and scriptPath for the modal.
     */
    async function loadModal({ id, htmlPath, scriptPath }) {
        try {
            // Fetch the HTML content of the modal
            const response = await fetch(htmlPath);
            if (!response.ok) throw new Error(`Failed to fetch ${htmlPath}`);
            const modalHTML = await response.text();

            // Create a temporary div to parse the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modalHTML;
            
            // Find the specific modal element within the fetched HTML
            const modalElement = tempDiv.querySelector(`#${id}`);
            
            if (modalElement) {
                // Add the modal to the main page's container
                modalContainer.appendChild(modalElement);

                // Dynamically create and append the script tag for the modal's functionality
                const script = document.createElement('script');
                script.type = 'module';
                script.src = scriptPath;
                document.body.appendChild(script);

            } else {
                console.error(`Could not find element with id '${id}' in ${htmlPath}`);
            }

        } catch (error) {
            console.error(`Error loading modal ${id}:`, error);
        }
    }
});
