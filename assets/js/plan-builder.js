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
            step1: { purpose: 'existing', parentA_name: '', parentA_id: '', parentB_name: '', parentB_id: '', children: [] },
            step2: { custody_status: '', custody_details: '' },
            step3: { events: [] },
            step4: { categories: {} },
            step5: { disclaimerAccepted: false }
        },
        map: null,
        markers: { parentA: null, parentB: null },
        calendar: null,
        
        // --- DOM ELEMENT REFERENCES ---
        elements: { /* All DOM elements will be mapped here in init */ },

        // --- INITIALIZATION ---
        init() {
            console.log("DOM ready. Initializing Co-Parenting Compass.");
            this.mapDOMElements();
            this.attachEventListeners();
            this.updateStepView();
        },

        mapDOMElements() {
            this.elements = {
                prevBtn: document.getElementById('prev-step-btn'),
                nextBtn: document.getElementById('next-step-btn'),
                planPurposeSelect: document.getElementById('plan-purpose'),
                parentANameInput: document.getElementById('parentA-name'),
                parentAIdInput: document.getElementById('parentA-id'),
                parentBNameInput: document.getElementById('parentB-name'),
                parentBIdInput: document.getElementById('parentB-id'),
                childrenContainer: document.getElementById('children-container'),
                addChildBtn: document.getElementById('add-child-btn'),
                custodyStatusSelect: document.getElementById('custody-status'),
                custodyDetailsTextarea: document.getElementById('custody-details'),
                childResidenceContainer: document.getElementById('child-residence-container'),
                timeDashboard: document.getElementById('time-dashboard'),
                calendarEl: document.getElementById('calendar'),
                eventTitleInput: document.getElementById('event-title'),
                eventStartDateInput: document.getElementById('event-start-date'),
                eventEndDateInput: document.getElementById('event-end-date'),
                eventOwnerSelect: document.getElementById('event-owner'),
                addEventBtn: document.getElementById('add-event-btn'),
                exportScheduleBtn: document.getElementById('export-schedule-btn'),
                contributionsContainer: document.getElementById('contributions-container'),
                reviewPane: document.getElementById('review-pane'),
                disclaimerCheckbox: document.getElementById('disclaimer-checkbox'),
                pdfOutput: document.getElementById('pdf-output'),
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
            document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`step-${this.currentStep}`).classList.add('active');

            for (let i = 1; i <= this.totalSteps; i++) {
                const indicator = document.getElementById(`step-indicator-${i}`);
                indicator.className = 'step-indicator '; // Reset classes
                if (i < this.currentStep) indicator.classList.add('complete');
                else if (i === this.currentStep) indicator.classList.add('active');
                else indicator.classList.add('pending');
                indicator.innerHTML = (i < this.currentStep) ? '<i class="fas fa-check"></i>' : i;
            }

            this.elements.prevBtn.disabled = this.currentStep === 1;
            this.elements.prevBtn.classList.toggle('opacity-50', this.currentStep === 1);
            
            if (this.currentStep === this.totalSteps) {
                this.elements.nextBtn.textContent = 'Generate PDF Document';
                this.elements.nextBtn.classList.replace('bg-green-600', 'bg-blue-600');
                this.elements.nextBtn.classList.replace('hover:bg-green-700', 'hover:bg-blue-700');
            } else {
                this.elements.nextBtn.textContent = 'Next Step';
                this.elements.nextBtn.classList.replace('bg-blue-600', 'bg-green-600');
                this.elements.nextBtn.classList.replace('hover:bg-blue-700', 'hover:bg-green-700');
            }
            
            // Step-specific initializations
            if(this.currentStep === 1 && this.planData.step1.children.length === 0) this.addChild();
            if(this.currentStep === 2) this.renderChildResidences();
            if(this.currentStep === 3 && !this.calendar) this.initCalendar();
            if(this.currentStep === 4 && !Object.keys(this.planData.step4.categories).length) this.initContributions();
            if(this.currentStep === 5) this.renderReviewPane();
        },
        
        validateAndSaveStep() {
            const stepId = `step${this.currentStep}`;
            this.planData[stepId] = this.planData[stepId] || {}; // Ensure step data object exists

            if (this.currentStep === 1) {
                Object.assign(this.planData.step1, {
                    purpose: this.elements.planPurposeSelect.value,
                    parentA_name: this.elements.parentANameInput.value,
                    parentA_id: this.elements.parentAIdInput.value,
                    parentB_name: this.elements.parentBNameInput.value,
                    parentB_id: this.elements.parentBIdInput.value,
                    children: Array.from(this.elements.childrenContainer.querySelectorAll('.child-entry')).map(entry => ({
                        id: entry.dataset.childId,
                        name: entry.querySelector('[name="child-name"]').value,
                        dob: entry.querySelector('[name="child-dob"]').value
                    }))
                });
                if(!this.planData.step1.parentA_name || !this.planData.step1.parentB_name) {
                    alert('Please enter names for both parents.'); return false;
                }
            } else if (this.currentStep === 2) {
                Object.assign(this.planData.step2, {
                    custody_status: this.elements.custodyStatusSelect.value,
                    custody_details: this.elements.custodyDetailsTextarea.value,
                });
                // Residence data for children is saved dynamically when inputs change.
            } else if (this.currentStep === 5) {
                this.planData.step5.disclaimerAccepted = this.elements.disclaimerCheckbox.checked;
                if (!this.planData.step5.disclaimerAccepted) {
                    alert('You must accept the disclaimer to generate the document.'); return false;
                }
            }
            console.log("Saved Data:", this.planData);
            return true;
        },
        
        // --- STEP 1 LOGIC ---
        addChild() {
            const childId = `child-${Date.now()}`;
            const child = { id: childId, name: '', dob: '', residence: {type: 'parentA'} };
            this.planData.step1.children.push(child);
            
            const childEntry = document.createElement('div');
            childEntry.className = 'child-entry p-4 border border-gray-700 rounded-lg';
            childEntry.dataset.childId = childId;
            childEntry.innerHTML = `
                <div class="grid md:grid-cols-2 gap-4">
                    <div><label class="form-label">Child's Full Name</label><input type="text" name="child-name" class="form-input"></div>
                    <div><label class="form-label">Date of Birth</label><input type="date" name="child-dob" class="form-input"></div>
                </div>
            `;
            this.elements.childrenContainer.appendChild(childEntry);
            this.toggleChildFields();
        },
        
        toggleChildFields() {
            const isPlanning = this.elements.planPurposeSelect.value === 'planning';
            this.elements.childrenContainer.querySelectorAll('.child-entry').forEach(entry => {
                entry.querySelector('[name="child-name"]').placeholder = isPlanning ? 'Optional (e.g., Baby Neo)' : 'Full Legal Name';
                entry.querySelector('[name="child-dob"]').disabled = isPlanning;
            });
        },

        // --- STEP 2 LOGIC ---
        renderChildResidences() {
            this.elements.childResidenceContainer.innerHTML = '';
            this.planData.step1.children.forEach(child => {
                if (!child.name && this.planData.step1.purpose !== 'planning') return;

                const name = child.name || `Child ${this.planData.step1.children.indexOf(child) + 1}`;
                const residenceBlock = document.createElement('div');
                residenceBlock.className = 'p-4 border-t border-gray-700';
                residenceBlock.innerHTML = `
                    <h4 class="font-semibold text-lg text-white mb-3">Where will ${name} live?</h4>
                    <select class="form-select child-residence-type" data-child-id="${child.id}">
                        <option value="parentA">With Parent A (${this.planData.step1.parentA_name || ''})</option>
                        <option value="parentB">With Parent B (${this.planData.step1.parentB_name || ''})</option>
                        <option value="other">With Another Guardian</option>
                    </select>
                    <div class="guardian-details mt-4 space-y-4 hidden">
                        <input type="text" class="form-input" placeholder="Guardian's Full Name">
                        <input type="text" class="form-input manual-address" placeholder="Guardian's Address (manual entry)">
                    </div>
                `;
                this.elements.childResidenceContainer.appendChild(residenceBlock);
            });
        },

        initMap() { /* Already defined in previous response, keeping it for context */ },
        updateMap() { /* ... */ },
        calculateDistance() { /* ... */ },

        // --- STEP 3: TIME & SCHEDULE ---
        initCalendar() {
            if (this.calendar || !this.elements.calendarEl) return;
            this.calendar = new FullCalendar.Calendar(this.elements.calendarEl, {
              initialView: 'dayGridMonth',
              headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth' },
              events: this.planData.step3.events,
              editable: true,
              eventDrop: (info) => this.updateCalendarEvent(info.event),
              eventResize: (info) => this.updateCalendarEvent(info.event),
            });
            this.calendar.render();
            this.updateTimeDashboard();
        },

        addCalendarEvent() {
            const title = this.elements.eventTitleInput.value;
            const start = this.elements.eventStartDateInput.value;
            let end = this.elements.eventEndDateInput.value;
            const owner = this.elements.eventOwnerSelect.value;
            
            if (!title || !start) { alert('Please provide a title and start date.'); return; }
            if (end && new Date(end) < new Date(start)) { alert('End date cannot be before start date.'); return; }
            if (!end) end = start; // If no end date, it's a single day event

            const ownerLabel = owner === 'parentA' ? 'A' : 'B';
            const color = owner === 'parentA' ? '#3b82f6' : '#ec4899';
            
            const newEvent = { id: Date.now().toString(), title: `(${ownerLabel}) ${title}`, start, end: this.getExclusiveEndDate(end), allDay: true, backgroundColor: color, borderColor: color, extendedProps: { owner } };
            this.planData.step3.events.push(newEvent);
            this.calendar.addEvent(newEvent);
            this.updateTimeDashboard();
            
            // Clear inputs
            this.elements.eventTitleInput.value = '';
            this.elements.eventStartDateInput.value = '';
            this.elements.eventEndDateInput.value = '';
        },
        
        getExclusiveEndDate(inclusiveEndDate) {
            let d = new Date(inclusiveEndDate);
            d.setDate(d.getDate() + 1);
            return d.toISOString().split('T')[0];
        },
        
        updateTimeDashboard() {
            let totalDays = 365.25; // Average days in a year
            let parentADays = 0;
            let parentBDays = 0;

            this.planData.step3.events.forEach(event => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const duration = (end - start) / (1000 * 60 * 60 * 24);
                if(event.extendedProps.owner === 'parentA') parentADays += duration;
                if(event.extendedProps.owner === 'parentB') parentBDays += duration;
            });

            const percentA = (parentADays / totalDays) * 100;
            const percentB = (parentBDays / totalDays) * 100;
            
            const parentAName = this.planData.step1.parentA_name || 'Parent A';
            const parentBName = this.planData.step1.parentB_name || 'Parent B';
            
            const deviation = Math.abs(percentA - percentB);
            let alertClass = 'bg-green-600';
            if (deviation > 10) alertClass = 'bg-yellow-500';
            if (deviation > 20) alertClass = 'bg-red-600';

            this.elements.timeDashboard.innerHTML = `
                <h3 class="text-xl font-bold text-center mb-4">Yearly Time Allocation</h3>
                <div class="flex items-center gap-4">
                    <div class="w-full contribution-bar-bg flex overflow-hidden">
                        <div class="contribution-bar bg-blue-500" style="width: ${percentA}%">${percentA.toFixed(0)}%</div>
                        <div class="contribution-bar bg-pink-400" style="width: ${percentB}%">${percentB.toFixed(0)}%</div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-center mt-4">
                     <p class="text-sm font-semibold">${parentAName}: ${parentADays.toFixed(0)} days</p>
                     <p class="text-sm font-semibold">${parentBName}: ${parentBDays.toFixed(0)} days</p>
                </div>
                 <div id="time-balance-indicator" class="mt-4 text-center text-sm font-bold p-2 rounded-lg ${alertClass}">
                    ${deviation > 10 ? 'Time split is becoming unbalanced.' : 'Time split is balanced.'}
                 </div>
                 <p class="text-center text-green-400 font-bold mt-2">Time with Daddy: ${parentADays.toFixed(0)} days</p>
            `;
        },
        
        exportSchedule() {
            let icsEvents = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Flamea.org//Parenting Plan//EN\n`;
            this.planData.step3.events.forEach(event => {
                const start = new Date(event.start).toISOString().replace(/-|:|\.\d+/g, "");
                const end = new Date(event.end).toISOString().replace(/-|:|\.\d+/g, "");
                icsEvents += `BEGIN:VEVENT\nUID:${event.id}@flamea.org\nDTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, "")}\nDTSTART;VALUE=DATE:${start.substring(0,8)}\nDTEND;VALUE=DATE:${end.substring(0,8)}\nSUMMARY:${event.title}\nEND:VEVENT\n`;
            });
            icsEvents += 'END:VCALENDAR';
            
            const blob = new Blob([icsEvents], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "flamea_parenting_schedule.ics");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

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
            const categoryId = `category-${Date.now()}`;
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'contribution-category bg-gray-900 p-4 rounded-lg';
            categoryDiv.innerHTML = `
                <h3 class="text-xl font-bold text-white mb-4">${name}</h3>
                <div class="dashboard-container mb-4"></div>
                <div class="items-container space-y-4"></div>
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
        },
        
        addContributionItem(container, name = '') {
             const row = document.createElement('div');
             row.className = 'contribution-item grid grid-cols-12 gap-2 items-end';
             row.innerHTML = `
                <div class="col-span-12 md:col-span-4"><label class="form-label text-xs">Item/Activity</label><input type="text" name="item-name" class="form-input text-sm" value="${name}" placeholder="e.g., Rugby Tour"></div>
                <div class="col-span-6 md:col-span-2"><label class="form-label text-xs">Budget (R)</label><input type="number" name="item-budget" class="form-input text-sm" placeholder="0"></div>
                <div class="col-span-6 md:col-span-2"><label class="form-label text-xs">Actual (R)</label><input type="number" name="item-actual" class="form-input text-sm" placeholder="0"></div>
                <div class="col-span-6 md:col-span-2"><label class="form-label text-xs">Parent A %</label><input type="number" name="item-percentA" class="form-input text-sm" value="50" min="0" max="100"></div>
                <div class="col-span-6 md:col-span-2"><label class="form-label text-xs">Who Pays</label><select name="item-payer" class="form-select text-sm"><option>Parent A</option><option>Parent B</option><option>Both</option></select></div>
             `;
             container.appendChild(row);
        },

        // --- STEP 5 LOGIC ---
        renderReviewPane() { /* Defined in previous response */ },
        generatePdf() { /* Defined in previous response */ },

    };
    
    window.planBuilderApp = planBuilderApp;
    planBuilderApp.init();
});
