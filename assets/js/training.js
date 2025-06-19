document.addEventListener('DOMContentLoaded', () => {
    const catalogueContainer = document.getElementById('course-catalogue');

    // Exit if the container element doesn't exist on the page
    if (!catalogueContainer) {
        return;
    }

    // --- Course Data ---
    // All course information is now managed here for easy updates.
    const trainingData = [
        {
            category: "Legal & Constitutional Foundations",
            color: "green-500",
            icon: "fas fa-landmark",
            courses: [
                { title: "The SA Constitution", icon: "fas fa-landmark", description: "Understand your foundational rights as a father and a citizen.", url: "training/course-constitution.html" },
                { title: "The Children's Act", icon: "fas fa-child", description: "A deep dive into parental rights, responsibilities, care, and contact.", url: "training/course-childrens-act.html" },
                { title: "Family Law Overview", icon: "fas fa-balance-scale", description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.", url: "training/course-family-law.html" }
            ]
        },
        {
            category: "Practical Parenting Skills",
            color: "blue-500",
            icon: "fas fa-hands-helping",
            courses: [
                { title: "Co-Parenting 101", icon: "fas fa-comments", description: "Master communication, conflict resolution, and building effective parenting plans.", url: "training/course-coparenting.html" },
                { title: "Newborn & Daily Care", icon: "fas fa-baby-carriage", description: "From changing nappies to installing car seats, gain confidence in daily tasks.", url: "training/course-newborn-daily-care.html" },
                { title: "Building Your Own Curriculum", icon: "fas fa-pencil-ruler", description: "A guide for the homeschooling father to create a practical, values-based education.", url: "training/course-build-curriculum.html" }
            ]
        },
        {
            category: "Cultural & Ancestral Wisdom",
            color: "yellow-500",
            icon: "fas fa-feather-alt",
            courses: [
                { title: "The Unbroken Chain", icon: "fas fa-link", description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty.", url: "training/course-unbroken-chain.html" },
                { title: "Finding Your Ancestors Within", icon: "fas fa-dna", description: "A guide to modern spirituality, blending science with tradition.", url: "training/course-ancestors-within.html" },
                { title: "The Power of the Extended Family", icon: "fas fa-users", description: "Champion the resilient household. Learn how your family structure is a core strength.", url: "training/course-extended-family.html" }
            ]
        },
        {
            category: "Advanced Advocacy & Self-Sufficiency",
            color: "red-500",
            icon: "fas fa-gavel",
            courses: [
                { title: "A Father's Shield", icon: "fas fa-shield-alt", description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies.", url: "training/course-fathers-shield.html" },
                { title: "Risk Management for Fathers", icon: "fas fa-exclamation-triangle", description: "Apply OHS principles to family life to identify and mitigate risks.", url: "training/course-risk-management.html" }
            ]
        }
    ];

    /**
     * Renders the entire training catalogue from the data object.
     */
    function renderTrainingCatalogue() {
        catalogueContainer.innerHTML = ''; // Clear any existing content
        trainingData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item bg-gray-800/70 rounded-lg shadow-lg';
            
            const coursesHtml = category.courses.map(course => `
                <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-lg p-6 border border-gray-700 hover:border-${category.color.split('-')[0]}-500 transition-all duration-300 flex flex-col">
                    <div class="flex items-center mb-4">
                        <i class="${course.icon} text-3xl text-${category.color} mr-4"></i>
                        <h4 class="text-xl font-bold">${course.title}</h4>
                    </div>
                    <p class="text-gray-400 flex-grow mb-4">${course.description}</p>
                    <span class="bg-${category.color} text-white font-bold py-2 px-4 rounded-lg transition-colors block text-center mt-auto">Start Module</span>
                </a>
            `).join('');

            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 rounded-t-lg">
                    <div class="flex items-center">
                        <i class="${category.icon} text-3xl text-${category.color} mr-4 w-8 text-center"></i>
                        <div>
                            <span class="text-xl md:text-2xl font-bold">${category.category}</span>
                        </div>
                    </div>
                    <i class="fas fa-chevron-down accordion-icon transform transition-transform"></i>
                </button>
                <div class="accordion-content">
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            ${coursesHtml}
                        </div>
                    </div>
                </div>`;
            catalogueContainer.appendChild(section);
        });
        
        // Add event listeners to all new accordion toggles
        catalogueContainer.querySelectorAll('.accordion-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.accordion-item');
                item.classList.toggle('active');
            });
        });
    }

    // Initial render of the catalogue
    renderTrainingCatalogue();
});
