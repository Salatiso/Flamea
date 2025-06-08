// This code goes into the file at: flamea-website/assets/js/plan-builder.js
document.addEventListener('DOMContentLoaded', () => {
    // --- FORM & NAVIGATION ELEMENTS ---
    const planForm = document.getElementById('plan-form');
    if (!planForm) return; // Exit if not on the plan-builder page

    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const downloadBtn = document.getElementById('download-btn');
    const saveBtn = document.getElementById('save-btn'); // For saving to Firebase

    let currentStep = 0;
    const totalSteps = formSteps.length;

    // --- LIVE PREVIEW & DATA ELEMENTS ---
    const planData = {}; // Object to hold all form data

    const livePreviewElements = {
        parentA: document.getElementById('preview-parentA'),
        parentB: document.getElementById('preview-parentB'),
        childName: document.getElementById('preview-childName'),
        rights: document.getElementById('preview-rights'),
        residence: document.getElementById('preview-residence'),
        distance: document.getElementById('preview-distance')
    };
    
    // --- GOOGLE MAPS API INTEGRATION ---
    let map, directionsService, directionsRenderer;
    let autocompleteParentA, autocompleteParentB;

    window.initMap = () => {
        const addressParentAInput = document.getElementById('parentA_address');
        const addressParentBInput = document.getElementById('parentB_address');
        
        if(!addressParentAInput || !addressParentBInput) return;

        // Initialize Autocomplete for address fields
        const autocompleteOptions = {
            componentRestrictions: { country: "za" }, // Restrict to South Africa
            fields: ["formatted_address", "geometry.location"],
        };

        autocompleteParentA = new google.maps.places.Autocomplete(addressParentAInput, autocompleteOptions);
        autocompleteParentB = new google.maps.places.Autocomplete(addressParentBInput, autocompleteOptions);

        autocompleteParentA.addListener('place_changed', () => handlePlaceSelect('parentA', autocompleteParentA));
        autocompleteParentB.addListener('place_changed', () => handlePlaceSelect('parentB', autocompleteParentB));
    };

    const handlePlaceSelect = (parentKey, autocomplete) => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
            planData[`${parentKey}_address`] = place.formatted_address;
            planData[`${parentKey}_coords`] = place.geometry.location.toJSON();
            updateLivePreview();
            calculateDistance();
        }
    };
    
    const calculateDistance = () => {
        if (planData.parentA_coords && planData.parentB_coords) {
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [planData.parentA_coords],
                destinations: [planData.parentB_coords],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
            }, (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                    const distance = response.rows[0].elements[0].distance.text;
                    const duration = response.rows[0].elements[0].duration.text;
                    planData.distanceInfo = { distance, duration };
                    updateLivePreview();
                } else {
                    console.error('Error calculating distance:', status);
                    planData.distanceInfo = null;
                    updateLivePreview();
                }
            });
        }
    };

    // --- WIZARD LOGIC ---
    const updateLivePreview = () => {
        // Update text content from planData object
        livePreviewElements.parentA.textContent = planData.parentA || '[Parent A]';
        livePreviewElements.parentB.textContent = planData.parentB || '[Parent B]';
        livePreviewElements.childName.textContent = planData.childName || "[Child's Name]";
        livePreviewElements.rights.textContent = planData.rightsClause || 'Both parents have full and equal parental responsibilities and rights as outlined in the Children\'s Act 38 of 2005.';
        livePreviewElements.residence.textContent = planData.primaryResidence || '[Primary Residence not specified]';

        if(planData.distanceInfo) {
             livePreviewElements.distance.parentElement.classList.remove('hidden');
             livePreviewElements.distance.textContent = `${planData.distanceInfo.distance} (approx. ${planData.distanceInfo.duration} drive)`;
        } else {
             livePreviewElements.distance.parentElement.classList.add('hidden');
        }
    };

    const gatherStepData = (stepIndex) => {
        const stepElement = formSteps[stepIndex];
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            planData[input.id] = input.value;
        });
    };

    const updateWizardUI = () => {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        prevBtn.disabled = currentStep === 0;
        
        if(currentStep === totalSteps - 1) {
            nextBtn.classList.add('hidden');
            document.getElementById('final-actions').classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            document.getElementById('final-actions').classList.add('hidden');
        }
        
        // Disable save/download if not logged in
        if(window.flamea && window.flamea.auth) {
            const user = window.flamea.auth.currentUser;
            downloadBtn.disabled = !user;
            saveBtn.disabled = !user;
             if(!user) {
                downloadBtn.title = "Register for free to download";
                saveBtn.title = "Register for free to save";
            } else {
                 downloadBtn.title = "";
                saveBtn.title = "";
            }
        }
    };

    nextBtn.addEventListener('click', () => {
        gatherStepData(currentStep);
        updateLivePreview();
        if (currentStep < totalSteps - 1) {
            currentStep++;
            updateWizardUI();
        }
    });

    prevBtn.addEventListener('click', () => {
        gatherStepData(currentStep);
        updateLivePreview();
        if (currentStep > 0) {
            currentStep--;
            updateWizardUI();
        }
    });

    // --- FINAL ACTIONS ---
    downloadBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ format: 'a4' });
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

    saveBtn.addEventListener('click', async () => {
        if(window.flamea && window.flamea.saveDocument) {
           gatherStepData(currentStep); // gather final step data
           updateLivePreview();
           
           const docId = await window.flamea.saveDocument('parentingPlans', planData);
           if(docId) {
               alert(`Your parenting plan has been securely saved to your Dashboard!`);
                window.location.href = 'dashboard.html';
           }
        } else {
            alert("Could not save document. Auth module not found.");
        }
    });

    // --- INITIALIZATION ---
    planForm.addEventListener('input', (e) => {
        gatherStepData(currentStep);
        updateLivePreview();
    });
    
    updateWizardUI();
    updateLivePreview(); // Set initial default text
});
