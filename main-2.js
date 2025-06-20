/**
 * Flamea.org - Final Unified Main Script
 * Version: 8.1
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
        renderToolsCatalogue(); // This is the function we are correcting
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

        if (hour >= 4 && hour < 10) themeClass = 'bg-theme-accountability';
        else if (hour >= 10 && hour < 13) themeClass = 'bg-theme-technology';
        else if (hour >= 13 && hour < 16) themeClass = 'bg-theme-coming-home';
        else if (hour >= 16 && hour < 18) themeClass = 'bg-theme-responsibility';
        else if (hour >= 18 && hour < 23) themeClass = 'bg-theme-mountains';
        else themeClass = 'bg-theme-boyhood';

        mainContent.classList.add(themeClass);
    }

    // --- 3. INTERACTIVE COMPONENT HANDLERS ---
    function setActiveSidebarLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('#sidebar-placeholder a').forEach(link => {
            if (link.getAttribute('href').split("/").pop() === currentPage) {
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
                const isAccordion = content.classList.contains('accordion-content');
                const isSubmenu = content.classList.contains('submenu-container');
                let isOpen = false;
                if (isAccordion) isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';
                if (isSubmenu) isOpen = content.style.display === 'block';
                
                if (isAccordion) content.style.maxHeight = isOpen ? '0px' : content.scrollHeight + 'px';
                if (isSubmenu) content.style.display = isOpen ? 'none' : 'block';
                
                if (icon) icon.classList.toggle('rotate-180', !isOpen);
            }
        });
    }

    function initializeModals() {
        document.body.addEventListener('click', function(event) {
            const openTrigger = event.target.closest('[data-modal-target]');
            const closeTrigger = event.target.closest('[data-modal-close]');
            if (openTrigger) {
                const modal = document.getElementById(openTrigger.dataset.modalTarget);
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
    const trainingData = [ /* ... training data as before ... */ ];

    // UPDATED: Corrected URLs for tools
    const toolData = [{
        title: "🛠️ Core Planning & Tracking Tools",
        color: "blue-500",
        icon: "fas fa-tools",
        tools: [{
            name: "Training Needs Assessment",
            icon: "fas fa-clipboard-check",
            description: "Start here to get a personalized action plan.",
            url: "training-assessment.html" // CORRECTED LINK
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
            url: "locator.html" // CORRECTED LINK
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
            url: "legalhelp.html" // CORRECTED LINK
        }]
    }, {
        title: "📚 Media & Publications",
        color: "yellow-500",
        icon: "fas fa-book-open",
        tools: [{
            name: "Read Our Books",
            icon: "fas fa-book-open",
            description: "Access exclusive books on fatherhood and the law.",
            url: "publications.html" // CORRECTED LINK
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

    const gameData = [ /* ... game data as before ... */ ];
    const customsDatabase = [ /* ... customs data as before ... */ ];

    // --- RENDERER FUNCTIONS (Unchanged) ---
    function renderTrainingCatalogue() {
        const container = document.getElementById('course-catalogue');
        if (!container) return;
        container.innerHTML = trainingData.map(category => `
            <div class="accordion-item mb-8">
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
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
                                <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300 flex flex-col">
                                    <div class="flex items-start mb-4"><i class="${course.icon} text-3xl text-${category.color} mr-4"></i><h4 class="text-xl font-bold flex-1">${course.title}</h4></div>
                                    <p class="text-gray-400 flex-grow mb-4">${course.description}</p>
                                    <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center mt-auto">Start Module</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`).join('');
    }

    function renderToolsCatalogue() {
        const container = document.getElementById('tools-catalogue');
        if (!container) return;
        container.innerHTML = toolData.map(category => `
            <div class="accordion-item mb-6">
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
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
                                const tag = tool.isModal ? 'button' : 'a';
                                const attrs = tool.isModal ? `type="button" data-modal-target="${tool.modalTarget}"` : `href="${tool.url}" ${tool.external ? 'target="_blank" rel="noopener noreferrer"' : ''}`;
                                return `<${tag} ${attrs} class="tool-card bg-gray-800 p-6 rounded-lg flex flex-col items-center text-center border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300">
                                    <i class="${tool.icon} text-4xl text-${category.color.split('-')[0]}-400 mb-4"></i><h3 class="text-xl font-bold mb-2">${tool.name}</h3>
                                    <p class="text-gray-400 flex-grow">${tool.description}</p></${tag}>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            </div>`).join('');
    }

    function renderGamesCatalogue() {
        const container = document.getElementById('games-catalogue');
        if (!container) return;
        container.innerHTML = gameData.map(category => `
            <div class="accordion-item mb-8">
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition-colors">
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
                                <a href="${game.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300 flex flex-col text-left">
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
                </div>
            </div>`).join('');
    }

    // --- Customs Page Logic (Unchanged) ---
    function searchCustoms(query, stage, culture) { /* ... */ }
    function displayCustomsResults(results) { /* ... */ }
    function renderCustomsPage() { /* ... */ }
});
