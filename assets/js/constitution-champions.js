// assets/js/constitution-champions.js
class ConstitutionChampions {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.maxLevel = 12;
        this.avatarSystem = new AvatarSystem();
        this.gameData = this.initializeGameData();
        this.userProgress = null;
        
        this.init();
    }

    initializeGameData() {
        return {
            levels: [
                // Ages 4-6: Basic Concepts
                {
                    id: 1,
                    title: "Everyone is Equal! 👫",
                    type: "drag-drop",
                    ageGroup: "4-6",
                    instruction: "Help put these friends together! Everyone should be treated the same.",
                    items: [
                        { id: "boy", text: "Boy 👦", category: "people" },
                        { id: "girl", text: "Girl 👧", category: "people" },
                        { id: "man", text: "Man 👨", category: "people" },
                        { id: "woman", text: "Woman 👩", category: "people" }
                    ],
                    dropZones: [
                        { id: "equal-zone", title: "Everyone is Equal Zone", accepts: ["people"] }
                    ],
                    educationalNote: "The Constitution says ALL people are equal and should be treated fairly! 🇿🇦"
                },
                
                {
                    id: 2,
                    title: "Children Have Special Rights! 👶",
                    type: "quiz",
                    ageGroup: "4-6",
                    question: "What do all children need to be happy and safe?",
                    options: [
                        { text: "Love and care ❤️", correct: true, feedback: "Yes! All children need love and care!" },
                        { text: "Only toys 🧸", correct: false, feedback: "Toys are fun, but children need more than toys!" },
                        { text: "Nothing special 😐", correct: false, feedback: "Children are special and need special care!" }
                    ]
                },

                // Ages 7-9: Bill of Rights Introduction
                {
                    id: 3,
                    title: "The Bill of Rights Helper 📜",
                    type: "matching",
                    ageGroup: "7-9",
                    instruction: "Match each right with its meaning!",
                    pairs: [
                        { right: "Freedom of Speech 🗣️", meaning: "You can say what you think (nicely!)" },
                        { right: "Right to Education 📚", meaning: "Every child can go to school" },
                        { right: "Right to Safety 🛡️", meaning: "You should feel safe at home and school" }
                    ]
                },

                // Ages 10-12: Democratic Participation
                {
                    id: 4,
                    title: "Young Democracy Builder 🗳️",
                    type: "scenario",
                    ageGroup: "10-12",
                    scenario: "Your class needs to choose a new class rule. How should you decide?",
                    options: [
                        { text: "Let everyone vote fairly", correct: true, points: 50 },
                        { text: "The teacher decides alone", correct: false, points: 0 },
                        { text: "Only the popular kids decide", correct: false, points: 0 }
                    ]
                }
            ]
        };
    }

    async init() {
        await this.loadUserProgress();
        this.setupAvatarSystem();
        this.renderLevelIndicator();
        this.loadLevel(this.currentLevel);
        this.setupEventListeners();
    }

    async loadUserProgress() {
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = firebase.database().ref(`gameProgress/${user.uid}/constitutionChampions`);
            const snapshot = await userRef.once('value');
            this.userProgress = snapshot.val() || {
                currentLevel: 1,
                totalScore: 0,
                completedLevels: [],
                achievements: []
            };
            this.currentLevel = this.userProgress.currentLevel;
            this.score = this.userProgress.totalScore;
        }
    }

    setupAvatarSystem() {
        const user = firebase.auth().currentUser;
        if (user) {
            // Load user's selected avatar
            firebase.database().ref(`users/${user.uid}/avatarId`).once('value', (snapshot) => {
                const avatarId = snapshot.val() || 'buggz';
                const avatar = this.avatarSystem.avatars[avatarId];
                document.getElementById('avatarDisplay').innerHTML = avatar.emoji;
            });
        }
    }

    renderLevelIndicator() {
        const indicator = document.getElementById('levelIndicator');
        indicator.innerHTML = '';
        
        for (let i = 1; i <= this.maxLevel; i++) {
            const dot = document.createElement('div');
            dot.className = 'level-dot';
            
            if (this.userProgress && this.userProgress.completedLevels.includes(i)) {
                dot.classList.add('completed');
            } else if (i === this.currentLevel) {
                dot.classList.add('current');
            }
            
            indicator.appendChild(dot);
        }
    }

    loadLevel(levelNumber) {
        const level = this.gameData.levels.find(l => l.id === levelNumber);
        if (!level) return;

        const gameContent = document.getElementById('gameContent');
        document.getElementById('currentLevel').textContent = levelNumber;
        document.getElementById('currentScore').textContent = this.score;

        switch (level.type) {
            case 'drag-drop':
                this.renderDragDropLevel(level);
                break;
            case 'quiz':
                this.renderQuizLevel(level);
                break;
            case 'matching':
                this.renderMatchingLevel(level);
                break;
            case 'scenario':
                this.renderScenarioLevel(level);
                break;
        }
    }

    renderDragDropLevel(level) {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="puzzle-area">
                <h2>${level.title}</h2>
                <p class="instruction">${level.instruction}</p>
                
                <div class="items-container">
                    ${level.items.map(item => 
                        `<div class="constitution-block" draggable="true" data-id="${item.id}" data-category="${item.category}">
                            ${item.text}
                        </div>`
                    ).join('')}
                </div>
                
                <div class="drop-zones">
                    ${level.dropZones.map(zone =>
                        `<div class="drop-zone" data-accepts="${zone.accepts.join(',')}" data-id="${zone.id}">
                            <h3>${zone.title}</h3>
                        </div>`
                    ).join('')}
                </div>
                
                <div class="educational-note">
                    <p><strong>Did you know?</strong> ${level.educationalNote}</p>
                </div>
            </div>
        `;

        this.setupDragAndDrop();
    }

    renderQuizLevel(level) {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="quiz-container">
                <h2>${level.title}</h2>
                <div class="question">
                    <h3>${level.question}</h3>
                </div>
                
                <div class="options">
                    ${level.options.map((option, index) =>
                        `<div class="answer-option" data-correct="${option.correct}" data-feedback="${option.feedback}">
                            ${option.text}
                        </div>`
                    ).join('')}
                </div>
                
                <div class="feedback" id="quizFeedback" style="display: none;">
                    <p id="feedbackText"></p>
                    <button id="nextLevelBtn" onclick="game.nextLevel()">Next Level! 🚀</button>
                </div>
            </div>
        `;

        this.setupQuizHandlers();
    }

    setupDragAndDrop() {
        const blocks = document.querySelectorAll('.constitution-block');
        const dropZones = document.querySelectorAll('.drop-zone');

        blocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                e.dataTransfer.setData('category', e.target.dataset.category);
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const category = e.dataTransfer.getData('category');
                const accepts = zone.dataset.accepts.split(',');
                
                if (accepts.includes(category)) {
                    const block = document.querySelector(`[data-id="${e.dataTransfer.getData('text/plain')}"]`);
                    zone.appendChild(block);
                    this.checkDragDropCompletion();
                }
            });
        });
    }

    setupQuizHandlers() {
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const isCorrect = option.dataset.correct === 'true';
                const feedback = option.dataset.feedback;
                
                options.forEach(opt => opt.style.pointerEvents = 'none');
                
                if (isCorrect) {
                    option.classList.add('correct');
                    this.addScore(25);
                    this.showAchievement("Great job! 🌟");
                } else {
                    option.classList.add('incorrect');
                }
                
                document.getElementById('feedbackText').textContent = feedback;
                document.getElementById('quizFeedback').style.display = 'block';
            });
        });
    }

    checkDragDropCompletion() {
        const dropZones = document.querySelectorAll('.drop-zone');
        let allFilled = true;
        
        dropZones.forEach(zone => {
            if (zone.children.length <= 1) { // Only has the title
                allFilled = false;
            }
        });
        
        if (allFilled) {
            this.addScore(50);
            this.showAchievement("Perfect! You understand equality! 🎉");
            setTimeout(() => this.nextLevel(), 2000);
        }
    }

    addScore(points) {
        this.score += points;
        document.getElementById('currentScore').textContent = this.score;
        this.saveProgress();
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.userProgress.completedLevels.push(this.currentLevel);
            this.currentLevel++;
            this.userProgress.currentLevel = this.currentLevel;
            this.saveProgress();
            this.renderLevelIndicator();
            this.loadLevel(this.currentLevel);
        } else {
            this.gameComplete();
        }
    }

    showAchievement(text) {
        const notification = document.getElementById('achievementNotification');
        document.getElementById('achievementText').textContent = text;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    async saveProgress() {
        const user = firebase.auth().currentUser;
        if (user && this.userProgress) {
            this.userProgress.totalScore = this.score;
            this.userProgress.lastPlayed = Date.now();
            
            await firebase.database().ref(`gameProgress/${user.uid}/constitutionChampions`).set(this.userProgress);
        }
    }

    gameComplete() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="completion-screen">
                <h1>🎉 Constitution Champion! 🎉</h1>
                <p>You've learned so much about the Constitution!</p>
                <div class="final-score">Final Score: ${this.score}</div>
                <button onclick="window.location.href='games.html'">Play More Games</button>
            </div>
        `;
        
        this.showAchievement("Constitution Champion Unlocked! 🏆");
    }
}

// Initialize game when page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new ConstitutionChampions();
});
