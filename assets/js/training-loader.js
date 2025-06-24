/**
 * Flamea.org - Training Page Loader
 * Version 4: Embedded Sidebar
 * Description:
 * This script bypasses server issues by embedding the sidebar HTML directly.
 * - Injects the sidebar HTML into the page without fetching a file.
 * - Handles the accordion functionality within the loaded sidebar.
 * - Initializes the animated particle background.
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. EMBEDDED SIDEBAR HTML ---
    // The HTML for the sidebar is now stored here as a string.
    // This avoids the 404 Not Found error from trying to fetch the file.
    const sidebarHTML = `
        <div class="p-6">
            <h2 class="text-2xl font-semibold text-white">Training Modules</h2>
            <p class="mt-2 text-sm text-gray-400">Navigate your learning journey.</p>
        </div>
        <nav class="mt-4">
            <!-- This path correctly goes up one level from /training/ to the root -->
            <a href="../training.html" class="flex items-center px-6 py-3 text-gray-200 hover:bg-gray-700">
                <span class="mx-3">Training Home</span>
            </a>

            <!-- Fathers Category -->
            <div>
                <button onclick="toggleAccordion('fathers')" class="flex items-center justify-between w-full px-6 py-3 text-gray-200 hover:bg-gray-700 focus:outline-none">
                    <span class="mx-3 font-semibold">For Fathers</span>
                    <svg id="fathers-arrow" class="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="fathers" class="hidden pl-8">
                    <!-- These paths are relative to the /training/ folder, so they are correct -->
                    <a href="course-childrens-act.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Children's Act</a>
                    <a href="course-family-law.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Family Law</a>
                    <a href="course-coparenting.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Co-Parenting</a>
                    <a href="course-newborn-daily-care.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Newborn Daily Care</a>
                    <a href="course-build-curriculum.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Build a Curriculum</a>
                    <a href="course-extended-family.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Extended Family</a>
                    <a href="course-fathers-shield.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Father's Shield</a>
                    <a href="course-risk-management.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Risk Management</a>
                    <a href="course-constitution.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Constitution</a>
                </div>
            </div>

            <!-- Khulu Category -->
            <div>
                <button onclick="toggleAccordion('khulu')" class="flex items-center justify-between w-full px-6 py-3 text-gray-200 hover:bg-gray-700 focus:outline-none">
                    <span class="mx-3 font-semibold">For Khulu</span>
                    <svg id="khulu-arrow" class="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="khulu" class="hidden pl-8">
                    <a href="course-ancestors-within.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Ancestors Within</a>
                    <a href="course-unbroken-chain.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Unbroken Chain</a>
                    <a href="courses_khulu-the_constitution_your_ultimate_shield.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Constitution Shield</a>
                    <a href="course-khulu-senior-crusaders.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Senior Crusaders</a>
                </div>
            </div>

            <!-- Kids Category -->
            <div>
                <button onclick="toggleAccordion('kids')" class="flex items-center justify-between w-full px-6 py-3 text-gray-200 hover:bg-gray-700 focus:outline-none">
                    <span class="mx-3 font-semibold">For Kids</span>
                    <svg id="kids-arrow" class="w-4 h-4 transform transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="kids" class="hidden pl-8">
                    <a href="course_kids-rights_shield.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Rights Shield</a>
                    <a href="course-kids-big_rule_book.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Big Rule Book</a>
                    <a href="course-kids-whos_in_charge.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Who's In Charge?</a>
                    <a href="course-kids-great_family_homestead.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">Great Family Homestead</a>
                    <a href="course-kids-the_best_nest.html" class="block py-2 px-4 text-sm text-gray-300 hover:bg-gray-600">The Best Nest</a>
                </div>
            </div>

            <a href="../games.html" class="flex items-center px-6 py-3 mt-4 text-gray-200 hover:bg-gray-700">
                <span class="mx-3 font-semibold">Interactive Games</span>
            </a>
        </nav>
    `;

    const sidebarPlaceholder = document.getElementById('training-sidebar-placeholder');
    if (sidebarPlaceholder) {
        // Inject the HTML directly into the placeholder
        sidebarPlaceholder.innerHTML = sidebarHTML;
        // The accordion logic can now be initialized
        initializeSidebarAccordion();
    }

    // --- 2. ACCORDION LOGIC ---
    function initializeSidebarAccordion() {
        sidebarPlaceholder.addEventListener('click', function(event) {
            const button = event.target.closest('button[onclick^="toggleAccordion"]');
            if (button) {
                event.preventDefault();
                const sectionId = button.getAttribute('onclick').match(/'([^']+)'/)[1];
                toggleAccordion(sectionId);
            }
        });
    }

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
