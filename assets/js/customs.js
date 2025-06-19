document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const selection = document.getElementById('selection');
    const wizard = document.getElementById('wizard');
    const manual = document.getElementById('manual');
    const aspectSelect = document.getElementById('aspect-select');
    const showAspectBtn = document.getElementById('show-aspect');
    const backBtns = document.querySelectorAll('.back-btn');

    // Function to hide all cultural aspect sections
    function hideAllAspects() {
        document.querySelectorAll('section[id^="initiation"], section[id^="marriage"], section[id^="attire"], section[id^="cuisine"], section[id^="festivals"], section[id^="arts"], section[id^="beliefs"], section[id^="governance"]').forEach(section => {
            section.style.display = 'none';
        });
    }

    // Start wizard
    document.getElementById('start-wizard').addEventListener('click', () => {
        selection.style.display = 'none';
        wizard.style.display = 'block';
    });

    // Show manual browser
    document.getElementById('show-manual').addEventListener('click', () => {
        selection.style.display = 'none';
        manual.style.display = 'block';
    });

    // Show selected aspect from wizard
    showAspectBtn.addEventListener('click', () => {
        const selectedAspect = aspectSelect.value;
        if (selectedAspect) {
            wizard.style.display = 'none';
            hideAllAspects();
            const aspectSection = document.getElementById(selectedAspect);
            if (aspectSection) {
                aspectSection.style.display = 'block';
                aspectSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Back to selection
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            hideAllAspects();
            wizard.style.display = 'none';
            manual.style.display = 'none';
            selection.style.display = 'block';
        });
    });

    // Manual browser link navigation
    document.querySelectorAll('#manual a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                manual.style.display = 'none';
                hideAllAspects();
                targetSection.style.display = 'block';
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});