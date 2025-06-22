// /assets/js/training.js
// This script dynamically builds the course catalogue on the training.html page.
// It automatically categorizes courses based on keywords in their filenames.

document.addEventListener('DOMContentLoaded', () => {
    const catalogueContainer = document.getElementById('course-catalogue');
    if (!catalogueContainer) return;

    // --- Course Data ---
    // This list now contains ALL your course files.
    // The script will automatically sort them into the correct age-appropriate categories.
    const allCourses = [
        { url: "training/course-constitution.html", title: "The SA Constitution", description: "Understand your foundational rights as a father and a citizen." },
        { url: "training/course-childrens-act.html", title: "The Children's Act", description: "A deep dive into parental rights, responsibilities, care, and contact." },
        { url: "training/course-family-law.html", title: "Family Law Overview", description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence." },
        { url: "training/course-coparenting.html", title: "Co-Parenting 101", description: "Master communication, conflict resolution, and building effective parenting plans." },
        { url: "training/course-newborn-daily-care.html", title: "Newborn & Daily Care", description: "From changing nappies to installing car seats, gain confidence in daily tasks." },
        { url: "training/course-build-curriculum.html", title: "Building Your Own Curriculum", description: "A guide for the homeschooling father to create a practical, values-based education." },
        { url: "training/course-unbroken-chain.html", title: "The Unbroken Chain", description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty." },
        { url: "training/course-ancestors-within.html", title: "Finding Your Ancestors Within", description: "A guide to modern spirituality, blending science with tradition." },
        { url: "training/course-extended-family.html", title: "The Power of the Extended Family", description: "Champion the resilient household. Learn how your family structure is a core strength." },
        { url: "training/course-fathers-shield.html", title: "A Father's Shield", description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies." },
        { url: "training/course-risk-management.html", title: "Risk Management for Fathers", description: "Apply OHS principles to family life to identify and mitigate risks." },
        // Khulu Courses
        { url: "training/courses_khulu-the_constitution_your_ultimate_shield.html", title: "The Constitution: Your Ultimate Shield", description: "A grandparent's guide to the supreme law of the land." },
        { url: "training/course-khulu-senior-crusaders.html", title: "Senior Crusaders", description: "Advanced strategies for protecting family and legacy." },
        // Kids Courses
        { url: "training/course_kids-rights_shield.html", title: "My Rights, My Shield", description: "Learn about your special rights that keep you safe." },
        { url: "training/course-kids-big_rule_book.html", title: "The Big Rule Book", description: "Why the Constitution is the most important rule book for everyone." },
        { url: "training/course-kids-whos_in_charge.html", title: "Who's In Charge?", description: "Understanding rules at home, at school, and in our country." },
        { url: "training/course-kids-the_best_nest.html", title: "The Best Nest", description: "A story about why safe and happy homes are important." }
    ];

    function getCategory(course) {
        const url = course.url.toLowerCase();
        if (url.includes('khulu')) {
            return 'khulu';
        }
        if (url.includes('kids')) {
            return 'kids';
        }
        return 'foundational';
    }

    const trainingData = [
        {
            id: 'foundational',
            category: "Foundational Courses (For Fathers & Parents)",
            color: "blue-500",
            icon: "fas fa-user-shield",
            courses: []
        },
        {
            id: 'khulu',
            category: "Khulu Courses (For Grandparents & Elders)",
            color: "yellow-500",
            icon: "fas fa-book-reader",
            courses: []
        },
        {
            id: 'kids',
            category: "FLAMEA Kids (Ages 4-13)",
            color: "green-500",
            icon: "fas fa-child-reaching",
            courses: []
        }
    ];

    // Automatically sort all courses into the correct category
    allCourses.forEach(course => {
        const categoryId = getCategory(course);
        const category = trainingData.find(c => c.id === categoryId);
        if (category) {
            category.courses.push(course);
        }
    });

    function renderTrainingCatalogue() {
        catalogueContainer.innerHTML = '';
        trainingData.forEach(category => {
            if (category.courses.length === 0) return; // Don't render empty categories

            const section = document.createElement('div');
            section.className = 'accordion-item bg-gray-800/70 rounded-lg shadow-lg';
            
            const coursesHtml = category.courses.map(course => {
                // Determine icon based on keywords
                let iconClass = 'fa-graduation-cap'; // default icon
                if (course.title.toLowerCase().includes('constitution')) iconClass = 'fa-landmark';
                if (course.title.toLowerCase().includes('children')) iconClass = 'fa-child';
                if (course.title.toLowerCase().includes('law')) iconClass = 'fa-balance-scale';
                if (course.title.toLowerCase().includes('parenting')) iconClass = 'fa-comments';
                if (course.title.toLowerCase().includes('newborn')) iconClass = 'fa-baby-carriage';
                if (course.title.toLowerCase().includes('shield')) iconClass = 'fa-user-shield';
                 if (course.title.toLowerCase().includes('nest')) iconClass = 'fa-home';


                return `
                <a href="${course.url}" class="course-card block bg-gray-900 rounded-lg overflow-hidden shadow-md p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full">
                    <div class="flex items-center mb-4">
                        <i class="fas ${iconClass} text-xl text-${category.color} mr-4"></i>
                        <h4 class="text-lg font-bold text-white">${course.title}</h4>
                    </div>
                    <p class="text-gray-400 flex-grow text-sm mb-4">${course.description}</p>
                    <span class="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors block text-center mt-auto text-sm hover:bg-blue-500">Start Module</span>
                </a>
            `}).join('');

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
                // Automatically open the first category
                if (catalogueContainer.children[0] && !catalogueContainer.children[0].classList.contains('active')) {
                     catalogueContainer.children[0].classList.add('active');
                }
                item.classList.toggle('active');
            });
        });

        // Automatically open the first category on page load
        if (catalogueContainer.children[0]) {
            catalogueContainer.children[0].classList.add('active');
        }
    }
    
    renderTrainingCatalogue();
});
