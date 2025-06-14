/**
 * Flamea.org - Centralized Sidebar Loader
 * * This script fetches the sidebar HTML from a central file and injects it into any page
 * that includes the script. It also dynamically sets the 'active' class on the correct
 * navigation link based on the current page's URL.
 */
document.addEventListener('DOMContentLoaded', function() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        // Fetch the sidebar content from the central file
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(html => {
                // Inject the fetched HTML into the placeholder
                sidebarPlaceholder.innerHTML = html;
                
                // Now that the sidebar is in the DOM, we can add functionality
                setActiveLink();
                setupSubmenuToggles();
            })
            .catch(error => {
                console.error('Error fetching sidebar:', error);
                sidebarPlaceholder.innerHTML = '<p class="text-red-500 p-4">Error loading navigation.</p>';
            });
    }

    /**
     * Finds the current page's link in the navigation and applies the 'active' class.
     */
    function setActiveLink() {
        // Get the current page filename (e.g., "games.html")
        const currentPage = window.location.pathname.split('/').pop();

        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop();

            if (linkPage === currentPage) {
                link.classList.add('active');

                // If the active link is inside a submenu, also activate the parent
                const parentMenu = link.closest('[data-menu-item]');
                if (parentMenu) {
                    const parentLink = parentMenu.querySelector('.sidebar-link-main');
                    const submenu = parentMenu.querySelector('.submenu-container');
                    const icon = parentMenu.querySelector('.submenu-toggle i');
                    
                    if(parentLink) parentLink.classList.add('active');
                    if(submenu) submenu.classList.add('open');
                    if(icon) icon.classList.add('rotate-180');
                }
            }
        });
    }

    /**
     * Sets up the click listeners for the collapsible submenu toggles.
     */
    function setupSubmenuToggles() {
        const submenuToggles = document.querySelectorAll('.submenu-toggle');

        submenuToggles.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();

                const submenu = button.closest('.relative').querySelector('.submenu-container');
                const icon = button.querySelector('i');
                
                if (submenu) {
                    submenu.classList.toggle('open');
                    icon.classList.toggle('rotate-180');
                }
            });
        });
    }
});
