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
            document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
            document.getElementById(`step-${this.currentStep}`).classList.add('active');

            for (let i = 1; i <= this.totalSteps; i++) {
                const indicator = document.getElementById(`step-indicator-${i}`);
                indicator.className = 'step-indicator ';
                if (i < this.currentStep) indicator.classList.add('complete');
                else if (i === this.currentStep) indicator.classList.add('active');
                else indicator.classList.add('pending');
                indicator.innerHTML = (i < this.currentStep) ? '<i class="fas fa-check"></i>' : i;
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
            if (this.currentStep === 4 && !Object.keys(this.planData.step4.categories).length) this.initContributions();
            if (this.currentStep === 5) this.renderReviewPane();
        },
        
        validateAndSaveStep() {
            const stepId = `step${this.currentStep}`;
            this.planData[stepId] = this.planData[stepId] || {};
            
            try {
                 if (this.currentStep === 1) {
                    this.planData.step1 = {
                        purpose: this.elements.planPurposeSelect.value,
                        parentA: { role: this.elements.parentARole.value, name: this.elements.parentANameInput.value, id: this.elements.parentAIdInput.value, nickname: this.elements.parentANicknameInput.value },
                        parentB: { role: this.elements.parentBRole.value, name: this.elements.parentBNameInput.value, id: this.elements.parentBIdInput.value, nickname: this.elements.parentBNicknameInput.value },
                        children: Array.from(this.elements.childrenContainer.querySelectorAll('.child-entry')).map(entry => ({
                            id: entry.dataset.childId,
                            name: entry.querySelector('[name="child-name"]').value,
                            nickname: entry.querySelector('[name="child-nickname"]').value,
                            dob: entry.querySelector('[name="child-dob"]').value,
                            residence: this.planData.step1.children.find(c=>c.id === entry.dataset.childId)?.residence || {type: 'parentA'}
                        }))
                    };
                    if (!this.planData.step1.parentA.name || !this.planData.step1.parentB.name) {
                        alert('Please enter names for both parents.'); return false;
                    }
                } else if (this.currentStep === 2) {
                    Object.assign(this.planData.step2, {
                        custody_status: this.elements.custodyStatusSelect.value,
                        custody_details: this.elements.custodyDetailsTextarea.value,
                    });
                    this.planData.step1.children.forEach(child => {
                        const residenceEl = document.querySelector(`.child-residence-type[data-child-id="${child.id}"]`);
                        if (residenceEl) {
                           child.residence = { type: residenceEl.value };
                           if (residenceEl.value === 'other') {
                               const detailsDiv = residenceEl.closest('.child-residence-block');
                               child.residence.guardianName = detailsDiv.querySelector('[name="guardian-name"]').value;
                               child.residence.guardianAddress = detailsDiv.querySelector('.manual-address').value;
                           }
                        }
                    });
                } else if (this.currentStep === 5) {
                    this.planData.step5.disclaimerAccepted = this.elements.disclaimerCheckbox.checked;
                    if (!this.planData.step5.disclaimerAccepted) {
                        alert('You must accept the disclaimer.'); return false;
                    }
                }
            } catch(e) {
                console.error(`Error saving data for step ${this.currentStep}:`, e);
                return false;
            }
            console.log("Saved Data:", JSON.parse(JSON.stringify(this.planData)));
            return true;
        },

        // --- STEP 1 LOGIC ---
        addChild() {
            const childId = `child-${Date.now()}`;
            const childEntry = document.createElement('div');
            childEntry.className = 'child-entry p-4 border border-gray-700 rounded-lg space-y-4';
            childEntry.dataset.childId = childId;
            childEntry.innerHTML = `
                <div class="grid md:grid-cols-3 gap-4">
                    <div><label class="form-label">Child's Full Name</label><input type="text" name="child-name" class="form-input"></div>
                    <div><label class="form-label">Referred to as (Optional)</label><input type="text" name="child-nickname" class="form-input" placeholder="e.g., Neo, oLiker"></div>
                    <div><label class="form-label">Date of Birth</label><input type="date" name="child-dob" class="form-input" style="color-scheme: dark;"></div>
                </div>`;
            this.elements.childrenContainer.appendChild(childEntry);
            this.planData.step1.children.push({ id: childId, name: '', dob: '', residence: { type: 'parentA' } });
            this.toggleChildFields();
        },
        
        toggleChildFields() {
            const isPlanning = this.elements.planPurposeSelect.value === 'planning';
            document.querySelectorAll('.child-entry').forEach(entry => {
                entry.querySelector('[name="child-name"]').placeholder = isPlanning ? 'Optional (e.g., Baby Neo)' : 'Full Legal Name';
                entry.querySelector('[name="child-dob"]').value = isPlanning ? '' : (entry.querySelector('[name="child-dob"]').value || '');
            });
        },

        // --- STEP 2 LOGIC ---
        renderChildResidences() {
            this.elements.childResidenceContainer.innerHTML = '';
            this.planData.step1.children.forEach(child => {
                const childData = this.planData.step1.children.find(c => c.id === child.id);
                if (!childData || (!childData.name && this.planData.step1.purpose !== 'planning')) return;

                const name = childData.nickname || childData.name || `Child ${this.planData.step1.children.indexOf(child) + 1}`;
                const residenceBlock = document.createElement('div');
                residenceBlock.className = 'child-residence-block p-4 border-t border-gray-700 mt-4';
                residenceBlock.dataset.childId = child.id;
                
                const parentANick = this.planData.step1.parentA.nickname || this.planData.step1.parentA.name;
                const parentBNick = this.planData.step1.parentB.nickname || this.planData.step1.parentB.name;

                residenceBlock.innerHTML = `
                    <h4 class="font-semibold text-lg text-white mb-3">Primary Residence for ${name}</h4>
                    <select class="form-select child-residence-type" data-child-id="${child.id}">
                        <option value="parentA" ${childData.residence.type === 'parentA' ? 'selected' : ''}>With ${parentANick}</option>
                        <option value="parentB" ${childData.residence.type === 'parentB' ? 'selected' : ''}>With ${parentBNick}</option>
                        <option value="other" ${childData.residence.type === 'other' ? 'selected' : ''}>With Another Guardian</option>
                    </select>
                    <div class="guardian-details mt-4 space-y-4 ${childData.residence.type === 'other' ? '' : 'hidden'}">
                        <input type="text" name="guardian-name" class="form-input" placeholder="Guardian's Full Name" value="${childData.residence.guardianName || ''}">
                        <label class="form-label mt-2">Guardian's Address</label>
                        <input type="text" class="form-input manual-address" name="guardian-address" placeholder="Type Guardian's Address or use map search" value="${childData.residence.guardianAddress || ''}">
                         <div id="map-${child.id}" class="h-64 w-full bg-gray-700 rounded-lg mt-2 border-2 border-gray-600"></div>
                    </div>
                `;
                this.elements.childResidenceContainer.appendChild(residenceBlock);
            });
            this.initGuardianMaps();
        },
        
        initMap() { /* This can be removed or repurposed if main map isn't needed */ },
        
        initGuardianMaps() {
            this.planData.step1.children.forEach(child => {
                const mapEl = document.getElementById(`map-${child.id}`);
                if (mapEl) {
                     const map = new google.maps.Map(mapEl, { center: { lat: -28.7, lng: 24.7 }, zoom: 5, mapId: `GUARDIAN_MAP_${child.id}`});
                     const input = document.querySelector(`.child-residence-block[data-child-id="${child.id}"] .manual-address`);
                     const autocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: "za" }});
                     autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace();
                        if (place.geometry) {
                            map.setCenter(place.geometry.location);
                            map.setZoom(15);
                            if(this.markers[child.id]) this.markers[child.id].setMap(null);
                            this.markers[child.id] = new google.maps.Marker({ map: map, position: place.geometry.location });
                        }
                    });
                }
            });
        },
        
        // --- STEP 3: TIME & SCHEDULE ---
        initCalendar() {
             if (this.calendar || !this.elements.calendarEl) return;
             this.calendar = new FullCalendar.Calendar(this.elements.calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth' },
                events: this.planData.step3.events, editable: true,
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
            if (!end) end = start;

            const parentA = this.planData.step1.parentA.nickname || this.planData.step1.parentA.name || 'Parent A';
            const parentB = this.planData.step1.parentB.nickname || this.planData.step1.parentB.name || 'Parent B';
            const ownerLabel = owner === 'parentA' ? parentA : parentB;
            const color = owner === 'parentA' ? '#3b82f6' : '#ec4899';
            
            const newEvent = { id: Date.now().toString(), title: `${title} (${ownerLabel})`, start, end: this.getExclusiveEndDate(end), allDay: true, backgroundColor: color, borderColor: color, extendedProps: { owner } };
            this.planData.step3.events.push(newEvent);
            this.calendar.addEvent(newEvent);
            this.updateTimeDashboard();
            this.elements.eventTitleInput.value = ''; this.elements.eventStartDateInput.value = ''; this.elements.eventEndDateInput.value = '';
        },
        
        updateCalendarEvent(event) {
            const index = this.planData.step3.events.findIndex(e => e.id === event.id);
            if(index > -1) {
                this.planData.step3.events[index].start = event.startStr;
                this.planData.step3.events[index].end = event.endStr;
            }
            this.updateTimeDashboard();
        },

        getExclusiveEndDate(inclusiveEndDateStr) {
            let d = new Date(inclusiveEndDateStr + 'T00:00:00');
            d.setDate(d.getDate() + 1);
            return d.toISOString().split('T')[0];
        },
        
        updateTimeDashboard() {
            let parentADays = 0, parentBDays = 0;
            this.planData.step3.events.forEach(event => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                const duration = Math.round((end - start) / (1000 * 60 * 60 * 24));
                if (event.extendedProps.owner === 'parentA') parentADays += duration;
                if (event.extendedProps.owner === 'parentB') parentBDays += duration;
            });
        
            const totalScheduledDays = parentADays + parentBDays;
            if (totalScheduledDays === 0) return; // Avoid division by zero

            const percentA = (parentADays / totalScheduledDays) * 100;
            const percentB = (parentBDays / totalScheduledDays) * 100;
            
            const pAName = this.planData.step1.parentA.nickname || this.planData.step1.parentA.name || 'Parent A';
            const pBName = this.planData.step1.parentB.nickname || this.planData.step1.parentB.name || 'Parent B';
            const dadRole = this.planData.step1.parentA.role === 'Father' ? 'A' : (this.planData.step1.parentB.role === 'Father' ? 'B' : null);
            const timeWithDad = dadRole ? (dadRole === 'A' ? parentADays : parentBDays) : 0;
            
            const deviation = Math.abs(percentA - 50);
            let alertClass = 'bg-green-700';
            if (deviation > 10) alertClass = 'bg-yellow-600';
            if (deviation > 25) alertClass = 'bg-red-600';
        
            this.elements.timeDashboard.innerHTML = `
                <h3 class="text-xl font-bold text-center mb-4">Yearly Time Allocation</h3>
                <div class="w-full contribution-bar-bg flex overflow-hidden">
                    <div class="contribution-bar bg-blue-500" style="width: ${percentA}%">${percentA.toFixed(0)}%</div>
                    <div class="contribution-bar bg-pink-400" style="width: ${percentB}%">${percentB.toFixed(0)}%</div>
                </div>
                <div class="grid grid-cols-2 gap-4 text-center mt-4 text-sm"><p><b>${pAName}:</b> ${parentADays.toFixed(0)} days</p><p><b>${pBName}:</b> ${parentBDays.toFixed(0)} days</p></div>
                <div class="mt-4 text-center text-sm font-bold p-2 rounded-lg ${alertClass}">${deviation > 10 ? 'Alert: Time split is more than 10% from 50/50.' : 'Time split is balanced.'}</div>
                ${dadRole ? `<p class="text-center text-green-400 font-bold mt-2">Time with Dad: ${timeWithDad.toFixed(0)} days per year</p>` : ''}`;
        
            this.elements.eventOwnerSelect.innerHTML = `<option value="parentA">${pAName}</option><option value="parentB">${pBName}</option>`;
        },
        
        exportSchedule() { /* Implementation remains the same */ },
        
        // --- STEP 4: CONTRIBUTIONS ---
        initContributions() { /* Implementation remains the same */ },
        addContributionCategory(name, items = []) { /* Implementation remains the same */ },
        addContributionItem(container, name, categoryId) { /* Implementation remains the same */ },
        updateContributionDashboards() { /* Implementation remains the same */ },

        // --- STEP 5: REVIEW & PDF ---
        renderReviewPane() {
             this.elements.reviewPane.innerHTML = `<h3 class="text-xl font-bold text-white mb-2">Review Your Plan</h3><p class="text-gray-400">Please review all the information you have entered. You can go back to any step to make changes. When you are ready, check the disclaimer and generate your document.</p><div id="review-content" class="mt-4 space-y-4 text-sm"></div>`;
            const reviewContent = document.getElementById('review-content');
            
            const { step1, step2, step3 } = this.planData;
            const parentAName = step1.parentA.nickname || step1.parentA.name || 'Parent A';
            const parentBName = step1.parentB.nickname || step1.parentB.name || 'Parent B';
            
            let html = `<div class="bg-gray-800 p-4 rounded-lg"><h4>Parties</h4><p>${parentAName} (${step1.parentA.role}) & ${parentBName} (${step1.parentB.role})</p></div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Children</h4><ul class="list-disc pl-5">${step1.children.map(c => `<li>${c.name}</li>`).join('')}</ul></div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Custody</h4><p>${step2.custody_status}</p></div>`;
            html += `<div class="bg-gray-800 p-4 rounded-lg"><h4>Time Allocation</h4><p>${step3.events.length} schedule events added.</p></div>`;
            
            reviewContent.innerHTML = html;
        },

        generatePdf() {
            if(!this.validateAndSaveStep()) return;
            alert("Generating PDF... This may take a moment.");
            
            // ... Full, correct PDF generation logic here ...
            // This is a simplified placeholder for the logic
            const { step1, step2, step3, step4 } = this.planData;
            const safeText = (text, fallback = '__________________') => text || fallback;
            
            let mainContent = '<h1>Parenting Plan</h1>';
            // Parties
            mainContent += '<h2>1. Parties Involved</h2>';
            mainContent += `<h3>Parent A: ${safeText(step1.parentA.name)} (${safeText(step1.parentA.role)})</h3>`;
            mainContent += `<p>ID: ${safeText(step1.parentA.id)}</p>`;
            //... Add all other fields in a similar way
            
            this.elements.pdfOutput.innerHTML = this.getCoverPage() + `<div class="pdf-page"><div class="pdf-content">${mainContent}</div><div class="pdf-footer">...</div></div>` + this.getBackCoverPage();
            
            const element = this.elements.pdfOutput;
            const opt = {
                margin: 0,
                filename: `Parenting_Plan_${step1.parentA.name}_${step1.parentB.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            
            html2pdf().set(opt).from(element).save().catch(err => console.error(err)).then(() => console.log("PDF generated."));
        },

        getCoverPage() { /* Implementation remains the same */ },
        getBackCoverPage() { /* Implementation remains the same */ }
    };
    
    // Make the app object globally accessible
    window.planBuilderApp = planBuilderApp;
    // Initialize the app after the DOM is ready
    planBuilderApp.init();
});
