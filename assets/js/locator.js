// /assets/js/locator.js
// This script powers the service locator page. It loads data from multiple
// database files, combines them, and provides real-time search and filtering.

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const searchInput = document.getElementById('search-input');
    const provinceFilter = document.getElementById('province-filter');
    const typeFilter = document.getElementById('type-filter');
    const resultsList = document.getElementById('results-list');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    const loadingIndicator = document.getElementById('loading-indicator');

    let combinedDatabase = [];

    // --- Data Loading and Normalization ---
    
    // This function loads all the data sources and normalizes them into one big array.
    function loadAndCombineData() {
        console.log("Starting data load...");
        let allData = [];

        // Helper function to process each data source
        const processSource = (source, type, defaultProvince = '') => {
            if (typeof source !== 'undefined' && Array.isArray(source)) {
                // Normalize the data into a common format
                const normalized = source.map(item => ({
                    name: item.name || item.court_name || item.organisation_name || 'N/A',
                    address: item.address || item.physical_address || 'N/A',
                    city: item.city || 'N/A',
                    province: item.province || defaultProvince,
                    contact: item.contact_number || item.telephone || item.phone || 'N/A',
                    type: type, // Assign the type based on the source file
                }));
                allData = allData.concat(normalized);
            } else {
                console.warn(`Data source for type '${type}' is missing or not an array.`);
            }
        };
        
        // Process all provided database files
        processSource(window.lower_courts_wc, 'Lower Court', 'Western Cape');
        processSource(window.lower_courts_ec, 'Lower Court', 'Eastern Cape');
        processSource(window.lower_courts_fs, 'Lower Court', 'Free State');
        processSource(window.lower_courts_gp, 'Lower Court', 'Gauteng');
        processSource(window.lower_courts_kzn, 'Lower Court', 'KwaZulu-Natal');
        processSource(window.lower_courts_lp, 'Lower Court', 'Limpopo');
        processSource(window.lower_courts_mp, 'Lower Court', 'Mpumalanga');
        processSource(window.lower_courts_nw, 'Lower Court', 'North West');
        processSource(window.lower_courts_nc, 'Lower Court', 'Northern Cape');
        processSource(window.higher_special_courts_sa, 'Higher & Special Court');
        processSource(window.law_gender_ngos_db, 'NGO');
        processSource(window.south_african_government_service_points, 'Government Service');

        combinedDatabase = allData;
        console.log(`Data loading complete. Total records: ${combinedDatabase.length}`);
        
        // Hide loader and perform initial render
        loadingIndicator.classList.add('hidden');
        renderResults();
    }
    
    // --- Rendering and Filtering ---

    // This function takes the current filters and renders the matching results.
    function renderResults() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedProvince = provinceFilter.value;
        const selectedType = typeFilter.value;

        const filteredData = combinedDatabase.filter(item => {
            const matchesSearch = searchTerm === '' || 
                                  item.name.toLowerCase().includes(searchTerm) ||
                                  item.city.toLowerCase().includes(searchTerm);
            const matchesProvince = selectedProvince === '' || item.province === selectedProvince;
            const matchesType = selectedType === '' || item.type === selectedType;

            return matchesSearch && matchesProvince && matchesType;
        });

        // Clear previous results
        resultsList.innerHTML = '';

        // Update count
        resultsCount.textContent = `Showing ${filteredData.length} of ${combinedDatabase.length} results.`;

        if (filteredData.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-white/95 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300';
                card.innerHTML = `
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
                    <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full mb-3">${item.type}</span>
                    <p class="text-gray-600 mb-2"><i class="fas fa-map-marker-alt fa-fw mr-2 text-gray-500"></i>${item.address}, ${item.city}, ${item.province}</p>
                    <p class="text-gray-600"><i class="fas fa-phone fa-fw mr-2 text-gray-500"></i>${item.contact}</p>
                `;
                resultsList.appendChild(card);
            });
        }
    }

    // --- Event Listeners ---
    searchInput.addEventListener('keyup', renderResults);
    provinceFilter.addEventListener('change', renderResults);
    typeFilter.addEventListener('change', renderResults);

    // --- Initial Load ---
    loadAndCombineData();
});
