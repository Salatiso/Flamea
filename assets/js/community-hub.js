document.addEventListener('DOMContentLoaded', () => {

    // --- COUNTDOWN TIMER ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const launchDate = new Date("2025-09-16T00:00:00").getTime();
        const countdownMessage = document.getElementById('countdown-message');

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = launchDate - now;

            if (distance < 0) {
                countdownElement.innerHTML = "<p class='text-2xl font-bold text-green-400'>The Forum is Live!</p>";
                if(countdownMessage) countdownMessage.classList.remove('hidden');
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- POLLING WIDGET ---
    const pollQuestionTitle = document.getElementById('poll-question-title');
    const pollOptionsDropdown = document.getElementById('poll-options-dropdown');
    const submitVoteBtn = document.getElementById('submit-vote-btn');
    const pollStatusEl = document.getElementById('poll-status');
    const weeklyChartCanvas = document.getElementById('weekly-poll-chart');
    const overallChartCanvas = document.getElementById('overall-poll-chart');

    if (pollQuestionTitle) {
        const pollDatabase = [
            // Week 1
            { id: 'q1', week: 1, question: "Is the Children's Act applied fairly to both parents in your experience?", options: ['Yes, completely fair', 'Mostly fair, some bias', 'Often biased against fathers', 'Completely biased', 'Not enough experience'] },
            { id: 'q2', week: 1, question: "What's the biggest barrier for fathers enforcing their rights?", options: ['Financial Cost', 'Court System Bias', 'Lack of Knowledge', 'Obstruction from other parent', 'Social Pressure'] },
            { id: 'q3', week: 1, question: "Does the Equality Act effectively address challenges faced by men?", options: ['Yes, very effective', 'It helps, but has gaps', 'Largely ignores men\'s issues', 'It is counter-productive', 'Unsure of its effects'] },
            { id: 'q4', week: 1, question: "Should there be specific legal aid for fathers' rights issues?", options: ['Yes, urgently', 'Yes, it would be helpful', 'Maybe, not a priority', 'No, existing services are fine'] },
            { id: 'q5', week: 1, question: "How effective is the Domestic Violence Act in protecting male victims?", options: ['Very effective', 'Somewhat effective', 'Ineffective', 'Unaware of protections'] },
            { id: 'q6', week: 1, question: "Who pays more in total taxes (Income, VAT etc.)?", options: ['Men pay significantly more', 'Men pay slightly more', 'Roughly equal', 'Women pay slightly more', 'Women pay significantly more'] },
            { id: 'q7', week: 1, question: "Who benefits more from government social spending?", options: ['Men benefit more', 'Benefit is equal', 'Women and children benefit more'] },
            { id: 'q8', week: 1, question: "Have BEE/AA policies positively or negatively impacted your career?", options: ['Very Positive', 'Slightly Positive', 'No Impact', 'Slightly Negative', 'Very Negative'] },
            // Week 2
            { id: 'q9', week: 2, question: "What's the primary cause of high crime rates in SA?", options: ['Poverty & Unemployment', 'Breakdown of Family', 'Ineffective Policing', 'Corruption', 'Substance Abuse'] },
            { id: 'q10', week: 2, question: "Most important role a father plays in a son's life?", options: ['Provider', 'Disciplinarian', 'Emotional Support', 'Role Model'] },
            { id: 'q11', week: 2, question: "Most important role a father plays in a daughter's life?", options: ['Protector', 'Setting a Standard', 'Building Self-Esteem', 'Financial Security'] },
            { id: 'q12', week: 2, question: "Is Lobola still relevant and fair in modern society?", options: ['Yes, it\'s a vital tradition', 'Needs to adapt', 'It\'s outdated & commercialized', 'It is fundamentally unfair'] },
            { id: 'q13', week: 2, question: "Biggest challenge for boys in SA today?", options: ['Lack of Role Models', 'Toxic Masculinity Pressure', 'Limited Opportunities', 'Exposure to Violence'] },
            { id: 'q14', week: 2, question: "Are men encouraged to be open about mental health?", options: ['Yes, very supported', 'It\'s getting better', 'Still significant stigma', 'No, it\'s seen as weakness'] },
            { id: 'q15', week: 2, question: "Do you feel your identity as a man is valued by media?", options: ['Yes, very much', 'Mostly, yes', 'Often stereotyped', 'Rarely, usually negative'] },
            { id: 'q16', week: 2, question: "Is traditional masculinity more helpful or harmful today?", options: ['Mostly helpful', 'A mix of both', 'Mostly harmful', 'Completely outdated'] },
            // Week 3
            { id: 'q17', week: 3, question: "Have formal schools delivered on quality education?", options: ['Yes, they are excellent', 'Mostly, but with issues', 'Failing in key areas', 'Largely failed'] },
            { id: 'q18', week: 3, question: "What is the biggest failure of the public education system?", options: ['Lack of Discipline', 'Outdated Curriculum', 'Overcrowded Classrooms', 'Poor Teacher Quality', 'Lack of Resources'] },
            { id: 'q19', week: 3, question: "Have public health institutions met your family's needs?", options: ['Yes, always', 'Most of the time', 'Sometimes, with long waits', 'Rarely, service is poor'] },
            { id: 'q20', week: 3, question: "Does your local municipality deliver basic services effectively?", options: ['Yes, consistently', 'Unreliable', 'Poorly, frequent failures', 'Not at all'] },
            { id: 'q21', week: 3, question: "Most urgent issue for your municipality to address?", options: ['Potholes/Roads', 'Water/Electricity Supply', 'Crime/Safety', 'Waste Management', 'Billing Issues'] },
            { id: 'q22', week: 3, question: "Should homeschooling be more actively supported by government?", options: ['Yes, a superior alternative', 'Yes, a well-supported option', 'It should remain a niche choice', 'No, it undermines public schools'] },
            { id: 'q23', week: 3, question: "Are you confident in SAPS to keep your community safe?", options: ['Very confident', 'Somewhat confident', 'Not very confident', 'Not at all confident'] },
            { id: 'q24', week: 3, question: "Is your tax money used effectively for public services?", options: ['Yes, I see the results', 'To some extent', 'Not really, too much waste', 'No, it\'s completely wasted'] },
            // Week 4
            { id: 'q25', week: 4, question: "As a father, what causes you the most stress?", options: ['Financial Pressure', 'Co-parenting issues', 'Worry for children\'s future', 'Work-life balance', 'Personal health'] },
            { id: 'q26', week: 4, question: "Where do you turn for support when facing challenges?", options: ['My Partner', 'My Male Friends', 'My Family', 'A Professional', 'I handle it alone'] },
            { id: 'q27', week: 4, question: "Most important quality for a man to have?", options: ['Integrity', 'Resilience', 'Compassion', 'Ambition', 'Strength'] },
            { id: 'q28', week: 4, question: "Is it a man's primary duty to be the main financial provider?", options: ['Yes, a core responsibility', 'Ideal, but not essential', 'No, it should be a partnership', 'No, it\'s an outdated idea'] },
            { id: 'q29', week: 4, question: "How important is a father's involvement in daily childcare?", options: ['Absolutely essential', 'Very important', 'Helpful, not essential', 'Primarily the mother\'s role'] },
            { id: 'q30', week: 4, question: "Best way to resolve co-parenting conflicts?", options: ['Direct, calm conversation', 'Through a mediator', 'Via text/email', 'Through family members', 'We struggle to resolve conflicts'] },
            { id: 'q31', week: 4, question: "Do you have a strong support network of other fathers?", options: ['Yes, a very strong one', 'A few friends I can talk to', 'Not really, but I wish I did', 'No, I don\'t'] },
            { id: 'q32', week: 4, question: "Greatest gift a father can give his children?", options: ['Financial Security', 'His Time & Attention', 'A Strong Moral Compass', 'A Good Education', 'Unconditional Love'] },
            // Week 5
            { id: 'q33', week: 5, question: "Most critical life skill modern boys are NOT being taught?", options: ['Financial Literacy', 'Emotional Intelligence', 'Practical Skills (DIY)', 'Respectful Communication', 'Critical Thinking'] },
            { id: 'q34', week: 5, question: "How to address the 'boy crisis' (dropout/suicide rates)?", options: ['More Mentorship Programs', 'Education Reform for Boys', 'Promote Positive Masculinity', 'Better Mental Health Support'] },
            { id: 'q35', week: 5, question: "Is it a father's duty to teach his son about his culture?", options: ['Yes, his primary duty', 'A shared duty', 'Important, but not a duty', 'Less important than other skills'] },
            { id: 'q36', week: 5, question: "At what age should a boy be considered a man?", options: ['After cultural initiation', 'When he turns 18/21', 'When financially independent', 'When he becomes a father', 'It\'s a gradual process'] },
            { id: 'q37', week: 5, question: "Is social media a net positive or negative for family relationships?", options: ['Mostly Positive', 'Balanced', 'Mostly Negative', 'Very Negative'] },
            { id: 'q38', week: 5, question: "Do you trust information from major SA news outlets?", options: ['Yes, completely', 'For the most part', 'I\'m skeptical', 'No, not at all'] },
            { id: 'q39', week: 5, question: "What is the biggest factor holding back SA's progress?", options: ['Corruption', 'Failing Education System', 'Crime', 'Unemployment', 'Citizen Apathy'] },
            { id: 'q40', week: 5, question: "How do you feel about the future of South Africa for your children?", options: ['Very Optimistic', 'Cautiously Optimistic', 'Uncertain', 'Cautiously Pessimistic', 'Very Pessimistic'] },
            // Week 6
            { id: 'q41', week: 6, question: "Is land expropriation without compensation a necessary step?", options: ['Yes, for historical redress', 'Maybe, but must be done carefully', 'A dangerous policy', 'Fundamentally unjust'] },
            { id: 'q42', week: 6, question: "Which service delivery failure affects your daily life most?", options: ['Loadshedding', 'Water Issues', 'Poor Roads', 'Inadequate Policing', 'Inefficient Public Transport'] },
            { id: 'q43', week: 6, question: "Is a 'basic income grant' a viable solution for poverty?", options: ['Yes, a necessary safety net', 'Could work with conditions', 'No, creates dependency', 'No, the country can\'t afford it'] },
            { id: 'q44', week: 6, question: "Is the level of immigration into SA a major concern?", options: ['A primary concern', 'A moderate concern', 'A minor concern', 'Not a concern'] },
            { id: 'q45', week: 6, question: "What should be the nation's TOP priority?", options: ['Creating Jobs', 'Fighting Crime & Corruption', 'Fixing Education', 'Stable Power & Water'] },
            { id: 'q46', week: 6, question: "Who holds the primary responsibility for a child's discipline?", options: ['The Father', 'The Mother', 'Both Parents Equally', 'The School System', 'The Community'] },
            { id: 'q47', week: 6, question: "Are the courts doing enough to enforce maintenance orders?", options: ['Yes, they are effective', 'They try, but are overwhelmed', 'No, there is little enforcement', 'I have no experience with this'] },
            { id: 'q48', week: 6, question: "Overall, is it harder to be a boy or a girl in SA today?", options: ['Much harder for boys', 'Slightly harder for boys', 'Equally challenging for both', 'Slightly harder for girls', 'Much harder for girls'] },
        ];

        let weeklyChart;
        let overallChart;
        
        const getWeekNumber = (d) => {
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        };

        const currentWeek = getWeekNumber(new Date());
        const pollCycleWeek = (currentWeek % 6) + 1; // Cycle through weeks 1-6
        const currentPolls = pollDatabase.filter(p => p.week === pollCycleWeek);
        
        let currentPollIndex = 0;
        let currentPoll = currentPolls[currentPollIndex];

        const loadPoll = (poll) => {
            pollQuestionTitle.textContent = poll.question;
            pollOptionsDropdown.innerHTML = '<option value="">Select your answer...</option>';
            poll.options.forEach(opt => {
                const optionEl = document.createElement('option');
                optionEl.value = opt;
                optionEl.textContent = opt;
                pollOptionsDropdown.appendChild(optionEl);
            });
            updateChart(poll.id, weeklyChartCanvas, 'doughnut', 'Weekly Results');
            submitVoteBtn.disabled = true;
            submitVoteBtn.textContent = 'Select an option to vote';
        };

        const updateChart = (pollId, canvas, type, title) => {
            // Simplified for demonstration. Will be replaced by Firebase logic.
            const allVotes = JSON.parse(localStorage.getItem('flameaAllPolls') || '{}');
            const pollResults = allVotes[pollId] || {};
            const pollDefinition = pollDatabase.find(p => p.id === pollId);
            
            const labels = pollDefinition.options;
            const data = labels.map(label => pollResults[label] || 0);
            
            const chartData = {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1', '#f97316', '#84cc16'],
                    borderColor: '#0f172a',
                    borderWidth: 2
                }]
            };

            if (canvas.id === 'weekly-poll-chart') {
                if (weeklyChart) weeklyChart.destroy();
                weeklyChart = new Chart(canvas, {
                    type,
                    data: chartData,
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, title: { display: false } }
                    }
                });
            }
        };

        const updateOverallChart = () => {
             const allVotes = JSON.parse(localStorage.getItem('flameaAllPolls') || '{}');
             const cumulativeTotals = {};
             for (const pollId in allVotes) {
                 for (const option in allVotes[pollId]) {
                    // Using a simplified topic mapping for demonstration
                    let topic = pollDatabase.find(p => p.id === pollId).question.substring(0, 20) + "...";
                    if (!cumulativeTotals[topic]) cumulativeTotals[topic] = 0;
                    cumulativeTotals[topic] += allVotes[pollId][option];
                 }
             }

             const sortedTopics = Object.entries(cumulativeTotals).sort(([,a],[,b]) => b-a).slice(0,2);
             const labels = sortedTopics.map(item => item[0]);
             const data = sortedTopics.map(item => item[1]);

             if(overallChart) overallChart.destroy();
             overallChart = new Chart(overallChartCanvas, {
                 type: 'bar',
                 data: {
                     labels: labels,
                     datasets: [{
                         label: 'Total Votes',
                         data: data,
                         backgroundColor: ['#10b981', '#3b82f6'],
                     }]
                 },
                 options: {
                     indexAxis: 'y',
                     responsive: true,
                     maintainAspectRatio: false,
                     plugins: { legend: { display: false } },
                     scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } }
                 }
             });
        };

        pollOptionsDropdown.addEventListener('change', () => {
            if (pollOptionsDropdown.value !== "") {
                submitVoteBtn.disabled = false;
                submitVoteBtn.textContent = 'Submit Vote';
            } else {
                 submitVoteBtn.disabled = true;
                 submitVoteBtn.textContent = 'Select an option to vote';
            }
        });

        submitVoteBtn.addEventListener('click', () => {
            const selectedOption = pollOptionsDropdown.value;
            if (!selectedOption) return;

            const pollId = currentPoll.id;
            const allVotes = JSON.parse(localStorage.getItem('flameaAllPolls') || '{}');
            if (!allVotes[pollId]) allVotes[pollId] = {};
            if (!allVotes[pollId][selectedOption]) allVotes[pollId][selectedOption] = 0;
            
            allVotes[pollId][selectedOption]++;
            localStorage.setItem('flameaAllPolls', JSON.stringify(allVotes));

            pollStatusEl.textContent = 'Thank you for voting!';
            setTimeout(() => {
                pollStatusEl.textContent = '';
                currentPollIndex = (currentPollIndex + 1) % currentPolls.length;
                currentPoll = currentPolls[currentPollIndex];
                loadPoll(currentPoll);
                updateOverallChart();
            }, 2000);
        });

        loadPoll(currentPoll);
        updateOverallChart();
    }
    
    // --- CONTACT FORM ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formspreeEndpoint = 'https://formspree.io/f/xanjbvge';
        const statusEl = document.getElementById('form-status');
        const anonymousCheck = document.getElementById('anonymous-checkbox');
        const personalInfoFields = document.getElementById('personal-info-fields');
        const categorySelect = document.getElementById('contact-category');
        const otherCategoryWrapper = document.getElementById('other-category-wrapper');

        const modal = document.getElementById('confirmation-modal');
        const confirmSendBtn = document.getElementById('confirm-send-btn');
        const confirmAnonymousBtn = document.getElementById('confirm-anonymous-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        
        let isSubmittingAnonymously = false;
        
        const toggleAnonymous = () => {
            const isChecked = anonymousCheck.checked;
            personalInfoFields.style.display = isChecked ? 'none' : 'block';
            confirmSendBtn.style.display = isChecked ? 'none' : 'inline-flex';
            confirmAnonymousBtn.style.display = isChecked ? 'inline-flex' : 'none';
        };

        const showModal = () => {
             isSubmittingAnonymously = anonymousCheck.checked;
             if(isSubmittingAnonymously){
                confirmSendBtn.style.display = 'none';
                confirmAnonymousBtn.style.display = 'inline-flex';
             } else {
                confirmSendBtn.style.display = 'inline-flex';
                confirmAnonymousBtn.style.display = 'none';
             }
            modal.classList.add('active');
        };

        const hideModal = () => modal.classList.remove('active');

        anonymousCheck.addEventListener('change', toggleAnonymous);
        
        categorySelect.addEventListener('change', () => {
            otherCategoryWrapper.classList.toggle('hidden', categorySelect.value !== 'other');
        });
        
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            showModal();
        });

        cancelBtn.addEventListener('click', hideModal);

        const submitData = async (formDataObject) => {
            statusEl.textContent = 'Submitting...';
            hideModal();
            try {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    body: JSON.stringify(formDataObject),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    statusEl.textContent = "Thank you for your message!";
                    statusEl.style.color = '#4ade80';
                    contactForm.reset();
                    otherCategoryWrapper.classList.add('hidden');
                    if (anonymousCheck.checked) {
                        anonymousCheck.checked = false;
                        toggleAnonymous();
                    }
                } else {
                    const errorData = await response.json();
                    statusEl.textContent = errorData.errors ? errorData.errors.map(err => err.message).join(', ') : "Oops! There was a problem.";
                    statusEl.style.color = '#f87171';
                }
            } catch (error) {
                statusEl.textContent = "An error occurred. Please try again later.";
                statusEl.style.color = '#f87171';
            }
             setTimeout(() => statusEl.textContent = '', 5000);
        };
        
        confirmSendBtn.addEventListener('click', () => {
            const data = Object.fromEntries(new FormData(contactForm).entries());
            if (data.category === 'other') data.category = data.other_category;
            delete data.other_category;
            submitData(data);
        });

        confirmAnonymousBtn.addEventListener('click', () => {
            const data = Object.fromEntries(new FormData(contactForm).entries());
            data.name = 'Anonymous';
            data.email = 'anonymous@flamea.org';
            if (data.category === 'other') data.category = data.other_category;
            delete data.other_category;
            delete data['anonymous-checkbox'];
            submitData(data);
        });
        
        // Initial state
        toggleAnonymous();
    }
});
