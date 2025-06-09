document.addEventListener('DOMContentLoaded', function () {
    // --- DATABASE OF RESOURCES ---
    // In a real application, this would come from a backend API.
    // For this static site, we embed the data here.
    const resources = [
        // --- Courts ---
        { name: "Constitutional Court", category: "court", address: "1 Hospital Street, Braamfontein, Johannesburg", phone: "011 359 7400", website: "https://www.constitutionalcourt.org.za/", lat: -26.1918, lng: 28.0381 },
        { name: "High Court, Johannesburg", category: "court", address: "Pritchard St, Johannesburg", lat: -26.2045, lng: 28.0423 },
        { name: "High Court, Pretoria", category: "court", address: "c/o Paul Kruger and Madiba Streets, Pretoria", lat: -25.7461, lng: 28.1883 },
        { name: "High Court, Cape Town", category: "court", address: "35 Keerom St, Cape Town City Centre", lat: -33.9252, lng: 18.4196 },
        { name: "High Court, Durban", category: "court", address: "12 Walnut Rd, Durban Central", lat: -29.8600, lng: 31.0292 },
        // --- Family Advocates ---
        { name: "Family Advocate, Johannesburg", category: "family-advocate", address: "94 Pritchard Street, Schreiner Chambers, Johannesburg", phone: "011 333 3724", lat: -26.2040, lng: 28.0410 },
        { name: "Family Advocate, Pretoria", category: "family-advocate", address: "4th Floor, Center Walk Building, c/o Thabo Sehume & Pretorius Streets, Pretoria", phone: "012 323 0760", lat: -25.7465, lng: 28.1895 },
        { name: "Family Advocate, Cape Town", category: "family-advocate", address: "5th Floor, 45 Castle Street, Cape Town", phone: "021 426 1216", lat: -33.9221, lng: 18.4215 },
        { name: "Family Advocate, Durban", category: "family-advocate", address: "15th Floor Maritime House, 143 Salmon Grove Street, Durban", phone: "031 310 6500", lat: -29.8569, lng: 31.0250 },
        // --- DSD / Social Workers ---
        { name: "DSD Gauteng Provincial Office", category: "social-worker", address: "69 Commissioner Street, Johannesburg", phone: "011 355 7600", website:"https://www.dsd.gov.za", lat: -26.2041, lng: 28.0436 },
        { name: "DSD Western Cape Provincial Office", category: "social-worker", address: "14 Queen Victoria Street, Cape Town", phone: "021 483 5045", website:"https://www.westerncape.gov.za/dept/social-development", lat: -33.9262, lng: 18.4168 },
        // --- NGOs - Father Support ---
        { name: "FLAMEA.org", category: "ngo-father", address: "Online", website: "https://www.flamea.org", type: "Online" },
        { name: "Father A Nation (FAN)", category: "ngo-father", address: "National", website: "https://fatheranation.co.za/", type: "National" },
        { name: "Fathers 4 Justice SA", category: "ngo-father", address: "National", website: "https://www.f4j.co.za/", type: "National" },
        // --- NGOs - Family & Child ---
        { name: "FAMSA", category: "ngo-family", address: "National", website: "https://famsa.org.za/", type: "National" },
        { name: "Save the Children SA", category: "ngo-family", address: "National", website: "https://www.savethechildren.org.za/", type: "National" },
        { name: "Centre for Child Law", category: "legal-aid", address: "University of Pretoria, Pretoria", phone: "012 420 4502", website: "https://www.centreforchildlaw.co.za/", lat: -25.7558, lng: 28.2322 },
        // --- Legal Aid ---
        { name: "Legal Aid South Africa", category: "legal-aid", address: "National", phone: "0800 110 110", website: "https://legal-aid.co.za/", type: "National" },
        { name: "ProBono.Org", category: "legal-aid", address: "Johannesburg, Durban, Cape Town", website: "https://www.probono.org.za/", type: "City Specific" },
        // --- International ---
        { name: "UNICEF South Africa", category: "international", address: "Equity House, 659 Pienaar St, Waterkloof, Pretoria", phone: "012 425 4700", website: "https://www.unicef.org/southafrica/", lat: -25.7725, lng: 28.2435 },
        { name: "Hague Conference (HCCH) - Child Abduction", category: "international", address: "Online Resource", website: "https://www.hcch.net/en/instruments/conventions/specialised-sections/child-abduction", type: "Online" },
        { name: "International Social Service (ISS)", category: "international", address: "Online Resource", website: "https://www.iss-ssi.org/", type: "Online" }
    ];

    const searchBtn = document.getElementById('search-btn');
    const geolocateBtn = document.getElementById('geolocate-btn');
    const addressInput = document.getElementById('address-input');
    const serviceFilter = document.getElementById('service-type-filter');
    const resultsSection = document.getElementById('results-section');
    const manualDirectory = document.getElementById('manual-directory');
    const statusDiv = document.getElementById('locator-status');
    let autocomplete;

    function initAutocomplete() {
        if (typeof google !== 'undefined') {
            autocomplete = new google.maps.places.Autocomplete(addressInput);
            autocomplete.setFields(['geometry']);
        }
    }

    function handleSearch() {
        const place = autocomplete.getPlace();
        if (place && place.geometry) {
            const userLocation = place.geometry.location;
            findClosest(userLocation.lat(), userLocation.lng());
        } else if (addressInput.value) {
            // Geocode address if autocomplete fails or isn't used
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': addressInput.value, componentRestrictions: { country: 'ZA' } }, (results, status) => {
                if (status === 'OK') {
                    const userLocation = results[0].geometry.location;
                    findClosest(userLocation.lat(), userLocation.lng());
                } else {
                    statusDiv.textContent = "Could not find that address. Please try again.";
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
                statusDiv.textContent = "Unable to retrieve your location. Please check your browser permissions.";
            });
        } else {
            statusDiv.textContent = "Geolocation is not supported by this browser.";
        }
    }

    function findClosest(lat, lng) {
        statusDiv.textContent = "Calculating distances...";
        const userLocation = new google.maps.LatLng(lat, lng);
        const selectedCategory = serviceFilter.value;

        const filteredResources = resources.filter(r => {
            return (selectedCategory === 'all' || r.category === selectedCategory) && r.lat && r.lng;
        });
        
        if(filteredResources.length === 0) {
            resultsSection.innerHTML = `<p class="text-center text-lg">No physical services found for the selected category. Please check 'All Services'.</p>`;
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
        statusDiv.textContent = "";
    }

    function displayResults(sortedResources) {
        resultsSection.innerHTML = '<h3 class="text-2xl font-bold text-teal-400 mb-4">Services Near You (Closest First)</h3>';
        sortedResources.forEach(r => {
            const card = document.createElement('div');
            card.className = `resource-card bg-gray-900 p-4 rounded-lg shadow-md border-l-4 border-teal-500`;
            const distanceKm = (r.distance / 1000).toFixed(1);
            card.innerHTML = `
                <h4 class="font-bold text-lg text-white">${r.name}</h4>
                <p class="text-gray-400 text-sm">${r.address}</p>
                <p class="text-gray-300 font-semibold mt-2">${distanceKm} km away</p>
                ${r.phone ? `<p class="text-sm mt-1"><i class="fas fa-phone mr-2"></i>${r.phone}</p>` : ''}
                ${r.website ? `<a href="${r.website}" target="_blank" class="text-blue-400 hover:underline text-sm mt-1 inline-block"><i class="fas fa-globe mr-2"></i>Visit Website</a>` : ''}
            `;
            resultsSection.appendChild(card);
        });
    }

    function populateManualDirectory() {
        const categories = {
            'Courts': 'court',
            'Family Advocate Offices': 'family-advocate',
            'Social Services (DSD)': 'social-worker',
            'NGOs - Father Support': 'ngo-father',
            'NGOs - Family & Child Support': 'ngo-family',
            'Legal Aid': 'legal-aid',
            'International Organisations': 'international'
        };

        let html = '';
        for (const [title, category] of Object.entries(categories)) {
            const categoryResources = resources.filter(r => r.category === category);
            if (categoryResources.length > 0) {
                html += `
                    <details class="bg-gray-900 bg-opacity-75 rounded-lg mb-4">
                        <summary class="p-4 text-xl font-bold flex justify-between items-center">
                            <span><i class="fas fa-folder w-8 mr-3 text-blue-400"></i>${title}</span>
                            <i class="fas fa-chevron-right icon"></i>
                        </summary>
                        <div class="p-4 border-t border-gray-700 space-y-4">
                `;
                categoryResources.forEach(r => {
                    html += `
                        <div class="pl-4 border-l-2 border-gray-600">
                           <h5 class="font-semibold text-lg text-white">${r.name}</h5>
                           <p class="text-sm text-gray-400">${r.address}</p>
                            ${r.phone ? `<p class="text-sm mt-1"><i class="fas fa-phone mr-2"></i>${r.phone}</p>` : ''}
                            ${r.website ? `<a href="${r.website}" target="_blank" class="text-blue-400 hover:underline text-sm mt-1 inline-block"><i class="fas fa-globe mr-2"></i>Visit Website</a>` : ''}
                        </div>
                    `;
                });
                html += `</div></details>`;
            }
        }
        manualDirectory.innerHTML += html;
    }
    
    // --- INITIALIZATION ---
    window.initMap = initAutocomplete; // Google maps callback
    
    searchBtn.addEventListener('click', handleSearch);
    geolocateBtn.addEventListener('click', handleGeolocate);
    
    populateManualDirectory();
});
