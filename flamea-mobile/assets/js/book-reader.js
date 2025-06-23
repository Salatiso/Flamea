// /flamea-mobile/assets/js/book-reader.js

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('reader-main');
    const header = document.getElementById('reader-header');
    const footer = document.getElementById('reader-footer');
    const fileUpload = document.getElementById('file-upload');

    // --- Toggle UI visibility ---
    if (mainContent && header && footer) {
        mainContent.addEventListener('click', (e) => {
            // Prevent toggling if text is selected
            if (window.getSelection().toString()) {
                return;
            }
            // Prevent toggling if a link inside the content is clicked
            if (e.target.tagName === 'A') {
                return;
            }
            header.classList.toggle('controls-hidden');
            footer.classList.toggle('controls-hidden');
        });
    }

    // --- File Upload Logic ---
    if (fileUpload) {
        fileUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                // Check for file type (optional but recommended)
                if (file.type === "text/plain") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target.result;
                        // For simplicity, we'll replace the main content.
                        // A more advanced version could store this in localStorage or a database.
                        mainContent.innerHTML = `<p>${content.replace(/\n/g, '</p><p>')}</p>`;
                        document.querySelector('#reader-header h1').textContent = file.name;
                    };
                    reader.readAsText(file);
                } else {
                    alert("Please upload a plain text (.txt) file.");
                }
            }
        });
    }
});
