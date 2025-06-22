document.addEventListener('DOMContentLoaded', () => {
    const assessmentContainer = document.getElementById('assessment-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const restartBtn = document.getElementById('restart-assessment-btn');
    
    if (!assessmentContainer) return;

    // --- Database of all available resources ---
    // Updated with all new courses and their age groups
    const resources = {
        training: [
            // Kids Courses
            { id: 'tk1', title: 'My Rights, My Shield', ageGroup: 'kids', category: 'legal', icon: 'fa-user-shield', url: 'training/course_kids-rights_shield.html', description: 'Learn about your special rights that keep you safe.' },
            { id: 'tk2', title: 'The Big Rule Book', ageGroup: 'kids', category: 'legal', icon: 'fa-book-open', url: 'training/course-kids-big_rule_book.html', description: 'Why the Constitution is the most important rule book.' },
            { id: 'tk3', title: "Who's In Charge?", ageGroup: 'kids', category: 'foundational', icon: 'fa-gavel', url: 'training/course-kids-whos_in_charge.html', description: 'Understanding rules at home, school, and in our country.' },
            { id: 'tk4', title: 'The Best Nest', ageGroup: 'kids', category: 'parenting', icon: 'fa-home', url: 'training/course-kids-the_best_nest.html', description: 'A story about why safe and happy homes are important.' },
            
            // Khulu Courses
            { id: 'tkh1', title: 'The Constitution: Your Ultimate Shield', ageGroup: 'khulu', category: 'legal', icon: 'fa-landmark', url: 'training/courses_khulu-the_constitution_your_ultimate_shield.html', description: 'A grandparent\'s guide to the supreme law of the land.' },
            { id: 'tkh2', title: 'Senior Crusaders', ageGroup: 'khulu', category: 'legal', icon: 'fa-shield-virus', url: 'training/course-khulu-senior-crusaders.html', description: 'Advanced strategies for protecting family and legacy.' },

            // Parent & Father Courses
            { id: 't1', title: 'The SA Constitution', ageGroup: 'general', description: 'Understand your foundational rights as a father and citizen.', category: 'legal', icon: 'fa-landmark', url: 'training/course-constitution.html' },
            { id: 't2', title: "The Children's Act", ageGroup: 'general', description: 'A deep dive into parental rights and responsibilities.', category: 'legal', icon: 'fa-child', url: 'training/course-childrens-act.html' },
            { id: 't3', title: 'Co-Parenting 101', ageGroup: 'general', description: 'Master communication and conflict resolution.', category: 'parenting', icon: 'fa-hands-helping', url: 'training/course-coparenting.html' },
            { id: 't4', title: 'Newborn & Daily Care', ageGroup: 'general', description: 'Gain confidence in essential daily tasks for infants.', category: 'foundational', icon: 'fa-baby-carriage', url: 'training/course-newborn-daily-care.html'},
            { id: 't5', title: 'The Unbroken Chain', ageGroup: 'general', description: 'Successor vs. Heir in Xhosa Tradition.', category: 'cultural', icon: 'fa-link', url: 'training/course-unbroken-chain.html'},
            { id: 't6', title: 'Homeschooling Curriculum Builder', ageGroup: 'general', description: 'A guide for fathers taking the lead in education.', category: 'foundational', icon: 'fa-pencil-ruler', url: 'training/course-build-curriculum.html' },
            { id: 't7', title: 'A Father\'s Shield', ageGroup: 'general', description: 'Use the \'Best Interests of the Child\' principle effectively.', category: 'legal', icon: 'fa-shield-alt', url: 'training/course-fathers-shield.html'},
        ]
    };

    const questions = {
        // Questions for Parents/General
        start: { id: 'q1', question: "What is your most immediate priority or challenge right now?", options: [ { text: "Understanding my legal rights and responsibilities.", scores: { legal: 2 }, next: 'legal_q2' }, { text: "Improving my co-parenting relationship.", scores: { parenting: 2 }, next: 'parenting_q2' }, { text: "Preparing for a new baby or caring for an infant.", scores: { foundational: 2 }, next: 'foundational_q2' }, { text: "Connecting with my heritage and cultural duties.", scores: { cultural: 2 }, next: 'cultural_q2' } ]},
        legal_q2: { id: 'q2a', question: "Which legal area concerns you the most?", options: [ { text: "High-conflict situations and disputes.", scores: { legal: 1, parenting: 1 }, next: 'final_q' }, { text: "Formalizing a parenting plan or agreement.", scores: { legal: 1, parenting: 1 }, next: 'final_q' }, { text: "Responding to unfair accusations.", scores: { legal: 2 }, next: 'final_q' }, { text: "Understanding basic court processes.", scores: { legal: 1 }, next: 'final_q' } ]},
        parenting_q2: { id: 'q2b', question: "What aspect of co-parenting do you want to improve?", options: [ { text: "Day-to-day communication and scheduling.", scores: { parenting: 2 }, next: 'final_q' }, { text: "Long-term planning for education and health.", scores: { parenting: 1, foundational: 1 }, next: 'final_q' }, { text: "Managing conflict with a difficult co-parent.", scores: { parenting: 1, legal: 1 }, next: 'final_q' } ]},
        foundational_q2: { id: 'q2c', question: "What are you preparing for?", options: [ { text: "The birth and first few weeks.", scores: { foundational: 2 }, next: 'final_q' }, { text: "Establishing routines for a baby (0-1 year).", scores: { foundational: 2 }, next: 'final_q' }, { text: "Taking a bigger role in our child's early learning.", scores: { foundational: 1, parenting: 1 }, next: 'final_q' } ]},
        cultural_q2: { id: 'q2d', question: "What aspect of your heritage is most important?", options: [ { text: "Understanding my role and responsibilities as a Xhosa man.", scores: { cultural: 2 }, next: 'final_q' }, { text: "Passing down traditions and family history.", scores: { cultural: 2 }, next: 'final_q' }, { text: "Navigating conflicts between modern life and tradition.", scores: { cultural: 1, parenting: 1 }, next: 'final_q' } ]},
        final_q: { id: 'q3', question: "Beyond your immediate challenge, what is your long-term goal?", options: [ { text: "To be a strong protector and advocate for my family.", scores: { legal: 2 } }, { text: "To build a peaceful and cooperative family dynamic.", scores: { parenting: 2 } }, { text: "To leave a legacy of cultural knowledge and values.", scores: { cultural: 2 } }, { text: "To provide a secure and stable foundation.", scores: { foundational: 2 } } ]},

        // Questions for Kids
        kids_start: { id: 'qk1', question: "What sounds like the most fun thing to learn about?", options: [ { text: "Learning about my special shield of rights that keeps me safe.", scores: { legal: 2 }, next: 'kids_final_q' }, { text: "How to be a great teammate in my family.", scores: { parenting: 2 }, next: 'kids_final_q' }, { text: "Understanding the big rules of our country.", scores: { foundational: 2 }, next: 'kids_final_q' }] },
        kids_final_q: { id: 'qk2', question: "What do you want to be the best at?", options: [{ text: "Knowing all the rules to be fair.", scores: { legal: 1 } }, { text: "Making sure everyone in my family is happy.", scores: { parenting: 1 } }] },
        
        // Questions for Khulu
        khulu_start: { id: 'qkh1', question: "As an elder, where is your wisdom most needed right now?", options: [ { text: "Protecting my family's rights and legacy using the law.", scores: { legal: 2 }, next: 'khulu_final_q' }, { text: "Guiding the younger generation in co-parenting.", scores: { parenting: 2 }, next: 'khulu_final_q' }, { text: "Sharing our cultural and family history.", scores: { cultural: 2 }, next: 'khulu_final_q' }] },
        khulu_final_q: { id: 'qkh2', question: "What is the most important legacy to leave?", options: [ { text: "A family that is legally protected and secure.", scores: { legal: 1 } }, { text: "A family that knows its roots and traditions.", scores: { cultural: 1 } }] }
    };

    let state = { currentStepKey: 'age_select', userScores: { legal: 0, parenting: 0, cultural: 0, foundational: 0 }, stepCount: 1, ageGroup: null };

    const renderStep = () => {
        const step = questions[state.currentStepKey];
        if (!step) {
            if(state.currentStepKey === 'age_select') renderAgeSelection();
            else console.error("Invalid step key:", state.currentStepKey);
            return;
        }
        
        const optionsHtml = step.options.map((option, index) => `
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
                    <p class="text-sm font-semibold text-teal-400">Step ${state.stepCount} of 3</p>
                    <h2 class="text-2xl font-bold text-white mt-2">${step.question}</h2>
                </div>
                <div class="space-y-4 mb-8">${optionsHtml}</div>
                <button id="next-btn" class="w-full bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors opacity-50 cursor-not-allowed" disabled>Next <i class="fas fa-arrow-right ml-2"></i></button>
            </div>
        `;
        
        const nextBtn = document.getElementById('next-btn');
        assessmentContainer.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                nextBtn.disabled = false;
                nextBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-600');
                nextBtn.classList.add('bg-green-600', 'hover:bg-green-500');
            });
        });
        
        nextBtn.addEventListener('click', handleNextStep);
    };

    const renderAgeSelection = () => {
        state.stepCount = 1;
        assessmentContainer.innerHTML = `
            <div class="wizard-step active">
                <div class="text-center mb-6">
                    <p class="text-sm font-semibold text-teal-400">Step ${state.stepCount} of 3</p>
                    <h2 class="text-2xl font-bold text-white mt-2">First, who is this training for?</h2>
                </div>
                <div class="space-y-4">
                    <div><input type="radio" id="age_kids" name="age_group" value="kids" class="hidden"><label for="age_kids" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600"><h3 class="font-bold text-lg text-white">A Child (Ages 4-13)</h3></label></div>
                    <div><input type="radio" id="age_general" name="age_group" value="general" class="hidden"><label for="age_general" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600"><h3 class="font-bold text-lg text-white">A Parent or Adult</h3></label></div>
                    <div><input type="radio" id="age_khulu" name="age_group" value="khulu" class="hidden"><label for="age_khulu" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600"><h3 class="font-bold text-lg text-white">A Grandparent or Elder (uKhulu)</h3></label></div>
                </div>
            </div>`;
        
        assessmentContainer.querySelectorAll('input[name="age_group"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.ageGroup = e.target.value;
                state.stepCount++;
                state.currentStepKey = (state.ageGroup === 'kids') ? 'kids_start' : (state.ageGroup === 'khulu') ? 'khulu_start' : 'start';
                renderStep();
            });
        });
    }

    const handleNextStep = () => {
        const currentStep = questions[state.currentStepKey];
        const selectedRadio = assessmentContainer.querySelector(`input[name="${currentStep.id}"]:checked`);
        if (!selectedRadio) return;

        const answerIndex = parseInt(selectedRadio.value);
        const selectedOption = currentStep.options[answerIndex];

        for (const category in selectedOption.scores) {
            userScores[category] += selectedOption.scores[category];
        }

        const nextStepKey = selectedOption.next;
        state.stepCount++;
        
        if (nextStepKey) {
            state.currentStepKey = nextStepKey;
            renderStep();
        } else {
            showResults();
        }
    };
    
    const showResults = () => {
        assessmentContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        
        const sortedCategories = Object.entries(state.userScores).sort(([, a], [, b]) => b - a);
        const primaryCat = sortedCategories[0][0];
        const secondaryCat = sortedCategories[1] ? sortedCategories[1][0] : sortedCategories[0][0];

        const finalRecs = new Set();
        const relevantTraining = resources.training.filter(r => r.ageGroup === state.ageGroup || (state.ageGroup === 'general' && r.ageGroup !== 'kids' && r.ageGroup !== 'khulu'));

        // Function to add resources
        const addResource = (category) => {
            const resource = relevantTraining.find(r => r.category === category && !Array.from(finalRecs).some(rec => rec.id === r.id));
            if(resource) finalRecs.add(resource);
        };
        
        // Add resources based on scores
        addResource(primaryCat);
        addResource(secondaryCat);
        
        // Add a mandatory recommendation based on age
        if(state.ageGroup === 'general') finalRecs.add(resources.training.find(t => t.id === 't1')); // Constitution for adults
        if(state.ageGroup === 'kids') finalRecs.add(resources.training.find(t => t.id === 'tk1')); // Rights shield for kids
        if(state.ageGroup === 'khulu') finalRecs.add(resources.training.find(t => t.id === 'tkh1')); // Constitution for Khulus

        // Fill up to 6 unique recommendations
        let i = 0;
        while(finalRecs.size < 6 && i < relevantTraining.length) {
            finalRecs.add(relevantTraining[i]);
            i++;
        }
        
        resultsGrid.innerHTML = Array.from(finalRecs).slice(0, 6).map(createResourceCard).join('');
    };

    const createResourceCard = (resource) => {
        if (!resource) return '';
        const colorClass = 'bg-blue-500';
        return `
            <a href="${resource.url}" class="recommendation-card block bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-blue-500 h-full flex flex-col">
                <div class="flex-shrink-0 mb-3">
                    <span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white ${colorClass}">Training</span>
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
        state = { currentStepKey: 'age_select', userScores: { legal: 0, parenting: 0, cultural: 0, foundational: 0 }, stepCount: 1, ageGroup: null };
        resultsContainer.classList.add('hidden');
        assessmentContainer.classList.remove('hidden');
        renderStep();
    };

    restartBtn.addEventListener('click', startOver);
    renderStep();
});
