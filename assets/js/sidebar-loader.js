/**
 * Flamea.org - Sidebar Loader
 * Fetches sidebar.html and injects it into the #sidebar-placeholder div.
 * It also sets the 'active' class on the link corresponding to the current page.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Find the placeholder element for the sidebar
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    
    // If the placeholder doesn't exist on the page, do nothing.
    if (!sidebarPlaceholder) {
        console.log('No sidebar placeholder found on this page.');
        return;
    }

    // Fetch the sidebar's HTML content
    fetch('sidebar.html')
        .then(response => {
            // Check if the file was successfully fetched
            if (!response.ok) {
                throw new Error('Network response was not ok. Could not load sidebar.html');
            }
            return response.text();
        })
        .then(data => {
            // Inject the sidebar HTML into the placeholder
            sidebarPlaceholder.innerHTML = data;

            // After the sidebar is loaded, activate the correct link
            setActiveLink();

            // Also, initialize submenu functionality for the newly added sidebar
            initializeSubmenus();
        })
        .catch(error => {
            console.error('Error fetching or loading sidebar:', error);
            // Display an error message inside the placeholder if loading fails
            sidebarPlaceholder.innerHTML = '<p class="text-red-400 p-4">Error: Could not load navigation sidebar.</p>';
        });

    /**
     * Finds the current page's link in the sidebar and applies the 'active' class.
     */
    function setActiveLink() {
        // Get the current page's file name (e.g., "about.html")
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        
        // Find all navigation links within the newly loaded sidebar
        const navLinks = document.querySelectorAll('#main-nav a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split("/").pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
                
                // If the active link is inside a submenu, open that submenu
                const parentSubmenu = link.closest('.submenu-container');
                if (parentSubmenu) {
                    parentSubmenu.style.display = 'block'; // Make it visible
                    // Also, mark the parent toggle as active/open
                    const parentToggle = parentSubmenu.previousElementSibling.querySelector('.submenu-toggle');
                    if (parentToggle) {
                         parentToggle.querySelector('i').classList.add('rotate-180');
                    }
                }
            }
        });
    }

    /**
     * Adds event listeners to all submenu toggles within the sidebar.
     */
    function initializeSubmenus() {
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(button => {
            const submenu = button.closest('[data-menu-item]').querySelector('.submenu-container');
            if(submenu) {
                button.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent other click events from firing
                    const icon = button.querySelector('i');
                    const isVisible = submenu.style.display === 'block';
                    
                    submenu.style.display = isVisible ? 'none' : 'block';
                    if(icon) {
                       icon.classList.toggle('rotate-180', !isVisible);
                    }
                });
            }
        });
    }
});
