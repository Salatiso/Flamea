// --- GLOBAL SCOPE FOR GOOGLE MAPS CALLBACK ---
function initMap() {
    console.log("Google Maps API script loaded. Initializing Plan Builder...");
    if (window.planBuilderApp && typeof window.planBuilderApp.initMap === 'function') {
        window.planBuilderApp.initMap();
    } else {
        setTimeout(initMap, 150); // Retry if the app object isn't ready
    }
}

document.addEventListener('DOMContentLoaded', () => {

    const planBuilderApp = {
        // --- STATE MANAGEMENT ---
        currentStep: 1,
        totalSteps: 5,
        planData: {
            step1: { purpose: 'existing', parentA: {role: 'Father'}, parentB: {role: 'Mother'}, children: [] },
            step2: { custody_status: 'We have a mutual agreement', custody_details: '' },
            step3: { events: [] },
            step4: { categories: {} },
            step5: { disclaimerAccepted: false }
        },
        maps: {}, // To hold multiple map instances
        markers: {}, // To hold multiple marker instances
        calendar: null,
        
        // --- INITIALIZATION ---
        init() {
            console.log("DOM ready. Initializing Co-Parenting Compass.");
            this.mapDOMElements();
            this.attachEventListeners();
            this.updateStepView();
        },

        mapDOMElements() {
            const get = (id) => document.getElementById(id);
            this.elements = {
                prevBtn: get('prev-step-btn'), nextBtn: get('next-step-btn'),
                planPurposeSelect: get('plan-purpose'),
                parentARole: get('parentA-role'), parentANameInput: get('parentA-name'), parentAIdInput: get('parentA-id'), parentANicknameInput: get('parentA-nickname'),
                parentBRole: get('parentB-role'), parentBNameInput: get('parentB-name'), parentBIdInput: get('parentB-id'), parentBNicknameInput: get('parentB-nickname'),
                childrenContainer: get('children-container'), addChildBtn: get('add-child-btn'),
                custodyStatusSelect: get('custody-status'), custodyDetailsTextarea: get('custody-details'),
                childResidenceContainer: get('child-residence-container'),
                timeDashboard: get('time-dashboard'), calendarEl: get('calendar'),
                eventTitleInput: get('event-title'), eventStartDateInput: get('event-start-date'),
                eventEndDateInput: get('event-end-date'), eventOwnerSelect: get('event-owner'),
                addEventBtn: get('add-event-btn'), exportScheduleBtn: get('export-schedule-btn'),
                contributionsContainer: get('contributions-container'),
                reviewPane: get('review-pane'), disclaimerCheckbox: get('disclaimer-checkbox'),
                pdfOutput: get('pdf-output'),
            };
        },

        attachEventListeners() {
            this.elements.prevBtn.addEventListener('click', () => this.changeStep('prev'));
            this.elements.nextBtn.addEventListener('click', () => this.changeStep('next'));
            this.elements.planPurposeSelect.addEventListener('change', () => this.toggleChildFields());
            this.elements.addChildBtn.addEventListener('click', () => this.addChild());
            this.elements.addEventBtn.addEventListener('click', () => this.addCalendarEvent());
            this.elements.exportScheduleBtn.addEventListener('click', () => this.exportSchedule());
        },

        // --- STEP NAVIGATION & VIEW MANAGEMENT ---
        changeStep(direction) {
            if (!this.validateAndSaveStep()) return;
            if (direction === 'next' && this.currentStep < this.totalSteps) this.currentStep++;
            else if (direction === 'prev' && this.currentStep > 1) this.currentStep--;
            else if (direction === 'next' && this.currentStep === this.totalSteps) {
                this.generatePdf();
                return;
            }
            this.updateStepView();
        },

        updateStepView() {
            document.querySelectorAll('.wizard-step').forEach(el => el.classList.remove('active'));
            document.getElementById(`step-${this.currentStep}`).classList.add('active');

            for (let i = 1; i <= this.totalSteps; i++) {
                const indicator = document.getElementById(`step-indicator-${i}`);
                if(indicator) {
                    indicator.className = 'step-indicator ';
                    if (i < this.currentStep) indicator.classList.add('complete');
                    else if (i === this.currentStep) indicator.classList.add('active');
                    else indicator.classList.add('pending');
                    indicator.innerHTML = (i < this.currentStep) ? '<i class="fas fa-check"></i>' : i;
                }
            }

            this.elements.prevBtn.disabled = this.currentStep === 1;
            this.elements.prevBtn.classList.toggle('opacity-50', this.currentStep === 1);
            
            this.elements.nextBtn.textContent = this.currentStep === this.totalSteps ? 'Generate PDF Document' : 'Next Step';
            this.elements.nextBtn.classList.toggle('bg-blue-600', this.currentStep === this.totalSteps);
            this.elements.nextBtn.classList.toggle('hover:bg-blue-700', this.currentStep === this.totalSteps);
            this.elements.nextBtn.classList.toggle('bg-green-600', this.currentStep !== this.totalSteps);
            this.elements.nextBtn.classList.toggle('hover:bg-green-700', this.currentStep !== this.totalSteps);
            
            if (this.currentStep === 1 && this.planData.step1.children.length === 0) this.addChild();
            if (this.currentStep === 2) this.renderChildResidences();
            if (this.currentStep === 3 && !this.calendar) this.initCalendar();
            if (this.currentStep === 4 && this.elements.contributionsContainer.innerHTML === '') this.initContributions();
            if (this.currentStep === 5) this.renderReviewPane();
        },
        
        validateAndSaveStep() {
             if (this.currentStep === 1) {
                this.planData.step1 = {
                    purpose: this.elements.planPurposeSelect.value,
                    parentA: { role: this.elements.parentARole.value, name: this.elements.parentANameInput.value, id: this.elements.parentAIdInput.value, nickname: this.elements.parentANicknameInput.value },
                    parentB: { role: this.elements.parentBRole.value, name: this.elements.parentBNameInput.value, id: this.elements.parentBIdInput.value, nickname: this.elements.parentBNicknameInput.value },
                    children: Array.from(this.elements.childrenContainer.querySelectorAll('.child-entry')).map(entry => {
                        const childId = entry.dataset.childId;
                        const existingChild = this.planData.step1.children.find(c => c.id === childId) || {};
                        return {
                            id: childId,
                            name: entry.querySelector('[name="child-name"]').value,
                            nickname: entry.querySelector('[name="child-nickname"]').value,
                            dob: entry.querySelector('[name="child-dob"]').value,
                            residence: existingChild.residence || { type: 'parentA' }
                        };
                    })
                };
                if (!this.planData.step1.parentA.name || !this.planData.step1.parentB.name) {
                    alert('Please enter names for both parents.'); return false;
                }
            } else if (this.currentStep === 2) {
                this.planData.step2.custody_status = this.elements.custodyStatusSelect.value;
                this.planData.step2.custody_details = this.elements.custodyDetailsTextarea.value;
                this.planData.step1.children.forEach(child => {
                    const residenceBlock = document.querySelector(`.child-residence-block[data-child-id="${child.id}"]`);
                    if(residenceBlock) {
                       const residenceType = residenceBlock.querySelector('.child-residence-type').value;
                       child.residence.type = residenceType;
                       if (residenceType === 'other') {
                           child.residence.guardianName = residenceBlock.querySelector('[name="guardian-name"]').value;
                           child.residence.guardianAddress = residenceBlock.querySelector('.manual-address').value;
                       }
                    }
                });
            } else if (this.currentStep === 4) {
                 this.planData.step4.categories = {}; // Reset before saving
                 this.elements.contributionsContainer.querySelectorAll('.contribution-category').forEach(catDiv => {
                    const categoryId = catDiv.dataset.categoryId;
                    const categoryName = catDiv.querySelector('h3').textContent;
                    this.planData.step4.categories[categoryId] = { name: categoryName, items: [] };
                    catDiv.querySelectorAll('.contribution-item').forEach(itemRow => {
                        this.planData.step4.categories[categoryId].items.push({
                            name: itemRow.querySelector('[name="item-name"]').value,
                            budget: parseFloat(itemRow.querySelector('[name="item-budget"]').value) || 0,
                            actual: parseFloat(itemRow.querySelector('[name="item-actual"]').value) || 0,
                            percentA: parseFloat(itemRow.querySelector('[name="item-percentA"]').value) || 50,
                            payer: itemRow.querySelector('[name="item-payer"]').value,
                            time: parseFloat(itemRow.querySelector('[name="item-time"]').value) || 0
                        });
                    });
                 });
            } else if (this.currentStep === 5) {
                this.planData.step5.disclaimerAccepted = this.elements.disclaimerCheckbox.checked;
                if (!this.planData.step5.disclaimerAccepted) {
                    alert('You must accept the disclaimer to generate the document.'); return false;
                }
            }
            console.log("Saved Data:", JSON.parse(JSON.stringify(this.planData)));
            return true;
        },
        
        addChild() { /* Identical to previous correct version */ },
        toggleChildFields() { /* Identical to previous correct version */ },
        renderChildResidences() { /* Identical to previous correct version */ },
        initMap() { this.renderChildResidences(); /* Map init is now per-guardian */ },
        initGuardianMaps() { /* Identical to previous correct version */ },
        initCalendar() { /* Identical to previous correct version */ },
        addCalendarEvent() { /* Identical to previous correct version */ },
        updateCalendarEvent(event) { /* Identical to previous correct version */ },
        getExclusiveEndDate(dateStr) { /* Identical to previous correct version */ },
        updateTimeDashboard() { /* Identical to previous correct version */ },
        exportSchedule() { /* Identical to previous correct version */ },
        initContributions() { /* Identical to previous correct version */ },
        addContributionCategory(name, items) { /* Identical to previous correct version */ },
        addContributionItem(container, name) { /* Identical to previous correct version */ },
        updateContributionDashboards() { /* Identical to previous correct version */ },

        renderReviewPane() {
            this.elements.reviewPane.innerHTML = `<h3 class="text-xl font-bold text-white mb-4">Review Your Plan</h3><div id="review-content" class="space-y-4 text-sm"></div>`;
            const reviewContent = document.getElementById('review-content');
            
            const { step1, step2, step3, step4 } = this.planData;
            const pAName = step1.parentA.nickname || step1.parentA.name || 'Parent A';
            const pBName = step1.parentB.nickname || step1.parentB.name || 'Parent B';
            
            let html = `<div class="bg-gray-800 p-4 rounded-lg">
                <h4 class="font-bold text-lg mb-2">Parties</h4>
                <p><b>${pAName}</b> (${step1.parentA.role})</p>
                <p><b>${pBName}</b> (${step1.parentB.role})</p>
                <h5 class="font-semibold mt-3">Children</h5>
                <ul class="list-disc pl-5">${step1.children.map(c => `<li>${c.nickname || c.name}</li>`).join('') || '<li>None specified.</li>'}</ul>
            </div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Custody Status</h4><p>${step2.custody_status}</p></div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Contact Schedule</h4><p>${step3.events.length} event(s) added.</p></div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Contributions</h4><p>${Object.keys(step4.categories).length} categories configured.</p></div>`;

            reviewContent.innerHTML = html;
        },

        generatePdf() {
            if(!this.validateAndSaveStep()) return;
            
            const { step1, step2, step3, step4 } = this.planData;
            const safeText = (text, fallback = 'Not Specified') => text || fallback;
            const pAName = step1.parentA.nickname || step1.parentA.name;
            const pBName = step1.parentB.nickname || step1.parentB.name;

            let content = `<h1>Parenting Plan</h1>`;
            content += `<h2>1. Parties Involved</h2>`;
            content += `<p>This Parenting Plan is made on ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })} between:</p>`;
            content += `<h3>${safeText(pAName)} (${safeText(step1.parentA.role)})</h3>`;
            content += `<p><b>ID Number:</b> ${safeText(step1.parentA.id)}</p>`;
            content += `<h3>${safeText(pBName)} (${safeText(step1.parentB.role)})</h3>`;
            content += `<p><b>ID Number:</b> ${safeText(step1.parentB.id)}</p>`;

            content += `<h2>2. Children Subject to This Plan</h2><ul>`;
            step1.children.forEach(c => {
                content += `<li><b>${safeText(c.name)}</b> (Referred to as: ${safeText(c.nickname, 'N/A')}), Date of Birth: ${safeText(c.dob)}</li>`;
            });
            content += `</ul>`;

            content += `<h2>3. Custody & Residence</h2>`;
            content += `<p><b>Custody Status:</b> ${safeText(step2.custody_status)}</p>`;
            content += `<p><b>Details:</b> ${safeText(step2.custody_details)}</p>`;
            step1.children.forEach(c => {
                 content += `<h3>Primary Residence for ${safeText(c.nickname || c.name)}</h3>`;
                 if (c.residence.type === 'other') {
                     content += `<p>With Guardian: ${safeText(c.residence.guardianName)} at ${safeText(c.residence.guardianAddress)}</p>`;
                 } else {
                     const residentParent = c.residence.type === 'parentA' ? pAName : pBName;
                     content += `<p>With ${residentParent}</p>`;
                 }
            });

            content += `<h2>4. Contact & Time Allocation Schedule</h2><ul>`;
            step3.events.forEach(e => {
                const startDate = new Date(e.start).toLocaleDateString('en-ZA');
                const endDate = e.end ? new Date(e.end).toLocaleDateString('en-ZA') : startDate;
                content += `<li><b>${safeText(e.title)}:</b> from ${startDate} to ${endDate}</li>`;
            });
            content += `</ul>`;
            
            content += `<h2>5. Contributions & Responsibilities</h2>`;
            for(const cat of Object.values(step4.categories)) {
                content += `<h3>${cat.name}</h3><ul>`;
                cat.items.forEach(item => {
                    content += `<li><b>${item.name}:</b> Budgeted at R${item.budget.toFixed(2)}, split ${item.percentA}% / ${100 - item.percentA}%.</li>`;
                });
                content += `</ul>`;
            }

            content += `<h2 style="margin-top: 4cm;">Signatures</h2>`;
            content += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4cm; margin-top: 2cm;">
                <div><div style="border-bottom: 1px solid black; padding-bottom: 5px;"></div><p style="margin-top: 5px;"><b>${safeText(step1.parentA.name)} (${pAName})</b></p></div>
                <div><div style="border-bottom: 1px solid black; padding-bottom: 5px;"></div><p style="margin-top: 5px;"><b>${safeText(step1.parentB.name)} (${pBName})</b></p></div>
            </div>`;
            
            const fullHtml = this.getCoverPage(step1) + `<div class="pdf-page screen-only" style="display:block;"><div class="pdf-content">${content}</div></div>` + this.getBackCoverPage();
            this.elements.pdfOutput.innerHTML = fullHtml;

            const element = this.elements.pdfOutput;
            const opt = {
                margin: 0,
                filename: `Parenting_Plan_${step1.parentA.name}_${step1.parentB.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        },

        getCoverPage(step1Data) { return `...`; /* Identical to previous response */ },
        getBackCoverPage() { return `...`; /* Identical to previous response */ }
    };
    
    window.planBuilderApp = planBuilderApp;
    planBuilderApp.init();
});
