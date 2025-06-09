import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";
import { auth, db, storage } from './firebase-config.js';

let currentUser = null;
let userProfileData = {}; // Global store for user's profile data

// --- Main Auth Listener ---
onAuthStateChanged(auth, user => {
    const loadingDiv = document.getElementById('loading-state');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginPrompt = document.getElementById('dashboard-login-prompt');

    if (user) {
        currentUser = user;
        dashboardContainer.classList.remove('hidden');
        loginPrompt.classList.add('hidden');
        loadingDiv.style.display = 'none';
        
        document.getElementById('dashboard-welcome').textContent = `Welcome, ${user.displayName || user.email}`;
        
        fetchAllUserData(user.uid);
        setupEventListeners();
    } else {
        currentUser = null;
        dashboardContainer.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
        loadingDiv.style.display = 'none';
    }
});


// --- Data Fetching ---
async function fetchAllUserData(userId) {
    await fetchProfileData(userId);
    await fetchCourseProgress(userId);
    // Add functions to fetch parenting plans, dispute logs etc. here
}

async function fetchProfileData(userId) {
    const docRef = doc(db, "users", userId, "profile", "main");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        userProfileData = docSnap.data();
    } else {
        // Create a default profile if one doesn't exist
        userProfileData = {
            name: currentUser.displayName || '',
            summary: 'A dedicated father committed to growth and excellence.',
            workExperience: [],
            links: {
                linkedin: '',
                coursera: ''
            }
        };
    }
    renderProfileData();
}

async function fetchCourseProgress(userId) {
    const certificatesGrid = document.getElementById('certificates-grid');
    const badgesSection = document.getElementById('badges-section');
    try {
        const q = query(collection(db, "users", userId, "progress"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            certificatesGrid.innerHTML = '<p class="text-gray-400 col-span-full">No certificates earned yet.</p>';
            badgesSection.innerHTML = '<p class="text-gray-400">No badges earned yet.</p>';
        } else {
            let certsHtml = '';
            let badges = new Set();
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                certsHtml += createCertificateCard(data);
                if (data.certLevel === 'Superdad Certificate') {
                    badges.add('Superdad');
                }
            });
            certificatesGrid.innerHTML = certsHtml;
            renderBadges(Array.from(badges));
        }
    } catch (error) {
        console.error("Error fetching course progress: ", error);
        certificatesGrid.innerHTML = '<p class="text-red-500 col-span-full">Error loading certificates.</p>';
    }
}


// --- Data Rendering ---
function renderProfileData() {
    document.getElementById('profile-summary').textContent = userProfileData.summary || 'No summary provided.';
    renderWorkExperience();
    renderExternalLinks();
}

function renderWorkExperience() {
    const section = document.getElementById('work-experience-section');
    if (userProfileData.workExperience && userProfileData.workExperience.length > 0) {
        let html = '';
        userProfileData.workExperience.forEach(job => {
            html += `
                <div class="border-l-4 border-gray-700 pl-4 py-2">
                    <h4 class="font-bold text-lg text-white">${job.Title || 'N/A'} at ${job.Company || 'N/A'}</h4>
                    <p class="text-sm text-gray-400">${job.Dates || 'N/A'}</p>
                    <p class="text-sm mt-1">${job.Description || ''}</p>
                </div>
            `;
        });
        section.innerHTML = html;
    } else {
        section.innerHTML = '<p>No work experience uploaded. Click "Upload CV" to add your professional history.</p>';
    }
}

function renderExternalLinks() {
    const section = document.getElementById('external-links-section');
    const { links } = userProfileData;
    let html = '';
    if (links?.linkedin) {
        html += `<div><a href="${links.linkedin}" target="_blank" class="hover:text-green-400"><i class="fab fa-linkedin mr-2"></i> LinkedIn Profile</a></div>`;
    }
    if (links?.coursera) {
        html += `<div><a href="${links.coursera}" target="_blank" class="hover:text-green-400"><i class="fas fa-graduation-cap mr-2"></i> Coursera Profile</a></div>`;
    }
    section.innerHTML = html || '<p>No external links added. Click "Edit Profile" to add them.</p>';
}

function renderBadges(badges) {
    const section = document.getElementById('badges-section');
    if (badges.length > 0) {
        let html = '';
        badges.forEach(badge => {
            if (badge === 'Superdad') {
                html += `
                    <div class="text-center">
                        <div class="bg-yellow-500 text-white rounded-full h-20 w-20 flex items-center justify-center text-3xl shadow-lg">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <p class="text-sm mt-2 font-bold">Superdad</p>
                    </div>
                `;
            }
        });
        section.innerHTML = html;
    } else {
        section.innerHTML = '<p class="text-gray-400">Complete all 3 modules of a course to earn a Superdad badge!</p>';
    }
}


function createCertificateCard(data) {
    const { courseTitle, certLevel, certDate, certificateId } = data;
    const colors = { 'Basic Achievement': 'border-green-500', 'Advanced Certificate': 'border-blue-500', 'Superdad Certificate': 'border-yellow-500' };
    const borderColor = colors[certLevel] || 'border-gray-500';

    return `
        <div class="cert-card bg-gray-900 p-6 rounded-lg border-l-4 ${borderColor} shadow-lg">
            <div class="flex items-center mb-3"><i class="fas fa-award text-2xl text-yellow-400 mr-4"></i><h4 class="text-xl font-bold text-white">${courseTitle}</h4></div>
            <p class="text-gray-300">Level: <span class="font-semibold text-white">${certLevel}</span></p>
            <p class="text-gray-400 text-sm">Earned on: ${certDate}</p>
            <p class="text-gray-500 text-xs mt-2 truncate">ID: ${certificateId}</p>
        </div>
    `;
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const tab = button.dataset.tab;
            tabContents.forEach(content => {
                content.id === tab ? content.classList.add('active') : content.classList.remove('active');
            });
        });
    });

    // Modals
    const editProfileModal = document.getElementById('edit-profile-modal');
    const uploadCvModal = document.getElementById('upload-cv-modal');
    const exportModal = document.getElementById('export-modal');

    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        document.getElementById('profile-name').value = userProfileData.name || currentUser.displayName;
        document.getElementById('profile-summary-input').value = userProfileData.summary || '';
        document.getElementById('profile-linkedin').value = userProfileData.links?.linkedin || '';
        document.getElementById('profile-coursera').value = userProfileData.links?.coursera || '';
        editProfileModal.classList.add('active');
    });
    document.getElementById('upload-cv-btn').addEventListener('click', () => uploadCvModal.classList.add('active'));
    document.getElementById('export-profile-btn').addEventListener('click', () => exportModal.classList.add('active'));
    
    document.getElementById('cancel-edit-btn').addEventListener('click', () => editProfileModal.classList.remove('active'));
    document.getElementById('cancel-upload-btn').addEventListener('click', () => uploadCvModal.classList.remove('active'));
    document.getElementById('cancel-export-btn').addEventListener('click', () => exportModal.classList.remove('active'));

    // Forms
    document.getElementById('profile-form').addEventListener('submit', handleProfileSave);
    document.getElementById('cv-upload-form').addEventListener('submit', handleCVUpload);
    document.getElementById('generate-export-btn').addEventListener('click', handleExport);
}

// --- Form Handlers & Logic ---
async function handleProfileSave(e) {
    e.preventDefault();
    const newProfileData = {
        name: document.getElementById('profile-name').value,
        summary: document.getElementById('profile-summary-input').value,
        links: {
            linkedin: document.getElementById('profile-linkedin').value,
            coursera: document.getElementById('profile-coursera').value
        },
        workExperience: userProfileData.workExperience || []
    };
    
    const docRef = doc(db, "users", currentUser.uid, "profile", "main");
    try {
        await setDoc(docRef, newProfileData, { merge: true });
        userProfileData = newProfileData;
        renderProfileData();
        document.getElementById('edit-profile-modal').classList.remove('active');
        alert('Profile saved successfully!');
    } catch (error) {
        console.error("Error saving profile: ", error);
        alert('Error saving profile. Please try again.');
    }
}

async function handleCVUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('cv-file-input');
    const file = fileInput.files[0];
    const statusDiv = document.getElementById('upload-status');

    if (!file) {
        statusDiv.textContent = 'Please select a file.';
        return;
    }
    
    statusDiv.textContent = 'Uploading...';
    // Upload to Firebase Storage first (optional, but good practice)
    const storageRef = ref(storage, `cvs/${currentUser.uid}/${file.name}`);
    await uploadBytes(storageRef, file);
    
    // Now parse the file content
    const reader = new FileReader();
    reader.onload = async function(event) {
        const text = event.target.result;
        const experience = parseCSV(text);
        if (experience.length > 0) {
            userProfileData.workExperience = experience;
            await handleProfileSave(e); // Save the updated profile with new experience
            statusDiv.textContent = 'CV parsed and experience updated!';
            setTimeout(() => document.getElementById('upload-cv-modal').classList.remove('active'), 2000);
        } else {
             statusDiv.textContent = 'Could not parse CSV. Please ensure it has "Title", "Company", "Dates" columns.';
        }
    };
    reader.readAsText(file);
}

function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const experience = [];
    
    // Find column indices for robust parsing
    const titleIndex = headers.indexOf('Title');
    const companyIndex = headers.indexOf('Company Name');
    const datesIndex = headers.indexOf('Dates Employed');
    const descIndex = headers.indexOf('Description');

    if (titleIndex === -1 || companyIndex === -1) return []; // Essential columns missing

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i]) continue;
        const data = lines[i].split(',');
        experience.push({
            Title: data[titleIndex]?.trim().replace(/"/g, ''),
            Company: data[companyIndex]?.trim().replace(/"/g, ''),
            Dates: data[datesIndex]?.trim().replace(/"/g, ''),
            Description: data[descIndex]?.trim().replace(/"/g, '')
        });
    }
    return experience;
}

async function handleExport() {
    const content = await generateExportHtml();
    const email = document.getElementById('export-email').value;

    if (email) {
        // Using mailto link for client-side emailing
        const subject = `${userProfileData.name}'s Life CV from Flamea.org`;
        const body = `Please find the attached Life CV.\n\n${content.innerText}`; // Simple text version for email body
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
        // Download as PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.html(content, {
            callback: function (doc) {
                doc.save(`${userProfileData.name}_Life_CV.pdf`);
            },
            x: 10, y: 10, width: 190, windowWidth: 800
        });
    }
     document.getElementById('export-modal').classList.remove('active');
}

function generateExportHtml() {
    // This function creates a hidden div with the selected content,
    // which can then be used by jsPDF or for emailing.
    const selectedSections = Array.from(document.querySelectorAll('#export-options input:checked')).map(cb => cb.dataset.section);
    
    const exportContainer = document.createElement('div');
    exportContainer.style.padding = '20px';
    exportContainer.style.fontFamily = 'sans-serif';
    exportContainer.style.color = 'black';

    let html = `<h1>Life CV: ${userProfileData.name}</h1>`;
    
    if (selectedSections.includes('summary')) {
        html += `<h2>Professional Summary</h2><p>${userProfileData.summary}</p>`;
    }
    if (selectedSections.includes('experience') && userProfileData.workExperience.length > 0) {
        html += `<h2>Work Experience</h2>`;
        userProfileData.workExperience.forEach(job => {
            html += `<div style="margin-bottom: 15px;"><h4><b>${job.Title}</b> at ${job.Company}</h4><p><i>${job.Dates}</i></p><p>${job.Description}</p></div>`;
        });
    }
    if (selectedSections.includes('links')) {
         html += `<h2>External Profiles</h2><p>LinkedIn: ${userProfileData.links.linkedin || 'N/A'}</p><p>Coursera: ${userProfileData.links.coursera || 'N/A'}</p>`;
    }
     if (selectedSections.includes('achievements')) {
         // This part needs to query the certificates grid. For simplicity, we'll just add a title.
         html += `<h2>FLAMEA Achievements</h2><p>User has completed multiple training modules on Flamea.org, demonstrating a commitment to personal and parental growth. Full certificate list available on profile.</p>`;
    }

    exportContainer.innerHTML = html;
    return exportContainer;
}
