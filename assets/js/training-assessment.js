document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('training-assessment-form');
    if (!form) return;

    const formContainer = document.getElementById('assessment-form-container');
    const resultsContainer = document.getElementById('results-container');
    const recommendationsList = document.getElementById('recommendations-list');

    const allCourses = {
        constitution: {
            title: "SA Constitution: Your Foundational Rights",
            text: "Start here. Understand the supreme law that guarantees your equality as a parent and prioritizes your child's best interests.",
            icon: "fa-landmark",
            color: "text-green-400",
            url: "training/course-constitution.html"
        },
        childrensAct: {
            title: "The Children's Act: A Father's Guide",
            text: "This is the most critical piece of legislation for any parent. Learn about your rights and responsibilities regarding care, contact, and guardianship.",
            icon: "fa-child",
            color: "text-green-400",
            url: "training/course-childrens-act.html"
        },
        coParenting: {
            title: "Co-Parenting 101: Build a Strong Plan",
            text: "Learn to communicate effectively, manage conflict, and use the FLAMEA Parenting Plan tool to create a roadmap for success.",
            icon: "fa-hands-helping",
            color: "text-blue-400",
            url: "training/course-co-parenting.html"
        },
        dailyCare: {
            title: "Newborn & Daily Care Skills",
            text: "Build your confidence with practical, hands-on skills for daily care, from feeding routines to installing a car seat correctly.",
            icon: "fa-baby-carriage",
            color: "text-blue-400",
            url: "training/course-daily-care.html"
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const answers = {
            q1: document.getElementById('q1').value,
            q2: document.getElementById('q2').value,
            q3: document.getElementById('q3').value,
        };

        let recommendations = new Set();

        // Logic to determine recommendations
        if (answers.q1 === 'not_familiar' || answers.q1 === 'somewhat') {
            recommendations.add(allCourses.constitution);
        }
        
        if (answers.q3 === 'no' || answers.q3 === 'what_is_that') {
            recommendations.add(allCourses.coParenting);
        }

        if (answers.q2 === 'expecting' || answers.q2 === 'new_dad') {
             recommendations.add(allCourses.dailyCare);
        }
        
        if(recommendations.size === 0) {
            recommendations.add(allCourses.constitution);
            recommendations.add(allCourses.childrensAct);
        }

        displayResults(Array.from(recommendations));
    });

    const displayResults = (recs) => {
        formContainer.classList.add('hidden');
        resultsContainer.style.display = 'block';
        recommendationsList.innerHTML = '';

        recs.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = `bg-gray-900 bg-opacity-75 p-6 rounded-lg border-l-4 border-gray-700`;
            
            recElement.innerHTML = `
                <a href="${rec.url}" class="block hover:bg-gray-800 p-4 rounded-md -m-4 transition-colors">
                    <div class="flex items-start">
                        <i class="fas ${rec.icon} ${rec.color} text-4xl mr-5 mt-1"></i>
                        <div>
                            <h3 class="text-xl font-bold text-white">${rec.title}</h3>
                            <p class="text-gray-300 mt-1">${rec.text}</p>
                        </div>
                    </div>
                </a>
            `;
            recommendationsList.appendChild(recElement);
        });
    };
});
