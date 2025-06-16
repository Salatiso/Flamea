// assets/js/main.js

/**
 * Flamea.org - Unified Main Script
 * This file contains the core sitewide JavaScript functionality.
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
                { name: "Forms & Wizards", icon: "fas fa-folder-open", description: "Access legal templates and guided forms.", url: "forms.html" },
                { name: "Resource Locator", icon: "fas fa-map-marked-alt", description: "Find Family Advocates, courts, and father-friendly NGOs.", url: "locator.html" }
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

    // --- Event Delegation ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;
        const modalButton = target.closest('[data-modal-target]');
        if (modalButton) {
            event.preventDefault();
            openModal(modalButton.dataset.modalTarget);
            return;
        }
        const modalCloseButton = target.closest('[data-modal-close]');
        if (modalCloseButton) {
            event.preventDefault();
            closeModal(modalCloseButton.closest('.modal'));
            return;
        }
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
    });

    // --- Modal Functions ---
    async function openModal(modalId) { /* ... implementation ... */ }
    function closeModal(modal) { /* ... implementation ... */ }

    // --- Render Functions ---
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
            section.className = 'accordion-item';
            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg">
                    <span class="text-2xl font-bold">${category.title}</span><i class="fas fa-chevron-down transform transition-transform"></i>
                </button>
                <div class="accordion-content mt-4 pl-4 border-l-4 border-${category.color}">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                        ${category.tools.map(tool => {
                            const isModal = !!tool.modal;
                            const tag = isModal ? 'button' : 'a';
                            const attrs = isModal 
                                ? `type="button" data-modal-target="${tool.modal}"` 
                                : `href="${tool.url}" ${tool.external ? 'target="_blank"' : ''}`;
                            return `
                                <${tag} ${attrs} class="tool-card">
                                   <i class="${tool.icon} text-${category.color.split('-')[0]}-400"></i>
                                   <h3>${tool.name}</h3>
                                   <p>${tool.description}</p>
                                </${tag}>
                            `;
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
            kids: { title: "For the Little Ones (Ages 4-8)", games: [] },
            patriots: { title: "Young Patriots (Ages 9-13)", games: [] },
            leaders: { title: "Future Leaders (Ages 14+)", games: [] },
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
                            <div class="game-card rounded-lg overflow-hidden shadow-lg relative">
                                <a href="${game.url}" class="game-card-link absolute inset-0"></a>
                                <div class="p-6">
                                    <i class="${game.icon} text-3xl mb-4"></i>
                                    <h3 class="font-bold text-xl mb-2">${game.title}</h3>
                                    <p class="text-gray-400 text-base">${game.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>`;
                container.appendChild(categoryWrapper);
            }
        }
    }

    renderTrainingCatalogue();
    renderToolsCatalogue();
    renderGames();
});
