// Import the new consolidated database
import { masterDB } from './legalhelp-master-db.js';

// This function is now explicitly attached to the window object, making it global.
// This is the key fix for the "initLocator is not a function" error.
window.initLocator = function() {
    console.log("Google Maps API script loaded. Initializing Locator...");
    // Check if the main app object is ready, otherwise wait a moment.
    if (window.locatorApp) {
        window.locatorApp.initMap();
    } else {
        setTimeout(() => window.initLocator(), 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const locatorApp = {
        map: null,
        markers: [],
        userLocation: null,
        infoWindow: null,
        
        elements: {
            selectionView: document.getElementById('selection-view'),
            wizardView: document.getElementById('wizard-view'),
            explorerView: document.getElementById('explorer-view'),
            startWizardBtn: document.getElementById('start-wizard-btn'),
            exploreResourcesBtn: document.getElementById('explore-resources-btn'),
            wizardSection: document.getElementById('wizard-section'),
            backToSelectionWizard: document.getElementById('back-to-selection-wizard'),
            backToSelectionExplorer: document.getElementById('back-to-selection-explorer'),
            categoryFilter: document.getElementById('category-filter'),
            provinceFilter: document.getElementById('province-filter'),
            cityFilter: document.getElementById('city-filter'),
            addressInput: document.getElementById('address-input'),
            geolocateBtn: document.getElementById('geolocate-btn'),
            statusEl: document.getElementById('locator-status'),
            mapEl: document.getElementById('map'),
            resultsList: document.getElementById('results-list'),
        },
        
        init() {
            if (!this.elements.selectionView) return; 
            
            this.attachEventListeners();
            this.populateFilters();
        },

        attachEventListeners() {
            this.elements.startWizardBtn.addEventListener('click', () => { this.showView('wizard-view'); this.startWizard(); });
            this.elements.exploreResourcesBtn.addEventListener('click', () => { this.showView('explorer-view'); this.filterAndDisplayResults(); });
            this.elements.backToSelectionWizard.addEventListener('click', () => this.showView('selection-view'));
            this.elements.backToSelectionExplorer.addEventListener('click', () => this.showView('selection-view'));
            
            this.elements.categoryFilter.addEventListener('change', () => this.filterAndDisplayResults());
            this.elements.provinceFilter.addEventListener('change', () => { this.populateCityFilter(this.elements.provinceFilter.value); this.filterAndDisplayResults(); });
            this.elements.cityFilter.addEventListener('change', () => this.filterAndDisplayResults());
            this.elements.geolocateBtn.addEventListener('click', () => this.geolocateUser());
        },

        showView(viewId) {
            [this.elements.selectionView, this.elements.wizardView, this.elements.explorerView].forEach(view => {
                if(view) view.classList.remove('active');
            });
            const targetView = document.getElementById(viewId);
            if(targetView) targetView.classList.add('active');
        },

        async initMap() {
             try {
                // Import the new AdvancedMarkerElement library as recommended by Google
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
                window.AdvancedMarkerElement = AdvancedMarkerElement; // Make it available to the app

                const mapOptions = { 
                    center: { lat: -29.5, lng: 24.5 }, 
                    zoom: 5,
                    mapId: 'LEGALHELP_DARK_MAP_STYLE', // Unique ID for custom styling
                    styles: [ { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855" } ] }, { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e" } ] }, { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563" } ] }, { "featureType": "poi", "stylers": [ { "visibility": "off" } ] }, { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, { "featureType": "transit", "stylers": [ { "visibility": "off" } ] }, { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] } ]
                };
                this.map = new google.maps.Map(this.elements.mapEl, mapOptions);
                this.infoWindow = new google.maps.InfoWindow();

                const autocomplete = new google.maps.places.Autocomplete(this.elements.addressInput, { componentRestrictions: { country: "za" }, fields: ["geometry"] });
                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) { this.userLocation = place.geometry.location; this.filterAndDisplayResults(); }
                });
            } catch (error) {
                console.error("Error initializing Google Map:", error);
                if (this.elements.mapEl) this.elements.mapEl.innerHTML = `<div class="p-4 text-center text-red-400">Could not load map. Please check your API key and internet connection.</div>`;
            }
        },

        populateFilters() {
            const categories = [...new Set(masterDB.map(item => item.category))].sort();
            const provinces = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"];
            this.populateSelect(this.elements.categoryFilter, categories, "All Service Categories");
            this.populateSelect(this.elements.provinceFilter, provinces, "All Provinces");
            this.populateCityFilter();
        },

        populateSelect(selectElement, items, defaultOptionText) {
            selectElement.innerHTML = `<option value="all">${defaultOptionText}</option>`;
            items.forEach(item => { const option = new Option(item, item); selectElement.add(option); });
        },

        populateCityFilter(selectedProvince = 'all') {
            const relevantDB = (selectedProvince === 'all') ? masterDB : masterDB.filter(item => item.province === selectedProvince);
            const cities = [...new Set(relevantDB.map(item => item.city_town))].sort();
            this.populateSelect(this.elements.cityFilter, cities, "All Cities/Towns");
        },

        geolocateUser() {
            this.setStatus('Finding your location...');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    this.elements.addressInput.value = "Your Current Location";
                    this.filterAndDisplayResults();
                }, () => this.setStatus('Geolocation failed. Please enable location services.'), {timeout:10000});
            } else { this.setStatus('Geolocation is not supported by your browser.'); }
        },

        filterAndDisplayResults() {
            let filtered = [...masterDB];
            if (this.elements.categoryFilter.value !== 'all') filtered = filtered.filter(item => item.category === this.elements.categoryFilter.value);
            if (this.elements.provinceFilter.value !== 'all') filtered = filtered.filter(item => item.province === this.elements.provinceFilter.value);
            if (this.elements.cityFilter.value !== 'all') filtered = filtered.filter(item => item.city_town === this.elements.cityFilter.value);
            
            if (this.userLocation && google.maps.geometry) {
                filtered.forEach(item => {
                    if(item.lat && item.lng) {
                        item.distance = google.maps.geometry.spherical.computeDistanceBetween(this.userLocation, new google.maps.LatLng(item.lat, item.lng)) / 1000;
                    } else { item.distance = Infinity; }
                });
                filtered.sort((a, b) => a.distance - b.distance);
                this.setStatus(`Showing ${filtered.length} results, sorted by distance.`);
            } else { this.setStatus(`Showing ${filtered.length} results.`); }
            this.renderResults(filtered);
        },

        renderResults(results) {
            this.clearMarkers();
            this.elements.resultsList.innerHTML = (results.length === 0) ? '<div class="text-center text-gray-400 p-8"><i class="fas fa-exclamation-circle text-4xl mb-4"></i><p>No results found.</p></div>' : '';
            
            const bounds = new google.maps.LatLngBounds();
            if(this.userLocation) {
                 bounds.extend(this.userLocation);
                 new window.AdvancedMarkerElement({ position: this.userLocation, map: this.map, title: "Your Location" });
            }

            results.forEach((item) => {
                if(!item.lat || !item.lng) return;
                const card = document.createElement('div');
                card.className = 'resource-card p-4 bg-gray-800 rounded-lg border-l-4 border-indigo-500 cursor-pointer';
                card.innerHTML = this.getResultCardHTML(item);
                this.elements.resultsList.appendChild(card);
                
                const position = new google.maps.LatLng(item.lat, item.lng);
                const marker = new window.AdvancedMarkerElement({ position, map: this.map, title: item.name });
                bounds.extend(position);
                this.markers.push(marker);
                
                marker.addListener('click', () => this.showInfoWindow(marker, item));
                card.addEventListener('click', () => { this.map.panTo(position); this.map.setZoom(14); this.showInfoWindow(marker, item); });
            });
            
            if (results.length > 0 && this.map && !bounds.isEmpty()) { this.map.fitBounds(bounds); if (this.map.getZoom() > 15) this.map.setZoom(15); }
        },

        getResultCardHTML(item) { return `<h4 class="font-bold text-white">${item.name}</h4><p class="text-sm text-gray-400">${item.sub_category} | ${item.city_town}</p><p class="text-sm mt-2">${item.address}</p><div class="mt-2 text-sm space-x-4">${item.phone ? `<a href="tel:${item.phone}" class="text-indigo-400 hover:underline"><i class="fas fa-phone mr-1"></i> Call</a>` : ''}${item.website ? `<a href="${item.website}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:underline"><i class="fas fa-globe mr-1"></i> Website</a>` : ''}</div>${item.distance && item.distance !== Infinity ? `<p class="text-xs text-green-400 font-semibold mt-2">${item.distance.toFixed(1)} km away</p>` : ''}`; },
        showInfoWindow(marker, item) { const content = `<div class="p-1 text-gray-800"><h3 class="font-bold">${item.name}</h3><p>${item.address}</p></div>`; this.infoWindow.setContent(content); this.infoWindow.open({ anchor: marker, map: this.map }); },
        clearMarkers() { this.markers.forEach(marker => marker.map = null); this.markers = []; },
        setStatus(message) { this.elements.statusEl.textContent = message; },
        startWizard() { this.renderWizardStep({ id: 'category', question: 'What kind of help do you need?', options: [...new Set(masterDB.map(item => item.category))].sort() }); },
        renderWizardStep(step) { let optionsHtml = step.options.map(opt => `<button class="wizard-option w-full text-left p-4 bg-gray-700 border-2 border-gray-600 rounded-lg hover:bg-gray-600 hover:border-indigo-500" data-value="${opt}">${opt}</button>`).join(''); this.elements.wizardSection.innerHTML = `<div class="wizard-step active text-center"><h3 class="text-2xl font-bold text-white mb-6">${step.question}</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-step-id="${step.id}" data-category="${step.category || ''}">${optionsHtml}</div></div>`; this.elements.wizardSection.querySelectorAll('.wizard-option').forEach(btn => btn.addEventListener('click', e => this.handleWizardSelection(e.currentTarget))); },
        handleWizardSelection(button) { const stepId = button.parentElement.dataset.stepId; const value = button.dataset.value; if (stepId === 'category') { const provinces = [...new Set(masterDB.filter(i => i.category === value).map(i => i.province))].sort(); const nextStep = { id: 'province', question: `In which province are you looking for "${value}" services?`, options: provinces, category: value }; this.renderWizardStep(nextStep); } else if (stepId === 'province') { const category = button.parentElement.dataset.category; this.showView('explorer-view'); this.elements.categoryFilter.value = category; this.elements.provinceFilter.value = value; this.populateCityFilter(value); this.filterAndDisplayResults(); } }
    };
    
    window.locatorApp = locatorApp;
    locatorApp.init();
});
