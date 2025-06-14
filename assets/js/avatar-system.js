// assets/js/avatar-system.js
class AvatarSystem {
    constructor() {
        this.avatars = {
            // Boys
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
            
            // Girls
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
            },
            
            // Animal Options
            'lion': {
                name: 'Brave Lion',
                type: 'animal',
                emoji: '🦁',
                svgCode: this.generateAnimalSVG('lion'),
                description: 'Courageous and strong leader'
            },
            'owl': {
                name: 'Wise Owl',
                type: 'animal',
                emoji: '🦉',
                svgCode: this.generateAnimalSVG('owl'),
                description: 'Smart and thoughtful helper'
            },
            'dolphin': {
                name: 'Happy Dolphin',
                type: 'animal',
                emoji: '🐬',
                svgCode: this.generateAnimalSVG('dolphin'),
                description: 'Friendly and intelligent swimmer'
            }
        };
    }

    generateBoySVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <!-- Face -->
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            
            <!-- Hair -->
            <path d="M15 25 Q40 5 65 25 Q65 15 40 10 Q15 15 15 25" fill="${primaryColor}"/>
            
            <!-- Eyes -->
            <circle cx="32" cy="30" r="3" fill="#333"/>
            <circle cx="48" cy="30" r="3" fill="#333"/>
            <circle cx="33" cy="29" r="1" fill="#fff"/>
            <circle cx="49" cy="29" r="1" fill="#fff"/>
            
            <!-- Nose -->
            <ellipse cx="40" cy="37" rx="2" ry="3" fill="#F4A688"/>
            
            <!-- Mouth -->
            <path d="M35 42 Q40 47 45 42" stroke="#333" stroke-width="2" fill="none"/>
            
            <!-- Shirt -->
            <rect x="25" y="55" width="30" height="25" fill="${secondaryColor}" rx="5"/>
            
            <!-- Arms -->
            <circle cx="20" cy="65" r="8" fill="#FDBCB4"/>
            <circle cx="60" cy="65" r="8" fill="#FDBCB4"/>
        </svg>`;
    }

    generateGirlSVG(primaryColor, secondaryColor) {
        return `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <!-- Face -->
            <circle cx="40" cy="35" r="25" fill="#FDBCB4"/>
            
            <!-- Hair with bow -->
            <path d="M15 25 Q40 5 65 25 Q65 15 40 10 Q15 15 15 25" fill="${primaryColor}"/>
            <path d="M50 15 Q55 12 60 15 Q55 18 50 15" fill="${secondaryColor}"/>
            
            <!-- Eyes with lashes -->
            <circle cx="32" cy="30" r="3" fill="#333"/>
            <circle cx="48" cy="30" r="3" fill="#333"/>
            <path d="M29 27 L31 25 M35 27 L37 25" stroke="#333" stroke-width="1"/>
            <path d="M45 27 L43 25 M51 27 L49 25" stroke="#333" stroke-width="1"/>
            
            <!-- Nose -->
            <ellipse cx="40" cy="37" rx="2" ry="3" fill="#F4A688"/>
            
            <!-- Mouth -->
            <path d="M35 42 Q40 47 45 42" stroke="#E91E63" stroke-width="2" fill="none"/>
            
            <!-- Dress -->
            <path d="M25 55 L55 55 L60 80 L20 80 Z" fill="${secondaryColor}"/>
            
            <!-- Arms -->
            <circle cx="20" cy="65" r="8" fill="#FDBCB4"/>
            <circle cx="60" cy="65" r="8" fill="#FDBCB4"/>
        </svg>`;
    }

    generateAnimalSVG(animalType) {
        const templates = {
            lion: `<svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="#DAA520"/>
                <circle cx="40" cy="40" r="20" fill="#F4A460"/>
                <circle cx="32" cy="35" r="3" fill="#333"/>
                <circle cx="48" cy="35" r="3" fill="#333"/>
                <path d="M35 45 Q40 50 45 45" stroke="#333" stroke-width="2" fill="none"/>
            </svg>`,
            owl: `<svg width="80" height="80" viewBox="0 0 80 80">
                <ellipse cx="40" cy="45" rx="25" ry="30" fill="#8B4513"/>
                <circle cx="30" cy="35" r="8" fill="#fff"/>
                <circle cx="50" cy="35" r="8" fill="#fff"/>
                <circle cx="30" cy="35" r="4" fill="#333"/>
                <circle cx="50" cy="35" r="4" fill="#333"/>
                <path d="M40 40 L40 45 L37 47 Z" fill="#FFA500"/>
            </svg>`,
            dolphin: `<svg width="80" height="80" viewBox="0 0 80 80">
                <ellipse cx="40" cy="40" rx="30" ry="20" fill="#4169E1"/>
                <circle cx="32" cy="35" r="3" fill="#333"/>
                <circle cx="48" cy="35" r="3" fill="#333"/>
                <path d="M35 45 Q40 48 45 45" stroke="#333" stroke-width="2" fill="none"/>
            </svg>`
        };
        return templates[animalType] || templates.lion;
    }
}
