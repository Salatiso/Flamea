// assets/js/games.js

// --- Game Data: Avatars and Scenarios ---
const avatarData = {
    'inkwenkwe': { name: 'Inkwenkwe', gender: 'male', svg: '<svg width="150" height="300" viewBox="0 0 100 200"><rect x="25" y="50" width="50" height="100" fill="#a0522d" rx="10"/><circle cx="50" cy="25" r="20" fill="#654321"/></svg>' },
    'intombazana': { name: 'Intombazana', gender: 'female', svg: '<svg width="150" height="300" viewBox="0 0 100 200"><rect x="25" y="50" width="50" height="100" fill="#d2b48c" rx="10"/><circle cx="50" cy="25" r="20" fill="#8b4513"/></svg>' }
};

const scenarios = [
    {
        avatar: 'inkwenkwe',
        ceremony: 'Ulwaluko Graduation (Amakrwala)',
        culture: 'Xhosa',
        requiredItems: ['white_blanket', 'beaded_headband', 'staff'],
        clothingItems: [
            { id: 'white_blanket', name: 'White Blanket', svg: '<path d="M10 60 H 90 V 140 H 10 Z" fill="white" stroke="black" stroke-width="1"/>' },
            { id: 'beaded_headband', name: 'Beaded Headband', svg: '<rect x="30" y="5" width="40" height="10" fill="blue" stroke="white" stroke-width="1"/>' },
            { id: 'staff', name: 'Ceremonial Staff', svg: '<line x1="5" y1="10" x2="5" y2="150" stroke="brown" stroke-width="4"/>' },
            { id: 'headdress', name: 'Feathered Headdress', svg: '<path d="M50 0 L40 20 L60 20 Z" fill="orange"/>' } // Decoy
        ]
    },
    {
        avatar: 'intombazana',
        ceremony: 'Zulu Reed Dance (Umhlanga)',
        culture: 'Zulu',
        requiredItems: ['beaded_skirt', 'anklets', 'reed'],
        clothingItems: [
            { id: 'beaded_skirt', name: 'Beaded Skirt', svg: '<path d="M20 100 Q 50 120 80 100 V 130 H 20 Z" fill="red"/>' },
            { id: 'anklets', name: 'Anklets', svg: '<circle cx="30" cy="150" r="5" fill="green"/><circle cx="70" cy="150" r="5" fill="green"/>' },
            { id: 'reed', name: 'Ceremonial Reed', svg: '<line x1="95" y1="10" x2="95" y2="160" stroke="tan" stroke-width="3"/>' },
            { id: 'modern_dress', name: 'Modern Dress', svg: '<rect x="25" y="60" width="50" height="80" fill="pink"/>' } // Decoy
        ]
    }
];

// --- Game State ---
let currentScenarioIndex = -1;
let selectedAvatar = null;
let dressedItems = [];

// --- DOM Elements ---
const gameContainer = document.getElementById('game-container');
const avatarPlaceholder = document.getElementById('avatar-placeholder');
const selectionGrid = document.getElementById('selection-grid');
const scenarioText = document.getElementById('scenario-text');
const selectionTitle = document.getElementById('selection-title');
const nextBtn = document.getElementById('next-btn');

// --- Game Logic ---
function initGame() {
    displayAvatarSelection();
    setupEventListeners();
}

function displayAvatarSelection() {
    selectionTitle.textContent = 'Select Your Character';
    selectionGrid.innerHTML = Object.keys(avatarData).map(key => `
        <div class="avatar-selection-card bg-gray-700 p-4 rounded-lg text-center cursor-pointer" data-avatar-id="${key}">
            ${avatarData[key].svg}
            <p class="mt-2 font-semibold">${avatarData[key].name}</p>
        </div>
    `).join('');
    
    document.querySelectorAll('.avatar-selection-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedAvatar = card.dataset.avatarId;
            startNextScenario();
        });
    });
}

function startNextScenario() {
    currentScenarioIndex++;
    if (currentScenarioIndex >= scenarios.length) {
        scenarioText.textContent = 'Congratulations! You have completed all the challenges!';
        avatarPlaceholder.innerHTML = '<p class="text-2xl text-green-400">You are a cultural expert!</p>';
        selectionGrid.innerHTML = '';
        nextBtn.classList.add('hidden');
        return;
    }
    
    const scenario = scenarios[currentScenarioIndex];
    selectedAvatar = scenario.avatar;
    dressedItems = [];

    scenarioText.textContent = `Prepare ${avatarData[selectedAvatar].name} for the ${scenario.ceremony} (${scenario.culture}).`;
    selectionTitle.textContent = 'Select Clothing & Items';

    avatarPlaceholder.innerHTML = avatarData[selectedAvatar].svg;
    setupDropZones();

    displayClothingItems(scenario.clothingItems);
    nextBtn.classList.add('hidden');
}

function setupDropZones() {
    const avatarSVG = avatarPlaceholder.querySelector('svg');
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone absolute inset-0';
    avatarPlaceholder.appendChild(dropZone);

    dropZone.addEventListener('dragover', e => {
        e.preventDefault();
        dropZone.classList.add('hover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('hover'));
    dropZone.addEventListener('drop', handleDrop);
}

function displayClothingItems(items) {
    selectionGrid.innerHTML = items.map(item => `
        <div class="clothing-item p-2 bg-gray-700 rounded-lg flex justify-center items-center" draggable="true" data-item-id="${item.id}">
            <svg width="80" height="80" viewBox="0 0 100 160">${item.svg}</svg>
        </div>
    `).join('');

    document.querySelectorAll('.clothing-item').forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.closest('.clothing-item').dataset.itemId);
}

function handleDrop(e) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const scenario = scenarios[currentScenarioIndex];
    
    if (scenario.requiredItems.includes(itemId) && !dressedItems.includes(itemId)) {
        dressedItems.push(itemId);
        
        // Visually add item to avatar
        const itemData = scenario.clothingItems.find(i => i.id === itemId);
        const avatarSVG = avatarPlaceholder.querySelector('svg');
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.innerHTML = itemData.svg;
        avatarSVG.appendChild(g);

        document.querySelector(`[data-item-id="${itemId}"]`).style.opacity = '0.3';
        showFeedback('Correct!', 'green');

        if (dressedItems.length === scenario.requiredItems.length) {
            showFeedback('Outfit Complete!', 'blue');
            nextBtn.classList.remove('hidden');
        }
    } else {
        showFeedback('Try again!', 'red');
    }
    e.target.classList.remove('hover');
}

function showFeedback(message, color) {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = `feedback-message bg-${color}-500 text-white`;
    feedbackEl.textContent = message;
    gameContainer.appendChild(feedbackEl);
    setTimeout(() => feedbackEl.remove(), 3000);
}

// --- Event Listeners for Modals and Navigation ---
function setupEventListeners() {
    const quitBtn = document.getElementById('quit-btn');
    const confirmQuitBtn = document.getElementById('confirm-quit-btn');
    const cancelQuitBtn = document.getElementById('cancel-quit-btn');
    const instructionsBtn = document.getElementById('instructions-btn');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    const quitModal = document.getElementById('quit-modal');
    const instructionsModal = document.getElementById('instructions-modal');
    
    quitBtn.addEventListener('click', () => quitModal.classList.add('show'));
    cancelQuitBtn.addEventListener('click', () => quitModal.classList.remove('show'));
    confirmQuitBtn.addEventListener('click', () => window.location.href = '../games.html');

    instructionsBtn.addEventListener('click', () => instructionsModal.classList.add('show'));
    closeInstructionsBtn.addEventListener('click', () => instructionsModal.classList.remove('show'));

    nextBtn.addEventListener('click', startNextScenario);
}

// --- Initialize Game ---
if(document.getElementById('game-container')) {
    initGame();
}
