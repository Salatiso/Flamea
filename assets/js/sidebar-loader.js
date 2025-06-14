/**
 * Flamea.org - Centralized Sidebar Loader (Final)
 * This script now controls the entire sidebar lifecycle.
 */
import { auth } from './firebase-config.js'; // Import the central auth instance
import { updateAuthUI } from './auth.js';   // Import the UI update function

document.addEventListener('DOMContentLoaded', function() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    if (sidebarPlaceholder) {
        fetch('sidebar.html')
            .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch sidebar.html: ${response.statusText}`);
                return response.text();
            })
            .then(html => {
                // Step 1: Inject the sidebar HTML into the page.
                sidebarPlaceholder.innerHTML = html;
                
                // Step 2: Now that the HTML exists, activate the navigation links.
                setActiveLink();
                
                // Step 3: Activate the interactive dropdown menus.
                setupSubmenuToggles();

                // Step 4 (FINAL & CRITICAL): Call the function from auth.js to populate the login/dashboard buttons.
                // We pass the current user state to it.
                updateAuthUI(auth.currentUser);
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
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
