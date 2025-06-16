// assets/js/main.js

/**
 * Flamea.org - Unified Main Script
 * This file contains the core sitewide JavaScript functionality.
 * It uses event delegation to handle events on dynamically loaded content.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Centralized Event Listener for the whole page ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // --- 1. Modal Control ---
        const modalButton = target.closest('[data-modal-target]');
        if (modalButton) {
            event.preventDefault();
            const modalId = modalButton.dataset.modalTarget;
            openModal(modalId);
        }

        const modalCloseButton = target.closest('[data-modal-close]');
        if (modalCloseButton) {
            event.preventDefault();
            closeModal(modalCloseButton.closest('.modal'));
        }
        
        // --- 2. Accordion Control ---
        const accordionButton = target.closest('.accordion-toggle');
        if (accordionButton) {
            const content = accordionButton.nextElementSibling;
            const icon = accordionButton.querySelector('i.fa-chevron-down');
            
            if (content && content.classList.contains('accordion-content')) {
                // Toggle the 'open' class
                const isOpen = content.classList.toggle('open');
                
                // Toggle icon rotation
                if (icon) {
                    icon.classList.toggle('rotate-180', isOpen);
                }
            }
        }
    });
    
    // Close modal if clicking on the background overlay
    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    /**
     * Opens a modal and loads its content if needed.
     * @param {string} modalId - The ID of the modal to open.
     */
    async function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Load content dynamically if it hasn't been loaded yet
        if (!modal.dataset.loaded) {
            let contentUrl = '';
            if (modalId === 'chatbot-modal') {
                contentUrl = 'chatbot.html';
            } else if (modalId === 'podcast-modal') {
                // For the podcast, we just need the structure, the JS will fill it
                const podcastHtml = `
                    <div class="custom-modal-content bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                        <div class="flex justify-between items-center p-4 border-b border-gray-700">
                            <h3 class="text-2xl font-bold text-yellow-300"><i class="fas fa-podcast mr-3"></i>Flamea Podcast</h3>
                            <button data-modal-close class="text-gray-400 hover:text-white text-2xl">&times;</button>
                        </div>
                        <div id="episode-list" class="p-6 space-y-4 overflow-y-auto">
                            <!-- Episodes will be loaded here by podcast-player.js -->
                        </div>
                    </div>`;
                modal.innerHTML = podcastHtml;
                // Now trigger the podcast loader
                if (typeof window.loadPodcastEpisodes === 'function') {
                    window.loadPodcastEpisodes();
                }
                 modal.dataset.loaded = 'true';
            }
            
            if(contentUrl) {
                try {
                    const response = await fetch(contentUrl);
                    const text = await response.text();
                    modal.innerHTML = text;
                    
                    // If chatbot was loaded, its own script will handle it.
                    if (modalId === 'chatbot-modal') {
                       const chatScript = document.createElement('script');
                       chatScript.type = 'module';
                       chatScript.src = 'assets/js/chatbot.js';
                       modal.appendChild(chatScript);
                    }

                    modal.dataset.loaded = 'true';
                } catch (error) {
                    modal.innerHTML = `<div class="bg-red-800 text-white p-4 rounded-lg">Error loading content.</div>`;
                    console.error("Error loading modal content:", error);
                }
            }
        }
        modal.classList.add('active');
    }

    /**
     * Closes a specific modal.
     * @param {HTMLElement} modal - The modal element to close.
     */
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            const audioPlayer = modal.querySelector('audio');
            if (audioPlayer) audioPlayer.pause();
        }
    }
    
    // --- 3. DYNAMIC FOOTER YEAR ---
    // This can be removed if the copyright is only in the sidebar.
    // Kept for pages that might have a separate footer.
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
});
```javascript
// assets/js/podcast-player.js

/**
 * This script is now designed to be loaded on all pages.
 * It exposes a global function that the main.js modal system can call.
 */

// Make the function available globally
window.loadPodcastEpisodes = async function() {
    const episodeList = document.getElementById('episode-list');
    if (!episodeList) return;

    episodeList.innerHTML = '<p class="text-center text-gray-400"><i class="fas fa-spinner fa-spin mr-2"></i>Fetching latest episodes...</p>';
    
    // Ensure RSS Parser script is loaded, if not already
    if (typeof RSSParser === 'undefined') {
        console.error("RSS Parser not loaded. Make sure to include the script tag.");
        episodeList.innerHTML = '<p class="text-center text-red-400">Error: Required library not found.</p>';
        return;
    }
    
    const parser = new RSSParser();
    const CORS_PROXY = "[https://api.allorigins.win/raw?url=](https://api.allorigins.win/raw?url=)";
    const feedUrl = "[https://anchor.fm/s/10357aacc/podcast/rss](https://anchor.fm/s/10357aacc/podcast/rss)";

    try {
        const feed = await parser.parseURL(CORS_PROXY + encodeURIComponent(feedUrl));
        episodeList.innerHTML = ''; // Clear loading message
        
        if (feed.items.length === 0) {
            episodeList.innerHTML = '<p class="text-center text-gray-400">No podcast episodes found.</p>';
            return;
        }

        feed.items.slice(0, 10).forEach(item => { // Show latest 10 episodes
            const episodeDiv = document.createElement('div');
            episodeDiv.className = 'p-4 bg-gray-700 rounded-lg';
            
            const pubDate = new Date(item.pubDate).toLocaleDateString('en-ZA', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            episodeDiv.innerHTML = `
                <h4 class="font-bold text-lg text-yellow-300">${item.title}</h4>
                <p class="text-sm text-gray-400 mb-2">${pubDate}</p>
                <audio controls class="w-full">
                    <source src="${item.enclosure.url}" type="${item.enclosure.type}">
                    Your browser does not support the audio element.
                </audio>
            `;
            episodeList.appendChild(episodeDiv);
        });

    } catch (error) {
        episodeList.innerHTML = '<p class="text-center text-red-400">Error loading podcast episodes. Please try again later.</p>';
        console.error('Error fetching RSS feed:', error);
    }
}
