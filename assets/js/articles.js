import { articlesDB, articleCategories } from './articles-db.js';

document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.getElementById('articles-container');
    const categoryCarousel = document.getElementById('category-carousel');

    if (!articlesContainer || !categoryCarousel) return;

    let currentFilter = 'All';

    // --- RENDER FUNCTIONS ---

    function renderCategories() {
        categoryCarousel.innerHTML = '';
        articleCategories.forEach(category => {
            const isActive = category.name === currentFilter;
            const categoryChip = document.createElement('button');
            categoryChip.className = `category-chip ${isActive ? 'active' : ''}`;
            categoryChip.dataset.category = category.name;
            categoryChip.innerHTML = `<i class="${category.icon} mr-2"></i> ${category.name}`;
            categoryCarousel.appendChild(categoryChip);
        });
    }

    function renderArticles() {
        articlesContainer.innerHTML = '';
        const filteredArticles = articlesDB.filter(article => 
            currentFilter === 'All' || article.category === currentFilter
        );

        if (filteredArticles.length === 0) {
            articlesContainer.innerHTML = `<p class="text-center text-gray-400 py-10">No articles in this category yet.</p>`;
            return;
        }

        filteredArticles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8';
            articleCard.innerHTML = `
                <img src="${article.imageUrl}" alt="${article.title}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <p class="text-sm text-purple-400 mb-2">${article.category}</p>
                    <h2 class="text-2xl font-bold font-roboto-slab text-white mb-3">${article.title}</h2>
                    <p class="text-xs text-gray-500 mb-4">By ${article.author} on ${new Date(article.date).toLocaleDateString()}</p>
                    <p class="text-gray-300 mb-6">${article.summary}</p>
                    <div class="text-right">
                         <a href="#" class="text-green-400 font-bold hover:underline read-more-btn" data-slug="${article.slug}">Read More &raquo;</a>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(articleCard);
        });
    }

    function renderSingleArticle(slug) {
        const article = articlesDB.find(a => a.slug === slug);
        if (!article) {
            articlesContainer.innerHTML = `<p class="text-center text-red-500 py-10">Article not found.</p>`;
            return;
        }

        articlesContainer.innerHTML = `
            <div class="bg-gray-800 p-6 md:p-10 rounded-lg">
                <button id="back-to-articles" class="text-green-400 font-bold hover:underline mb-8">&laquo; Back to All Articles</button>
                <h1 class="text-4xl font-bold font-roboto-slab text-white mb-4">${article.title}</h1>
                <p class="text-sm text-gray-500 mb-6">By ${article.author} on ${new Date(article.date).toLocaleDateString()}</p>
                <img src="${article.imageUrl}" alt="${article.title}" class="w-full h-64 object-cover rounded-lg mb-8">
                <div class="prose-styles text-gray-300">
                    ${article.content}
                </div>
            </div>
        `;

        document.getElementById('back-to-articles').addEventListener('click', () => {
            renderArticles();
        });
    }

    // --- EVENT LISTENERS ---

    categoryCarousel.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (chip) {
            currentFilter = chip.dataset.category;
            renderCategories();
            renderArticles();
        }
    });

    articlesContainer.addEventListener('click', (e) => {
        const readMoreBtn = e.target.closest('.read-more-btn');
        if (readMoreBtn) {
            e.preventDefault();
            const slug = readMoreBtn.dataset.slug;
            renderSingleArticle(slug);
        }
    });


    // --- INITIAL RENDER ---
    renderCategories();
    renderArticles();

});
