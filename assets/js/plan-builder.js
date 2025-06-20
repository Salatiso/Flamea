// --- GLOBAL SCOPE FOR GOOGLE MAPS CALLBACK ---
// This function must be in the global scope to be found by the Google Maps script.
function initMap() {
    console.log("Google Maps API script loaded. Initializing Plan Builder...");
    // The 'planBuilder' object is created and initialized within the DOMContentLoaded event.
    // This ensures that the DOM is ready before the script tries to access any elements.
    window.planBuilder.initMap();
}

document.addEventListener('DOMContentLoaded', () => {

    // --- MAIN APP OBJECT ---
    const planBuilder = {
        // --- STATE MANAGEMENT ---
        currentStep: 1,
        totalSteps: 5,
        planData: {
            step1: { parentA_name: '', parentB_name: '', children: [] },
            step2: { parentA_address: null, parentB_address: null, distance: null },
            step3: { parentA_income: 0, parentB_income: 0, expenses: [] },
            step4: { events: [] },
            step5: { disclaimerAccepted: false }
        },
        map: null,
        markers: { parentA: null, parentB: null },
        calendar: null,
        
        // --- DOM ELEMENT REFERENCES ---
        elements: {
            prevBtn: document.getElementById('prev-step-btn'),
            nextBtn: document.getElementById('next-step-btn'),
            parentANameInput: document.getElementById('parentA-name'),
            parentBNameInput: document.getElementById('parentB-name'),
            childrenContainer: document.getElementById('children-container'),
            addChildBtn: document.getElementById('add-child-btn'),
            parentAAddressInput: document.getElementById('parentA-address'),
            parentBAddressInput: document.getElementById('parentB-address'),
            mapContainer: document.getElementById('map'),
            distanceSummary: document.getElementById('distance-summary'),
            parentAIncomeInput: document.getElementById('parentA-income'),
            parentBIncomeInput: document.getElementById('parentB-income'),
            financialDashboard: document.getElementById('financial-dashboard'),
            expensesContainer: document.getElementById('expenses-container'),
            addExpenseBtn: document.getElementById('add-expense-btn'),
            calendarEl: document.getElementById('calendar'),
            eventTitleInput: document.getElementById('event-title'),
            eventStartDateInput: document.getElementById('event-start-date'),
            eventEndDateInput: document.getElementById('event-end-date'),
            eventOwnerSelect: document.getElementById('event-owner'),
            addEventBtn: document.getElementById('add-event-btn'),
            reviewPane: document.getElementById('review-pane'),
            disclaimerCheckbox: document.getElementById('disclaimer-checkbox'),
            pdfOutput: document.getElementById('pdf-output'),
        },

        // --- INITIALIZATION ---
        init() {
            console.log("DOM ready. Attaching event listeners.");
            this.attachEventListeners();
            this.updateStepView();
        },

        attachEventListeners() {
            this.elements.prevBtn.addEventListener('click', () => this.changeStep('prev'));
            this.elements.nextBtn.addEventListener('click', () => this.changeStep('next'));
            this.elements.addChildBtn.addEventListener('click', () => this.addChild());
            this.elements.addExpenseBtn.addEventListener('click', () => this.addExpense());
            this.elements.addEventBtn.addEventListener('click', () => this.addCalendarEvent());
            this.elements.parentAIncomeInput.addEventListener('input', () => this.updateFinancials());
            this.elements.parentBIncomeInput.addEventListener('input', () => this.updateFinancials());
        },

        // --- STEP NAVIGATION & VIEW MANAGEMENT ---
        changeStep(direction) {
            if (!this.validateAndSaveStep()) return;

            if (direction === 'next' && this.currentStep < this.totalSteps) {
                this.currentStep++;
            } else if (direction === 'prev' && this.currentStep > 1) {
                this.currentStep--;
            } else if (direction === 'next' && this.currentStep === this.totalSteps) {
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
                indicator.classList.remove('active', 'complete', 'pending');
                if (i < this.currentStep) {
                    indicator.classList.add('complete');
                    indicator.innerHTML = '<i class="fas fa-check"></i>';
                } else if (i === this.currentStep) {
                    indicator.classList.add('active');
                    indicator.textContent = i;
                } else {
                    indicator.classList.add('pending');
                    indicator.textContent = i;
                }
            }

            this.elements.prevBtn.disabled = this.currentStep === 1;
            this.elements.prevBtn.classList.toggle('opacity-50', this.currentStep === 1);
            
            if (this.currentStep === this.totalSteps) {
                this.elements.nextBtn.textContent = 'Generate PDF Document';
                this.elements.nextBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.elements.nextBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            } else {
                this.elements.nextBtn.textContent = 'Next Step';
                this.elements.nextBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                this.elements.nextBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            }
            
            if(this.currentStep === 1 && this.planData.step1.children.length === 0) this.addChild();
            if(this.currentStep === 3 && this.planData.step3.expenses.length === 0) this.initExpenses();
            if(this.currentStep === 4 && !this.calendar) this.initCalendar();
            if(this.currentStep === 5) this.renderReviewPane();
        },
        
        validateAndSaveStep() {
            if (this.currentStep === 1) {
                this.planData.step1.parentA_name = this.elements.parentANameInput.value;
                this.planData.step1.parentB_name = this.elements.parentBNameInput.value;
                this.planData.step1.children = [];
                const childEntries = this.elements.childrenContainer.querySelectorAll('.child-entry');
                childEntries.forEach(entry => {
                    const name = entry.querySelector('[name="child-name"]').value;
                    const dob = entry.querySelector('[name="child-dob"]').value;
                    if(name) {
                        this.planData.step1.children.push({ name, dob });
                    }
                });
                if(!this.planData.step1.parentA_name || !this.planData.step1.parentB_name) {
                    alert('Please enter names for both parents.');
                    return false;
                }
            } else if (this.currentStep === 3) {
                this.planData.step3.parentA_income = parseFloat(this.elements.parentAIncomeInput.value) || 0;
                this.planData.step3.parentB_income = parseFloat(this.elements.parentBIncomeInput.value) || 0;
                this.planData.step3.expenses = [];
                const expenseRows = this.elements.expensesContainer.querySelectorAll('.expense-row');
                expenseRows.forEach(row => {
                    const name = row.querySelector('[name="expense-name"]').value;
                    const amount = parseFloat(row.querySelector('[name="expense-amount"]').value) || 0;
                    if(name && amount > 0) {
                        this.planData.step3.expenses.push({ name, amount });
                    }
                });
            } else if (this.currentStep === 5) {
                this.planData.step5.disclaimerAccepted = this.elements.disclaimerCheckbox.checked;
                if (!this.planData.step5.disclaimerAccepted) {
                    alert('You must accept the disclaimer to generate the document.');
                    return false;
                }
            }
            console.log("Saved Data:", this.planData);
            return true;
        },
        
        // --- STEP 1: PARTIES ---
        addChild() {
            const childId = Date.now();
            const childEntry = document.createElement('div');
            childEntry.className = 'child-entry grid md:grid-cols-3 gap-4 p-4 border border-gray-700 rounded-lg items-center';
            childEntry.innerHTML = `
                <div class="md:col-span-2">
                    <label for="child-name-${childId}" class="form-label">Child's Full Name</label>
                    <input type="text" id="child-name-${childId}" name="child-name" class="form-input">
                </div>
                <div>
                    <label for="child-dob-${childId}" class="form-label">Date of Birth</label>
                    <input type="date" id="child-dob-${childId}" name="child-dob" class="form-input">
                </div>
            `;
            this.elements.childrenContainer.appendChild(childEntry);
        },

        // --- STEP 2: RESIDENCE & MAPS ---
        initMap() {
            // This function is now called by the global initMap after the API script loads.
            try {
                const mapOptions = {
                    center: { lat: -29.8587, lng: 31.0218 },
                    zoom: 8,
                    mapId: 'FLAMEA_MAP_STYLE'
                };
                this.map = new google.maps.Map(this.elements.mapContainer, mapOptions);

                const setupAutocomplete = (inputId, parentKey) => {
                    const input = document.getElementById(inputId);
                    if(!input) {
                        console.error(`Autocomplete input not found: #${inputId}`);
                        return;
                    }
                    const autocomplete = new google.maps.places.Autocomplete(input, {
                        componentRestrictions: { country: "za" },
                        fields: ["address_components", "geometry", "name", "formatted_address"],
                    });
                    autocomplete.addListener("place_changed", () => {
                        const place = autocomplete.getPlace();
                        this.planData.step2[`parent${parentKey}_address`] = {
                            text: place.formatted_address,
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };
                        this.updateMap();
                    });
                };
                
                setupAutocomplete('parentA-address', 'A');
                setupAutocomplete('parentB-address', 'B');

                document.querySelectorAll('.locate-me-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const parent = e.currentTarget.dataset.parent;
                        navigator.geolocation.getCurrentPosition(position => {
                            const geocoder = new google.maps.Geocoder();
                            const latlng = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            };
                            geocoder.geocode({ location: latlng }, (results, status) => {
                                if (status === "OK" && results[0]) {
                                    document.getElementById(`parent${parent}-address`).value = results[0].formatted_address;
                                    this.planData.step2[`parent${parent}_address`] = { text: results[0].formatted_address, lat: latlng.lat, lng: latlng.lng };
                                    this.updateMap();
                                } else { alert("Geolocation failed: " + status); }
                            });
                        });
                    });
                });
            } catch (error) {
                console.error("Error initializing Google Map:", error);
                this.elements.mapContainer.innerHTML = `<p class="p-4 text-center text-red-400">Could not load map. Please check your API key and internet connection.</p>`;
            }
        },

        updateMap() {
            if (this.markers.A) this.markers.A.setMap(null);
            if (this.markers.B) this.markers.B.setMap(null);
            
            const bounds = new google.maps.LatLngBounds();
            let locationsExist = 0;

            const createMarker = (addressData, label, color) => {
                if (addressData && addressData.lat) {
                    locationsExist++;
                    const position = { lat: addressData.lat, lng: addressData.lng };
                    const marker = new google.maps.Marker({
                        position,
                        map: this.map,
                        label: { text: label, color: 'white', fontWeight: 'bold' },
                        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 15, fillColor: color, fillOpacity: 1, strokeWeight: 0 }
                    });
                    this.markers[`parent${label}`] = marker;
                    bounds.extend(position);
                }
            };
            
            createMarker(this.planData.step2.parentA_address, 'A', '#3b82f6');
            createMarker(this.planData.step2.parentB_address, 'B', '#ec4899');
            
            if (locationsExist > 1) {
                this.map.fitBounds(bounds);
                this.calculateDistance();
            } else if (locationsExist === 1) {
                this.map.setCenter(bounds.getCenter());
                this.map.setZoom(12);
            }
        },

        calculateDistance() {
            const origin = this.planData.step2.parentA_address;
            const destination = this.planData.step2.parentB_address;
            if (!origin || !destination) return;

            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [{lat: origin.lat, lng: origin.lng}],
                destinations: [{lat: destination.lat, lng: destination.lng}],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.METRIC,
            }, (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                    const distance = response.rows[0].elements[0].distance.text;
                    this.planData.step2.distance = distance;
                    this.elements.distanceSummary.innerHTML = `<p class="text-white font-semibold">Approximate distance between residences: <span class="text-green-400">${distance}</span></p>`;
                    this.elements.distanceSummary.classList.remove('hidden');
                }
            });
        },

        // --- STEP 3: FINANCIALS ---
        initExpenses() {
            const defaultExpenses = ['School Fees', 'Medical Aid', 'Groceries', 'Clothing', 'Extramural Activities'];
            defaultExpenses.forEach(name => this.addExpense(name));
            this.updateFinancials();
        },

        addExpense(name = '') {
            const expenseId = Date.now();
            const row = document.createElement('div');
            row.className = 'expense-row grid grid-cols-5 gap-4 items-center';
            row.innerHTML = `
                <div class="col-span-3">
                    ${name ? `<input type="text" name="expense-name" class="form-input bg-gray-600" value="${name}" readonly>` : `<input type="text" name="expense-name" class="form-input" placeholder="e.g., Transport">`}
                </div>
                <div class="col-span-2">
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">R</span>
                        <input type="number" name="expense-amount" class="form-input pl-8" placeholder="0.00" min="0">
                    </div>
                </div>
            `;
            row.querySelector('input[name="expense-amount"]').addEventListener('input', () => this.updateFinancials());
            this.elements.expensesContainer.appendChild(row);
        },

        updateFinancials() {
            const incomeA = parseFloat(this.elements.parentAIncomeInput.value) || 0;
            const incomeB = parseFloat(this.elements.parentBIncomeInput.value) || 0;
            const totalIncome = incomeA + incomeB;
            
            let totalExpense = 0;
            this.elements.expensesContainer.querySelectorAll('.expense-row').forEach(row => {
                totalExpense += parseFloat(row.querySelector('[name="expense-amount"]').value) || 0;
            });

            const percentA = totalIncome > 0 ? (incomeA / totalIncome) * 100 : (incomeB > 0 ? 0 : 50);
            const percentB = totalIncome > 0 ? (incomeB / totalIncome) * 100 : (incomeA > 0 ? 0 : 50);
            
            const contributionA = totalExpense * (percentA / 100);
            const contributionB = totalExpense * (percentB / 100);
            
            const parentAName = this.elements.parentANameInput.value || 'Parent A';
            const parentBName = this.elements.parentBNameInput.value || 'Parent B';

            this.elements.financialDashboard.innerHTML = `
                <h3 class="text-xl font-bold text-center mb-4">Contribution Dashboard</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div class="bg-gray-800 p-4 rounded-lg">
                        <p class="text-sm text-gray-400">${parentAName}'s Share</p>
                        <p class="text-2xl font-bold text-blue-400">R ${contributionA.toFixed(2)}</p>
                        <p class="text-xs text-gray-500">(${percentA.toFixed(1)}% of total income)</p>
                    </div>
                     <div class="bg-gray-800 p-4 rounded-lg">
                        <p class="text-sm text-gray-400">Total Monthly Expenses</p>
                        <p class="text-2xl font-bold text-green-400">R ${totalExpense.toFixed(2)}</p>
                        <p class="text-xs text-gray-500">Based on items below</p>
                    </div>
                    <div class="bg-gray-800 p-4 rounded-lg">
                        <p class="text-sm text-gray-400">${parentBName}'s Share</p>
                        <p class="text-2xl font-bold text-pink-400">R ${contributionB.toFixed(2)}</p>
                        <p class="text-xs text-gray-500">(${percentB.toFixed(1)}% of total income)</p>
                    </div>
                </div>
                 <div class="mt-4 flex items-center gap-4">
                    <div class="w-full contribution-bar-bg flex overflow-hidden">
                        <div class="contribution-bar bg-blue-500" style="width: ${percentA}%"></div>
                        <div class="contribution-bar bg-pink-400" style="width: ${percentB}%"></div>
                    </div>
                </div>
            `;
        },
        
        // --- STEP 4: CALENDAR ---
        initCalendar() {
            if (this.calendar || !this.elements.calendarEl) return;
            this.calendar = new FullCalendar.Calendar(this.elements.calendarEl, {
              initialView: 'dayGridMonth',
              headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek' },
              events: this.planData.step4.events,
              editable: true,
            });
            this.calendar.render();
        },
        
        addCalendarEvent() {
            const title = this.elements.eventTitleInput.value;
            const start = this.elements.eventStartDateInput.value;
            const end = this.elements.eventEndDateInput.value;
            const owner = this.elements.eventOwnerSelect.value;
            if(!title || !start) { alert('Please provide a title and start date.'); return; }
            
            const ownerLabel = owner === 'parentA' ? 'A' : (owner === 'parentB' ? 'B' : 'Shared');
            let color = owner === 'parentA' ? '#3b82f6' : (owner === 'parentB' ? '#ec4899' : '#16a34a');

            const newEvent = { id: Date.now().toString(), title: `(${ownerLabel}) ${title}`, start, end: end || null, allDay: true, backgroundColor: color, borderColor: color };
            this.planData.step4.events.push(newEvent);
            this.calendar.addEvent(newEvent);
            
            // Clear inputs
            this.elements.eventTitleInput.value = '';
            this.elements.eventStartDateInput.value = '';
            this.elements.eventEndDateInput.value = '';
        },
        
        // --- STEP 5: REVIEW ---
        renderReviewPane() {
            const { step1, step2, step3, step4 } = this.planData;
            const childrenHtml = step1.children.map(c => `<li>${c.name || 'Unnamed Child'} (DOB: ${c.dob || 'N/A'})</li>`).join('') || '<li>No children listed.</li>';
            const expensesHtml = step3.expenses.map(e => `<li>${e.name}: R ${e.amount.toFixed(2)}</li>`).join('') || '<li>No expenses listed.</li>';
            const scheduleHtml = step4.events.map(e => `<li>${e.start}: ${e.title}</li>`).join('') || '<li>No schedule events added.</li>';
            
            this.elements.reviewPane.innerHTML = `
                <div class="border-b border-gray-700 pb-4">
                    <h3 class="text-xl font-bold text-white mb-2">Parties</h3>
                    <p><strong>Parent A:</strong> ${step1.parentA_name || 'Not specified'}</p>
                    <p><strong>Parent B:</strong> ${step1.parentB_name || 'Not specified'}</p>
                    <h4 class="font-semibold mt-2">Children:</h4><ul class="list-disc list-inside text-gray-400">${childrenHtml}</ul>
                </div>
                 <div class="border-b border-gray-700 py-4">
                    <h3 class="text-xl font-bold text-white mb-2">Residences</h3>
                    <p><strong>Parent A Address:</strong> ${step2.parentA_address?.text || 'Not specified'}</p>
                    <p><strong>Parent B Address:</strong> ${step2.parentB_address?.text || 'Not specified'}</p>
                    <p><strong>Distance:</strong> ${step2.distance || 'Not calculated'}</p>
                </div>
                 <div class="border-b border-gray-700 py-4">
                    <h3 class="text-xl font-bold text-white mb-2">Finances</h3>
                    <p><strong>Parent A Income:</strong> R ${step3.parentA_income.toFixed(2)}</p>
                    <p><strong>Parent B Income:</strong> R ${step3.parentB_income.toFixed(2)}</p>
                    <h4 class="font-semibold mt-2">Shared Expenses:</h4><ul class="list-disc list-inside text-gray-400">${expensesHtml}</ul>
                </div>
                <div class="py-4">
                    <h3 class="text-xl font-bold text-white mb-2">Schedule</h3><ul class="list-disc list-inside text-gray-400">${scheduleHtml}</ul>
                </div>
            `;
        },

        // --- PDF GENERATION ---
        generatePdf() {
            const { step1, step2, step3, step4 } = this.planData;
            const safeText = (text) => text || '__________________';

            const coverPage = `<div class="pdf-page pdf-cover-page"><div class="pdf-content"><svg width="240" height="72" viewBox="0 0 200 60"><text x="0" y="45" font-family="Roboto Slab, serif" font-size="50" font-weight="700" fill="white">Flame</text><g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"></path></g><line x1="0" y1="58" x2="171" y2="58" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"></line></svg><h1 style="color:white; font-size: 32pt; margin-top: 2rem;">Parenting Plan</h1><p style="color:#d1d5db; font-size: 18pt;">Prepared for ${safeText(step1.parentA_name)} & ${safeText(step1.parentB_name)}</p><p style="color:#9ca3af; margin-top: 8rem;">FATHERS. LEADERS. LEGACY.</p></div><div class="pdf-footer"><span>Doc ID: FLAMEA-PP-${Date.now()}</span><span>Version: 1.0</span><span>Generated: ${new Date().toLocaleDateString('en-ZA')}</span></div></div>`;
            
            const childrenHtml = step1.children.map(c => `<li>Full Name: <b>${safeText(c.name)}</b>, Date of Birth: <b>${safeText(c.dob)}</b></li>`).join('') || '<li>No children specified.</li>';
            const expensesHtml = step3.expenses.map(e => `<li>${e.name}: R ${e.amount.toFixed(2)} per month</li>`).join('') || '<li>No expenses specified.</li>';
            const totalIncome = step3.parentA_income + step3.parentB_income;
            const percentA = totalIncome > 0 ? (step3.parentA_income / totalIncome) * 100 : 50;
            const totalExpense = step3.expenses.reduce((sum, e) => sum + e.amount, 0);
            const contributionA = totalExpense * (percentA / 100);
            const contributionB = totalExpense - contributionA;
            const scheduleHtml = step4.events.map(e => `<li><b>${e.title}</b> starting on ${new Date(e.start).toLocaleDateString('en-ZA')}${e.end ? ` until ${new Date(e.end).toLocaleDateString('en-ZA')}` : ''}</li>`).join('') || '<li>No specific schedule events were added.</li>';

            const mainPage = `<div class="pdf-page"><div class="pdf-watermark"><svg width="400" height="400" viewBox="0 0 200 60"><text x="0" y="45" font-family="Roboto Slab, serif" font-size="50" font-weight="700" fill="#000">Flame</text><g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"></path></g></svg></div><div class="pdf-header">Co-Parenting Compass Plan</div><div class="pdf-content"><h1>Parenting Plan</h1><p>This Parenting Plan is made on this day, ${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}, between the two parties named below, in accordance with the Children's Act 38 of 2005.</p><h2>1. The Parties</h2><h3>Parent A: ${safeText(step1.parentA_name)}</h3><p><b>Residential Address:</b> ${safeText(step2.parentA_address?.text)}</p><h3>Parent B: ${safeText(step1.parentB_name)}</h3><p><b>Residential Address:</b> ${safeText(step2.parentB_address?.text)}</p><h2>2. The Children</h2><p>This plan shall apply to the following minor child/children:</p><ul>${childrenHtml}</ul><h2>3. Financial Contributions</h2><p>The parents agree to contribute to the child/children's expenses on a pro-rata basis according to their respective incomes.</p><p><b>Parent A Monthly Income:</b> R ${step3.parentA_income.toFixed(2)}</p><p><b>Parent B Monthly Income:</b> R ${step3.parentB_income.toFixed(2)}</p><h3>Agreed Monthly Expenses</h3><ul>${expensesHtml}</ul><h3>Contribution Summary</h3><p>Based on the incomes and expenses listed, the monthly contribution towards these expenses is calculated as:</p><p><b>Parent A's Contribution: R ${contributionA.toFixed(2)}</b></p><p><b>Parent B's Contribution: R ${contributionB.toFixed(2)}</b></p><h2>4. Contact Schedule</h2><p>The following schedule has been agreed upon:</p><ul>${scheduleHtml}</ul><h2>5. Agreement & Signatures</h2><p>The parties agree that this plan is in the best interests of the child/children. They agree to be bound by its terms.</p><div style="margin-top: 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 4cm;"><div><div style="border-bottom: 1px solid black; padding-bottom: 5px;"></div><p style="margin-top: 5px;"><b>${safeText(step1.parentA_name)} (Parent A)</b></p></div><div><div style="border-bottom: 1px solid black; padding-bottom: 5px;"></div><p style="margin-top: 5px;"><b>${safeText(step1.parentB_name)} (Parent B)</b></p></div></div></div><div class="pdf-footer"><span>&copy; Flamea.org</span><span>Fathers. Leaders. Legacy.</span><span class="page-number">Page 1</span></div></div>`;
            
            const backCover = `<div class="pdf-page pdf-back-cover-page"><div class="pdf-content"><div class="flamea-logo dark mb-8"><svg width="160" height="48" viewBox="0 0 200 60"><text x="0" y="45" font-family="Roboto Slab, serif" font-size="50" font-weight="700" fill="white">Flame</text><g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"></path></g><line x1="0" y1="58" x2="171" y2="58" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round"></line></svg></div><h2 style="color: #4ade80; font-size: 18pt;">THE BUILDER'S ETHOS</h2><p style="color: #d1d5db; max-width: 80%; font-size: 10pt;">STRUCTURE. ASSEMBLE. LEGACY. ARCHITECT. TOOL-UP. INNOVATE. SUSTAIN. OBSERVE.</p></div><div class="pdf-footer"><span>https://flamea.org</span><span>Fathers. Leaders. Legacy.</span></div></div>`;

            this.elements.pdfOutput.innerHTML = coverPage + mainPage + backCover;
            const element = this.elements.pdfOutput;
            const opt = {
                margin: 0,
                filename: `Parenting_Plan_${step1.parentA_name}_${step1.parentB_name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(element).save();
        }
    };
    
    // --- EXPOSE TO GLOBAL SCOPE ---
    // This makes the planBuilder object accessible from the global initMap function.
    window.planBuilder = planBuilder;
    
    // Initialize the main app logic once the DOM is ready.
    planBuilder.init();
});
