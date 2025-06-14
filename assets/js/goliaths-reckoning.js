import { newQuestionBank } from './new-questions-database.js';

document.addEventListener('DOMContentLoaded', () => {

    class GoliathsReckoning {
        constructor() {
            // --- DOM Elements ---
            this.gameContainer = document.querySelector('.game-container');
            this.startScreen = document.getElementById('start-screen');
            this.gameScreen = document.getElementById('game-screen');
            this.gameOverScreen = document.getElementById('game-over-screen');
            
            // Start Screen
            this.avatarSelectionContainer = document.getElementById('avatar-selection');
            this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
            this.startGameBtn = document.getElementById('start-game-btn');

            // HUD
            this.playerAvatarHud = document.getElementById('player-avatar-hud');
            this.livesContainer = document.getElementById('lives-container');
            this.scoreDisplay = document.getElementById('score-display');
            this.levelProgressBar = document.getElementById('level-progress-bar');
            this.levelText = document.getElementById('level-text');

            // Battlefield
            this.goliathImage = document.getElementById('goliath-image');
            this.goliathName = document.getElementById('goliath-name');

            // Question Panel
            this.questionCounterEl = document.getElementById('question-counter');
            this.questionTextEl = document.getElementById('question-text-title');
            this.optionsContainer = document.getElementById('options-container');

            // Modals
            this.feedbackModal = document.getElementById('feedback-modal');
            this.feedbackTitle = document.getElementById('feedback-title');
            this.feedbackExplanationPrimary = document.getElementById('feedback-explanation-primary');
            this.feedbackExplanationSecondary = document.getElementById('feedback-explanation-secondary');
            this.sourceLinksContainer = document.getElementById('source-links');
            this.continueBtn = document.getElementById('continue-btn');

            this.suddenDeathModal = document.getElementById('sudden-death-modal');
            this.suddenDeathTimerEl = document.getElementById('sudden-death-timer');
            this.suddenDeathQuestionPanel = document.getElementById('sudden-death-question-panel');
            
            this.quitModal = document.getElementById('quit-modal');

            // Buttons
            this.quitBtn = document.getElementById('quit-btn');
            this.resumeGameBtn = document.getElementById('resume-game-btn');
            this.confirmQuitBtn = document.getElementById('confirm-quit-btn');
            this.restartGameBtn = document.getElementById('restart-game-btn');
            
            // --- Game State ---
            this.avatarSystem = new AvatarSystem();
            this.gameState = {
                selectedAvatar: null,
                difficulty: null,
                score: 0,
                lives: 3,
                currentLevel: 1,
                questionIndexInLevel: 0,
                totalQuestionsInLevel: 5,
                questionsAnswered: 0,
                currentQuestion: null,
                shuffledQuestions: [],
            };

            // Sudden Death State
            this.suddenDeathState = {
                isActive: false,
                timer: 30,
                timerId: null,
                questions: [],
                correctAnswers: 0,
                questionIndex: 0
            };

            this.sounds = this.setupSounds();
            this.goliathData = this.setupGoliaths();
            this.init();
        }

        init() {
            this.populateAvatars();
            this.addEventListeners();
        }

        setupSounds() {
            return {
                start: new Tone.Player("../assets/sounds/start-quest.mp3").toDestination(),
                correct: new Tone.Player("../assets/sounds/correct-sword.mp3").toDestination(),
                wrong: new Tone.Player("../assets/sounds/wrong-grunt.mp3").toDestination(),
                levelUp: new Tone.Player("../assets/sounds/level-up.mp3").toDestination(),
                gameOver: new Tone.Player("../assets/sounds/game-over.mp3").toDestination(),
                suddenDeath: new Tone.Player("../assets/sounds/sudden-death-tense.mp3").toDestination(),
            };
        }

        setupGoliaths() {
             return {
                1: { name: 'The Goliath of Doubt', image: 'https://placehold.co/400x400/2c0b0e/ffcccc?text=Doubt' },
                2: { name: 'The Goliath of Injustice', image: 'https://placehold.co/400x400/2c1f0b/ffebcc?text=Injustice' },
                3: { name: 'The Goliath of Falsehood', image: 'https://placehold.co/400x400/1e2c0b/d6ffcc?text=Falsehood' },
                4: { name: 'The Goliath of Apathy', image: 'https://placehold.co/400x400/0b2c2c/ccffff?text=Apathy' },
                5: { name: 'The Goliath of The System', image: 'https://placehold.co/400x400/2c0b2a/f5ccff?text=The+System' }
            };
        }
        
        populateAvatars() {
            this.avatarSelectionContainer.innerHTML = '';
            for (const key in this.avatarSystem.avatars) {
                const avatar = this.avatarSystem.avatars[key];
                const card = document.createElement('div');
                card.className = 'avatar-card bg-gray-800 rounded-lg p-2 cursor-pointer';
                card.dataset.avatarKey = key;
                card.innerHTML = `
                    <div class="w-full h-24 flex items-center justify-center">${avatar.svgCode}</div>
                    <p class="text-center text-sm mt-2 font-bold">${avatar.name}</p>
                `;
                this.avatarSelectionContainer.appendChild(card);
            }
        }

        addEventListeners() {
            // Avatar selection
            this.avatarSelectionContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.avatar-card');
                if (!card) return;

                document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.gameState.selectedAvatar = card.dataset.avatarKey;
                this.checkCanStart();
            });

            // Difficulty selection
            this.difficultyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.difficultyButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.gameState.difficulty = btn.dataset.difficulty;
                    this.checkCanStart();
                });
            });

            // Start Game
            this.startGameBtn.addEventListener('click', () => this.startGame());

            // Continue from feedback
            this.continueBtn.addEventListener('click', () => this.nextQuestion());

            // Quit logic
            this.quitBtn.addEventListener('click', () => this.quitModal.classList.remove('hidden'));
            this.resumeGameBtn.addEventListener('click', () => this.quitModal.classList.add('hidden'));
            this.confirmQuitBtn.addEventListener('click', () => window.location.reload());
            this.restartGameBtn.addEventListener('click', () => window.location.reload());
        }
        
        checkCanStart() {
            if (this.gameState.selectedAvatar && this.gameState.difficulty) {
                this.startGameBtn.disabled = false;
            }
        }

        startGame() {
            this.sounds.start.start();
            // 1. Reset state
            this.gameState.score = 0;
            this.gameState.lives = 3;
            this.gameState.currentLevel = 1;
            this.gameState.questionsAnswered = 0;

            // 2. Filter and shuffle questions based on difficulty
            const levelLimits = { easy: 3, medium: 7, hard: 10 };
            const maxLevel = levelLimits[this.gameState.difficulty];
            const availableQuestions = newQuestionBank.filter(q => q.level <= maxLevel);
            this.gameState.shuffledQuestions = this.shuffleArray(availableQuestions);

            // 3. Transition screens
            this.startScreen.classList.add('hidden');
            this.gameScreen.classList.remove('hidden');

            // 4. Initial UI Update
            this.updateHUD();
            this.updateGoliath();
            
            // 5. Load first question
            this.loadQuestion();
        }

        updateHUD() {
            this.scoreDisplay.textContent = `Score: ${this.gameState.score}`;
            this.playerAvatarHud.innerHTML = this.avatarSystem.avatars[this.gameState.selectedAvatar].svgCode;
            
            this.livesContainer.innerHTML = '';
            for (let i = 0; i < this.gameState.lives; i++) {
                this.livesContainer.innerHTML += '❤️';
            }
            
            const goliathHealth = 100 - (this.gameState.questionIndexInLevel / this.gameState.totalQuestionsInLevel * 100);
            this.levelProgressBar.style.width = `${goliathHealth}%`;
        }
        
        updateGoliath() {
            const level = this.gameState.currentLevel;
            const goliath = this.goliathData[level] || this.goliathData[5]; // Default to last goliath
            this.goliathImage.src = goliath.image;
            this.goliathName.textContent = goliath.name;
            this.levelText.textContent = `Level ${level}: ${goliath.name.replace('The Goliath of ', 'The Shadow of ')}`;
        }

        loadQuestion() {
            if (this.gameState.shuffledQuestions.length === 0) {
                this.endGame(true); // Win condition
                return;
            }
            
            this.gameState.currentQuestion = this.gameState.shuffledQuestions.shift();
            
            this.questionCounterEl.textContent = `Question ${this.gameState.questionsAnswered + 1}`;
            this.questionTextEl.textContent = this.gameState.currentQuestion.question;
            
            this.optionsContainer.innerHTML = '';
            const shuffledOptions = this.shuffleArray(this.gameState.currentQuestion.options);
            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.className = "option-btn w-full text-left p-4 rounded-lg bg-gray-700";
                button.innerHTML = option;
                button.addEventListener('click', () => this.handleAnswer(option, button));
                this.optionsContainer.appendChild(button);
            });
        }

        handleAnswer(selectedOption, button) {
            // Disable all buttons
            this.optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
            
            const isCorrect = selectedOption === this.gameState.currentQuestion.answer;
            
            if (isCorrect) {
                this.sounds.correct.start();
                this.gameState.score += 3;
                button.classList.add('correct');
                this.showFeedback(true);
            } else {
                this.sounds.wrong.start();
                this.gameState.lives--;
                this.gameState.score = Math.max(0, this.gameState.score - 3);
                button.classList.add('wrong');
                // Highlight the correct answer
                const correctButton = Array.from(this.optionsContainer.querySelectorAll('button')).find(btn => btn.textContent === this.gameState.currentQuestion.answer);
                if (correctButton) correctButton.classList.add('correct');
                
                this.gameScreen.classList.add('shake-animation');
                setTimeout(() => this.gameScreen.classList.remove('shake-animation'), 500);

                this.showFeedback(false);
            }

            this.updateHUD();
            
            if (this.gameState.lives <= 0) {
                setTimeout(() => this.endGame(false), 2000);
            }
        }

        showFeedback(isCorrect) {
            const q = this.gameState.currentQuestion;
            this.feedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect!';
            this.feedbackTitle.className = isCorrect ? 'text-3xl font-bold mb-4 text-green-400' : 'text-3xl font-bold mb-4 text-red-400';
            this.feedbackExplanationPrimary.textContent = q.primary_explanation;
            this.feedbackExplanationSecondary.innerHTML = q.secondary_explanation;

            // Create source links
            this.sourceLinksContainer.innerHTML = '';
            const authors = ["Thomas Sowell", "Steven Pinker", "Warren Farrell", "Salatiso Mdeni"];
            authors.forEach(author => {
                if (q.secondary_explanation.includes(author)) {
                    const link = document.createElement('a');
                    link.href = `https://www.amazon.com/s?k=${author.replace(' ', '+')}`;
                    link.target = '_blank';
                    link.className = 'px-3 py-1 bg-gray-600 text-gray-200 rounded-full text-sm hover:bg-amber-600';
                    link.textContent = `Find ${author}`;
                    this.sourceLinksContainer.appendChild(link);
                }
            });

            setTimeout(() => this.feedbackModal.classList.remove('hidden'), 500);
        }

        nextQuestion() {
            this.feedbackModal.classList.add('hidden');
            this.gameState.questionsAnswered++;
            this.gameState.questionIndexInLevel++;
            
            if (this.gameState.questionIndexInLevel >= this.gameState.totalQuestionsInLevel) {
                this.levelUp();
            } else if (this.gameState.questionsAnswered > 0 && this.gameState.questionsAnswered % 5 === 0) {
                // Super Question / Sudden Death trigger
                this.startSuddenDeath();
            }
            else {
                this.loadQuestion();
            }
            this.updateHUD();
        }

        levelUp() {
            this.sounds.levelUp.start();
            this.gameState.currentLevel++;
            this.gameState.questionIndexInLevel = 0;
            this.updateGoliath();
            this.loadQuestion();
        }
        
        startSuddenDeath() {
            // This is a simplified version; a full implementation would be more complex
            this.suddenDeathState.isActive = true;
            this.suddenDeathState.timer = 30;
            this.suddenDeathModal.classList.remove('hidden');
            this.sounds.suddenDeath.start();
            
            // For simplicity, we'll just show a countdown and then give a bonus
            this.suddenDeathState.timerId = setInterval(() => {
                this.suddenDeathState.timer--;
                this.suddenDeathTimerEl.textContent = this.suddenDeathState.timer;
                if (this.suddenDeathState.timer <= 0) {
                    clearInterval(this.suddenDeathState.timerId);
                    this.endSuddenDeath();
                }
            }, 1000);
            
            this.suddenDeathQuestionPanel.innerHTML = `<p class="text-white text-2xl epic-text">Bonus Round! +10 Points for surviving!</p>`;
        }
        
        endSuddenDeath() {
            this.suddenDeathModal.classList.add('hidden');
            this.sounds.suddenDeath.stop();
            this.gameState.score += 10; // Simple bonus
            this.suddenDeathState.isActive = false;
            this.loadQuestion();
            this.updateHUD();
        }


        endGame(isWin) {
            this.gameScreen.classList.add('hidden');
            this.gameOverScreen.classList.remove('hidden');
            
            const endTitle = document.getElementById('end-title');
            const endMessage = document.getElementById('end-message');
            const finalScore = document.getElementById('final-score');

            if (isWin) {
                endTitle.textContent = "Victory!";
                endTitle.className = "game-title text-8xl text-amber-400";
                endMessage.textContent = "You have defeated all Goliaths and stood for truth!";
            } else {
                this.sounds.gameOver.start();
                endTitle.textContent = "Game Over";
                endTitle.className = "game-title text-8xl text-red-500";
                endMessage.textContent = "The gauntlet has bested you. Rise and fight again!";
            }
            finalScore.textContent = this.gameState.score;
        }

        // --- Utility Functions ---
        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    // --- Instantiate the Game ---
    new GoliathsReckoning();
});
