// assets/js/justice-builder.js
class JusticeBuilder {
    constructor() {
        this.buildingArea = document.getElementById('buildingArea');
        this.placedBuildings = [];
        this.justiceScore = 0;
        this.happinessScore = 0;
        this.safetyScore = 0;
        
        this.challenges = [
            {
                id: 1,
                title: "Build a Learning Community",
                description: "Every child needs access to education!",
                requirements: ["school", "library"],
                reward: 50
            },
            {
                id: 2,
                title: "Create Safety for All",
                description: "Everyone should feel safe in their community!",
                requirements: ["police", "fire", "hospital"],
                reward: 75
            },
            {
                id: 3,
                title: "Build Happiness",
                description: "People need places to play and have fun!",
                requirements: ["park", "playground"],
                reward: 40
            }
        ];
        
        this.currentChallengeIndex = 0;
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.updateChallenge();
        this.updateStats();
    }
    
    setupDragAndDrop() {
        const buildingBlocks = document.querySelectorAll('.building-block');
        
        buildingBlocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    type: e.target.dataset.type,
                    justice: parseInt(e.target.dataset.justice),
                    emoji: e.target.textContent.trim()
                }));
                e.target.classList.add('dragging');
            });
            
            block.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });
        
        this.buildingArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        this.buildingArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));
            const rect = this.buildingArea.getBoundingClientRect();
            
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Snap to grid
            const gridX = Math.round(x / 40) * 40;
            const gridY = Math.round(y / 40) * 40;
            
            this.placeBuilding(data, gridX, gridY);
        });
    }
    
    placeBuilding(buildingData, x, y) {
        // Check if position is valid (not overlapping)
        if (this.isPositionValid(x, y)) {
            const building = document.createElement('div');
            building.className = 'placed-building';
            building.textContent = buildingData.emoji;
            building.style.left = x + 'px';
            building.style.top = y + 'px';
            building.style.width = '80px';
            building.style.height = '60px';
            building.dataset.type = buildingData.type;
            building.dataset.justice = buildingData.justice;
            
            // Add click handler for building info
            building.addEventListener('click', () => {
                this.showBuildingInfo(buildingData);
            });
            
            // Add double-click to remove
            building.addEventListener('dblclick', () => {
                this.removeBuilding(building);
            });
            
            this.buildingArea.appendChild(building);
            this.placedBuildings.push({
                element: building,
                type: buildingData.type,
                justice: buildingData.justice,
                x: x,
                y: y
            });
            
            this.updateScores();
            this.checkChallengeCompletion();
        } else {
            this.showFeedback("Can't place building here! Try another spot.", 'warning');
        }
    }
    
    isPositionValid(x, y) {
        // Check bounds
        if (x < 0 || y < 0 || x > this.buildingArea.offsetWidth - 80 || y > this.buildingArea.offsetHeight - 60) {
            return false;
        }
        
        // Check for overlaps
        return !this.placedBuildings.some(building => {
            return Math.abs(building.x - x) < 80 && Math.abs(building.y - y) < 60;
        });
    }
    
    removeBuilding(buildingElement) {
        const index = this.placedBuildings.findIndex(b => b.element === buildingElement);
        if (index !== -1) {
            this.placedBuildings.splice(index, 1);
            buildingElement.remove();
            this.updateScores();
        }
    }
    
    updateScores() {
        // Calculate justice score
        this.justiceScore = Math.min(100, this.placedBuildings.reduce((total, building) => {
            return total + building.justice;
        }, 0));
        
        // Calculate happiness (variety of buildings)
        const buildingTypes = new Set(this.placedBuildings.map(b => b.type));
        this.happinessScore = Math.min(100, buildingTypes.size * 15);
        
        // Calculate safety (specific buildings)
        const safetyBuildings = this.placedBuildings.filter(b => 
            ['police', 'fire', 'hospital'].includes(b.type)
        );
        this.safetyScore = Math.min(100, safetyBuildings.length * 33);
        
        this.updateStats();
    }
    
    updateStats() {
        document.getElementById('justiceScore').textContent = this.justiceScore;
        document.getElementById('justiceFill').style.width = this.justiceScore + '%';
        document.getElementById('buildingCount').textContent = this.placedBuildings.length;
        document.getElementById('happinessScore').textContent = this.happinessScore;
        document.getElementById('safetyScore').textContent = this.safetyScore;
    }
    
    checkChallengeCompletion() {
        const currentChallenge = this.challenges[this.currentChallengeIndex];
        if (!currentChallenge) return;
        
        const requiredBuildings = currentChallenge.requirements;
        const placedTypes = this.placedBuildings.map(b => b.type);
        
        const isComplete = requiredBuildings.every(required => 
            placedTypes.includes(required)
        );
        
        if (isComplete) {
            this.completeChallenge(currentChallenge);
        }
    }
    
    completeChallenge(challenge) {
        this.showChallengeComplete(challenge);
        this.currentChallengeIndex++;
        
        setTimeout(() => {
            if (this.currentChallengeIndex < this.challenges.length) {
                this.updateChallenge();
            } else {
                this.gameComplete();
            }
        }, 3000);
    }
    
    updateChallenge() {
        const challenge = this.challenges[this.currentChallengeIndex];
        if (challenge) {
            document.getElementById('currentChallenge').innerHTML = `
                <h4>${challenge.title}</h4>
                <p>${challenge.description}</p>
                <div class="challenge-requirements">
                    <strong>Need:</strong> ${challenge.requirements.join(', ')}
                </div>
                <div class="challenge-reward">
                    <strong>Reward:</strong> ${challenge.reward} Justice Points!
                </div>
            `;
        }
    }
    
    showChallengeComplete(challenge) {
        const popup = document.createElement('div');
        popup.className = 'challenge-popup';
        popup.innerHTML = `
            <h2>🎉 Challenge Complete! 🎉</h2>
            <h3>${challenge.title}</h3>
            <p>You earned ${challenge.reward} Justice Points!</p>
            <p>Great job building a fair community!</p>
        `;
        
        this.buildingArea.appendChild(popup);
        
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }
    
    showBuildingInfo(buildingData) {
        const info = this.getBuildingInfo(buildingData.type);
        this.showFeedback(`${buildingData.emoji} ${info}`, 'info');
    }
    
    getBuildingInfo(type) {
        const infoMap = {
            school: "Schools help everyone learn and grow! Education is a right.",
            hospital: "Hospitals keep people healthy and safe.",
            house: "Everyone deserves a safe place to live.",
            court: "Courts make sure everyone is treated fairly.",
            park: "Parks give people space to play and relax.",
            library: "Libraries help people learn and discover new things.",
            playground: "Playgrounds help children have fun and make friends.",
            police: "Police help keep communities safe.",
            fire: "Fire stations protect people from emergencies."
        };
        return infoMap[type] || "This building helps make the community better!";
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'warning' ? '#ff9800' : type === 'info' ? '#2196f3' : '#4caf50'};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 50;
            max-width: 300px;
            text-align: center;
            animation: slideInOut 3s forwards;
        `;
        
        this.buildingArea.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 3000);
    }
    
    gameComplete() {
        const popup = document.createElement('div');
        popup.className = 'challenge-popup';
        popup.innerHTML = `
            <h1>🏆 Justice Builder Master! 🏆</h1>
            <p>You've built an amazing fair community!</p>
            <div class="final-stats">
                <div>Justice Level: ${this.justiceScore}%</div>
                <div>Happiness: ${this.happinessScore}%</div>
                <div>Safety: ${this.safetyScore}%</div>
            </div>
            <button onclick="window.location.href='games.html'">Play More Games</button>
        `;
        
        this.buildingArea.appendChild(popup);
    }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInOut {
        0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        20%, 80% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new JusticeBuilder();
});
