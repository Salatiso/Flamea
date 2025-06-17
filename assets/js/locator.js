import { masterDB } from './master-locator-db.js';

document.addEventListener('DOMContentLoaded', function () {
    // This page uses the masterDB as its single source of truth.
    const resources = masterDB;

    // --- DOM ELEMENT SELECTION ---
    const searchBtn = document.getElementById('search-btn');
    const geolocateBtn = document.getElementById('geolocate-btn');
    const addressInput = document.getElementById('address-input');
    const serviceFilter = document.getElementById('service-type-filter');
    const resultsSection = document.getElementById('results-section');
    const manualDirectory = document.getElementById('manual-directory');
    const statusDiv = document.getElementById('locator-status');
    let autocomplete;

    // --- INITIALIZATION ---
    
    // Called by Google Maps script when it's ready.
    window.initMap = function() {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
            autocomplete = new google.maps.places.Autocomplete(addressInput);
            autocomplete.setFields(['geometry']);
        } else {
            console.error("Google Maps API script did not load correctly.");
            statusDiv.textContent = "Error: Map services unavailable.";
        }
    }

    /**
     * Dynamically populates the service filter dropdown from the master database.
     */
    function populateFilters() {
        // Get all unique sub-categories from the database
        const subCategories = [...new Set(resources.map(item => item.sub_category))].sort();
        
        serviceFilter.innerHTML = '<option value="all">All Services</option>'; // Start with the 'All' option
        
        subCategories.forEach(subCategory => {
            if (subCategory) { // Ensure it's not null or undefined
                const option = document.createElement('option');
                option.value = subCategory;
                option.textContent = subCategory;
                serviceFilter.appendChild(option);
            }
        });
    }

    /**
     * Renders the full, categorized directory list.
     */
    function populateManualDirectory() {
        const categories = [...new Set(resources.map(item => item.category))].sort();
        let html = '';

        categories.forEach(category => {
            const categoryResources = resources.filter(r => r.category === category);
            if (categoryResources.length > 0) {
                html += `
                    <details class="bg-gray-800 bg-opacity-75 rounded-lg mb-4">
                        <summary class="p-4 text-xl font-bold flex justify-between items-center cursor-pointer">
                            <span><i class="fas fa-folder w-8 mr-3 text-blue-400"></i>${category}</span>
                            <i class="fas fa-chevron-right icon transition-transform"></i>
                        </summary>
                        <div class="p-4 border-t border-gray-700 space-y-4">
                `;
                categoryResources.forEach(r => {
                    html += `
                        <div class="pl-4 border-l-2 border-gray-600">
                           <h5 class="font-semibold text-lg text-white">${r.name}</h5>
                           <p class="text-sm text-gray-400">${r.address}</p>
                            ${r.phone ? `<p class="text-sm mt-1"><i class="fas fa-phone mr-2"></i>${r.phone}</p>` : ''}
                            ${r.website ? `<a href="${r.website}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline text-sm mt-1 inline-block"><i class="fas fa-globe mr-2"></i>Visit Website</a>` : ''}
                        </div>
                    `;
                });
                html += `</div></details>`;
            }
        });
        manualDirectory.innerHTML += html;
    }

    // --- GEOLOCATION & SEARCH LOGIC ---

    function handleSearch() {
        if (!autocomplete) {
            statusDiv.textContent = "Map services are still loading. Please try again.";
            return;
        }
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
            findClosest(place.geometry.location.lat(), place.geometry.location.lng());
        } else if (addressInput.value) {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': addressInput.value, componentRestrictions: { country: 'ZA' } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    findClosest(results[0].geometry.location.lat(), results[0].geometry.location.lng());
                } else {
                    statusDiv.textContent = "Could not find that address. Please be more specific.";
                }
            });
        } else {
             statusDiv.textContent = "Please enter an address.";
        }
    }

    function handleGeolocate() {
        if (navigator.geolocation) {
            statusDiv.textContent = "Fetching your location...";
            navigator.geolocation.getCurrentPosition(position => {
                findClosest(position.coords.latitude, position.coords.longitude);
            }, () => {
                statusDiv.textContent = "Unable to retrieve location. Please check browser permissions.";
            }, { timeout: 10000 });
        } else {
            statusDiv.textContent = "Geolocation is not supported by your browser.";
        }
    }

    function findClosest(lat, lng) {
        statusDiv.textContent = "Calculating distances...";
        const userLocation = new google.maps.LatLng(lat, lng);
        const selectedSubCategory = serviceFilter.value;

        const filteredResources = resources.filter(r => {
            return (selectedSubCategory === 'all' || r.sub_category === selectedSubCategory) && r.lat && r.lng;
        });
        
        if (filteredResources.length === 0) {
            resultsSection.innerHTML = `<p class="text-center text-lg text-yellow-400 py-4">No physical services found for the selected category.</p>`;
            statusDiv.textContent = "";
            return;
        }

        const resourcesWithDistances = filteredResources.map(r => {
            const resourceLocation = new google.maps.LatLng(r.lat, r.lng);
            const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, resourceLocation);
            return { ...r, distance: distance };
        });

        resourcesWithDistances.sort((a, b) => a.distance - b.distance);
        displayResults(resourcesWithDistances);
        statusDiv.textContent = "Showing closest results.";
    }

    function displayResults(sortedResources) {
        resultsSection.innerHTML = '<h3 class="text-2xl font-bold text-teal-400 mb-4">Services Near You (Closest First)</h3>';
        sortedResources.forEach(r => {
            const card = document.createElement('div');
            card.className = `resource-card bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-teal-500`;
            const distanceKm = (r.distance / 1000).toFixed(1);
            card.innerHTML = `
                <h4 class="font-bold text-lg text-white">${r.name}</h4>
                <p class="text-gray-400 text-sm">${r.address}</p>
                <p class="text-gray-300 font-semibold mt-2">${distanceKm} km away</p>
                ${r.phone ? `<p class="text-sm mt-1"><i class="fas fa-phone mr-2"></i>${r.phone}</p>` : ''}
                ${r.website ? `<a href="${r.website}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline text-sm mt-1 inline-block"><i class="fas fa-globe mr-2"></i>Visit Website</a>` : ''}
            `;
            resultsSection.appendChild(card);
        });
    }
    
    // --- KICK-OFF ---
    if (searchBtn) searchBtn.addEventListener('click', handleSearch);
    if (geolocateBtn) geolocateBtn.addEventListener('click', handleGeolocate);
    
    populateFilters();
    populateManualDirectory();
});
