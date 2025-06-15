/**
 * Flamea.org - Goliath's Reckoning Game Logic (V2)
 * This is the full implementation of the flagship game, adhering to the principles of depth and scope.
 * - Imports questions from new-questions-database.js
 * - Implements avatar selection, difficulty levels, and progression.
 * - Manages the game state, including score, lives, levels, and sudden death.
 */

import { newQuestionBank } from './new-questions-database.js';
import { AvatarSystem } from './avatar-system.js';

document.addEventListener('DOMContentLoaded', () => {

    class GoliathsReckoning {
        constructor() {
            this.setupDOMReferences();
            this.goliathData = this.setupGoliaths();
            this.avatarSystem = new AvatarSystem();
            this.gameState = {}; // Initialize empty, to be set in init()
            this.suddenDeathState = {}; // Initialize empty

            this.init();
        }

        setupDOMReferences() {
            // Screens
            this.startScreen = document.getElementById('start-screen');
            this.gameScreen = document.getElementById('game-screen');
            this.gameOverScreen = document.getElementById('game-over-screen');
            
            // Start Screen elements
            this.avatarSelectionContainer = document.getElementById('avatar-selection');
            this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
            this.startGameBtn = document.getElementById('start-game-btn');

            // HUD elements
            this.playerAvatarHud = document.getElementById('player-avatar-hud');
            this.livesContainer = document.getElementById('lives-container');
            this.scoreDisplay = document.getElementById('score-display');
            this.levelProgressBar = document.getElementById('level-progress-bar');
            this.levelText = document.getElementById('level-text');

            // Battlefield elements
            this.goliathImage = document.getElementById('goliath-image');
            this.goliathName = document.getElementById('goliath-name');

            // Question Panel elements
            this.questionCounterEl = document.getElementById('question-counter');
            this.questionTextEl = document.getElementById('question-text-title');
            this.optionsContainer = document.getElementById('options-container');

            // Modal elements
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

            // Button elements
            this.quitBtn = document.getElementById('quit-btn');
            this.resumeGameBtn = document.getElementById('resume-game-btn');
            this.confirmQuitBtn = document.getElementById('confirm-quit-btn');
            this.restartGameBtn = document.getElementById('restart-game-btn');
            
            // End screen elements
            this.endTitle = document.getElementById('end-title');
            this.endMessage = document.getElementById('end-message');
            this.finalScore = document.getElementById('final-score');
        }

        init() {
            this.populateAvatars();
            this.addEventListeners();
            this.resetGameState();
        }

        resetGameState() {
            this.gameState = {
                selectedAvatar: null,
                difficulty: null,
                score: 0,
                lives: 3,
                currentLevel: 1,
                maxLevels: 0,
                questionIndexInLevel: 0,
                totalQuestionsInLevel: 5, // Questions to defeat one Goliath
                questionsAnsweredTotal: 0,
                currentQuestion: null,
                shuffledQuestions: [],
            };
            this.suddenDeathState = { isActive: false, timer: 30, timerId: null };

            // Reset UI
            this.startScreen.classList.remove('hidden');
            this.gameScreen.classList.add('hidden');
            this.gameOverScreen.classList.add('hidden');
            this.difficultyButtons.forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
            this.startGameBtn.disabled = true;
        }

        setupGoliaths() {
            return {
                1: { name: 'Doubt', image: 'https://placehold.co/400x400/2c0b0e/ffcccc?text=Doubt' },
                2: { name: 'Apathy', image: 'https://placehold.co/400x400/0b2c2c/ccffff?text=Apathy' },
                3: { name: 'Injustice', image: 'https://placehold.co/400x400/2c1f0b/ffebcc?text=Injustice' },
                4: { name: 'Deceit', image: 'https://placehold.co/400x400/1e2c0b/d6ffcc?text=Deceit' },
                5: { name: 'Corruption', image: 'https://placehold.co/400x400/2c0b2a/f5ccff?text=Corruption' },
                6: { name: 'Fear', image: 'https://placehold.co/400x400/3d0000/ff7d7d?text=Fear' },
                7: { name: 'Ignorance', image: 'https://placehold.co/400x400/3d3d3d/ffffff?text=Ignorance' },
                8: { name: 'Bureaucracy', image: 'https://placehold.co/400x400/3d2b00/fff5d4?text=Bureaucracy' },
                9: { name: 'Oppression', image: 'https://placehold.co/400x400/001a3d/d4e8ff?text=Oppression' },
                10: { name: 'The System', image: 'https://placehold.co/400x400/000000/ff0000?text=The+System' }
            };
        }
        
        populateAvatars() {
            this.avatarSelectionContainer.innerHTML = '';
            for (const key in this.avatarSystem.avatars) {
                const avatar = this.avatarSystem.avatars[key];
                const card = document.createElement('div');
                card.className = 'avatar-card bg-gray-800 rounded-lg p-2 cursor-pointer';
                card.dataset.avatarKey = key;
                card.innerHTML = `<div class="w-full h-24 flex items-center justify-center">${avatar.svgCode}</div><p class="text-center text-sm mt-2 font-bold">${avatar.name}</p>`;
                this.avatarSelectionContainer.appendChild(card);
            }
        }

        addEventListeners() {
            this.avatarSelectionContainer.addEventListener('click', (e) => {
                const card = e.target.closest('.avatar-card');
                if (!card) return;
                document.querySelectorAll('.avatar-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.gameState.selectedAvatar = card.dataset.avatarKey;
                this.checkCanStart();
            });

            this.difficultyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.difficultyButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.gameState.difficulty = btn.dataset.difficulty;
                    this.checkCanStart();
                });
            });

            this.startGameBtn.addEventListener('click', () => this.startGame());
            this.continueBtn.addEventListener('click', () => this.nextQuestion());
            this.quitBtn.addEventListener('click', () => this.quitModal.classList.remove('hidden'));
            this.resumeGameBtn.addEventListener('click', () => this.quitModal.classList.add('hidden'));
            this.confirmQuitBtn.addEventListener('click', () => this.resetGameState());
            this.restartGameBtn.addEventListener('click', () => this.resetGameState());
        }
        
        checkCanStart() {
            if (this.gameState.selectedAvatar && this.gameState.difficulty) {
                this.startGameBtn.disabled = false;
            }
        }

        startGame() {
            const levelLimits = { easy: 3, medium: 7, hard: 10 };
            this.gameState.maxLevels = levelLimits[this.gameState.difficulty];
            
            const availableQuestions = newQuestionBank.filter(q => q.level <= this.gameState.maxLevels);
            this.gameState.shuffledQuestions = this.shuffleArray(availableQuestions);

            this.startScreen.classList.add('hidden');
            this.gameScreen.classList.remove('hidden');

            this.updateHUD();
            this.updateGoliath();
            this.loadQuestion();
        }

        updateHUD() {
            this.scoreDisplay.textContent = `Score: ${this.gameState.score}`;
            this.playerAvatarHud.innerHTML = this.avatarSystem.avatars[this.gameState.selectedAvatar].svgCode;
            this.livesContainer.innerHTML = '❤️'.repeat(this.gameState.lives);
            
            const goliathHealth = 100 - (this.gameState.questionIndexInLevel / this.gameState.totalQuestionsInLevel * 100);
            this.levelProgressBar.style.width = `${goliathHealth}%`;
        }
        
        updateGoliath() {
            const level = this.gameState.currentLevel;
            const goliath = this.goliathData[level];
            this.goliathImage.src = goliath.image;
            this.goliathName.textContent = `The Goliath of ${goliath.name}`;
            this.levelText.textContent = `Level ${level}`;
        }

        loadQuestion() {
            if (this.gameState.shuffledQuestions.length === 0) {
                this.endGame(true); // Win condition
                return;
            }
            
            this.gameState.currentQuestion = this.gameState.shuffledQuestions.shift();
            this.questionCounterEl.textContent = `Question ${this.gameState.questionsAnsweredTotal + 1}`;
            this.questionTextEl.textContent = this.gameState.currentQuestion.question;
            
            this.optionsContainer.innerHTML = '';
            const shuffledOptions = this.shuffleArray([...this.gameState.currentQuestion.options]);
            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.className = "option-btn w-full text-left p-4 rounded-lg";
                button.innerHTML = option;
                button.addEventListener('click', () => this.handleAnswer(option, button));
                this.optionsContainer.appendChild(button);
            });
        }

        handleAnswer(selectedOption, button) {
            this.optionsContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
            
            const isCorrect = selectedOption === this.gameState.currentQuestion.answer;
            
            if (isCorrect) {
                this.gameState.score += 10;
                button.classList.add('correct');
            } else {
                this.gameState.lives--;
                button.classList.add('wrong');
                const correctButton = Array.from(this.optionsContainer.querySelectorAll('button')).find(btn => btn.textContent === this.gameState.currentQuestion.answer);
                if (correctButton) correctButton.classList.add('correct');
                this.gameScreen.classList.add('shake-animation');
                setTimeout(() => this.gameScreen.classList.remove('shake-animation'), 500);
            }

            this.updateHUD();
            this.showFeedback(isCorrect);
            
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

            this.sourceLinksContainer.innerHTML = ''; // Populate links as before if needed

            setTimeout(() => this.feedbackModal.classList.remove('hidden'), 500);
        }

        nextQuestion() {
            this.feedbackModal.classList.add('hidden');
            this.gameState.questionsAnsweredTotal++;
            this.gameState.questionIndexInLevel++;
            
            if (this.gameState.questionIndexInLevel >= this.gameState.totalQuestionsInLevel) {
                this.levelUp();
            } else {
                this.loadQuestion();
            }
            this.updateHUD();
        }

        levelUp() {
            if(this.gameState.currentLevel >= this.gameState.maxLevels) {
                this.endGame(true); // Beat the final boss for the selected difficulty
                return;
            }
            this.gameState.currentLevel++;
            this.gameState.questionIndexInLevel = 0;
            this.updateGoliath();
            this.loadQuestion();
        }

        endGame(isWin) {
            this.gameScreen.classList.add('hidden');
            this.feedbackModal.classList.add('hidden');
            this.gameOverScreen.classList.remove('hidden');
            
            if (isWin) {
                this.endTitle.textContent = "Victory!";
                this.endTitle.className = "game-title text-8xl text-amber-400";
                this.endMessage.textContent = "You have defeated the Goliaths and stood for truth!";
            } else {
                this.endTitle.textContent = "Game Over";
                this.endTitle.className = "game-title text-8xl text-red-500";
                this.endMessage.textContent = "The gauntlet has bested you. Rise and fight again!";
            }
            this.finalScore.textContent = this.gameState.score;
        }

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    }

    new GoliathsReckoning();
});
