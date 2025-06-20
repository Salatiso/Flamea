// --- GLOBAL SCOPE FOR GOOGLE MAPS CALLBACK ---
// This ensures the Google Maps script can find and execute this function once loaded.
function initMap() {
    console.log("Google Maps API script loaded. Initializing Plan Builder...");
    if (window.planBuilderApp) {
        window.planBuilderApp.initMap();
    } else {
        // If the main app object isn't ready, wait and retry.
        setTimeout(initMap, 100);
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
        map: null,
        markers: {}, // Use childId for guardian markers
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
            const currentStepEl = document.getElementById(`step-${this.currentStep}`);
            if (currentStepEl) currentStepEl.classList.add('active');

            for (let i = 1; i <= this.totalSteps; i++) {
                const indicator = document.getElementById(`step-indicator-${i}`);
                if(indicator) {
                    indicator.className = 'step-indicator '; // Reset classes
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
            
            // Step-specific initializations
            if(this.currentStep === 1 && this.planData.step1.children.length === 0) this.addChild();
            if(this.currentStep === 2) this.renderChildResidences();
            if(this.currentStep === 3 && !this.calendar) this.initCalendar();
            if(this.currentStep === 4 && !Object.keys(this.planData.step4.categories).length) this.initContributions();
            if(this.currentStep === 5) this.renderReviewPane();
        },
        
        validateAndSaveStep() { /* Implementation from previous response */ return true;},
        
        // --- STEP 1: PARTIES ---
        addChild() { /* Implementation from previous response */ },
        toggleChildFields() { /* Implementation from previous response */ },

        // --- STEP 2: RESIDENCE & CUSTODY ---
        renderChildResidences() { /* Implementation from previous response */ },
        initMap() { /* Implementation from previous response */ },
        initGuardianMaps() { /* Implementation from previous response */ },
        
        // --- STEP 3: TIME & SCHEDULE ---
        initCalendar() { /* Implementation from previous response */ },
        addCalendarEvent() { /* Implementation from previous response */ },
        updateCalendarEvent(event) { /* Implementation from previous response */ },
        getExclusiveEndDate(inclusiveEndDateStr) { /* Implementation from previous response */ },
        updateTimeDashboard() { /* Implementation from previous response */ },
        exportSchedule() { /* Implementation from previous response */ },
        
        // --- STEP 4: CONTRIBUTIONS ---
        initContributions() {
            const categories = {
                "Financial": ["School Fees", "Medical Aid / Expenses", "Groceries", "Clothing", "Extra-Mural Activities"],
                "Logistical & Time": ["School Transport", "Doctor's Appointments", "Homework Supervision", "Weekend Activities", "Holiday Care"],
            };
            this.elements.contributionsContainer.innerHTML = '';
            for (const [category, items] of Object.entries(categories)) {
                this.addContributionCategory(category, items);
            }
        },

        addContributionCategory(name, items = []) {
            const categoryId = name.replace(/[^a-zA-Z0-9]/g, '-');
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'contribution-category bg-gray-900 p-4 rounded-lg border border-gray-700';
            categoryDiv.dataset.categoryId = categoryId;
            categoryDiv.innerHTML = `
                <h3 class="text-xl font-bold text-white mb-4">${name}</h3>
                <div id="dashboard-${categoryId}" class="dashboard-container mb-4"></div>
                <div class="items-container space-y-3"></div>
                <button type="button" class="add-item-btn mt-4 text-green-400 hover:text-green-300 text-sm font-semibold">+ Add Item to ${name}</button>
            `;
            this.elements.contributionsContainer.appendChild(categoryDiv);
            const itemsContainer = categoryDiv.querySelector('.items-container');
            if (items.length > 0) {
                items.forEach(item => this.addContributionItem(itemsContainer, item));
            } else {
                this.addContributionItem(itemsContainer);
            }
            categoryDiv.querySelector('.add-item-btn').addEventListener('click', () => this.addContributionItem(itemsContainer));
            this.updateContributionDashboards();
        },
        
        addContributionItem(container, name = '') {
             const row = document.createElement('div');
             row.className = 'contribution-item grid grid-cols-1 md:grid-cols-12 gap-2 items-end';
             row.innerHTML = `
                <div class="md:col-span-3"><label class="form-label text-xs">Item/Activity</label><input type="text" name="item-name" class="form-input text-sm" value="${name}" placeholder="e.g., Rugby Tour"></div>
                <div class="md:col-span-2"><label class="form-label text-xs">Budget (R)</label><input type="number" name="item-budget" class="form-input text-sm" placeholder="0.00" min="0"></div>
                <div class="md:col-span-2"><label class="form-label text-xs">Actual (R)</label><input type="number" name="item-actual" class="form-input text-sm" placeholder="0.00" min="0"></div>
                <div class="md:col-span-1"><label class="form-label text-xs">A's %</label><input type="number" name="item-percentA" class="form-input text-sm" value="50" min="0" max="100"></div>
                <div class="md:col-span-2"><label class="form-label text-xs">Who Pays</label><select name="item-payer" class="form-select text-sm"><option>Both</option><option>Parent A</option><option>Parent B</option></select></div>
                <div class="md:col-span-2"><label class="form-label text-xs">Time (Hrs/Mo)</label><input type="number" name="item-time" class="form-input text-sm" placeholder="0" min="0"></div>
             `;
             container.appendChild(row);
             row.querySelectorAll('input, select').forEach(el => el.addEventListener('input', () => this.updateContributionDashboards()));
        },

        updateContributionDashboards() {
            this.elements.contributionsContainer.querySelectorAll('.contribution-category').forEach(catDiv => {
                let catData = { budget: 0, actual: 0, time: 0, pA_budget: 0, pA_actual: 0, pA_time: 0, pB_budget: 0, pB_actual: 0, pB_time: 0 };
                const parentAName = this.planData.step1.parentA.nickname || this.planData.step1.parentA.name || 'Parent A';
                const parentBName = this.planData.step1.parentB.nickname || this.planData.step1.parentB.name || 'Parent B';

                catDiv.querySelectorAll('.contribution-item').forEach(row => {
                    const budget = parseFloat(row.querySelector('[name="item-budget"]').value) || 0;
                    const actual = parseFloat(row.querySelector('[name="item-actual"]').value) || 0;
                    const time = parseFloat(row.querySelector('[name="item-time"]').value) || 0;
                    const percentA = parseFloat(row.querySelector('[name="item-percentA"]').value) || 50;
                    const payer = row.querySelector('[name="item-payer"]').value;
                    
                    catData.budget += budget;
                    catData.actual += actual;
                    catData.time += time;
                    
                    // Simple split for now, can be enhanced
                    catData.pA_budget += budget * (percentA / 100);
                    catData.pB_budget += budget * ((100 - percentA) / 100);
                    catData.pA_actual += actual * (percentA / 100);
                    catData.pB_actual += actual * ((100 - percentA) / 100);
                });
                
                const percentA_actual = catData.actual > 0 ? (catData.pA_actual / catData.actual) * 100 : 50;

                const dashboardEl = catDiv.querySelector('.dashboard-container');
                dashboardEl.innerHTML = `
                    <div class="text-xs text-gray-400 border border-gray-700 p-2 rounded-md">
                        <p class="font-bold text-center text-sm mb-2 text-white">Category Dashboard</p>
                        <div class="w-full contribution-bar-bg flex mb-2"><div class="contribution-bar bg-blue-500" style="width:${percentA_actual}%">${parentAName}</div><div class="contribution-bar bg-pink-400" style="width:${100-percentA_actual}%">${parentBName}</div></div>
                        <div class="grid grid-cols-3 gap-2 text-center">
                           <div><p class="font-semibold">Budget</p><p class="text-green-400">R ${catData.budget.toFixed(2)}</p></div>
                           <div><p class="font-semibold">Actual</p><p class="text-green-400">R ${catData.actual.toFixed(2)}</p></div>
                           <div><p class="font-semibold">Time</p><p class="text-green-400">${catData.time} hrs</p></div>
                        </div>
                    </div>`;
            });
        },
        
        // --- STEP 5: REVIEW & PDF ---
        renderReviewPane() { /* Implementation from previous response */ },
        generatePdf() { /* Implementation from previous response */ },
        getCoverPage() { /* Implementation from previous response */ },
        getBackCoverPage() { /* Implementation from previous response */ }
    };
    
    window.planBuilderApp = planBuilderApp;
    planBuilderApp.init();
});
