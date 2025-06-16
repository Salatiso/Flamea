// assets/js/main.js

/**
 * Flamea.org - Unified Main Script
 * This file contains the core sitewide JavaScript functionality for rendering dynamic catalogues.
 * It uses event delegation to handle events on dynamically loaded content.
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Data for Dynamic Content ---

    const trainingData = [
        { 
            title: "🎓 Legal & Constitutional Foundations", 
            color: "green-500", 
            courses: [
                { title: "The SA Constitution", icon: "fas fa-landmark", description: "Understand your foundational rights as a father and a citizen under South Africa's supreme law.", url: "training/course-constitution.html" },
                { title: "The Children's Act", icon: "fas fa-child", description: "A deep dive into parental rights, responsibilities, care, and contact. Know the law that governs your relationship with your child.", url: "training/course-childrens-act.html" },
                { title: "Family Law Overview", icon: "fas fa-balance-scale", description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.", url: "training/course-family-law.html" }
            ] 
        },
        {
            title: "👨‍👧‍👦 Practical Parenting Skills",
            color: "blue-500",
            courses: [
                 { title: "Co-Parenting 101", icon: "fas fa-hands-helping", description: "Master communication, conflict resolution, and building effective parenting plans.", url: "training/course-coparenting.html" },
                 { title: "Newborn & Daily Care", icon: "fas fa-baby-carriage", description: "From changing diapers to installing car seats, gain confidence in daily tasks.", url: "training/course-newborn-daily-care.html" },
                 { title: "Building Your Own Curriculum", icon: "fas fa-pencil-ruler", description: "A guide for the homeschooling father. Move beyond the formal system to create a practical, values-based education.", url: "training/course-build-curriculum.html" }
            ]
        },
        {
            title: "🦅 Cultural & Ancestral Wisdom",
            color: "yellow-500",
            courses: [
                { title: "The Unbroken Chain", icon: "fas fa-link", description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty as `indlalifa` beyond mere inheritance.", url: "training/course-unbroken-chain.html" },
                { title: "Finding Your Ancestors Within", icon: "fas fa-dna", description: "A guide to modern spirituality, blending science with Xhosa tradition to connect with your ancestral wisdom anywhere.", url: "training/course-ancestors-within.html" },
                { title: "The Power of the Extended Family", icon: "fas fa-users", description: "Champion the resilient household. Learn how your family structure is a core strength in raising children.", url: "training/course-extended-family.html" }
            ]
        },
        {
            title: "🔥 Advanced Advocacy & Self-Sufficiency",
            color: "red-500",
            courses: [
                { title: "A Father's Shield", icon: "fas fa-gavel", description: "Use the 'Best Interests of the Child' principle (Sec 28) to challenge discriminatory policies and advocate for your child.", url: "training/course-fathers-shield.html" },
                { title: "Risk Management for Fathers", icon: "fas fa-shield-alt", description: "Apply OHS principles to family life. Identify and mitigate risks to your family's physical, emotional, and financial well-being.", url: "training/course-risk-management.html" }
            ]
        }
    ];

    const toolData = [
        {
            title: "🛠️ Core Planning & Tracking Tools",
            color: "blue-500",
            tools: [
                { name: "Needs Assessment", icon: "fas fa-clipboard-check", description: "Start here to get a personalized action plan.", url: "assessment.html" },
                { name: "Parenting Plan Builder", icon: "fas fa-file-signature", description: "Create a comprehensive, court-ready parenting plan.", url: "plan-builder.html" },
                { name: "Family Activity Tracker", icon: "fas fa-chart-line", description: "Log contributions, schedules, and important events.", url: "activity-tracker.html" },
                { name: "Resource Locator", icon: "fas fa-map-marked-alt", description: "Find Family Advocates, courts, and father-friendly NGOs.", url: "locator.html" }
            ]
        },
        {
            title: "🗂️ Forms & Templates",
            color: "purple-500",
            tools: [
                { name: "Forms & Wizards", icon: "fas fa-folder-open", description: "Access legal templates and guided forms.", url: "forms.html" },
                { name: "Traditional Customs Database", icon: "fas fa-book-reader", description: "Explore a rich database of South African cultural practices and their significance.", url: "customs.html" }
            ]
        },
        {
            title: "📚 Media & Publications",
            color: "yellow-500",
            tools: [
                { name: "Read Our Books", icon: "fas fa-book-open", description: "Access exclusive books on fatherhood and the law.", url: "book-reader.html" },
                { name: "Flamea Podcast", icon: "fas fa-podcast", description: "Listen to discussions on key topics for fathers.", url: "#", modal: "podcast-modal" },
                { name: "YouTube Channel", icon: "fab fa-youtube", description: "Watch video guides, tutorials, and interviews.", url: "https://www.youtube.com/@Flamea2024", external: true }
            ]
        },
        {
            title: "🎮 Interactive Games",
            color: "pink-500",
            tools: [
                 { name: "Kid Konstitution", icon: "fas fa-child", description: "A fun quiz to learn the basics of our country's rules!", url: "games/kid-konstitution.html" },
                 { name: "Rights Racer", icon: "fas fa-running", description: "Race against time to collect important rights!", url: "games/rights-racer.html" },
                 { name: "Justice Builder", icon: "fas fa-gavel", description: "A simulator where you build a case from scratch.", url: "games/justice-builder.html" },
                 { name: "See All Games", icon: "fas fa-gamepad", description: "Visit the main arcade to play all available games.", url: "games.html" }
            ]
        }
    ];

    const gameData = [
        { title: "Kid Konstitution", description: "A fun quiz to learn the basics of our country's rules!", url: "games/kid-konstitution.html", icon: "fas fa-child text-yellow-400", category: "kids" },
        { title: "Rights Racer", description: "Race against time to collect important rights!", url: "games/rights-racer.html", icon: "fas fa-running text-green-400", category: "kids" },
        { title: "Constitution Defender", description: "Protect the constitution from being changed!", url: "games/constitution-defender.html", icon: "fas fa-shield-alt text-blue-400", category: "kids" },
        { title: "Constitution Quest", description: "An adventure game exploring the Bill of Rights.", url: "games/constitution-quest.html", icon: "fas fa-map-signs text-purple-400", category: "patriots" },
        { title: "Law & Layers Quest", description: "Uncover the different layers of South African law.", url: "games/law-layers-quest.html", icon: "fas fa-layer-group text-indigo-400", category: "patriots" },
        { title: "Mythbuster", description: "Bust common myths about our legal system.", url: "games/mythbuster-game.html", icon: "fas fa-ghost text-teal-400", category: "patriots" },
        { title: "Constitution Champions", description: "Become a champion of constitutional knowledge.", url: "games/constitution-champions.html", icon: "fas fa-trophy text-yellow-500", category: "patriots" },
        { title: "Constitution Crusaders", description: "A crusade to protect and uphold the constitution.", url: "games/constitution-crusaders.html", icon: "fas fa-khanda text-gray-400", category: "patriots" },
        { title: "Goliath's Reckoning", description: "A story-driven game about fighting for justice.", url: "games/goliaths-reckoning.html", icon: "fas fa-balance-scale text-red-500", category: "leaders" },
        { title: "Justice Builder", description: "A simulator where you build a case from scratch.", url: "games/justice-builder.html", icon: "fas fa-gavel text-orange-500", category: "leaders" },
        { title: "The System", description: "A satirical look at the justice system. (Mature)", url: "games/satirical-game.html", icon: "fas fa-theater-masks text-pink-500", category: "leaders" },
        { title: "Legal Simulator", description: "Experience legal scenarios in a simulated world.", url: "games/legal-simulator.html", icon: "fas fa-laptop-code text-cyan-400", category: "leaders" }
    ];

    const customsDatabase = [
        {
            id: 'imbeleko', name: 'Imbeleko', stage: 'birth', cultures: ['xhosa', 'zulu'],
            description: 'A crucial ritual to introduce a newborn to their ancestors and the community.',
            procedure: 'The ceremony involves the ritual slaughter of a goat (or sheep), the burial of the umbilical cord and afterbirth, and the brewing of traditional beer (umqombothi). The baby is passed through the smoke of the sacred fire and given a traditional name.',
            significance: "This ritual establishes the child's spiritual connection to their clan and ancestors, ensuring their protection and guidance. It formally welcomes the child into the family and community.",
            variations: {
                xhosa: "Among the Xhosa, Imbeleko can be performed at any age before a male's initiation, but it is considered vital for formally introducing the child to their paternal ancestors.",
                zulu: "The Zulu tradition places a strong emphasis on the father's role in introducing the child to the ancestral spirits (amadlozi)."
            },
            sources: {
                primary: ['https://www.nalug.net/exploring-the-vibrant-xhosa-cultural-traditions-an-insight-into-its-rich-heritage-and-beliefs/'],
                secondary: ['Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies.']
            }
        },
        {
            id: 'ulwaluko', name: 'Ulwaluko', stage: 'coming-of-age', cultures: ['xhosa', 'ndebele', 'sotho'],
            description: 'A formal initiation and circumcision ritual that marks the transition from boyhood to manhood.',
            procedure: 'Initiates (abakhwetha/bashanyana) are secluded in a specially built hut (iboma/mophato) for several weeks. They undergo circumcision and are taught about manhood, cultural values, and their responsibilities to the community by elders and traditional surgeons (iingcibi/basuwe). The process concludes with a cleansing ceremony and a celebration where the new men (amakrwala) are welcomed back.',
            significance: "This is a pivotal transition into manhood, signifying a man's readiness to take on adult responsibilities, marry, and lead a family. It is deeply embedded in cultural identity and social standing.",
            variations: {
                xhosa: 'Typically performed when a young man is 18+ and considered ready to provide for himself.',
                ndebele: 'Often occurs in the early to mid-teens.',
                sotho: 'Known as Lebollo, this is also central to the transition to manhood, with age varying between 12-20.'
            },
            sources: {
                primary: ['https://en.wikipedia.org/wiki/Ulwaluko', 'https://en.wikipedia.org/wiki/Lebollo_la_banna'],
                secondary: ['The HomeSchooling Father - Master Edition 5-9-24.docx: Chapter 1, The formal school system.']
            }
        },
        {
            id: 'intonjane', name: 'Intonjane', stage: 'coming-of-age', cultures: ['xhosa', 'zulu'],
            description: 'A rite of passage for young women, marking their transition into womanhood.',
            procedure: 'When a girl has her first menstruation, she is secluded for a period to be taught by elder women about womanhood, marriage, and her future role in the community. The ceremony involves specific rituals, teachings, and celebrations.',
            significance: 'Prepares young women for marriage and adult responsibilities, instilling values of respect, loyalty, and family cohesion. It is a celebrated transition that reduces the likelihood of children outside of marriage.',
            sources: {
                primary: ['https://www.imvabainstitute.co.za/intonjane-part-1-kwaxhosa/'],
                secondary: ["Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies."]
            }
        },
        {
            id: 'lobola', name: 'Lobola', stage: 'marriage', cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele', 'pedi', 'tsonga', 'venda'],
            description: "The practice of bride wealth, where the groom's family presents gifts, traditionally cattle, to the bride's family.",
            procedure: 'Negotiations are conducted between the two families, often through intermediaries (abanyana). The number of cattle (or the equivalent monetary value) is agreed upon, and the exchange solidifies the union.',
            significance: 'Lobola is not a "purchase" but a gesture of gratitude and a way to unite the two families. It legitimizes the marriage and demonstrates the groom\'s commitment and ability to provide for his wife.',
            sources: {
                primary: ['https://www.sowetanlive.co.za/news/2023-09-15-lobola-a-cultural-practice-of-unity-and-family/'],
                secondary: ["Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 2, Influence on Xhosa social structure and beliefs."]
            }
        },
        {
            id: 'umngcwabo', name: 'Umngcwabo', stage: 'death', cultures: ['xhosa', 'zulu', 'ndebele'],
            description: 'A traditional funeral ceremony to honour the deceased and ensure their spirit transitions to the ancestral realm.',
            procedure: 'Involves specific rituals like the slaughter of a cow (ukuherebha) to accompany the spirit, speeches, and traditional songs. The body is traditionally buried in a specific posture (e.g., sitting, facing east). Post-burial rituals like ukubuyisa (bringing the spirit back home) are performed later.',
            significance: 'Death is seen not as an end but as a transition to becoming an ancestor (idlozi/ithongo). The funeral is a community event that honors the deceased\'s life and reinforces the connection between the living and the dead. Ancestors are revered and believed to guide and protect the living.',
            sources: {
                primary: ['https://www.news24.com/news24/southafrica/news/the-meaning-of-xhosa-funeral-rituals-20181206', 'https://www.sundaynews.co.zw/ndebele-burial-customs/'],
                secondary: ["Beyond the Grave: A Son's Journey Through Xhosa Tradition, Spirituality, and Freedom: Preface & Chapter 1."]
            }
        }
    ];


    // --- Event Delegation ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        // Modal triggers
        const modalButton = target.closest('[data-modal-target]');
        if (modalButton) {
            event.preventDefault();
            openModal(modalButton.dataset.modalTarget);
            return;
        }

        // Modal close buttons
        const modalCloseButton = target.closest('[data-modal-close]');
        if (modalCloseButton) {
            event.preventDefault();
            closeModal(modalCloseButton.closest('.modal'));
            return;
        }

        // Accordion toggles
        const accordionButton = target.closest('.accordion-toggle');
        if (accordionButton) {
            const content = accordionButton.nextElementSibling;
            if (content && content.classList.contains('accordion-content')) {
                const icon = accordionButton.querySelector('i.fa-chevron-down');
                const isOpen = content.classList.toggle('open');
                content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : null;
                if (icon) icon.classList.toggle('rotate-180', isOpen);
            }
        }
        
        // --- Event handlers specific to the customs page ---
        if (document.getElementById('customs-catalogue')) {
            if (target.id === 'searchBtn' || target.closest('#searchBtn')) {
                const query = document.getElementById('customSearch').value;
                const results = searchCustoms(query);
                displayCustomsResults(results);
            }
            if (target.id === 'wizardSearch' || target.closest('#wizardSearch')) {
                 const stage = document.getElementById('lifeStage').value;
                const culture = document.getElementById('culturalFilter').value;
                const results = searchCustoms('', stage, culture);
                displayCustomsResults(results);
            }
        }
    });

    // --- Modal Functions ---
    // (Keep your existing modal functions here)
    async function openModal(modalId) { /* ... */ }
    function closeModal(modal) { /* ... */ }


    // --- Render Functions ---
    // (Keep renderTrainingCatalogue, renderToolsCatalogue, renderGames here)
    function renderTrainingCatalogue() {
        const container = document.getElementById('course-catalogue');
        if (!container) return;
        container.innerHTML = '';
        trainingData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item mb-8';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg">
                    <span class="text-xl md:text-2xl font-bold">${category.title}</span>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content mt-4 pl-4 border-l-4 border-${category.color}">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                        ${category.courses.map(course => `
                            <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700">
                                <div class="flex items-center mb-4"><i class="${course.icon} text-3xl text-${category.color} mr-4"></i><h4 class="text-xl font-bold">${course.title}</h4></div>
                                <p class="text-gray-400 mb-4 h-20">${course.description}</p>
                                <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center">Start Module</span>
                            </a>
                        `).join('')}
                    </div>
                </div>`;
            container.appendChild(section);
        });
    }

    function renderToolsCatalogue() {
        const container = document.getElementById('tools-catalogue');
        if (!container) return;
        container.innerHTML = '';
        toolData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item mb-6';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                    <span class="text-2xl font-bold">${category.title}</span><i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content mt-4 pl-4 border-l-4 border-${category.color}">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                        ${category.tools.map(tool => {
                            const isModal = !!tool.modal;
                            const tag = isModal ? 'button' : 'a';
                            const attrs = isModal 
                                ? `type="button" data-modal-target="${tool.modal}"` 
                                : `href="${tool.url}" ${tool.external ? 'target="_blank" rel="noopener noreferrer"' : ''}`;
                            return `
                                <${tag} ${attrs} class="tool-card bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300">
                                   <i class="${tool.icon} text-4xl text-${category.color.split('-')[0]}-400 mb-4"></i>
                                   <h3 class="text-xl font-bold mb-2">${tool.name}</h3>
                                   <p class="text-gray-400 flex-grow">${tool.description}</p>
                                </${tag}>`;
                        }).join('')}
                    </div>
                </div>`;
            container.appendChild(section);
        });
    }

    function renderGames() { /* ... existing function ... */ }


    // --- NEW FUNCTIONS FOR CUSTOMS PAGE ---
    
    function searchCustoms(query, stage = '', culture = '') {
        return customsDatabase.filter(custom => {
            const nameMatch = custom.name.toLowerCase().includes(query.toLowerCase());
            const stageMatch = !stage || custom.stage === stage;
            const cultureMatch = !culture || culture === 'all' || custom.cultures.includes(culture);
            return nameMatch && stageMatch && cultureMatch;
        });
    }

    function displayCustomsResults(results) {
        const resultsContainer = document.getElementById('resultsContainer');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p class="text-gray-400 col-span-1 md:col-span-2 text-center">No customs found matching your criteria.</p>';
            return;
        }

        results.forEach(custom => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1';
            card.innerHTML = `
                <h3 class="text-2xl font-bold text-purple-400 mb-2">${custom.name}</h3>
                <p class="text-sm uppercase text-gray-400 mb-4">${custom.cultures.join(', ')} - ${custom.stage}</p>
                <p class="mb-4 text-gray-300">${custom.description}</p>
                <div class="accordion-item">
                    <button class="accordion-toggle w-full flex justify-between items-center text-left py-2 text-purple-300">
                        <span class="font-semibold">View Details</span>
                        <i class="fas fa-chevron-down transform transition-transform"></i>
                    </button>
                    <div class="accordion-content mt-4 pl-4 border-l-2 border-purple-400 text-sm">
                        <h4 class="font-bold text-lg mb-2">Procedure:</h4>
                        <p class="mb-4">${custom.procedure}</p>
                        <h4 class="font-bold text-lg mb-2">Significance:</h4>
                        <p class="mb-4">${custom.significance}</p>
                        ${custom.variations ? Object.entries(custom.variations).map(([culture, text]) => `<p class="mb-2"><strong>${culture.charAt(0).toUpperCase() + culture.slice(1)} Variation:</strong> ${text}</p>`).join('') : ''}
                        <div class="mt-4 pt-4 border-t border-gray-700">
                            <h4 class="font-bold text-lg mb-2">Sources:</h4>
                            <p class="text-sm"><strong>Primary:</strong> ${custom.sources.primary.map(src => `<a href="${src}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Reference</a>`).join(', ')}</p>
                            <p class="text-sm"><strong>Secondary:</strong> ${custom.sources.secondary.join(', ')}</p>
                        </div>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    function renderCustomsPage() {
        const container = document.getElementById('customs-catalogue');
        if (!container) return;

        container.innerHTML = `
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold font-roboto mb-4">South African Traditional Customs</h1>
                <p class="text-xl text-gray-400 max-w-3xl mx-auto">An interactive guide to the rich tapestry of cultural practices from birth to death.</p>
            </div>
            <section class="search-interface bg-gray-800 p-6 rounded-lg mb-12 shadow-lg">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div class="manual-search">
                        <label for="customSearch" class="block text-sm font-semibold mb-2 text-gray-300">Search by Name</label>
                        <div class="flex">
                            <input type="text" id="customSearch" placeholder="e.g., Imbeleko, Lobola..." class="w-full bg-gray-700 border border-gray-600 rounded-l-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                            <button id="searchBtn" class="bg-purple-600 hover:bg-purple-700 rounded-r-lg px-6 py-3 font-bold text-white transition-colors">Search</button>
                        </div>
                    </div>
                    <div class="wizard-interface">
                        <label class="block text-sm font-semibold mb-2 text-gray-300">Filter by Category</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <select id="lifeStage" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="">All Life Stages</option>
                                <option value="birth">Birth & Early Childhood</option>
                                <option value="coming-of-age">Coming of Age</option>
                                <option value="marriage">Marriage & Union</option>
                                <option value="death">Death & Ancestral</option>
                            </select>
                            <select id="culturalFilter" class="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                <option value="all">All Cultures</option>
                                <option value="xhosa">Xhosa</option>
                                <option value="zulu">Zulu</option>
                                <option value="sotho">Sotho</option>
                                <option value="ndebele">Ndebele</option>
                                <option value="venda">Venda</option>
                                <option value="swazi">Swazi</option>
                                <option value="pedi">Pedi</option>
                                <option value="tsonga">Tsonga</option>
                            </select>
                            <button id="wizardSearch" class="bg-purple-600 hover:bg-purple-700 rounded-lg w-full py-3 font-bold text-white transition-colors">Find</button>
                        </div>
                    </div>
                </div>
            </section>
            <section id="resultsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Initial results will be loaded here -->
            </section>
        `;
        // Initial display of all customs
        displayCustomsResults(customsDatabase);
    }


    // --- INITIALIZE ALL DYNAMIC CONTENT ---
    renderTrainingCatalogue();
    renderToolsCatalogue();
    renderGames();
    renderCustomsPage(); // New function call
});
