document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionArea = document.getElementById('selection-area');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-forms-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const hubHeader = document.getElementById('hub-header');

    if (!selectionArea) return; // Exit if not on the correct page

    // --- Data Definitions ---
    const resources = {
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
        'The SA Constitution': { type: 'training', url: 'training/course-constitution.html' },
        "The Children's Act": { type: 'training', url: 'training/course-childrens-act.html' },
        'Co-Parenting 101': { type: 'training', url: 'training/course-coparenting.html' },
        'Family Law Overview': { type: 'training', url: 'training/course-family-law.html' },
        "A Father's Shield": { type: 'training', url: 'training/course-fathers-shield.html' },
    };

    const wizardLogic = {
        'establish_rights': { forms: ['Informal Parental Rights Letter', 'Formal Parental Rights Letter', 'Final Letter on Constitutional Rights'], training: ['The SA Constitution', "The Children's Act"] },
        'resolve_conflict': { forms: ['Mediation Request Letter', 'Conflict Resolution Worksheet', 'Comprehensive Parenting Plan'], training: ['The SA Constitution', 'Co-Parenting 101'] },
        'court_action': { forms: ['General Affidavit', 'Comprehensive Parenting Plan'], training: ['The SA Constitution', "The Children's Act", 'Family Law Overview'] },
        'school': { forms: ['General Letter to School', 'Request for School Transfer'], training: ['The SA Constitution', "The Children's Act"] },
        'legal_body': { forms: ['General Affidavit', 'Legal Practice Council Complaint', 'Magistrates Commission Complaint'], training: ['The SA Constitution', "A Father's Shield"] },
        'gov_body': { forms: ['General Affidavit', 'Public Protector Complaint', 'Commission for Gender Equality Complaint', 'SA Law Reform Commission Request'], training: ['The SA Constitution', "A Father's Shield"] },
        'cohabitation': { forms: ['Cohabitation Agreement', 'Budgeting Tool for Couples'], training: ['The SA Constitution', 'Family Law Overview'] },
        'child_support': { forms: ['Child Support Agreement', 'Comprehensive Parenting Plan'], training: ['The SA Constitution', "The Children's Act"] },
    };

    // --- State & UI Control ---
    let stepHistory = [];
    let userAnswers = {};

    const showView = (viewName) => {
        hubHeader.style.display = viewName === 'selection' ? 'block' : 'none';
        selectionArea.style.display = viewName === 'selection' ? 'grid' : 'none';
        wizardSection.style.display = viewName === 'wizard' ? 'block' : 'none';
        explorerSection.style.display = viewName === 'explorer' ? 'block' : 'none';
    };

    // --- Wizard Functionality ---
    const startWizard = () => {
        userAnswers = {};
        stepHistory = ['1'];
        showView('wizard');
        renderStep('1');
    };

    const goToStep = (stepId) => {
        stepHistory.push(stepId);
        renderStep(stepId);
    };
    
    const goBack = () => {
        if (stepHistory.length <= 1) return;
        stepHistory.pop();
        renderStep(stepHistory[stepHistory.length - 1]);
    };

    const renderStep = (stepId) => {
        document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
        const stepEl = document.getElementById(`step-${stepId}`);
        if(stepEl) stepEl.classList.add('active');
        updateWizardNav();
    };

    const updateWizardNav = () => {
        const backBtn = document.getElementById('back-btn');
        const progressBar = document.getElementById('progress-bar');
        const stepCounter = document.getElementById('step-counter');
        const progressContainer = document.getElementById('progress-container');

        const isResultStep = stepHistory[stepHistory.length - 1] === 'results';
        
        backBtn.disabled = stepHistory.length <= 1;
        progressContainer.style.visibility = isResultStep ? 'hidden' : 'visible';
        
        if (!isResultStep) {
            const stepNumber = stepHistory.length;
            const totalSteps = 2;
            progressBar.style.width = `${(stepNumber / totalSteps) * 100}%`;
            stepCounter.textContent = `Step ${stepNumber} of ${totalSteps}`;
        }
    };

    const renderResults = () => {
        const finalAnswer = userAnswers.finalAnswer;
        const recommendations = wizardLogic[finalAnswer];
        const recommendationContainer = document.getElementById('recommendation-container');
        
        if (!recommendations) {
            recommendationContainer.innerHTML = `<p class="text-center text-gray-400">Could not determine recommendation. Please try again or use the Manual Explorer.</p>`;
        } else {
            const createLink = (key, resource) => {
                const iconClass = resource.type === 'form' ? 'fa-file-alt text-blue-400' : 'fa-graduation-cap text-yellow-400';
                const url = resource.type === 'form' ? `assets/templates/${resource.file}` : resource.url;
                return `<li><a href="${url}" target="_blank" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors"><i class="fas ${iconClass} text-lg w-6 text-center"></i><span>${key}</span></a></li>`;
            };
            
            const formsHtml = recommendations.forms.map(key => createLink(key, resources[key])).join('');
            const trainingHtml = recommendations.training.map(key => createLink(key, resources[key])).join('');

            recommendationContainer.innerHTML = `
                <div>
                    <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-file-signature mr-2"></i>Recommended Forms</h4>
                    <ul class="space-y-2">${formsHtml}</ul>
                </div>
                <div class="mt-6">
                    <h4 class="text-xl font-bold text-white mb-3"><i class="fas fa-book-reader mr-2"></i>Recommended Training</h4>
                    <ul class="space-y-2">${trainingHtml}</ul>
                </div>`;
        }
        
        goToStep('results');
    };

    // --- Explorer Functionality ---
    const buildExplorer = () => {
        const explorerContent = document.getElementById('explorer-content');
        const categories = {
            'Legal & Affidavits': { icon: 'fa-gavel', forms: ['General Affidavit', 'SAPS Complaint Affidavit', 'Commissioner of Oaths Declaration'] },
            'Parental Rights & Communication': { icon: 'fa-comments', forms: ['Informal Parental Rights Letter', 'Formal Parental Rights Letter', 'Final Letter on Constitutional Rights', 'General Letter to School', 'Request for School Transfer'] },
            'Financial & Relationship Agreements': { icon: 'fa-file-signature', forms: ['Budgeting Tool for Couples', 'Child Support Agreement', 'Cohabitation Agreement'] },
            'Official Complaints & Requests': { icon: 'fa-bullhorn', forms: ['Commission for Gender Equality Complaint', 'Legal Practice Council Complaint', 'Magistrates Commission Complaint', 'Public Protector Complaint', 'SA Law Reform Commission Request', 'Medical Record Request'] },
            'Planning, Mediation & Worksheets': { icon: 'fa-tasks', forms: ['Pre-Birth Planning Guide', 'Comprehensive Parenting Plan', 'Post-Separation Communication Plan', 'Mediation Request Letter', 'Conflict Resolution Worksheet'] }
        };

        let explorerHtml = '';
        for (const category in categories) {
            explorerHtml += `
                <div class="accordion-item bg-gray-800 rounded-lg shadow-md">
                    <div class="accordion-header flex justify-between items-center p-5">
                        <div class="flex items-center space-x-4">
                            <i class="fas ${categories[category].icon} text-2xl text-blue-400 w-8 text-center"></i>
                            <h3 class="text-xl font-bold text-white">${category}</h3>
                        </div>
                        <i class="fas fa-chevron-right accordion-icon text-gray-400"></i>
                    </div>
                    <div class="accordion-content border-t border-gray-700 p-5">
                        <ul class="space-y-2">
                            ${categories[category].forms.map(key => {
                                const resource = resources[key];
                                return `<li><a href="assets/templates/${resource.file}" target="_blank" class="flex items-center justify-between p-3 rounded-md hover:bg-gray-700 transition-colors duration-200">
                                    <span><i class="far fa-file-alt mr-3 text-gray-400"></i>${key}</span><i class="fas fa-external-link-alt text-sm text-gray-500"></i></a></li>`;
                            }).join('')}
                        </ul>
                    </div>
                </div>`;
        }
        explorerContent.innerHTML = explorerHtml;
        
        explorerContent.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    };
    
    // --- Event Listeners ---
    wizardBtn.addEventListener('click', startWizard);
    explorerBtn.addEventListener('click', () => showView('explorer'));
    document.getElementById('back-to-selection-wizard').addEventListener('click', () => showView('selection'));
    document.getElementById('back-to-selection-explorer').addEventListener('click', () => showView('selection'));
    document.getElementById('back-btn').addEventListener('click', goBack);

    document.querySelectorAll('.wizard-option').forEach(button => {
        button.addEventListener('click', e => {
            const target = e.currentTarget;
            const nextStepId = target.dataset.next;
            
            if (nextStepId === 'results') {
                userAnswers.finalAnswer = target.dataset.answer;
                renderResults();
            } else {
                goToStep(nextStepId);
            }
        });
    });

    // --- Initial Load ---
    buildExplorer();
    showView('selection'); // Start at the selection view
});
