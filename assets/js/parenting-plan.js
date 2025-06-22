// This script is a complete rewrite to address the functionality issues in the Parenting Plan Builder.
// It ensures proper data handling, dynamic element creation, and reliable Firebase interaction.

document.addEventListener('DOMContentLoaded', () => {
    // --- Firebase Initialization ---
    // This uses the main Flamea app configuration. It expects 'firebase.apps' to be populated by 'firebase-config.js'
    if (!firebase.apps.length) {
        console.error("Firebase is not initialized. Make sure firebase-config.js is loaded correctly.");
        return;
    }
    const auth = firebase.auth();
    const db = firebase.firestore();
    let userId = null; // To be set on auth state change

    // --- DOM Element References ---
    const savePlanBtn = document.getElementById('savePlanBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const addChildBtn = document.getElementById('addChildBtn');
    const childrenContainer = document.getElementById('children-container');
    
    const notificationModal = document.getElementById('notificationModal');
    const notificationMessage = document.getElementById('notificationMessage');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // --- Functions ---

    /**
     * Shows a notification message to the user.
     * @param {string} message The message to display.
     */
    function showNotification(message) {
        notificationMessage.textContent = message;
        notificationModal.style.display = 'block';
    }

    /**
     * Closes the notification modal.
     */
    closeModalBtn.onclick = function() {
        notificationModal.style.display = 'none';
    };

    /**
     * Adds a new set of input fields for a child.
     * @param {object} [childData] - Optional data to pre-fill the fields.
     */
    function addChild(childData = { name: '', dob: '' }) {
        const childId = `child-${Date.now()}`; // Unique ID for the new element
        const childDiv = document.createElement('div');
        childDiv.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded bg-gray-50';
        childDiv.id = childId;
        
        childDiv.innerHTML = `
            <input type="text" value="${childData.name}" data-field="name" class="w-full p-2 border rounded" placeholder="Child's Full Name">
            <input type="date" value="${childData.dob}" data-field="dob" class="w-full p-2 border rounded" placeholder="Date of Birth">
            <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg remove-child-btn">
                <i class="fas fa-trash-alt"></i> Remove
            </button>
        `;
        
        childrenContainer.appendChild(childDiv);
        
        // Add event listener to the new remove button
        childDiv.querySelector('.remove-child-btn').addEventListener('click', () => {
            document.getElementById(childId).remove();
        });
    }
    
    /**
     * Gathers all the data from the form fields into a single object.
     * @returns {object} The parenting plan data.
     */
    function getPlanData() {
        const children = [];
        document.querySelectorAll('#children-container > div').forEach(childDiv => {
            children.push({
                name: childDiv.querySelector('input[data-field="name"]').value,
                dob: childDiv.querySelector('input[data-field="dob"]').value,
            });
        });

        return {
            partyA: {
                title: document.getElementById('partyA-title').value,
                name: document.getElementById('partyA-name').value,
                idNumber: document.getElementById('partyA-id').value,
                address: document.getElementById('partyA-address').value,
                email: document.getElementById('partyA-email').value,
                phone: document.getElementById('partyA-phone').value,
            },
            partyB: {
                title: document.getElementById('partyB-title').value,
                name: document.getElementById('partyB-name').value,
                idNumber: document.getElementById('partyB-id').value,
                address: document.getElementById('partyB-address').value,
                email: document.getElementById('partyB-email').value,
                phone: document.getElementById('partyB-phone').value,
            },
            children: children,
            contactSchedule: document.getElementById('contact-schedule').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
    }
    
    /**
     * Loads the parenting plan data from Firestore and populates the form.
     */
    async function loadPlan() {
        if (!userId) {
            showNotification("You must be logged in to load a plan.");
            return;
        }
        try {
            const docRef = db.collection('parentingPlans').doc(userId);
            const doc = await docRef.get();

            if (doc.exists) {
                const data = doc.data();
                
                // Populate Parties
                document.getElementById('partyA-title').value = data.partyA?.title || '';
                document.getElementById('partyA-name').value = data.partyA?.name || '';
                document.getElementById('partyA-id').value = data.partyA?.idNumber || '';
                document.getElementById('partyA-address').value = data.partyA?.address || '';
                document.getElementById('partyA-email').value = data.partyA?.email || '';
                document.getElementById('partyA-phone').value = data.partyA?.phone || '';
                
                document.getElementById('partyB-title').value = data.partyB?.title || '';
                document.getElementById('partyB-name').value = data.partyB?.name || '';
                document.getElementById('partyB-id').value = data.partyB?.idNumber || '';
                document.getElementById('partyB-address').value = data.partyB?.address || '';
                document.getElementById('partyB-email').value = data.partyB?.email || '';
                document.getElementById('partyB-phone').value = data.partyB?.phone || '';
                
                // Populate Children
                childrenContainer.innerHTML = ''; // Clear existing fields
                if (data.children && Array.isArray(data.children)) {
                    data.children.forEach(child => addChild(child));
                }

                // Populate Schedule
                document.getElementById('contact-schedule').value = data.contactSchedule || '';

                showNotification("Plan loaded successfully.");
            } else {
                console.log("No existing plan found for this user. Starting fresh.");
            }
        } catch (error) {
            console.error("Error loading plan: ", error);
            showNotification("Error: Could not load your plan.");
        }
    }

    /**
     * Saves the current plan data to Firestore.
     */
    async function savePlan() {
        if (!userId) {
            showNotification("You must be logged in to save a plan.");
            return;
        }

        const planData = getPlanData();

        try {
            // Using .set() with { merge: true } will create the doc if it doesn't exist,
            // or update it if it does, without overwriting the entire document.
            await db.collection('parentingPlans').doc(userId).set(planData, { merge: true });
            showNotification("Plan saved successfully!");
        } catch (error) {
            console.error("Error saving plan: ", error);
            showNotification("Error: Could not save your plan.");
        }
    }
    
    /**
     * Downloads the current plan as a PDF.
     */
    function downloadPdf() {
        showNotification("Preparing PDF...");
        const { jsPDF } = window.jspdf;
        const planContent = document.getElementById('plan-content');

        html2canvas(planContent, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('parenting-plan.pdf');
            showNotification("PDF downloaded.");
        }).catch(err => {
            console.error("Error generating PDF:", err);
            showNotification("Failed to generate PDF.");
        });
    }

    // --- Event Listeners ---
    addChildBtn.addEventListener('click', () => addChild());
    savePlanBtn.addEventListener('click', savePlan);
    downloadPdfBtn.addEventListener('click', downloadPdf);
    
    // --- Authentication Observer ---
    auth.onAuthStateChanged(user => {
        if (user) {
            userId = user.uid;
            console.log("User is logged in:", userId);
            loadPlan(); // Automatically load the user's plan
        } else {
            userId = null;
            console.log("User is logged out.");
            // Optionally, clear the form or show a login prompt
            showNotification("Please log in to manage your parenting plan.");
        }
    });
});
