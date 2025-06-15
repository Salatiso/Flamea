// --- Basic Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- UI & Modal Elements ---
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const instructionsBtn = document.getElementById('instructions-btn');
const instructionsModal = document.getElementById('instructions-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreEl = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const restartBtn = document.getElementById('restart-btn');

// --- Game Configuration ---
let canvasWidth = Math.min(800, window.innerWidth - 30);
let canvasHeight = canvasWidth * 0.75;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const playerWidth = 50;
const playerHeight = 50;
const itemSize = 30;
let playerSpeed = 15;
let itemSpeed = 2;

// --- Game State ---
let score = 0;
let lives = 3;
let gameOver = false;
let gameRunning = true;
let leftPressed = false;
let rightPressed = false;
let player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 10,
    emoji: '🏃'
};
let items = [];

// --- Item Definitions ---
const goodItems = [
    { emoji: '📖', score: 10 }, // Right to Education
    { emoji: '🏠', score: 10 }, // Right to Shelter
    { emoji: '⚕️', score: 15 }, // Right to Healthcare
    { emoji: '⚖️', score: 20 }, // Right to Justice
];
const badItems = [
    { emoji: '💣', score: -1 }, // Obstacle
    { emoji: '💥', score: -1 }, // Obstacle
];


// --- Game Logic Functions ---

function resetGame() {
    score = 0;
    lives = 3;
    itemSpeed = 2;
    gameOver = false;
    gameRunning = true;
    player.x = canvas.width / 2 - playerWidth / 2;
    items = [];
    updateUI();
    gameOverModal.classList.add('hidden');
    gameLoop();
}

function updateUI() {
    scoreEl.innerText = `Score: ${score}`;
    livesEl.innerHTML = `Lives: ${'💖'.repeat(lives)}`;
}

function spawnItem() {
    // 70% chance of a good item
    const isGood = Math.random() < 0.7;
    const itemSet = isGood ? goodItems : badItems;
    const template = itemSet[Math.floor(Math.random() * itemSet.length)];
    
    items.push({
        x: Math.random() * (canvas.width - itemSize),
        y: -itemSize,
        emoji: template.emoji,
        score: template.score
    });
}

function update() {
    if (gameOver) return;

    // Move Player
    if (leftPressed && player.x > 0) {
        player.x -= playerSpeed;
    }
    if (rightPressed && player.x < canvas.width - playerWidth) {
        player.x += playerSpeed;
    }

    // Move and check items
    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += itemSpeed;

        // Collision detection
        if (item.x < player.x + playerWidth &&
            item.x + itemSize > player.x &&
            item.y < player.y + playerHeight &&
            item.y + itemSize > player.y) {
            
            if (item.score > 0) {
                score += item.score;
                // Increase speed every 50 points
                if (score % 50 === 0 && score > 0) {
                    itemSpeed += 0.5;
                }
            } else {
                lives--;
            }
            items.splice(i, 1); // Remove item
            updateUI();
        }

        // Remove items that go off screen
        if (item.y > canvas.height) {
            items.splice(i, 1);
        }
    }
    
    // Check for game over
    if (lives <= 0) {
        gameOver = true;
        gameRunning = false;
        finalScoreEl.innerText = score;
        gameOverModal.classList.remove('hidden');
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Player
    ctx.font = `${playerWidth}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(player.emoji, player.x + playerWidth / 2, player.y + playerHeight * 0.85);

    // Draw Items
    ctx.font = `${itemSize}px Arial`;
    items.forEach(item => {
        ctx.fillText(item.emoji, item.x + itemSize / 2, item.y + itemSize * 0.85);
    });
}

function gameLoop() {
    if (!gameRunning) return;
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// --- Event Handlers ---
function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = e.clientX - rect.left - root.scrollLeft;
    player.x = mouseX - playerWidth / 2;
    // Clamp player position
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - playerWidth) player.x = canvas.width - playerWidth;
}

function handleResize() {
    canvasWidth = Math.min(800, window.innerWidth - 30);
    canvasHeight = canvasWidth * 0.75;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    player.y = canvas.height - playerHeight - 10;
    draw(); // Redraw after resize
}


// --- Initializations ---
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
canvas.addEventListener('mousemove', mouseMoveHandler, false);
window.addEventListener('resize', handleResize);

instructionsBtn.addEventListener('click', () => instructionsModal.classList.remove('hidden'));
closeModalBtn.addEventListener('click', () => instructionsModal.classList.add('hidden'));

playAgainBtn.addEventListener('click', resetGame);
restartBtn.addEventListener('click', resetGame);

// Set interval for spawning items
setInterval(spawnItem, 1000);

// Start Game
resetGame();
