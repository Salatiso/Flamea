class AvatarSystem {
    constructor() {
        this.avatars = {
            // New Male Life-Stage Avatars
            'inkwenkwe': {
                name: 'Inkwenkwe',
                type: 'boy',
                age: 8,
                emoji: '🧒',
                svgCode: this.generateBoySVG('#4CAF50', '#2196F3'),
                description: 'A curious boy starting his journey.'
            },
            'mfana': {
                name: 'Mfana',
                type: 'man',
                age: 18,
                emoji: '🧑',
                svgCode: this.generateYoungManSVG('#3F51B5', '#03A9F4'),
                description: 'A young man facing the world.'
            },
            'tata': {
                name: 'Tata',
                type: 'father',
                age: 35,
                emoji: '👨‍👧‍👦',
                svgCode: this.generateFatherSVG('#795548', '#FF9800'),
                description: 'A father, the pillar of his family.'
            },
            'malume': {
                name: 'Malume',
                type: 'fatherfigure',
                age: 45,
                emoji: '🧔',
                svgCode: this.generateFatherSVG('#607D8B', '#455A64', true), // With a fuller beard
                description: 'An uncle, a respected figure of guidance.'
            },
            'tamkhulu': {
                name: 'Ta\'mkhulu',
                type: 'grandfather',
                age: 65,
                emoji: '👴',
                svgCode: this.generateGrandfatherSVG('#BDBDBD', '#757575'),
                description: 'A grandfather, a source of wisdom.'
            },
            'khokho': {
                name: 'Khokho',
                type: 'greatgrandfather',
                age: 85,
                emoji: '🧓',
                svgCode: this.generateGreatGrandfatherSVG('#9E9E9E', '#616161'),
                description: 'A great-grandfather, the root of the legacy.'
            },
            
            // Original Avatars
            'buggz': {
                name: 'BuggZ',
                type: 'boy',
                age: 7,
                emoji: '🐛',
                svgCode: this.generateBoySVG('#4CAF50', '#2196F3'),
                description: 'The curious explorer who loves bugs and nature'
            },
            'sga': {
                name: 'Sga',
                type: 'boy', 
                age: 4,
                emoji: '⭐',
                svgCode: this.generateBoySVG('#FF9800', '#FFC107'),
                description: 'The little star with big dreams'
            },
            'oros': {
                name: 'Oros',
                type: 'boy',
                age: 8,
                emoji: '🏆',
                svgCode: this.generateBoySVG('#E91E63', '#9C27B0'),
                description: 'The champion who never gives up'
            },
            'monkey': {
                name: 'Monkey',
                type: 'girl',
                age: 6,
                emoji: '🐵',
                svgCode: this.generateGirlSVG('#8BC34A', '#CDDC39'),
                description: 'The playful adventurer who loves to climb high'
            },
            'princess': {
                name: 'Princess',
                type: 'girl',
                age: 6,
                emoji: '👑',
                svgCode: this.generateGirlSVG('#E91E63', '#F8BBD9'),
                description: 'The royal leader who cares for everyone'
            }
        };
    }

    generateBoySVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            <path d="M15 25 Q40 5 65 25 Q65 15 40 10 Q15 15 15 25" fill="${primaryColor}"/>
            <circle cx="32" cy="30" r="3" fill="#333"/><circle cx="48" cy="30" r="3" fill="#333"/>
            <path d="M35 42 Q40 47 45 42" stroke="#333" stroke-width="2" fill="none"/>
            <rect x="25" y="55" width="30" height="25" fill="${secondaryColor}" rx="5"/>
        </svg>`;
    }

    generateYoungManSVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            <path d="M20 20 Q40 10 60 20 L60 30 Q40 25 20 30 Z" fill="${primaryColor}"/>
            <circle cx="32" cy="32" r="3" fill="#333"/><circle cx="48" cy="32" r="3" fill="#333"/>
            <path d="M35 45 Q40 48 45 45" stroke="#333" stroke-width="2" fill="none"/>
            <rect x="20" y="55" width="40" height="25" fill="${secondaryColor}" rx="5"/>
        </svg>`;
    }
    
    generateFatherSVG(primaryColor, secondaryColor, fullerBeard = false) {
        let beardPath = fullerBeard ? 
            `<path d="M25 40 Q40 60 55 40 L50 60 L30 60 Z" fill="${primaryColor}"/>` :
            `<path d="M30 45 Q40 55 50 45" fill="${primaryColor}" opacity="0.7"/>`;
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            <path d="M20 20 Q40 15 60 20 L55 30 Q40 28 25 30 Z" fill="${primaryColor}"/>
            ${beardPath}
            <circle cx="32" cy="32" r="3" fill="#333"/><circle cx="48" cy="32" r="3" fill="#333"/>
            <path d="M35 42 Q40 45 45 42" stroke="#333" stroke-width="2" fill="none"/>
            <rect x="20" y="55" width="40" height="25" fill="${secondaryColor}" rx="5"/>
        </svg>`;
    }

    generateGrandfatherSVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#F0E68C"/>
            <path d="M25 25 Q15 35 25 45 M55 25 Q65 35 55 45" stroke="${primaryColor}" stroke-width="2" fill="none" opacity="0.6"/> <path d="M25 18 L55 18" stroke="${primaryColor}" stroke-width="4" fill="none"/> <path d="M25 40 Q40 65 55 40 L50 60 L30 60 Z" fill="${primaryColor}"/> <rect x="30" y="28" width="20" height="5" rx="2" fill="#333"/> <circle cx="28" cy="32" r="8" stroke="#333" stroke-width="2" fill="none"/> <circle cx="52" cy="32" r="8" stroke="#333" stroke-width="2" fill="none"/> <path d="M35 42 Q40 44 45 42" stroke="#333" stroke-width="2" fill="none"/>
            <rect x="20" y="55" width="40" height="25" fill="${secondaryColor}" rx="5"/>
        </svg>`;
    }
    
    generateGreatGrandfatherSVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#F0E68C" opacity="0.9"/>
            <path d="M25 25 Q15 35 25 45 M55 25 Q65 35 55 45 M30 25 Q40 20 50 25" stroke="${primaryColor}" stroke-width="3" fill="none" opacity="0.7"/> <path d="M20 45 Q40 75 60 45 L50 65 L30 65 Z" fill="${primaryColor}"/> <circle cx="32" cy="32" r="3" fill="#555"/><circle cx="48" cy="32" r="3" fill="#555"/> <path d="M35 42 Q40 43 45 42" stroke="#333" stroke-width="2" fill="none"/>
            <rect x="20" y="55" width="40" height="25" fill="${secondaryColor}" rx="5"/>
        </svg>`;
    }

    generateGirlSVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            <path d="M15 25 Q40 5 65 25 Q65 15 40 10 Q15 15 15 25" fill="${primaryColor}"/>
            <path d="M50 15 Q55 12 60 15 Q55 18 50 15" fill="${secondaryColor}"/>
            <circle cx="32" cy="30" r="3" fill="#333"/><circle cx="48" cy="30" r="3" fill="#333"/>
            <path d="M35 42 Q40 47 45 42" stroke="#E91E63" stroke-width="2" fill="none"/>
            <path d="M25 55 L55 55 L60 80 L20 80 Z" fill="${secondaryColor}"/>
        </svg>`;
    }
}