// assets/js/plan-builder.js
document.addEventListener('DOMContentLoaded', () => {
    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const downloadBtn = document.getElementById('download-btn');
    
    let currentStep = 0;
    const totalSteps = formSteps.length;

    // --- Live Preview Listeners ---
    const parentAInput = document.getElementById('parentA');
    const parentBInput = document.getElementById('parentB');
    const childNameInput = document.getElementById('childName');
    const rightsClauseInput = document.getElementById('rightsClause');
    
    const previewParentA = document.getElementById('preview-parentA');
    const previewParentB = document.getElementById('preview-parentB');
    const previewChildName = document.getElementById('preview-childName');
    const previewRights = document.getElementById('preview-rights');

    parentAInput.addEventListener('input', () => previewParentA.textContent = parentAInput.value || '[Parent A]');
    parentBInput.addEventListener('input', () => previewParentB.textContent = parentBInput.value || '[Parent B]');
    childNameInput.addEventListener('input', () => previewChildName.textContent = childNameInput.value || "[Child's Name]");
    rightsClauseInput.addEventListener('input', () => {
        previewRights.textContent = rightsClauseInput.value || 'Both parents have full and equal parental responsibilities and rights as outlined in the Children\'s Act 38 of 2005.';
    });


    // --- Wizard Navigation ---
    const updateWizard = () => {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        prevBtn.disabled = currentStep === 0;
        nextBtn.disabled = currentStep === totalSteps - 1;
        downloadBtn.disabled = currentStep !== totalSteps - 1; // Enable download only on the last step
    };

    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateWizard();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateWizard();
        }
    });

    // --- PDF Generation ---
    downloadBtn.addEventListener('click', () => {
        // This is a placeholder for member check.
        // In the full version, we'd check Firebase auth state here.
        const isMember = true; // Replace with actual check
        if (!isMember) {
            alert("Please register for a free account to download your completed document.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const previewContent = document.getElementById('preview-pane');
        
        doc.html(previewContent, {
            callback: function (doc) {
                doc.save('Flamea_Parenting_Plan.pdf');
            },
            x: 10,
            y: 10,
            width: 190,
            windowWidth: 800
        });
    });

    // Initial state
    updateWizard();
    // Set default rights clause preview
    previewRights.textContent = 'Both parents have full and equal parental responsibilities and rights as outlined in the Children\'s Act 38 of 2005.';
});
