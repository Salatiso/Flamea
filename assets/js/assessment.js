// assets/js/assessment.js

document.addEventListener('DOMContentLoaded', () => {
    const wizard = document.getElementById('assessment-wizard');
    const progressBar = document.getElementById('progress-bar');
    const wizardOptions = document.querySelectorAll('.wizard-option');
    const getCertificateBtn = document.getElementById('get-certificate-btn');
    const certificateModal = document.getElementById('certificate-modal');

    const userAnswers = {};
    const totalSteps = 3; // Total number of question steps

    wizardOptions.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepEl = button.closest('.wizard-step');
            const currentStep = currentStepEl.id.split('-')[1];
            const nextStep = button.dataset.next;
            const answer = button.dataset.answer;

            // Store the answer
            userAnswers[currentStep] = answer;

            // Move to the next step or show results
            if (nextStep === 'results') {
                showResults();
            } else {
                goToStep(nextStep);
            }
        });
    });
    
    getCertificateBtn.addEventListener('click', showCertificateNameForm);

    function goToStep(stepNumber) {
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Update progress bar
        const progress = (parseInt(stepNumber) / (totalSteps + 1)) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showResults() {
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        document.getElementById('step-results').classList.add('active');
        progressBar.style.width = '100%';

        generateRecommendations();
    }

    function generateRecommendations() {
        const recommendationEl = document.getElementById('recommendation-text');
        let html = '<p>Based on your answers, we recommend the following:</p><ul class="list-disc list-inside mt-4 space-y-2">';

        if (userAnswers['1'] === 'conflict' || userAnswers['1'] === 'tense') {
            html += `<li><strong>Focus on De-escalation:</strong> Since communication is tense, we strongly recommend our "Co-Parenting 101" course to learn conflict resolution techniques.</li>`;
        }
        
        if (userAnswers['3'] === 'no' || userAnswers['3'] === 'informal') {
             html += `<li class="font-bold text-green-600 dark:text-green-400"><strong>Priority Action - Formalise Your Agreement:</strong> Your most important next step is creating a formal, written agreement. This protects both you and your child.</li>`;
        }
        
        // The main call to action
        html += `<li><a href="plan-builder.html" class="text-blue-500 hover:underline font-bold">Start with the Parenting Plan Builder</a> &mdash; This tool will guide you through every critical area, including finances, schedules, and decision-making, based on your specific needs.</li>`;
        
        html += '</ul>';
        recommendationEl.innerHTML = html;
    }

    function showCertificateNameForm() {
        const certificateContent = document.getElementById('certificate-content');
        certificateContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">One Last Step, Dad!</h2>
            <p class="mb-6">Enter your name as you'd like it to appear on your certificate.</p>
            <form id="certificate-form">
                <div class="mb-4">
                    <label for="fullName" class="block text-left font-semibold mb-1">Full Name</label>
                    <input type="text" id="fullName" class="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required>
                </div>
                <div class="mb-6">
                    <label for="nickname" class="block text-left font-semibold mb-1">Nickname (Optional, e.g., "The Rock", "Papa Bear")</label>
                    <input type="text" id="nickname" class="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                </div>
                <button type="submit" class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">Generate My Certificate</button>
            </form>
        `;
        certificateModal.classList.remove('hidden');

        document.getElementById('certificate-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const nickname = document.getElementById('nickname').value;
            generateCertificate(fullName, nickname);
        });
    }

    function generateCertificate(name, nickname) {
        const certificateContent = document.getElementById('certificate-content');
        const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let nicknameHTML = '';
        if (nickname) {
            nicknameHTML = `<p class="text-xl text-gray-600 dark:text-gray-300">also known as</p>
            <p class="text-4xl font-bold font-roboto-slab text-yellow-500 tracking-wider">"${nickname}"</p>`;
        }

        certificateContent.innerHTML = `
            <div class="border-4 border-yellow-400 p-6 rounded-lg relative">
                <div class="text-center">
                    <h2 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Certificate of Achievement</h2>
                    <h1 class="text-3xl font-bold my-4 text-green-600 dark:text-green-400">SuperDad Foundation Award</h1>
                    <p class="text-lg">This certificate is proudly awarded to</p>
                    <p class="text-4xl font-bold my-4 font-roboto-slab">${name}</p>
                    ${nicknameHTML}
                    <p class="text-lg mt-4">for taking the first crucial step towards co-parenting excellence by completing the Flamea Fatherhood Assessment.</p>
                    <p class="mt-8 text-sm">Awarded on this day, ${today}</p>
                </div>
                 <div class="absolute top-4 right-4 font-bold text-lg text-gray-800 dark:text-white">Flame<span class="text-green-500">a</span></div>
            </div>
            <p class="mt-6 text-sm text-gray-600 dark:text-gray-400">Share your achievement! Then, <a href="login.html" class="font-bold text-blue-500 hover:underline">register for free</a> to save your progress and build your parenting plan.</p>
             <button id="close-modal" class="mt-4 text-xs text-gray-500 hover:underline">Close</button>
        `;
        
        document.getElementById('close-modal').addEventListener('click', () => {
             certificateModal.classList.add('hidden');
        });
    }
});
