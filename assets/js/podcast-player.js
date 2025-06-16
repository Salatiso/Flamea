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
    
    if (typeof RSSParser === 'undefined') {
        console.error("RSS Parser not loaded. Make sure to include the script tag.");
        episodeList.innerHTML = '<p class="text-center text-red-400">Error: Required library not found.</p>';
        return;
    }
    
    const parser = new RSSParser();
    // FIX: Corrected the URL strings by removing the Markdown syntax.
    const CORS_PROXY = "https://api.allorigins.win/raw?url=";
    const feedUrl = "https://anchor.fm/s/10357aacc/podcast/rss";

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
