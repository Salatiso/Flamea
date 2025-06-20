document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const assessmentContainer = document.getElementById('assessment-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const restartBtn = document.getElementById('restart-assessment-btn');
    
    if (!assessmentContainer) return;

    // --- Data Definitions: Questions & Resources ---

    const questions = [
        {
            id: 'q1',
            question: "What is your most immediate priority or challenge right now?",
            options: [
                { text: "Understanding my legal rights and responsibilities as a father.", scores: { legal: 2 } },
                { text: "Improving my day-to-day relationship and communication with my co-parent.", scores: { parenting: 2 } },
                { text: "Preparing for the arrival of a new baby or caring for an infant.", scores: { foundational: 2 } },
                { text: "Connecting with my heritage and understanding my cultural duties as a man.", scores: { cultural: 2 } }
            ]
        },
        {
            id: 'q2',
            question: "How would you describe your current co-parenting situation?",
            options: [
                { text: "High-conflict; we are struggling to agree on anything.", scores: { legal: 1, parenting: 1 } },
                { text: "We have a basic agreement, but need to formalize it.", scores: { parenting: 1, legal: 1 } },
                { text: "We are expecting, and want to start on the right foot.", scores: { foundational: 2 } },
                { text: "Generally okay, but I want to ensure our cultural values are respected.", scores: { cultural: 1 } }
            ]
        },
        {
            id: 'q3',
            question: "Which area of personal growth are you most interested in?",
            options: [
                { text: "Becoming a powerful advocate for myself and my children.", scores: { legal: 2 } },
                { text: "Building a resilient and well-structured family environment.", scores: { parenting: 1, cultural: 1 } },
                { text: "Learning the practical, hands-on skills of daily fatherhood.", scores: { foundational: 1, parenting: 1 } },
                { text: "Homeschooling or taking a more direct role in my children's education.", scores: { foundational: 2 } }
            ]
        }
    ];

    const resources = {
        training: [
            { id: 't1', title: 'The SA Constitution', description: 'The supreme law. Understand your foundational rights.', category: 'legal', icon: 'fa-landmark', url: 'training/course-constitution.html' },
            { id: 't2', title: "The Children's Act", description: 'A deep dive into parental rights and responsibilities.', category: 'legal', icon: 'fa-child', url: 'training/course-childrens-act.html' },
            { id: 't3', title: 'Co-Parenting 101', description: 'Master communication and conflict resolution.', category: 'parenting', icon: 'fa-hands-helping', url: 'training/course-coparenting.html' },
            { id: 't4', title: 'Newborn & Daily Care', description: 'Gain confidence in essential daily tasks for infants.', category: 'foundational', icon: 'fa-baby-carriage', url: 'training/course-newborn-daily-care.html'},
            { id: 't5', title: 'The Unbroken Chain', description: 'Successor vs. Heir in Xhosa Tradition. Understand your profound duty.', category: 'cultural', icon: 'fa-link', url: 'training/course-unbroken-chain.html'},
        ],
        tools: [
            { id: 'f1', title: 'General Affidavit', description: 'A sworn statement for official use.', category: 'legal', icon: 'fa-gavel', url: 'assets/templates/Affidavit_General_Template.html' },
            { id: 'f2', title: 'Parenting Plan Builder', description: 'Create a comprehensive, court-ready parenting plan.', category: 'parenting', icon: 'fa-file-signature', url: 'plan-builder.html' },
            { id: 'f3', title: 'Budget for Couples', description: 'Plan your family finances together.', category: 'foundational', icon: 'fa-coins', url: 'assets/templates/Budget_Couples.html'},
            { id: 'f4', title: 'Formal Rights Affirmation', description: 'Formally assert your parental rights and responsibilities.', category: 'legal', icon: 'fa-scroll', url: 'assets/templates/Affirmation_Parental_Rights_and_Responsibilities_Formal.html'},
        ],
        games: [
            { id: 'g1', title: 'Constitution Champions', description: 'Test your knowledge of the supreme law.', category: 'legal', icon: 'fa-shield-halved', url: 'games/constitution-champions.html' },
            { id: 'g2', title: 'Justice Builder', description: 'Learn about legal concepts through play.', category: 'parenting', icon: 'fa-cubes', url: 'games/justice-builder.html' },
            { id: 'g3', title: 'My Family, My Clan', description: 'Explore family structures and cultural roles.', category: 'cultural', icon: 'fa-users', url: 'games/my-family-my-clan.html' },
            { id: 'g4', title: 'Kid Konstitution', description: 'An introduction to rights for young children.', category: 'foundational', icon: 'fa-gamepad', url: 'games/kid-konstitution.html' }
        ]
    };
    
    // --- State ---
    let currentStepIndex = 0;
    const userScores = { legal: 0, parenting: 0, cultural: 0, foundational: 0 };

    // --- Functions ---
    const renderStep = (stepIndex) => {
        const step = questions[stepIndex];
        
        let optionsHtml = step.options.map((option, index) => `
            <div>
                <input type="radio" id="q${stepIndex}o${index}" name="q${stepIndex}" value="${index}" class="hidden">
                <label for="q${stepIndex}o${index}" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600">
                    <h3 class="font-bold text-lg text-white">${option.text}</h3>
                </label>
            </div>
        `).join('');

        assessmentContainer.innerHTML = `
            <div class="wizard-step active">
                <div class="text-center mb-6">
                    <p class="text-sm font-semibold text-teal-400">Step ${stepIndex + 1} of ${questions.length}</p>
                    <h2 class="text-2xl font-bold text-white mt-2">${step.question}</h2>
                </div>
                <div class="space-y-4 mb-8">${optionsHtml}</div>
                <button id="next-btn" class="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors opacity-50 cursor-not-allowed" disabled>Next <i class="fas fa-arrow-right ml-2"></i></button>
            </div>
        `;
        
        const nextBtn = document.getElementById('next-btn');
        assessmentContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                nextBtn.disabled = false;
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-blue-600');
                nextBtn.classList.add('bg-green-600', 'hover:bg-green-500');
            });
        });
        
        nextBtn.addEventListener('click', handleNextStep);
    };

    const handleNextStep = () => {
        const selectedRadio = assessmentContainer.querySelector(`input[name="q${currentStepIndex}"]:checked`);
        if (!selectedRadio) return;

        const answerIndex = parseInt(selectedRadio.value);
        const scores = questions[currentStepIndex].options[answerIndex].scores;

        for (const category in scores) {
            userScores[category] += scores[category];
        }

        currentStepIndex++;
        if (currentStepIndex < questions.length) {
            renderStep(currentStepIndex);
        } else {
            showResults();
        }
    };
    
    const showResults = () => {
        assessmentContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        
        const sortedCategories = Object.entries(userScores).sort(([, a], [, b]) => b - a);
        
        const primaryCat = sortedCategories[0][0];
        const secondaryCat = sortedCategories[1][0];

        const finalRecs = new Set();
        
        // Add mandatory Constitution training
        finalRecs.add(resources.training.find(t => t.id === 't1'));
        
        // Add primary category resources
        finalRecs.add(resources.training.find(t => t.category === primaryCat && t.id !== 't1'));
        finalRecs.add(resources.tools.find(t => t.category === primaryCat));
        finalRecs.add(resources.games.find(g => g.category === primaryCat));
        
        // Add secondary category resources, avoiding duplicates
        finalRecs.add(resources.training.find(t => t.category === secondaryCat && t.id !== 't1'));
        finalRecs.add(resources.tools.find(t => t.category === secondaryCat));
        finalRecs.add(resources.games.find(g => g.category === secondaryCat));

        // Fill any gaps with default items if categories didn't yield enough unique results
        const allResources = [...resources.training, ...resources.tools, ...resources.games];
        let i = 0;
        while(finalRecs.size < 6 && i < allResources.length) {
            finalRecs.add(allResources[i]);
            i++;
        }
        
        resultsGrid.innerHTML = Array.from(finalRecs).slice(0, 6).map(rec => createResourceCard(rec)).join('');
    };

    const createResourceCard = (resource) => {
        if (!resource) return ''; // Failsafe for missing recommendations
        const type = resources.training.some(r => r.id === resource.id) ? 'Training' :
                     resources.tools.some(r => r.id === resource.id) ? 'Tool' : 'Game';
        
        const colorClass = type === 'Training' ? 'bg-blue-500' :
                           type === 'Tool' ? 'bg-amber-500' : 'bg-teal-500';

        return `
            <a href="${resource.url}" class="recommendation-card block bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-blue-500 h-full flex flex-col">
                <div class="flex-shrink-0 mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white ${colorClass}">${type}</span>
                </div>
                <div class="flex items-start flex-grow">
                    <i class="fas ${resource.icon} text-3xl text-gray-400 mr-4 w-8 text-center"></i>
                    <div class="flex flex-col">
                        <h4 class="text-xl font-bold text-white">${resource.title}</h4>
                        <p class="text-gray-400 text-sm mt-1 flex-grow">${resource.description || ''}</p>
                    </div>
                </div>
            </a>
        `;
    };

    const startOver = () => {
        currentStepIndex = 0;
        for (const key in userScores) { userScores[key] = 0; }
        resultsContainer.classList.add('hidden');
        assessmentContainer.classList.remove('hidden');
        renderStep(0);
    };

    // --- Initial Kick-off ---
    restartBtn.addEventListener('click', startOver);
    renderStep(0);
});
