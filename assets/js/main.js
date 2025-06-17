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
                { title: "The SA Constitution", icon: "fas fa-landmark", description: "Understand your foundational rights as a father and a citizen.", url: "training/course-constitution.html" },
                { title: "The Children's Act", icon: "fas fa-child", description: "A deep dive into parental rights, responsibilities, care, and contact.", url: "training/course-childrens-act.html" },
                { title: "Family Law Overview", icon: "fas fa-balance-scale", description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.", url: "training/course-family-law.html" }
            ] 
        },
        {
            title: "👨‍👧‍👦 Practical Parenting Skills",
            color: "blue-500",
            courses: [
                 { title: "Co-Parenting 101", icon: "fas fa-hands-helping", description: "Master communication, conflict resolution, and building effective parenting plans.", url: "training/course-coparenting.html" },
                 { title: "Newborn & Daily Care", icon: "fas fa-baby-carriage", description: "From changing diapers to installing car seats, gain confidence in daily tasks.", url: "training/course-newborn-daily-care.html" },
                 { title: "Building Your Own Curriculum", icon: "fas fa-pencil-ruler", description: "A guide for the homeschooling father to create a practical, values-based education.", url: "training/course-build-curriculum.html" }
            ]
        },
        {
            title: "🦅 Cultural & Ancestral Wisdom",
            color: "yellow-500",
            courses: [
                { title: "The Unbroken Chain", icon: "fas fa-link", description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty.", url: "training/course-unbroken-chain.html" },
                { title: "Finding Your Ancestors Within", icon: "fas fa-dna", description: "A guide to modern spirituality, blending science with tradition.", url: "training/course-ancestors-within.html" },
                { title: "The Power of the Extended Family", icon: "fas fa-users", description: "Champion the resilient household. Learn how your family structure is a core strength.", url: "training/course-extended-family.html" }
            ]
        },
        {
            title: "🔥 Advanced Advocacy & Self-Sufficiency",
            color: "red-500",
            courses: [
                { title: "A Father's Shield", icon: "fas fa-gavel", description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies.", url: "training/course-fathers-shield.html" },
                { title: "Risk Management for Fathers", icon: "fas fa-shield-alt", description: "Apply OHS principles to family life to identify and mitigate risks.", url: "training/course-risk-management.html" }
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
            title: "🗂️ Knowledge & Reference",
            color: "purple-500",
            tools: [
                { name: "Forms & Templates", icon: "fas fa-folder-open", description: "Access legal templates and guided forms.", url: "forms.html" },
                { name: "Traditional Customs", icon: "fas fa-feather-alt", description: "Explore a database of cultural practices.", url: "customs.html" },
                { name: "LegalHelp Hub", icon: "fas fa-hands-helping", description: "A comprehensive legal library. Coming Soon!", url: "legalhelp-coming-soon.html" }
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
                 { name: "See All Games", icon: "fas fa-gamepad", description: "Visit the main arcade to play all available games.", url: "games.html" }
            ]
        }
    ];

    const gameData = [
        { title: "Cultural Dress-Up Adventure", description: "Learn about traditional attire for different ceremonies.", url: "games/cultural-dress-up.html", icon: "fas fa-tshirt text-pink-400", category: "kids" },
        { title: "Ancestor's Quest", description: "A point-and-click adventure to gather items for a ceremony.", url: "games/ancestors-quest.html", icon: "fas fa-map-signs text-green-400", category: "kids" },
        { title: "My Family, My Clan", description: "Build an interactive family tree and learn about your lineage.", url: "games/my-family-my-clan.html", icon: "fas fa-users text-blue-400", category: "kids" },
        { title: "Customs & Consequences", description: "A scenario-based game to test your decision-making.", url: "games/customs-consequences.html", icon: "fas fa-balance-scale-right text-purple-400", category: "leaders" },
        { title: "Justice Builder", description: "A simulator where you build a case from scratch.", url: "games/justice-builder.html", icon: "fas fa-gavel text-orange-500", category: "leaders" },
        { title: "Goliath's Reckoning", description: "A story-driven game about fighting for justice.", url: "games/goliaths-reckoning.html", icon: "fas fa-fist-raised text-red-500", category: "leaders" }
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
            description: "A rite of passage for young women, marking their transition into womanhood.",
            procedure: "When a girl has her first menstruation, she is secluded for a period to be taught by elder women about womanhood, marriage, and her future role in the community. The ceremony involves specific rituals, teachings, and celebrations.",
            significance: "Prepares young women for marriage and adult responsibilities, instilling values of respect, loyalty, and family cohesion. It is a celebrated transition.",
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
            significance: "Death is seen not as an end but as a transition to becoming an ancestor (idlozi/ithongo). The funeral is a community event that honors the deceased's life and reinforces the connection between the living and the dead.",
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
            const modal = document.getElementById(modalButton.dataset.modalTarget);
            if(modal) modal.classList.remove('hidden');
            return;
        }

        // Modal close buttons
        const modalCloseButton = target.closest('[data-modal-close]');
        if (modalCloseButton) {
            event.preventDefault();
            const modal = modalCloseButton.closest('.modal');
            if(modal) modal.classList.add('hidden');
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
        
        // Event handlers specific to the customs page
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

    // --- Render Functions ---
    
    function renderTrainingCatalogue() {
        const container = document.getElementById('course-catalogue');
        if (!container) return;
        container.innerHTML = '';
        trainingData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item mb-8';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                    <span class="text-xl md:text-2xl font-bold">${category.title}</span>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content mt-4 pl-4 border-l-4 border-${category.color}">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
                        ${category.courses.map(course => `
                            <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300">
                                <div class="flex items-center mb-4"><i class="${course.icon} text-3xl text-${category.color} mr-4"></i><h4 class="text-xl font-bold">${course.title}</h4></div>
                                <p class="text-gray-400 mb-4 h-24">${course.description}</p>
                                <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center mt-auto">Start Module</span>
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

    function renderGames() {
        const container = document.getElementById('games-page-container');
        if (!container) return;
        container.innerHTML = '';
        const categories = {
            kids: { title: "For the Little Ones (Ages 4-12)", games: [] },
            leaders: { title: "Future Leaders (Ages 13+)", games: [] },
        };
        gameData.forEach(game => {
            if (categories[game.category]) categories[game.category].games.push(game);
        });
        for (const key in categories) {
            const category = categories[key];
            if (category.games.length > 0) {
                const categoryWrapper = document.createElement('div');
                categoryWrapper.className = "mb-12";
                categoryWrapper.innerHTML = `
                    <h2 class="text-3xl font-bold mb-6 category-title">${category.title}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        ${category.games.map(game => `
                            <div class="game-card rounded-lg overflow-hidden shadow-lg relative bg-gray-800 border border-gray-700 hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2">
                                <a href="${game.url}" class="game-card-link absolute inset-0 z-10"></a>
                                <div class="p-6">
                                    <i class="${game.icon} text-4xl mb-4"></i>
                                    <h3 class="font-bold text-xl mb-2 text-white">${game.title}</h3>
                                    <p class="text-gray-400 text-base">${game.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
                container.appendChild(categoryWrapper);
            }
        }
    }

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
                </div>`;
            resultsContainer.appendChild(card);
        });
    }

    function renderCustomsPage() {
        const container = document.getElementById('customs-catalogue');
        if (!container) return;
        const customsGames = gameData.filter(game => ['Cultural Dress-Up Adventure', 'Ancestor\'s Quest', 'My Family, My Clan', 'Customs & Consequences'].includes(game.title));

        container.innerHTML = `
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold font-roboto-slab text-white">South African Traditional Customs</h1>
                <p class="text-xl text-gray-400 max-w-3xl mx-auto">An interactive guide to the rich tapestry of cultural practices from birth to death.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div class="option-card bg-gray-800 p-8 rounded-xl text-center border border-gray-700 hover:border-teal-500">
                    <i class="fas fa-magic text-5xl text-teal-400 mb-4"></i>
                    <h4 class="text-2xl font-bold text-white mb-2">Customs Wizard</h4>
                    <p class="text-gray-400">Answer a few questions to find the customs relevant to you.</p>
                </div>
                <div class="option-card bg-gray-800 p-8 rounded-xl text-center border border-gray-700 hover:border-blue-500">
                     <i class="fas fa-search text-5xl text-blue-400 mb-4"></i>
                    <h4 class="text-2xl font-bold text-white mb-2">Manual Search</h4>
                    <p class="text-gray-400">Search for a specific custom or practice by name.</p>
                </div>
                <div class="option-card bg-gray-800 p-8 rounded-xl text-center border border-gray-700 hover:border-pink-500">
                    <i class="fas fa-gamepad text-5xl text-pink-400 mb-4"></i>
                    <h4 class="text-2xl font-bold text-white mb-2">Play a Game</h4>
                    <p class="text-gray-400">Learn about our traditions through interactive games.</p>
                </div>
            </div>

            <div id="customs-accordion" class="space-y-6">
                <!-- Accordions will be rendered here -->
            </div>`;
            
        const accordionContainer = document.getElementById('customs-accordion');
        const stages = ['birth', 'coming-of-age', 'marriage', 'death'];
        const stageTitles = {
            'birth': '🍼 Birth & Early Childhood',
            'coming-of-age': '🔥 Coming of Age',
            'marriage': '💍 Marriage & Union',
            'death': '🕊️ Death & Ancestral Rites'
        };

        stages.forEach(stage => {
            const stageCustoms = customsDatabase.filter(c => c.stage === stage);
            if(stageCustoms.length > 0) {
                const section = document.createElement('div');
                section.className = 'accordion-item';
                section.innerHTML = `
                    <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                        <span class="text-2xl font-bold">${stageTitles[stage]}</span><i class="fas fa-chevron-down transform transition-transform"></i>
                    </button>
                    <div class="accordion-content mt-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                            ${stageCustoms.map(custom => {
                                 return `<div class="bg-gray-900 p-6 rounded-lg border border-gray-700">
                                            <h3 class="text-xl font-bold text-purple-400">${custom.name}</h3>
                                            <p class="text-sm text-gray-400 uppercase mb-2">${custom.cultures.join(', ')}</p>
                                            <p>${custom.description}</p>
                                        </div>`
                            }).join('')}
                        </div>
                    </div>`;
                accordionContainer.appendChild(section);
            }
        });
    }

    // --- INITIALIZE ALL DYNAMIC CONTENT ---
    renderTrainingCatalogue();
    renderToolsCatalogue();
    renderGames();
    renderCustomsPage();
});
