/**
 * Flamea.org - Community Page Features
 * This script handles all interactive elements on community.html, including:
 * - Countdown timer to the forum launch.
 * - Live polling system with Chart.js visualization.
 * - Advanced contact form with anonymous submission option.
 * It relies on the centrally initialized Firebase instance.
 */

// Import the single, correct Firebase instance and auth functions
import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, onSnapshot, collection, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // --- Page-Specific DOM Elements ---
    const countdownEl = document.getElementById('countdown');
    const pollOptionsContainer = document.getElementById('poll-options');
    const contactForm = document.getElementById('contact-form');

    // Check if we are on the community page by looking for a key element
    if (!countdownEl) {
        console.log("Not on community page, skipping feature initialization.");
        return;
    }

    // --- Global State for this page ---
    const appId = 'flamea-prod';
    let userId, pollChart;
    let pendingSubmission = null;

    // --- SECTION: INITIALIZATION ---
    function initializeCommunityFeatures(user) {
        if (!user || !db) return;
        userId = user.uid;
        initCountdown();
        initPoll();
        initContactForm();
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            initializeCommunityFeatures(user);
        } else {
            signInAnonymously(auth)
                .then(cred => initializeCommunityFeatures(cred.user))
                .catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });

    // --- SECTION: COUNTDOWN TIMER ---
    function initCountdown() {
        const countdownDate = new Date("2025-09-16T00:00:00").getTime();
        const msgEl = document.getElementById('countdown-message');
        
        const interval = setInterval(() => {
            const distance = countdownDate - new Date().getTime();
            if (distance < 0) {
                clearInterval(interval);
                if (countdownEl) countdownEl.classList.add('hidden');
                if (msgEl) msgEl.classList.remove('hidden');
                return;
            }
            document.getElementById('days').innerText = Math.floor(distance / 86400000).toString().padStart(2, '0');
            document.getElementById('hours').innerText = Math.floor((distance % 86400000) / 3600000).toString().padStart(2, '0');
            document.getElementById('minutes').innerText = Math.floor((distance % 3600000) / 60000).toString().padStart(2, '0');
            document.getElementById('seconds').innerText = Math.floor((distance % 60000) / 1000).toString().padStart(2, '0');
        }, 1000);
    }

    // --- SECTION: POLLING ---
    async function initPoll() {
        if (!pollOptionsContainer) return;
        const pollRef = doc(db, `artifacts/${appId}/public/data/poll`, "main_poll");
        
        const pollDoc = await getDoc(pollRef);
        if (!pollDoc.exists()) {
            // If the poll doesn't exist, create it.
            await setDoc(pollRef, {
                title: "First Discussion Topics",
                options: { "Navigating Co-Parenting": 0, "Understanding Family Law": 0, "Mental Health for Fathers": 0, "Financial Planning": 0 }
            }).catch(e => console.error("Failed to create initial poll:", e));
        }
        
        // Listen for real-time updates to the poll
        onSnapshot(pollRef, (doc) => {
            if(doc.exists()) {
                renderPoll(doc.data());
                renderChart(doc.data());
            }
        }, error => console.error("Poll snapshot error:", error));
    }
    
    async function renderPoll(pollData) {
        const container = document.getElementById('poll-options');
        container.innerHTML = '';
        const userVoteRef = doc(db, `artifacts/${appId}/public/data/poll/main_poll/voters`, userId);
        const userVoteDoc = await getDoc(userVoteRef);
        const userVote = userVoteDoc.exists() ? userVoteDoc.data().vote : null;

        for (const option in pollData.options) {
            const isSelected = userVote === option;
            const button = document.createElement('button');
            button.className = `w-full text-left p-3 rounded-lg border-2 transition-colors ${isSelected ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`;
            button.textContent = option;
            if (!userVote) {
                button.onclick = () => castVote(option);
            } else {
                button.disabled = true;
            }
            container.appendChild(button);
        }
        if (userVote) {
            document.getElementById('poll-status').textContent = `You voted for: ${userVote}.`;
        }
    }

    async function castVote(option) {
        const pollRef = doc(db, `artifacts/${appId}/public/data/poll`, "main_poll");
        const voterRef = doc(db, `artifacts/${appId}/public/data/poll/main_poll/voters`, userId);
        try {
            await runTransaction(db, async (transaction) => {
                if ((await transaction.get(voterRef)).exists()) { throw "User has already voted."; }
                const pollDoc = await transaction.get(pollRef);
                if (!pollDoc.exists()) { throw "Poll document does not exist!"; }
                const newVotes = (pollDoc.data().options[option] || 0) + 1;
                transaction.update(pollRef, { [`options.${option}`]: newVotes });
                transaction.set(voterRef, { vote: option, timestamp: serverTimestamp() });
            });
        } catch (e) {
            console.error("Vote transaction failed: ", e);
            document.getElementById('poll-status').textContent = typeof e === 'string' ? e : 'Error casting vote.';
        }
    }

    function renderChart(pollData) {
        const ctx = document.getElementById('poll-chart')?.getContext('2d');
        if (!ctx) return;
        
        const labels = Object.keys(pollData.options);
        const data = Object.values(pollData.options);
        
        if (pollChart) {
            pollChart.data.labels = labels;
            pollChart.data.datasets[0].data = data;
            pollChart.update();
        } else {
            pollChart = new Chart(ctx, {
                type: 'doughnut',
                data: { labels, datasets: [{ data, backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'], borderColor: '#111827', borderWidth: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { color: '#D1D5DB' } }, title: { display: true, text: 'Live Poll Results', color: '#F9FAFB' } } }
            });
        }
    }
    
    // --- SECTION: ADVANCED CONTACT FORM ---
    function initContactForm() {
        if (!contactForm) return;

        const categorySelect = document.getElementById('contact-category');
        const otherCategoryWrapper = document.getElementById('other-category-wrapper');
        const anonymousCheckbox = document.getElementById('anonymous-checkbox');
        const personalInfoFields = document.getElementById('personal-info-fields');

        categorySelect.addEventListener('change', () => {
            otherCategoryWrapper.classList.toggle('hidden', categorySelect.value !== 'other');
        });

        anonymousCheckbox.addEventListener('change', () => {
            const isAnonymous = anonymousCheckbox.checked;
            personalInfoFields.classList.toggle('hidden', isAnonymous);
            document.getElementById('contact-name').required = !isAnonymous;
            document.getElementById('contact-email').required = !isAnonymous;
        });
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            let category = categorySelect.value;
            if (category === 'other') {
                category = document.getElementById('other-category-input').value.trim() || 'Other';
            }

            pendingSubmission = {
                category,
                message: document.getElementById('contact-message').value,
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                whatsapp: document.getElementById('contact-whatsapp').value,
                isAnonymous: anonymousCheckbox.checked,
            };
            
            document.getElementById('confirmation-modal').classList.add('active');
        });

        // Modal button listeners
        document.getElementById('cancel-btn').onclick = () => {
            document.getElementById('confirmation-modal').classList.remove('active');
            pendingSubmission = null;
        };
        document.getElementById('confirm-send-btn').onclick = () => {
            if (pendingSubmission) {
                pendingSubmission.isAnonymous = false;
                submitFormData(pendingSubmission);
            }
        };
        document.getElementById('confirm-anonymous-btn').onclick = () => {
            if (pendingSubmission) {
                pendingSubmission.isAnonymous = true;
                submitFormData(pendingSubmission);
            }
        };
    }

    async function submitFormData(data) {
        const statusEl = document.getElementById('form-status');
        statusEl.textContent = 'Sending...';
        document.getElementById('confirmation-modal').classList.remove('active');

        let submissionData = {
            category: data.category,
            message: data.message,
            submittedAt: serverTimestamp(),
            userId: userId,
            isAnonymous: data.isAnonymous,
        };

        if (!data.isAnonymous) {
            submissionData.name = data.name;
            submissionData.email = data.email;
            if (data.whatsapp) submissionData.whatsapp = data.whatsapp;
        }

        try {
            await addDoc(collection(db, `artifacts/${appId}/public/data/contacts`), submissionData);
            statusEl.textContent = 'Message sent successfully!';
            statusEl.className = 'text-center mt-4 h-6 text-green-500';
            contactForm.reset();
            document.getElementById('other-category-wrapper').classList.add('hidden');
            document.getElementById('personal-info-fields').classList.remove('hidden');
        } catch (error) {
            console.error("Error sending message:", error);
            statusEl.textContent = 'Failed to send message.';
            statusEl.className = 'text-center mt-4 h-6 text-red-500';
        } finally {
            pendingSubmission = null;
            setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 6000);
        }
    }
});
