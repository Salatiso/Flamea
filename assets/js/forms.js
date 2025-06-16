// assets/js/forms.js

// Note: Firebase is initialized in main.js and attached to the window.
// This script assumes window.flamea.auth and window.flamea.db are available.

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the forms page by looking for a key element.
    const wizardBtn = document.getElementById('start-wizard-btn');
    if (!wizardBtn) return; 
    
    // --- DOM ELEMENTS ---
    const explorerBtn = document.getElementById('explore-forms-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');

    // --- DATA ---
    const formsData = {
        parental: {
            title: "Parental Rights & Obligations",
            icon: "fa-child",
            color: "blue-500",
            forms: [
                { name: "Form for Acknowledging Paternity", act: "Births and Deaths Registration Act", purpose: "To legally register the father’s name when a child is born out of wedlock.", interactive: true, id: "ack-paternity" },
                { name: "Application to Confirm Paternity (Court)", act: "Children’s Act, Sec. 21", purpose: "Used when the mother refuses to acknowledge the father, to compel testing or secure parental rights.", interactive: true, id: "confirm-paternity" },
                { name: "Form 02 [J767]: Bring Matters to Children’s Court", act: "Children’s Act, Sec. 53", purpose: "To file disputes about care, guardianship, contact (access), or protection of a child.", interactive: true, id: "form-j767" },
                { name: "Form 10 [J779]: Register Parenting Plan", act: "Children’s Act, Sec. 34", purpose: "To register a finalized parenting plan with the Family Advocate or court to make it legally enforceable.", interactive: false, externalUrl: "https://www.justice.gov.za/forms/form_cj.html" },
                { name: "Request for Mediation (Family Advocate)", act: "Mediation in Certain Divorce Matters Act", purpose: "To formally request mediation services for disputes over parental rights and responsibilities.", interactive: true, id: "req-mediation" },
                { name: "Affidavit", act: "Justices of the Peace and Commissioners of Oaths Act", purpose: "A general sworn statement of facts to support any court application or legal process.", interactive: true, id: "affidavit" },
            ]
        },
        equality: {
            title: "Equality & Criminal Law",
            icon: "fa-gavel",
            color: "red-500",
            forms: [
                { name: "Equality Court Form 2: Complaint of Unfair Discrimination", act: "Promotion of Equality and Prevention of Unfair Discrimination Act", purpose: "To formally lodge a complaint of discrimination based on gender, race, or other grounds.", interactive: false, externalUrl: "https://www.justice.gov.za/forms/form_eq.html" },
                { name: "Criminal Complaint Affidavit", act: "Criminal Procedure Act", purpose: "To provide a sworn statement to the South African Police Service (SAPS) when reporting a crime like abduction.", interactive: true, id: "saps-complaint" },
                { name: "Victim Impact Statement", act: "Criminal Procedure Act", purpose: "To explain to the court how a crime has affected you, which is considered during sentencing.", interactive: true, id: "victim-impact" },
            ]
        }
    };

    const wizardLogic = {
        parental: [
            { text: "Acknowledge I am the father", formId: "ack-paternity" },
            { text: "Go to court to prove I am the father", formId: "confirm-paternity" },
            { text: "Settle a dispute about my child (custody/access)", formId: "form-j767" },
            { text: "Ask for a mediator to help", formId: "req-mediation" },
        ],
        court: [
            { text: "Start a case in the Children's Court", formId: "form-j767" },
            { text: "Make a sworn statement (Affidavit)", formId: "affidavit" },
        ]
    };

    // --- RENDER FUNCTIONS ---
    const renderWizard = () => {
        wizardSection.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 text-white">Simple Start Wizard</h2>
            <div class="space-y-6">
                <div>
                    <label for="wizard-step1" class="block mb-2 text-lg font-semibold text-gray-300">What is your primary goal?</label>
                    <select id="wizard-step1" class="form-select w-full bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <option value="">-- Select a goal --</option>
                        <option value="parental">I need to establish or manage my parental rights.</option>
                        <option value="court">I need to prepare for a court-related matter.</option>
                    </select>
                </div>
                <div id="wizard-step2-container" class="hidden">
                    <label for="wizard-step2" class="block mb-2 text-lg font-semibold text-gray-300">What specific action do you need to take?</label>
                    <select id="wizard-step2" class="form-select w-full bg-gray-700 p-3 rounded-lg border border-gray-600">
                        <!-- Options will be populated here -->
                    </select>
                </div>
            </div>
            <div id="wizard-results" class="mt-8 hidden">
                <h3 class="text-xl font-bold text-green-400 mb-4">Recommended Form:</h3>
                <div id="wizard-form-recommendation"></div>
            </div>
        `;
        attachWizardListeners();
    };

    const renderExplorer = () => {
        explorerSection.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 text-white">Manual Explorer</h2>
            <div id="forms-container" class="space-y-6">
                <!-- Accordions will be rendered here -->
            </div>
        `;
        const formsContainer = explorerSection.querySelector('#forms-container');
        for (const categoryKey in formsData) {
            const category = formsData[categoryKey];
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';
            accordionItem.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg">
                    <span class="text-xl font-bold"><i class="fas ${category.icon} mr-3 text-${category.color}"></i>${category.title}</span>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content mt-4 pl-4 border-l-4 border-${category.color}">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        ${category.forms.map(form => createFormCard(form)).join('')}
                    </div>
                </div>
            `;
            formsContainer.appendChild(accordionItem);
        }
    };

    const createFormCard = (form) => {
        const link = form.externalUrl ? form.externalUrl : (form.interactive ? `#${form.id}` : `/templates/${form.id}.html`);
        const target = form.externalUrl ? 'target="_blank"' : '';
        return `
            <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col">
                <h5 class="font-bold text-white">${form.name}</h5>
                <p class="text-sm text-gray-400 mt-2 flex-grow"><strong>Purpose:</strong> ${form.purpose}</p>
                <div class="mt-4 pt-3 border-t border-gray-600">
                     <a href="${link}" ${target} class="text-blue-400 hover:underline">
                        ${form.externalUrl ? 'Visit Official Site' : 'View Template'} <i class="fas fa-arrow-right ml-1"></i>
                     </a>
                </div>
            </div>
        `;
    };

    // --- EVENT LISTENERS & LOGIC ---
    wizardBtn.addEventListener('click', () => {
        wizardSection.classList.remove('hidden');
        explorerSection.classList.add('hidden');
        renderWizard(); 
    });

    explorerBtn.addEventListener('click', () => {
        explorerSection.classList.remove('hidden');
        wizardSection.classList.add('hidden');
        renderExplorer();
    });

    function attachWizardListeners() {
        const wizardStep1 = document.getElementById('wizard-step1');
        const wizardStep2Container = document.getElementById('wizard-step2-container');
        const wizardStep2 = document.getElementById('wizard-step2');
        const wizardResults = document.getElementById('wizard-results');
        const wizardRecommendation = document.getElementById('wizard-form-recommendation');

        wizardStep1.addEventListener('change', () => {
            const selection = wizardStep1.value;
            wizardStep2.innerHTML = '<option value="">-- Please select --</option>';
            wizardResults.classList.add('hidden');
            if (selection && wizardLogic[selection]) {
                wizardLogic[selection].forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.formId;
                    opt.textContent = option.text;
                    wizardStep2.appendChild(opt);
                });
                wizardStep2Container.classList.remove('hidden');
            } else {
                wizardStep2Container.classList.add('hidden');
            }
        });

        wizardStep2.addEventListener('change', () => {
            const formId = wizardStep2.value;
            if (!formId) {
                wizardResults.classList.add('hidden');
                return;
            }
            let foundForm = null;
            for (const category in formsData) {
                const form = formsData[category].forms.find(f => f.id === formId);
                if (form) {
                    foundForm = form;
                    break;
                }
            }
            if (foundForm) {
                wizardRecommendation.innerHTML = createFormCard(foundForm);
                wizardResults.classList.remove('hidden');
            }
        });
    }

});

