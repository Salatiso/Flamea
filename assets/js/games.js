document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionView = document.getElementById('selection-view');
    const wizardView = document.getElementById('wizard-view');
    const explorerView = document.getElementById('explorer-view');

    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-games-btn');
    const featuredToolCard = document.getElementById('featured-tool-card');
    
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');

    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');
    
    // Exit if the main containers aren't on this page
    if (!selectionView || !wizardView || !explorerView) return;

    // --- Data: Games and Wizard Questions ---
    const gamesDatabase = [
        { id: 'ancestors_quest', title: 'Ancestor\'s Quest', category: 'cultural', age: '14+', href: 'games/ancestors-quest.html' },
        { id: 'constitution_champions', title: 'Constitution Champions', category: 'constitutional', age: '14+', href: 'games/constitution-champions.html' },
        { id: 'constitution_crusaders', title: 'Constitution Crusaders', category: 'constitutional', age: '9-13', href: 'games/constitution-crusaders.html' },
        { id: 'kid_konstitution', title: 'Kid Konstitution', category: 'constitutional', age: '4-8', href: 'games/kid-konstitution.html' },
        { id: 'cultural_connection', title: 'Cultural Connection', category: 'cultural', age: '9-13', href: 'games/cultural-connection.html' },
        { id: 'cultural_dress_up', title: 'Cultural Dress-Up', category: 'cultural', age: '4-8', href: 'games/cultural-dress-up.html' },
        { id: 'justice_builder', title: 'Justice Builder', category: 'legal_concepts', age: '14+', href: 'games/justice-builder.html' },
        { id: 'rights_racer', title: 'Rights Racer', category: 'legal_concepts', age: '9-13', href: 'games/rights-racer.html' },
        { id: 'mythbuster_game', title: 'Myth-Buster', category: 'satirical', age: '14+', href: 'games/mythbuster-game.html' }
    ];

    const gameCategories = {
        cultural: { name: 'Cultural Games', icon: 'fa-landmark' },
        constitutional: { name: 'Constitutional Law', icon: 'fa-scroll' },
        legal_concepts: { name: 'Legal Concepts', icon: 'fa-gavel' },
        satirical: { name: 'Satirical & Critical Thinking', icon: 'fa-lightbulb' }
    };

    // This is a reference to a tool from another section, as per the blueprint
    const constitutionalTrainingTool = {
        id: 'constitutional_training',
        title: 'Constitutional Training Course',
        href: 'training/course-constitution.html',
        isTool: true
    };
    
    const wizardQuestions = {
        start: {
            question: "Who is playing?",
            options: [
                { text: "Ages 4-8", next: "learn_4-8" },
                { text: "Ages 9-13", next: "learn_9-13" },
                { text: "Ages 14+", next: "learn_14+" }
            ]
        },
        'learn_4-8': {
            question: "What do you want to learn about?",
            options: [
                { text: "Cultural Games", results: { age: "4-8", category: "cultural" } },
                { text: "The Constitution", results: { age: "4-8", category: "constitutional" } },
            ]
        },
        'learn_9-13': {
            question: "What do you want to learn about?",
             options: [
                { text: "Cultural Games", results: { age: "9-13", category: "cultural" } },
                { text: "The Constitution", results: { age: "9-13", category: "constitutional" } },
                { text: "Legal Concepts", results: { age: "9-13", category: "legal_concepts" } }
            ]
        },
        'learn_14+': {
            question: "What do you want to learn about?",
             options: [
                { text: "Cultural Games", results: { age: "14+", category: "cultural" } },
                { text: "The Constitution", results: { age: "14+", category: "constitutional" } },
                { text: "Legal Concepts", results: { age: "14+", category: "legal_concepts" } },
                { text: "Satirical Games", results: { age: "14+", category: "satirical" } }
            ]
        }
    };

    // --- State Management ---
    let wizardHistory = [];

    // --- View Toggling ---
    const showView = (viewName) => {
        [selectionView, wizardView, explorerView].forEach(v => v.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');
    };

    // --- Featured Tool Logic ---
    const renderFeaturedTool = () => {
        if (!featuredToolCard) return;

        const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
        let featuredGameData = JSON.parse(localStorage.getItem('featuredGameData')) || {};
        const now = new Date().getTime();
        
        let needsUpdate = !featuredGameData.id || !featuredGameData.timestamp || (now - featuredGameData.timestamp > TWO_DAYS_MS);

        if (needsUpdate) {
            const allGameIds = gamesDatabase.map(g => g.id);
            let nextIndex = 0;
            if(featuredGameData.id) {
                const currentIndex = allGameIds.indexOf(featuredGameData.id);
                nextIndex = (currentIndex + 1) % allGameIds.length;
            }
            const newFeaturedId = allGameIds[nextIndex];
            featuredGameData = { id: newFeaturedId, timestamp: now };
            localStorage.setItem('featuredGameData', JSON.stringify(featuredGameData));
        }

        const featuredGame = gamesDatabase.find(g => g.id === featuredGameData.id);
        
        featuredToolCard.innerHTML = `
            <i class="fas fa-star text-5xl text-amber-400 mb-4"></i>
            <h4 class="text-2xl font-bold text-white">Featured Game</h4>
            <p class="text-gray-400 mb-4 font-semibold">${featuredGame.title}</p>
            <a href="${featuredGame.href}" class="inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">Play Now</a>
        `;
        featuredToolCard.onclick = () => { window.location.href = featuredGame.href; };
    };
    
    // --- Explorer (Manual Selection) Logic ---
    const buildExplorer = () => {
        let explorerHtml = '';
        for (const categoryId in gameCategories) {
            const category = gameCategories[categoryId];
            const gamesInCategory = gamesDatabase.filter(game => game.category === categoryId);

            if (gamesInCategory.length > 0) {
                explorerHtml += `
                <div class="accordion-item bg-gray-800 rounded-lg">
                    <button class="accordion-header w-full text-left p-6 flex justify-between items-center">
                        <h3 class="text-xl font-bold text-white"><i class="fas ${category.icon} mr-4 text-teal-400"></i>${category.name}</h3>
                        <i class="fas fa-chevron-down text-white transition-transform"></i>
                    </button>
                    <div class="accordion-content px-6 pb-6">
                        <ul class="space-y-3 mt-4">
                            ${gamesInCategory.map(game => `
                                <li>
                                    <a href="${game.href}" class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                                        <i class="fas fa-gamepad mr-3 text-gray-400"></i>
                                        <span>${game.title}</span> <span class="ml-auto text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded-full">${game.age}</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>`;
            }
        }
        explorerSection.innerHTML = explorerHtml;

        explorerSection.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
                 const icon = header.querySelector('.fa-chevron-down');
                icon.style.transform = header.parentElement.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        });
    };

    // --- Wizard Logic ---
    const renderWizardStep = (stepId) => {
        const step = wizardQuestions[stepId];
        if (!step) return;

        wizardSection.innerHTML = `
            <div class="text-center mb-6">
                <p class="text-amber-400 font-semibold mb-2">Step ${wizardHistory.length} of 2</p>
                <h2 class="text-3xl font-bold text-white">${step.question}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                ${step.options.map(option => `
                    <button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-next="${option.next || 'results'}" data-results='${JSON.stringify(option.results || {})}'>
                        <span class="font-bold text-lg text-white">${option.text}</span>
                    </button>
                `).join('')}
            </div>
            <div class="mt-8 pt-6 border-t border-gray-700 flex justify-start">
                 <button id="wizard-back-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500">
                    <i class="fas fa-arrow-left mr-2"></i>Back
                </button>
            </div>
        `;
        
        document.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', handleWizardOption));
        const backBtn = document.getElementById('wizard-back-btn');
        backBtn.addEventListener('click', goBack);
        backBtn.disabled = wizardHistory.length <= 1;
    };
    
    const handleWizardOption = (e) => {
        const button = e.currentTarget;
        const nextStepId = button.dataset.next;
        
        wizardHistory.push(nextStepId);

        if (nextStepId === 'results') {
            const results = JSON.parse(button.dataset.results);
            renderWizardResults(results);
        } else {
            renderWizardStep(nextStepId);
        }
    };
    
    const renderWizardResults = (filters) => {
        let recommendedGames = gamesDatabase.filter(game => game.age === filters.age && game.category === filters.category);
        
        // Ensure at least two games are recommended if possible
        if (recommendedGames.length < 2) {
             const fallbackGames = gamesDatabase.filter(game => game.age === filters.age && game.category !== filters.category);
             recommendedGames.push(...fallbackGames.slice(0, 2 - recommendedGames.length));
        }

        // Add the constitutional training tool as a default recommendation
        const recommendations = [...recommendedGames.slice(0, 2), constitutionalTrainingTool];

        wizardSection.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Your Recommendations</h2>
                <p class="text-gray-400 mb-8">Based on your answers, we suggest these activities.</p>
            </div>
            <div class="space-y-4">
                ${recommendations.map(item => {
                    const icon = item.isTool ? 'fa-book-open' : 'fa-gamepad';
                    const label = item.isTool ? 'Training' : 'Game';
                    const color = item.isTool ? 'bg-blue-600' : 'bg-teal-600';
                    return `
                    <a href="${item.href}" class="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                        <div class="flex items-center">
                             <div class="mr-4">
                                <span class="${color} px-3 py-1 rounded-full text-xs font-bold">${label}</span>
                            </div>
                            <h4 class="font-bold text-white flex-grow">${item.title}</h4>
                            <i class="fas ${icon} text-gray-400"></i>
                        </div>
                    </a>
                `}).join('')}
            </div>
             <div class="mt-8 pt-6 border-t border-gray-700 flex justify-start">
                 <button id="wizard-back-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500">
                    <i class="fas fa-arrow-left mr-2"></i>Back
                </button>
            </div>
        `;
        document.getElementById('wizard-back-btn').addEventListener('click', goBack);
    };

    const goBack = () => {
        if (wizardHistory.length > 1) {
            wizardHistory.pop();
            renderWizardStep(wizardHistory[wizardHistory.length - 1]);
        }
    };
    
    const startWizard = () => {
        wizardHistory = ['start'];
        renderWizardStep('start');
        showView('wizard');
    };

    // --- Initial Setup ---
    wizardBtn.addEventListener('click', startWizard);
    explorerBtn.addEventListener('click', () => {
        showView('explorer');
        // Bonus: expand all accordions on manual selection click as per blueprint
        explorerSection.querySelectorAll('.accordion-item').forEach(item => item.classList.add('active'));
    });
    
    backToSelectionWizard.addEventListener('click', () => showView('selection'));
    backToSelectionExplorer.addEventListener('click', () => showView('selection'));

    buildExplorer();
    renderFeaturedTool();
    showView('selection'); // Default view
});
