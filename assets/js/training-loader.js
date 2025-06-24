/**
 * Flamea.org - Training Page Loader
 * Version 3: Simplified Pathing
 * Description:
 * This script is specifically for the individual training course pages.
 * - Dynamically loads the training sidebar using a simple relative path.
 * - Handles the accordion functionality within the loaded sidebar.
 * - Initializes the animated particle background.
 *
 * NOTE: This script relies on the `training-sidebar.html` file being correctly
 * published by GitHub Pages. If you still get a 404 error after updating
 * your repository, please ensure you have configured your `_config.yml` file.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SIDEBAR LOADER ---
    const sidebarPlaceholder = document.getElementById('training-sidebar-placeholder');
    if (sidebarPlaceholder) {
        // Use a simple relative path. From a page inside the /training/ directory,
        // this correctly points to the root directory where the sidebar file lives.
        const sidebarUrl = '../training-sidebar.html';

        fetch(sidebarUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}. Failed to load ${sidebarUrl}. Please check your repository's GitHub Pages configuration (_config.yml).`);
                }
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                initializeSidebarAccordion();
            })
            .catch(error => {
                console.error('Error fetching training sidebar:', error);
                if(sidebarPlaceholder) {
                    sidebarPlaceholder.innerHTML = `<div class="p-4 text-red-500"><strong>Error:</strong> Could not load navigation. ${error.message}</div>`;
                }
            });
    }

    // --- 2. ACCORDION LOGIC ---
    // This function is called *after* the sidebar has been loaded.
    function initializeSidebarAccordion() {
        // We use event delegation on the placeholder to handle clicks.
        sidebarPlaceholder.addEventListener('click', function(event) {
            const button = event.target.closest('button[onclick^="toggleAccordion"]');
            if (button) {
                event.preventDefault(); // Prevent any default button action
                // Extract the sectionId from the onclick attribute
                const sectionId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
                toggleAccordion(sectionId);
            }
        });
    }

    // This remains a global function because it's called by the `onclick` in the loaded HTML.
    window.toggleAccordion = function(sectionId) {
        const section = document.getElementById(sectionId);
        const arrow = document.getElementById(sectionId + '-arrow');
        if (section && arrow) {
            section.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        }
    };
    
    // --- 3. BACKGROUND ANIMATION ---
    const canvas = document.getElementById('background-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', () => {
            resizeCanvas();
            init();
        });

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY;
                this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particles = [];
            let numberOfParticles = (canvas.height * canvas.width) / 12000;
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(139, 144, 150, 0.2)';
                particles.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, innerWidth, innerHeight);
            for (let p of particles) { p.update(); }
            connect();
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let distance = Math.sqrt(
                        ((particles[a].x - particles[b].x) ** 2) +
                        ((particles[a].y - particles[b].y) ** 2)
                    );
                    if (distance < (innerWidth / 9)) {
                        opacityValue = 1 - (distance / 150);
                        ctx.strokeStyle = `rgba(100, 116, 139, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[b].y);
                        ctx.lineTo(particles[b].x, particles[a].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        resizeCanvas();
        init();
        animate();
    }
});
