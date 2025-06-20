document.addEventListener('DOMContentLoaded', () => {
    const playerContainer = document.getElementById('podcast-player-container');
    if (!playerContainer) return;

    const audioPlayer = document.getElementById('audio-player');
    const episodeTitleEl = document.getElementById('episode-title');
    const episodeDescriptionEl = document.getElementById('episode-description');
    const episodesListEl = document.getElementById('episodes-list');
    const playerCoverArt = document.getElementById('player-cover-art');
    const loadingEl = document.getElementById('player-loading');
    const errorEl = document.getElementById('player-error');

    // FIX: Use a CORS proxy to bypass browser security restrictions on fetching the RSS feed.
    const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
    const RSS_URL = 'https://anchor.fm/s/10357aacc/podcast/rss';
    const PROXY_URL = CORS_PROXY + RSS_URL;

    async function fetchPodcastFeed() {
        try {
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';

            const response = await fetch(PROXY_URL);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const str = await response.text();
            const data = new window.DOMParser().parseFromString(str, "text/xml");
            
            const channelTitle = data.querySelector("channel > title")?.textContent || 'Podcast';
            const channelImage = data.querySelector("channel > image > url")?.textContent;
            
            // Set the main cover art from the channel image
            if (channelImage) playerCoverArt.src = channelImage;

            episodesListEl.innerHTML = ''; // Clear previous list
            const items = data.querySelectorAll("item");

            items.forEach((item, index) => {
                const title = item.querySelector("title")?.textContent || 'Untitled Episode';
                const audioUrl = item.querySelector("enclosure")?.getAttribute("url");
                const description = item.querySelector("description")?.textContent || 'No description available.';
                // Use a smaller image from the item if available, otherwise fallback to channel image
                const itemImage = item.getElementsByTagNameNS('*', 'image')[0]?.getAttribute('href') || channelImage;

                const episodeEl = document.createElement('button');
                episodeEl.className = 'episode-item flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-700 transition-colors';
                episodeEl.innerHTML = `
                    <img src="${itemImage || 'https://placehold.co/60x60/374151/FFFFFF?text=?'}" alt="${title}" class="w-12 h-12 rounded-md mr-4 object-cover flex-shrink-0">
                    <div class="flex-grow">
                        <h4 class="font-bold text-white">${title}</h4>
                    </div>
                `;
                episodeEl.addEventListener('click', () => {
                    playEpisode({ title, description, audioUrl, image: itemImage });
                });
                episodesListEl.appendChild(episodeEl);

                // Autoplay the first episode
                if (index === 0) {
                    playEpisode({ title, description, audioUrl, image: itemImage });
                }
            });

        } catch (error) {
            console.error("Failed to fetch or parse RSS feed:", error);
            errorEl.textContent = "Sorry, could not load podcast feed. Please try again later.";
            errorEl.style.display = 'block';
        } finally {
            loadingEl.style.display = 'none';
        }
    }

    function playEpisode({ title, description, audioUrl, image }) {
        episodeTitleEl.textContent = title;
        // Clean up description HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        episodeDescriptionEl.textContent = tempDiv.textContent || 'No description available.';
        
        if(image) playerCoverArt.src = image;
        audioPlayer.src = audioUrl;
        audioPlayer.play();
    }

    fetchPodcastFeed();
});
