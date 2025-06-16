// Customs database with comprehensive information
const customsDatabase = [
    {
        id: 'imbeleko',
        name: 'Imbeleko',
        stage: 'birth',
        cultures: ['xhosa', 'zulu'],
        description: 'Ritual to introduce newborn to ancestors',
        procedure: 'Burial of umbilical cord, goat sacrifice, brewing umqombothi',
        significance: 'Establishes child\'s connection to clan and ancestors',
        variations: {
            xhosa: 'Performed at any age before male initiation',
            zulu: 'Emphasizes father\'s role in ancestral introduction'
        },
        primarySources: [
            'https://www.nalug.net/exploring-the-vibrant-xhosa-cultural-traditions-an-insight-into-its-rich-heritage-and-beliefs/',
            'https://polyglotclub.com/wiki/Language/Xhosa/Culture/Traditional-Customs-and-Celebrations'
        ],
        secondarySources: [
            'Book 1: Chapter on Birth Rituals',
            'Book 2: Ancestral Practices Section'
        ]
    },
    {
        id: 'ulwaluko',
        name: 'Ulwaluko',
        stage: 'coming-of-age',
        cultures: ['xhosa'],
        description: 'Male circumcision and initiation into manhood',
        procedure: 'Circumcision, month-long seclusion, teachings, cleansing ceremony',
        significance: 'Transition from boyhood to manhood with community recognition',
        ageRequirement: '18+ years (self-sufficient age)',
        timing: 'Winter (June-July) or Summer (November-December)',
        primarySources: [
            'https://en.wikipedia.org/wiki/Xhosa_people',
            'https://www.nalug.net/exploring-the-vibrant-xhosa-cultural-traditions-an-insight-into-its-rich-heritage-and-beliefs/'
        ],
        secondarySources: [
            'Book 1: Male Initiation Practices',
            'Book 3: Xhosa Cultural Ceremonies'
        ]
    }
    // Additional customs entries...
];

// Search and filter functionality
function searchCustoms(query, stage = '', culture = '') {
    return customsDatabase.filter(custom => {
        const nameMatch = custom.name.toLowerCase().includes(query.toLowerCase());
        const stageMatch = !stage || custom.stage === stage;
        const cultureMatch = !culture || culture === 'all' || custom.cultures.includes(culture);
        
        return nameMatch && stageMatch && cultureMatch;
    });
}

// Timeline functionality
function createTimeline() {
    const timeline = document.getElementById('customsTimeline');
    const stageOrder = ['birth', 'coming-of-age', 'marriage', 'healing', 'death'];
    
    stageOrder.forEach(stage => {
        const stageCustoms = customsDatabase.filter(custom => custom.stage === stage);
        stageCustoms.forEach(custom => {
            const timelineItem = createTimelineItem(custom);
            timeline.appendChild(timelineItem);
        });
    });
}

function createTimelineItem(custom) {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
        <div class="timeline-marker"></div>
        <div class="timeline-content">
            <h3>${custom.name}</h3>
            <p class="timeline-preview">${custom.description}</p>
            <div class="timeline-details" style="display: none;">
                <p><strong>Procedure:</strong> ${custom.procedure}</p>
                <p><strong>Significance:</strong> ${custom.significance}</p>
                <div class="sources">
                    <h4>Primary Sources:</h4>
                    ${custom.primarySources.map(source => `<a href="${source}" target="_blank">External Reference</a>`).join(', ')}
                    <h4>Secondary Sources:</h4>
                    ${custom.secondarySources.join(', ')}
                </div>
            </div>
        </div>
    `;
    
    item.addEventListener('click', () => {
        const details = item.querySelector('.timeline-details');
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    });
    
    return item;
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    createTimeline();
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('wizardSearch').addEventListener('click', performWizardSearch);
});
