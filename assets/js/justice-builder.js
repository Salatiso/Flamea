document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const ui = {
        stepsContainer: document.getElementById('steps-container'),
        strengthBar: document.getElementById('strength-bar'),
        strengthValue: document.getElementById('strength-value'),
        moraleBar: document.getElementById('morale-bar'),
        moraleValue: document.getElementById('morale-value'),
        currentStepTitle: document.getElementById('current-step-title'),
        scenarioText: document.getElementById('scenario-text'),
        actionsContainer: document.getElementById('actions-container'),
        feedbackText: document.getElementById('feedback-text'),
        restartBtn: document.getElementById('restart-btn'),
        modal: document.getElementById('modal'),
        modalTitle: document.getElementById('modal-title'),
        modalText: document.getElementById('modal-text'),
        modalButton: document.getElementById('modal-button'),
    };

    // --- Game Data: More complex steps and consequences ---
    const caseSteps = [
        {
            id: 'client_interview', title: "1. Client Interview", scenario: "A new client arrives. They claim their landlord illegally evicted them. They are distressed and angry.",
            actions: [
                { text: "Calmly listen and take detailed notes.", effects: { morale: 10, strength: 5 }, feedback: "Good start. Building trust and gathering facts is key." },
                { text: "Promise them a huge payout immediately.", effects: { morale: 20, strength: -10 }, feedback: "Risky. You've raised hopes you might not meet, and you haven't verified the facts yet." },
                { text: "Tell them their case is weak.", effects: { morale: -20, strength: 5 }, feedback: "Honest, but harsh. Their morale is shattered, and they may not trust you now." }
            ]
        },
        {
            id: 'evidence_gathering', title: "2. Evidence Gathering", scenario: "You need proof of the eviction. The client mentions a witness and has text messages from the landlord.",
            actions: [
                { text: "Interview the witness and get sworn affidavit.", effects: { morale: 5, strength: 15 }, feedback: "Excellent. A sworn statement is powerful evidence." },
                { text: "Only rely on the text messages.", effects: { morale: 0, strength: 5 }, feedback: "The texts are useful, but witness testimony would make your case much stronger." },
                { text: "Tell the client to find more evidence on their own.", effects: { morale: -10, strength: 0 }, feedback: "You're the lawyer. Your client feels abandoned." }
            ]
        },
        {
            id: 'letter_of_demand', title: "3. Letter of Demand", scenario: "You have your initial evidence. It's time to formally contact the landlord.",
            actions: [
                { text: "Draft a firm, professional letter citing the law.", effects: { morale: 5, strength: 10 }, feedback: "Perfect. This shows you are serious and knowledgeable, setting the stage for negotiation." },
                { text: "Send a threatening, angry email.", effects: { morale: -5, strength: -5 }, feedback: "Unprofessional. This may escalate the conflict and make the landlord less willing to settle." },
                { text: "Do nothing and file a lawsuit immediately.", effects: { morale: 0, strength: -10 }, feedback: "Too aggressive. Courts prefer that you attempt to resolve disputes first." }
            ]
        },
        // ... I will add another 7 steps here for a total of 10, covering:
        // 4. Landlord's Response, 5. Discovery, 6. Settlement Talks, 7. Pre-trial Motions,
        // 8. Trial Preparation, 9. The Trial, 10. The Verdict.
        // For this demo, I will create a temporary final step.
         {
            id: 'verdict', title: "10. The Verdict", scenario: "After a long process, the judge is ready to rule.",
            actions: [
                { text: "Present your final, compelling argument.", effects: { morale: 10, strength: 10 }, feedback: "You have built a strong case from start to finish." },
            ]
        },
    ];

    // --- Game State ---
    let gameState = {};

    function startGame() {
        gameState = {
            currentStepIndex: 0,
            strength: 50,
            morale: 50
        };
        renderSteps();
        loadStep(gameState.currentStepIndex);
        updateStats();
        ui.modal.classList.add('hidden');
    }

    function updateStats() {
        gameState.strength = Math.max(0, Math.min(100, gameState.strength));
        gameState.morale = Math.max(0, Math.min(100, gameState.morale));

        ui.strengthBar.style.width = `${gameState.strength}%`;
        ui.strengthValue.textContent = `${gameState.strength}%`;
        ui.moraleBar.style.width = `${gameState.morale}%`;
        ui.moraleValue.textContent = `${gameState.morale}%`;
        
        if (gameState.strength <= 0) endGame(false, "Your case became too weak to proceed.");
        if (gameState.morale <= 0) endGame(false, "Your client lost all faith in you and dropped the case.");
    }
    
    function renderSteps() {
        ui.stepsContainer.innerHTML = '';
        caseSteps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-item p-3 rounded-lg';
            stepDiv.innerHTML = `<i class="fas fa-folder mr-2"></i> ${step.title}`;
            if (index < gameState.currentStepIndex) stepDiv.classList.add('completed');
            if (index === gameState.currentStepIndex) stepDiv.classList.add('active');
            ui.stepsContainer.appendChild(stepDiv);
        });
    }

    function loadStep(index) {
        const step = caseSteps[index];
        ui.currentStepTitle.textContent = step.title;
        ui.scenarioText.textContent = step.scenario;
        ui.feedbackText.textContent = 'Awaiting your decision...';
        ui.feedbackText.style.opacity = '0.5';
        
        ui.actionsContainer.innerHTML = '';
        step.actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.className = 'action-button p-4 rounded-lg text-white font-semibold text-left';
            button.onclick = () => handleAction(action);
            ui.actionsContainer.appendChild(button);
        });
    }

    function handleAction(action) {
        gameState.strength += action.effects.strength || 0;
        gameState.morale += action.effects.morale || 0;
        updateStats();

        ui.feedbackText.textContent = action.feedback;
        ui.feedbackText.style.opacity = '1';
        
        Array.from(ui.actionsContainer.children).forEach(btn => btn.disabled = true);
        
        if (gameState.strength > 0 && gameState.morale > 0) {
            setTimeout(() => {
                gameState.currentStepIndex++;
                if (gameState.currentStepIndex < caseSteps.length) {
                    renderSteps();
                    loadStep(gameState.currentStepIndex);
                } else {
                    endGame(true, "You successfully navigated the case!");
                }
            }, 3500);
        }
    }

    function endGame(isWin, message) {
        const title = isWin ? "Case Won!" : "Case Closed";
        const btnText = "Build Another Case";
        showModal(title, `${message} Your final Case Strength was ${gameState.strength}%.`, btnText, startGame);
    }

    function showModal(title, text, buttonText, callback) {
        ui.modalTitle.innerText = title;
        ui.modalText.innerText = text;
        ui.modalButton.innerText = buttonText;
        ui.modal.classList.remove('hidden');
        ui.modalButton.onclick = callback;
    }

    ui.restartBtn.addEventListener('click', startGame);
    startGame();
});
