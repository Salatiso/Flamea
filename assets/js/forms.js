// assets/js/forms.js
import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const formsData = {
    parental: {
        title: "Parental Rights & Obligations",
        icon: "fa-child",
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
        forms: [
            { name: "Equality Court Form 2: Complaint of Unfair Discrimination", act: "Promotion of Equality and Prevention of Unfair Discrimination Act", purpose: "To formally lodge a complaint of discrimination based on gender, race, or other grounds.", interactive: false },
            { name: "Criminal Complaint Affidavit", act: "Criminal Procedure Act", purpose: "To provide a sworn statement to the South African Police Service (SAPS) when reporting a crime like abduction.", interactive: false },
            { name: "Victim Impact Statement", act: "Criminal Procedure Act", purpose: "To explain to the court how a crime has affected you, which is considered during sentencing.", interactive: false },
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

const timelineStages = [
    { id: "prep", title: "Preparation", forms: ["ack-paternity"], training: ["course-constitution.html"], achievement: "Ready Dad" },
    { id: "family", title: "Family", forms: ["req-mediation"], training: ["course-co-parenting.html"], achievement: "Family First" },
    { id: "action", title: "Action", forms: ["form-j767"], training: ["course-childrens-act.html"], achievement: "Action Dad" },
    { id: "resolution", title: "Resolution", forms: ["form-j779"], training: [], achievement: "SuperDad" }
];

document.addEventListener('DOMContentLoaded', () => {
    const wizardStep1 = document.getElementById('wizard-step1');
    const wizardStep2Container = document.getElementById('wizard-step2-container');
    const wizardStep2 = document.getElementById('wizard-step2');
    const wizardResults = document.getElementById('wizard-results');
    const wizardRecommendation = document.getElementById('wizard-form-recommendation');
    const formsContainer = document.getElementById('forms-container');
    const timelineContainer = document.getElementById('timeline-container');
    const saveProgressBtn = document.getElementById('save-progress-btn');

    let userProgress = { completedForms: [], achievements: [] };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            loadUserProgress(user.uid);
        } else {
            saveProgressBtn.disabled = true;
            saveProgressBtn.textContent = "Log in to Save Progress";
            saveProgressBtn.addEventListener('click', () => window.location.href = '/login.html');
        }
    });

    async function loadUserProgress(userId) {
        const userRef = doc(db, 'users', userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            userProgress = docSnap.data().progress || { completedForms: [], achievements: [] };
            updateTimeline();
        }
    }

    async function saveProgress() {
        const user = auth.currentUser;
        if (!user) return;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { progress: userProgress }, { merge: true });
        alert("Progress saved successfully!");
    }

    // Wizard Logic
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
            wizardRecommendation.innerHTML = createFormCard(foundForm).innerHTML;
            wizardResults.classList.remove('hidden');
            if (!userProgress.completedForms.includes(formId)) {
                userProgress.completedForms.push(formId);
                checkAchievements();
                updateTimeline();
            }
        }
    });

    // Manual Explorer
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

    const createFormCard = (form) => {
        const card = document.createElement('div');
        card.className = 'form-card bg-gray-900 p-4 rounded-lg border border-gray-700';
        const link = form.externalUrl ? form.externalUrl : (form.interactive ? `#${form.id}` : `/templates/${form.id}.html`);
        card.innerHTML = `
            <div class="form-card-header cursor-pointer flex justify-between items-center">
                <h5 class="font-bold">${form.name}</h5>
                <i class="fas fa-chevron-down transform transition-transform"></i>
            </div>
            <div class="form-card-details text-sm text-gray-400 mt-2 pt-2 border-t border-gray-700">
                <p><strong>Act:</strong> ${form.act}</p>
                <p class="mt-1"><strong>Purpose:</strong> ${form.purpose}</p>
                <div class="flex gap-4 mt-4">
                    <a href="${link}" class="text-blue-400 hover:underline" ${form.externalUrl ? 'target="_blank"' : ''}>${form.externalUrl ? 'Visit Official Site' : 'Download Template'} <i class="fas fa-${form.externalUrl ? 'external-link-alt' : 'download'} ml-1"></i></a>
                    ${form.interactive ? `<button data-form-id="${form.id}" class="start-form-btn bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-md">Start Online</button>` : ''}
                </div>
            </div>
        `;
        return card;
    };

    // Interactive Timeline
    const renderTimeline = () => {
        timelineContainer.innerHTML = `
            <div class="timeline relative border-l-4 border-green-500 pl-6 py-4">
                ${timelineStages.map(stage => `
                    <div class="timeline-stage mb-8" data-stage="${stage.id}">
                        <div class="flex items-center">
                            <div class="w-4 h-4 bg-green-500 rounded-full -ml-8"></div>
                            <h4 class="text-xl font-bold text-white ml-4">${stage.title}</h4>
                        </div>
                        <div class="stage-content hidden ml-4 mt-2 text-gray-300">
                            <p class="font-semibold">Forms:</p>
                            <ul class="list-disc ml-5">${stage.forms.map(f => `<li><a href="#${f}" class="text-blue-400 hover:underline">${formsData.parental.forms.find(form => form.id === f)?.name || f}</a></li>`).join('')}</ul>
                            <p class="font-semibold mt-2">Training:</p>
                            <ul class="list-disc ml-5">${stage.training.map(t => `<li><a href="/training/${t}" class="text-blue-400 hover:underline">${t.split('-')[1].replace('.html', '')}</a></li>`).join('')}</ul>
                            <p class="mt-2"><strong>Achievement:</strong> ${stage.achievement}</p>
                            <div class="progress-bar w-full h-2 bg-gray-700 rounded mt-2"><div class="h-full bg-green-500 rounded" style="width: ${userProgress.achievements.includes(stage.achievement) ? '100%' : '0%'}"></div></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    };

    function updateTimeline() {
        renderTimeline();
        document.querySelectorAll('.timeline-stage').forEach(stage => {
            stage.addEventListener('click', () => {
                const content = stage.querySelector('.stage-content');
                content.classList.toggle('hidden');
            });
        });
    }

    function checkAchievements() {
        timelineStages.forEach(stage => {
            if (stage.forms.every(f => userProgress.completedForms.includes(f)) && !userProgress.achievements.includes(stage.achievement)) {
                userProgress.achievements.push(stage.achievement);
                alert(`Congrats, Dad! You've earned the "${stage.achievement}" badge!`);
            }
        });
    }

    // Event Listeners
    document.body.addEventListener('click', (e) => {
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

        const startBtn = e.target.closest('.start-form-btn');
        if (startBtn) {
            const formId = startBtn.dataset.formId;
            alert(`Starting the interactive wizard for: ${formId}. Keep going, SuperDad!`);
        }
    });

    saveProgressBtn.addEventListener('click', saveProgress);

    // Initial Render
    renderManualExplorer();
    updateTimeline();
});