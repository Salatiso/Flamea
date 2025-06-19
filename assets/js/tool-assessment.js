document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const wizardContainer = document.getElementById('assessment-wizard');
    const explorerSection = document.getElementById('explorer-section');
    const selectionArea = document.getElementById('selection-area');
    
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-tools-btn');
    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');
    
    const progressBar = document.getElementById('progress-bar');
    const backBtn = document.getElementById('back-btn');
    const recommendationContainer = document.getElementById('recommendation-text');
    const wizardNav = document.getElementById('wizard-nav');
    const stepCounter = document.getElementById('step-counter');

    // Exit if the main container isn't on this page
    if (!wizardContainer) return;
    
    // --- State ---
    const userAnswers = {};
    let stepHistory = ['1'];
    const totalSteps = 2;

    // --- Data: Tools Database ---
    const tools = {
        'plan-builder': {
            name: 'Parenting Plan Builder',
            icon: 'fa-file-signature',
            description: 'Create a comprehensive, court-ready parenting plan step-by-step.',
            url: 'plan-builder.html',
            category: 'planning'
        },
        'activity-tracker': {
            name: 'Family Activity Tracker',
            icon: 'fa-chart-line',
            description: 'Log every contribution—financial, time, and effort—to build an undeniable record.',
            url: 'activity-tracker.html',
            category: 'tracking'
        },
        'forms': {
            name: 'Forms & Templates Hub',
            icon: 'fa-folder-open',
            description: 'Access a library of legal templates, affidavits, and official forms.',
            url: 'forms.html',
            category: 'legal'
        },
        'locator': {
            name: 'Resource Locator',
            icon: 'fa-map-marked-alt',
            description: 'Find Family Advocates, courts, and father-friendly support services near you.',
            url: 'locator.html',
            category: 'external'
        },
        'chatbot': {
            name: 'AI Legal Assistant',
            icon: 'fa-robot',
            description: 'Get instant, 24/7 answers to your legal questions. Best for urgent queries.',
            url: '#',
            isModal: true,
            modalTarget: 'chatbot-modal',
            category: 'legal'
        }
    };

    // --- WIZARD LOGIC ---
    document.querySelectorAll('.wizard-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const currentStepEl = e.currentTarget.closest('.wizard-step');
            const currentStep = currentStepEl.id.split('-')[1];
            const nextStepId = e.currentTarget.dataset.next;
            
            userAnswers[currentStep] = e.currentTarget.dataset.answer;
            
            if (nextStepId === 'results') {
                showResults();
            } else {
                stepHistory.push(nextStepId);
                goToStep(nextStepId);
            }
        });
    });

    backBtn.addEventListener('click', () => {
        if (stepHistory.length > 1) {
            stepHistory.pop();
            const prevStepId = stepHistory[stepHistory.length - 1];
            goToStep(prevStepId);
        }
    });

    function goToStep(stepId) {
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.style.display = 'none';
        });
        const nextStepEl = document.getElementById(`step-${stepId}`);
        if(nextStepEl) {
             nextStepEl.style.display = 'block';
        }
       
        // Update progress bar and counter
        const progress = ((parseInt(stepId) - 1) / totalSteps) * 100;
        if(progressBar) progressBar.style.width = `${progress}%`;
        if(stepCounter) stepCounter.textContent = `Step ${stepId} of ${totalSteps}`;

        backBtn.disabled = stepId === '1';
    }

    function showResults() {
        goToStep('results');
        if(progressBar) progressBar.style.width = '100%';
        if(stepCounter) stepCounter.textContent = 'Results';
        wizardNav.style.display = 'none';
        generateRecommendations();
    }

    function generateRecommendations() {
        const recommendations = new Set();
        const goal = userAnswers['1'];
        const urgency = userAnswers['2'];

        if (urgency === 'urgent') {
            recommendations.add(tools.chatbot);
            recommendations.add(tools.locator);
        }

        switch (goal) {
            case 'plan':
                recommendations.add(tools['plan-builder']);
                recommendations.add(tools.forms);
                break;
            case 'track':
                recommendations.add(tools['activity-tracker']);
                break;
            case 'legal':
                recommendations.add(tools.forms);
                recommendations.add(tools.chatbot);
                break;
            case 'find':
                recommendations.add(tools.locator);
                break;
        }

        renderRecommendations(Array.from(recommendations), recommendationContainer);
    }
    
    // --- EXPLORER LOGIC ---
    const renderExplorer = () => {
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">';
        Object.values(tools).forEach(tool => {
             html += createToolCard(tool);
        });
        html += '</div>';
        explorerSection.innerHTML = html + explorerSection.innerHTML; // Prepend cards, keep back button
    };

    function createToolCard(tool) {
        const link = tool.isModal ? '#' : tool.url;
        const target = tool.isModal ? `data-modal-target="${tool.modalTarget}"` : `href="${link}"`;
        const tag = tool.isModal ? 'button' : 'a';

        return `
            <${tag} ${target} class="tool-card flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300">
                <i class="fas ${tool.icon} text-4xl text-blue-400 mb-4"></i>
                <h3 class="text-xl font-bold mb-2">${tool.name}</h3>
                <p class="text-gray-400 flex-grow">${tool.description}</p>
            </${tag}>
        `;
    }
    
     function renderRecommendations(recs, container) {
        if (!container) return;
        if (recs.length === 0) {
            container.innerHTML = '<p>Based on your answers, we recommend exploring all our tools to see what fits best.</p>';
            return;
        }
        container.innerHTML = recs.map(tool => createToolCard(tool)).join('');
    }

    // --- UI TOGGLING ---
    const showExplorerView = () => {
        selectionArea.style.display = 'none';
        wizardContainer.style.display = 'none';
        explorerSection.style.display = 'block';
    };

    const showWizardView = () => {
        selectionArea.style.display = 'none';
        explorerSection.style.display = 'none';
        wizardContainer.style.display = 'block';
        goToStep('1');
    };

    const showSelectionView = () => {
        explorerSection.style.display = 'none';
        wizardContainer.style.display = 'none';
        selectionArea.style.display = 'grid';
    };
    
    explorerBtn.addEventListener('click', showExplorerView);
    wizardBtn.addEventListener('click', showWizardView);
    
    // Add event listeners for the new "back" buttons in each section
    const backExplorer = document.getElementById('back-to-selection-explorer');
    const backWizard = document.getElementById('back-to-selection-wizard');
    if (backExplorer) backExplorer.addEventListener('click', showSelectionView);
    if (backWizard) backWizard.addEventListener('click', showSelectionView);

    // Initial page setup
    renderExplorer();
});
