document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionArea = document.getElementById('selection-area');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-forms-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');
    const hubHeader = document.getElementById('hub-header');

    // Wizard-specific elements
    const progressBar = document.getElementById('progress-bar');
    const backBtn = document.getElementById('back-btn');
    const stepCounterEl = document.getElementById('step-counter');
    const recommendationContainer = document.getElementById('recommendation-container');
    
    // Exit if the main container isn't on this page
    if (!selectionArea) return;

    // --- Data Definitions ---
    const resources = {
        // Forms
        'Informal Parental Rights Letter': { type: 'form', file: 'Affirmation_Parental_Rights_and_Responsibilities_Iinformal.html' },
        'Formal Parental Rights Letter': { type: 'form', file: 'Affirmation_Parental_Rights_and_Responsibilities_Formal.html' },
        'Final Letter on Constitutional Rights': { type: 'form', file: 'Affirmation_Parental_Rights_and_Responsibilities_final.html' },
        'Mediation Request Letter': { type: 'form', file: 'Mediation_Request_Letter.html' },
        'Conflict Resolution Worksheet': { type: 'form', file: 'Conflict_Resolution_Worksheet.html' },
        'Comprehensive Parenting Plan': { type: 'form', file: 'Parenting_Plan_Template.html' },
        'General Affidavit': { type: 'form', file: 'Affidavit_General_Template.html' },
        'General Letter to School': { type: 'form', file: 'School_Letter_General_Template.html' },
        'Request for School Transfer': { type: 'form', file: 'School_Letter_Transfer_Template.html' },
        'Legal Practice Council Complaint': { type: 'form', file: 'Legal_Practice_Council_Complaint.html' },
        'Magistrates Commission Complaint': { type: 'form', file: 'Magistrates_Commission_Complaint_Template.html' },
        'Public Protector Complaint': { type: 'form', file: 'Public_Protector_Complaint.html' },
        'Commission for Gender Equality Complaint': { type: 'form', file: 'Commission_Gender_Equality.html' },
        'SA Law Reform Commission Request': { type: 'form', file: 'SALRC_Request_Family_Law_Reform.html' },
        'Cohabitation Agreement': { type: 'form', file: 'Cohabitation_Agreement.html' },
        'Budgeting Tool for Couples': { type: 'form', file: 'Budget_Couples.html' },
        'Child Support Agreement': { type: 'form', file: 'Child_Support_Agreement.html' },
        // Training
        'The SA Constitution': { type: 'training', url: 'training/course-constitution.html' },
        'The Children\'s Act': { type: 'training', url: 'training/course-childrens-act.html' },
        'Co-Parenting 101': { type: 'training', url: 'training/course-coparenting.html' },
        'Family Law Overview': { type: 'training', url: 'training/course-family-law.html' },
        'A Father\'s Shield': { type: 'training', url: 'training/course-fathers-shield.html' },
    };

    const wizardLogic = {
        'establish_rights': {
            forms: ['Informal Parental Rights Letter', 'Formal Parental Rights Letter', 'Final Letter on Constitutional Rights'],
            training: ['The SA Constitution', 'The Children\'s Act']
        },
        'resolve_conflict': {
            forms: ['Mediation Request Letter', 'Conflict Resolution Worksheet', 'Comprehensive Parenting Plan'],
            training: ['The SA Constitution', 'Co-Parenting 101']
        },
        'court_action': {
            forms: ['General Affidavit', 'Comprehensive Parenting Plan'],
            training: ['The SA Constitution', 'The Children\'s Act', 'Family Law Overview']
        },
        'school': {
            forms: ['General Letter to School', 'Request for School Transfer'],
            training: ['The SA Constitution', 'The Children\'s Act']
        },
        'legal_body': {
            forms: ['General Affidavit', 'Legal Practice Council Complaint', 'Magistrates Commission Complaint'],
            training: ['The SA Constitution', "A Father's Shield"]
        },
        'gov_body': {
            forms: ['General Affidavit', 'Public Protector Complaint', 'Commission for Gender Equality Complaint', 'SA Law Reform Commission Request'],
            training: ['The SA Constitution', "A Father's Shield"]
        },
        'cohabitation': {
            forms: ['Cohabitation Agreement', 'Budgeting Tool for Couples'],
            training: ['The SA Constitution', 'Family Law Overview']
        },
        'child_support': {
            forms: ['Child Support Agreement', 'Comprehensive Parenting Plan'],
            training: ['The SA Constitution', 'The Children\'s Act']
        },
    };

    // --- State Variables ---
    let userAnswers = {};
    let stepHistory = [];

    // --- WIZARD FUNCTIONS ---

    function startWizard() {
        hubHeader.classList.add('hidden');
        selectionArea.classList.add('hidden');
        explorerSection.classList.add('hidden');
        wizardSection.classList.remove('hidden');
        goToStep('1');
    }

    function goToStep(stepId) {
        stepHistory.push(stepId);
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        const nextStepEl = document.getElementById(`step-${stepId}`);
        if(nextStepEl) nextStepEl.classList.add('active');
        updateWizardNav();
    }

    function goBack() {
        if (stepHistory.length <= 1) return;
        stepHistory.pop();
        const previousStepId = stepHistory[stepHistory.length - 1];
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${previousStepId}`).classList.add('active');
        updateWizardNav();
    }
    
    function updateWizardNav() {
        const currentStep = stepHistory[stepHistory.length - 1];
        backBtn.disabled = stepHistory.length <= 1;

        const totalSteps = 2;
        const currentStepNumber = stepHistory.filter(s => !s.endsWith('A') && !s.endsWith('B') && !s.endsWith('C')).length;
        
        if (progressBar) {
            progressBar.style.width = `${(currentStepNumber / totalSteps) * 100}%`;
        }
        if (stepCounterEl) {
             stepCounterEl.textContent = currentStep === 'results' ? 'Results' : `Step ${currentStepNumber} of ${totalSteps}`;
        }
    }

    function showResults() {
        const finalAnswer = userAnswers['final'];
        const recommendations = wizardLogic[finalAnswer];
        
        if (!recommendations) {
            recommendationContainer.innerHTML = `<p class="text-center text-gray-400">Could not determine recommendation. Please try again.</p>`;
        } else {
            let formsHtml = recommendations.forms.map(key => {
                const resource = resources[key];
                return `<li><a href="assets/templates/${resource.file}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"><i class="fas fa-file-alt text-lg text-blue-400"></i><span>${key}</span></a></li>`;
            }).join('');

            let trainingHtml = recommendations.training.map(key => {
                const resource = resources[key];
                return `<li><a href="${resource.url}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"><i class="fas fa-graduation-cap text-lg text-yellow-400"></i><span>${key}</span></a></li>`;
            }).join('');

            recommendationContainer.innerHTML = `
                <div>
                    <h4 class="text-xl font-bold text-white mb-3">Recommended Forms & Tools</h4>
                    <ul class="space-y-2">${formsHtml}</ul>
                </div>
                <div class="mt-6">
                    <h4 class="text-xl font-bold text-white mb-3">Recommended Training</h4>
                    <ul class="space-y-2">${trainingHtml}</ul>
                </div>
            `;
        }
        goToStep('results');
    }

    // --- EXPLORER FUNCTIONS ---
    function showExplorer() {
        // Logic for showing explorer... (from previous version)
        hubHeader.classList.add('hidden');
        selectionArea.classList.add('hidden');
        wizardSection.classList.add('hidden');
        explorerSection.classList.remove('hidden');
    }
    
    // --- UI TOGGLING & EVENT LISTENERS ---
    function resetToSelection() {
        hubHeader.classList.remove('hidden');
        selectionArea.classList.remove('hidden');
        wizardSection.classList.add('hidden');
        explorerSection.classList.add('hidden');
        stepHistory = [];
        userAnswers = {};
    }

    wizardBtn.addEventListener('click', startWizard);
    backBtn.addEventListener('click', goBack);
    backToSelectionWizard.addEventListener('click', resetToSelection);
    backToSelectionExplorer.addEventListener('click', resetToSelection);

    document.querySelectorAll('.wizard-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const currentStepEl = e.currentTarget.closest('.wizard-step');
            const stepId = currentStepEl.id;
            const nextStepId = e.currentTarget.dataset.next;
            
            // This is the final decision point before results
            if (nextStepId === 'results') {
                userAnswers['final'] = e.currentTarget.dataset.answer;
                showResults();
            } else {
                goToStep(nextStepId);
            }
        });
    });

    // --- MANUAL EXPLORER --- (copied from previous version, simplified)
    explorerBtn.addEventListener('click', showExplorer);
    
    const allForms = [
        { name: 'General Affidavit', file: 'Affidavit_General_Template.html' },
        { name: 'SAPS Complaint Affidavit', file: 'Affidavit-SAPS_Complaint_.html' },
        { name: 'Commissioner of Oaths Declaration', file: 'Commissioner_of_Oaths_Declaration.html' },
        { name: 'Informal Notification of Parental Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Iinformal.html' },
        { name: 'Formal Notification of Parental Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Formal.html' },
        { name: 'Final Letter on Constitutional Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_final.html' },
        { name: 'Father’s Notification (Accepting Damages)', file: 'Damages_Accepting_Letter.html' },
        { name: 'General Letter to School', file: 'School_Letter_General_Template.html' },
        { name: 'Request for School Transfer', file: 'School_Letter_Transfer_Template.html' },
        { name: 'Budgeting Tool for Couples', file: 'Budget_Couples.html' },
        { name: 'Child Support Agreement', file: 'Child_Support_Agreement.html' },
        { name: 'Cohabitation Agreement', file: 'Cohabitation_Agreement.html' },
        { name: 'Commission for Gender Equality Complaint', file: 'Commission_Gender_Equality.html' },
        { name: 'Legal Practice Council Complaint', file: 'Legal_Practice_Council_Complaint.html' },
        { name: 'Magistrates Commission Complaint', file: 'Magistrates_Commission_Complaint_Template.html' },
        { name: 'Public Protector Complaint', file: 'Public_Protector_Complaint.html' },
        { name: 'SA Law Reform Commission Request', file: 'SALRC_Request_Family_Law_Reform.html' },
        { name: 'Medical Record Request', file: 'Medical_Record_Request_Template.html' },
        { name: 'Pre-Birth Planning Guide', file: 'Pre_Birth_Planning_Guide.html' },
        { name: 'Comprehensive Parenting Plan', file: 'Parenting_Plan_Template.html' },
        { name: 'Post-Separation Communication Plan', file: 'Communication_Plan.html' },
        { name: 'Mediation Request Letter', file: 'Mediation_Request_Letter.html' },
        { name: 'Conflict Resolution Worksheet', file: 'Conflict_Resolution_Worksheet.html' }
    ];

    let listHtml = allForms.map(form => `
        <li>
            <a href="assets/templates/${form.file}" target="_blank" class="flex items-center justify-between p-3 rounded-md hover:bg-gray-700 transition-colors duration-200">
                <span><i class="far fa-file-alt mr-3 text-gray-400"></i>${form.name}</span>
                <i class="fas fa-external-link-alt text-sm text-gray-500"></i>
            </a>
        </li>
    `).join('');
    
    explorerSection.insertAdjacentHTML('afterbegin', `<h2 class="text-3xl font-bold text-center mb-6">All Forms & Templates</h2><ul class="space-y-2">${listHtml}</ul>`);

});
