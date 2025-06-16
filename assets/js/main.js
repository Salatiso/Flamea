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
                 { title: "Co-Parenting 101", icon: "fas fa-hands-helping", description: "Master communication, conflict resolution, and building effective parenting plans. Learn to work with your co-parent for the child's benefit.", url: "training/course-coparenting.html" },
                 { title: "Newborn & Daily Care", icon: "fas fa-baby-carriage", description: "From changing diapers to installing car seats, gain confidence in daily tasks. Lean on your family for support.", url: "training/course-newborn-daily-care.html" },
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
        }
    ];

    const gameData = [
        { title: "Kid Konstitution", description: "A fun quiz to learn the basics of our country's rules!", url: "games/kid-konstitution.html", icon: "fas fa-child text-pink-400", category: "kids" },
        { title: "Rights Racer", description: "Race against time to collect important rights!", url: "games/rights-racer.html", icon: "fas fa-running text-pink-400", category: "kids" },
        // ... all other games
    ];


    // --- Event Delegation ---
    document.body.addEventListener('click', (event) => {
        const target = event.target;

        const modalButton = target.closest('[data-modal-target]');
        if (modalButton) {
            event.preventDefault();
            const modalId = modalButton.dataset.modalTarget;
            openModal(modalId);
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
            const icon = accordionButton.querySelector('i.fa-chevron-down');
            
            if (content && content.classList.contains('accordion-content')) {
                const isOpen = content.classList.toggle('open');
                content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : null;
                if (icon) icon.classList.toggle('rotate-180', isOpen);
            }
        }
    });

    // --- Modal Functions ---
    async function openModal(modalId) { /* ... same as before ... */ }
    function closeModal(modal) { /* ... same as before ... */ }

    // --- RENDER FUNCTIONS ---
    
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
                </div>
            `;
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
                        ${category.tools.map(tool => `
                            <a href="${tool.url}" 
                               class="tool-card" 
                               ${tool.modal ? `data-modal-target="${tool.modal}"` : ''} 
                               ${tool.external ? 'target="_blank"' : ''}>
                               <i class="${tool.icon} text-${category.color}"></i>
                               <h3>${tool.name}</h3>
                               <p>${tool.description}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            container.appendChild(section);
        });
    }

    function renderGames() { /* ... same as before ... */ }

    // --- Initial Calls ---
    renderTrainingCatalogue();
    renderToolsCatalogue();
    renderGames();
});

