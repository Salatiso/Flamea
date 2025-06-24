/**
 * Flamea.org - Training Page Loader
 * Description:
 * This script is specifically for the individual training course pages.
 * - Dynamically loads the training sidebar.
 * - Handles the accordion functionality within the loaded sidebar.
 * - Initializes the animated particle background.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SIDEBAR LOADER ---
    const sidebarPlaceholder = document.getElementById('training-sidebar-placeholder');
    if (sidebarPlaceholder) {
        // Fetch the sidebar from the correct relative path.
        // The course pages are in /training/, so we go up one level to find training-sidebar.html
        fetch('../training-sidebar.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(html => {
                sidebarPlaceholder.innerHTML = html;
                // Now that the sidebar is loaded, we can make the accordion work.
                initializeSidebarAccordion();
            })
            .catch(error => {
                console.error('Error fetching training sidebar:', error);
                if(sidebarPlaceholder) {
                    sidebarPlaceholder.innerHTML = '<div class="p-4 text-red-500">Could not load navigation.</div>';
                }
            });
    }

    // --- 2. ACCORDION LOGIC ---
    // This function is called *after* the sidebar has been loaded.
    function initializeSidebarAccordion() {
        // We use event delegation on the placeholder.
        sidebarPlaceholder.addEventListener('click', function(event) {
            const button = event.target.closest('button[onclick^="toggleAccordion"]');
            if (button) {
                // Extract the sectionId from the onclick attribute
                const sectionId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
                toggleAccordion(sectionId);
            }
        });
    }

    // Global function for the accordion toggle, as it's called from the HTML string.
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
