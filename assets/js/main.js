// assets/js/main.js

/**
 * Flamea.org - Unified Main Script
 * This file contains the core sitewide JavaScript functionality.
 * - Handles modal popups for the chatbot and podcast player.
 * - Manages accordion (collapsible section) behavior.
 * - Dynamically renders the games on the games.html page.
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
                // Toggle the 'open' class for styling and max-height
                const isOpen = content.classList.toggle('open');
                
                // Animate max-height for smooth transition
                if (isOpen) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    content.style.maxHeight = null;
                }

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
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- 4. DYNAMIC GAME LISTING ---
    // Data for all the games available in the arcade.
    const gameData = [
        { title: "Kid Konstitution", description: "A fun quiz to learn the basics of our country's rules!", url: "games/kid-konstitution.html", icon: "fas fa-child text-yellow-400", category: "kids" },
        { title: "Rights Racer", description: "Race against time to collect important rights!", url: "games/rights-racer.html", icon: "fas fa-running text-green-400", category: "kids" },
        { title: "Constitution Defender", description: "Protect the constitution from being changed!", url: "games/constitution-defender.html", icon: "fas fa-shield-alt text-blue-400", category: "kids" },
        { title: "Constitution Quest", description: "An adventure game exploring the Bill of Rights.", url: "games/constitution-quest.html", icon: "fas fa-map-signs text-purple-400", category: "patriots" },
        { title: "Law & Layers Quest", description: "Uncover the different layers of South African law.", url: "games/law-layers-quest.html", icon: "fas fa-layer-group text-indigo-400", category: "patriots" },
        { title: "Mythbuster", description: "Bust common myths about our legal system.", url: "games/mythbuster-game.html", icon: "fas fa-ghost text-teal-400", category: "patriots" },
        { title: "Constitution Champions", description: "Become a champion of constitutional knowledge.", url: "games/constitution-champions.html", icon: "fas fa-trophy text-yellow-500", category: "patriots" },
        { title: "Constitution Crusaders", description: "A crusade to protect and uphold the constitution.", url: "games/constitution-crusaders.html", icon: "fas fa-khanda text-gray-400", category: "patriots" },
        { title: "Goliath's Reckoning", description: "A story-driven game about fighting for justice.", url: "games/goliaths-reckoning.html", icon: "fas fa-balance-scale text-red-500", category: "leaders" },
        { title: "Justice Builder", description: "A simulator where you build a case from scratch.", url: "games/justice-builder.html", icon: "fas fa-gavel text-orange-500", category: "leaders" },
        { title: "The System", description: "A satirical look at the justice system. (Mature)", url: "games/satirical-game.html", icon: "fas fa-theater-masks text-pink-500", category: "leaders" },
        { title: "Legal Simulator", description: "Experience legal scenarios in a simulated world.", url: "games/legal-simulator.html", icon: "fas fa-laptop-code text-cyan-400", category: "leaders" }
    ];

    /**
     * Renders game cards into the appropriate categories on the games.html page.
     */
    function renderGames() {
        const gamesContainer = document.querySelector('.main-content .grid');
        // Only run this function if we are on a page with the games container (i.e., games.html)
        if (!gamesContainer) return;
        
        gamesContainer.innerHTML = ''; // Clear any placeholder content

        // Create a map to hold games by category
        const categories = {
            kids: { title: "For the Little Ones (Ages 4-8)", games: [], el: null },
            patriots: { title: "Young Patriots (Ages 9-13)", games: [], el: null },
            leaders: { title: "Future Leaders (Ages 14+)", games: [], el: null },
        };

        // Group games by category
        gameData.forEach(game => {
            if (categories[game.category]) {
                categories[game.category].games.push(game);
            }
        });

        // Loop through the categories and render them
        for (const key in categories) {
            const category = categories[key];
            if (category.games.length > 0) {
                // Create the main container for the category
                const categoryWrapper = document.createElement('div');
                categoryWrapper.className = "mb-12";
                
                // Add the category title
                const titleEl = document.createElement('h2');
                titleEl.className = "text-3xl font-bold mb-6 category-title";
                titleEl.textContent = category.title;
                categoryWrapper.appendChild(titleEl);

                // Create the grid for the game cards
                const gridEl = document.createElement('div');
                gridEl.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";

                // Create and add each game card to the grid
                category.games.forEach(game => {
                    const card = document.createElement('div');
                    card.className = "game-card rounded-lg overflow-hidden shadow-lg relative";
                    card.innerHTML = `
                        <a href="${game.url}" class="game-card-link absolute inset-0"></a>
                        <div class="p-6">
                            <i class="${game.icon} text-3xl mb-4"></i>
                            <h3 class="font-bold text-xl mb-2">${game.title}</h3>
                            <p class="text-gray-400 text-base">${game.description}</p>
                        </div>
                    `;
                    gridEl.appendChild(card);
                });
                
                categoryWrapper.appendChild(gridEl);
                gamesContainer.appendChild(categoryWrapper);
            }
        }
    }
    
    // Call the function to render the games on page load.
    renderGames();
});
