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
        constitutional: {
            title: "Constitutional Rights & Complaints",
            icon: "fa-landmark",
            color: "green-500",
            forms: [
                { name: "Complaint to the SA Human Rights Commission", act: "Human Rights Commission Act", purpose: "To lodge a formal complaint about a violation of a right in the Bill of Rights.", interactive: true, id: "sahrc-complaint" },
                { name: "Letter of Demand Citing Constitutional Rights", act: "The Constitution", purpose: "A formal letter to an individual or entity, demanding action/inaction based on a constitutional right (e.g., right to privacy, administrative justice).", interactive: true, id: "constitutional-demand" },
                { name: "Request for Information (PAIA)", act: "Promotion of Access to Information Act", purpose: "To formally request records from a public or private body to exercise or protect any right.", interactive: false, template: "paia_request.html" },
            ]
        },
        equality: {
            title: "Equality, Justice & Criminal Law",
            icon: "fa-gavel",
            color: "red-500",
            forms: [
                { name: "Equality Court Form 2: Complaint of Unfair Discrimination", act: "Promotion of Equality and Prevention of Unfair Discrimination Act", purpose: "To formally lodge a complaint of discrimination based on gender, race, or other grounds.", interactive: false, externalUrl: "https://www.justice.gov.za/forms/form_eq.html" },
                { name: "Criminal Complaint Affidavit (SAPS)", act: "Criminal Procedure Act", purpose: "To provide a sworn statement to the South African Police Service (SAPS) when reporting a crime.", interactive: true, id: "saps-complaint" },
            ]
        }
    };

    const wizardLogic = {
        rights_violation: [
            { text: "My constitutional rights were violated by a person or company.", formId: "constitutional-demand" },
            { text: "My constitutional rights were violated by a government department.", formId: "sahrc-complaint" },
            { text: "I need information from a company/government to protect my rights.", formId: "paia_request.html" },
        ],
        crime_discrimination: [
            { text: "I need to report a crime to the police.", formId: "saps-complaint" },
            { text: "I have been unfairly discriminated against.", formId: "equality-court-form-2" },
        ]
    };

    // --- RENDER FUNCTIONS ---
    const renderWizard = () => {
        wizardSection.innerHTML = `
            <h2 class="text-3xl font-bold mb-6 text-white text-center">Simple Start Wizard</h2>
            <div class="space-y-6">
                <div>
                    <label for="wizard-step1" class="block mb-2 text-lg font-semibold text-gray-300">What is your primary goal?</label>
                    <select id="wizard-step1" class="form-select w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500">
                        <option value="">-- Select a goal --</option>
                        <option value="rights_violation">I want to address a violation of my constitutional rights.</option>
                        <option value="crime_discrimination">I need to address a crime or case of discrimination.</option>
                    </select>
                </div>
                <div id="wizard-step2-container" class="hidden">
                    <label for="wizard-step2" class="block mb-2 text-lg font-semibold text-gray-300">What specific action do you need to take?</label>
                    <select id="wizard-step2" class="form-select w-full bg-gray-700 p-3 rounded-lg border border-gray-600"></select>
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
            <h2 class="text-3xl font-bold mb-8 text-white text-center">Manual Form Explorer</h2>
            <div id="forms-container" class="space-y-6"></div>
        `;
        const formsContainer = explorerSection.querySelector('#forms-container');
        for (const categoryKey in formsData) {
            const category = formsData[categoryKey];
            const accordionItem = document.createElement('div');
            accordionItem.className = 'bg-gray-800 rounded-lg overflow-hidden border border-gray-700';
            accordionItem.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4">
                    <span class="text-xl font-bold"><i class="fas ${category.icon} mr-3 text-${category.color}"></i>${category.title}</span>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content hidden p-4 border-t border-gray-700">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${category.forms.map(form => createFormCard(form)).join('')}
                    </div>
                </div>
            `;
            formsContainer.appendChild(accordionItem);
        }
        attachAccordionListeners();
    };

    const createFormCard = (form) => {
        const link = form.externalUrl ? form.externalUrl : (form.template ? `templates/${form.template}` : `#`);
        const target = (form.externalUrl || form.template) ? 'target="_blank"' : '';
        const ctaText = form.externalUrl ? 'Visit Official Site' : (form.template ? 'Open Template' : 'Start Interactive Form');
        const ctaIcon = form.externalUrl ? 'fa-external-link-alt' : (form.template ? 'fa-file-alt' : 'fa-magic');
        return `
            <div class="bg-gray-900 p-4 rounded-lg border border-gray-700 flex flex-col hover:border-blue-500 transition-colors">
                <h5 class="font-bold text-white">${form.name}</h5>
                <p class="text-sm text-gray-400 mt-2 flex-grow"><strong>Purpose:</strong> ${form.purpose}</p>
                <div class="mt-4 pt-3 border-t border-gray-600">
                    <a href="${link}" ${target} class="text-blue-400 hover:underline inline-flex items-center gap-2 font-semibold">
                        ${ctaText} <i class="fas ${ctaIcon}"></i>
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

    function attachAccordionListeners() {
        document.querySelectorAll('.accordion-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('.fa-chevron-down');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-180');
            });
        });
    }
    
    function attachWizardListeners() {
        // ... (Wizard logic adapted from flamea's forms.js would go here)
        console.log("Wizard listeners should be attached.");
    }

    // Initial state on page load can be empty or default to one view
    // renderExplorer(); // Optionally show the explorer by default
});
