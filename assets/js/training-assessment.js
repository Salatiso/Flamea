document.addEventListener('DOMContentLoaded', () => {
    const assessmentContainer = document.getElementById('assessment-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const restartBtn = document.getElementById('restart-assessment-btn');
    
    if (!assessmentContainer) return;

    // --- Resource Database ---
    const resources = {
        training: [
            { id: 't1', title: 'The SA Constitution', description: 'The supreme law. Understand your foundational rights.', category: 'legal', icon: 'fa-landmark', url: 'training/course-constitution.html' },
            { id: 't2', title: "The Children's Act", description: 'A deep dive into parental rights and responsibilities.', category: 'legal', icon: 'fa-child', url: 'training/course-childrens-act.html' },
            { id: 't3', title: 'Co-Parenting 101', description: 'Master communication and conflict resolution.', category: 'parenting', icon: 'fa-hands-helping', url: 'training/course-coparenting.html' },
            { id: 't4', title: 'Newborn & Daily Care', description: 'Gain confidence in essential daily tasks for infants.', category: 'foundational', icon: 'fa-baby-carriage', url: 'training/course-newborn-daily-care.html'},
            { id: 't5', title: 'The Unbroken Chain', description: 'Successor vs. Heir in Xhosa Tradition. Understand your profound duty.', category: 'cultural', icon: 'fa-link', url: 'training/course-unbroken-chain.html'},
            { id: 't6', title: 'Homeschooling Curriculum Builder', description: 'A guide for fathers taking the lead in education.', category: 'foundational', icon: 'fa-pencil-ruler', url: 'training/course-build-curriculum.html' },
        ],
        tools: [
            { id: 'f1', title: 'General Affidavit', description: 'A sworn statement for official use.', category: 'legal', icon: 'fa-gavel', url: 'assets/templates/Affidavit_General_Template.html' },
            { id: 'f2', title: 'Parenting Plan Builder', description: 'Create a comprehensive, court-ready parenting plan.', category: 'parenting', icon: 'fa-file-signature', url: 'plan-builder.html' },
            { id: 'f3', title: 'Budget for Couples', description: 'Plan your family finances together.', category: 'foundational', icon: 'fa-coins', url: 'assets/templates/Budget_Couples.html'},
            { id: 'f4', title: 'Formal Rights Affirmation', description: 'Formally assert your parental rights and responsibilities.', category: 'legal', icon: 'fa-scroll', url: 'assets/templates/Affirmation_Parental_Rights_and_Responsibilities_Formal.html'},
            { id: 'f5', title: 'Conflict Resolution Worksheet', description: 'Structure discussions to find common ground.', category: 'parenting', icon: 'fa-handshake-angle', url: 'assets/templates/Conflict_Resolution_Worksheet.html'},

        ],
        games: [
            { id: 'g1', title: 'Constitution Champions', description: 'Test your knowledge of the supreme law.', category: 'legal', icon: 'fa-shield-halved', url: 'games/constitution-champions.html' },
            { id: 'g2', title: 'Justice Builder', description: 'Learn about legal concepts through play.', category: 'parenting', icon: 'fa-cubes', url: 'games/justice-builder.html' },
            { id: 'g3', title: 'My Family, My Clan', description: 'Explore family structures and cultural roles.', category: 'cultural', icon: 'fa-users', url: 'games/my-family-my-clan.html' },
            { id: 'g4', title: 'Kid Konstitution', description: 'An introduction to rights for young children.', category: 'foundational', icon: 'fa-gamepad', url: 'games/kid-konstitution.html' }
        ]
    };

    // --- Assessment Questions with Branching Logic ---
    const questions = {
        start: {
            id: 'q1',
            question: "What is your most immediate priority or challenge right now?",
            options: [
                { text: "Understanding my legal rights and responsibilities.", scores: { legal: 2 }, next: 'legal_q2' },
                { text: "Improving my co-parenting relationship.", scores: { parenting: 2 }, next: 'parenting_q2' },
                { text: "Preparing for a new baby or caring for an infant.", scores: { foundational: 2 }, next: 'foundational_q2' },
                { text: "Connecting with my heritage and cultural duties.", scores: { cultural: 2 }, next: 'cultural_q2' }
            ]
        },
        legal_q2: {
            id: 'q2a',
            question: "Which legal area concerns you the most?",
            options: [
                { text: "High-conflict situations and disputes.", scores: { legal: 1, parenting: 1 }, next: 'final_q' },
                { text: "Formalizing a parenting plan or agreement.", scores: { legal: 1, parenting: 1 }, next: 'final_q' },
                { text: "Responding to unfair accusations.", scores: { legal: 2 }, next: 'final_q' },
                { text: "Understanding basic court processes.", scores: { legal: 1 }, next: 'final_q' }
            ]
        },
        parenting_q2: {
            id: 'q2b',
            question: "What aspect of co-parenting do you want to improve?",
            options: [
                { text: "Day-to-day communication and scheduling.", scores: { parenting: 2 }, next: 'final_q' },
                { text: "Long-term planning for education and health.", scores: { parenting: 1, foundational: 1 }, next: 'final_q' },
                { text: "Managing conflict with a difficult co-parent.", scores: { parenting: 1, legal: 1 }, next: 'final_q' },
                { text: "Setting family rules and structure.", scores: { parenting: 1 }, next: 'final_q' }
            ]
        },
        foundational_q2: {
            id: 'q2c',
            question: "What are you preparing for?",
            options: [
                { text: "The birth and first few weeks.", scores: { foundational: 2 }, next: 'final_q' },
                { text: "Establishing routines for a baby (0-1 year).", scores: { foundational: 2 }, next: 'final_q' },
                { text: "Taking a bigger role in our child's early learning.", scores: { foundational: 1, parenting: 1 }, next: 'final_q' },
                { text: "Managing finances as a new family.", scores: { foundational: 1 }, next: 'final_q' }
            ]
        },
        cultural_q2: {
             id: 'q2d',
            question: "What aspect of your heritage is most important to you right now?",
            options: [
                { text: "Understanding my role and responsibilities as a Xhosa man.", scores: { cultural: 2 }, next: 'final_q' },
                { text: "Passing down traditions and family history.", scores: { cultural: 2 }, next: 'final_q' },
                { text: "Navigating conflicts between modern life and tradition.", scores: { cultural: 1, parenting: 1 }, next: 'final_q' },
                { text: "Understanding the role of the extended family.", scores: { cultural: 1 }, next: 'final_q' }
            ]
        },
        final_q: {
            id: 'q3',
            question: "Beyond your immediate challenge, what is your long-term goal?",
            options: [
                { text: "To be a strong protector and advocate for my family.", scores: { legal: 2 } },
                { text: "To build a peaceful and cooperative family dynamic.", scores: { parenting: 2 } },
                { text: "To leave a legacy of cultural knowledge and values.", scores: { cultural: 2 } },
                { text: "To provide a secure and stable foundation for my children's future.", scores: { foundational: 2 } }
            ]
        }
    };

    // --- State ---
    let currentStepKey = 'start';
    let userScores = { legal: 0, parenting: 0, cultural: 0, foundational: 0 };
    let stepCount = 1;

    // --- Functions ---
    const renderStep = (stepKey) => {
        const step = questions[stepKey];
        if (!step) {
            console.error("Invalid step key:", stepKey);
            return;
        }
        
        let optionsHtml = step.options.map((option, index) => `
            <div>
                <input type="radio" id="${step.id}_o${index}" name="${step.id}" value="${index}" class="hidden">
                <label for="${step.id}_o${index}" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600">
                    <h3 class="font-bold text-lg text-white">${option.text}</h3>
                </label>
            </div>
        `).join('');

        assessmentContainer.innerHTML = `
            <div class="wizard-step active">
                <div class="text-center mb-6">
                    <p class="text-sm font-semibold text-teal-400">Step ${stepCount} of 3</p>
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
        const currentStep = questions[currentStepKey];
        const selectedRadio = assessmentContainer.querySelector(`input[name="${currentStep.id}"]:checked`);
        if (!selectedRadio) return;

        const answerIndex = parseInt(selectedRadio.value);
        const selectedOption = currentStep.options[answerIndex];

        // Tally scores
        for (const category in selectedOption.scores) {
            userScores[category] += selectedOption.scores[category];
        }

        // Determine next step
        const nextStepKey = selectedOption.next;
        stepCount++;
        
        if (nextStepKey) {
            currentStepKey = nextStepKey;
            renderStep(currentStepKey);
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
        
        // Function to add a resource if not already present
        const addResource = (type, category) => {
            const resource = resources[type].find(r => r.category === category && !finalRecs.has(r));
            if(resource) finalRecs.add(resource);
        };
        
        // 1. Add mandatory Constitution training
        finalRecs.add(resources.training.find(t => t.id === 't1'));
        
        // 2. Add primary category resources
        addResource('training', primaryCat);
        addResource('tools', primaryCat);
        addResource('games', primaryCat);
        
        // 3. Add secondary category resources
        addResource('training', secondaryCat);
        addResource('tools', secondaryCat);
        addResource('games', secondaryCat);

        // 4. Fill any gaps with default items if categories didn't yield enough unique results
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
        
        let type;
        if (resources.training.some(r => r.id === resource.id)) type = 'Training';
        else if (resources.tools.some(r => r.id === resource.id)) type = 'Tool';
        else type = 'Game';
        
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
        currentStepKey = 'start';
        stepCount = 1;
        for (const key in userScores) { userScores[key] = 0; }
        resultsContainer.classList.add('hidden');
        assessmentContainer.classList.remove('hidden');
        renderStep('start');
    };

    // --- Initial Kick-off ---
    restartBtn.addEventListener('click', startOver);
    renderStep('start');
});
