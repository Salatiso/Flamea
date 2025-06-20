document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionView = document.getElementById('selection-view');
    const wizardView = document.getElementById('wizard-view');
    const explorerView = document.getElementById('explorer-view');

    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-games-btn');
    const featuredGameCard = document.getElementById('featured-game-card');
    
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');

    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');
    
    if (!selectionView || !wizardView || !explorerView) {
        console.error("A required view container is missing from the DOM.");
        return;
    };

    // --- Data: Full Games Database & Wizard Questions ---
    const gamesDatabase = [
        { id: 'kid_konstitution', title: 'Kid Konstitution', category: 'constitutional', age: '4-8', href: 'games/kid-konstitution.html', icon: 'fa-child' },
        { id: 'cultural_dress_up', title: 'Cultural Dress-Up Adventure', category: 'cultural', age: '4-8', href: 'games/cultural-dress-up.html', icon: 'fa-tshirt' },
        { id: 'rights_racer', title: 'Rights Racer', category: 'constitutional', age: '9-13', href: 'games/rights-racer.html', icon: 'fa-flag-checkered' },
        { id: 'constitution_crusaders', title: 'Constitution Crusaders', category: 'constitutional', age: '9-13', href: 'games/constitution-crusaders.html', icon: 'fa-map-marked-alt' },
        { id: 'ancestors_quest', title: 'Ancestor\'s Quest', category: 'cultural', age: '14+', href: 'games/ancestors-quest.html', icon: 'fa-map-signs' },
        { id: 'justice_builder', title: 'Justice Builder', category: 'legal_concepts', age: '14+', href: 'games/justice-builder.html', icon: 'fa-gavel' },
        { id: 'mythbuster_game', title: 'Myth-Buster', category: 'satirical', age: '14+', href: 'games/mythbuster-game.html', icon: 'fa-ghost' },
    ];

    const gameCategories = {
        constitutional: { name: 'Constitutional Law', icon: 'fa-scroll' },
        legal_concepts: { name: 'Legal Concepts', icon: 'fa-gavel' },
        cultural: { name: 'Cultural Games', icon: 'fa-landmark' },
        satirical: { name: 'Satirical & Critical Thinking', icon: 'fa-lightbulb' }
    };
    
    const wizardQuestions = {
      'start': {
        question: 'Who is playing?',
        options: [
          { text: 'Young Child (4-8)', next: 'age_young' },
          { text: 'Older Child (9-13)', next: 'age_older' },
          { text: 'Teen / Adult (14+)', next: 'age_teen' }
        ]
      },
      'age_young': {
        question: 'What do you want to learn about?',
        options: [
          { text: 'My Rights & The Law', results: { age: '4-8', category: 'constitutional' } },
          { text: 'Different Cultures', results: { age: '4-8', category: 'cultural' } }
        ]
      },
      'age_older': {
        question: 'What kind of challenge are you looking for?',
        options: [
          { text: 'A quiz about the constitution.', results: { age: '9-13', category: 'constitutional' } },
          { text: 'Exploring legal ideas.', results: { age: '9-13', category: 'legal_concepts' } },
          { text: 'Learning about traditions.', results: { age: '9-13', category: 'cultural' } }
        ]
      },
      'age_teen': {
        question: 'What sounds most interesting?',
        options: [
          { text: 'Advanced legal challenges.', results: { age: '14+', category: 'legal_concepts' } },
          { text: 'Exploring cultural traditions.', results: { age: '14+', category: 'cultural' } },
          { text: 'Thinking critically & having a laugh.', results: { age: '14+', category: 'satirical' } }
        ]
      }
    };
    
    let wizardHistory = [];

    const showView = (viewId) => {
        [selectionView, wizardView, explorerView].forEach(view => {
            if (view) view.classList.toggle('active', view.id === viewId);
        });
    };

    const renderFeaturedGame = () => {
        if (!featuredGameCard) return;
        const featuredGame = gamesDatabase[Math.floor(Math.random() * gamesDatabase.length)]; // Random featured game
        
        featuredGameCard.innerHTML = `
            <i class="fas fa-star text-4xl text-amber-400 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Featured Game</h3>
            <p class="text-gray-400 flex-grow mb-4">${featuredGame.title}</p>
            <a href="${featuredGame.href}" class="bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-500 transition-colors w-full">Play Now</a>
        `;
        featuredGameCard.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = featuredGame.href;
        });
    };
    
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
                        <i class="fas fa-chevron-down text-white accordion-icon"></i>
                    </button>
                    <div class="accordion-content px-6 pb-6">
                        <ul class="space-y-3 mt-4">
                            ${gamesInCategory.map(game => `
                                <li>
                                    <a href="${game.href}" class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                                        <i class="fas ${game.icon || 'fa-gamepad'} mr-3 text-gray-400"></i>
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
            });
        });
    };

    const renderWizardStep = (stepId) => {
        const step = wizardQuestions[stepId];
        if (!step) return;

        wizardHistory.push(stepId);

        wizardSection.innerHTML = `
            <div class="wizard-step active text-center">
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
                 <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors">Back</button>
            </div>
        `;
        
        wizardSection.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', handleWizardOption));
        const backBtn = wizardSection.querySelector('#wizard-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', goBack);
            backBtn.disabled = wizardHistory.length <= 1;
        }
    };
    
    const handleWizardOption = (e) => {
        const button = e.currentTarget;
        const nextStepId = button.dataset.next;
        if (nextStepId === 'results') {
            const results = JSON.parse(button.dataset.results);
            renderWizardResults(results);
        } else {
            renderWizardStep(nextStepId);
        }
    };
    
    const renderWizardResults = (filters) => {
        wizardHistory.push('results');
        const recommendedGames = gamesDatabase.filter(game => game.age === filters.age && game.category === filters.category);
        
        wizardSection.innerHTML = `
            <div class="wizard-step active text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Your Recommendations</h2>
                <p class="text-gray-400 mb-8">Based on your answers, we suggest these games.</p>
            </div>
            <div class="space-y-4">
                ${recommendedGames.length > 0 ? recommendedGames.map(item => `
                    <a href="${item.href}" class="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                        <div class="flex items-center">
                             <div class="mr-4">
                                <span class="bg-teal-600 px-3 py-1 rounded-full text-xs font-bold">Game</span>
                            </div>
                            <h4 class="font-bold text-white flex-grow">${item.title}</h4>
                            <i class="fas ${item.icon || 'fa-gamepad'} text-gray-400"></i>
                        </div>
                    </a>
                `).join('') : '<p class="text-center text-gray-400">No specific games match. Try exploring manually!</p>'}
            </div>
             <div class="mt-8 pt-6 border-t border-gray-700 flex justify-start">
                 <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500">Back</button>
            </div>
        `;
        document.getElementById('wizard-back-btn').addEventListener('click', goBack);
    };

    const goBack = () => {
        wizardHistory.pop(); // Remove current step
        if (wizardHistory.length > 0) {
            const previousStepId = wizardHistory.pop();
            renderWizardStep(previousStepId);
        } else {
            showView('selection-view');
        }
    };
    
    // --- Initial Setup and Event Listeners ---
    if (wizardBtn) {
        wizardBtn.addEventListener('click', () => {
            wizardHistory = [];
            renderWizardStep('start');
            showView('wizard-view');
        });
    }

    if (explorerBtn) {
        explorerBtn.addEventListener('click', () => {
            buildExplorer();
            showView('explorer-view');
        });
    }
    
    if (backToSelectionWizard) backToSelectionWizard.addEventListener('click', () => showView('selection-view'));
    if (backToSelectionExplorer) backToSelectionExplorer.addEventListener('click', () => showView('selection-view'));

    buildExplorer();
    renderFeaturedGame();
});
