/**
 * Flamea.org - Centralized Sidebar Loader
 * Fetches, injects, and enhances the sidebar navigation.
 * - Dynamically sets the 'active' class on links.
 * - Manages all collapsible submenus.
 */
document.addEventListener('DOMContentLoaded', function() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                // Once sidebar is loaded, activate its features
                setActiveLink();
                setupSubmenuToggles();
            })
            .catch(error => {
                console.error('Error fetching sidebar:', error);
                sidebarPlaceholder.innerHTML = '<p class="text-red-500 p-4">Error loading navigation.</p>';
            });
    }

    function setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#main-nav a, .sidebar-bottom a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href')?.split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
                const parentMenu = link.closest('[data-menu-item]');
                if (parentMenu) {
                    parentMenu.querySelector('.sidebar-link-main')?.classList.add('active');
                    parentMenu.querySelector('.submenu-container')?.classList.add('open');
                    parentMenu.querySelector('.submenu-toggle i.fa-chevron-down')?.classList.add('rotate-180');
                }
            }
        });
    }

    function setupSubmenuToggles() {
        // This now handles ALL submenu toggles, including the new one
        const submenuToggles = document.querySelectorAll('.submenu-toggle');
        submenuToggles.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();

                const parentContainer = button.closest('[data-menu-item]') || button.closest('div');
                const submenu = parentContainer.querySelector('.submenu-container');
                const icon = button.querySelector('i.fa-chevron-down');
                
                if (submenu) {
                    submenu.classList.toggle('open');
                    icon?.classList.toggle('rotate-180');
                }
            });
        });
    }
});
