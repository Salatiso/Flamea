// assets/js/customs.js

const customsDatabase = [
    {
        id: 'imbeleko',
        name: 'Imbeleko',
        stage: 'birth',
        cultures: ['xhosa', 'zulu'],
        description: 'A crucial ritual to introduce a newborn to their ancestors and the community.',
        procedure: 'The ceremony involves the ritual slaughter of a goat (or sheep), the burial of the umbilical cord and afterbirth, and the brewing of traditional beer (umqombothi). The baby is passed through the smoke of the sacred fire and given a traditional name.',
        significance: 'This ritual establishes the child\'s spiritual connection to their clan and ancestors, ensuring their protection and guidance. It formally welcomes the child into the family and community.',
        variations: {
            xhosa: 'Among the Xhosa, Imbeleko can be performed at any age before a male\'s initiation, but it is considered vital for formally introducing the child to their paternal ancestors.',
            zulu: 'The Zulu tradition places a strong emphasis on the father\'s role in introducing the child to the ancestral spirits (amadlozi).'
        },
        sources: {
            primary: ['https://www.nalug.net/exploring-the-vibrant-xhosa-cultural-traditions-an-insight-into-its-rich-heritage-and-beliefs/'],
            secondary: [
                'Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies.',
                'Beyond the Grave: A Son\'s Journey Through Xhosa Tradition, Spirituality, and Freedom: Chapter 2, Performing the initial rituals.'
            ]
        }
    },
    {
        id: 'ulwaluko',
        name: 'Ulwaluko',
        stage: 'coming-of-age',
        cultures: ['xhosa', 'ndebele'],
        description: 'A formal initiation and circumcision ritual that marks the transition from boyhood to manhood.',
        procedure: 'Initiates (abakhwetha) are secluded in a specially built hut (iboma) for several weeks. They undergo circumcision and are taught about manhood, cultural values, and their responsibilities to the community by elders and traditional surgeons (iingcibi). The process concludes with a cleansing ceremony and a celebration where the new men (amakrwala) are welcomed back.',
        significance: 'This is a pivotal transition into manhood, signifying a man\'s readiness to take on adult responsibilities, marry, and lead a family. It is deeply embedded in cultural identity and social standing.',
        ageRequirement: 'Traditionally 18+ years for Xhosa, when a young man is considered mature enough to provide for himself. For Ndebele, this often occurs in the early teens.',
        timing: 'Typically performed during the winter (June-July) or summer (November-December) school holidays.',
        sources: {
            primary: ['https://en.wikipedia.org/wiki/Xhosa_people'],
            secondary: [
                'The HomeSchooling Father - Master Edition 5-9-24.docx: Chapter 1, The formal school system.',
                'Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies.'
            ]
        }
    },
    {
        id: 'intonjane',
        name: 'Intonjane',
        stage: 'coming-of-age',
        cultures: ['xhosa', 'zulu'],
        description: 'A rite of passage for young women, marking their transition into womanhood.',
        procedure: 'When a girl has her first menstruation, she is secluded for a period to be taught by elder women about womanhood, marriage, and her future role in the community. The ceremony involves specific rituals, teachings, and celebrations.',
        significance: 'Prepares young women for marriage and adult responsibilities, instilling values of respect, loyalty, and family cohesion. It is a celebrated transition that reduces the likelihood of children outside of marriage.',
        sources: {
            primary: ['https://www.imvabainstitute.co.za/intonjane-part-1-kwaxhosa/'],
            secondary: ['Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Rites of passage and initiation ceremonies.']
        }
    },
    {
        id: 'lobola',
        name: 'Lobola',
        stage: 'marriage',
        cultures: ['xhosa', 'zulu', 'sotho', 'swazi', 'ndebele', 'pedi', 'tsonga'],
        description: 'The practice of bride wealth, where the groom\'s family presents gifts, traditionally cattle, to the bride\'s family.',
        procedure: 'Negotiations are conducted between the two families, often through intermediaries. The number of cattle or the equivalent monetary value is agreed upon, and the exchange solidifies the union.',
        significance: 'Lobola is not a "purchase" but a gesture of gratitude and a way to unite the two families. It legitimizes the marriage and demonstrates the groom\'s commitment and ability to provide for his wife.',
        sources: {
            primary: ['https://www.sowetanlive.co.za/news/2023-09-15-lobola-a-cultural-practice-of-unity-and-family/'],
            secondary: ['Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 2, Influence on Xhosa social structure and beliefs.']
        }
    },
    {
        id: 'umngcwabo',
        name: 'Umngcwabo',
        stage: 'death',
        cultures: ['xhosa', 'zulu'],
        description: 'A traditional funeral ceremony.',
        procedure: 'The ceremony involves specific rituals to honour the deceased and ensure their spirit transitions peacefully to the ancestral realm. This often includes the slaughter of a cow to accompany the spirit, speeches, and traditional songs. The body is traditionally buried in a sitting position, facing east.',
        significance: 'Death is seen not as an end but as a transition to becoming an ancestor. The funeral is a community event that honours the deceased\'s life and reinforces the connection between the living and the dead. Ancestors are revered and believed to guide and protect the living.',
        sources: {
            primary: ['https://www.news24.com/news24/southafrica/news/the-meaning-of-xhosa-funeral-rituals-20181206'],
            secondary: [
                'Beyond the Grave: A Son\'s Journey Through Xhosa Tradition, Spirituality, and Freedom: Preface & Chapter 1.',
                'Getting to know yourself as a South African, Unravelling Xhosa History: Chapter 6, Traditional beliefs and spirituality.'
            ]
        }
    }
    // More customs can be added here following the same structure
];

// Function to search and filter customs
function searchCustoms(query, stage = '', culture = '') {
    return customsDatabase.filter(custom => {
        const nameMatch = custom.name.toLowerCase().includes(query.toLowerCase());
        const stageMatch = !stage || custom.stage === stage;
        const cultureMatch = !culture || culture === 'all' || custom.cultures.includes(culture);
        return nameMatch && stageMatch && cultureMatch;
    });
}

// Function to display search results
function displayResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
    if (results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-gray-400">No customs found matching your criteria.</p>';
        return;
    }

    results.forEach(custom => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 p-6 rounded-lg border border-gray-700';
        card.innerHTML = `
            <h3 class="text-2xl font-bold text-purple-400 mb-2">${custom.name}</h3>
            <p class="text-sm uppercase text-gray-400 mb-4">${custom.cultures.join(', ')} - ${custom.stage}</p>
            <p class="mb-4">${custom.description}</p>
            <h4 class="font-bold text-lg mb-2">Procedure:</h4>
            <p class="mb-4">${custom.procedure}</p>
            <h4 class="font-bold text-lg mb-2">Significance:</h4>
            <p class="mb-4">${custom.significance}</p>
            ${custom.variations ? Object.entries(custom.variations).map(([culture, text]) => `<p class="mb-2"><strong>${culture.charAt(0).toUpperCase() + culture.slice(1)} Variation:</strong> ${text}</p>`).join('') : ''}
            <div class="mt-4 pt-4 border-t border-gray-700">
                <h4 class="font-bold text-lg mb-2">Sources:</h4>
                <p class="text-sm"><strong>Primary:</strong> ${custom.sources.primary.map(src => `<a href="${src}" target="_blank" class="text-purple-400 hover:underline">Reference</a>`).join(', ')}</p>
                <p class="text-sm"><strong>Secondary:</strong> ${custom.sources.secondary.join(', ')}</p>
            </div>
        `;
        resultsContainer.appendChild(card);
    });
}

// Event Listeners for search
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('customSearch').value;
        const results = searchCustoms(query);
        displayResults(results);
    });

    document.getElementById('wizardSearch').addEventListener('click', () => {
        const stage = document.getElementById('lifeStage').value;
        const culture = document.getElementById('culturalFilter').value;
        const results = searchCustoms('', stage, culture);
        displayResults(results);
    });
});