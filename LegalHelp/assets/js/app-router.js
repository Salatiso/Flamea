// This is the central router for the Single Page Application.
// It handles navigation by swapping content in and out of the main app shell.

// Import page-specific initialization functions from their modules
import { initForms } from './modules/forms-module.js';
import { initLocator } from './modules/locator-module.js';
import { initCaseTracker } from './modules/casetracker-module.js';
import { initSlider, initChatbot, initLanguageSwitcher, initTranslation } from './modules/ui-module.js';
import { checkAuthState } from './modules/auth-module.js';

// --- Application State & Configuration ---
const app = {
    // The main container where all dynamic page content will be rendered
    root: document.getElementById('app-root'),
    // A map defining the routes, their corresponding <template> IDs, and initialization scripts
    routes: {
        '/': { templateId: 'template-home', init: initSlider, title: 'LegalHelp South Africa - The Law, Demystified' },
        '/forms': { templateId: 'template-forms', init: initForms, title: 'LegalHelp - Forms & Documents Hub' },
        '/resources': { templateId: 'template-resources', init: initLocator, title: 'LegalHelp - Resource Compass' },
        '/community': { templateId: 'template-community', init: null, title: 'LegalHelp - Community Hub' },
        '/case-tracker': { templateId: 'template-case-tracker', init: initCaseTracker, title: 'LegalHelp - Case Tracker' },
        '/join': { templateId: 'template-join', init: null, title: 'LegalHelp - Join the Movement' }
    },
    // The default route to render if the URL hash is invalid or empty
    defaultRoute: { templateId: 'template-home', init: initSlider, title: 'LegalHelp South Africa' }
};

/**
 * Parses the current URL hash to determine which "page" to show.
 * @returns {string} The requested route path (e.g., '/', '/forms').
 */
function getRoutePath() {
    return location.hash.slice(1).toLowerCase() || '/';
}

/**

 * Finds the matching route configuration object from the app state.
 * @param {string} path - The route path to find.
 * @returns {object} The route configuration object.
 */
function findRouteConfig(path) {
    return app.routes[path] || app.defaultRoute;
}

/**
 * Renders the content of a given route into the app's root element.
 * @param {object} routeConfig - The configuration object for the route to render.
 */
async function renderContent(routeConfig) {
    // Get the HTML content from the corresponding <template> tag in index.html
    const template = document.getElementById(routeConfig.templateId);
    if (template) {
        // Clear old content and insert the new content
        app.root.innerHTML = template.innerHTML;
        document.title = routeConfig.title; // Update the browser tab title

        // Run the page-specific initialization script if it exists
        if (routeConfig.init) {
            await routeConfig.init();
        }
        // Always re-run the translation for any new content
        await initTranslation();
    } else {
        // If the template is not found, show a 404 error message
        console.error(`Template with ID ${routeConfig.templateId} not found.`);
        app.root.innerHTML = '<div class="text-center p-20 pt-40"><h1 class="text-4xl font-bold">Page Not Found</h1><a href="#/" class="text-indigo-400 hover:underline mt-4 inline-block">Return Home</a></div>';
        document.title = 'Page Not Found';
    }
}

/**
 * The main router function that orchestrates the navigation.
 */
function router() {
    const path = getRoutePath();
    const activeRoute = findRouteConfig(path);
    renderContent(activeRoute);
    updateNavLinks(path);
}

/**
 * Updates the 'active' class on navigation links to reflect the current page.
 * @param {string} currentPath - The current route path.
 */
function updateNavLinks(currentPath) {
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).hash.slice(1).toLowerCase() || '/';
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Event Listeners & Initial Page Load ---

// Trigger the router whenever the URL hash changes
window.addEventListener('hashchange', router);

// Setup the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize site-wide components that are always present on the page shell
    checkAuthState(); // Checks if a user is logged in and updates the header
    initChatbot();    // Sets up the floating chatbot button
    initLanguageSwitcher(); // Sets up the language dropdown

    // Perform the initial routing based on the URL the user arrived at
    router();
});
