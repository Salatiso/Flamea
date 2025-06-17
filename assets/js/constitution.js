// assets/js/constitution.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Data: Abridged Constitution with Global Context ---
    const constitutionData = {
        "Preamble": {
            "text": "We, the people of South Africa, Recognise the injustices of our past; Honour those who suffered for justice and freedom in our land; Respect those who have worked to build and develop our country; and Believe that South Africa belongs to all who live in it, united in our diversity. We therefore, through our freely elected representatives, adopt this Constitution as the supreme law of the Republic so as to— Heal the divisions of the past and establish a society based on democratic values, social justice and fundamental human rights; Lay the foundations for a democratic and open society in which government is based on the will of the people and every citizen is equally protected by law; Improve the quality of life of all citizens and free the potential of each person; and Build a united and democratic South Africa able to take its rightful place as a sovereign state in the family of nations. May God protect our people. Nkosi Sikelel' iAfrika. Morena boloka setjhaba sa heso. God seën Suid-Afrika. God bless South Africa. Mudzimu fhatutshedza Afurika. Hosi katekisa Afrika."
        },
        "Chapter 1: Founding Provisions": {
            "sections": {
                "1. Republic of South Africa": "The Republic of South Africa is one, sovereign, democratic state founded on the following values: (a) Human dignity, the achievement of equality and the advancement of human rights and freedoms. (b) Non-racialism and non-sexism. (c) Supremacy of the constitution and the rule of law. (d) Universal adult suffrage, a national common voters roll, regular elections and a multi-party system of democratic government, to ensure accountability, responsiveness and openness.",
                "2. Supremacy of Constitution": "This Constitution is the supreme law of the Republic; law or conduct inconsistent with it is invalid, and the obligations imposed by it must be fulfilled."
            }
        },
        "Chapter 2: Bill of Rights": {
            "sections": {
                "9. Equality": "(1) Everyone is equal before the law and has the right to equal protection and benefit of the law. (2) Equality includes the full and equal enjoyment of all rights and freedoms. To promote the achievement of equality, legislative and other measures designed to protect or advance persons, or categories of persons, disadvantaged by unfair discrimination may be taken. (3) The state may not unfairly discriminate directly or indirectly against anyone on one or more grounds, including race, gender, sex, pregnancy, marital status, ethnic or social origin, colour, sexual orientation, age, disability, religion, conscience, belief, culture, language and birth.",
                "10. Human Dignity": "Everyone has inherent dignity and the right to have their dignity respected and protected.",
                "28. Children": "(1) Every child has the right— (a) to a name and a nationality from birth; (b) to family care or parental care, or to appropriate alternative care when removed from the family environment... (2) A child’s best interests are of paramount importance in every matter concerning the child."
            },
            "globalContext": {
                "title": "Global Context: The Bill of Rights and the American Experiment",
                "text": "Many principles in South Africa's Bill of Rights have parallels in other democratic constitutions, most notably the U.S. Constitution. However, there are key differences. The U.S. Constitution, for example, relies on a jury of one's peers to decide guilt in criminal trials, a system not adopted in South Africa. The U.S. also has a strong federal system, where states retain significant power, unlike South Africa's more centralized approach. The concept of 'fair discrimination' in Section 9(2) to allow for redress policies like Affirmative Action is a direct response to South Africa's unique history of Apartheid. In the U.S., Affirmative Action arose from the Civil Rights Movement of the 1960s to address the legacy of slavery and Jim Crow laws, but its application and legality have been fiercely debated and challenged in their courts for decades."
            }
        }
        // ... Other chapters would be added here in full
    };

    // --- State and DOM Elements ---
    const contentContainer = document.getElementById('constitution-content');
    const chapterProgressContainer = document.getElementById('chapter-progress-container');
    const overallProgressBar = document.getElementById('overall-progress');
    const userNameEl = document.getElementById('user-name');
    let progressState = {};
    let totalSections = 0;

    // --- Functions ---

    function loadProgress() {
        const savedProgress = localStorage.getItem('constitutionProgress');
        const savedName = localStorage.getItem('constitutionUserName');
        if (savedProgress) {
            progressState = JSON.parse(savedProgress);
        }
        if (savedName) {
            userNameEl.textContent = savedName;
        }
    }

    function saveProgress() {
        localStorage.setItem('constitutionProgress', JSON.stringify(progressState));
        localStorage.setItem('constitutionUserName', userNameEl.textContent);
    }

    function renderConstitution() {
        let pageCounter = 2; // Starts after dashboard
        let currentPageContent = createNewPage(pageCounter);

        function createNewPage(num) {
            const page = document.createElement('div');
            page.className = 'page';
            page.innerHTML = `
                <div class="watermark"><svg width="400" height="400" viewBox="0 0 200 60"><text x="0" y="45" font-family="Roboto Slab, serif" font-size="50" font-weight="700" fill="#000">Flame</text><g transform="translate(135, 0)"><path d="M18 5 L 0 50 L 8 50 C 12 42, 24 42, 28 50 L 36 50 Z" fill="#4ade80"></path></g></svg></div>
                <div class="header"><strong>Constitution of South Africa</strong></div>
                <div class="content"></div>
                <div class="footer"><span>© 2025 Flamea.org</span><span>Fathers. Leaders. Legacy.</span><span class="page-number">Page ${num}</span></div>
            `;
            contentContainer.appendChild(page);
            return page.querySelector('.content');
        }
        
        // Render Preamble
        const preambleId = 'preamble';
        totalSections++;
        let sectionHTML = `
            <div id="${preambleId}">
                <h2>Preamble</h2>
                <label for="checkbox-${preambleId}" class="block">
                    <input type="checkbox" id="checkbox-${preambleId}" class="section-checkbox" data-section-id="${preambleId}">
                    <span>${constitutionData.Preamble.text}</span>
                </label>
            </div>`;
        currentPageContent.innerHTML += sectionHTML;

        // Render Chapters and Sections
        Object.entries(constitutionData).forEach(([chapterTitle, chapterContent]) => {
            if (chapterTitle === "Preamble") return;

            currentPageContent.innerHTML += `<h2 id="${chapterTitle.replace(/\s+/g, '-')}">${chapterTitle}</h2>`;
            
            Object.entries(chapterContent.sections).forEach(([sectionTitle, sectionText]) => {
                const sectionId = `${chapterTitle.replace(/\s+/g, '-')}-${sectionTitle.replace(/\s+/g, '-')}`;
                totalSections++;

                sectionHTML = `
                    <div id="${sectionId}" class="mt-4">
                        <h3>${sectionTitle}</h3>
                        <label for="checkbox-${sectionId}" class="block">
                            <input type="checkbox" id="checkbox-${sectionId}" class="section-checkbox" data-section-id="${sectionId}">
                            <span>${sectionText}</span>
                        </label>
                    </div>`;
                currentPageContent.innerHTML += sectionHTML;
            });
            
            // Render Global Context if it exists
            if (chapterContent.globalContext) {
                 currentPageContent.innerHTML += `
                    <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 class="text-blue-800 flex items-center"><i class="fas fa-globe-americas mr-3"></i>${chapterContent.globalContext.title}</h3>
                        <p class="text-blue-700">${chapterContent.globalContext.text}</p>
                    </div>`;
            }
        });

        attachEventListeners();
        updateDashboard();
    }

    function updateDashboard() {
        chapterProgressContainer.innerHTML = '';
        let totalChecked = 0;

        const preambleId = 'preamble';
        const isPreambleChecked = progressState[preambleId] || false;
        if(isPreambleChecked) totalChecked++;
        const preambleProgress = isPreambleChecked ? 100 : 0;
        chapterProgressContainer.innerHTML += createChapterProgressHTML('Preamble', preambleProgress, preambleId);

        Object.entries(constitutionData).forEach(([chapterTitle, chapterContent]) => {
             if (chapterTitle === "Preamble") return;

            const chapterId = chapterTitle.replace(/\s+/g, '-');
            const sections = Object.keys(chapterContent.sections);
            const totalChapterSections = sections.length;
            let checkedChapterSections = 0;

            sections.forEach(sectionTitle => {
                const sectionId = `${chapterId}-${sectionTitle.replace(/\s+/g, '-')}`;
                if (progressState[sectionId]) {
                    checkedChapterSections++;
                }
            });
            
            totalChecked += checkedChapterSections;
            const chapterProgress = totalChapterSections > 0 ? (checkedChapterSections / totalChapterSections) * 100 : 0;
            chapterProgressContainer.innerHTML += createChapterProgressHTML(chapterTitle, chapterProgress, chapterId);
        });

        const overallProgress = totalSections > 0 ? (totalChecked / totalSections) * 100 : 0;
        overallProgressBar.style.width = `${overallProgress}%`;
        overallProgressBar.textContent = `${Math.round(overallProgress)}%`;
        
        document.querySelectorAll('.toc-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetElement = document.getElementById(e.target.dataset.targetId);
                if(targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }
    
    function createChapterProgressHTML(title, progress, id) {
         return `
            <div>
                <div class="flex justify-between items-center mb-1">
                    <a href="#${id}" class="font-semibold toc-link" data-target-id="${id}">${title}</a>
                    <span class="text-sm font-bold">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${progress}%;">${Math.round(progress)}%</div>
                </div>
            </div>`;
    }

    function attachEventListeners() {
        document.querySelectorAll('.section-checkbox').forEach(checkbox => {
            const sectionId = checkbox.dataset.sectionId;
            if (progressState[sectionId]) {
                checkbox.checked = true;
            }
            checkbox.addEventListener('change', (e) => {
                progressState[sectionId] = e.target.checked;
                saveProgress();
                updateDashboard();
            });
        });
        userNameEl.addEventListener('input', () => {
             saveProgress();
        });
    }

    loadProgress();
    renderConstitution();
});
