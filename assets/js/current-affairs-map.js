document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the current affairs page
    if (!document.getElementById('community-locator')) {
        return;
    }

    // --- SERVICE DATABASE ---
    // This is a placeholder. You will replace this with the comprehensive JSON data
    // you generate using the AI prompt.
    const servicesDB = [
        { "name": "SAPS Johannesburg Central", "category": "Government & Admin", "sub_category": "SAPS Station", "address": "1 Commissioner St, Johannesburg", "province": "Gauteng", "lat": -26.2078, "lng": 28.0413 },
        { "name": "Dept of Home Affairs, Johannesburg", "category": "Government & Admin", "sub_category": "Home Affairs", "address": "77 Harrison St, Johannesburg", "province": "Gauteng", "lat": -26.2059, "lng": 28.0384 },
        { "name": "Johannesburg Magistrates Court", "category": "Justice & Legal", "sub_category": "Magistrates Court", "address": "60 Miriam Makeba St, Newtown, Johannesburg", "province": "Gauteng", "lat": -26.2016, "lng": 28.0323 },
        { "name": "Charlotte Maxeke Johannesburg Academic Hospital", "category": "Health", "sub_category": "Public Hospital", "address": "17 Jubilee Rd, Parktown, Johannesburg", "province": "Gauteng", "lat": -26.1772, "lng": 28.0430 },
        { "name": "Park Station (Gautrain & Metrorail)", "category": "Transport", "sub_category": "Gautrain Station", "address": "Rissik St, Johannesburg", "province": "Gauteng", "lat": -26.1971, "lng": 28.0437 }
        // ... PASTE YOUR FULL GENERATED JSON ARRAY HERE
    ];

    // --- DOM ELEMENTS ---
    const mapDiv = document.getElementById('map');
    const geolocateBtn = document.getElementById('geolocate-btn');
    const categoryFilter = document.getElementById('service-category-filter');
    const searchInput = document.getElementById('service-search-input');
    const radiusSlider = document.getElementById('radius-slider');
    const radiusValue = document.getElementById('radius-value');
    const statusDiv = document.getElementById('locator-status');

    let map;
    let userMarker;
    let serviceMarkers = [];

    // --- INITIALIZATION ---

    function initMap() {
        const jhbLatLng = { lat: -26.2041, lng: 28.0473 }; // Default to Johannesburg
        map = new google.maps.Map(mapDiv, {
            center: jhbLatLng,
            zoom: 10,
            mapId: 'FLAMEA_MAP_STYLE' // Using a Map ID for custom styling
        });
        populateFilters();
        displayServices(servicesDB); // Show all services initially
    }

    function populateFilters() {
        const categories = [...new Set(servicesDB.map(s => s.category))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categories.sort().forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
    }

    // --- CORE FUNCTIONS ---

    function displayServices(services) {
        clearMarkers();
        services.forEach(service => {
            if (service.lat && service.lng) {
                const marker = new google.maps.Marker({
                    position: { lat: service.lat, lng: service.lng },
                    map: map,
                    title: service.name,
                    // You can add custom icons based on category here
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div class="p-2 font-sans">
                            <h4 class="font-bold text-md text-gray-800">${service.name}</h4>
                            <p class="text-sm text-gray-600">${service.address}</p>
                            <p class="text-xs text-gray-500 mt-1">${service.sub_category}</p>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });
                serviceMarkers.push(marker);
            }
        });
    }

    function clearMarkers() {
        serviceMarkers.forEach(marker => marker.setMap(null));
        serviceMarkers = [];
    }
    
    function filterAndDisplayServices(userLat, userLng) {
        const selectedCategory = categoryFilter.value;
        const searchQuery = searchInput.value.toLowerCase();
        const radiusMeters = parseInt(radiusSlider.value, 10) * 1000;
        
        let filtered = servicesDB;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(s => s.name.toLowerCase().includes(searchQuery) || s.sub_category.toLowerCase().includes(searchQuery));
        }
        
        // Filter by radius if user location is available
        if(userLat && userLng) {
            const userLocation = new google.maps.LatLng(userLat, userLng);
            filtered = filtered.filter(s => {
                if(!s.lat || !s.lng) return false;
                const serviceLocation = new google.maps.LatLng(s.lat, s.lng);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, serviceLocation);
                return distance <= radiusMeters;
            });
        }
        
        displayServices(filtered);
    }

    // --- EVENT LISTENERS ---

    geolocateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            statusDiv.textContent = 'Finding your location...';
            navigator.geolocation.getCurrentPosition(position => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                statusDiv.textContent = '';
                map.setCenter(userLocation);
                map.setZoom(12);

                if (userMarker) userMarker.setMap(null);
                userMarker = new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: 'Your Location',
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#1d4ed8',
                        fillOpacity: 1,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                    }
                });
                
                filterAndDisplayServices(userLocation.lat, userLocation.lng);

            }, () => {
                statusDiv.textContent = 'Could not get your location. Please enable permissions.';
            });
        } else {
            statusDiv.textContent = 'Geolocation is not supported by your browser.';
        }
    });

    // Update results dynamically on filter change
    categoryFilter.addEventListener('change', () => filterAndDisplayServices());
    searchInput.addEventListener('input', () => filterAndDisplayServices());
    radiusSlider.addEventListener('input', () => {
        radiusValue.textContent = radiusSlider.value;
    });
     // Re-filter when user stops sliding for performance
    radiusSlider.addEventListener('change', () => filterAndDisplayServices());


    // --- INITIALIZE ---
    // The initMap function will be called by the Google Maps script callback
    window.initMap = initMap;
});
