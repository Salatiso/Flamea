/**
 * Flamea.org - Community Page Features
 * This script handles all interactive elements on community.html, including:
 * - Countdown timer to the forum launch.
 * - Live polling system with Chart.js visualization.
 */

import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { doc, getDoc, setDoc, onSnapshot, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return; // Only run on the community page

    const appId = 'flamea-prod-poll'; // Use a specific identifier
    let userId;
    let pollChart;

    function initializeFeatures(user) {
        if (!user) return;
        userId = user.uid;
        initCountdown();
        initPoll();
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            initializeFeatures(user);
        } else {
            signInAnonymously(auth)
                .then(cred => initializeFeatures(cred.user))
                .catch(error => console.error("Anonymous sign-in failed:", error));
        }
    });

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

    async function initPoll() {
        const pollRef = doc(db, `artifacts/${appId}/public/data/poll`, "main_poll");
        
        try {
            const pollDoc = await getDoc(pollRef);
            if (!pollDoc.exists()) {
                await setDoc(pollRef, {
                    title: "First Discussion Topics",
                    options: { "Navigating Co-Parenting": 0, "Understanding Family Law": 0, "Mental Health for Fathers": 0, "Financial Planning": 0 }
                });
            }
        } catch (e) {
            console.error("Failed to create or get initial poll:", e);
        }
        
        onSnapshot(pollRef, (doc) => {
            if(doc.exists()) {
                renderPoll(doc.data());
                renderChart(doc.data());
            }
        }, error => console.error("Poll snapshot error:", error));
    }
    
    async function renderPoll(pollData) {
        const container = document.getElementById('poll-options');
        if (!container) return;
        container.innerHTML = '';
        const userVoteRef = doc(db, `artifacts/${appId}/public/data/poll/main_poll/voters`, userId);
        const userVoteDoc = await getDoc(userVoteRef);
        const userHasVoted = userVoteDoc.exists();
        const userVote = userHasVoted ? userVoteDoc.data().vote : null;

        for (const option in pollData.options) {
            const isSelected = userVote === option;
            const button = document.createElement('button');
            button.className = `w-full text-left p-3 rounded-lg border-2 transition-colors text-sm ${isSelected ? 'bg-blue-600 border-blue-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'} ${userHasVoted ? 'cursor-not-allowed opacity-70' : ''}`;
            button.textContent = option;
            if (!userHasVoted) {
                button.onclick = () => castVote(option);
            }
            button.disabled = userHasVoted;
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
                const voterDoc = await transaction.get(voterRef);
                if (voterDoc.exists()) { throw "User has already voted."; }
                
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
                data: { labels, datasets: [{ data, backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'], borderColor: '#1f2937', borderWidth: 4 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, title: { display: false } } }
            });
        }
    }
});
