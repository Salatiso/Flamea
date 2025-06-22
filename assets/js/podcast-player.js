// /assets/js/podcast-player.js
// This script fetches an RSS feed, parses it, and builds a functional podcast player and playlist.

document.addEventListener('DOMContentLoaded', () => {
    const rssFeedUrl = 'https://anchor.fm/s/10357aacc/podcast/rss';
    // A CORS proxy is needed to fetch the RSS feed from a different domain in the browser.
    const corsProxyUrl = 'https://api.allorigins.win/raw?url=';

    // DOM Elements
    const loadingState = document.getElementById('loading-state');
    const playerUi = document.getElementById('player-ui');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    
    const artwork = document.getElementById('episode-artwork');
    const title = document.getElementById('episode-title');
    const description = document.getElementById('episode-description');
    const audioPlayer = document.getElementById('audio-player');
    const playlist = document.getElementById('playlist');

    let allEpisodes = [];

    async function fetchAndParseRss() {
        try {
            const response = await fetch(`${corsProxyUrl}${encodeURIComponent(rssFeedUrl)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
            }
            const str = await response.text();
            
            // Use the browser's built-in parser to read the XML
            const data = new window.DOMParser().parseFromString(str, "text/xml");

            // Extract episodes
            const items = data.querySelectorAll("item");
            allEpisodes = Array.from(items).map(item => {
                // Find the artwork for the episode, or fall back to the channel's main artwork
                const itemImage = item.querySelector('itunes\\:image, image');
                const channelImage = data.querySelector('channel > itunes\\:image, channel > image');
                
                return {
                    title: item.querySelector("title").textContent,
                    description: item.querySelector("description").textContent.replace(/<[^>]*>/g, ""), // Strip HTML tags
                    url: item.querySelector("enclosure").getAttribute("url"),
                    artworkUrl: itemImage ? itemImage.getAttribute('href') : channelImage.getAttribute('href')
                };
            });
            
            if (allEpisodes.length > 0) {
                buildPlaylist();
                loadEpisode(0); // Load the first episode by default
                showPlayer();
            } else {
                throw new Error("No episodes found in the RSS feed.");
            }

        } catch (error) {
            console.error("Error fetching or parsing RSS feed:", error);
            showError(error.message);
        }
    }

    function buildPlaylist() {
        playlist.innerHTML = ''; // Clear previous playlist items
        allEpisodes.forEach((episode, index) => {
            const li = document.createElement('li');
            li.className = 'p-3 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center justify-between transition-colors';
            li.innerHTML = `
                <span>${episode.title}</span>
                <i class="fas fa-play text-blue-500"></i>
            `;
            li.addEventListener('click', () => loadEpisode(index));
            playlist.appendChild(li);
        });
    }

    function loadEpisode(index) {
        if (!allEpisodes[index]) return;

        const episode = allEpisodes[index];
        artwork.src = episode.artworkUrl || 'https://placehold.co/600x600/1e293b/ffffff?text=Flamea';
        title.textContent = episode.title;
        description.textContent = episode.description.substring(0, 200) + '...'; // Truncate description
        audioPlayer.src = episode.url;

        // Highlight the current track in the playlist
        Array.from(playlist.children).forEach((item, itemIndex) => {
            item.classList.toggle('bg-blue-100', itemIndex === index);
        });
    }

    function showPlayer() {
        loadingState.classList.add('hidden');
        errorState.classList.add('hidden');
        playerUi.classList.remove('hidden');
    }

    function showError(message) {
        loadingState.classList.add('hidden');
        playerUi.classList.add('hidden');
        errorMessage.textContent = `Could not load podcast: ${message}. This may be due to a network issue or a problem with the RSS feed.`;
        errorState.classList.remove('hidden');
    }

    // --- Start the process ---
    fetchAndParseRss();
});

