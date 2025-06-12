document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const gameWrapper = document.getElementById('game-wrapper');
    const startScreen = document.getElementById('start-screen-satire');
    const startBtn = document.getElementById('start-btn-satire');
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const sanityBar = document.getElementById('sanity-bar');
    const achievementsList = document.getElementById('achievements-list');
    
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioText = document.getElementById('scenario-text');
    const choicesContainer = document.getElementById('choices-container');
    const backBtn = document.getElementById('back-btn-satire');
    const quitBtn = document.getElementById('quit-btn-satire');

    const outcomeModal = document.getElementById('outcome-modal');
    const outcomeTitle = document.getElementById('outcome-title');
    const outcomeText = document.getElementById('outcome-text');
    const sanityChangeText = document.getElementById('sanity-change');
    const nextScenarioBtn = document.getElementById('next-scenario-btn');
    
    const quitModal = document.getElementById('quit-modal-satire');
    const resumeBtn = document.getElementById('resume-btn-satire');
    const confirmQuitBtn = document.getElementById('confirm-quit-btn-satire');

    // --- Game State ---
    let sanity = 100;
    let currentScenarioIndex = 0;
    let history = [];
    const TOTAL_SCENARIOS = 25;
    let achievements = [
        { name: "Survivor", threshold: 10, unlocked: false },
        { name: "Cynic", threshold: 20, unlocked: false },
        { name: "Enlightened", threshold: 25, unlocked: false },
    ];

    // --- Scenarios Database ---
    const scenarios = [
        {
            text: "You're a father fighting for equal custody. The court official smiles politely and says, 'Of course, we believe in equality.' What's your approach?",
            choices: [
                { text: "Present a detailed, logical plan showing your capability and involvement.", sanityChange: -10, outcome: "The court finds your 'aggressive logic' unsettling and prefers the mother's 'natural nurturing instincts.' Sanity takes a hit." },
                { text: "Hire an expensive lawyer to argue about gender bias.", sanityChange: -15, outcome: "Your lawyer makes a brilliant argument. You win the moral victory but are now broke. The court is annoyed. Sanity and wallet suffer." },
                { text: "Agree to every demand and hope for mercy.", sanityChange: -20, outcome: "You are seen as 'agreeable' but 'unassertive.' You get visitation rights every other weekend and a hefty maintenance bill. A large chunk of sanity is lost." }
            ]
        },
        {
            text: "You apply for a government tender. The form has boxes for Race and Gender, but not for 'Competence' or 'Best Price.' What do you do?",
            choices: [
                { text: "Fill it out honestly, knowing your demographic is not a priority.", sanityChange: -5, outcome: "You receive an automated rejection letter before the deadline even closes. At least it was efficient." },
                { text: "Find a 'fronting' partner who ticks the right boxes.", sanityChange: -20, outcome: "You win the tender! But your partner takes 80% of the profit for doing nothing, and you're investigated for fraud. Your sanity plummets." }
            ]
        },
        // More scenarios to be added to reach 25
    ];

    // --- Game Logic ---
    function initGame() {
        sanity = 100;
        currentScenarioIndex = 0;
        history = [];
        achievements.forEach(a => a.unlocked = false);

        startScreen.classList.add('hidden');
        gameWrapper.classList.remove('hidden');
        gameWrapper.classList.add('grid');

        updateDashboard();
        renderScenario();
    }
    
    function renderScenario() {
        if(sanity <= 0 || currentScenarioIndex >= scenarios.length) {
            endGame();
            return;
        }

        history.push(currentScenarioIndex);
        const scenario = scenarios[currentScenarioIndex];

        scenarioTitle.textContent = `Scenario #${currentScenarioIndex + 1}`;
        scenarioText.textContent = scenario.text;
        
        choicesContainer.innerHTML = '';
        scenario.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.text;
            button.className = "w-full text-left p-4 rounded-lg option-btn";
            button.onclick = () => handleChoice(choice);
            choicesContainer.appendChild(button);
        });

        backBtn.disabled = history.length <= 1;
    }

    function handleChoice(choice) {
        sanity += choice.sanityChange;
        sanity = Math.max(0, Math.min(100, sanity));
        
        showOutcome(choice);
        updateDashboard();
    }

    function showOutcome(choice) {
        outcomeTitle.textContent = choice.sanityChange < 0 ? "That Didn't Go Well..." : "A Glimmer of Hope?";
        outcomeTitle.className = `text-4xl font-bold mb-4 text-center ${choice.sanityChange < 0 ? 'text-red-400' : 'text-green-400'}`;
        outcomeText.textContent = choice.outcome;
        sanityChangeText.textContent = `Sanity Change: ${choice.sanityChange}%`;
        sanityChangeText.className = `text-center font-bold text-xl mb-6 ${choice.sanityChange < 0 ? 'text-red-500' : 'text-green-500'}`;
        
        outcomeModal.classList.remove('hidden');
    }
    
    function nextScenario() {
        outcomeModal.classList.add('hidden');
        currentScenarioIndex++;
        checkAchievements();
        renderScenario();
    }

    function goBack() {
        if (history.length > 1) {
            history.pop(); // remove current
            const prevIndex = history[history.length-1];
            // This is a simplified back function for a narrative game.
            // It won't restore sanity, just the scenario.
            currentScenarioIndex = prevIndex;
            history.pop(); // remove prev so it can be added again in render
            renderScenario();
        }
    }
    
    function updateDashboard() {
        // Progress
        const progressPercentage = (currentScenarioIndex / TOTAL_SCENARIOS) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${currentScenarioIndex}/${TOTAL_SCENARIOS} Scenarios`;

        // Sanity
        sanityBar.style.width = `${sanity}%`;
        sanityBar.textContent = `${sanity}%`;
        sanityBar.classList.toggle('bg-red-600', sanity < 30);
        sanityBar.classList.toggle('text-white', sanity < 30);

        // Achievements
        achievements.forEach(ach => {
            const el = achievementsList.querySelector(`[data-achievement="${ach.name}"]`);
            if (ach.unlocked) {
                el.classList.remove('text-gray-500');
                el.classList.add('text-amber-400', 'font-bold');
            }
        });
    }
    
    function checkAchievements() {
        achievements.forEach(ach => {
            if (currentScenarioIndex >= ach.threshold && !ach.unlocked) {
                ach.unlocked = true;
            }
        });
        updateDashboard();
    }

    function endGame() {
        gameWrapper.classList.add('hidden');
        startScreen.classList.remove('hidden');
        
        let endTitle, endMessage;
        if (sanity <= 0) {
            endTitle = "Sanity Depleted!";
            endMessage = "The sheer absurdity of the system has broken your spirit. It's a tough world out there. The real challenge isn't playing the game, but changing the rules.";
        } else {
            endTitle = "You Survived!";
            endMessage = "You've navigated the maze of modern confusion. You might be cynical, bruised, and broke, but you're not broken. This game was satire, but the problems are real. The next step is taking action.";
        }

        startScreen.innerHTML = `
            <h1 class="game-title text-5xl text-blue-400 mb-4">${endTitle}</h1>
            <p class="text-xl text-gray-300 mb-6">${endMessage}</p>
            <p class="text-lg text-gray-400 mb-8">To find real solutions and connect with others fighting for fairness, visit <a href="https://flamea.org" class="text-blue-400 underline font-bold">Flamea.org</a>.</p>
            <button id="restart-game-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl">Play Again?</button>
        `;
        document.getElementById('restart-game-btn').addEventListener('click', initGame);
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', initGame);
    nextScenarioBtn.addEventListener('click', nextScenario);
    quitBtn.addEventListener('click', () => quitModal.classList.remove('hidden'));
    resumeBtn.addEventListener('click', () => quitModal.classList.add('hidden'));
    confirmQuitBtn.addEventListener('click', () => window.location.reload());
    backBtn.addEventListener('click', goBack);
});
