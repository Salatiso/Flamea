// /assets/js/sidebar-loader.js
// This script fetches the sidebar.html file and injects it into any page that has a div with the id "sidebar-placeholder".
// This ensures the sidebar is consistent across all pages of the application.

document.addEventListener("DOMContentLoaded", function() {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');

    // Check if the placeholder element exists on the current page
    if (sidebarPlaceholder) {
        // Fetch the sidebar content
        fetch('sidebar.html')
            .then(response => {
                // Check if the file was found
                if (!response.ok) {
                    throw new Error('sidebar.html not found. Please check the file path.');
                }
                return response.text();
            })
            .then(data => {
                // Inject the sidebar HTML into the placeholder
                sidebarPlaceholder.innerHTML = data;
                console.log("Sidebar loaded successfully.");

                // **Fix for background image**: 
                // Your background image issue is likely a CSS path problem.
                // Ensure your main CSS file or the style tag in your HTML has the correct path.
                // Example for an inline style in your HTML <head>:
                // <style>
                //   body {
                //     background-image: url('assets/images/background.jpg');
                //     background-size: cover;
                //     background-attachment: fixed;
                //   }
                // </style>
                // Double-check that the image exists at 'assets/images/background.jpg'.
            })
            .catch(error => {
                console.error('Error loading sidebar:', error);
                // Display an error message inside the placeholder for easy debugging
                sidebarPlaceholder.innerHTML = `<div class="p-4 text-red-500 bg-red-100">Error: Sidebar could not be loaded. ${error.message}</div>`;
            });
    } else {
        // This is not an error, some pages like login might not have a sidebar
        console.log("No sidebar placeholder found on this page.");
    }
});
