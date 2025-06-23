// /flamea-mobile/assets/js/locator.js

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const filterContainer = document.getElementById('filter-container');
    const resultsList = document.getElementById('results-list');
    const noResults = document.getElementById('no-results');

    let combinedDatabase = [];

    function loadAndCombineData() {
        let allData = [];
        const processSource = (source, type, defaultProvince = '') => {
            if (typeof source !== 'undefined' && Array.isArray(source)) {
                const normalized = source.map(item => ({
                    name: item.name || item.court_name || item.organisation_name || 'N/A',
                    address: item.address || item.physical_address || 'N/A',
                    city: item.city || 'N/A',
                    province: item.province || defaultProvince,
                    contact: item.contact_number || item.telephone || item.phone || 'N/A',
                    type: type,
                }));
                allData = allData.concat(normalized);
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
        renderResults();
    }

    function renderResults(filterType = 'All', searchTerm = '') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        const filteredData = combinedDatabase.filter(item => {
            const matchesType = filterType === 'All' || item.type === filterType;
            const matchesSearch = lowerCaseSearchTerm === '' ||
                                  item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                                  item.city.toLowerCase().includes(lowerCaseSearchTerm);
            return matchesType && matchesSearch;
        });

        resultsList.innerHTML = ''; // Clear previous results

        if (filteredData.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
            filteredData.forEach(item => {
                const card = document.createElement('div');
                card.className = 'bg-gray-800 p-4 rounded-lg';
                card.innerHTML = `
                    <h3 class="font-bold text-lg text-amber-400">${item.name}</h3>
                    <span class="inline-block bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-0.5 rounded-full my-2">${item.type}</span>
                    <p class="text-sm text-gray-400"><i class="fas fa-map-marker-alt fa-fw mr-2"></i>${item.address}, ${item.city}</p>
                    <p class="text-sm text-gray-400"><i class="fas fa-phone fa-fw mr-2"></i>${item.contact || 'N/A'}</p>
                `;
                resultsList.appendChild(card);
            });
        }
    }
    
    // Event Listeners
    searchInput.addEventListener('keyup', () => {
        const activeFilter = filterContainer.querySelector('.bg-amber-500').dataset.filter;
        renderResults(activeFilter, searchInput.value);
    });

    filterContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            filterContainer.querySelectorAll('.filter-chip').forEach(chip => {
                chip.classList.remove('bg-amber-500', 'text-gray-900');
                chip.classList.add('bg-gray-700', 'text-gray-300');
            });
            e.target.classList.add('bg-amber-500', 'text-gray-900');
            e.target.classList.remove('bg-gray-700', 'text-gray-300');
            renderResults(e.target.dataset.filter, searchInput.value);
        }
    });

    // Initial Load
    loadAndCombineData();
});
