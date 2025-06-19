document.addEventListener('DOMContentLoaded', () => {

    // --- DATABASE OF CUSTOMS ---
    const customsData = {
        'initiation-rites': {
            title: 'Initiation Rites',
            icon: 'fa-child-reaching',
            content: {
                xhosa: {
                    name: 'Ulwaluko & Intonjane',
                    text: `<strong>Ulwaluko (Male):</strong> A sacred male initiation involving circumcision and seclusion, teaching manhood and cultural values. It's governed by law to ensure safety. [Ref: <em>Getting to Know Yourself as a South African, Unravelling Xhosa History</em>, p. XX]<br><strong>Intonjane (Female):</strong> A rite for girls post-menstruation, teaching womanhood and community roles without surgical procedures. [Ref: <em>Getting to Know Yourself</em>, p. XX]`
                },
                zulu: {
                    name: 'Thomba & Umemulo',
                    text: '<strong>Thomba:</strong> A puberty ceremony for boys and girls, involving seclusion and education. <strong>Umemulo:</strong> A coming-of-age ceremony for women at 21, signaling marriage readiness.'
                },
                sotho: {
                    name: 'Lebollo',
                    text: 'An initiation for both males (circumcision) and females (non-surgical rituals) to mark their transition to adulthood.'
                },
                global: [
                    { name: 'Maasai (Kenya)', text: 'Male circumcision and warrior training, similar to Ulwaluko.' },
                    { name: 'Aboriginal Australians', text: 'The "walkabout," a rite where boys survive in the wilderness.' }
                ]
            }
        },
        'marriage-customs': {
            title: 'Marriage Customs',
            icon: 'fa-ring',
            content: {
                xhosa: {
                    name: 'Lobola',
                    text: 'The groom’s family negotiates a bride price (lobola), often in cattle, to unite the families and show respect. This is followed by traditional wedding ceremonies. [Ref: <em>Getting to Know Yourself</em>, p. XX]'
                },
                zulu: {
                    name: 'Ilobolo',
                    text: 'Similar to Xhosa custom, ilobolo involves a bride price negotiation, solidifying the union between families.'
                },
                sotho: {
                    name: 'Lobola',
                    text: 'Bride price negotiations precede a two-part wedding that involves both extended families.'
                },
                global: [
                     { name: 'Yoruba (Nigeria)', text: 'Bride price payments strengthen family and community alliances.' },
                     { name: 'China (Historical)', text: 'The groom\'s family provides a bride price to the bride\'s family.' }
                ]
            }
        },
        cuisine: {
            title: 'Cuisine',
            icon: 'fa-utensils',
            content: {
                xhosa: {
                    name: 'Umngqusho & Umqombothi',
                    text: 'Staples include *umngqusho* (maize and beans) and *umcuku* (maize porridge). Meat is central to rituals, and *umqombothi* (traditional beer) is vital for ceremonies. [Ref: <em>Beyond the Grave</em>, p. XX]'
                },
                zulu: {
                    name: 'Pap & Amazi',
                    text: 'A largely vegetarian diet featuring *pap* (maize porridge) and *amazi* (fermented milk).'
                },
                sotho: {
                    name: 'Motoho & Leqebekoane',
                    text: 'Dishes include *motoho* (fermented porridge) and *leqebekoane* (a type of steamed bread).'
                },
                afrikaner: {
                    name: 'Braai & Potjiekos',
                    text: 'A strong tradition of *braai* (barbecue) and *potjiekos* (a slow-cooked stew in a cast-iron pot), central to social gatherings.'
                },
                global: [
                    { name: 'East Africa', text: '*Ugali* is a maize porridge very similar to South African *pap*.' },
                    { name: 'Southern US', text: 'Grits, a ground-corn porridge, shares a common origin with *pap*.' }
                ]
            }
        }
        // ... Other categories (Attire, Festivals, Arts, Beliefs, Governance) would follow the same structure
    };

    // --- DOM ELEMENT REFERENCES ---
    const selectionArea = document.getElementById('selection-area');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-customs-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const backToSelection = document.getElementById('back-to-selection');
    const hubHeader = document.getElementById('hub-header');

    // Wizard-specific elements
    const wizardNav = document.getElementById('wizard-nav');
    const backBtn = document.getElementById('back-btn');
    const resultsContent = document.getElementById('results-content');
    const cultureContainer = document.getElementById('culture-selection-container');
    const customContainer = document.getElementById('custom-selection-container');

    // --- STATE MANAGEMENT ---
    let stepHistory = [];

    // --- UI VIEW MANAGEMENT ---
    function showView(view) {
        hubHeader.style.display = 'none';
        selectionArea.style.display = 'none';
        wizardSection.style.display = 'none';
        explorerSection.style.display = 'none';
        
        if (view === 'selection') {
            hubHeader.style.display = 'block';
            selectionArea.style.display = 'grid';
        } else if (view === 'wizard') {
            wizardSection.style.display = 'block';
        } else if (view === 'explorer') {
            explorerSection.style.display = 'block';
        }
    }

    // --- WIZARD LOGIC ---
    function startWizard() {
        showView('wizard');
        goToStep('1');
    }

    function goToStep(stepId) {
        stepHistory.push(stepId);
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepId}`).classList.add('active');
        backBtn.disabled = stepHistory.length <= 1;
        wizardNav.style.display = stepId === 'results' ? 'none' : 'flex';
    }

    function goBack() {
        if (stepHistory.length <= 1) return;
        stepHistory.pop();
        const prevStep = stepHistory[stepHistory.length - 1];
        goToStep(prevStep);
    }
    
    function renderResults(html) {
        resultsContent.innerHTML = html;
        goToStep('results');
    }

    function handleWizardChoice(e) {
        const target = e.currentTarget;
        const nextStep = target.dataset.next;
        
        if (nextStep) {
            goToStep(nextStep);
        } else if (target.dataset.culture) {
            const cultureKey = target.dataset.culture;
            let html = `<h2 class="text-3xl font-bold mb-4 capitalize">${cultureKey} Customs</h2>`;
            Object.values(customsData).forEach(cat => {
                if (cat.content[cultureKey]) {
                    html += `
                        <div class="p-4 bg-gray-700/50 rounded-lg">
                           <h3 class="text-xl font-bold text-green-400 mb-2">${cat.title}</h3>
                           <p class="text-gray-300">${cat.content[cultureKey].text}</p>
                        </div>`;
                }
            });
            renderResults(html);
        } else if (target.dataset.custom) {
            const customKey = target.dataset.custom;
            const custom = customsData[customKey];
            let html = `<h2 class="text-3xl font-bold mb-4">${custom.title}</h2>`;
            Object.entries(custom.content).forEach(([key, value]) => {
                if (key !== 'global') {
                    html += `<div class="p-4 bg-gray-700/50 rounded-lg mb-4">
                               <h4 class="font-bold capitalize text-lg text-green-400">${key}</h4>
                               <p>${value.text}</p>
                             </div>`;
                }
            });
            html += `<h3 class="text-2xl font-bold mt-6 mb-3">Global Comparisons</h3>`;
            custom.content.global.forEach(g => {
                 html += `<div class="p-4 bg-gray-700/50 rounded-lg mb-2">
                            <h4 class="font-bold text-lg text-green-400">${g.name}</h4>
                            <p>${g.text}</p>
                          </div>`;
            });
            renderResults(html);
        }
    }

    // --- BUILDER FUNCTIONS ---
    function buildWizardOptions() {
        // Populate culture choices
        const cultures = new Set();
        Object.values(customsData).forEach(cat => {
            Object.keys(cat.content).forEach(key => {
                if(key !== 'global') cultures.add(key);
            });
        });
        cultureContainer.innerHTML = [...cultures].map(c => 
            `<div class="wizard-option p-4 rounded-lg" data-culture="${c}">
                <h4 class="font-bold capitalize text-center">${c}</h4>
             </div>`
        ).join('');

        // Populate custom choices
        customContainer.innerHTML = Object.entries(customsData).map(([key, value]) =>
            `<div class="wizard-option p-4 rounded-lg" data-custom="${key}">
                <h4 class="font-bold">${value.title}</h4>
            </div>`
        ).join('');

        // Add event listeners to newly created options
        document.querySelectorAll('#wizard-section .wizard-option').forEach(el => el.addEventListener('click', handleWizardChoice));
    }
    
    function buildExplorer() {
        let html = '';
        Object.values(customsData).forEach(cat => {
            html += `
                <div class="accordion-item bg-gray-800 rounded-lg shadow-md">
                    <div class="accordion-header flex justify-between items-center p-5">
                        <div class="flex items-center space-x-4">
                            <i class="fas ${cat.icon} text-2xl text-blue-400 w-8 text-center"></i>
                            <h3 class="text-xl font-bold text-white">${cat.title}</h3>
                        </div>
                        <i class="fas fa-chevron-right accordion-icon text-gray-400"></i>
                    </div>
                    <div class="accordion-content border-t border-gray-700 p-5 text-gray-300 space-y-4">
                        ${Object.entries(cat.content).map(([key, value]) => {
                            if (key === 'global') {
                                return `<h4 class="font-bold text-lg text-blue-300 pt-2 border-t border-gray-600">Global Comparisons</h4>` + 
                                value.map(g => `<p><strong>${g.name}:</strong> ${g.text}</p>`).join('');
                            }
                            return `<h4 class="font-bold text-lg text-green-400 capitalize">${key}: ${value.name}</h4><p>${value.text}</p>`;
                        }).join('<hr class="border-gray-700 my-4">')}
                    </div>
                </div>
            `;
        });
        explorerSection.insertAdjacentHTML('afterbegin', html);
        explorerSection.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => header.parentElement.classList.toggle('active'));
        });
    }

    // --- INITIALIZATION ---
    wizardBtn.addEventListener('click', startWizard);
    explorerBtn.addEventListener('click', () => showView('explorer'));
    backBtn.addEventListener('click', goBack);
    document.querySelectorAll('#back-to-selection, #back-to-selection-wizard').forEach(btn => {
        btn.addEventListener('click', resetToSelection);
    });
    
    function resetToSelection() {
        showView('selection');
        stepHistory = [];
    }

    buildWizardOptions();
    buildExplorer();

});
