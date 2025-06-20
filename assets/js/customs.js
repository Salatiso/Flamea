document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionView = document.getElementById('selection-view');
    const wizardView = document.getElementById('wizard-view');
    const explorerView = document.getElementById('explorer-view');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-customs-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const featuredCustomCard = document.getElementById('featured-custom-card');

    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');

    if (!selectionView || !wizardView || !explorerView || !wizardBtn || !explorerBtn) {
        console.error("Essential view or button elements are missing from the DOM.");
        return;
    }

    // --- Data Definitions ---
    const customsDatabase = [
        { id: 'imbeleko', name: 'Imbeleko', stage: 'birth', cultures: ['xhosa', 'zulu'], description: 'A crucial ritual to introduce a newborn to their ancestors and the community.' },
        { id: 'ulwaluko', name: 'Ulwaluko', stage: 'coming-of-age', cultures: ['xhosa', 'ndebele', 'sotho'], description: 'A formal initiation and circumcision ritual that marks the transition from boyhood to manhood.' },
        { id: 'lobola', name: 'Lobola', stage: 'marriage', cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele'], description: "The practice of bride wealth, where the groom's family presents gifts to the bride's family." },
        { id: 'umngcwabo', name: 'Umngcwabo', stage: 'death', cultures: ['xhosa', 'zulu', 'ndebele'], description: 'A traditional funeral ceremony to honour the deceased and ensure their spirit transitions to the ancestral realm.' },
    ];
    
    const cultures = {
        xhosa: 'Xhosa', zulu: 'Zulu', sotho: 'Sotho', ndebele: 'Ndebele', swazi: 'Swazi'
    };

    const wizardSteps = {
        'start': {
            question: 'How would you like to explore?',
            options: [
                { text: 'Learn about a specific culture.', next: '2A' },
                { text: 'Compare a custom across cultures.', next: '2B' }
            ]
        },
        '2A': {
            question: 'Which culture are you interested in?',
            type: 'cultures',
            next: 'resultsA'
        },
        '2B': {
            question: 'Which custom would you like to compare?',
            type: 'customs',
            next: 'resultsB'
        }
    };
    
    let wizardHistory = [];

    // --- Core Functions ---
    const showView = (viewId) => {
        [selectionView, wizardView, explorerView].forEach(view => {
            if (view) view.classList.toggle('active', view.id === viewId);
        });
    };

    const renderFeaturedCustom = () => {
        if (!featuredCustomCard) return;
        const featuredCustom = customsDatabase[0]; // Example: always feature the first one
        featuredCustomCard.innerHTML = `
            <i class="fas fa-star text-4xl text-yellow-400 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Featured Custom</h3>
            <p class="text-gray-400 flex-grow mb-4">Learn about the significance of '${featuredCustom.name}' in our cultures.</p>
            <button class="bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors w-full">Learn More</button>
        `;
        featuredCustomCard.addEventListener('click', () => {
            showView('explorer-view');
            explorerSection.innerHTML = ''; // Clear previous content
            buildExplorer([featuredCustom.id]); // Build explorer with only the featured custom
        });
    };
    
    const buildExplorer = (filterIds = null) => {
        const customsToDisplay = filterIds 
            ? customsDatabase.filter(c => filterIds.includes(c.id)) 
            : customsDatabase;
            
        explorerSection.innerHTML = ''; // Clear previous content
        if (customsToDisplay.length === 0) {
            explorerSection.innerHTML = '<p class="text-gray-400">No customs found.</p>';
            return;
        }

        const accordionHtml = customsToDisplay.map(custom => `
            <div class="accordion-item bg-gray-800 rounded-lg">
                <button class="accordion-header w-full text-left p-6 flex justify-between items-center">
                    <h3 class="text-xl font-bold text-white"><i class="fas fa-landmark mr-4 text-purple-400"></i>${custom.name}</h3>
                    <i class="fas fa-chevron-down text-white accordion-icon"></i>
                </button>
                <div class="accordion-content px-6 pb-6">
                    <div class="pt-4 text-gray-300">
                        <p><strong>Cultures:</strong> ${custom.cultures.join(', ')}</p>
                        <p><strong>Life Stage:</strong> ${custom.stage}</p>
                        <p class="mt-2">${custom.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
        explorerSection.insertAdjacentHTML('beforeend', accordionHtml);
        
        explorerSection.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    };
    
    const renderWizardStep = (stepId) => {
        const step = wizardSteps[stepId];
        if (!step) return;

        wizardHistory.push(stepId);

        let optionsHtml = '';
        if (step.type === 'cultures') {
            optionsHtml = Object.entries(cultures).map(([id, name]) => 
                `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-filter-type="culture" data-filter-value="${id}" data-next="${step.next}">
                    <span class="font-bold text-lg text-white">${name}</span>
                </button>`
            ).join('');
        } else if (step.type === 'customs') {
             optionsHtml = customsDatabase.map(custom =>
                `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-filter-type="custom" data-filter-value="${custom.id}" data-next="${step.next}">
                    <span class="font-bold text-lg text-white">${custom.name}</span>
                </button>`
            ).join('');
        } else {
            optionsHtml = step.options.map(option =>
                `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-next="${option.next}">
                     <h4 class="font-bold">${option.text}</h4>
                </button>`
            ).join('');
        }

        wizardSection.innerHTML = `
            <div id="${stepId}" class="wizard-step active">
                <h3 class="text-2xl font-bold text-white mb-6 text-center">${step.question}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${optionsHtml}</div>
                <div class="mt-8 pt-4 border-t border-gray-700">
                    <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors">Back</button>
                </div>
            </div>`;

        document.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', handleWizardOption));
        const backBtn = document.getElementById('wizard-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', goBack);
            backBtn.disabled = wizardHistory.length <= 1;
        }
    };

    const handleWizardOption = (e) => {
        const button = e.currentTarget;
        const nextStepId = button.dataset.next;
        const filterType = button.dataset.filterType;
        const filterValue = button.dataset.filterValue;

        if (nextStepId.startsWith('results')) {
            let results;
            if (filterType === 'culture') {
                results = customsDatabase.filter(c => c.cultures.includes(filterValue));
            } else if (filterType === 'custom') {
                results = customsDatabase.filter(c => c.id === filterValue);
            }
            renderWizardResults(results);
        } else {
            renderWizardStep(nextStepId);
        }
    };

    const renderWizardResults = (results) => {
        wizardHistory.push('results');
        wizardSection.innerHTML = `
            <div class="wizard-step active">
                <h3 class="text-2xl font-bold text-white mb-6 text-center">Here are your results:</h3>
                <div class="space-y-4">${buildExplorer(results.map(r => r.id))}</div>
                 <div class="mt-8 pt-4 border-t border-gray-700">
                    <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500">Back</button>
                </div>
            </div>
        `;
        explorerSection.innerHTML = wizardSection.querySelector('.space-y-4').innerHTML; // Reuse explorer build
        document.getElementById('wizard-back-btn').addEventListener('click', goBack);
    };

    const goBack = () => {
        wizardHistory.pop(); // Remove current step/results
        if (wizardHistory.length > 0) {
            const previousStepId = wizardHistory.pop(); // Get previous step
            renderWizardStep(previousStepId);
        } else {
            showView('selection-view');
        }
    };

    // --- Event Listeners ---
    wizardBtn.addEventListener('click', () => {
        wizardHistory = [];
        renderWizardStep('start');
        showView('wizard-view');
    });

    explorerBtn.addEventListener('click', () => {
        buildExplorer();
        showView('explorer-view');
    });
    
    backToSelectionWizard.addEventListener('click', () => showView('selection-view'));
    backToSelectionExplorer.addEventListener('click', () => showView('selection-view'));

    // --- Initial Page Load ---
    buildExplorer();
    renderFeaturedCustom();
});
