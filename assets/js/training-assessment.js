document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('assessment-form');
    if (!form) return;

    // Get containers for the form and the results display
    const formContainer = document.getElementById('assessment-form-container');
    const resultsContainer = document.getElementById('results-container');
    const resultsGrid = document.getElementById('results-grid');

    // Define all available courses with their details and associated keywords
    const allCourses = {
        // Legal & Constitutional
        constitution: {
            title: "The SA Constitution",
            description: "Understand your foundational rights as a father and a citizen.",
            icon: "fas fa-landmark",
            url: "training/course-constitution.html",
            keywords: ['advocacy', 'all']
        },
        childrensAct: {
            title: "The Children's Act",
            description: "A deep dive into parental rights, responsibilities, care, and contact.",
            icon: "fas fa-child",
            url: "training/course-childrens-act.html",
            keywords: ['advocacy', 'practical', 'all']
        },
        familyLaw: {
            title: "Family Law Overview",
            description: "Navigate the Marriage, Divorce, and Maintenance Acts with confidence.",
            icon: "fas fa-balance-scale",
            url: "training/course-family-law.html",
            keywords: ['advocacy', 'practical', 'all']
        },
        // Practical Skills
        coParenting: {
            title: "Co-Parenting 101",
            description: "Master communication, conflict resolution, and building effective parenting plans.",
            icon: "fas fa-hands-helping",
            url: "training/course-coparenting.html",
            keywords: ['practical', 'all']
        },
        newbornCare: {
            title: "Newborn & Daily Care",
            description: "From changing diapers to installing car seats, gain confidence in daily tasks.",
            icon: "fas fa-baby-carriage",
            url: "training/course-newborn-daily-care.html",
            keywords: ['foundations', 'all']
        },
        buildCurriculum: {
            title: "Building Your Own Curriculum",
            description: "A guide for the homeschooling father to create a practical, values-based education.",
            icon: "fas fa-pencil-ruler",
            url: "training/course-build-curriculum.html",
            keywords: ['homeschooling', 'all']
        },
        // Cultural & Ancestral
        unbrokenChain: {
            title: "The Unbroken Chain",
            description: "Successor vs. Heir in Xhosa Tradition. Understand your profound duty.",
            icon: "fas fa-link",
            url: "training/course-unbroken-chain.html",
            keywords: ['cultural', 'all']
        },
        ancestorsWithin: {
            title: "Finding Your Ancestors Within",
            description: "A guide to modern spirituality, blending science with tradition.",
            icon: "fas fa-dna",
            url: "training/course-ancestors-within.html",
            keywords: ['cultural', 'all']
        },
        extendedFamily: {
            title: "The Power of the Extended Family",
            description: "Champion the resilient household. Learn how your family structure is a core strength.",
            icon: "fas fa-users",
            url: "training/course-extended-family.html",
            keywords: ['cultural', 'practical', 'all']
        },
        // Advanced
        fathersShield: {
            title: "A Father's Shield",
            description: "Use the 'Best Interests of the Child' principle to challenge discriminatory policies.",
            icon: "fas fa-gavel",
            url: "training/course-fathers-shield.html",
            keywords: ['advocacy', 'all']
        },
        riskManagement: {
            title: "Risk Management for Fathers",
            description: "Apply OHS principles to family life to identify and mitigate risks.",
            icon: "fas fa-shield-alt",
            url: "training/course-risk-management.html",
            keywords: ['advocacy', 'practical', 'all']
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get all selected checkboxes and extract their values (e.g., 'practical', 'advocacy')
        const selectedInterests = [...form.querySelectorAll('input[name="interest"]:checked')].map(cb => cb.value);

        // If no interest is selected, default to 'all'
        if (selectedInterests.length === 0) {
            selectedInterests.push('all');
        }
        
        // Find all courses that have at least one of the selected keywords
        const recommendations = new Set();
        selectedInterests.forEach(interest => {
            for (const key in allCourses) {
                if (allCourses[key].keywords.includes(interest)) {
                    recommendations.add(allCourses[key]);
                }
            }
        });

        displayResults(Array.from(recommendations));
    });

    /**
     * Hides the form and displays the recommended courses.
     * @param {Array} recs - An array of recommended course objects.
     */
    const displayResults = (recs) => {
        // Hide the form and show the results container
        formContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        resultsGrid.innerHTML = ''; // Clear previous results

        if (recs.length === 0) {
            resultsGrid.innerHTML = `<p class="text-center text-gray-400">No specific courses found. Why not browse the full catalogue?</p>`;
            return;
        }

        // Create and append a card for each recommended course
        recs.forEach(rec => {
            const recElement = document.createElement('div');
            // Using a standard card style for consistency
            recElement.className = `bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:-translate-y-1`;
            
            recElement.innerHTML = `
                <a href="${rec.url}" class="block">
                    <div class="flex items-start">
                        <i class="fas ${rec.icon} text-teal-400 text-3xl mr-5 mt-1 w-8 text-center"></i>
                        <div>
                            <h3 class="text-xl font-bold text-white">${rec.title}</h3>
                            <p class="text-gray-300 mt-1">${rec.description}</p>
                        </div>
                    </div>
                </a>
            `;
            resultsGrid.appendChild(recElement);
        });
    };
});
