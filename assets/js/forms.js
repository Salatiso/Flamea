document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionView = document.getElementById('selection-view');
    const wizardView = document.getElementById('wizard-view');
    const explorerView = document.getElementById('explorer-view');

    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-forms-btn');
    const featuredToolCard = document.getElementById('featured-tool-card');

    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');

    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');

    // Exit if the main containers aren't on this page
    if (!selectionView || !wizardView || !explorerView) return;

    // --- Data: Forms and Wizard Questions ---
    const formsDatabase = [
        { id: 'informal_rights', title: 'Informal Parental Rights Letter', category: 'parental_rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Iinformal.html' },
        { id: 'formal_rights', title: 'Formal Parental Rights Letter', category: 'parental_rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Formal.html' },
        { id: 'final_rights', title: 'Final Letter on Constitutional Rights', category: 'parental_rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_final.html' },
        { id: 'mediation_request', title: 'Mediation Request Letter', category: 'dispute_resolution', file: 'Mediation_Request_Letter.html' },
        { id: 'conflict_worksheet', title: 'Conflict Resolution Worksheet', category: 'dispute_resolution', file: 'Conflict_Resolution_Worksheet.html' },
        { id: 'parenting_plan', title: 'Comprehensive Parenting Plan', category: 'agreements', file: 'Parenting_Plan_Template.html' },
        { id: 'general_affidavit', title: 'General Affidavit', category: 'legal_documents', file: 'Affidavit_General_Template.html' },
        { id: 'school_general', title: 'General Letter to School', category: 'school_communication', file: 'School_Letter_General_Template.html' },
        { id: 'school_transfer', title: 'School Transfer Request', category: 'school_communication', file: 'School_Letter_Transfer_Template.html' },
        { id: 'saps_complaint', title: 'Affidavit for SAPS Complaint', category: 'institutional_complaints', file: 'Affidavit-SAPS_Complaint_.html' },
        { id: 'cge_complaint', title: 'Commission for Gender Equality Complaint', category: 'institutional_complaints', file: 'Commission_Gender_Equality.html' },
        { id: 'lpc_complaint', title: 'Legal Practice Council Complaint', category: 'institutional_complaints', file: 'Legal_Practice_Council_Complaint.html' },
        { id: 'magistrates_complaint', title: 'Magistrates Commission Complaint', category: 'institutional_complaints', file: 'Magistrates_Commission_Complaint_Template.html' },
        { id: 'public_protector', title: 'Public Protector Complaint', category: 'institutional_complaints', file: 'Public_Protector_Complaint.html' }
    ];

    const formCategories = {
        parental_rights: { name: 'Parental Rights Affirmation', icon: 'fa-child-reaching' },
        dispute_resolution: { name: 'Dispute Resolution', icon: 'fa-handshake-angle' },
        agreements: { name: 'Agreements & Plans', icon: 'fa-file-signature' },
        legal_documents: { name: 'Legal & Official Documents', icon: 'fa-gavel' },
        school_communication: { name: 'School Communication', icon: 'fa-school' },
        institutional_complaints: { name: 'Institutional Complaints', icon: 'fa-building-columns' }
    };

    const wizardQuestions = {
        start: {
            question: "What is the nature of your current challenge?",
            options: [
                { text: "Issues with the other parent", next: "parent_issues" },
                { text: "Issues with an official institution", next: "institution_issues" },
                { text: "I need to formalize an agreement", next: "agreement_issues" },
            ]
        },
        parent_issues: {
            question: "What kind of issue are you facing with the other parent?",
            options: [
                { text: "My rights as a parent are being ignored.", results: ['informal_rights', 'formal_rights', 'general_affidavit'] },
                { text: "We need help resolving a specific conflict.", results: ['mediation_request', 'conflict_worksheet'] },
            ]
        },
        institution_issues: {
            question: "Which institution are you having issues with?",
            options: [
                { text: "The Police (SAPS)", results: ['saps_complaint', 'general_affidavit', 'public_protector'] },
                { text: "A School", results: ['school_general', 'school_transfer', 'general_affidavit'] },
                { text: "A Lawyer or Legal Body", results: ['lpc_complaint', 'magistrates_complaint', 'general_affidavit'] },
                { text: "A Government Department", results: ['public_protector', 'general_affidavit'] },
            ]
        },
        agreement_issues: {
            question: "What kind of agreement do you need to formalize?",
            options: [
                { text: "A comprehensive plan for co-parenting.", results: ['parenting_plan', 'mediation_request'] },
                { text: "A sworn statement (Affidavit).", results: ['general_affidavit', 'saps_complaint'] },
            ]
        }
    };
    
    // --- State Management ---
    let wizardHistory = [];

    // --- View Toggling ---
    const showView = (viewName) => {
        [selectionView, wizardView, explorerView].forEach(v => v.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');
    };

    // --- Featured Tool Logic ---
    const renderFeaturedTool = () => {
        if (!featuredToolCard) return;

        const TWO_DAYS_MS = 48 * 60 * 60 * 1000;
        let featuredToolData = JSON.parse(localStorage.getItem('featuredFormData')) || {};
        const now = new Date().getTime();

        let needsUpdate = !featuredToolData.id || !featuredToolData.timestamp || (now - featuredToolData.timestamp > TWO_DAYS_MS);

        if (needsUpdate) {
            const allFormIds = formsDatabase.map(f => f.id);
            let nextIndex = 0;
            if (featuredToolData.id) {
                const currentIndex = allFormIds.indexOf(featuredToolData.id);
                nextIndex = (currentIndex + 1) % allFormIds.length;
            }
            const newFeaturedId = allFormIds[nextIndex];
            featuredToolData = { id: newFeaturedId, timestamp: now };
            localStorage.setItem('featuredFormData', JSON.stringify(featuredToolData));
        }

        const featuredForm = formsDatabase.find(f => f.id === featuredToolData.id);

        featuredToolCard.innerHTML = `
            <i class="fas fa-star text-5xl text-amber-400 mb-4"></i>
            <h4 class="text-2xl font-bold text-white">Featured Form</h4>
            <p class="text-gray-400 mb-4 font-semibold">${featuredForm.title}</p>
            <a href="assets/templates/${featuredForm.file}" class="inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">View Template</a>
        `;
        featuredToolCard.onclick = () => { window.location.href = `assets/templates/${featuredForm.file}`; };
    };

    // --- Explorer (Manual Selection) Logic ---
    const buildExplorer = () => {
        let explorerHtml = '';
        for (const categoryId in formCategories) {
            const category = formCategories[categoryId];
            const formsInCategory = formsDatabase.filter(form => form.category === categoryId);

            if (formsInCategory.length > 0) {
                explorerHtml += `
                <div class="accordion-item bg-gray-800 rounded-lg">
                    <button class="accordion-header w-full text-left p-6 flex justify-between items-center">
                        <h3 class="text-xl font-bold text-white"><i class="fas ${category.icon} mr-4 text-teal-400"></i>${category.name}</h3>
                        <i class="fas fa-chevron-down text-white transition-transform"></i>
                    </button>
                    <div class="accordion-content px-6 pb-6">
                        <ul class="space-y-3 mt-4">
                            ${formsInCategory.map(form => `
                                <li>
                                    <a href="assets/templates/${form.file}" class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors">
                                        <i class="fas fa-file-alt mr-3 text-gray-400"></i>
                                        <span>${form.title}</span>
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>`;
            }
        }
        explorerSection.innerHTML = explorerHtml;

        explorerSection.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
                const icon = header.querySelector('.fa-chevron-down');
                icon.style.transform = header.parentElement.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        });
    };
    
    // --- Wizard Logic ---
    const renderWizardStep = (stepId) => {
        const step = wizardQuestions[stepId];
        if (!step) return;

        wizardSection.innerHTML = `
            <div class="text-center mb-6">
                <p class="text-amber-400 font-semibold mb-2">Step ${wizardHistory.length} of ${Object.keys(wizardQuestions).length - 1}</p>
                <h2 class="text-3xl font-bold text-white">${step.question}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                ${step.options.map(option => `
                    <button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-next="${option.next || 'results'}" data-results='${JSON.stringify(option.results || [])}'>
                        <span class="font-bold text-lg text-white">${option.text}</span>
                    </button>
                `).join('')}
            </div>
            <div class="mt-8 pt-6 border-t border-gray-700 flex justify-start">
                 <button id="wizard-back-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500">
                    <i class="fas fa-arrow-left mr-2"></i>Back
                </button>
            </div>
        `;
        
        document.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', handleWizardOption));
        const backBtn = document.getElementById('wizard-back-btn');
        backBtn.addEventListener('click', goBack);
        backBtn.disabled = wizardHistory.length <= 1;
    };
    
    const handleWizardOption = (e) => {
        const button = e.currentTarget;
        const nextStepId = button.dataset.next;
        
        wizardHistory.push(nextStepId);

        if (nextStepId === 'results') {
            const results = JSON.parse(button.dataset.results);
            renderWizardResults(results);
        } else {
            renderWizardStep(nextStepId);
        }
    };
    
    const renderWizardResults = (formIds) => {
        const recommendedForms = formIds.map(id => formsDatabase.find(f => f.id === id));
        
        // Add affidavit if any legal action is suggested
        const needsAffidavit = formIds.some(id => ['saps_complaint', 'lpc_complaint', 'magistrates_complaint', 'public_protector'].includes(id));
        if (needsAffidavit && !formIds.includes('general_affidavit')) {
            recommendedForms.push(formsDatabase.find(f => f.id === 'general_affidavit'));
        }

        wizardSection.innerHTML = `
            <div class="text-center">
                <h2 class="text-3xl font-bold text-white mb-4">Your Recommended Documents</h2>
                <p class="text-gray-400 mb-8">Based on your answers, we suggest starting with these templates.</p>
            </div>
            <div class="space-y-4">
                ${recommendedForms.map(form => `
                    <a href="assets/templates/${form.file}" class="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                        <h4 class="font-bold text-white">${form.title}</h4>
                    </a>
                `).join('')}
            </div>
             <div class="mt-8 pt-6 border-t border-gray-700 flex justify-start">
                 <button id="wizard-back-btn" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-600 hover:bg-gray-500">
                    <i class="fas fa-arrow-left mr-2"></i>Back
                </button>
            </div>
        `;
        document.getElementById('wizard-back-btn').addEventListener('click', goBack);
    };

    const goBack = () => {
        if (wizardHistory.length > 1) {
            wizardHistory.pop();
            renderWizardStep(wizardHistory[wizardHistory.length - 1]);
        }
    };

    const startWizard = () => {
        wizardHistory = ['start'];
        renderWizardStep('start');
        showView('wizard');
    };

    // --- Initial Setup ---
    wizardBtn.addEventListener('click', startWizard);
    explorerBtn.addEventListener('click', () => {
        showView('explorer');
        // Bonus: expand all accordions on manual selection click as per blueprint
        explorerSection.querySelectorAll('.accordion-item').forEach(item => item.classList.add('active'));
    });
    
    backToSelectionWizard.addEventListener('click', () => showView('selection'));
    backToSelectionExplorer.addEventListener('click', () => showView('selection'));

    buildExplorer();
    renderFeaturedTool();
    showView('selection'); // Default view
});
