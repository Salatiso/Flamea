import { masterDB } from './master-locator-db.js';

// This function must be in the global scope for the Google Maps script callback
function initLocator() {
    console.log("Google Maps API script loaded. Initializing Locator...");
    if (window.locatorApp) {
        window.locatorApp.initMap();
    } else {
        // Retry after a short delay if the app object isn't ready
        setTimeout(initLocator, 100);
    }
}
window.initLocator = initLocator;

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
            featuredCard: document.getElementById('featured-resource-card'),
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
            if (!document.getElementById('selection-view')) return; // Not on locator page
            console.log("DOM ready. Initializing locator app.");
            this.attachEventListeners();
            this.populateFilters();
            this.renderFeaturedResource();
        },

        attachEventListeners() {
            this.elements.startWizardBtn.addEventListener('click', () => {
                this.showView('wizard-view');
                this.startWizard();
            });
            this.elements.exploreResourcesBtn.addEventListener('click', () => {
                this.showView('explorer-view');
                this.filterAndDisplayResults();
            });
            this.elements.backToSelectionWizard.addEventListener('click', () => this.showView('selection-view'));
            this.elements.backToSelectionExplorer.addEventListener('click', () => this.showView('selection-view'));
            
            this.elements.categoryFilter.addEventListener('change', () => this.filterAndDisplayResults());
            this.elements.provinceFilter.addEventListener('change', () => {
                this.populateCityFilter(this.elements.provinceFilter.value);
                this.filterAndDisplayResults();
            });
            this.elements.cityFilter.addEventListener('change', () => this.filterAndDisplayResults());
            this.elements.geolocateBtn.addEventListener('click', () => this.geolocateUser());
        },

        showView(viewId) {
            Object.values(this.elements)
                  .filter(el => el && el.classList.contains('view-container'))
                  .forEach(el => el.classList.remove('active'));
            document.getElementById(viewId).classList.add('active');
        },

        initMap() {
             try {
                const mapOptions = { center: { lat: -28.7, lng: 24.7 }, zoom: 5, mapId: 'FLAMEA_DARK_MAP' };
                this.map = new google.maps.Map(this.elements.mapEl, mapOptions);
                this.infoWindow = new google.maps.InfoWindow({
                    content: '',
                    disableAutoPan: true,
                });

                const autocomplete = new google.maps.places.Autocomplete(this.elements.addressInput, { componentRestrictions: { country: "za" }, fields: ["geometry"] });
                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        this.userLocation = place.geometry.location;
                        this.filterAndDisplayResults();
                    }
                });
            } catch (error) {
                console.error("Error initializing Google Map:", error);
                this.elements.mapEl.innerHTML = `<div class="p-4 text-center text-red-400">Could not load map. Please check your API key and internet connection.</div>`;
            }
        },

        populateFilters() {
            const categories = [...new Set(masterDB.map(item => item.category))].sort();
            const provinces = [...new Set(masterDB.map(item => item.province))].sort();
            this.populateSelect(this.elements.categoryFilter, categories, "All Categories");
            this.populateSelect(this.elements.provinceFilter, provinces, "All Provinces");
            this.populateCityFilter();
        },

        populateSelect(selectElement, items, defaultOptionText) {
            selectElement.innerHTML = `<option value="all">${defaultOptionText}</option>`;
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
            });
        },

        populateCityFilter(selectedProvince = 'all') {
            const cities = (selectedProvince === 'all')
                ? [...new Set(masterDB.map(item => item.city_town))].sort()
                : [...new Set(masterDB.filter(item => item.province === selectedProvince).map(item => item.city_town))].sort();
            this.populateSelect(this.elements.cityFilter, cities, "All Cities/Towns");
        },

        geolocateUser() {
            this.setStatus('Finding your location...');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    this.userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    this.elements.addressInput.value = "Your Current Location";
                    this.filterAndDisplayResults();
                }, () => this.setStatus('Geolocation failed. Please enable location services or enter an address.'), {timeout:10000});
            } else {
                this.setStatus('Geolocation is not supported by your browser.');
            }
        },

        filterAndDisplayResults() {
            let filtered = [...masterDB];
            const category = this.elements.categoryFilter.value;
            const province = this.elements.provinceFilter.value;
            const city = this.elements.cityFilter.value;

            if (category !== 'all') filtered = filtered.filter(item => item.category === category);
            if (province !== 'all') filtered = filtered.filter(item => item.province === province);
            if (city !== 'all') filtered = filtered.filter(item => item.city_town === city);
            
            if (this.userLocation) {
                filtered.forEach(item => {
                    const itemLoc = new google.maps.LatLng(item.lat, item.lng);
                    item.distance = google.maps.geometry.spherical.computeDistanceBetween(this.userLocation, itemLoc) / 1000;
                });
                filtered.sort((a, b) => a.distance - b.distance);
                this.setStatus(`Showing ${filtered.length} results, sorted by distance.`);
            } else {
                this.setStatus(`Showing ${filtered.length} results.`);
            }
            this.renderResults(filtered);
        },

        renderResults(results) {
            this.clearMarkers();
            this.elements.resultsList.innerHTML = '';
            
            if (results.length === 0) {
                this.elements.resultsList.innerHTML = '<div class="text-center text-gray-400 p-8"><i class="fas fa-exclamation-circle text-4xl mb-4"></i><p>No results found for your criteria.</p></div>';
                return;
            }

            const bounds = new google.maps.LatLngBounds();
            if(this.userLocation) {
                 bounds.extend(this.userLocation);
                 new google.maps.Marker({ position: this.userLocation, map: this.map, icon: { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#3b82f6', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 }});
            }

            results.slice(0, 100).forEach((item, index) => { // Limit to 100 for performance
                const card = document.createElement('div');
                card.className = 'resource-card p-4 bg-gray-800 rounded-lg border-l-4 border-teal-500 cursor-pointer';
                card.innerHTML = this.getResultCardHTML(item);
                this.elements.resultsList.appendChild(card);
                
                const position = new google.maps.LatLng(item.lat, item.lng);
                const marker = new google.maps.Marker({
                    position, map: this.map, title: item.name,
                    label: { text: (index + 1).toString(), color: 'white', fontWeight: 'bold' }
                });

                bounds.extend(position);
                this.markers.push(marker);

                const infoContent = this.getInfoContentHTML(item);
                
                marker.addListener('click', () => {
                    this.infoWindow.setContent(infoContent);
                    this.infoWindow.open(this.map, marker);
                });
                card.addEventListener('click', () => {
                    this.map.panTo(position);
                    this.map.setZoom(14);
                    this.infoWindow.setContent(infoContent);
                    this.infoWindow.open(this.map, marker);
                });
            });
            
            if (results.length > 0) {
                 this.map.fitBounds(bounds);
                 if (this.map.getZoom() > 15) this.map.setZoom(15);
            }
        },

        getResultCardHTML(item) {
             return `<h4 class="font-bold text-white">${item.name}</h4>
                    <p class="text-sm text-gray-400">${item.sub_category} | ${item.city_town}, ${item.province}</p>
                    <p class="text-sm mt-2">${item.address}</p>
                    <div class="mt-2 text-sm space-x-4">
                        ${item.phone ? `<a href="tel:${item.phone}" class="text-blue-400 hover:underline"><i class="fas fa-phone mr-1"></i> Call</a>` : ''}
                        ${item.website ? `<a href="${item.website}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline"><i class="fas fa-globe mr-1"></i> Website</a>` : ''}
                    </div>
                    ${item.distance ? `<p class="text-xs text-green-400 font-semibold mt-2">${item.distance.toFixed(1)} km away</p>` : ''}`;
        },
        
        getInfoContentHTML(item) {
            return `<div class="text-black p-2"><h3 class="font-bold">${item.name}</h3><p>${item.address}</p>${item.phone ? `<p>${item.phone}</p>` : ''}</div>`;
        },

        clearMarkers() {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];
        },

        setStatus(message) {
            this.elements.statusEl.textContent = message;
        },

        renderFeaturedResource() {
            const featuredPool = masterDB.filter(r => ['Government & Admin', 'Justice & Legal', 'NGO - Family', 'NGO - Father Support'].includes(r.category));
            const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
            const featuredItem = featuredPool[dayOfYear % featuredPool.length];
            
            if(this.elements.featuredCard && featuredItem) {
                this.elements.featuredCard.innerHTML = `
                    <i class="fas fa-star text-4xl text-yellow-400 mb-4"></i>
                    <h3 class="text-2xl font-bold mb-2">Featured Resource</h3>
                    <p class="font-semibold text-white mb-2">${featuredItem.name}</p>
                    <p class="text-gray-400 flex-grow mb-4 text-sm">${featuredItem.sub_category} in ${featuredItem.city_town}</p>
                    <a href="#" id="featured-link" class="bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors w-full mt-auto">View Details</a>
                `;
                document.getElementById('featured-link').addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showView('explorer-view');
                    this.renderResults([featuredItem]);
                });
            }
        },

        startWizard() {
            const step1 = {
                id: 'category',
                question: 'What kind of help do you need?',
                options: [...new Set(masterDB.map(item => item.category))].sort()
            };
            this.renderWizardStep(step1);
        },

        renderWizardStep(step) {
            let optionsHtml = step.options.map(opt => 
                `<button class="wizard-option w-full text-left p-4 bg-gray-700 border-2 border-gray-600 rounded-lg hover:bg-gray-600" data-value="${opt}">${opt}</button>`
            ).join('');

            this.elements.wizardSection.innerHTML = `
                <div class="wizard-step active text-center">
                    <h3 class="text-2xl font-bold text-white mb-6">${step.question}</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${optionsHtml}</div>
                </div>
            `;

            this.elements.wizardSection.querySelectorAll('.wizard-option').forEach(btn => {
                btn.addEventListener('click', e => this.handleWizardSelection(step.id, e.currentTarget.dataset.value));
            });
        },

        handleWizardSelection(stepId, value) {
            if (stepId === 'category') {
                const provinces = [...new Set(masterDB.filter(i => i.category === value).map(i => i.province))].sort();
                const nextStep = {
                    id: 'province',
                    question: `In which province are you looking for "${value}" services?`,
                    options: provinces,
                    category: value
                };
                this.renderWizardStep(nextStep);
            } else if (stepId === 'province') {
                const category = document.querySelector('.wizard-option').closest('.wizard-step').dataset.category;
                this.showView('explorer-view');
                this.elements.categoryFilter.value = category;
                this.elements.provinceFilter.value = value;
                this.populateCityFilter(value);
                this.filterAndDisplayResults();
            }
        }
    };
    
    // Make the app object globally accessible for the map callback
    window.locatorApp = locatorApp;
    // Initialize the app
    locatorApp.init();
});
