// assets/js/podcast-player.js
document.addEventListener('DOMContentLoaded', () => {
    const podcastToolCard = document.getElementById('podcast-tool-card');
    const podcastModal = document.getElementById('podcast-modal');
    const closePodcastBtn = document.getElementById('close-podcast');
    const episodeList = document.getElementById('episode-list');

    if (!podcastToolCard || !podcastModal || !closePodcastBtn) {
        return; // Exit if elements aren't on this page
    }

    podcastToolCard.addEventListener('click', () => {
        podcastModal.classList.add('flex');
        if (!episodeList.dataset.loaded) {
            loadPodcastEpisodes();
        }
    });

    closePodcastBtn.addEventListener('click', () => {
        podcastModal.classList.remove('flex');
    });

    async function loadPodcastEpisodes() {
        episodeList.innerHTML = '<p class="text-center text-gray-400">Fetching latest episodes...</p>';
        const parser = new RSSParser();
        // A CORS proxy is needed to fetch the RSS feed from the browser.
        const CORS_PROXY = "https://api.allorigins.win/raw?url=";
        const feedUrl = "https://anchor.fm/s/10357aacc/podcast/rss";

        try {
            const feed = await parser.parseURL(CORS_PROXY + encodeURIComponent(feedUrl));
            episodeList.innerHTML = ''; // Clear loading message
            
            feed.items.slice(0, 10).forEach(item => { // Show latest 10 episodes
                const episodeDiv = document.createElement('div');
                episodeDiv.className = 'p-4 bg-gray-700 rounded-lg';
                
                const pubDate = new Date(item.pubDate).toLocaleDateString('en-ZA', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                episodeDiv.innerHTML = `
                    <h4 class="font-bold text-lg text-pink-300">${item.title}</h4>
                    <p class="text-sm text-gray-400 mb-2">${pubDate}</p>
                    <audio controls class="w-full">
                        <source src="${item.enclosure.url}" type="${item.enclosure.type}">
                        Your browser does not support the audio element.
                    </audio>
                `;
                episodeList.appendChild(episodeDiv);
            });

            episodeList.dataset.loaded = 'true'; // Mark as loaded to prevent re-fetching
        } catch (error) {
            episodeList.innerHTML = '<p class="text-center text-red-400">Error loading podcast episodes. Please try again later.</p>';
            console.error('Error fetching RSS feed:', error);
        }
    }
});
