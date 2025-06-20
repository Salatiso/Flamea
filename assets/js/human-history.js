const verticalTimelineData = [
    {
        "date": "c. 200,000 BC",
        "event": "Emergence of Homo sapiens & Early Religion",
        "details": "Archaeological evidence, such as intentional burials and the use of symbolic materials like ochre, suggests the emergence of complex cognition, religious ideas, and ancestor worship. This established a continuity across generations, a practice foundational to cultures like the Bantu and Khoisan. The family was the primary and sole social, economic, and educational unit.",
        "primarySource": "https://www.nature.com/scitable/knowledge/library/the-earliest-burials-104212112/",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 10,000 BC",
        "event": "The Agricultural Revolution",
        "details": "The shift from nomadic life to settled agriculture creates concepts of land ownership and inheritance. This solidifies the patriarchal family structure, as patrilineal descent becomes the primary social mechanism for transferring property and status.",
        "primarySource": "https://www.oxfordresearch.com/abstract/10.1093/acrefore/9780199340378.001.0001/acrefore-9780199340378-e-23",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "c. 6500-3800 BC",
        "event": "Rise of the State in Mesopotamia",
        "details": "The Ubaid period sees the establishment of the first permanent settlements with irrigation agriculture in Mesopotamia, laying the groundwork for urban civilization and the emergence of a centralized state structure that would begin to compete with familial authority.",
        "primarySource": "https://www.worldhistory.org/ubaid_period/",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 3500-3000 BC",
        "event": "Invention of Cuneiform Writing",
        "details": "The invention of writing in Sumer was not for popular literacy but as a tool for the temple and state economy to manage accounting and administration. This created a division between the articulated, recorded knowledge of the state and the informal, traditional wisdom of the family.",
        "primarySource": "https://www.penn.museum/sites/cuneiform/cuneiform-writing/",
        "secondarySource": "Knowledge and Decisions, T. Sowell"
    },
    {
        "date": "c. 3000 BC",
        "event": "First Formal Schools in Mesopotamia",
        "details": "The first schools (edubbas) emerge not for the general populace, but as exclusive institutions to train a loyal class of scribes and priests. This marks the first \"outsourcing\" of education from the family to a surrogate institution serving the state's needs.",
        "primarySource": "https://www.worldhistory.org/article/1493/education-in-ancient-mesopotamia/",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 2400 BCE",
        "event": "Egyptian Pyramid Texts",
        "details": "Early religious texts in Egypt codify complex beliefs about the afterlife, solidifying the authority of the priestly and ruling classes who controlled this specialized knowledge. This is another example of knowledge being institutionalized by a state surrogate.",
        "primarySource": "https://www.worldhistory.org/Pyramid_Texts/",
        "secondarySource": "Beyond the Grave, Salatiso"
    },
    {
        "date": "c. 1750 BC",
        "event": "Code of Hammurabi",
        "details": "The Babylonian king Hammurabi issues a comprehensive written legal code. This represents the state's formal appropriation of justice, replacing community-based dispute resolution with a centralized, standardized system that reinforces patriarchal authority over the family unit.",
        "primarySource": "The Code of Hammurabi, c. 1750 BC",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "c. 1000 BCE - 1500 CE",
        "event": "The Bantu Migrations",
        "details": "A prolonged expansion of Bantu-speaking peoples across sub-Saharan Africa. They spread advanced iron-working and agricultural technologies, leading to the development of complex societies and powerful kingdoms like Great Zimbabwe and the Kingdom of Kongo, long before European arrival.",
        "primarySource": "https://www.worldhistory.org/Bantu_Migration/",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "c. 800 BC",
        "event": "Homer's Iliad and the Honor Culture",
        "details": "The epic poetry of Homer depicts a society where a man's identity and worth are inextricably linked to his father's legacy and honor. The father is the ultimate benchmark for a son's life, a powerful cultural paradigm.",
        "primarySource": "The Iliad, Homer",
        "secondarySource": "Intellectuals, P. Johnson"
    },
    {
        "date": "c. 500 BC",
        "event": "Confucianism and the Family State",
        "details": "In China, Confucianism establishes a philosophical system where the patriarchal family is the fundamental building block of a stable and harmonious state. This model integrates family structure directly into the political order.",
        "primarySource": "The Analects of Confucius",
        "secondarySource": "Knowledge and Decisions, T. Sowell"
    },
    {
        "date": "c. 380 BC",
        "event": "Plato's \"Allegory of the Cave\"",
        "details": "Plato provides the philosophical justification for surrogate education. He posits that truth is an abstract ideal accessible only to enlightened experts (philosophers), who must lead the ignorant masses out of the \"cave\" of traditional, familial wisdom.",
        "primarySource": "The Republic, Plato",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 335 BC",
        "event": "Aristotle's Politics",
        "details": "Aristotle argues that public education is essential for the stability of the state. He posits that the primary purpose of schooling is to mold citizens to fit the character of their government, making the state's needs paramount over the family's.",
        "primarySource": "Politics, Aristotle",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 500 AD - 1500 AD",
        "event": "The Bible and the Codification of Family",
        "details": "The Judeo-Christian tradition establishes the patriarchal family as a divinely instituted union. The Bible places the primary responsibility for children's education on the parents, particularly the father, presenting a powerful counter-narrative to the state-as-educator model.",
        "primarySource": "The Bible (e.g., Ephesians 5, Deuteronomy 6)",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "529-534 AD",
        "event": "The Justinian Code",
        "details": "The Byzantine Emperor Justinian codifies Roman law and enshrines orthodox Christianity as the official state religion, making the state the official enforcer of religious dogma and further consolidating the power of surrogate institutions.",
        "primarySource": "Corpus Juris Civilis",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "c. 1100s-1400s",
        "event": "Rise of Great Zimbabwe",
        "details": "The capital of a major southern African trading empire demonstrates advanced architectural and organizational skills. Its existence counters the colonial-era narrative that Africa had no history of complex state-level societies before European arrival.",
        "primarySource": "Archaeological evidence at Great Zimbabwe National Monument",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "1215 AD",
        "event": "The Magna Carta",
        "details": "English barons force King John to sign the Magna Carta, establishing the principle that the king is not above the law. It represents a formal, institutional pushback against the overreach of the centralized state, a foundational moment for constitutionalism.",
        "primarySource": "The Magna Carta",
        "secondarySource": "Knowledge and Decisions, T. Sowell"
    },
    {
        "date": "c. 1325-1354",
        "event": "Travels of Ibn Battuta",
        "details": "The Moroccan scholar Ibn Battuta travels extensively, including along the Swahili Coast of Africa. He describes vibrant, wealthy, and well-governed city-states like Kilwa, providing a contemporary primary source account of flourishing African civilizations.",
        "primarySource": "The Rihla, Ibn Battuta",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "c. 1444",
        "event": "Invention of the Printing Press",
        "details": "Johannes Gutenberg's invention of movable type dramatically lowers the cost of books and democratizes access to information, allowing for the rapid dissemination of ideas that would challenge the authority of the Church and state.",
        "primarySource": "The Gutenberg Bible",
        "secondarySource": "Intellectuals, P. Johnson"
    },
    {
        "date": "1517 AD",
        "event": "The Protestant Reformation",
        "details": "Martin Luther champions universal education so that all believers can read the Bible themselves. While intended to empower the family, this call for mass schooling inadvertently created the institutional blueprint for the modern state-controlled school system.",
        "primarySource": "The Ninety-five Theses, Martin Luther",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "1543 AD",
        "event": "The Copernican Revolution",
        "details": "Nicolaus Copernicus publishes his heliocentric theory, beginning the Scientific Revolution. This marked a shift toward knowledge based on empirical evidence, creating a new class of credentialed experts (scientists) whose authority would challenge traditional religious and political structures.",
        "primarySource": "De revolutionibus orbium coelestium, Copernicus",
        "secondarySource": "The Better Angels of Our Nature, S. Pinker"
    },
    {
        "date": "1652",
        "event": "Dutch Arrival at the Cape",
        "details": "The Dutch East India Company (DEIC) establishes a refreshment station at the Cape of Good Hope, marking the beginning of permanent European settlement and the seed of the colonial project in South Africa.",
        "primarySource": "Jan van Riebeeck's Diary",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1658",
        "event": "First Formal School in South Africa",
        "details": "The DEIC establishes a school to instruct enslaved children in Dutch culture and religion. This marks the beginning of institutionalized, surrogate education in South Africa, designed for ideological domination, not indigenous flourishing.",
        "primarySource": "https://www.hsrcpress.ac.za/books/a-new-history-of-formal-schooling-in-south-africa-1658-1910",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "c. 1760",
        "event": "The Industrial Revolution",
        "details": "Work moves from the family unit (farm/workshop) to the factory. This physically separates the father from the home, transforming him from the master of a productive household to a \"breadwinner,\" an employee whose economic life is external to the family.",
        "primarySource": "https://www.cambridge.org/core/books/abs/economics-of-the-family/introduction-to-the-economics-of-the-family/0B4D5D4E6A7A6679589A644D251C7A92",
        "secondarySource": "Knowledge and Decisions, T. Sowell"
    },
    {
        "date": "1762",
        "event": "Rousseau and the Ideology of the State Surrogate",
        "details": "Philosopher Jean-Jacques Rousseau provides the explicit ideology for the state as the ultimate parent, arguing it must control a citizen's upbringing from infancy. This is contrasted with his abandonment of his own five children, a pattern of personal hypocrisy among intellectuals.",
        "primarySource": "The Social Contract, J.J. Rousseau",
        "secondarySource": "Intellectuals, P. Johnson, Ch. 1"
    },
    {
        "date": "1779-1879",
        "event": "The Xhosa Wars of Resistance",
        "details": "A century-long series of nine wars fought by the Xhosa people against Boer and British colonial expansion. This represents a direct clash between indigenous systems of governance and European colonialism.",
        "primarySource": "Oral histories and colonial records",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "1834-1836",
        "event": "Killing of Xhosa Chief Hintsa",
        "details": "During the Sixth War, the capture and killing of the Xhosa Paramount Chief Hintsa ka Khawuta by British forces symbolizes the destruction of Xhosa sovereignty and a major blow to their unified resistance.",
        "primarySource": "British colonial military records",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "c. 1815-1840",
        "event": "The Mfecane / Difaqane",
        "details": "A period of widespread warfare and disruption in Southern Africa, largely precipitated by the expansion of the Zulu Kingdom under Shaka. It reshaped the political map and scattered communities, making them more vulnerable to colonial expansion.",
        "primarySource": "Oral traditions of affected groups (e.g., Mfengu, Ndebele)",
        "secondarySource": "Unravelling Xhosa History"
    },
    {
        "date": "c. 1836-1845",
        "event": "The Great Trek",
        "details": "A mass migration of Boers (Voortrekkers) from the Cape Colony into the interior to escape British rule. This established a permanent white presence in the interior based on a rigid ideology of racial separatism, leading to the founding of the Boer Republics.",
        "primarySource": "Diaries of Voortrekker leaders (e.g., Louis Tregardt)",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1856-1858",
        "event": "Xhosa Cattle-Killing Movement",
        "details": "Driven by the prophecies of Nongqawuse, the Xhosa people destroy their cattle and crops in the belief it would expel the Europeans. The resulting famine shatters their society and ends their ability to mount effective military resistance.",
        "primarySource": "Account of the Nongqawuse Catastrophe by W.W. Gqoba",
        "secondarySource": "Beyond the Grave, Salatiso"
    },
    {
        "date": "1867 & 1886",
        "event": "Discovery of Diamonds and Gold",
        "details": "The discovery of diamonds in Kimberley (1867) and gold on the Witwatersrand (1886) creates a massive demand for cheap labor, driving the systematic destruction of African self-sufficient economies to create a landless proletariat for the mines.",
        "primarySource": "Records of the De Beers and Chamber of Mines corporations",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1884-1885",
        "event": "The Berlin Conference",
        "details": "European powers meet to formalize the \"Scramble for Africa,\" partitioning the continent among themselves without any African representation. This gives international legitimacy to the colonial project.",
        "primarySource": "General Act of the Berlin Conference",
        "secondarySource": "Intellectuals, P. Johnson"
    },
    {
        "date": "1894",
        "event": "The Glen Grey Act",
        "details": "Passed in the Cape Colony, this act was a blueprint for apartheid. It limited African land tenure to one-man-one-plot and imposed a labor tax to force men into the colonial wage economy, directly attacking the family structure and African economic independence.",
        "primarySource": "Cape Colony government gazette",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1899-1902",
        "event": "Second Anglo-Boer War",
        "details": "A brutal war fought between the British Empire and the Boer republics. The British victory leads to the consolidation of all of South Africa under British control, paving the way for the Union of South Africa.",
        "primarySource": "Treaty of Vereeniging",
        "secondarySource": "Knowledge and Decisions, T. Sowell"
    },
    {
        "date": "1910",
        "event": "The Union of South Africa",
        "details": "The formation of a self-governing dominion within the British Empire, founded on a political compromise between English-speaking whites and Afrikaners that ensures white unity at the expense of the black majority, who are excluded from power.",
        "primarySource": "The South Africa Act 1909",
        "secondarySource": "Beyond Redress, Salatiso"
    },
    {
        "date": "1913",
        "event": "The Natives' Land Act",
        "details": "A cornerstone of territorial segregation, this act restricted black land ownership to just 7% of the country (later expanded to 13%). It created a rootless, landless population forced to work on white-owned farms and in mines.",
        "primarySource": "The Natives' Land Act, 1913",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1948",
        "event": "Apartheid Systematized in South Africa",
        "details": "The National Party comes to power and implements apartheid as official state policy. A totalizing project of social engineering, it uses laws like the migrant labor system and influx control to deliberately engineer the absence of Black fathers from their families.",
        "primarySource": "https://www.sahistory.org.za/article/apartheid-and-reactions-it",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1950",
        "event": "Population Registration & Group Areas Acts",
        "details": "The Population Registration Act legally classifies every South African by race, the cornerstone of all other apartheid laws. The Group Areas Act enforces residential segregation, leading to the forced removal of millions of non-white people from their communities.",
        "primarySource": "Population Registration Act, No. 30 of 1950; Group Areas Act, No. 41 of 1950",
        "secondarySource": "Beyond Redress, Salatiso"
    },
    {
        "date": "1952",
        "event": "The Defiance Campaign",
        "details": "The ANC and its allies launch a mass civil disobedience campaign against unjust apartheid laws. Over 8,000 volunteers are arrested, marking a new phase of mass, non-violent resistance.",
        "primarySource": "Records of the African National Congress",
        "secondarySource": "The Quest for Buggz, Salatiso"
    },
    {
        "date": "1953",
        "event": "The Bantu Education Act",
        "details": "The apartheid state creates a deliberately inferior education system to engineer a permanent Black underclass, destroying community and mission schools. It is the ultimate cynical use of the \"surrogate\" school system as a tool of oppression.",
        "primarySource": "Bantu Education Act, No. 47 of 1953",
        "secondarySource": "The Homeschooling Father, Salatiso, Ch. 4"
    },
    {
        "date": "1955",
        "event": "The Freedom Charter",
        "details": "At the Congress of the People, a multi-racial coalition of anti-apartheid groups adopts the Freedom Charter, a visionary document calling for a non-racial, democratic South Africa.",
        "primarySource": "The Freedom Charter",
        "secondarySource": "Beyond Redress, Salatiso"
    },
    {
        "date": "1956",
        "event": "Birth of Mlandeli, a Successor to his Father",
        "details": "Salatiso's father is born in Nqabane, Transkei. His life would be circumscribed by apartheid laws, yet he would grow up to become an inspector and provide for his family, laying a foundation for his son despite the system.",
        "primarySource": "The Quest for Buggz, Salatiso",
        "secondarySource": "Beyond the Grave, Salatiso"
    },
    {
        "date": "1960",
        "event": "The Sharpeville Massacre",
        "details": "Police open fire on unarmed anti-pass law protestors, killing 69 people. The event leads to international condemnation and the banning of the ANC and PAC, forcing the liberation struggle underground and into an armed phase.",
        "primarySource": "United Nations reports on the Sharpeville Massacre",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "1970s",
        "event": "The Black Consciousness Movement",
        "details": "Led by Steve Biko, the BCM emerges with a philosophy of psychological liberation, calling on black people to reject internalized inferiority and reclaim their pride. This powerfully influences a new generation of activists.",
        "primarySource": "\"I Write What I Like\" - Steve Biko",
        "secondarySource": "Modern, Broke, and Confused, Salatiso"
    },
    {
        "date": "1976",
        "event": "The Soweto Uprising",
        "details": "A student protest against the mandatory use of Afrikaans in schools explodes into a nationwide revolt against Bantu Education and the entire apartheid system. The state's brutal crackdown radicalizes the struggle.",
        "primarySource": "Testimonies from the Cillié Commission of Inquiry",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "1982",
        "event": "Birth of the Son, Salatiso",
        "details": "Born in Fort Malan, Transkei, into a Xhosa family shaped by both tradition and the pressures of apartheid. His childhood is lived under the last years of the apartheid regime and the state of emergency.",
        "primarySource": "The Quest for Buggz, Salatiso",
        "secondarySource": "The Homeschooling Father, Salatiso"
    },
    {
        "date": "1990",
        "event": "Unbanning of Liberation Movements",
        "details": "President F.W. de Klerk announces the unbanning of the ANC and other movements and the release of Nelson Mandela, officially beginning the negotiation process to end apartheid.",
        "primarySource": "F.W. de Klerk's speech to Parliament, 2 February 1990",
        "secondarySource": "Beyond Redress, Salatiso"
    },
    {
        "date": "1993",
        "event": "Death of the Father, Salatiso Becomes Umlandeli",
        "details": "Salatiso's father dies at a young age, thrusting Salatiso, at age 11, into the role of his father's successor (Umlandeli) on the eve of South Africa's transition to democracy. This pivotal moment shapes his entire life and philosophy.",
        "primarySource": "The Quest for Buggz, Salatiso",
        "secondarySource": "Lessons from my mother, Salatiso"
    },
    {
        "date": "1994",
        "event": "South Africa's First Democratic Election",
        "details": "Apartheid officially ends with the first multiracial, democratic election. However, the subsequent implementation of race-based redress policies continues a form of state-sanctioned discrimination and social engineering.",
        "primarySource": "The Constitution of the Republic of South Africa, 1996",
        "secondarySource": "Beyond Redress, Salatiso"
    },
    {
        "date": "2005",
        "event": "The Children's Act is Implemented",
        "details": "Modern family law is implemented. While ostensibly gender-neutral, its application in Children's Courts is argued to be systematically biased against fathers, perpetuating the erosion of the family structure that was engineered by apartheid.",
        "primarySource": "The Children's Act 38 of 2005",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "2018",
        "event": "The Birth of Sazi a.k.a \"BuggZ\"",
        "details": "The birth of Salatiso's son. This event marks the start of a direct legal and personal battle against the family court system, becoming the catalyst for all of his subsequent research and work.",
        "primarySource": "The Quest for Buggz, Salatiso",
        "secondarySource": "Goliath's Reckoning, Salatiso"
    },
    {
        "date": "2023",
        "event": "The Homeschooling Father is Published",
        "details": "A culmination of Salatiso's experiences and insights, this book serves as a guide for fathers and families navigating the complexities of providing quality education for their families.",
        "primarySource": "The Homeschooling Father, Salatiso",
        "secondarySource": "The Quest for Buggz, Salatiso"
    },
    {
        "date": "2024",
        "event": "Goliath's Reckoning lays the Foundation for Flamea and Flamea.Org is born",
        "details": "Drawing from years of personal struggle, legal battles, and extensive research, Salatiso launches Flamea.org. The platform is the culmination of his quest, designed to provide tools and knowledge for others facing similar injustices, thereby reclaiming the family's autonomy from failing state surrogates.",
        "primarySource": "Goliath's Reckoning, Salatiso",
        "secondarySource": "The Quest for Buggz, Salatiso"
    }
]
