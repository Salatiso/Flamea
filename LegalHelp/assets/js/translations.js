// This will hold the translation data. In a real app, this might be loaded from a JSON file.
const translations = {
    en: {
        "nav.home": "Home",
        "nav.constitution": "Constitution",
        "nav.statutes": "Statutes",
        "nav.caselaw": "Case Law",
        "nav.updates": "Updates",
        "nav.forms": "Forms",
        "nav.resources": "Resources",
        "nav.community": "Community",
        "nav.login": "Login",
        "home.title": "The Law, Demystified.",
        "home.subtitle": "Your comprehensive, single-view archive of South African legislation.",
        "home.search_placeholder": "Search any Act, case, or section...",
        "home.swipe_prompt": "Use navigation or swipe to explore",
        "constitution.title": "The Constitution",
        "constitution.subtitle": "The supreme law of the Republic. The foundation of our democracy and the ultimate source of all law. Explore the Bill of Rights, the structure of the state, and landmark Constitutional Court cases that have shaped our nation.",
        "constitution.cta": "View Related Forms",
        "updates.title": "Legislation Updates",
        "updates.subtitle": "How does law in South Africa change? Understand the process and help us keep this database current.",
        "updates.api_title": "Is There an Automated API?",
        "updates.api_desc": "Currently, the South African government does not provide a centralized, real-time API for legislation updates. This makes automatic tracking a significant challenge.",
        "updates.gazette_title": "The Government Gazette",
        "updates.gazette_desc": "All new Acts, amendments, and regulations are published in the Government Gazette. It is typically published **every Friday**, though special editions can be released any day. This is the official source of truth.",
        "updates.cta": "Join the Community Watch",
        "forms.title": "Forms & Documents Hub",
        "forms.subtitle": "Empower yourself with the right documents. Knowledge is the first step to justice.",
        "forms.wizard_title": "Simple Start Wizard",
        "forms.wizard_desc": "Not sure where to begin? We’ll guide you to the right form.",
        "forms.explorer_title": "Manual Explorer",
        "forms.explorer_desc": "Know what you need? Browse all forms by category.",
    },
    zu: {
        "nav.home": "Ekhaya",
        "nav.constitution": "uMthethosisekelo",
        "nav.statutes": "Imithetho",
        "nav.caselaw": "Amacala Asemthethweni",
        "nav.updates": "Izibuyekezo",
        "nav.forms": "Amafomu",
        "nav.resources": "Izinsiza",
        "nav.community": "Umphakathi",
        "nav.login": "Ngena",
        "home.title": "Umthetho, Uwenziwe Wacaca.",
        "home.subtitle": "Iqoqo lakho eliphelele nelifinyelelekayo lemithetho yaseNingizimu Afrika.",
        "home.search_placeholder": "Sesha noma yimuphi uMthetho, icala, noma isigaba...",
        "constitution.title": "uMthethosisekelo",
        "constitution.subtitle": "Umthetho ophakeme weRiphabhuliki. Isisekelo sentando yethu yeningi kanye nomthombo omkhulu wawo wonke umthetho.",
        "constitution.cta": "Buka Amafomu Ahlobene",
        "updates.title": "Izibuyekezo Zomthetho",
        "updates.subtitle": "Ushintsha kanjani umthetho eNingizimu Afrika? Qonda inqubo futhi usisize sigcine le dathabheyisi isesikhathini.",
        "updates.cta": "Joyina Abaqaphi Bomphakathi",
    },
    // Add other languages here...
};

export async function loadTranslations() {
    // In a real app, you might fetch this from a server
    // For now, we just use the object above.
    console.log("Translations loaded.");
    return Promise.resolve();
}

export function translatePage(lang) {
    if (!translations[lang]) {
        console.warn(`Language "${lang}" not found. Falling back to English.`);
        lang = 'en';
    }

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        const key = el.dataset.translateKey;
        if (translations[lang][key]) {
            // If the element is an input, set its placeholder
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder-key')) {
                 el.placeholder = translations[lang][key];
            } else {
                 el.textContent = translations[lang][key];
            }
        }
    });
     document.documentElement.lang = lang; // Update the lang attribute of the html tag
}

export function setLanguage(lang) {
     localStorage.setItem('legalHelpLanguage', lang);
     translatePage(lang);
}
