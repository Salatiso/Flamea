import { auth, db } from './firebase-config.js';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {

    // --- DOM ELEMENT REFERENCES ---
    const elements = {
        assessmentContainer: document.getElementById('assessment-container'),
        startScreen: document.getElementById('start-screen'),
        questionScreen: document.getElementById('question-screen'),
        resultsScreen: document.getElementById('results-screen'),
        startBtn: document.getElementById('start-assessment-btn'),
        questionTitle: document.getElementById('question-title'),
        questionText: document.getElementById('question-text'),
        optionsContainer: document.getElementById('options-container'),
        questionCounter: document.getElementById('question-counter'),
        progressBarInner: document.getElementById('progress-bar-inner'),
        navigationControls: document.getElementById('navigation-controls'),
        backBtn: document.getElementById('back-btn'),
        nextBtn: document.getElementById('next-btn'),
        resultsSummary: document.getElementById('results-summary'),
        recommendationsContainer: document.getElementById('recommendations-container'),
        certificateModal: document.getElementById('certificate-modal'),
        certificateModalContent: document.getElementById('certificate-modal-content'),
    };

    if (!elements.assessmentContainer) return;

    // --- ASSESSMENT DATABASE ---
    const dbData = {
        questions: [
            // Level 1: The Foundation Builder
            {
                id: 'q1', level: 1, title: 'Legal Foundation', text: "When you think about your rights as a father, what is your primary source of understanding?",
                options: [
                    { value: 'a', text: "Community & Family wisdom", score: 1, recs: ['rec_constitution_law', 'rec_book_goliaths_reckoning'] },
                    { value: 'b', text: "Friends or Social Media", score: 1, recs: ['rec_constitution_law', 'rec_book_goliaths_reckoning'] },
                    { value: 'c', text: "The child's mother or her lawyer", score: 1, recs: ['rec_constitution_law', 'rec_book_goliaths_reckoning', 'rec_tool_comm_plan'] },
                    { value: 'd', text: "My own reading of legal documents", score: 4, recs: ['rec_constitution_law'] },
                    { value: 'e', text: "I'm not sure where to begin", score: 0, recs: ['rec_constitution_law', 'rec_book_goliaths_reckoning', 'rec_training_family_law'] },
                ]
            },
            {
                id: 'q2', level: 1, title: 'Co-Parenting Communication', text: "Which statement best describes your current co-parenting communication?",
                options: [
                    { value: 'a', text: "Non-existent or via third parties", score: 0, recs: ['rec_training_coparenting', 'rec_tool_comm_plan', 'rec_book_sf_plans'] },
                    { value: 'b', text: "High-conflict and often hostile", score: 1, recs: ['rec_training_coparenting', 'rec_tool_conflict_worksheet', 'rec_book_sf_plans'] },
                    { value: 'c', text: "Functional, but tense and difficult", score: 2, recs: ['rec_training_coparenting', 'rec_tool_conflict_worksheet'] },
                    { value: 'd', text: "Respectful and collaborative", score: 4, recs: [] }
                ]
            },
            {
                id: 'q3', level: 1, title: 'Formal Agreements', text: 'Do you have a formal, written Parenting Plan?',
                options: [
                    { value: 'a', text: 'No, nothing is written down.', score: 0, recs: ['rec_tool_parenting_plan_builder', 'rec_book_sf_plans', 'rec_training_family_law'] },
                    { value: 'b', text: 'We have an informal, verbal agreement.', score: 1, recs: ['rec_tool_parenting_plan_builder', 'rec_book_sf_plans'] },
                    { value: 'c', text: 'We are currently creating one.', score: 2, recs: ['rec_tool_parenting_plan_builder'] },
                    { value: 'd', text: 'Yes, a comprehensive, signed plan.', score: 4, recs: [] }
                ]
            },
             // ... Add 12 more Level 1 questions
            // Level 2: The Strategist
            {
                id: 'q16', level: 2, title: 'Information Gathering', text: 'When facing a legal or administrative challenge, what is your first step?',
                options: [
                    { value: 'a', text: 'Ask for advice on social media.', score: 1, recs: ['rec_book_goliaths_reckoning_paia', 'rec_training_constitution'] },
                    { value: 'b', text: 'Immediately hire a lawyer.', score: 2, recs: ['rec_book_goliaths_reckoning_paia'] },
                    { value: 'c', text: 'Use tools like PAIA to request official information.', score: 4, recs: ['rec_book_goliaths_reckoning_paia'] },
                    { value: 'd', text: 'I feel stuck and don\'t take any action.', score: 0, recs: ['rec_book_goliaths_reckoning_paia', 'rec_training_constitution'] }
                ]
            },
            // ... Add 14 more Level 2 questions
            // Level 3: The Legacy Builder
             {
                id: 'q31', level: 3, title: 'Knowledge Sharing', text: "How do you share your knowledge and experiences with others?",
                options: [
                    { value: 'a', text: "I keep my experiences to myself.", score: 1, recs: ['rec_community_hub'] },
                    { value: 'b', text: "I share with close friends and family.", score: 2, recs: ['rec_community_hub'] },
                    { value: 'c', text: "I actively participate in community groups or forums.", score: 4, recs: [] },
                    { value: 'd', text: "I'm interested in mentoring but don't know where to start.", score: 3, recs: ['rec_community_hub', 'rec_book_homeschooling_father'] }
                ]
            },
            // ... Add 14 more Level 3 questions
        ],
        recommendations: {
            'rec_constitution_law': { type: 'Training', title: 'Constitution Champions', desc: 'Understand the supreme law of the land and how to use it to protect your rights.', link: 'training/course-constitution.html' },
            'rec_training_family_law': { type: 'Training', title: 'Family Law Navigator', desc: 'Get a clear overview of the Children\'s Act and other key family legislation.', link: 'training/course-family-law.html' },
            'rec_training_coparenting': { type: 'Training', title: 'Co-Parenting 101', desc: 'Learn effective communication and conflict resolution strategies.', link: 'training/course-coparenting.html' },
            'rec_community_hub': { type: 'Tool', title: 'Community Hub', desc: 'Connect with other fathers, share experiences, and find solidarity.', link: 'community.html' },
            'rec_tool_parenting_plan_builder': { type: 'Tool', title: 'Parenting Plan Builder', desc: 'Create a comprehensive, fair, and legally-sound parenting plan step-by-step.', link: 'parenting-plan.html' },
            'rec_tool_comm_plan': { type: 'Tool', title: 'Communication Plan Template', desc: 'Establish clear, respectful communication protocols with your co-parent.', link: 'tools.html' }, // Assuming it's on the tools page
            'rec_tool_conflict_worksheet': { type: 'Tool', title: 'Conflict Resolution Worksheet', desc: 'A structured guide to work through disagreements productively.', link: 'tools.html' },
            'rec_book_goliaths_reckoning': { type: 'Book', title: "Goliath's Reckoning", justification: "To counter incorrect information, your journey must start with the supreme law. In this book, I explain how understanding that you are equal before the law is the first and most powerful step (see Chapter 6, 'The Compass in the Labyrinth').", link: 'publications.html' },
            'rec_book_goliaths_reckoning_paia': { type: 'Book', title: "Goliath's Reckoning", justification: "To hold institutions accountable, you must know how to get information. I detail the use of the Promotion of Access to Information Act (PAIA) as a powerful tool for any citizen (see Chapter 18, 'Managing Expectations and Holding Entities Accountable').", link: 'publications.html' },
            'rec_book_sf_plans': { type: 'Book', title: "Safety First: The Essentials of OHS Plans", justification: "An unwritten plan invites conflict. In this book, I outline how critical documented procedures are for avoiding disaster (see Chapter 4, 'Process Steps for Compilation of the OHS Plan'). The same logic applies to creating a solid parenting plan.", link: 'publications.html' },
            'rec_book_homeschooling_father': { type: 'Book', title: "The Homeschooling Father", justification: "Building a legacy involves passing on knowledge. This book explores how to take charge of your child's education and values, a key part of mentorship (see Part 5, 'Informal Knowledge, Unarticulated Wisdom').", link: 'publications.html' },
        }
    };
    
    // --- STATE ---
    let state = {
        currentQuestionIndex: 0,
        answers: {},
        score: 0,
        levelScores: { 1: 0, 2: 0, 3: 0 },
        levelComplete: false,
    };

    // --- FUNCTIONS ---
    
    function startAssessment() {
        state.currentQuestionIndex = 0;
        elements.startScreen.classList.remove('active');
        elements.questionScreen.classList.add('active');
        elements.navigationControls.classList.remove('hidden');
        renderQuestion();
    }

    function renderQuestion() {
        const question = dbData.questions[state.currentQuestionIndex];
        elements.questionTitle.textContent = `Level ${question.level}: ${question.title}`;
        elements.questionText.textContent = question.text;
        elements.questionCounter.textContent = `${state.currentQuestionIndex + 1} / ${dbData.questions.length}`;
        elements.optionsContainer.innerHTML = '';
        
        question.options.forEach(opt => {
            const button = document.createElement('button');
            button.className = 'option-button text-left w-full p-4 bg-gray-700 border-2 border-gray-600 rounded-lg hover:bg-gray-600';
            button.textContent = opt.text;
            button.dataset.value = opt.value;
            button.dataset.score = opt.score;
            
            // Check if this option was previously selected
            if (state.answers[question.id] === opt.value) {
                button.classList.add('selected');
            }

            button.addEventListener('click', () => selectAnswer(question.id, opt.value, opt.score, opt.recs));
            elements.optionsContainer.appendChild(button);
        });
        
        updateProgressBar();
        updateNavButtons();
    }

    function selectAnswer(qid, value, score, recs) {
        state.answers[qid] = value;
        
        // Visually update selected button
        const options = elements.optionsContainer.querySelectorAll('.option-button');
        options.forEach(btn => {
            btn.classList.toggle('selected', btn.dataset.value === value);
        });

        // Auto-advance after a short delay
        setTimeout(() => {
            changeStep('next');
        }, 300);
    }
    
    function changeStep(direction) {
        const prevIndex = state.currentQuestionIndex;
        const prevLevel = dbData.questions[prevIndex]?.level;

        if (direction === 'next') {
            if (state.currentQuestionIndex < dbData.questions.length - 1) {
                state.currentQuestionIndex++;
            } else {
                showFinalResults();
                return;
            }
        } else { // prev
            if (state.currentQuestionIndex > 0) {
                state.currentQuestionIndex--;
            }
        }

        const newLevel = dbData.questions[state.currentQuestionIndex].level;
        
        // Check for level completion
        if (newLevel > prevLevel) {
            showLevelCertificate(prevLevel);
        } else {
            renderQuestion();
        }
    }
    
    function updateProgressBar() {
        const progress = ((state.currentQuestionIndex + 1) / dbData.questions.length) * 100;
        elements.progressBarInner.style.width = `${progress}%`;
    }

    function updateNavButtons() {
        elements.backBtn.disabled = state.currentQuestionIndex === 0;
        elements.backBtn.style.opacity = state.currentQuestionIndex === 0 ? '0.5' : '1';
    }

    function showLevelCertificate(level) {
        const userName = auth.currentUser?.displayName || 'Tata';
        elements.certificateModalContent.innerHTML = `
            <div class="p-6 text-center">
                <i class="fas fa-award text-7xl text-yellow-400 mb-4"></i>
                <h2 class="text-3xl font-bold text-white font-roboto-slab">Level ${level} Complete!</h2>
                <p class="text-yellow-400 font-semibold text-xl my-2">iSazisi sikaTata – Foundation Builder Award</p>
                <p class="text-lg mt-4">This is proudly awarded to:</p>
                <p class="text-3xl font-bold my-4">${userName}</p>
                <p class="text-gray-400">For taking the foundational steps on your journey to empowerment. Your commitment is the bedrock of a powerful legacy.</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://flamea.org/assessment?level=${level}" alt="Verification QR Code" class="mx-auto my-4 rounded-lg">
                <p class="text-xs text-gray-500">${auth.currentUser ? 'This award is saved to your profile.' : 'Register for free to save your awards!'}</p>
                <div class="mt-6 flex justify-center gap-4">
                    <button id="continue-assessment-btn" class="bg-green-600 text-white font-bold py-2 px-8 rounded-lg">Continue</button>
                    <button id="view-report-btn" class="bg-gray-600 text-white font-bold py-2 px-8 rounded-lg">Get Report</button>
                </div>
            </div>`;
        elements.certificateModal.classList.remove('hidden');

        document.getElementById('continue-assessment-btn').addEventListener('click', () => {
            elements.certificateModal.classList.add('hidden');
            renderQuestion();
        });
        document.getElementById('view-report-btn').addEventListener('click', () => {
             elements.certificateModal.classList.add('hidden');
             showFinalResults();
        });
    }

    function showFinalResults() {
        // Final score calculation
        state.score = 0;
        dbData.questions.forEach(q => {
            if (state.answers[q.id]) {
                const selectedOption = q.options.find(o => o.value === state.answers[q.id]);
                state.score += selectedOption ? selectedOption.score : 0;
            }
        });
        
        let scorePercentage = (state.score / (dbData.questions.length * 4)) * 100;
        let summaryTitle = '';
        if (scorePercentage >= 80) summaryTitle = "Legacy Builder";
        else if (scorePercentage >= 50) summaryTitle = "Dedicated Strategist";
        else summaryTitle = "Foundation Builder";

        elements.resultsSummary.innerHTML = `
            <p class="text-lg text-gray-400">Your Score:</p>
            <p class="text-6xl font-bold text-green-400 my-2">${state.score}</p>
            <p class="text-2xl font-semibold text-white">You are a ${summaryTitle}</p>
        `;

        // Generate recommendations
        const uniqueRecs = new Set();
        Object.keys(state.answers).forEach(qid => {
            const question = dbData.questions.find(q => q.id === qid);
            const answerValue = state.answers[qid];
            const option = question.options.find(o => o.value === answerValue);
            option?.recs?.forEach(recId => uniqueRecs.add(recId));
        });
        
        elements.recommendationsContainer.innerHTML = '<h3 class="text-2xl font-bold text-center border-b border-gray-700 pb-2 mb-4">Your Personalized Action Pack</h3>';
        if (uniqueRecs.size === 0) {
             elements.recommendationsContainer.innerHTML += '<p class="text-center text-gray-300">You have a strong foundation. Continue exploring the platform to deepen your knowledge.</p>';
        } else {
            uniqueRecs.forEach(recId => {
                const rec = dbData.recommendations[recId];
                if(rec) {
                    const recCard = document.createElement('div');
                    recCard.className = 'bg-gray-900 p-4 rounded-lg border border-gray-700';
                    recCard.innerHTML = `
                        <div class="flex items-start gap-4">
                            <i class="fas ${rec.type === 'Book' ? 'fa-book-open' : (rec.type === 'Tool' ? 'fa-tools' : 'fa-chalkboard-teacher')} text-2xl text-green-400 mt-1"></i>
                            <div>
                                <h4 class="font-bold text-white">${rec.title}</h4>
                                <span class="text-xs font-semibold uppercase text-gray-500">${rec.type}</span>
                                <p class="text-sm text-gray-300 mt-2">${rec.desc || rec.justification}</p>
                                <a href="${rec.link}" class="text-sm font-bold text-green-400 hover:underline mt-2 inline-block">Access Resource &rarr;</a>
                            </div>
                        </div>
                    `;
                    elements.recommendationsContainer.appendChild(recCard);
                }
            });
        }

        elements.questionScreen.classList.remove('active');
        elements.resultsScreen.classList.add('active');
        elements.navigationControls.classList.add('hidden');
    }

    // --- INIT ---
    elements.startBtn.addEventListener('click', startAssessment);
    elements.backBtn.addEventListener('click', () => changeStep('prev'));
    elements.nextBtn.addEventListener('click', () => changeStep('next'));
    elements.certificateModal.addEventListener('click', (e) => {
        if(e.target === elements.certificateModal) {
            elements.certificateModal.classList.add('hidden');
            renderQuestion();
        }
    });
});
