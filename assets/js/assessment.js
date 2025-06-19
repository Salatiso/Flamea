// FIX: Wrapped entire script in DOMContentLoaded to ensure all elements are loaded before use.
document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
    const wizard = document.getElementById('assessment-wizard');
    const progressBar = document.getElementById('progress-bar');
    const getCertificateBtn = document.getElementById('get-certificate-btn');
    const certificateModal = document.getElementById('certificate-modal');
    const quitModal = document.getElementById('quit-modal');
    const backBtn = document.getElementById('back-btn');
    const quitBtn = document.getElementById('quit-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const currentStepSpan = document.getElementById('current-step-number');
    const progressText = document.getElementById('progress-text');

    // Ensure elements exist before proceeding
    if (!wizard || !quitBtn) {
        // Not on the assessment page, so do nothing.
        return;
    }

    // --- State Variables ---
    const userAnswers = {};
    let stepHistory = ['1']; // Start with the first step
    const totalSteps = 3; // Total number of question steps before results

    // --- Event Listeners ---
    const wizardOptions = document.querySelectorAll('.wizard-option');
    wizardOptions.forEach(button => {
        button.addEventListener('click', () => {
            const currentStepEl = button.closest('.wizard-step');
            const currentStep = currentStepEl.id.split('-')[1];
            const nextStep = button.dataset.next;
            
            userAnswers[currentStep] = button.dataset.answer;
            
            if (nextStep === 'results') {
                showResults();
            } else {
                if (!stepHistory.includes(nextStep)) {
                    stepHistory.push(nextStep);
                }
                goToStep(nextStep);
            }
        });
    });

    backBtn.addEventListener('click', goBack);
    quitBtn.addEventListener('click', () => quitModal.classList.remove('hidden'));
    resumeBtn.addEventListener('click', () => quitModal.classList.add('hidden'));
    getCertificateBtn.addEventListener('click', showCertificateNameForm);


    // --- Functions ---
    function goBack() {
        if (stepHistory.length <= 1) return;
        stepHistory.pop();
        const previousStep = stepHistory[stepHistory.length - 1];
        goToStep(previousStep);
    }

    function updateNavAndProgress(stepNumber) {
        const stepNum = parseInt(stepNumber);
        if (stepNumber === 'results') {
            backBtn.style.visibility = 'hidden';
            quitBtn.style.visibility = 'hidden';
            currentStepSpan.parentElement.style.visibility = 'hidden';
            progressBar.style.width = '100%';
            progressText.textContent = '100%';
        } else {
            backBtn.style.visibility = stepNum > 1 ? 'visible' : 'hidden';
            quitBtn.style.visibility = 'visible';
            currentStepSpan.parentElement.style.visibility = 'visible';
            currentStepSpan.textContent = stepNum;
            const progress = ((stepNum -1) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        }
    }

    function goToStep(stepNumber) {
        document.querySelectorAll('.wizard-step').forEach(step => step.classList.remove('active'));
        const nextStepEl = document.getElementById(`step-${stepNumber}`);
        if(nextStepEl) {
          nextStepEl.classList.add('active');
        }
        updateNavAndProgress(stepNumber);
    }

    function showResults() {
        goToStep('results');
        generateRecommendations();
    }
    
    function generateRecommendations() {
        const recommendationEl = document.getElementById('recommendation-text');
        let html = '<p class="font-bold text-lg mb-4">Based on your answers, we recommend the following:</p><ul class="list-disc list-inside mt-4 space-y-3 text-left">';
        
        if (userAnswers['2'] === 'conflict' || userAnswers['2'] === 'tense') {
            html += `<li><strong class="text-yellow-400">Focus on De-escalation:</strong> Since communication is tense, we strongly recommend our "Co-Parenting 101" course to learn conflict resolution techniques. You may also find the <a href="tools.html" class="text-blue-400 hover:underline">Conflict Resolution Worksheet</a> helpful.</li>`;
        } else {
            html += `<li><strong class="text-green-400">Build on a Good Foundation:</strong> Your communication is stable. Solidify it with our <a href="tools.html" class="text-blue-400 hover:underline">Communication Plan</a> template to ensure clarity moving forward.</li>`;
        }

        if (userAnswers['3'] === 'no' || userAnswers['3'] === 'informal') {
             html += `<li class="font-bold text-green-400"><strong>Priority Action - Formalise Your Agreement:</strong> Your most important next step is creating a formal, written agreement. This protects both you and your child.</li>`;
        } else {
            html += `<li><strong class="text-green-400">Review Your Plan:</strong> It's great you have a formal plan. Use our tools to review it and ensure it still meets your child's current needs.</li>`
        }

        html += `<li><a href="plan-builder.html" class="text-blue-400 hover:underline font-bold">Use the Parenting Plan Builder</a> &mdash; This tool will guide you through every critical area, including finances, schedules, and decision-making, based on your specific needs.</li>`;
        html += '</ul>';
        recommendationEl.innerHTML = html;
    }

    function showCertificateNameForm() {
        const certificateContent = document.getElementById('certificate-content');
        certificateContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">One Last Step, Dad!</h2>
            <p class="mb-6">Enter your name as you'd like it to appear on your certificate.</p>
            <form id="certificate-form">
                <div class="mb-4"><label for="fullName" class="block text-left font-semibold mb-1">Full Name</label><input type="text" id="fullName" class="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" required></div>
                <div class="mb-6"><label for="nickname" class="block text-left font-semibold mb-1">Nickname (Optional, e.g., "The Rock", "Papa Bear")</label><input type="text" id="nickname" class="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"></div>
                <button type="submit" class="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-700 transition-colors">Generate My Certificate</button>
            </form>
        `;
        certificateModal.classList.remove('hidden');
        
        const certForm = document.getElementById('certificate-form');
        if(certForm) {
            certForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generateCertificate(document.getElementById('fullName').value, document.getElementById('nickname').value);
            });
        }
    }

    function generateCertificate(name, nickname) {
        const certificateContent = document.getElementById('certificate-content');
        const today = new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' });
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://flamea.org`;
        
        let nicknameHTML = nickname ? `<p class="text-xl text-gray-600 dark:text-gray-300">also known as</p><p class="text-4xl font-bold font-roboto-slab text-yellow-500 tracking-wider">"${nickname}"</p>` : '';

        certificateContent.innerHTML = `
            <div class="border-4 border-yellow-400 p-8 rounded-lg relative bg-gray-800">
                <div class="grid md:grid-cols-3 gap-6 items-center">
                    <div class="md:col-span-2 text-center md:text-left">
                        <h2 class="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Certificate of Achievement</h2>
                        <h1 class="text-3xl font-bold my-2 text-green-600 dark:text-green-400">SuperDad Foundation Award</h1>
                        <p class="text-lg">This certificate is proudly awarded to</p>
                        <p class="text-4xl font-bold my-2 font-roboto-slab">${name}</p>
                        ${nicknameHTML}
                        <p class="text-base mt-2">for taking the first crucial step towards co-parenting excellence.</p>
                        <p class="mt-6 text-sm">Awarded on: ${today}</p>
                    </div>
                    <div class="flex flex-col items-center">
                        <img src="${qrCodeUrl}" alt="Flamea QR Code" class="w-32 h-32 rounded-lg">
                        <p class="text-xs mt-2 text-gray-500">Scan to visit Flamea.org</p>
                    </div>
                </div>
                 <div class="absolute top-4 right-4 font-bold text-lg text-gray-800 dark:text-white">Flame<span class="text-green-500">a</span></div>
            </div>
            <p class="mt-6 text-sm text-gray-600 dark:text-gray-400">Share your achievement! Then, <a href="login.html" class="font-bold text-blue-500 hover:underline">register for free</a> to save it.</p>
             <button id="close-modal-btn" class="mt-4 text-xs text-gray-500 hover:underline">Close</button>
        `;
        
        document.getElementById('close-modal-btn').addEventListener('click', () => certificateModal.classList.add('hidden'));
    }

    // Initial setup
    goToStep('1');
});
