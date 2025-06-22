// /assets/js/main.js
// This file can be expanded to handle mobile-specific interactions,
// such as navigation, dynamic content loading, or form handling.

document.addEventListener('DOMContentLoaded', () => {
    // Example: Active state for filter chips
    const filterChips = document.querySelectorAll('.filter-chips button');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // First, remove active class from all chips
            filterChips.forEach(c => {
                c.classList.remove('bg-amber-500', 'text-gray-900');
                c.classList.add('bg-gray-700', 'text-gray-300');
            });
            // Then, add active class to the clicked chip
            chip.classList.add('bg-amber-500', 'text-gray-900');
            chip.classList.remove('bg-gray-700', 'text-gray-300');
        });
    });

    console.log("Flamea Mobile JS Initialized.");
});
