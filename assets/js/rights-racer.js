// assets/js/rights-racer.js
class RightsRacer {
    constructor() {
        this.car = document.getElementById('playerCar');
        this.gameArea = document.getElementById('gameArea');
        this.score = 0;
        this.rightsCollected = 0;
        this.speed = 1;
        this.carPosition = 50; // Percentage from left
        
        this.rightsTokens = [
            { emoji: '🗣️', name: 'Freedom of Speech', points: 10 },
            { emoji: '📚', name: 'Right to Education', points: 15 },
            { emoji: '🏠', name: 'Right to Housing', points: 12 },
            { emoji: '⚖️', name: 'Right to Equality', points: 20 },
            { emoji: '🛡️', name: 'Right to Safety', points: 18 }
        ];
        
        this.obstacles = [
            { emoji: '🚫', name: 'Discrimination' },
            { emoji: '😠', name: 'Bullying' },
            { emoji: '⛔', name: 'Unfairness' }
        ];
        
        this.gameLoop = null;
        this.init();
    }
    
    init() {
        this.setupControls();
        this.startGame();
    }
    
    setupControls() {
        document.getElementById('leftBtn').addEventListener('click', () => this.moveLeft());
        document.getElementById('rightBtn').addEventListener('click', () => this.moveRight());
        document.getElementById('slowBtn').addEventListener('click', () => this.changeSpeed(-0.5));
        document.getElementById('fastBtn').addEventListener('click', () => this.changeSpeed(0.5));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft': this.moveLeft(); break;
                case 'ArrowRight': this.moveRight(); break;
                case 'ArrowUp': this.changeSpeed(0.5); break;
                case 'ArrowDown': this.changeSpeed(-0.5); break;
            }
        });
    }
    
    moveLeft() {
        this.carPosition = Math.max(10, this.carPosition - 10);
        this.updateCarPosition();
    }
    
    moveRight() {
        this.carPosition = Math.min(90, this.carPosition + 10);
        this.updateCarPosition();
    }
    
    updateCarPosition() {
        this.car.style.left = this.carPosition + '%';
    }
    
    changeSpeed(delta) {
        this.speed = Math.max(0.5, Math.min(3, this.speed + delta));
        document.getElementById('speedDisplay').textContent = this.speed;
    }
    
    startGame() {
        this.gameLoop = setInterval(() => {
            this.spawnToken();
            this.spawnObstacle();
            this.updateScore();
        }, 2000 / this.speed);
    }
    
    spawnToken() {
        if (Math.random() < 0.7) { // 70% chance to spawn token
            const token = this.rightsTokens[Math.floor(Math.random() * this.rightsTokens.length)];
            const tokenElement = document.createElement('div');
            tokenElement.className = 'rights-token';
            tokenElement.innerHTML = token.emoji;
            tokenElement.style.left = Math.random() * 80 + 10 + '%';
            tokenElement.dataset.points = token.points;
            tokenElement.dataset.name = token.name;
            
            tokenElement.addEventListener('click', () => this.collectToken(tokenElement, token));
            
            this.gameArea.appendChild(tokenElement);
            
            setTimeout(() => {
                if (tokenElement.parentNode) {
                    tokenElement.remove();
                }
            }, 3000);
        }
    }
    
    spawnObstacle() {
        if (Math.random() < 0.3) { // 30% chance to spawn obstacle
            const obstacle = this.obstacles[Math.floor(Math.random() * this.obstacles.length)];
            const obstacleElement = document.createElement('div');
            obstacleElement.className = 'obstacle';
            obstacleElement.innerHTML = obstacle.emoji;
            obstacleElement.style.left = Math.random() * 80 + 10 + '%';
            obstacleElement.dataset.name = obstacle.name;
            
            this.gameArea.appendChild(obstacleElement);
            
            // Check for collision
            this.checkCollision(obstacleElement);
            
            setTimeout(() => {
                if (obstacleElement.parentNode) {
                    obstacleElement.remove();
                }
            }, 3000);
        }
    }
    
    collectToken(tokenElement, token) {
        this.score += token.points;
        this.rightsCollected++;
        
        document.getElementById('raceScore').textContent = this.score;
        document.getElementById('rightsCount').textContent = this.rightsCollected;
        
        // Show collection feedback
        this.showFeedback(`+${token.points} ${token.name}!`, 'success');
        
        tokenElement.remove();
    }
    
    checkCollision(obstacleElement) {
        const checkInterval = setInterval(() => {
            const obstacleRect = obstacleElement.getBoundingClientRect();
            const carRect = this.car.getBoundingClientRect();
            
            if (obstacleRect.bottom >= carRect.top && 
                obstacleRect.top <= carRect.bottom &&
                obstacleRect.right >= carRect.left && 
                obstacleRect.left <= carRect.right) {
                
                this.hitObstacle(obstacleElement);
                clearInterval(checkInterval);
            }
            
            if (!obstacleElement.parentNode) {
                clearInterval(checkInterval);
            }
        }, 50);
    }
    
    hitObstacle(obstacleElement) {
        this.score = Math.max(0, this.score - 10);
        document.getElementById('raceScore').textContent = this.score;
        
        this.showFeedback(`-10 Avoid ${obstacleElement.dataset.name}!`, 'danger');
        
        // Visual feedback
        this.car.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.car.style.animation = '';
        }, 500);
        
        obstacleElement.remove();
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            z-index: 100;
            animation: fadeInOut 2s forwards;
        `;
        
        this.gameArea.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 2000);
    }
    
    updateScore() {
        // Bonus points for staying alive
        this.score += 1;
        document.getElementById('raceScore').textContent = this.score;
    }
}

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new RightsRacer();
});
