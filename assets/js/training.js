// I have reverted to your original, functional script structure and
// have only updated the content within the trainingData array as you instructed.
// This fixes all rendering issues.

document.addEventListener('DOMContentLoaded', () => {
    const catalogueContainer = document.getElementById('course-catalogue');
    if (!catalogueContainer) return;

    // --- Course Data ---
    // All course information is now managed here for easy updates.
    const trainingData = [
        {
            category: "Foundational Courses (For Fathers & Parents)",
            color: "blue-500",
            icon: "fas fa-user-shield",
            courses: [
                { title: "The SA Constitution", icon: "fas fa-landmark", description: "Understand your foundational rights as a father and a citizen.", url: "training/course-constitution.html" },
                { title: "The Children's Act", icon: "fas fa-child", description: "A deep dive into parental rights, responsibilities, care, and contact.", url: "training/course-childrens-act.html" },
                { title: "Family Law Overview", icon: "fas fa-balance-scale", description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.", url: "training/course-family-law.html" },
                { title: "Co-Parenting 101", icon: "fas fa-comments", description: "Master communication, conflict resolution, and building effective parenting plans.", url: "training/course-coparenting.html" },
                { title: "Newborn & Daily Care", icon: "fas fa-baby-carriage", description: "From changing nappies to installing car seats, gain confidence in daily tasks.", url: "training/course-newborn-daily-care.html" },
                { title: "Building Your Own Curriculum", icon: "fas fa-pencil-ruler", description: "A guide for the homeschooling father to create a practical, values-based education.", url: "training/course-build-curriculum.html" },
                { title: "The Unbroken Chain", icon: "fas fa-link", description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty.", url: "training/course-unbroken-chain.html" },
                { title: "Finding Your Ancestors Within", icon: "fas fa-dna", description: "A guide to modern spirituality, blending science with tradition.", url: "training/course-ancestors-within.html" },
                { title: "The Power of the Extended Family", icon: "fas fa-users", description: "Champion the resilient household. Learn how your family structure is a core strength.", url: "training/course-extended-family.html" },
                { title: "A Father's Shield", icon: "fas fa-shield-alt", description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies.", url: "training/course-fathers-shield.html" },
                { title: "Risk Management for Fathers", icon: "fas fa-exclamation-triangle", description: "Apply OHS principles to family life to identify and mitigate risks.", url: "training/course-risk-management.html" }
            ]
        },
        {
            category: "Khulu Courses (For Grandparents & Elders)",
            color: "yellow-500",
            icon: "fas fa-book-reader",
            courses: [
                { title: "The Constitution: Your Ultimate Shield", icon: "fas fa-landmark", description: "A grandparent's guide to the supreme law of the land.", url: "training/courses_khulu-the_constitution_your_ultimate_shield.html" },
                { title: "Senior Crusaders", icon: "fas fa-shield-virus", description: "Advanced strategies for protecting family and legacy.", url: "training/course-khulu-senior-crusaders.html" }
            ]
        },
        {
            category: "FLAMEA Kids (Ages 4-13)",
            color: "green-500",
            icon: "fas fa-child-reaching",
            courses: [
                { title: "My Rights, My Shield", icon: "fas fa-user-shield", description: "Learn about your special rights that keep you safe.", url: "training/course_kids-rights_shield.html" },
                { title: "The Big Rule Book", icon: "fas fa-book-open", description: "Why the Constitution is the most important rule book for everyone.", url: "training/course-kids-big_rule_book.html" },
                { title: "Who's In Charge?", icon: "fas fa-gavel", description: "Understanding rules at home, at school, and in our country.", url: "training/course-kids-whos_in_charge.html" },
                { title: "The Best Nest", icon: "fas fa-home", description: "A story about why safe and happy homes are important.", url: "training/course-kids-the_best_nest.html" }
            ]
        }
    ];

    function renderTrainingCatalogue() {
        catalogueContainer.innerHTML = '';
        trainingData.forEach(category => {
            const section = document.createElement('div');
            section.className = 'accordion-item bg-gray-800/70 rounded-lg shadow-lg';
            
            const coursesHtml = category.courses.map(course => `
                <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-md p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
                    <div class="flex items-center mb-4">
                        <i class="${course.icon} text-xl text-${category.color} mr-4"></i>
                        <h4 class="text-lg font-bold text-white">${course.title}</h4>
                    </div>
                    <p class="text-gray-400 flex-grow text-sm mb-4">${course.description}</p>
                    <span class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors block text-center mt-auto text-sm hover:bg-blue-500">Start Module</span>
                </a>
            `).join('');

            section.innerHTML = `
                <button class="accordion-toggle w-full flex justify-between items-center text-left p-4 rounded-t-lg">
                    <div class="flex items-center">
                        <i class="${category.icon} text-3xl text-${category.color} mr-4 w-8 text-center"></i>
                        <span class="text-xl md:text-2xl font-bold text-white">${category.category}</span>
                    </div>
                    <i class="fas fa-chevron-down accordion-icon transform transition-transform text-gray-400"></i>
                </button>
                <div class="accordion-content">
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${coursesHtml}
                        </div>
                    </div>
                </div>`;
            catalogueContainer.appendChild(section);
        });
        
        catalogueContainer.querySelectorAll('.accordion-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const item = button.closest('.accordion-item');
                item.classList.toggle('active');
            });
        });
    }
    renderTrainingCatalogue();
});
