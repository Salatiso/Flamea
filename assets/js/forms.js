// This object holds all the form data, structured for easy access.
// In a larger application, this would come from a database.
const formsData = {
    parental: {
        title: "Parental Rights & Obligations",
        icon: "fa-child",
        forms: [
            { name: "Form for Acknowledging Paternity", act: "Births and Deaths Registration Act", purpose: "To legally register the father’s name when a child is born out of wedlock.", interactive: true, id: "ack-paternity" },
            { name: "Application to Confirm Paternity (Court)", act: "Children’s Act, Sec. 21", purpose: "Used when the mother refuses to acknowledge the father, to compel testing or secure parental rights.", interactive: true, id: "confirm-paternity" },
            { name: "Form 02 [J767]: Bring Matters to Children’s Court", act: "Children’s Act, Sec. 53", purpose: "To file disputes about care, guardianship, contact (access), or protection of a child.", interactive: true, id: "form-j767" },
            { name: "Form 10 [J779]: Register Parenting Plan", act: "Children’s Act, Sec. 34", purpose: "To register a finalized parenting plan with the Family Advocate or court to make it legally enforceable.", interactive: false },
            { name: "Request for Mediation (Family Advocate)", act: "Mediation in Certain Divorce Matters Act", purpose: "To formally request mediation services for disputes over parental rights and responsibilities.", interactive: true, id: "req-mediation" },
            { name: "Affidavit", act: "Justices of the Peace and Commissioners of Oaths Act", purpose: "A general sworn statement of facts to support any court application or legal process.", interactive: true, id: "affidavit" },
        ]
    },
    equality: {
        title: "Equality & Criminal Law",
        icon: "fa-gavel",
        forms: [
            { name: "Equality Court Form 2: Complaint of Unfair Discrimination", act: "Promotion of Equality and Prevention of Unfair Discrimination Act", purpose: "To formally lodge a complaint of discrimination based on gender, race, or other grounds.", interactive: false },
            { name: "Criminal Complaint Affidavit", act: "Criminal Procedure Act", purpose: "To provide a sworn statement to the South African Police Service (SAPS) when reporting a crime like abduction.", interactive: false },
            { name: "Victim Impact Statement", act: "Criminal Procedure Act", purpose: "To explain to the court how a crime has affected you, which is considered during sentencing.", interactive: false },
        ]
    },
    // Add other categories like 'marriage', 'maintenance' etc. here
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
    ],
    // expand with other wizard logic
};

document.addEventListener('DOMContentLoaded', () => {
    const wizardStep1 = document.getElementById('wizard-step1');
    const wizardStep2Container = document.getElementById('wizard-step2-container');
    const wizardStep2 = document.getElementById('wizard-step2');
    const wizardResults = document.getElementById('wizard-results');
    const wizardRecommendation = document.getElementById('wizard-form-recommendation');
    const formsContainer = document.getElementById('forms-container');

    // --- WIZARD LOGIC ---
    wizardStep1.addEventListener('change', () => {
        const selection = wizardStep1.value;
        wizardStep2.innerHTML = '<option value="">-- Please select --</option>'; // Reset
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

        // Find the form details from the main data object
        let foundForm = null;
        for (const category in formsData) {
            const form = formsData[category].forms.find(f => f.id === formId);
            if (form) {
                foundForm = form;
                break;
            }
        }

        if (foundForm) {
            wizardRecommendation.innerHTML = createFormCard(foundForm).innerHTML;
            wizardResults.classList.remove('hidden');
        }
    });

    // --- MANUAL EXPLORER LOGIC ---
    const renderManualExplorer = () => {
        for (const categoryKey in formsData) {
            const category = formsData[categoryKey];
            const categorySection = document.createElement('div');
            categorySection.innerHTML = `
                <h3 class="text-2xl font-bold text-green-400 mb-4 flex items-center">
                    <i class="fas ${category.icon} mr-3"></i>
                    ${category.title}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${category.forms.map(form => createFormCard(form).outerHTML).join('')}
                </div>
            `;
            formsContainer.appendChild(categorySection);
        }
    };
    
    // --- SHARED FUNCTION TO CREATE FORM CARDS ---
    const createFormCard = (form) => {
        const card = document.createElement('div');
        card.className = 'form-card bg-gray-900 p-4 rounded-lg border border-gray-700';
        card.innerHTML = `
            <div class="form-card-header cursor-pointer flex justify-between items-center">
                <h5 class="font-bold">${form.name}</h5>
                <i class="fas fa-chevron-down transform transition-transform"></i>
            </div>
            <div class="form-card-details text-sm text-gray-400 mt-2 pt-2 border-t border-gray-700">
                <p><strong>Act:</strong> ${form.act}</p>
                <p class="mt-1"><strong>Purpose:</strong> ${form.purpose}</p>
                <div class="flex gap-4 mt-4">
                    <a href="#" class="text-blue-400 hover:underline">Download Template <i class="fas fa-download ml-1"></i></a>
                    ${form.interactive ? `<button data-form-id="${form.id}" class="start-form-btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md">Start Online</button>` : ''}
                </div>
            </div>
        `;
        return card;
    };
    
    // --- EVENT LISTENERS ---
    document.body.addEventListener('click', (e) => {
        // For expanding/collapsing form cards
        const header = e.target.closest('.form-card-header');
        if (header) {
            const details = header.nextElementSibling;
            const icon = header.querySelector('i');
            if (details.style.maxHeight) {
                details.style.maxHeight = null;
                icon.classList.remove('rotate-180');
            } else {
                details.style.maxHeight = details.scrollHeight + "px";
                icon.classList.add('rotate-180');
            }
        }

        // For starting an interactive form wizard
        const startBtn = e.target.closest('.start-form-btn');
        if (startBtn) {
            const formId = startBtn.dataset.formId;
            alert(`Starting the interactive wizard for: ${formId}. This feature is in development.`);
            // Here, you would trigger a modal or navigate to a new page for that specific form's wizard.
        }
    });

    // --- INITIAL RENDER ---
    renderManualExplorer();
});
