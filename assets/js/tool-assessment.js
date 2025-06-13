// assets/js/tool-assessment.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const wizard = document.getElementById('assessment-wizard');
    const progressBar = document.getElementById('progress-bar');
    const wizardOptions = document.querySelectorAll('.wizard-option');
    const backBtn = document.getElementById('back-btn');
    const recommendationContainer = document.getElementById('recommendation-text');

    // --- STATE ---
    const userAnswers = {};
    const stepHistory = ['1']; // Start with the first step
    const totalSteps = 2; // Total number of question steps

    // --- TOOL DATA ---
    const tools = {
        'plan-builder': {
            name: 'Parenting Plan Builder',
            icon: 'fa-file-signature',
            description: 'Create a comprehensive, court-ready parenting plan step-by-step.',
            url: 'plan-builder.html'
        },
        'activity-tracker': {
            name: 'Family Activity Tracker',
            icon: 'fa-chart-line',
            description: 'Log every contribution—financial, time, and effort—to build an undeniable record.',
            url: 'activity-tracker.html'
        },
        'forms': {
            name: 'Forms & Wizards',
            icon: 'fa-folder-open',
            description: 'Access a library of legal templates, affidavits, and official forms.',
            url: 'forms.html'
        },
        'locator': {
            name: 'Resource Locator',
            icon: 'fa-map-marked-alt',
            description: 'Find Family Advocates, courts, and father-friendly support services near you.',
            url: 'locator.html'
        },
        'chatbot': {
            name: 'AI Legal Assistant',
            icon: 'fa-robot',
            description: 'Get instant, 24/7 answers to your legal questions. Best for urgent queries.',
            url: '#', // This will open a modal
            isModal: true,
            modalTarget: 'chatbot-modal'
        }
    };

    // --- EVENT LISTENERS ---
    wizardOptions.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepEl = button.closest('.wizard-step');
            const currentStep = currentStepEl.id.split('-')[1];
            const nextStepId = button.dataset.next;
            
            userAnswers[currentStep] = button.dataset.answer;
            
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


    // --- FUNCTIONS ---
    function goToStep(stepId) {
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${stepId}`).classList.add('active');
        
        // Update progress bar
        const progress = (parseInt(stepId) / (totalSteps + 1)) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Enable/disable back button
        backBtn.disabled = stepId === '1';
    }

    function showResults() {
        // Finalize progress bar
        progressBar.style.width = '100%';

        // Hide other steps and show results
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step-results').classList.add('active');
        backBtn.disabled = false; // Allow going back from results

        // Generate recommendations
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

        renderRecommendations(Array.from(recommendations));
    }

    function renderRecommendations(recs) {
        if (recs.length === 0) {
            recommendationContainer.innerHTML = '<p>Based on your answers, we recommend exploring all our tools to see what fits best.</p>';
            return;
        }

        let html = '<p class="font-bold text-lg mb-4">Here are the best tools for you:</p>';
        recs.forEach(tool => {
            const link = tool.isModal ? '#' : tool.url;
            const target = tool.isModal ? `data-modal-target="${tool.modalTarget}"` : `href="${link}"`;
            const tag = tool.isModal ? 'button' : 'a';

            html += `
                <${tag} ${target} class="flex items-start gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-900 transition-colors w-full text-left">
                    <i class="fas ${tool.icon} text-2xl text-teal-400 mt-1 w-8 text-center"></i>
                    <div>
                        <h4 class="font-bold text-white">${tool.name}</h4>
                        <p class="text-sm text-gray-400">${tool.description}</p>
                    </div>
                </${tag}>
            `;
        });
        recommendationContainer.innerHTML = html;
        
        // Re-add modal listeners if any modal buttons were created
        // This is a simplified version; a full event delegation model in main.js is more robust
        document.querySelectorAll('[data-modal-target]').forEach(button => {
             button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal) {
                   // This assumes main.js is loaded and handles the .active class
                   modal.classList.add('active');
                }
            });
        });
    }
});
