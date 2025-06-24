function toggleAccordion(sectionId) {
    const section = document.getElementById(sectionId);
    const arrow = document.getElementById(sectionId + '-arrow');
    if (section && arrow) {
        section.classList.toggle('hidden');
        arrow.classList.toggle('rotate-180');
    }
}
