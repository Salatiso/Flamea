// --- INITIAL STATE & CONFIGURATION ---

// Stores all data for the parenting plan
const planData = {
    parents: { A: 'Parent A', B: 'Parent B' },
    children: [],
    contributions: {
        financial: [],
        duties: [],
        benefits: []
    },
    docRef: ''
};

// Default items for each contribution category
const defaultItems = {
    financial: [
        { name: "Groceries & Food", budget: 1500, actual: 0 },
        { name: "Nappies & Toiletries", budget: 400, actual: 0 },
        { name: "Clothing & Shoes", budget: 300, actual: 0 },
        { name: "Medical Aid Premium", budget: 500, actual: 0 },
        { name: "School Fees / Daycare", budget: 1000, actual: 0 },
    ],
    duties: [ // "Budget" is planned hours/week, "Actual" is actual hours/week
        { name: "School Drop-off & Pick-up", budget: 10, actual: 0 },
        { name: "Preparing Meals", budget: 7, actual: 0 },
        { name: "Assisting with Homework", budget: 5, actual: 0 },
        { name: "Bathtime & Bedtime Routine", budget: 7, actual: 0 },
        { name: "Household Chores for Child", budget: 4, actual: 0 },
    ],
    benefits: [ // "Budget" is planned hours/week of contact
        { name: "Weekday Contact Time", budget: 20, actual: 0 },
        { name: "Weekend Contact Time", budget: 24, actual: 0 },
        { name: "Holiday Contact Time", budget: 10, actual: 0 },
        { name: "Special Occasions (Birthdays)", budget: 4, actual: 0 },
    ],
};

// --- DOM ELEMENT SELECTORS ---
const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
let currentStep = 0;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the builder state
    initializeChildFields();
    initializeContributionTables();
    initializeNavigation();
    updateStepUI();
    
    // Generate the initial document reference number
    generateDocRef();
    document.getElementById('doc-ref-display').textContent = planData.docRef;
});


// --- CORE FUNCTIONS ---

/**
 * Sets up the step-by-step navigation logic
 */
function initializeNavigation() {
    nextBtn.addEventListener('click', () => {
        if (gatherAndValidateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStepUI();
                if (currentStep === steps.length - 1) { // When on the final step
                    updateLivePreview();
                }
            }
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStepUI();
        }
    });
    
    const declarationCheckbox = document.getElementById('declaration');
    const finalizeBtn = document.getElementById('finalize-btn');
    declarationCheckbox.addEventListener('change', () => {
        finalizeBtn.disabled = !declarationCheckbox.checked;
    });
}

/**
 * Initializes the contribution tables for all three categories
 */
function initializeContributionTables() {
    const categories = [
        { id: 'financial-category', key: 'financial', title: 'Financial Contributions', unit: 'ZAR', unitLabel: 'Amount' },
        { id: 'duties-category', key: 'duties', title: 'Time & Duties', unit: 'Hrs/Wk', unitLabel: 'Hours/Week' },
        { id: 'benefits-category', key: 'benefits', title: 'Benefits (Time with Child)', unit: 'Hrs/Wk', unitLabel: 'Hours/Week' }
    ];

    categories.forEach(cat => {
        const container = document.getElementById(cat.id);
        planData.contributions[cat.key] = [...defaultItems[cat.key]]; // Deep copy defaults
        renderCategorySection(container, cat.key, cat.title, cat.unit, cat.unitLabel);
    });
    updateAllSummaries();
}

/**
 * Renders a full category section (header, table, add new item form)
 */
function renderCategorySection(container, key, title, unit, unitLabel) {
    // Update parent names for headers
    const parentAName = planData.parents.A;
    const parentBName = planData.parents.B;
    
    container.innerHTML = `
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <h3 class="text-xl font-bold mb-4 text-gray-800">${title}</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead class="bg-gray-200">
                        <tr>
                            <th class="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Item</th>
                            <th class="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Budgeted ${unitLabel}</th>
                            <th class="p-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider" colspan="3">Responsibility Split</th>
                            <th class="p-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actual ${unitLabel}</th>
                            <th class="p-1"></th>
                        </tr>
                        <tr class="bg-gray-200">
                            <th class="p-2"></th><th class="p-2"></th>
                            <th class="p-1 text-center text-xs font-medium text-gray-500">${parentAName}</th>
                            <th class="p-1"></th>
                            <th class="p-1 text-center text-xs font-medium text-gray-500">${parentBName}</th>
                            <th class="p-2"></th><th class="p-1"></th>
                        </tr>
                    </thead>
                    <tbody id="${key}-tbody" class="bg-white divide-y divide-gray-200">
                        <!-- Rows are injected by renderAllRows -->
                    </tbody>
                </table>
            </div>
            <div class="mt-4 flex gap-2">
                <input type="text" id="add-${key}-item-input" placeholder="Add custom item..." class="flex-grow p-2 border rounded-md">
                <button id="add-${key}-item-btn" data-key="${key}" class="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 text-sm">Add Item</button>
            </div>
        </div>`;

    renderAllRows(key);

    // Add event listener for the 'Add Item' button
    document.getElementById(`add-${key}-item-btn`).addEventListener('click', (e) => {
        const input = document.getElementById(`add-${key}-item-input`);
        const itemName = input.value.trim();
        if (itemName) {
            planData.contributions[key].push({ name: itemName, budget: 0, actual: 0 });
            renderAllRows(key);
            input.value = ''; // Clear input
            updateAllSummaries();
        }
    });
}

/**
 * Renders all rows for a specific category table from the planData object
 */
function renderAllRows(key) {
    const tbody = document.getElementById(`${key}-tbody`);
    tbody.innerHTML = ''; // Clear existing rows
    planData.contributions[key].forEach((item, index) => {
        const row = createTableRow(key, item, index);
        tbody.appendChild(row);
    });
}


/**
 * Creates a single table row (TR element) for a contribution item
 */
function createTableRow(key, item, index) {
    // Set default split if not present
    if (item.split === undefined) item.split = 50;

    const row = document.createElement('tr');
    row.className = 'item-row';
    row.dataset.key = key;
    row.dataset.index = index;

    row.innerHTML = `
        <td class="p-2"><input type="text" value="${item.name}" class="w-full bg-transparent focus:bg-white p-1 rounded-md border-transparent focus:border-gray-300" data-field="name"></td>
        <td class="p-2"><input type="number" value="${item.budget}" class="w-24 bg-transparent focus:bg-white p-1 rounded-md border-transparent focus:border-gray-300" data-field="budget" min="0"></td>
        <td class="p-2 w-20"><input type="number" value="${item.split}" class="w-full text-center font-bold text-blue-700 p-1 rounded-md border border-gray-300 split-input" data-parent="A" min="0" max="100"></td>
        <td class="p-2 w-48"><input type="range" value="${item.split}" class="w-full split-slider" min="0" max="100"></td>
        <td class="p-2 w-20"><input type="number" value="${100 - item.split}" class="w-full text-center font-bold text-green-700 p-1 rounded-md border border-gray-300 split-input" data-parent="B" min="0" max="100"></td>
        <td class="p-2"><input type="number" value="${item.actual}" class="w-24 bg-gray-100 focus:bg-white p-1 rounded-md border-transparent focus:border-gray-300" data-field="actual" min="0"></td>
        <td class="p-1 text-center">
            <button class="text-red-500 hover:text-red-700 remove-item-btn"><i class="fas fa-trash-alt"></i></button>
        </td>
    `;
    
    // --- Event Listeners for the new row ---
    row.querySelector('.split-slider').addEventListener('input', handleSliderChange);
    row.querySelectorAll('.split-input').forEach(input => input.addEventListener('input', handleInputChange));
    row.querySelector('.remove-item-btn').addEventListener('click', handleRemoveItem);
    row.querySelectorAll('input[data-field]').forEach(input => input.addEventListener('change', handleFieldChange));

    return row;
}

/**
 * Updates the UI for the current step (visibility, buttons, progress bar)
 */
function updateStepUI() {
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
    });
    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === steps.length - 1 ? 'Finish' : 'Next';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-flex';
    
    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;
}


// --- DATA HANDLING & VALIDATION ---

/**
 * Gathers and validates data from the current step before proceeding
 */
function gatherAndValidateStep(stepIndex) {
    if (stepIndex === 0) { // Step 1: Parties & Children
        const parentAName = document.getElementById('parentA_name').value.trim();
        const parentBName = document.getElementById('parentB_name').value.trim();
        if (!parentAName || !parentBName) {
            alert('Please enter names for both parents.');
            return false;
        }
        planData.parents.A = parentAName;
        planData.parents.B = parentBName;

        // Re-render headers in contribution tables with new names
        if (currentStep === 2) { // Only if we are on the contributions step
             initializeContributionTables();
        }
    }
    // Add validation for other steps as needed
    return true;
}

/**
 * Generates a document reference number based on user info and date
 * Format: IN_SURNAME-DOCTYPE-V##-SEQ##-MMYY
 */
function generateDocRef() {
    // In a real app, user initials and surname would come from auth profile.
    // Using placeholders for now.
    const initials = "SLM";
    const surname = "Mdeni";
    const docType = "PP"; // Parenting Plan
    const version = "01";
    const sequence = "01"; // This would need to be tracked per user in Firestore
    
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    planData.docRef = `${initials}${surname}-${docType}-V${version}${sequence}${month}${year}`;
}


// --- EVENT HANDLERS ---

function handleSliderChange(e) {
    const slider = e.target;
    const row = slider.closest('.item-row');
    const value = parseInt(slider.value, 10);
    
    const inputA = row.querySelector('.split-input[data-parent="A"]');
    const inputB = row.querySelector('.split-input[data-parent="B"]');
    
    inputA.value = value;
    inputB.value = 100 - value;

    updateItemData(row.dataset.key, row.dataset.index, 'split', value);
}

function handleInputChange(e) {
    const input = e.target;
    const row = input.closest('.item-row');
    let value = parseInt(input.value, 10) || 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    
    const isParentA = input.dataset.parent === 'A';
    const otherInput = row.querySelector(`.split-input[data-parent="${isParentA ? 'B' : 'A'}"]`);
    const slider = row.querySelector('.split-slider');

    const splitValue = isParentA ? value : 100 - value;
    
    input.value = value;
    otherInput.value = 100 - value;
    slider.value = splitValue;

    updateItemData(row.dataset.key, row.dataset.index, 'split', splitValue);
}

function handleFieldChange(e) {
    const input = e.target;
    const row = input.closest('.item-row');
    const field = input.dataset.field;
    const value = (field === 'name') ? input.value : parseFloat(input.value) || 0;
    
    updateItemData(row.dataset.key, row.dataset.index, field, value);
}

function handleRemoveItem(e) {
    const row = e.target.closest('.item-row');
    const { key, index } = row.dataset;
    
    planData.contributions[key].splice(index, 1);
    renderAllRows(key); // Re-render the table for that category
    updateAllSummaries();
}

/**
 * Updates a specific field for an item in the main planData object and recalculates summary
 */
function updateItemData(key, index, field, value) {
    if (planData.contributions[key] && planData.contributions[key][index]) {
        planData.contributions[key][index][field] = value;
        updateAllSummaries();
    }
}


// --- SUMMARY & PREVIEW ---

/**
 * Updates all summary sections (financial, duties, benefits)
 */
function updateAllSummaries() {
    const summaryContainer = document.getElementById('summary-output');
    
    const finSummary = calculateSummary('financial');
    const dutySummary = calculateSummary('duties');
    const benSummary = calculateSummary('benefits');

    summaryContainer.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div class="bg-white p-3 rounded-md shadow">
                <p class="text-sm text-gray-500">Financial Total (Budgeted)</p>
                <p class="text-lg font-bold">R ${finSummary.totalBudget.toFixed(2)}</p>
                <p class="text-xs">${planData.parents.A}: R ${finSummary.parentABudget.toFixed(2)} | ${planData.parents.B}: R ${finSummary.parentBBudget.toFixed(2)}</p>
            </div>
            <div class="bg-white p-3 rounded-md shadow">
                <p class="text-sm text-gray-500">Duties Total (Budgeted)</p>
                <p class="text-lg font-bold">${dutySummary.totalBudget.toFixed(1)} Hrs/Wk</p>
                <p class="text-xs">${planData.parents.A}: ${dutySummary.parentABudget.toFixed(1)} Hrs | ${planData.parents.B}: ${dutySummary.parentBBudget.toFixed(1)} Hrs</p>
            </div>
             <div class="bg-white p-3 rounded-md shadow">
                <p class="text-sm text-gray-500">Time with Child (Benefit)</p>
                <p class="text-lg font-bold">${benSummary.totalBudget.toFixed(1)} Hrs/Wk</p>
                <p class="text-xs">${planData.parents.A}: ${benSummary.parentABudget.toFixed(1)} Hrs | ${planData.parents.B}: ${benSummary.parentBBudget.toFixed(1)} Hrs</p>
            </div>
        </div>
    `;
}

/**
 * Calculates the total budget and split for a given category
 */
function calculateSummary(key) {
    let totalBudget = 0, parentABudget = 0, parentBBudget = 0;
    planData.contributions[key].forEach(item => {
        totalBudget += item.budget;
        parentABudget += item.budget * (item.split / 100);
        parentBBudget += item.budget * ((100 - item.split) / 100);
    });
    return { totalBudget, parentABudget, parentBBudget };
}

/**
 * Populates the live preview pane with data from the planData object
 */
function updateLivePreview() {
    const previewContainer = document.getElementById('live-preview');
    // This is a simplified preview. We will use the full Markdown template later.
    let previewHTML = `
        <h1 class="text-xl font-bold mb-4">Parenting Plan Summary</h1>
        <p><strong>Document Ref:</strong> ${planData.docRef}</p>
        <h2 class="text-lg font-semibold mt-4">Parties</h2>
        <p><strong>Parent A:</strong> ${planData.parents.A}</p>
        <p><strong>Parent B:</strong> ${planData.parents.B}</p>
        <h2 class="text-lg font-semibold mt-4">Financial Summary</h2>
        <ul>
            ${planData.contributions.financial.map(item => `<li>${item.name}: ${item.split}% for ${planData.parents.A}, ${100-item.split}% for ${planData.parents.B}</li>`).join('')}
        </ul>
    `;
    previewContainer.innerHTML = previewHTML;
}


// --- UTILITY FUNCTIONS ---

/**
 * Initializes the child fields section, adding one by default.
 */
function initializeChildFields() {
    const container = document.getElementById('children-container');
    const addBtn = document.getElementById('add-child-btn');

    const addChild = () => {
        const index = container.children.length;
        const childDiv = document.createElement('div');
        childDiv.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4 first:mt-0 first:border-t-0 first:pt-0';
        childDiv.innerHTML = `
            <div>
                <label class="block text-sm font-medium text-gray-700">Child ${index + 1} Full Name</label>
                <input type="text" data-child-index="${index}" data-field="name" placeholder="Full Legal Name" class="mt-1 w-full p-2 border border-gray-300 rounded-md">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Child ${index + 1} Date of Birth</label>
                <input type="date" data-child-index="${index}" data-field="dob" class="mt-1 w-full p-2 border border-gray-300 rounded-md">
            </div>
        `;
        container.appendChild(childDiv);
    };

    addBtn.addEventListener('click', addChild);
    addChild(); // Add one child by default
}

