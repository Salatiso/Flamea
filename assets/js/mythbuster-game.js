document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gameContainer = document.getElementById('game-container');
    const startScreen = document.getElementById('start-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const livesContainer = document.getElementById('lives-container');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const achievementsList = document.getElementById('achievements-list');
    const questionNumberEl = document.getElementById('question-number');
    const questionTitleEl = document.getElementById('question-title');
    const questionTextEl = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const backBtn = document.getElementById('back-btn');
    const quitBtn = document.getElementById('quit-btn');
    const forwardBtn = document.getElementById('forward-btn');
    
    // Modals
    const feedbackModal = document.getElementById('feedback-modal');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const sourceContainer = document.getElementById('source-container');
    const continueBtn = document.getElementById('continue-btn');

    const bookModal = document.getElementById('book-modal');
    const bookModalTitle = document.getElementById('book-modal-title');
    const bookModalExcerpt = document.getElementById('book-modal-excerpt');
    const bookModalLink = document.getElementById('book-modal-link');
    const closeBookModalBtn = document.getElementById('close-book-modal');

    const quitModal = document.getElementById('quit-modal');
    const resumeBtn = document.getElementById('resume-btn');
    const confirmQuitBtn = document.getElementById('confirm-quit-btn');

    // --- Game State ---
    let questions = [];
    let currentQuestionIndex = 0;
    let lives = 3;
    let correctAnswersCount = 0;
    let questionHistory = [];
    let achievements = [
        { name: "Truth Seeker", threshold: 15, unlocked: false },
        { name: "Fact Finder", threshold: 30, unlocked: false },
        { name: "Myth Slayer", threshold: 45, unlocked: false },
        { name: "Boyhood Champion", threshold: 60, unlocked: false },
        { name: "Fatherhood Guardian", threshold: 80, unlocked: false },
        { name: "Legacy Builder", threshold: 100, unlocked: false },
    ];
    const TOTAL_QUESTIONS = 100;

    // --- Questions Database ---
    // Expanded to include detailed source info and excerpts
    const allQuestions = [
        // Set 1
        {
            questionText: "Myth: Partner violence is almost always committed by men, making them inherently more violent.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "This is a harmful oversimplification. Studies, including those in the Journal of Interpersonal Violence, show that women perpetrate physical aggression in relationships at comparable rates. Some research indicates the highest rates of reciprocal violence are in lesbian relationships, challenging the narrative that male presence is the primary driver of domestic conflict. The focus should be on violence itself, not on gendering the issue.",
            source: {
                type: 'web',
                title: "Journal of Interpersonal Violence",
                link: "https://journals.sagepub.com/home/jiv"
            }
        },
        {
            questionText: "Myth: The nuclear family (mother, father, children) is the most resilient and ideal structure for raising children.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "While common, the isolated nuclear family can be fragile due to 'single points of failure.' Historically, the extended family provided a robust support network, offering more resilience against crises like the death of a parent. This is a core theme in 'The Homeschooling Father,' which argues that community and extended kin are vital for a child's development, a truth often overlooked by modern social structures.",
            source: {
                type: 'book',
                title: "The Homeschooling Father",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE", // Replace with actual ID
                excerpt: "We cannot ignore the many cases where stepchildren have been treated significantly worse than others. When this occurs away from the child's blood relatives, it can continue without stopping and lead to tragic consequences... In recent years, my mother has felt the need to apologize for how strict she was after my father died... I am deeply appreciative of the resilience she demonstrated in the face of overwhelming obstacles."
            }
        },
        {
            questionText: "Myth: South African law protects girls from harmful traditional circumcision but not boys because male circumcision is inherently safe.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "This is false and highlights a severe gender disparity. Annually, scores of boys die from botched traditional circumcisions in South Africa. The lack of equivalent legal protection for boys, compared to the strong legislation against FGM, raises serious questions about the principle of equal protection under the law and reveals a systemic blind spot towards the health and safety of boys.",
            source: {
                type: 'web',
                title: "CRL Rights Commission Reports on Initiation Deaths",
                link: "https://www.crlcommission.org.za/reports.html"
            }
        },
        {
            questionText: "Myth: 'Women's Empowerment' programs are always justified because men have historically benefited from patriarchy at women's expense.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "This narrative is flawed. It ignores the historical burdens on men, such as the migrant labor system which separated them from families, and misinterprets roles like the Xhosa 'successor' ('indlalifa') as a benefit when it is a profound duty. The book 'Beyond Redress' critiques these one-sided historical premises, arguing for policies based on current realities, not collective historical guilt.",
            source: {
                type: 'book',
                title: "Beyond Redress",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE", // Replace with actual ID
                excerpt: "In advocating for the superiority of the best interests of the child principle over redress provisions, this book emphasises the far-reaching impact of policy decisions on children. It argues that when state-sanctioned discrimination disadvantages a parent, it inherently disadvantages the child as well."
            }
        },
        {
            questionText: "SUPER QUESTION: Myth: Redress policies like Affirmative Action are morally just because they correct the wrongs of apartheid by punishing those who benefited.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: true,
            explanation: "This is a dangerous and illogical premise. As argued in 'The Homeschooling Father', applying collective punishment is immoral. If all white people are held responsible for apartheid, then by the same logic, all black people could be held responsible for the current government's failures. True justice judges individuals on their actions, not their immutable characteristics.",
            source: {
                type: 'book',
                title: "The Homeschooling Father",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE", // Replace with actual ID
                excerpt: "Then there’s affirmative action, the policy that justifies discrimination on the bases of race & sex, consequently protecting a majority, against a minority! This policy believes that because some individuals of a particular race or sex have committed injustices against certain individuals of another race or sex, everyone belonging to the same race or sex as the wrongdoers is held responsible for their actions... If you believe in penalizing every white person for the actions of a few... then it is only fair for you, as a black person, to also accept responsibility for all the corruption within the ANC."
            }
        },
        // More questions will be added here to reach 100
        {
            questionText: "Myth: Men are naturally less nurturing, making women the default superior parent, especially for young children.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "This is a debunked stereotype rooted in the outdated 'Tender Years Doctrine.' Modern psychology confirms that parenting quality is determined by involvement, sensitivity, and love—traits not tied to gender. 'Goliath's Reckoning' exposes how this bias persists in family courts, unfairly disadvantaging fathers and harming children by denying them a meaningful relationship with both parents.",
            source: {
                type: 'book',
                title: "Goliath's Reckoning",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE",
                excerpt: "The court assumes you’re less capable because you’re a man... The judge nods but says, 'Men don’t nurture like women do.' Your rebuttal? This is the core of the discrimination fathers face."
            }
        },
        {
            questionText: "Myth: Formal schooling is the single most important factor for a child's success in life.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "False. Decades of research, including the landmark Coleman Report, show that family background and parental involvement are far more influential than the quality of the school itself. 'The Homeschooling Father' argues that a stable, loving home can overcome the deficits of a poor school, while a good school often cannot fix the damage from a broken home.",
            source: {
                type: 'book',
                title: "The Homeschooling Father",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE",
                excerpt: "The accomplishments that individuals achieve in adulthood are as varied as the distinctiveness of families. If the formal education system fails to make a significant impact on the successful outcomes individuals achieve as adults, how can we reasonably claim that it is a universal solution for everyone?"
            }
        },
         {
            questionText: "Myth: A child taking the father's surname is a simple tradition with no deeper meaning.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "Genetically, a child is an equal product of both parents. The mother provides the X chromosome and the crucial mitochondrial DNA, a direct link to the original ancestral mother. The father provides the Y chromosome, passed directly from the original ancestral father. The emphasis on the paternal surname is a cultural construct, not a biological one.",
            source: {
                type: 'book',
                title: "Beyond the Grave: A Son's Journey",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE",
                excerpt: "Biologically, I can trace myself to the first man through the Y chromosome passed to me by my father... Similarly, within me, I carry my mitochondrial DNA, my direct link to my ancestral mother, without whom I wouldn’t be."
            }
        },
        {
            questionText: "Myth: The high rate of unemployment in South Africa is solely due to a poor economy, not the education system.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: false,
            explanation: "This is a dangerous oversimplification. While the economy is a factor, the education system produces graduates who lack practical skills. 'The Homeschooling Father' notes the irony of having the most 'schooled' generation in history facing the highest unemployment, suggesting the system creates dependency rather than self-sufficiency.",
            source: {
                 type: 'book',
                title: "The Homeschooling Father",
                link: "https://play.google.com/store/books/details?id=YOUR_BOOK_ID_HERE",
                excerpt: "No generation in this country has received as much formal education as the post-1994 generation. How is the formal schooling system doing...? Unemployment is at its highest level, surpassing the levels seen before 1994."
            }
        },
        {
            questionText: "SUPER QUESTION: Myth: Laws are inherently moral and ethical; therefore, laws that permit discrimination for 'redress' must be just.",
            options: ["True", "False"],
            correctAnswerIndex: 1,
            isSuperQuestion: true,
            explanation: "This is fundamentally untrue. History is filled with immoral laws, from Apartheid legislation to the laws of Nazi Germany. Morality dictates that judging a person on immutable characteristics like race or gender is never ethical, regardless of the justification. A law's existence does not make it righteous; its impact on individual dignity and equality does.",
            source: {
                type: 'web',
                title: "Philosophical studies on Law and Morality (e.g., Hart–Fuller debate)",
                link: "https://en.wikipedia.org/wiki/Hart%E2%80%93Fuller_debate"
            }
        },
        // ... (Will add more questions to reach 100)
    ];
    
    // --- Game Initialization ---
    function initializeGame() {
        questions = allQuestions.slice(0, TOTAL_QUESTIONS); // Use the first 100 for now
        currentQuestionIndex = 0;
        lives = 3;
        correctAnswersCount = 0;
        questionHistory = [];
        achievements.forEach(a => a.unlocked = false);
        
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        gameContainer.classList.add('grid');
        
        updateDashboard();
        renderQuestion();
    }
    
    // --- UI Rendering ---
    function renderQuestion() {
        if (currentQuestionIndex >= questions.length || lives <= 0) {
            endGame();
            return;
        }

        const q = questions[currentQuestionIndex];
        questionHistory.push(currentQuestionIndex);
        
        questionNumberEl.textContent = `${currentQuestionIndex + 1}`;
        questionTextEl.textContent = q.questionText;

        if (q.isSuperQuestion) {
            questionTitleEl.innerHTML = `<i class="fas fa-star text-red-500"></i> SUPER QUESTION <i class="fas fa-star text-red-500"></i>`;
            questionTitleEl.classList.add('super-question-title');
        } else {
            questionTitleEl.textContent = `Question ${currentQuestionIndex + 1}`;
            questionTitleEl.classList.remove('super-question-title');
        }

        optionsContainer.innerHTML = '';
        const trueBtn = document.createElement('button');
        trueBtn.textContent = 'TRUE';
        trueBtn.className = 'w-full md:w-1/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform hover:scale-105';
        trueBtn.onclick = () => handleAnswer(0);
        
        const falseBtn = document.createElement('button');
        falseBtn.textContent = 'FALSE';
        falseBtn.className = 'w-full md:w-1/3 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-transform hover:scale-105';
        falseBtn.onclick = () => handleAnswer(1);
        
        optionsContainer.appendChild(trueBtn);
        optionsContainer.appendChild(falseBtn);

        backBtn.disabled = questionHistory.length <= 1;
        forwardBtn.disabled = true; // Disable until answer is given
    }

    function updateDashboard() {
        // Update lives
        livesContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('i');
            heart.className = 'fas fa-heart transition-all duration-300';
            if (i < lives) {
                heart.classList.add('text-red-500');
            } else {
                heart.classList.add('text-gray-600');
            }
            livesContainer.appendChild(heart);
        }

        // Update progress bar
        const nextAchievement = achievements.find(a => !a.unlocked);
        if (nextAchievement) {
            const progressPercentage = (correctAnswersCount / nextAchievement.threshold) * 100;
            progressBar.style.width = `${Math.min(progressPercentage, 100)}%`;
            progressText.textContent = `${correctAnswersCount} / ${nextAchievement.threshold} Questions`;
        } else {
             progressBar.style.width = '100%';
             progressText.textContent = 'All Milestones Reached!';
        }

        // Update achievements list
        achievements.forEach(ach => {
            const el = achievementsList.querySelector(`[data-achievement="${ach.name}"]`);
            if (ach.unlocked) {
                el.classList.remove('text-gray-500');
                el.classList.add('text-amber-400', 'font-bold');
            } else {
                 el.classList.add('text-gray-500');
                 el.classList.remove('text-amber-400', 'font-bold');
            }
        });
    }

    // --- Game Logic ---
    function handleAnswer(selectedIndex) {
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctAnswerIndex;

        if (isCorrect) {
            correctAnswersCount++;
            if (question.isSuperQuestion) {
                lives = Math.min(6, lives + 3); // Max 6 lives
            }
        } else {
            if (question.isSuperQuestion) {
                lives -= 3;
            } else {
                lives--;
            }
            const hearts = livesContainer.querySelectorAll('.fa-heart');
            if (hearts[lives]) hearts[lives].classList.add('lost');
        }
        
        forwardBtn.disabled = false;
        optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        
        updateDashboard();
        checkAchievements();
        showFeedback(question, isCorrect);
    }

    function showFeedback(question, isCorrect) {
        if (isCorrect) {
            feedbackTitle.textContent = "CORRECT!";
            feedbackTitle.className = 'text-4xl font-bold mb-4 text-center text-green-400';
        } else {
            feedbackTitle.textContent = "INCORRECT";
            feedbackTitle.className = 'text-4xl font-bold mb-4 text-center text-red-400';
        }
        feedbackExplanation.innerHTML = question.explanation;
        
        // Populate source info
        sourceContainer.innerHTML = `<p class="font-bold text-gray-400">Source: <a href="${question.source.link}" target="_blank" class="text-blue-400 hover:underline">${question.source.title}</a></p>`;
        if (question.source.type === 'book') {
            const bookBtn = document.createElement('button');
            bookBtn.className = "mt-2 text-amber-400 hover:text-amber-300 font-bold underline";
            bookBtn.textContent = "View Excerpt";
            bookBtn.onclick = () => showBookExcerpt(question.source);
            sourceContainer.appendChild(bookBtn);
        }

        feedbackModal.classList.remove('hidden');
        feedbackModal.classList.add('flex');
        setTimeout(() => feedbackModal.querySelector('.modal-content').classList.add('scale-100'), 10);
    }
    
    function showBookExcerpt(source) {
        bookModalTitle.textContent = source.title;
        bookModalExcerpt.textContent = `"${source.excerpt}"`;
        bookModalLink.href = source.link;
        bookModal.classList.remove('hidden');
        bookModal.classList.add('flex');
    }

    function checkAchievements() {
        achievements.forEach(ach => {
            if (correctAnswersCount >= ach.threshold && !ach.unlocked) {
                ach.unlocked = true;
                // Maybe add a small notification later
            }
        });
        updateDashboard();
    }

    function goForward() {
        feedbackModal.classList.add('hidden');
        feedbackModal.classList.remove('flex');
        
        currentQuestionIndex++;
        if (currentQuestionIndex >= questions.length || lives <= 0) {
            endGame();
        } else {
            renderQuestion();
        }
    }
    
    function goBack() {
        if (questionHistory.length > 1) {
            questionHistory.pop(); // Remove current
            currentQuestionIndex = questionHistory[questionHistory.length - 1];
            renderQuestion();
        }
    }

    function endGame() {
        gameContainer.classList.add('hidden');
        startScreen.classList.remove('hidden');
        startScreen.innerHTML = `
            <h1 class="game-title text-5xl text-amber-400 mb-4">${lives <= 0 ? 'Game Over' : 'Quest Complete!'}</h1>
            <p class="text-xl text-gray-300 mb-6">You answered ${correctAnswersCount} out of ${currentQuestionIndex} questions correctly.</p>
            <p class="text-lg text-gray-400 mb-8">${lives <= 0 ? 'You ran out of lives. But knowledge is never a loss. Re-arm and try again!' : 'You have armed yourself with truth. Continue the fight.'}</p>
            <button id="restart-game-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-2xl">Play Again</button>
        `;
        document.getElementById('restart-game-btn').addEventListener('click', initializeGame);
    }

    function quitGame() {
        window.location.reload(); // Simple reload to restart
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', initializeGame);
    continueBtn.addEventListener('click', goForward);
    forwardBtn.addEventListener('click', goForward);
    backBtn.addEventListener('click', goBack);
    
    // Modal controls
    quitBtn.addEventListener('click', () => quitModal.classList.remove('hidden'));
    resumeBtn.addEventListener('click', () => quitModal.classList.add('hidden'));
    confirmQuitBtn.addEventListener('click', quitGame);
    closeBookModalBtn.addEventListener('click', () => bookModal.classList.add('hidden'));

});
