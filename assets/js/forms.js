document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-forms-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const selectionArea = document.getElementById('selection-area');
    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');

    // --- Data: Form Templates Categorized ---
    const formCategories = [
        {
            category: 'Legal & Affidavits',
            icon: 'fa-gavel',
            description: 'Sworn statements and official declarations for legal use.',
            forms: [
                { name: 'General Affidavit', file: 'Affidavit_General_Template.html' },
                { name: 'SAPS Complaint Affidavit', file: 'Affidavit-SAPS_Complaint_.html' },
                { name: 'Commissioner of Oaths Declaration', file: 'Commissioner_of_Oaths_Declaration.html' }
            ]
        },
        {
            category: 'Parental Rights & Communication',
            icon: 'fa-comments',
            description: 'Establish rights, responsibilities, and communication protocols.',
            forms: [
                { name: 'Informal Notification of Parental Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Iinformal.html' },
                { name: 'Formal Notification of Parental Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_Formal.html' },
                { name: 'Final Letter on Constitutional Rights', file: 'Affirmation_Parental_Rights_and_Responsibilities_final.html' },
                { name: 'Father’s Notification (Accepting Damages)', file: 'Damages_Accepting_Letter.html' },
                { name: 'General Letter to School', file: 'School_Letter_General_Template.html' },
                { name: 'Request for School Transfer', file: 'School_Letter_Transfer_Template.html' }
            ]
        },
        {
            category: 'Financial & Relationship Agreements',
            icon: 'fa-file-signature',
            description: 'Define financial duties and structure relationship terms.',
            forms: [
                { name: 'Budgeting Tool for Couples', file: 'Budget_Couples.html' },
                { name: 'Child Support Agreement', file: 'Child_Support_Agreement.html' },
                { name: 'Cohabitation Agreement', file: 'Cohabitation_Agreement.html' }
            ]
        },
        {
            category: 'Official Complaints & Requests',
            icon: 'fa-bullhorn',
            description: 'Lodge formal complaints or make official requests to institutions.',
            forms: [
                { name: 'Commission for Gender Equality Complaint', file: 'Commission_Gender_Equality.html' },
                { name: 'Legal Practice Council Complaint', file: 'Legal_Practice_Council_Complaint.html' },
                { name: 'Magistrates Commission Complaint', file: 'Magistrates_Commission_Complaint_Template.html' },
                { name: 'Public Protector Complaint', file: 'Public_Protector_Complaint.html' },
                { name: 'SA Law Reform Commission Request', file: 'SALRC_Request_Family_Law_Reform.html' },
                { name: 'Medical Record Request', file: 'Medical_Record_Request_Template.html' }
            ]
        },
        {
            category: 'Planning, Mediation & Worksheets',
            icon: 'fa-tasks',
            description: 'Tools for planning, resolving disputes, and organizing co-parenting.',
            forms: [
                { name: 'Pre-Birth Planning Guide', file: 'Pre_Birth_Planning_Guide.html' },
                { name: 'Comprehensive Parenting Plan', file: 'Parenting_Plan_Template.html' },
                { name: 'Post-Separation Communication Plan', file: 'Communication_Plan.html' },
                { name: 'Mediation Request Letter', file: 'Mediation_Request_Letter.html' },
                { name: 'Conflict Resolution Worksheet', file: 'Conflict_Resolution_Worksheet.html' }
            ]
        }
    ];

    // --- Function to build the explorer HTML ---
    const buildExplorer = () => {
        // Clear existing content except for the 'back' button
        explorerSection.innerHTML = '';
        formCategories.forEach((cat) => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item bg-gray-800 rounded-lg shadow-md';

            const header = document.createElement('div');
            header.className = 'accordion-header flex justify-between items-center p-5';
            header.innerHTML = `
                <div class="flex items-center space-x-4">
                    <i class="fas ${cat.icon} text-2xl text-green-400 w-8 text-center"></i>
                    <div>
                        <h3 class="text-xl font-bold text-white">${cat.category}</h3>
                        <p class="text-sm text-gray-400">${cat.description}</p>
                    </div>
                </div>
                <i class="fas fa-chevron-right accordion-icon text-gray-400"></i>
            `;

            const content = document.createElement('div');
            content.className = 'accordion-content border-t border-gray-700';
            
            const list = document.createElement('ul');
            list.className = 'p-5 space-y-3';
            
            cat.forms.forEach(form => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="assets/templates/${form.file}" target="_blank" class="flex items-center justify-between p-3 rounded-md hover:bg-gray-700 transition-colors duration-200">
                        <span><i class="far fa-file-alt mr-3 text-gray-400"></i>${form.name}</span>
                        <i class="fas fa-external-link-alt text-sm text-gray-500"></i>
                    </a>
                `;
                list.appendChild(listItem);
            });

            content.appendChild(list);
            accordionItem.appendChild(header);
            accordionItem.appendChild(content);
            explorerSection.appendChild(accordionItem);

            header.addEventListener('click', () => {
                accordionItem.classList.toggle('active');
            });
        });
        // Re-append the back button after clearing
        explorerSection.appendChild(backToSelectionExplorer);
    };

    // --- Event Listeners for Wizard/Explorer Buttons ---
    const showExplorer = () => {
        selectionArea.classList.add('hidden');
        wizardSection.classList.add('hidden');
        explorerSection.classList.remove('hidden');
    };

    const showWizard = () => {
        selectionArea.classList.add('hidden');
        explorerSection.classList.add('hidden');
        wizardSection.classList.remove('hidden');
    };

    const showSelection = () => {
        wizardSection.classList.add('hidden');
        explorerSection.classList.add('hidden');
        selectionArea.classList.remove('hidden');
    };
    
    if (explorerBtn) explorerBtn.addEventListener('click', showExplorer);
    if (wizardBtn) wizardBtn.addEventListener('click', showWizard);
    if (backToSelectionExplorer) backToSelectionExplorer.addEventListener('click', showSelection);
    if (backToSelectionWizard) backToSelectionWizard.addEventListener('click', showSelection);


    // --- Initial Page Load ---
    buildExplorer();
});
