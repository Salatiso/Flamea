// Global state for the case tracker
let currentCases =;
let selectedCaseType = '';
let currentCustomSteps =;

// Function to initialize the case tracker when its HTML is loaded
function initializeCaseTracker() {
    console.log('Case Tracker Initialized');
    loadCases(); // Load existing cases from localStorage
    updateOngoingCasesList();

    // Event listener for case type selection change
    document.getElementById('caseType').addEventListener('change', function() {
        const customFields = document.getElementById('customCaseFields');
        if (this.value === 'custom') {
            customFields.classList.remove('hidden');
        } else {
            customFields.classList.add('hidden');
        }
    });
}

// Helper to hide all tracker sections
function hideAllTrackerSections() {
    document.getElementById('caseTrackerDashboard').classList.add('hidden');
    document.getElementById('newCaseForm').classList.add('hidden');
    document.getElementById('processMap').classList.add('hidden');
    document.getElementById('customCaseDefinition').classList.add('hidden');
    document.getElementById('caseTrackerContainer').classList.add('hidden'); // Hide the main container
    document.getElementById('caseTrackerContainer').innerHTML = ''; // Clear content
}

// Show the dashboard and hide others
function showDashboard() {
    document.getElementById('caseTrackerDashboard').classList.remove('hidden');
    document.getElementById('newCaseForm').classList.add('hidden');
    document.getElementById('processMap').classList.add('hidden');
    document.getElementById('customCaseDefinition').classList.add('hidden');
    updateOngoingCasesList();
}

// Show the new case form and hide others
function startNewCase() {
    document.getElementById('caseTrackerDashboard').classList.add('hidden');
    document.getElementById('newCaseForm').classList.remove('hidden');
    document.getElementById('processMap').classList.add('hidden');
    document.getElementById('customCaseDefinition').classList.add('hidden');
    // Reset form fields
    document.getElementById('caseType').value = '';
    document.getElementById('customCaseFields').classList.add('hidden');
    document.getElementById('customCaseName').value = '';
    document.getElementById('customCaseDescription').value = '';
}

// Handle proceeding to process map or custom definition
function proceedToProcessMap() {
    selectedCaseType = document.getElementById('caseType').value;
    if (!selectedCaseType) {
        alert('Please select a case type.');
        return;
    }

    document.getElementById('newCaseForm').classList.add('hidden');

    if (selectedCaseType === 'custom') {
        const customName = document.getElementById('customCaseName').value;
        const customDescription = document.getElementById('customCaseDescription').value;
        if (!customName) {
            alert('Please enter a name for your custom case.');
            document.getElementById('newCaseForm').classList.remove('hidden'); // Show form again
            return;
        }
        document.getElementById('customCaseDefinition').classList.remove('hidden');
        document.getElementById('customCaseDefinitionTitle').textContent = customName;
        currentCustomSteps =; // Reset custom steps for new custom case
        document.getElementById('customStepsContainer').innerHTML = ''; // Clear previous custom steps
        addCustomStep(); // Add first empty step
    } else {
        document.getElementById('processMap').classList.remove('hidden');