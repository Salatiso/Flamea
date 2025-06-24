/**
 * Flamea.org - Final Unified Main Script
 * Version: 8.1 (Updated Training Data)
 * Description:
 * This single script manages all core interactive functionalities for Flamea.org.
 * - Dynamically loads the sidebar from sidebar.html.
 * - Handles all modals, including the iSazi AI Chatbot.
 * - Manages all collapsible accordion sections and sidebar submenus.
 * - Renders dynamic catalogues for Training, Tools, Games, and Customs pages.
 * - Includes full search and filter functionality for the Customs page.
 * - Implements a dynamic background theme that changes based on the time of day.
 *
 * This file combines all features from previous versions for the Flamea website.
 */
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. CORE INITIALIZATION ---
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) throw new Error('Could not load sidebar.html');
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                initializeSiteFeatures();
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                sidebarPlaceholder.innerHTML = '<p class="text-red-400 p-4">Error: Could not load navigation.</p>';
            });
    } else {
        initializeSiteFeatures();
    }

    function initializeSiteFeatures() {
        setDynamicBackground();
        initializeModals();
        initializeAccordionsAndSubmenus();
        setActiveSidebarLink();
        renderTrainingCatalogue();
        renderToolsCatalogue();
        renderGamesCatalogue();
        renderCustomsPage();
    }

    // --- 2. DYNAMIC BACKGROUND LOGIC ---
    function setDynamicBackground() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const now = new Date();
        const hour = now.getHours();
        let themeClass = '';

        if (hour >= 4 && hour < 10) {
            themeClass = 'bg-theme-accountability';
        } else if (hour >= 10 && hour < 13) {
            themeClass = 'bg-theme-technology';
        } else if (hour >= 13 && hour < 16) {
            themeClass = 'bg-theme-coming-home';
        } else if (hour >= 16 && hour < 18) {
            themeClass = 'bg-theme-responsibility';
        } else if (hour >= 18 && hour < 23) {
            themeClass = 'bg-theme-mountains';
        } else {
            themeClass = 'bg-theme-boyhood';
        }

        mainContent.classList.add(themeClass);
    }

    // --- 3. INTERACTIVE COMPONENT HANDLERS ---
    function setActiveSidebarLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('#sidebar-placeholder a');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
                const parentSubmenu = link.closest('.submenu-container');
                if (parentSubmenu) {
                    parentSubmenu.style.display = 'block';
                    const parentToggle = parentSubmenu.closest('[data-menu-item]').querySelector('.submenu-toggle');
                    if (parentToggle) {
                        const icon = parentToggle.querySelector('i.fa-chevron-down');
                        if (icon) icon.classList.add('rotate-180');
                    }
                }
            }
        });
    }

    function initializeAccordionsAndSubmenus() {
        document.body.addEventListener('click', function(event) {
            const toggleButton = event.target.closest('.accordion-toggle, .submenu-toggle');
            if (!toggleButton) return;
            const parentItem = toggleButton.closest('.accordion-item, [data-menu-item]');
            if (!parentItem) return;
            const content = parentItem.querySelector('.accordion-content, .submenu-container');
            const icon = toggleButton.querySelector('i.fa-chevron-down');
            if (content) {
                if (content.classList.contains('accordion-content')) {
                    const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
                    content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px';
                    if (icon) icon.classList.toggle('rotate-180', !isOpen);
                } else if (content.classList.contains('submenu-container')) {
                    const isVisible = content.style.display === 'block';
                    content.style.display = isVisible ? 'none' : 'block';
                    if (icon) icon.classList.toggle('rotate-180', !isVisible);
                }
            }
        });
    }

    function initializeModals() {
        document.body.addEventListener('click', function(event) {
            const openTrigger = event.target.closest('[data-modal-target]');
            const closeTrigger = event.target.closest('[data-modal-close]');
            if (openTrigger) {
                const modalId = openTrigger.dataset.modalTarget;
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.add('visible');
            } else if (closeTrigger) {
                const modal = closeTrigger.closest('.custom-modal');
                if (modal) modal.classList.remove('visible');
            }
        });
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('custom-modal') && event.target.classList.contains('visible')) {
                event.target.classList.remove('visible');
            }
        });
    }

    // --- 4. DYNAMIC CONTENT DATA & RENDERERS ---

    // ** UPDATED AND COMPLETE TRAINING DATA **
    const trainingData = [{
        title: "🎓 Legal & Constitutional Foundations",
        color: "green-500",
        icon: "fas fa-landmark",
        courses: [{
            title: "The SA Constitution",
            icon: "fas fa-landmark",
            description: "Understand your foundational rights as a father and a citizen.",
            url: "training/course-constitution.html"
        }, {
            title: "The Children's Act",
            icon: "fas fa-child",
            description: "A deep dive into parental rights, responsibilities, care, and contact.",
            url: "training/course-childrens-act.html"
        }, {
            title: "Family Law Overview",
            icon: "fas fa-balance-scale",
            description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.",
            url: "training/course-family-law.html"
        }]
    }, {
        title: "👨‍👧‍👦 Practical Parenting Skills",
        color: "blue-500",
        icon: "fas fa-hands-helping",
        courses: [{
            title: "Co-Parenting 101",
            icon: "fas fa-handshake",
            description: "Master communication, conflict resolution, and building effective parenting plans.",
            url: "training/course-coparenting.html"
        }, {
            title: "Newborn & Daily Care",
            icon: "fas fa-baby",
            description: "From changing diapers to installing car seats, gain confidence in daily tasks.",
            url: "training/course-newborn-daily-care.html"
        }, {
            title: "Building Your Own Curriculum",
            icon: "fas fa-pencil-ruler",
            description: "A guide for the homeschooling father to create a practical, values-based education.",
            url: "training/course-build-curriculum.html"
        }]
    }, {
        title: "🦅 Cultural & Ancestral Wisdom",
        color: "yellow-500",
        icon: "fas fa-feather-alt",
        courses: [{
            title: "The Unbroken Chain",
            icon: "fas fa-link",
            description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty.",
            url: "training/course-unbroken-chain.html"
        }, {
            title: "Finding Your Ancestors Within",
            icon: "fas fa-dna",
            description: "A guide to modern spirituality, blending science with tradition.",
            url: "training/course-ancestors-within.html"
        }, {
            title: "The Power of the Extended Family",
            icon: "fas fa-users",
            description: "Champion the resilient household. Learn how your family structure is a core strength.",
            url: "training/course-extended-family.html"
        }]
    }, {
        title: "🔥 Advanced Advocacy & Self-Sufficiency",
        color: "red-500",
        icon: "fas fa-gavel",
        courses: [{
            title: "A Father's Shield",
            icon: "fas fa-shield-alt",
            description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies.",
            url: "training/course-fathers-shield.html"
        }, {
            title: "Risk Management for Fathers",
            icon: "fas fa-chart-line",
            description: "Apply OHS principles to family life to identify and mitigate risks.",
            url: "training/course-risk-management.html"
        }, {
            title: "Khulu: The Constitution, Your Ultimate Shield",
            icon: "fas fa-star-of-life",
            description: "Advanced constitutional principles for family elders to champion and protect their kin.",
            url: "training/courses_khulu-the_constitution_your_ultimate_shield.html"
        }, {
            title: "Khulu: Senior Crusaders",
            icon: "fas fa-user-shield",
            description: "Specialized training for elders on their rights and their role as pillars of the family.",
            url: "training/course-khulu-senior-crusaders.html"
        }]
    }, {
        title: "🧒 For Kids: Know Your Rights",
        color: "purple-500",
        icon: "fas fa-child-reaching",
        courses: [{
            title: "The Big Rule Book",
            icon: "fas fa-book-open",
            description: "An interactive guide to understand rules, rights, and responsibilities in a fun way.",
            url: "training/course-kids-big_rule_book.html"
        }, {
            title: "The Best Nest",
            icon: "fas fa-home",
            description: "Helping children understand family changes and co-parenting through storytelling.",
            url: "training/course-kids-the_best_nest.html"
        }, {
            title: "Who's In Charge?",
            icon: "fas fa-user-friends",
            description: "A course about respecting authority and understanding family structures.",
            url: "training/course-kids-whos_in_charge.html"
        }, {
            title: "My Rights Shield",
            icon: "fas fa-shield-virus",
            description: "Empowering children with knowledge about their constitutional rights in an accessible format.",
            url: "training/course_kids-rights_shield.html"
        }]
    }];

    const toolData = [{
        title: "🛠️ Core Planning & Tracking Tools",
        color: "blue-500",
        icon: "fas fa-tools",
        tools: [{
            name: "Training Needs Assessment",
            icon: "fas fa-clipboard-check",
            description: "Start here to get a personalized action plan.",
            url: "training-assessment.html"
        }, {
            name: "Parenting Plan Builder",
            icon: "fas fa-file-signature",
            description: "Create a comprehensive, court-ready parenting plan.",
            url: "plan-builder.html"
        }, {
            name: "Family Activity Tracker",
            icon: "fas fa-chart-line",
            description: "Log contributions, schedules, and important events.",
            url: "activity-tracker.html"
        }, {
            name: "Resource Locator",
            icon: "fas fa-map-marked-alt",
            description: "Find Family Advocates, courts, and father-friendly NGOs.",
            url: "locator.html"
        }]
    }, {
        title: "🗂️ Knowledge & Reference",
        color: "purple-500",
        icon: "fas fa-folder-open",
        tools: [{
            name: "Forms & Templates",
            icon: "fas fa-folder-open",
            description: "Access legal templates and guided forms.",
            url: "forms.html"
        }, {
            name: "Traditional Customs",
            icon: "fas fa-feather-alt",
            description: "Explore a database of cultural practices.",
            url: "customs.html"
        }, {
            name: "LegalHelp Initiative",
            icon: "fas fa-hands-helping",
            description: "A community-driven project to demystify SA law.",
            url: "legalhelp.html"
        }]
    }, {
        title: "📚 Media & Publications",
        color: "yellow-500",
        icon: "fas fa-book-open",
        tools: [{
            name: "Read Our Books",
            icon: "fas fa-book-open",
            description: "Access exclusive books on fatherhood and the law.",
            url: "publications.html"
        }, {
            name: "Flamea Podcast",
            icon: "fas fa-podcast",
            description: "Listen to discussions on key topics for fathers.",
            url: "#",
            modal: "podcast-modal"
        }, {
            name: "YouTube Channel",
            icon: "fab fa-youtube",
            description: "Watch video guides, tutorials, and interviews.",
            url: "https://www.youtube.com/@Flamea2024",
            external: true
        }]
    }, {
        title: "🎮 Interactive Games",
        color: "pink-500",
        icon: "fas fa-gamepad",
        tools: [{
            name: "See All Games",
            icon: "fas fa-gamepad",
            description: "Visit the main arcade to play all available games.",
            url: "games.html"
        }]
    }];

    const gameData = [{
        title: "👑 Constitutional Champions",
        color: "yellow-500",
        icon: "fas fa-trophy",
        description: "Learn the fundamentals of the South African Constitution and your rights.",
        games: [{
            title: "Kid Konstitution",
            description: "A fun and easy quiz game for learning the basics of your rights.",
            url: "games/kid-konstitution.html",
            icon: "fas fa-child text-blue-400"
        }, {
            title: "Constitution Quest",
            description: "An epic text-based adventure to find the 10 lost scrolls of the Bill of Rights.",
            url: "games/constitution-quest.html",
            icon: "fas fa-scroll text-yellow-400"
        }, {
            title: "Law & Layers Quest",
            description: "Categorize legal concepts into the Constitution, Legislation, or Common Law.",
            url: "games/law-layers-quest.html",
            icon: "fas fa-layer-group text-indigo-400"
        }, {
            title: "Rights Racer",
            description: "A fast-paced arcade game where you race to collect rights and avoid obstacles.",
            url: "games/rights-racer.html",
            icon: "fas fa-flag-checkered text-green-400"
        }, {
            title: "Mythbuster",
            description: "Test your knowledge by separating legal facts from common myths.",
            url: "games/mythbuster-game.html",
            icon: "fas fa-ghost text-teal-400"
        }]
    }, {
        title: "🛡️ Strategic Defenders",
        color: "red-500",
        icon: "fas fa-shield-alt",
        description: "Develop your strategic thinking with advanced legal simulations and challenges.",
        games: [{
            title: "Constitution Defender",
            description: "Defend the pillars of justice from bugs of corruption in this arcade shooter.",
            url: "games/constitution-defender.html",
            icon: "fas fa-rocket text-purple-400"
        }, {
            title: "Constitution Champions",
            description: "A timed quiz challenge to see how long you can defend your knowledge.",
            url: "games/constitution-champions.html",
            icon: "fas fa-trophy text-yellow-400"
        }, {
            title: "Constitution Crusaders",
            description: "Conquer all 9 provinces in a map-based quiz to unite the nation.",
            url: "games/constitution-crusaders.html",
            icon: "fas fa-map-marked-alt text-orange-400"
        }, {
            title: "Goliath's Reckoning",
            description: "Face the Goliaths of our time in a story-driven battle of wits and legal knowledge.",
            url: "games/goliaths-reckoning.html",
            icon: "fas fa-fist-raised text-red-500"
        }, {
            title: "Justice Builder",
            description: "A simulation where you build a legal case from scratch, making critical decisions.",
            url: "games/justice-builder.html",
            icon: "fas fa-gavel text-gray-400"
        }, {
            title: "Legal Simulator",
            description: "A branching narrative game where your choices determine your success as a lawyer.",
            url: "games/legal-simulator.html",
            icon: "fas fa-briefcase text-cyan-400"
        }]
    }, {
        title: "🌍 Cultural & Satirical Explorations",
        color: "purple-500",
        icon: "fas fa-globe-africa",
        description: "Explore cultural traditions and the satirical side of the system.",
        games: [{
            title: "Cultural Dress-Up Adventure",
            description: "Learn about traditional attire in this drag-and-drop game.",
            url: "games/cultural-dress-up.html",
            icon: "fas fa-tshirt text-pink-400"
        }, {
            title: "Ancestor's Quest",
            description: "A point-and-click adventure to gather items for a traditional ceremony.",
            url: "games/ancestors-quest.html",
            icon: "fas fa-map-signs text-green-400"
        }, {
            title: "My Family, My Clan",
            description: "Build an interactive family tree and learn about your Xhosa lineage.",
            url: "games/my-family-my-clan.html",
            icon: "fas fa-users text-blue-400"
        }, {
            title: "Customs & Consequences",
            description: "A scenario-based game to test your decision-making in traditional contexts.",
            url: "games/customs-consequences.html",
            icon: "fas fa-balance-scale-right text-purple-400"
        }, {
            title: "The System: A Satirical Game",
            description: "A text-based satirical adventure poking fun at the legal system.",
            url: "games/satirical-game.html",
            icon: "fas fa-theater-masks text-gray-500"
        }]
    }];

    const customsDatabase = [{
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
        },
        sources: {
            primary: ['https://www.nalug.net/exploring-the-vibrant-xhosa-cultural-traditions-an-insight-into-its-rich-heritage-and-beliefs/'],
            secondary: ['Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies.']
        }
    }, {
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
        },
        sources: {
            primary: ['https://en.wikipedia.org/wiki/Ulwaluko', 'https://en.wikipedia.org/wiki/Lebollo_la_banna'],
            secondary: ["The HomeSchooling Father - Master Edition 5-9-24.docx: Chapter 1, The formal school system."]
        }
    }, {
        id: 'intonjane',
        name: 'Intonjane',
        stage: 'coming-of-age',
        cultures: ['xhosa', 'zulu'],
        description: "A rite of passage for young women, marking their transition into womanhood.",
        procedure: "When a girl has her first menstruation, she is secluded for a period to be taught by elder women about womanhood, marriage, and her future role in the community. The ceremony involves specific rituals, teachings, and celebrations.",
        significance: "Prepares young women for marriage and adult responsibilities, instilling values of respect, loyalty, and family cohesion. It is a celebrated transition.",
        sources: {
            primary: ['https://www.imvabainstitute.co.za/intonjane-part-1-kwaxhosa/'],
            secondary: ["Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies."]
        }
    }, {
        id: 'lobola',
        name: 'Lobola',
        stage: 'marriage',
        cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele', 'pedi', 'tsonga', 'venda'],
        description: "The practice of bride wealth, where the groom's family presents gifts, traditionally cattle, to the bride's family.",
        procedure: 'Negotiations are conducted between the two families, often through intermediaries (abanyana). The number of cattle (or the equivalent monetary value) is agreed upon, and the exchange solidifies the union.',
        significance: 'Lobola is not a "purchase" but a gesture of gratitude and a way to unite the two families. It legitimizes the marriage and demonstrates the groom\'s commitment and ability to provide for his wife.',
        sources: {
            primary: ['https://www.sowetanlive.co.za/news/2023-09-15-lobola-a-cultural-practice-of-unity-and-family/'],
            secondary: ["Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 2, Influence on Xhosa social structure and beliefs."]
        }
    }, {
        id: 'umngcwabo',
        name: 'Umngcwabo',
        stage: 'death',
        cultures: ['xhosa', 'zulu', 'ndebele'],
        description: 'A traditional funeral ceremony to honour the deceased and ensure their spirit transitions to the ancestral realm.',
        procedure: 'Involves specific rituals like the slaughter of a cow (ukuherebha) to accompany the spirit, speeches, and traditional songs. The body is traditionally buried in a specific posture (e.g., sitting, facing east). Post-burial rituals like ukubuyisa (bringing the spirit back home) are performed later.',
        significance: "Death is seen not as an end but as a transition to becoming an ancestor (idlozi/ithongo). The funeral is a community event that honors the deceased's life and reinforces the connection between the living and the dead.",
        sources: {
            primary: ['https://www.news24.com/news24/southafrica/news/the-meaning-of-xhosa-funeral-rituals-20181206', 'https://www.sundaynews.co.zw/ndebele-burial-customs/'],
            secondary: ["Beyond the Grave: A Son's Journey Through Xhosa Tradition, Spirituality, and Freedom: Preface & Chapter 1."]
        }
    }];

    function renderTrainingCatalogue() {
        const container = document.getElementById('course-catalogue');
        if (!container) return;
        container.innerHTML = '';
        trainingData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item mb-8';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                    <div class="flex items-center">
                        <i class="${category.icon} text-3xl text-${category.color} mr-4 w-8 text-center"></i>
                        <div><span class="text-xl md:text-2xl font-bold">${category.title}</span></div>
                    </div>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content" style="max-height: 0px; overflow: hidden; transition: max-height 0.5s ease-out;">
                    <div class="pt-6 pl-4 border-l-4 border-${category.color}">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${category.courses.map(course => `
                                <a href="${course.url}" class="course-card block bg-gray-900/80 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300 flex flex-col">
                                    <div class="flex items-center mb-4"><i class="${course.icon} text-3xl text-${category.color} mr-4"></i><h4 class="text-xl font-bold">${course.title}</h4></div>
                                    <p class="text-gray-400 flex-grow mb-4">${course.description}</p>
                                    <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center mt-auto">Start Module</span>
                                </a>
                            `).join('')}
                        </div>
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
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                    <div class="flex items-center">
                        <i class="${category.icon} text-3xl text-${category.color} mr-4 w-8 text-center"></i>
                        <div><span class="text-xl md:text-2xl font-bold">${category.title}</span></div>
                    </div>
                    <i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content" style="max-height: 0px; overflow: hidden; transition: max-height 0.5s ease-out;">
                    <div class="pt-6 pl-4 border-l-4 border-${category.color}">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${category.tools.map(tool => {
                                const isModal = !!tool.modal;
                                const tag = isModal ? 'button' : 'a';
                                const attrs = isModal ? `type="button" data-modal-target="${tool.modal}"` : `href="${tool.url}" ${tool.external ? 'target="_blank" rel="noopener noreferrer"' : ''}`;
                                return `<${tag} ${attrs} class="tool-card bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300">
                                    <i class="${tool.icon} text-4xl text-${category.color.split('-')[0]}-400 mb-4"></i><h3 class="text-xl font-bold mb-2">${tool.name}</h3>
                                    <p class="text-gray-400 flex-grow">${tool.description}</p></${tag}>`;
                            }).join('')}
                        </div>
                    </div>
                </div>`;
            container.appendChild(section);
        });
    }

    function renderGamesCatalogue() {
        const container = document.getElementById('games-catalogue');
        if (!container) return;
        container.innerHTML = '';
        gameData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item mb-8';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800/70 backdrop-blur-sm rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
                    <div class="flex items-center">
                        <i class="${category.icon || 'fas fa-gamepad'} text-3xl text-${category.color} mr-4 w-8 text-center"></i>
                        <div>
                            <span class="text-xl md:text-2xl font-bold">${category.title}</span>
                            <p class="text-sm text-gray-400">${category.description}</p>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down transform transition-transform text-gray-400"></i>
                </button>
                <div class="accordion-content" style="max-height: 0px; overflow: hidden; transition: max-height 0.5s ease-out;">
                    <div class="pt-6 pl-4 border-l-4 border-${category.color}">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            ${category.games.map(game => `
                                <a href="${game.url}" class="course-card block bg-gray-900/80 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300 flex flex-col text-left">
                                    <div class="flex items-start mb-4">
                                        <i class="${game.icon} text-3xl mr-4 w-8 text-center"></i>
                                        <h4 class="text-xl font-bold flex-1">${game.title}</h4>
                                    </div>
                                    <p class="text-gray-400 flex-grow mb-4">${game.description}</p>
                                    <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center mt-auto">Play Now</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            container.appendChild(section);
        });
    }

    function searchCustoms(query, stage, culture) {
        const lowerCaseQuery = query.toLowerCase();
        return customsDatabase.filter(custom => {
            const nameMatch = custom.name.toLowerCase().includes(lowerCaseQuery);
            const descriptionMatch = custom.description.toLowerCase().includes(lowerCaseQuery);
            const procedureMatch = custom.procedure.toLowerCase().includes(lowerCaseQuery);
            const significanceMatch = custom.significance.toLowerCase().includes(lowerCaseQuery);
            const stageMatch = !stage || stage === 'all' || custom.stage === stage;
            const cultureMatch = !culture || culture === 'all' || custom.cultures.includes(culture);
            return (nameMatch || descriptionMatch || procedureMatch || significanceMatch) && stageMatch && cultureMatch;
        });
    }

    function displayCustomsResults(results) {
        const container = document.getElementById('customs-results-container');
        if (!container) return;
        container.innerHTML = '';
        if (results.length === 0) {
            container.innerHTML = '<p class="text-gray-400 text-center col-span-full py-8">No customs found matching your criteria.</p>';
            return;
        }
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
        results.forEach(custom => {
            const card = document.createElement('div');
            card.className = 'bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700 flex flex-col';
            card.innerHTML = `
                <h3 class="text-2xl font-bold text-purple-400 mb-2">${custom.name}</h3>
                <p class="text-sm uppercase text-gray-400 mb-4">${custom.cultures.join(', ')} - ${custom.stage}</p>
                <p class="mb-4 text-gray-300 flex-grow">${custom.description}</p>
                <div class="accordion-item mt-auto">
                    <button class="accordion-toggle w-full flex justify-between items-center text-left py-2 text-purple-300 hover:text-white">
                        <span class="font-semibold">View Details</span>
                        <i class="fas fa-chevron-down transform transition-transform"></i>
                    </button>
                    <div class="accordion-content" style="max-height: 0px; overflow: hidden; transition: max-height 0.5s ease-out;">
                        <div class="pt-4 mt-4 border-t border-gray-600 pl-4 border-l-2 border-purple-400 text-sm text-gray-400">
                            <h4 class="font-bold text-lg mb-2 text-gray-200">Procedure:</h4>
                            <p class="mb-4">${custom.procedure}</p>
                            <h4 class="font-bold text-lg mb-2 text-gray-200">Significance:</h4>
                            <p class="mb-4">${custom.significance}</p>
                            ${Object.keys(custom.variations).length > 0 ? `<h4 class="font-bold text-lg mb-2 text-gray-200">Variations:</h4>` : ''}
                            ${Object.entries(custom.variations).map(([culture, text]) => `<p class="mb-2"><strong>${culture.charAt(0).toUpperCase() + culture.slice(1)}:</strong> ${text}</p>`).join('')}
                            <div class="mt-4 pt-4 border-t border-gray-700">
                                <h4 class="font-bold text-lg mb-2 text-gray-200">Sources:</h4>
                                <p class="text-sm"><strong>Primary:</strong> ${custom.sources.primary.map(src => `<a href="${src}" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:underline">Reference</a>`).join(', ')}</p>
                                <p class="text-sm"><strong>Secondary:</strong> ${custom.sources.secondary.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                </div>`;
            resultsGrid.appendChild(card);
        });
        container.appendChild(resultsGrid);
    }

    function renderCustomsPage() {
        const container = document.getElementById('customs-catalogue');
        if (!container) return;
        container.innerHTML = `
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold font-roboto text-white">South African Traditional Customs</h1>
                <p class="text-xl text-gray-400 mt-3 max-w-3xl mx-auto">An interactive guide to the rich tapestry of cultural practices, especially as a Xhosa man from the Transkei would know them.</p>
            </div>
            <div class="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg mb-12 sticky top-4 z-10 shadow-lg border border-gray-700">
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div class="md:col-span-2">
                        <label for="custom-search-input" class="block text-sm font-medium text-gray-300 mb-1">Search by Keyword</label>
                        <input type="text" id="custom-search-input" class="form-input" placeholder="e.g., 'imbeleko', 'ancestors'">
                    </div>
                    <div>
                        <label for="life-stage-filter" class="block text-sm font-medium text-gray-300 mb-1">Life Stage</label>
                        <select id="life-stage-filter" class="form-select">
                            <option value="all">All Stages</option>
                            <option value="birth">Birth</option>
                            <option value="coming-of-age">Coming of Age</option>
                            <option value="marriage">Marriage</option>
                            <option value="death">Death</option>
                        </select>
                    </div>
                    <div>
                        <label for="culture-filter" class="block text-sm font-medium text-gray-300 mb-1">Cultural Group</label>
                        <select id="culture-filter" class="form-select">
                            <option value="all">All Cultures</option>
                            <option value="xhosa">Xhosa</option>
                            <option value="zulu">Zulu</option>
                            <option value="sotho">Sotho</option>
                            <option value="ndebele">Ndebele</option>
                            <option value="swazi">Swazi</option>
                            <option value="pedi">Pedi</option>
                            <option value="tsonga">Tsonga</option>
                            <option value="venda">Venda</option>
                        </select>
                    </div>
                    <div>
                        <button id="customs-search-btn" class="btn btn-primary w-full"><i class="fas fa-search mr-2"></i>Search</button>
                    </div>
                </div>
            </div>
            <div id="customs-results-container"></div>`;
        const searchBtn = document.getElementById('customs-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = document.getElementById('custom-search-input').value;
                const stage = document.getElementById('life-stage-filter').value;
                const culture = document.getElementById('culture-filter').value;
                const results = searchCustoms(query, stage, culture);
                displayCustomsResults(results);
            });
        }
        displayCustomsResults(customsDatabase);
    }
});
// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const mouse = { x: null, y: null };

    window.addEventListener('mousemove', event => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });
    window.addEventListener('resize', () => {
        resizeCanvas();
        init();
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(139, 144, 150, 0.2)';
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let p of particles) { p.update(); }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = Math.sqrt(
                    ((particles[a].x - particles[b].x) ** 2) +
                    ((particles[a].y - particles[b].y) ** 2)
                );
                if (distance < (innerWidth / 9)) {
                    opacityValue = 1 - (distance / 150);
                    ctx.strokeStyle = `rgba(100, 116, 139, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[b].y);
                    ctx.lineTo(particles[b].x, particles[a].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    resizeCanvas();
    init();
    animate();
});