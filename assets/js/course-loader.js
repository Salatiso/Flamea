// assets/js/course-loader.js
document.addEventListener('DOMContentLoaded', () => {
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        // Use a root-relative path to fetch the sidebar
        fetch('/training/training-sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok. Status: ' + response.status);
                }
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                // Re-run the accordion script from the loaded sidebar content
                const scriptEl = sidebarPlaceholder.querySelector('script');
                if (scriptEl) {
                    // Using eval() is acceptable here as we control the source script.
                    eval(scriptEl.innerHTML); 
                }
            })
            .catch(error => {
                console.error('Error fetching training sidebar:', error);
                sidebarPlaceholder.innerHTML = '<div class="p-4 text-red-500">Error: Could not load navigation.</div>';
            });
    }

    const courseContentPlaceholder = document.getElementById('course-content-placeholder');
    const sourceContent = document.getElementById('course-content-source');
    if (courseContentPlaceholder && sourceContent) {
        courseContentPlaceholder.innerHTML = sourceContent.innerHTML;
        // Clean up the source element to avoid duplicate IDs
        sourceContent.remove(); 
        
        // If the loaded content has its own script, execute it
        const contentScript = courseContentPlaceholder.querySelector('script');
        if (contentScript) {
             eval(contentScript.innerHTML);
        }
    }
});