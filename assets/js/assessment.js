// assets/js/assessment.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('assessment-form');
    const resultsContainer = document.getElementById('results-container');
    const recommendationsList = document.getElementById('recommendations-list');
    const formContainer = document.getElementById('assessment-form-container');

    const allRecommendations = {
        planning: {
            title: "Plan for Great Fatherhood",
            text: "It's fantastic that you are planning ahead! This is the most powerful step you can take. Arm yourself with knowledge to build a strong foundation for your family.",
            icon: "fa-baby-carriage",
            color: "text-green-400",
            links: [
                { name: "Start 'Fatherhood & Financial Fitness' Training", url: "training.html" },
                { name: "Build a 'Prospective' Parenting Plan", url: "parenting-plan.html?mode=wizard" },
                { name: "Read 'The Homeschooling Father'", url: "book-reader.html?book=BK-HomeSchooling_Father" }
            ]
        },
        create_plan: {
            title: "Create Your Co-Parenting Compass",
            text: "You're taking a vital step towards clarity and stability for your child. A written parenting plan is the best tool to prevent future misunderstandings.",
            icon: "fa-file-signature",
            color: "text-blue-400",
            links: [
                { name: "Use the Parenting Plan Builder", url: "parenting-plan.html" },
                { name: "Take the 'Constructive Co-Parenting' Training", url: "training.html" },
                { name: "Read 'Goliath's Stand' for legal insights", url: "book-reader.html?book=BK-Goliaths_Stand" }
            ]
        },
        communication: {
            title: "Improve Communication & Reduce Conflict",
            text: "Difficult communication is stressful for everyone, especially children. Congratulations on seeking tools to manage this. Documenting everything is your first and most powerful step.",
            icon: "fa-comments",
            color: "text-yellow-400",
            links: [
                { name: "Use the Family Activity Tracker", url: "dispute-tracker.html" },
                { name: "Consult the AI Legal Assistant for communication tips", url: "#" , modal: "chatbot-modal"},
                { name: "Join the Community Forum for support", url: "community.html" }
            ]
        },
        dispute_resolution: {
            title: "Navigate Your Dispute with Strength",
            text: "Facing a dispute is tough, but you are not alone. FLAMEA is here to support you with resources to navigate this challenging time. Stay strong and focused on the best interests of your child.",
            icon: "fa-balance-scale-left",
            color: "text-red-400",
            links: [
                { name: "Find the Family Advocate in your area", url: "locator.html" },
                { name: "Use the Family Activity Tracker daily", url: "dispute-tracker.html" },
                { name: "Find the right Legal Forms", url: "forms.html" }
            ]
        }
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const answers = {
            q1: document.getElementById('q1').value,
            q2: document.getElementById('q2').value,
            q3: document.getElementById('q3').value,
            q4: document.getElementById('q4').value,
            q5: document.getElementById('q5').value
        };

        let recommendations = new Set(); // Use a Set to avoid duplicate recommendations

        // Logic to add recommendations based on answers
        if (answers.q1 === 'planning' || answers.q2 === 'not_conceived') {
            recommendations.add(allRecommendations.planning);
        }
        
        if (answers.q3 === 'no' || answers.q3 === 'outdated') {
            recommendations.add(allRecommendations.create_plan);
        }

        if (answers.q4 === 'difficult' || answers.q4 === 'none') {
            recommendations.add(allRecommendations.communication);
        }

        if (answers.q1 === 'dispute' || answers.q5 === 'considering' || answers.q5 === 'yes_mediation' || answers.q5 === 'yes_court') {
            recommendations.add(allRecommendations.dispute_resolution);
        }
        
        // Default recommendation if no others match
        if(recommendations.size === 0) {
            recommendations.add(allRecommendations.create_plan);
        }

        displayResults(Array.from(recommendations));
    });

    const displayResults = (recs) => {
        formContainer.classList.add('hidden');
        resultsContainer.classList.remove('hidden');
        recommendationsList.innerHTML = '';

        recs.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'bg-gray-900 bg-opacity-75 p-6 rounded-lg border-l-4';
            recElement.style.borderColor = `var(--${rec.color.replace('text-', 'color-')})`; // Needs CSS variables set up for colors or use Tailwind classes
            
            let linksHtml = rec.links.map(link => 
                `<li><a href="${link.url}" ${link.modal ? `data-modal-target="${link.modal}"` : ''} class="text-blue-300 hover:underline">${link.name}</a></li>`
            ).join('');

            recElement.innerHTML = `
                <div class="flex items-start">
                    <i class="fas ${rec.icon} ${rec.color} text-3xl mr-4 mt-1"></i>
                    <div>
                        <h3 class="text-xl font-bold">${rec.title}</h3>
                        <p class="text-gray-400 mt-1 mb-3">${rec.text}</p>
                        <ul class="list-disc list-inside space-y-1">
                            ${linksHtml}
                        </ul>
                    </div>
                </div>
            `;
            recommendationsList.appendChild(recElement);
        });
        
        // Re-initialize modal triggers for the new links
        const modalTriggers = recommendationsList.querySelectorAll('[data-modal-target]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalTarget;
                const modal = document.getElementById(modalId);
                if(modal) {
                    modal.classList.add('flex');
                }
            });
        });
    };
});
