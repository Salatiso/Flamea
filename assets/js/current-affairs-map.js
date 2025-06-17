import { masterDB } from './master-locator-db.js';

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the current affairs page by looking for the locator's unique ID
    if (!document.getElementById('community-locator')) {
        return;
    }

    // This page also uses the masterDB as its single source of truth.
    const servicesDB = masterDB;

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
    let userCircle;
    let debounceTimer;

    // --- INITIALIZATION ---

    // Called by the Google Maps script tag in the HTML when it's ready.
    window.initMap = function() {
        if (typeof google === 'undefined' || !google.maps) {
            console.error("Google Maps script not loaded.");
            mapDiv.innerHTML = '<p class="text-center text-red-500 p-4">Could not load map services. Please check your connection and API key.</p>';
            return;
        }
        
        const jhbLatLng = { lat: -26.2041, lng: 28.0473 }; // Default map center
        map = new google.maps.Map(mapDiv, {
            center: jhbLatLng,
            zoom: 10,
            mapId: 'FLAMEA_MAP_STYLE', // Ensure this Map ID is configured in your Google Cloud Console
            disableDefaultUI: true,
            zoomControl: true,
        });
        
        // **NEW**: Dynamically populate filters based on the master database
        populateFilters();
        
        // Display all services initially
        displayServices(servicesDB);
    }

    /**
     * **UPDATED**: Dynamically populates the category filter from the master database.
     */
    function populateFilters() {
        // Get all unique MAIN categories from the database
        const categories = [...new Set(servicesDB.map(s => s.category))].sort();
        
        categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Default option
        
        categories.forEach(cat => {
            if (cat) { // Ensure category is not null or undefined
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categoryFilter.appendChild(option);
            }
        });
    }

    // --- CORE MAP & FILTER FUNCTIONS ---

    function displayServices(services) {
        clearMarkers();
        services.forEach(service => {
            if (service.lat && service.lng) {
                const marker = new google.maps.Marker({
                    position: { lat: service.lat, lng: service.lng },
                    map: map,
                    title: `${service.name}\n${service.sub_category}`,
                });

                const infoWindow = new google.maps.InfoWindow({
                    content: `<div class="p-1 font-sans"><h4 class="font-bold text-md text-gray-800">${service.name}</h4><p class="text-sm text-gray-600">${service.address}</p><p class="text-xs text-gray-500 mt-1">${service.sub_category}</p></div>`
                });

                marker.addListener('click', () => infoWindow.open(map, marker));
                serviceMarkers.push(marker);
            }
        });
    }

    function clearMarkers() {
        serviceMarkers.forEach(marker => marker.setMap(null));
        serviceMarkers = [];
    }

    function filterAndDisplayServices() {
        // Get the current user location if a search has been performed
        const userLocation = userMarker ? userMarker.getPosition() : null;

        const selectedCategory = categoryFilter.value;
        const searchQuery = searchInput.value.toLowerCase();
        const radiusMeters = parseInt(radiusSlider.value, 10) * 1000;
        
        let filtered = servicesDB;

        // 1. Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        // 2. Filter by search query (name or sub_category)
        if (searchQuery) {
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(searchQuery) || 
                (s.sub_category && s.sub_category.toLowerCase().includes(searchQuery))
            );
        }
        
        // 3. Filter by radius if user location is available
        if (userLocation) {
            filtered = filtered.filter(s => {
                if (!s.lat || !s.lng) return false;
                const serviceLocation = new google.maps.LatLng(s.lat, s.lng);
                const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, serviceLocation);
                return distance <= radiusMeters;
            });
            // Update the circle visual on the map
            if (userCircle) userCircle.setRadius(radiusMeters);
        }
        
        displayServices(filtered);
    }

    // --- EVENT LISTENERS ---

    geolocateBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            statusDiv.textContent = 'Finding your location...';
            navigator.geolocation.getCurrentPosition(position => {
                const userPos = { lat: position.coords.latitude, lng: position.coords.longitude };
                statusDiv.textContent = '';
                map.setCenter(userPos);
                map.setZoom(12);

                if (userMarker) userMarker.setMap(null);
                userMarker = new google.maps.Marker({
                    position: userPos, map: map, title: 'Your Location',
                    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: '#3B82F6', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2 }
                });

                if (userCircle) userCircle.setMap(null);
                userCircle = new google.maps.Circle({
                    strokeColor: '#3B82F6', strokeOpacity: 0.8, strokeWeight: 2, fillColor: '#3B82F6', fillOpacity: 0.15,
                    map, center: userPos, radius: parseInt(radiusSlider.value, 10) * 1000
                });
                
                // Trigger a filter now that we have a location
                filterAndDisplayServices();

            }, () => { statusDiv.textContent = 'Could not get your location. Please enable permissions.'; });
        } else { statusDiv.textContent = 'Geolocation is not supported by your browser.'; }
    });

    const debouncedFilter = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterAndDisplayServices, 300);
    };
    
    categoryFilter.addEventListener('change', debouncedFilter);
    searchInput.addEventListener('input', debouncedFilter);
    radiusSlider.addEventListener('input', () => { radiusValue.textContent = radiusSlider.value; });
    radiusSlider.addEventListener('change', debouncedFilter); // Filter when user finishes sliding

    // --- KICK-OFF ---
    // The initMap function will be called by the Google Maps script callback in the HTML
});
