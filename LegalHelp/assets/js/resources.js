document.addEventListener('DOMContentLoaded', () => {
    const directoryContainer = document.getElementById('manual-directory');
    if (!directoryContainer) return;

    const resources = {
        "Superior Courts": {
            icon: 'fa-landmark',
            color: 'green-400',
            items: [
                { name: "Constitutional Court of South Africa", location: "Braamfontein, Johannesburg", website: "https://www.constitutionalcourt.org.za/" },
                { name: "Supreme Court of Appeal", location: "Bloemfontein", website: "https://www.supremecourtofappeal.org.za/" },
                { name: "High Court, Gauteng Division, Pretoria", location: "Pretoria", website: "https://www.judiciary.org.za/index.php/contact-us/gauteng" },
                { name: "High Court, Gauteng Local Division, Johannesburg", location: "Johannesburg", website: "https://www.judiciary.org.za/index.php/contact-us/gauteng" },
                { name: "High Court, Western Cape Division, Cape Town", location: "Cape Town", website: "https://www.judiciary.org.za/index.php/contact-us/western-cape" },
                // Add other high court divisions...
            ]
        },
        "Chapter 9 Institutions": {
            icon: 'fa-shield-alt',
            color: 'blue-400',
            items: [
                { name: "The Public Protector", website: "https://www.pprotect.org/" },
                { name: "South African Human Rights Commission (SAHRC)", website: "https://www.sahrc.org.za/" },
                { name: "Commission for the Promotion and Protection of the Rights of Cultural, Religious and Linguistic Communities (CRL Rights Commission)", website: "https://crlcommission.org.za/" },
                { name: "Commission for Gender Equality (CGE)", website: "https://cge.org.za/" },
                { name: "The Auditor-General of South Africa", website: "https://www.agsa.co.za/" },
                { name: "The Independent Electoral Commission (IEC)", website: "https://www.elections.org.za/" }
            ]
        },
        "Legal & Support Services": {
            icon: 'fa-hands-helping',
            color: 'yellow-400',
            items: [
                 { name: "Legal Aid South Africa", website: "https://legal-aid.co.za/" },
                 { name: "Legal Practice Council (LPC)", website: "https://lpc.org.za/" },
                 { name: "ProBono.Org", website: "https://www.probono.org.za/" },
            ]
        }
    };

    function renderDirectory() {
        let html = '';
        for (const [title, category] of Object.entries(resources)) {
            html += `
                <details class="bg-gray-800 rounded-lg mb-4 border border-gray-700 open:border-indigo-500" open>
                    <summary class="p-4 text-xl font-bold flex justify-between items-center cursor-pointer">
                        <span><i class="fas ${category.icon} w-8 mr-3 text-${category.color}"></i>${title}</span>
                        <i class="fas fa-chevron-down transform transition-transform details-arrow"></i>
                    </summary>
                    <div class="p-4 border-t border-gray-600 space-y-4">
            `;
            category.items.forEach(item => {
                html += `
                    <div class="pl-4 border-l-2 border-gray-600">
                        <h5 class="font-semibold text-lg text-white">${item.name}</h5>
                        ${item.location ? `<p class="text-sm text-gray-400">${item.location}</p>` : ''}
                        ${item.website ? `<a href="${item.website}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:underline text-sm mt-1 inline-block"><i class="fas fa-globe mr-2"></i>Visit Website</a>` : ''}
                    </div>
                `;
            });
            html += `</div></details>`;
        }
        directoryContainer.innerHTML += html;

        // Add event listeners for details animation
        document.querySelectorAll('details').forEach((el) => {
            el.addEventListener('toggle', () => {
                const arrow = el.querySelector('.details-arrow');
                if (el.open) {
                    arrow.classList.add('rotate-180');
                } else {
                    arrow.classList.remove('rotate-180');
                }
            });
        });
    }

    renderDirectory();
});
