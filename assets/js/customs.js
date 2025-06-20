document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const selectionView = document.getElementById('selection-view');
    const wizardView = document.getElementById('wizard-view');
    const explorerView = document.getElementById('explorer-view');
    const wizardBtn = document.getElementById('start-wizard-btn');
    const explorerBtn = document.getElementById('explore-customs-btn');
    const wizardSection = document.getElementById('wizard-section');
    const explorerSection = document.getElementById('explorer-section');
    const featuredCustomCard = document.getElementById('featured-custom-card');

    const backToSelectionWizard = document.getElementById('back-to-selection-wizard');
    const backToSelectionExplorer = document.getElementById('back-to-selection-explorer');

    if (!selectionView || !wizardView || !explorerView || !wizardBtn || !explorerBtn) {
        console.error("Essential view or button elements are missing from the DOM.");
        return;
    }

    // --- Comprehensive Cultural Database ---
    const customsDatabase = [
        // XHOSA CUSTOMS (20% - Primary Focus)
        { 
            id: 'imbeleko', 
            name: 'Imbeleko', 
            stage: 'birth', 
            cultures: ['xhosa', 'thembu', 'mpondo', 'bomvana'], 
            description: 'A sacred ritual to introduce newborns to their ancestors and secure spiritual protection. The ceremony involves slaughtering a goat and preparing traditional beer to welcome the child into the ancestral realm.',
            region: 'xhosa',
            category: 'spiritual'
        },
        { 
            id: 'ulwaluko', 
            name: 'Ulwaluko', 
            stage: 'coming-of-age', 
            cultures: ['xhosa', 'thembu', 'mpondo', 'mpondomise', 'bomvana'], 
            description: 'Traditional male circumcision and initiation ceremony marking the transition from boyhood to manhood. Initiates spend weeks in the mountains learning cultural values, respect, and responsibilities.',
            region: 'xhosa',
            category: 'rite-of-passage'
        },
        { 
            id: 'intonjane', 
            name: 'Intonjane', 
            stage: 'coming-of-age', 
            cultures: ['xhosa', 'thembu', 'mpondo'], 
            description: 'Female initiation ceremony celebrating a girl\'s transition to womanhood. The ceremony includes teachings about womanhood, marriage, and cultural responsibilities.',
            region: 'xhosa',
            category: 'rite-of-passage'
        },
        { 
            id: 'lobola', 
            name: 'Lobola/Ilobolo', 
            stage: 'marriage', 
            cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele', 'thembu', 'mpondo'], 
            description: 'Bride wealth tradition where the groom\'s family presents cattle, money, or gifts to the bride\'s family. This creates bonds between families and shows respect for the bride.',
            region: 'south-african',
            category: 'marriage'
        },
        { 
            id: 'umngcwabo', 
            name: 'Umngcwabo', 
            stage: 'death', 
            cultures: ['xhosa', 'zulu', 'ndebele', 'thembu'], 
            description: 'Traditional funeral ceremony honoring the deceased and ensuring their spirit transitions to the ancestral realm. Includes ritual slaughter, mourning songs, and community gathering.',
            region: 'xhosa',
            category: 'spiritual'
        },
        { 
            id: 'ukuphehla', 
            name: 'Ukuphehla', 
            stage: 'spiritual', 
            cultures: ['xhosa', 'thembu', 'mpondo', 'bomvana'], 
            description: 'Ancestral communication ritual involving burning of impepho (African sage) and speaking to ancestors for guidance, protection, and blessings.',
            region: 'xhosa',
            category: 'spiritual'
        },
        { 
            id: 'xhosa-beadwork', 
            name: 'Xhosa Beadwork', 
            stage: 'cultural-art', 
            cultures: ['xhosa', 'thembu', 'mpondo', 'mpondomise'], 
            description: 'Traditional beadwork with specific color meanings: white (purity/love), red (passion/anger), blue (faithfulness), yellow (wealth), green (contentment), black (marriage/maturity).',
            region: 'xhosa',
            category: 'art'
        },
        { 
            id: 'clan-names-xhosa', 
            name: 'Xhosa Clan Names (Iziduko)', 
            stage: 'identity', 
            cultures: ['xhosa', 'thembu', 'mpondo', 'bomvana', 'mpondomise'], 
            description: 'Sacred clan praise names that connect individuals to their ancestors. Examples: Mandela (Thembu), Tshezi (Bomvana), Gebe (Bomvana), Gqwarhu (Bomvana), Majola (Xhosa proper).',
            region: 'xhosa',
            category: 'identity'
        },

        // SOUTH AFRICAN BROADER CUSTOMS (40%)
        { 
            id: 'braai', 
            name: 'Braai Culture', 
            stage: 'social', 
            cultures: ['afrikaner', 'english', 'coloured', 'all-sa'], 
            description: 'South Africa\'s beloved barbecue tradition that brings people together. National Braai Day (Heritage Day) celebrates this unifying custom across all communities.',
            region: 'south-african',
            category: 'food'
        },
        { 
            id: 'heritage-day', 
            name: 'Heritage Day', 
            stage: 'celebration', 
            cultures: ['all-sa'], 
            description: 'September 24th celebration of South Africa\'s cultural diversity, also known as National Braai Day, honoring all cultures and traditions.',
            region: 'south-african',
            category: 'celebration'
        },
        { 
            id: 'zulu-reed-dance', 
            name: 'Umhlanga (Reed Dance)', 
            stage: 'coming-of-age', 
            cultures: ['zulu', 'swazi'], 
            description: 'Annual ceremony where young Zulu and Swazi women gather reeds and present them to the queen mother, celebrating purity and womanhood.',
            region: 'south-african',
            category: 'rite-of-passage'
        },
        { 
            id: 'sotho-blankets', 
            name: 'Sotho Blankets', 
            stage: 'cultural-identity', 
            cultures: ['sotho', 'basotho'], 
            description: 'Traditional colorful blankets with specific patterns indicating status, age, and life events. Each design tells a story and connects to Basotho heritage.',
            region: 'south-african',
            category: 'art'
        },
        { 
            id: 'venda-domba', 
            name: 'Domba (Python Dance)', 
            stage: 'coming-of-age', 
            cultures: ['venda'], 
            description: 'Sacred Venda initiation ceremony for young women, involving the python dance that teaches about fertility, womanhood, and cultural values.',
            region: 'south-african',
            category: 'rite-of-passage'
        },
        { 
            id: 'ndebele-art', 
            name: 'Ndebele Geometric Art', 
            stage: 'cultural-art', 
            cultures: ['ndebele'], 
            description: 'Distinctive geometric wall paintings and beadwork in bright colors, traditionally created by women to decorate homes and express cultural identity.',
            region: 'south-african',
            category: 'art'
        },
        { 
            id: 'tswana-bogwera', 
            name: 'Bogwera (Tswana Initiation)', 
            stage: 'coming-of-age', 
            cultures: ['tswana', 'batswana'], 
            description: 'Traditional Tswana male initiation ceremony teaching cultural values, respect, and preparing young men for adult responsibilities in the community.',
            region: 'south-african',
            category: 'rite-of-passage'
        },
        { 
            id: 'cape-malay-cuisine', 
            name: 'Cape Malay Cuisine', 
            stage: 'culinary', 
            cultures: ['cape-malay', 'coloured'], 
            description: 'Unique fusion cuisine combining Asian spices with local ingredients, including dishes like bobotie, samoosas, and koeksisters, brought by enslaved people from Asia.',
            region: 'south-african',
            category: 'food'
        },
        { 
            id: 'afrikaner-voortrekker', 
            name: 'Voortrekker Heritage', 
            stage: 'historical', 
            cultures: ['afrikaner'], 
            description: 'Cultural memory of the Great Trek migration, commemorated through monuments, festivals, and storytelling that shaped Afrikaner identity.',
            region: 'south-african',
            category: 'historical'
        },
        { 
            id: 'indian-diwali', 
            name: 'South African Diwali', 
            stage: 'celebration', 
            cultures: ['indian-sa'], 
            description: 'Festival of Lights celebrated by South African Indian community, adapted to local conditions while maintaining traditional significance of light over darkness.',
            region: 'south-african',
            category: 'celebration'
        },
        { 
            id: 'khoisan-click-language', 
            name: 'Khoisan Click Languages', 
            stage: 'linguistic', 
            cultures: ['khoisan', 'san', 'khoikhoi'], 
            description: 'Ancient click languages of the original inhabitants of Southern Africa, featuring distinctive clicking sounds and representing humanity\'s oldest linguistic traditions.',
            region: 'south-african',
            category: 'linguistic'
        },
        { 
            id: 'amasonja', 
            name: 'Amasonja (Traditional Snacks)', 
            stage: 'culinary', 
            cultures: ['xhosa', 'zulu', 'african-sa'], 
            description: 'Traditional dried corn kernels snack, often enjoyed during storytelling sessions and community gatherings, representing simple pleasures of rural life.',
            region: 'south-african',
            category: 'food'
        },
        { 
            id: 'pap-en-vleis', 
            name: 'Pap en Vleis', 
            stage: 'culinary', 
            cultures: ['afrikaner', 'african-sa', 'all-sa'], 
            description: 'Staple South African meal of maize porridge and grilled meat, enjoyed across cultural boundaries and central to weekend braai culture.',
            region: 'south-african',
            category: 'food'
        },
        { 
            id: 'ubuntu', 
            name: 'Ubuntu Philosophy', 
            stage: 'philosophy', 
            cultures: ['african-sa', 'bantu'], 
            description: 'Fundamental African philosophy meaning "I am because we are" - emphasizing interconnectedness, community, and shared humanity across South African cultures.',
            region: 'south-african',
            category: 'philosophy'
        },
        { 
            id: 'gumboot-dance', 
            name: 'Gumboot Dance', 
            stage: 'performance', 
            cultures: ['african-sa', 'mining-communities'], 
            description: 'Percussive dance created by gold miners using Wellington boots, transforming oppressive conditions into artistic expression and communication.',
            region: 'south-african',
            category: 'performance'
        },

        // AFRICAN BROADER CUSTOMS (20%)
        { 
            id: 'ancestral-veneration', 
            name: 'Ancestral Veneration', 
            stage: 'spiritual', 
            cultures: ['bantu', 'african'], 
            description: 'Widespread African practice of honoring and communicating with ancestors, who are believed to guide and protect the living across many African cultures.',
            region: 'african',
            category: 'spiritual'
        },
        { 
            id: 'age-grade-systems', 
            name: 'Age Grade Systems', 
            stage: 'social-structure', 
            cultures: ['african', 'bantu'], 
            description: 'Traditional African social organization where people of similar ages form groups with specific roles and responsibilities in community life.',
            region: 'african',
            category: 'social'
        },
        { 
            id: 'oral-tradition', 
            name: 'Oral Tradition', 
            stage: 'cultural-transmission', 
            cultures: ['african', 'global-indigenous'], 
            description: 'Rich tradition of passing knowledge, history, and values through storytelling, praise poetry, and songs across generations.',
            region: 'african',
            category: 'education'
        },
        { 
            id: 'african-masks', 
            name: 'Traditional African Masks', 
            stage: 'ceremonial', 
            cultures: ['african'], 
            description: 'Sacred masks used in ceremonies to connect with spirits, ancestors, and natural forces, each design carrying specific cultural meanings.',
            region: 'african',
            category: 'art'
        },
        { 
            id: 'african-drumming', 
            name: 'African Drumming Traditions', 
            stage: 'communication', 
            cultures: ['african'], 
            description: 'Complex drumming systems used for communication, ceremony, and storytelling, with different rhythms conveying specific messages across distances.',
            region: 'african',
            category: 'music'
        },

        // GLOBAL CUSTOMS (20%)
        { 
            id: 'coming-of-age-global', 
            name: 'Global Coming-of-Age Ceremonies', 
            stage: 'coming-of-age', 
            cultures: ['global'], 
            description: 'Universal human practice of marking transition to adulthood through various ceremonies: Bar/Bat Mitzvah (Jewish), Quinceañera (Latin American), Sweet 16 (Western).',
            region: 'global',
            category: 'rite-of-passage'
        },
        { 
            id: 'marriage-dowry-global', 
            name: 'Global Marriage Exchange Customs', 
            stage: 'marriage', 
            cultures: ['global'], 
            description: 'Worldwide traditions of marriage exchanges: dowry (India/Europe), bride price (Africa/Asia), showcasing universal importance of family alliances.',
            region: 'global',
            category: 'marriage'
        },
        { 
            id: 'harvest-festivals', 
            name: 'Harvest Festivals Worldwide', 
            stage: 'celebration', 
            cultures: ['global', 'agricultural'], 
            description: 'Universal celebration of successful harvests: Thanksgiving (North America), Mid-Autumn Festival (East Asia), Lughnasadh (Celtic), reflecting human connection to agriculture.',
            region: 'global',
            category: 'celebration'
        },
        { 
            id: 'hospitality-customs', 
            name: 'Hospitality Traditions', 
            stage: 'social', 
            cultures: ['global'], 
            description: 'Universal customs of welcoming guests: tea ceremonies (Asia), breaking bread (Middle East), Ubuntu (Africa), demonstrating shared human values.',
            region: 'global',
            category: 'social'
        },
        { 
            id: 'funeral-rites-global', 
            name: 'Global Death Rites', 
            stage: 'death', 
            cultures: ['global'], 
            description: 'Universal human practices for honoring the dead: sky burial (Tibet), jazz funerals (New Orleans), sitting shiva (Jewish), showing common need for closure and remembrance.',
            region: 'global',
            category: 'spiritual'
        }
    ];
    
    const cultures = {
        xhosa: 'Xhosa', thembu: 'Thembu', mpondo: 'Mpondo', bomvana: 'Bomvana', mpondomise: 'Mpondomise', bhaca: 'Bhaca', mfengu: 'Mfengu', xesibe: 'Xesibe',
        zulu: 'Zulu', sotho: 'Sotho', ndebele: 'Ndebele', swazi: 'Swazi', tswana: 'Tswana', batswana: 'Batswana', basotho: 'Basotho',
        venda: 'Venda', tsonga: 'Tsonga',
        afrikaner: 'Afrikaner', english: 'English South African', coloured: 'Coloured', 'cape-malay': 'Cape Malay', 'indian-sa': 'South African Indian',
        khoisan: 'Khoisan', san: 'San', khoikhoi: 'Khoikhoi',
        'african-sa': 'African South African', 'all-sa': 'All South Africans',
        bantu: 'Bantu', african: 'African', global: 'Global', 'global-indigenous': 'Global Indigenous'
    };

    const categories = {
        spiritual: 'Spiritual & Religious', 'rite-of-passage': 'Rites of Passage', marriage: 'Marriage & Family',
        art: 'Arts & Crafts', food: 'Food & Cuisine', music: 'Music & Dance', performance: 'Performance Arts',
        social: 'Social Customs', celebration: 'Festivals & Celebrations', identity: 'Identity & Heritage',
        education: 'Education & Knowledge', linguistic: 'Language & Communication', philosophy: 'Philosophy & Values',
        historical: 'Historical Traditions'
    };

    const wizardSteps = {
        'start': { question: 'How would you like to explore?', options: [
                { text: 'Learn about a specific culture', next: '2A' },
                { text: 'Compare a custom across cultures', next: '2B' },
                { text: 'Explore by type of tradition', next: '2C' },
                { text: 'Discover regional traditions', next: '2D' }
            ]},
        '2A': { question: 'Which culture interests you?', type: 'cultures', next: 'resultsA' },
        '2B': { question: 'Which custom would you like to compare?', type: 'customs', next: 'resultsB' },
        '2C': { question: 'What type of tradition would you like to see?', type: 'categories', next: 'resultsC' },
        '2D': { question: 'Which region would you like to focus on?', options: [
                { text: 'Xhosa Heartland (Eastern Cape)', next: 'resultsD', filter: 'xhosa' },
                { text: 'Broader South African', next: 'resultsD', filter: 'south-african' },
                { text: 'Pan-African', next: 'resultsD', filter: 'african' },
                { text: 'Global Comparisons', next: 'resultsD', filter: 'global' }
            ]}
    };
    
    let wizardHistory = [];

    // --- Core Functions ---
    const showView = (viewId) => {
        [selectionView, wizardView, explorerView].forEach(view => {
            if (view) view.classList.toggle('active', view.id === viewId);
        });
    };

    const renderFeaturedCustom = () => {
        if (!featuredCustomCard) return;
        const featuredCustom = customsDatabase.find(c => c.id === 'ubuntu') || customsDatabase[0];
        featuredCustomCard.innerHTML = `
            <i class="fas fa-star text-4xl text-yellow-400 mb-4"></i>
            <h3 class="text-2xl font-bold mb-2">Featured: ${featuredCustom.name}</h3>
            <p class="text-gray-400 flex-grow mb-4">${featuredCustom.description.substring(0, 100)}...</p>
            <span class="bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors w-full mt-auto">Learn More</span>
        `;
        featuredCustomCard.addEventListener('click', () => {
            showView('explorer-view');
            buildExplorer([featuredCustom.id]); // Build explorer with only the featured custom
        });
    };
    
    const buildExplorer = (filterIds = null) => {
        const customsToDisplay = filterIds ? customsDatabase.filter(c => filterIds.includes(c.id)) : customsDatabase;
        explorerSection.innerHTML = ''; // Clear previous content
        if (customsToDisplay.length === 0) {
            explorerSection.innerHTML = '<p class="text-gray-400 text-center py-8">No customs found matching your criteria.</p>';
            return;
        }

        const groupedCustoms = customsToDisplay.reduce((groups, custom) => {
            const category = custom.category || 'other';
            if (!groups[category]) groups[category] = [];
            groups[category].push(custom);
            return groups;
        }, {});

        let accordionHtml = Object.keys(groupedCustoms).sort().map(category => {
            const categoryName = categories[category] || category;
            const customs = groupedCustoms[category];
            
            const customsHtml = customs.map(custom => {
                const culturesList = custom.cultures.map(c => cultures[c] || c).join(', ');
                return `
                    <div class="accordion-item bg-gray-800 rounded-lg border border-gray-700">
                        <button class="accordion-header w-full text-left p-6 flex justify-between items-center hover:bg-gray-700 transition-colors">
                            <div class="flex-grow">
                                <h3 class="text-xl font-bold text-white">${custom.name}</h3>
                                <div class="flex flex-wrap gap-2 mt-2 text-xs">
                                    <span class="px-2 py-1 bg-purple-600 text-white rounded">${custom.region.replace('-', ' ')}</span>
                                    <span class="px-2 py-1 bg-gray-600 text-white rounded">${custom.stage.replace('-', ' ')}</span>
                                </div>
                            </div>
                            <i class="fas fa-chevron-down text-white accordion-icon"></i>
                        </button>
                        <div class="accordion-content px-6 pb-6">
                            <div class="pt-4 border-t border-gray-700 text-gray-300">
                                <p class="mb-4">${custom.description}</p>
                                <p><strong class="text-purple-400">Cultures:</strong> ${culturesList}</p>
                            </div>
                        </div>
                    </div>`;
            }).join('');

            return `<div class="category-section mb-8">
                        <h2 class="text-2xl font-bold text-purple-400 mb-4 border-b-2 border-purple-900 pb-2">${categoryName}</h2>
                        <div class="space-y-4">${customsHtml}</div>
                    </div>`;
        }).join('');
        
        explorerSection.insertAdjacentHTML('beforeend', accordionHtml);
        
        explorerSection.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    };
    
    const renderWizardStep = (stepId) => {
        const step = wizardSteps[stepId];
        if (!step) return;

        wizardHistory.push(stepId);
        let optionsHtml = '';

        if (step.type === 'cultures') {
            const cultureGroups = {
                'Xhosa & Related': ['xhosa', 'thembu', 'mpondo', 'bomvana', 'mpondomise'],
                'Other Nguni': ['zulu', 'swazi', 'ndebele'],
                'Sotho-Tswana': ['sotho', 'tswana', 'basotho', 'batswana'],
                'Other SA Groups': ['venda', 'tsonga', 'afrikaner', 'coloured', 'indian-sa', 'khoisan'],
                'Broader Categories': ['african', 'global']
            };
            optionsHtml = Object.entries(cultureGroups).map(([groupName, cultureIds]) => {
                let buttons = cultureIds.map(id => {
                    if (cultures[id]) {
                        return `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors w-full" data-filter-type="culture" data-filter-value="${id}" data-next="${step.next}">
                            <span class="font-bold text-white">${cultures[id]}</span>
                        </button>`;
                    }
                    return '';
                }).join('');
                return `<div class="mb-4">
                            <h4 class="text-lg font-semibold text-purple-400 mb-3">${groupName}</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">${buttons}</div>
                        </div>`;
            }).join('');

        } else if (step.type === 'customs') {
            optionsHtml = customsDatabase.map(custom =>
                `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors" data-filter-type="custom" data-filter-value="${custom.id}" data-next="${step.next}">
                    <span class="font-bold text-lg text-white">${custom.name}</span>
                </button>`
            ).join('');
        } else if (step.type === 'categories') {
             optionsHtml = Object.entries(categories).sort((a,b) => a[1].localeCompare(b[1])).map(([id, name]) => `
                <button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-4 rounded-lg transition-colors" data-filter-type="category" data-filter-value="${id}" data-next="${step.next}">
                    <span class="font-bold text-lg text-white">${name}</span>
                </button>`).join('');
        } else { // Default case for steps with predefined options
            optionsHtml = step.options.map(option =>
                `<button class="wizard-option text-left bg-gray-700 hover:bg-gray-600 p-6 rounded-lg transition-colors" data-next="${option.next}" ${option.filter ? `data-filter-value="${option.filter}"` : ''} data-filter-type="region">
                     <h4 class="font-bold text-lg text-white">${option.text}</h4>
                </button>`
            ).join('');
        }

        wizardSection.innerHTML = `
            <div id="${stepId}" class="wizard-step active">
                <h3 class="text-2xl font-bold text-white mb-6 text-center">${step.question}</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2">${optionsHtml}</div>
                <div class="mt-8 pt-4 border-t border-gray-700">
                    <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-colors">Back</button>
                </div>
            </div>`;

        wizardSection.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', handleWizardOption));
        const backBtn = wizardSection.querySelector('#wizard-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', goBack);
            backBtn.disabled = wizardHistory.length <= 1;
        }
    };

    const handleWizardOption = (e) => {
        const button = e.currentTarget;
        const nextStepId = button.dataset.next;
        const filterType = button.dataset.filterType;
        const filterValue = button.dataset.filterValue;

        if (nextStepId.startsWith('results')) {
            let results;
            if (filterType === 'culture') {
                results = customsDatabase.filter(c => c.cultures.includes(filterValue));
            } else if (filterType === 'custom') {
                results = customsDatabase.filter(c => c.id === filterValue);
            } else if (filterType === 'category') {
                results = customsDatabase.filter(c => c.category === filterValue);
            } else if (filterType === 'region') {
                results = customsDatabase.filter(c => c.region === filterValue);
            }
            renderWizardResults(results);
        } else {
            renderWizardStep(nextStepId);
        }
    };

    const renderWizardResults = (results) => {
        wizardHistory.push('results'); // Mark this as a results step
        wizardSection.innerHTML = `
            <div class="wizard-step active">
                <h3 class="text-2xl font-bold text-white mb-2 text-center">Wizard Results</h3>
                <p class="text-gray-400 text-center mb-6">${results.length} tradition(s) found.</p>
                <div class="results-container max-h-[50vh] overflow-y-auto pr-2"></div>
                <div class="mt-8 pt-4 border-t border-gray-700 flex justify-between">
                    <button id="wizard-back-btn" class="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-500">Back</button>
                    <button id="explore-all-btn" class="bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-500">Explore in Full Page</button>
                </div>
            </div>`;
        
        // Use the explorer build function to render results inside the wizard
        const resultsContainer = wizardSection.querySelector('.results-container');
        const tempExplorer = explorerSection; // backup original
        explorerSection = resultsContainer;
        buildExplorer(results.map(r => r.id));
        explorerSection = tempExplorer; // restore

        wizardSection.querySelector('#wizard-back-btn').addEventListener('click', goBack);
        wizardSection.querySelector('#explore-all-btn').addEventListener('click', () => {
            buildExplorer(results.map(r => r.id));
            showView('explorer-view');
        });
    };

    const goBack = () => {
        wizardHistory.pop(); // Remove current step
        if (wizardHistory.length > 0) {
            const previousStepId = wizardHistory.pop(); // Get ID of the step to render
            renderWizardStep(previousStepId);
        } else {
            showView('selection-view');
        }
    };
    
    const addSearchCapability = () => {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'mb-6 sticky top-4 z-20';
        searchContainer.innerHTML = `
            <div class="relative">
                <input type="text" id="culture-search" placeholder="Search all customs..." 
                       class="w-full bg-gray-800 text-white border-2 border-gray-600 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
        `;
        
        if (explorerView && !document.getElementById('culture-search')) {
            explorerView.insertBefore(searchContainer, explorerSection);
            const searchInput = document.getElementById('culture-search');
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.toLowerCase().trim();
                    if (query === '') {
                        buildExplorer();
                    } else {
                        const filtered = customsDatabase.filter(custom => 
                            custom.name.toLowerCase().includes(query) ||
                            custom.description.toLowerCase().includes(query) ||
                            custom.cultures.some(culture => (cultures[culture] || '').toLowerCase().includes(query))
                        );
                        buildExplorer(filtered.map(c => c.id));
                    }
                }, 300);
            });
        }
    };

    // --- Event Listeners ---
    wizardBtn.addEventListener('click', () => {
        wizardHistory = [];
        renderWizardStep('start');
        showView('wizard-view');
    });

    explorerBtn.addEventListener('click', () => {
        buildExplorer();
        showView('explorer-view');
    });
    
    backToSelectionWizard.addEventListener('click', () => showView('selection-view'));
    backToSelectionExplorer.addEventListener('click', () => showView('selection-view'));

    // --- Initial Page Load ---
    buildExplorer(); // Pre-build for faster display
    renderFeaturedCustom();
    addSearchCapability();
});
