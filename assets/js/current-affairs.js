document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('incident-form');
    const getLocationBtn = document.getElementById('get-location-btn');
    const locationStatus = document.getElementById('location-status');
    const successMsg = document.getElementById('report-success-msg');

    // Exit if the main form isn't on this page
    if (!form) {
        return;
    }

    let userLocation = null;

    // Handle location fetching
    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            locationStatus.textContent = "Fetching location...";
            locationStatus.classList.remove('text-red-400', 'text-green-400');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    locationStatus.textContent = `✅ Location captured: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`;
                    locationStatus.classList.add('text-green-400');
                }, () => {
                    locationStatus.textContent = "❌ Unable to retrieve location. Please check browser permissions.";
                    locationStatus.classList.add('text-red-400');
                });
            } else {
                locationStatus.textContent = "Geolocation is not supported by your browser.";
                locationStatus.classList.add('text-red-400');
            }
        });
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const report = {
            service: formData.get('service-type'),
            cause: formData.get('incident-cause'),
            description: formData.get('incident-description'),
            role: formData.get('user-role'),
            location: userLocation,
            timestamp: new Date().toISOString()
        };

        // In a real app, this would be sent to a backend.
        // For now, we simulate the effect on the UI.
        console.log("New Incident Report:", report);
        updateDashboard(report);

        // Show success message
        successMsg.textContent = `Thank you, ${report.role}! Your report has been logged. Ref: ${Date.now()}`;
        successMsg.classList.remove('hidden');
        form.reset();
        locationStatus.textContent = '';
        userLocation = null;
        setTimeout(() => successMsg.classList.add('hidden'), 5000);
    });

    // Update dashboard based on report
    function updateDashboard(report) {
        let statusDot, statusText;
        switch(report.service) {
            case 'electricity':
                statusDot = document.getElementById('electricity-status-dot');
                statusText = document.getElementById('electricity-status-text');
                break;
            case 'water':
                statusDot = document.getElementById('water-status-dot');
                statusText = document.getElementById('water-status-text');
                break;
             case 'traffic':
                statusDot = document.getElementById('traffic-status-dot');
                statusText = document.getElementById('traffic-status-text');
                break;
            default: return;
        }
        
        if(statusDot && statusText){
            // Change status to red to indicate an issue
            statusDot.style.backgroundColor = '#f87171'; // Red-400
            statusDot.style.setProperty('--status-color', '#f87171');
            statusText.textContent = `Community report of a(n) ${report.cause.replace('-', ' ')} in the area.`;
        }
    }
});
