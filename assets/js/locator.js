document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('location-search');
    const typeSelect = document.getElementById('resource-type');
    const listContainer = document.getElementById('list-container');
    const listPlaceholder = document.getElementById('list-placeholder');

    const resourceData = [
        // Father & Men NGOs
        { name: "Cool Dads Foundation", type: 'ngo-father', location: "Kwa-Thema, Springs", contact: "Phila Mbombela", phone: "+27 11 371 076", website: "cooldadsfoundation.co.za" },
        { name: "Dads On Duty", type: 'ngo-father', location: "Ennerdale, Johannesburg", contact: "info@dadsondutysa.co.za", phone: "081 352 5163", website: "dadsondutysa.co.za" },
        { name: "Fathers 4 Justice SA", type: 'ngo-father', location: "National", contact: "info@f4j.co.za", phone: "WhatsApp 066 331 8972", website: "f4j.co.za" },
        { name: "Izenzo Dad-care", type: 'ngo-father', location: "Khayelitsha, Cape Town", contact: "mthunzi.qagana@gmail.com", phone: "082 071 5298", website: "izenzodadcare.mystrikingly.com" },
        { name: "Growing Up Without a Father Foundation", type: 'ngo-father', location: "National", contact: "info@growingupwithoutafather.org.za", website: "growingupwithoutafather.org.za" },
        { name: "Amazing Dads Network Organization", type: 'ngo-father', location: "Kokotela, Johannesburg", contact: "Instagram @amazingdadsnetwork", website: "" },
        { name: "Fathers Matter (Heartlines)", type: 'ngo-father', location: "National", contact: "via Heartlines website", website: "heartlines.org.za" },
        { name: "Father A Nation (FAN)", type: 'ngo-father', location: "National", contact: "Helpline: 0800 60 1011", website: "fan.org.za" },
        
        // Family/Child NGOs
        { name: "FAMSA", type: 'ngo-family', location: "National", contact: "Varies by branch", website: "famsa.org.za" },
        { name: "Save the Children SA", type: 'ngo-family', location: "National", contact: "Varies by branch", website: "savethechildren.org.za" },
        { name: "Sonke Gender Justice", type: 'ngo-family', location: "National", contact: "Varies by branch", website: "genderjustice.org.za" },
        { name: "Centre for Child Law", type: 'ngo-family', location: "University of Pretoria", contact: "centreforchildlaw@up.ac.za", phone: "012 420 4502", website: "" },
        { name: "Boys Town South Africa", type: 'ngo-family', location: "National", website: "boystown.co.za" },
        
        // Courts
        { name: "Constitutional Court", type: 'court', location: "Braamfontein, Johannesburg", contact: "director@concourt.org.za", phone: "+27 11 359-7400", website: "concourt.org.za" },
        { name: "High Courts", type: 'court', location: "All Provinces", contact: "Varies by Division", website: "judiciary.org.za" },
        { name: "Magistrates' / Children's Courts", type: 'court', location: "All Districts", contact: "Varies by location", website: "justice.gov.za" },

        // Family Advocate Offices
        { name: "Family Advocate - Johannesburg", type: 'family-advocate', location: "Johannesburg, Gauteng", contact: "Adv Dorothy M Nameng-Sanyane", phone: "011 333 3724", website: "justice.gov.za" },
        { name: "Family Advocate - Pretoria", type: 'family-advocate', location: "Pretoria, Gauteng", contact: "Adv Shantelle Dames-Smith", phone: "012 323 0760", website: "justice.gov.za" },
        { name: "Family Advocate - Cape Town", type: 'family-advocate', location: "Cape Town, Western Cape", contact: "Adv. S. Ebrahim", phone: "021 426 1216", website: "justice.gov.za" },
        { name: "Family Advocate - Durban", type: 'family-advocate', location: "Durban, KZN", contact: "Adv. Nana N. Khumalo", phone: "031 310 6500", website: "justice.gov.za" },
        { name: "Family Advocate - Gqeberha", type: 'family-advocate', location: "Port Elizabeth, Eastern Cape", contact: "Adv L Vumenjani", phone: "041 508 1300", website: "justice.gov.za" },
        { name: "Family Advocate - East London", type: 'family-advocate', location: "East London, Eastern Cape", contact: "Adv. S Ntunzi", phone: "043 722 8866", website: "justice.gov.za" },
        
        // Legal Aid & Social Work
        { name: "Legal Aid South Africa", type: 'legal-aid', location: "National", contact: "Toll-Free", phone: "0800 110 110", website: "legal-aid.co.za" },
        { name: "ProBono.Org", type: 'legal-aid', location: "National", contact: "Varies", website: "probono.