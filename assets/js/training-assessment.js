// I have repaired the logic in this script. It now correctly proceeds
// through all steps of the wizard without getting stuck, and the
// recommendations are filtered by age group as intended.

document.addEventListener('DOMContentLoaded', () => {
    const assessmentContainer = document.getElementById('assessment-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');
    const restartBtn = document.getElementById('restart-assessment-btn');
    
    if (!assessmentContainer) return;

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
        start: { id: 'q1', question: "What is your most immediate priority or challenge right now?", options: [ { text: "Understanding my legal rights and responsibilities.", scores: { legal: 2 }, next: 'final_q' }, { text: "Improving my co-parenting relationship.", scores: { parenting: 2 }, next: 'final_q' }, { text: "Practical skills for a new baby or family life.", scores: { foundational: 2 }, next: 'final_q' }, { text: "Connecting with my heritage and cultural duties.", scores: { cultural: 2 }, next: 'final_q' } ]},
        final_q: { id: 'q3', question: "Beyond your immediate challenge, what is your long-term goal?", options: [ { text: "To be a strong protector and advocate for my family.", scores: { legal: 2 } }, { text: "To build a peaceful and cooperative family dynamic.", scores: { parenting: 2 } }, { text: "To leave a legacy of cultural knowledge and values.", scores: { cultural: 2 } }, { text: "To provide a secure and stable foundation.", scores: { foundational: 2 } } ]},

        // Questions for Kids
        kids_start: { id: 'qk1', question: "What sounds like the most fun thing to learn about?", options: [ { text: "Learning about my special shield of rights that keeps me safe.", scores: { legal: 2 } }, { text: "How to be a great teammate in my family.", scores: { parenting: 2 } }, { text: "Understanding the big rules of our country.", scores: { foundational: 2 } }] },
        
        // Questions for Khulu
        khulu_start: { id: 'qkh1', question: "As an elder, where is your wisdom most needed right now?", options: [ { text: "Protecting my family's rights and legacy using the law.", scores: { legal: 2 } }, { text: "Guiding the younger generation in co-parenting.", scores: { parenting: 2 } }, { text: "Sharing our cultural and family history.", scores: { cultural: 2 } }] }
    };

    let state = { currentStep: 0, ageGroup: null, userScores: { legal: 0, parenting: 0, cultural: 0, foundational: 0 }};

    function renderStep() {
        switch (state.currentStep) {
            case 0: renderAgeSelection(); break;
            case 1: renderQuestionStep(1); break;
            case 2:
                 // For general users, there is a second question. For others, go to results.
                 if (state.ageGroup === 'general') {
                     renderQuestionStep(2);
                 } else {
                     showResults();
                 }
                 break;
            case 3: showResults(); break;
        }
    }

    function renderAgeSelection() {
        assessmentContainer.innerHTML = `
            <div class="wizard-step active">
                <div class="text-center mb-6">
                    <p class="text-sm font-semibold text-teal-400">Step 1 of 3</p>
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
                state.currentStep++;
                renderStep();
            });
        });
    }

    function renderQuestionStep(stepNumber) {
        let questionKey;
        if (state.ageGroup === 'kids') questionKey = 'kids_start';
        else if (state.ageGroup === 'khulu') questionKey = 'khulu_start';
        else questionKey = (stepNumber === 1) ? 'start' : 'final_q';
        
        const questionData = questions[questionKey];
        if(!questionData) {
            showResults();
            return;
        }

        const optionsHtml = questionData.options.map((option, index) => `
            <div>
                <input type="radio" id="q_o${index}" name="question_option" value="${index}" class="hidden">
                <label for="q_o${index}" class="option-label block p-5 bg-gray-700/50 rounded-lg border-2 border-gray-600"><h3 class="font-bold text-lg text-white">${option.text}</h3></label>
            </div>`).join('');

        assessmentContainer.innerHTML = `
            <div class="wizard-step active">
                <div class="text-center mb-6">
                    <p class="text-sm font-semibold text-teal-400">Step ${stepNumber + 1} of 3</p>
                    <h2 class="text-2xl font-bold text-white mt-2">${questionData.question}</h2>
                </div>
                <div class="space-y-4">${optionsHtml}</div>
            </div>`;

        assessmentContainer.querySelectorAll('input[name="question_option"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const selectedOption = questionData.options[parseInt(radio.value)];
                Object.entries(selectedOption.scores).forEach(([cat, score]) => state.userScores[cat] += score);
                state.currentStep++;
                renderStep();
            });
        });
    }

    function showResults() {
        assessmentContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');

        const relevantResources = resources.training.filter(r => r.ageGroup === state.ageGroup || (state.ageGroup === 'general' && r.ageGroup === 'general'));
        
        const sortedCategories = Object.entries(state.userScores).sort(([,a],[,b]) => b - a);
        const topCategory = sortedCategories.length > 0 ? sortedCategories[0][0] : 'legal';

        let recommendations = new Set();
        relevantResources.filter(r => r.category === topCategory).forEach(r => recommendations.add(r));
        
        let i = 0;
        while (recommendations.size < 6 && i < relevantResources.length) {
            recommendations.add(relevantResources[i]);
            i++;
        }

        resultsGrid.innerHTML = Array.from(recommendations).map(createResourceCard).join('');
    }

    const createResourceCard = (resource) => {
        if (!resource) return '';
        return `
            <a href="${resource.url}" class="recommendation-card block bg-gray-700/50 p-6 rounded-lg border border-gray-600 hover:border-blue-500 h-full flex flex-col">
                <div class="flex-shrink-0 mb-3"><span class="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-blue-500">Training</span></div>
                <div class="flex items-start flex-grow">
                    <i class="fas ${resource.icon} text-3xl text-gray-400 mr-4 w-8 text-center"></i>
                    <div>
                        <h4 class="text-xl font-bold text-white">${resource.title}</h4>
                        <p class="text-gray-400 text-sm mt-1 flex-grow">${resource.description || ''}</p>
                    </div>
                </div>
            </a>`;
    };

    const startOver = () => {
        state = { currentStep: 0, ageGroup: null, userScores: { legal: 0, parenting: 0, cultural: 0, foundational: 0 }};
        resultsContainer.classList.add('hidden');
        assessmentContainer.classList.remove('hidden');
        renderStep();
    };

    restartBtn.addEventListener('click', startOver);
    renderStep();
});
