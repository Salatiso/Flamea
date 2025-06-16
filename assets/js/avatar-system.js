// assets/js/avatar-system.js

class AvatarSystem {
    constructor() {
        this.avatars = {
            // Male Life-Stage Avatars
            'inkwenkwe': { name: 'Inkwenkwe', type: 'boy', age: 8, emoji: '🧒', svgCode: this.generateBoySVG('#4CAF50', '#2196F3'), description: 'A curious boy starting his journey.' },
            'mfana': { name: 'Mfana', type: 'man', age: 18, emoji: '🧑', svgCode: this.generateYoungManSVG('#3F51B5', '#03A9F4'), description: 'A young man facing the world.' },
            'tata': { name: 'Tata', type: 'father', age: 35, emoji: '👨‍👧‍👦', svgCode: this.generateFatherSVG('#795548', '#FF9800'), description: 'A father, the pillar of his family.' },
            'malume': { name: 'Malume', type: 'fatherfigure', age: 45, emoji: '🧔', svgCode: this.generateFatherSVG('#607D8B', '#455A64', true), description: 'An uncle, a respected figure of guidance.' },
            'tamkhulu': { name: 'Ta\'mkhulu', type: 'grandfather', age: 65, emoji: '👴', svgCode: this.generateGrandfatherSVG('#BDBDBD', '#757575'), description: 'A grandfather, a source of wisdom.' },
            'khokho': { name: 'Khokho', type: 'greatgrandfather', age: 85, emoji: '🧓', svgCode: this.generateGreatGrandfatherSVG('#9E9E9E', '#616161'), description: 'A great-grandfather, the root of the legacy.' },

            // Female Life-Stage Avatars
            'intombazana': { name: 'Intombazana', type: 'girl', age: 8, emoji: '👧', svgCode: this.generateGirlSVG('#E91E63', '#F8BBD0'), description: 'A young girl discovering her world.' },
            'intombi': { name: 'Intombi', type: 'woman', age: 18, emoji: '👩', svgCode: this.generateYoungWomanSVG('#9C27B0', '#E1BEE7'), description: 'A young woman embracing her path.' },
            'umama': { name: 'Umama', type: 'mother', age: 35, emoji: '👩‍👧‍👦', svgCode: this.generateMotherSVG('#673AB7', '#D1C4E9'), description: 'A mother, the heart of the family.' },
            'anti': { name: 'Anti', type: 'motherfigure', age: 45, emoji: '🧕', svgCode: this.generateMotherSVG('#4CAF50', '#C8E6C9', true), description: 'An aunt, a source of guidance and care.' },
            'makhulu': { name: 'Makhulu', type: 'grandmother', age: 65, emoji: '👵', svgCode: this.generateGrandmotherSVG('#FFC107', '#FFECB3'), description: 'A grandmother, a keeper of traditions.' },
            'khokhokazi': { name: 'Khokhokazi', type: 'greatgrandmother', age: 85, emoji: '👵', svgCode: this.generateGreatGrandmotherSVG('#FF9800', '#FFE0B2'), description: 'A great-grandmother, the matriarch of the legacy.' },
            
            // Original Avatars
            'buggz': { name: 'BuggZ', type: 'boy', age: 7, emoji: '🐛', svgCode: this.generateBoySVG('#4CAF50', '#2196F3'), description: 'The curious explorer who loves bugs and nature' },
            'sga': { name: 'Sga', type: 'boy', age: 4, emoji: '⭐', svgCode: this.generateBoySVG('#FF9800', '#FFC107'), description: 'The little star with big dreams' },
            'oros': { name: 'Oros', type: 'boy', age: 8, emoji: '🏆', svgCode: this.generateBoySVG('#E91E63', '#9C27B0'), description: 'The champion who never gives up' },
            'monkey': { name: 'Monkey', type: 'girl', age: 6, emoji: '🐵', svgCode: this.generateGirlSVG('#8BC34A', '#CDDC39'), description: 'The playful adventurer who loves to climb high' },
            'princess': { name: 'Princess', type: 'girl', age: 6, emoji: '👑', svgCode: this.generateGirlSVG('#E91E63', '#F8BBD9'), description: 'The royal leader who cares for everyone' }
        };
    }
    // ... include all the SVG generation functions from the original file ...
}