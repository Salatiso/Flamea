document.addEventListener('DOMContentLoaded', () => {
    // --- DATA: Customs Database ---
    // Moved from main.js to make this page self-contained.
    // **FIX**: Ensured every entry has a `variations` object to prevent errors.
    const customsDatabase = [
        {
            id: 'imbeleko',
            name: 'Imbeleko',
            stage: 'birth',
            cultures: ['xhosa', 'zulu'],
            description: 'A crucial ritual to introduce a newborn to their ancestors and the community.',
            procedure: 'The ceremony involves the ritual slaughter of a goat (or sheep), the burial of the umbilical cord and afterbirth, and the brewing of traditional beer (umqombothi). The baby is passed through the smoke of the sacred fire and given a traditional name.',
            significance: "This ritual establishes the child's spiritual connection to their clan and ancestors, ensuring their protection and guidance. It formally welcomes the child into the family and community.",
            variations: {
                xhosa: "Among the Xhosa, Imbeleko can be performed at any age before a male's initiation, but it is considered vital for formally introducing the child to their paternal ancestors.",
                zulu: "The Zulu tradition places a strong emphasis on the father's role in introducing the child to the ancestral spirits (amadlozi)."
            }
        },
        {
            id: 'ulwaluko',
            name: 'Ulwaluko',
            stage: 'coming-of-age',
            cultures: ['xhosa', 'ndebele', 'sotho'],
            description: 'A formal initiation and circumcision ritual that marks the transition from boyhood to manhood.',
            procedure: 'Initiates (abakhwetha/bashanyana) are secluded in a specially built hut (iboma/mophato) for several weeks. They undergo circumcision and are taught about manhood, cultural values, and their responsibilities to the community by elders and traditional surgeons (iingcibi/basuwe). The process concludes with a cleansing ceremony and a celebration where the new men (amakrwala) are welcomed back.',
            significance: "This is a pivotal transition into manhood, signifying a man's readiness to take on adult responsibilities, marry, and lead a family. It is deeply embedded in cultural identity and social standing.",
            variations: {
                xhosa: 'Typically performed when a young man is 18+ and considered ready to provide for himself.',
                ndebele: 'Often occurs in the early to mid-teens.',
                sotho: 'Known as Lebollo, this is also central to the transition to manhood, with age varying between 12-20.'
            }
        },
        {
            id: 'intonjane',
            name: 'Intonjane',
            stage: 'coming-of-age',
            cultures: ['xhosa', 'zulu'],
            description: "A rite of passage for young women, marking their transition into womanhood.",
            procedure: "When a girl has her first menstruation, she is secluded for a period to be taught by elder women about womanhood, marriage, and her future role in the community. The ceremony involves specific rituals, teachings, and celebrations.",
            significance: "Prepares young women for marriage and adult responsibilities, instilling values of respect, loyalty, and family cohesion. It is a celebrated transition.",
            variations: {}
        },
        {
            id: 'lobola',
            name: 'Lobola',
            stage: 'marriage',
            cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele', 'pedi', 'tsonga', 'venda'],
            description: "The practice of bride wealth, where the groom's family presents gifts, traditionally cattle, to the bride's family.",
            procedure: 'Negotiations are conducted between the two families, often through intermediaries (abanyana). The number of cattle (or the equivalent monetary value) is agreed upon, and the exchange solidifies the union.',
            significance: 'Lobola is not a "purchase" but a gesture of gratitude and a way to unite the two families. It legitimizes the marriage and demonstrates the groom\'s commitment and ability to provide for his wife.',
            variations: {}
        },
        {
            id: 'umngcwabo',
            name: 'Umngcwabo',
            stage: 'death',
            cultures: ['xhosa', 'zulu', 'ndebele'],
            description: 'A traditional funeral ceremony to honour the deceased and ensure their spirit transitions to the ancestral realm.',
            procedure: 'Involves specific rituals like the slaughter of a cow (ukuherebha) to accompany the spirit, speeches, and traditional songs. The body is traditionally buried in a specific posture (e.g., sitting, facing east). Post-burial rituals like ukubuyisa (bringing the spirit back home) are performed later.',
            significance: "Death is seen not as an end but as a transition to becoming an ancestor (idlozi/ithongo). The funeral is a community event that honors the deceased's life and reinforces the connection between the living and the dead.",
            variations: {}
        }
    ];

    // --- DOM Element References ---
    const catalogueContainer = document.getElementById('customs-catalogue');
    if (!catalogueContainer) return; // Exit if not on the customs page

    const selectionArea = document.getElementById('selection-area');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-customs-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const backBtn = document.getElementById('back-to-selection');
    const resultsContainer = document.getElementById('customs-results-container');
    const searchInput = document.getElementById('custom-search-input');
    const stageFilter = document.getElementById('life-stage-filter');
    const cultureFilter = document.getElementById('culture-filter');

    // --- Functions ---

    const renderCustoms = (filteredCustoms) => {
        resultsContainer.innerHTML = '';
        if (filteredCustoms.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-400 text-center col-span-full py-8">No customs found matching your criteria.</p>';
            return;
        }
        filteredCustoms.forEach(custom => {
            const item = document.createElement('div');
            item.className = 'accordion-item bg-gray-800 rounded-lg shadow-md';
            item.innerHTML = `
                <div class="accordion-header flex justify-between items-center p-5">
                    <div>
                        <h3 class="text-xl font-bold text-white">${custom.name}</h3>
                        <p class="text-sm text-gray-400 capitalize">${custom.cultures.join(', ')}</p>
                    </div>
                    <i class="fas fa-chevron-down accordion-icon text-gray-400"></i>
                </div>
                <div class="accordion-content border-t border-gray-700 p-5 text-gray-300">
                    <p class="mb-4">${custom.description}</p>
                    <h4 class="font-bold text-lg mb-2 text-gray-200">Significance:</h4>
                    <p class="mb-4">${custom.significance}</p>
                    <h4 class="font-bold text-lg mb-2 text-gray-200">Procedure:</h4>
                    <p>${custom.procedure}</p>
                </div>
            `;
            resultsContainer.appendChild(item);
            item.querySelector('.accordion-header').addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
    };

    const populateFilters = () => {
        const stages = ['all', ...new Set(customsDatabase.map(c => c.stage))];
        const cultures = ['all', ...new Set(customsDatabase.flatMap(c => c.cultures))];

        stageFilter.innerHTML = stages.map(s => `<option value="${s}" class="capitalize">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('');
        cultureFilter.innerHTML = cultures.map(c => `<option value="${c}" class="capitalize">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');
    };

    const handleFilterAndSearch = () => {
        const stage = stageFilter.value;
        const culture = cultureFilter.value;
        const query = searchInput.value.toLowerCase();

        const filtered = customsDatabase.filter(c => {
            const stageMatch = stage === 'all' || c.stage === stage;
            const cultureMatch = culture === 'all' || c.cultures.includes(culture);
            const queryMatch = !query || c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query);
            return stageMatch && cultureMatch && queryMatch;
        });
        renderCustoms(filtered);
    };

    const showExplorer = () => {
        selectionArea.classList.add('hidden');
        wizardSection.classList.add('hidden');
        explorerSection.classList.remove('hidden');
    };

    const showWizard = () => {
        selectionArea.classList.add('hidden');
        explorerSection.classList.add('hidden');
        wizardSection.classList.remove('hidden');
        // Add wizard rendering logic here if needed
        wizardSection.innerHTML = `
            <h2 class="text-2xl font-bold text-green-400 mb-6">Customs Wizard</h2>
            <p>This wizard will guide you to relevant customs. (Functionality to be built)</p>
            <button id="back-to-selection-wizard" class="mt-6 text-sm text-gray-400 hover:text-white">&larr; Back to selection</button>
        `;
        document.getElementById('back-to-selection-wizard').addEventListener('click', showSelection);
    };

    const showSelection = () => {
        wizardSection.classList.add('hidden');
        explorerSection.classList.add('hidden');
        selectionArea.classList.remove('hidden');
    };

    // --- Initial Setup ---
    populateFilters();
    renderCustoms(customsDatabase);

    // --- Event Listeners ---
    if(explorerBtn) explorerBtn.addEventListener('click', showExplorer);
    if(wizardBtn) wizardBtn.addEventListener('click', showWizard);
    if(backBtn) backBtn.addEventListener('click', showSelection);
    
    searchInput.addEventListener('input', handleFilterAndSearch);
    stageFilter.addEventListener('change', handleFilterAndSearch);
    cultureFilter.addEventListener('change', handleFilterAndSearch);

});
