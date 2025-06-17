/**
 * Flamea.org - Articles Database
 * This file acts as a simple, manual database for articles.
 * To add a new article, simply copy the structure and add a new object to the array.
 * - 'slug' must be unique.
 * - 'date' should be in 'YYYY-MM-DD' format.
 * - 'category' should match one of the defined categories.
 * - 'content' uses backticks (`) to allow for multi-line HTML.
 */
export const articlesDB = [
    {
        slug: 'rethinking-competence-shortcomings-of-qualifications',
        title: 'Rethinking Competence: The Shortcomings of Formal Qualifications',
        author: 'Salatiso Mdeni',
        date: '2024-06-12',
        category: 'Opinion & Society',
        tags: ['competence', 'qualifications', 'education', 'south africa', 'meritocracy'],
        imageUrl: 'https://placehold.co/800x400/1F2937/FFFFFF?text=Rethinking+Competence',
        summary: 'In today\'s society, the value placed on formal qualifications as a measure of competence is deeply ingrained. This article delves into the limitations of this overemphasis...',
        content: `
            <p class="mb-4">In today's society, the value placed on formal qualifications as a measure of competence is deeply ingrained. Qualification scandals in South Africa, which highlight a rising trend of high-profile figures lying about their credentials, illustrate this point. Even in supposedly well-qualified workforces, systemic failures in governance and service delivery persist as indicated by the country’s declining socio-economic conditions.</p>
            <p class="mb-6">These events raise a crucial question: What truly defines competence in today's world? This article delves into the limitations of overemphasizing formal qualifications as the gold standard for measuring ability. We'll explore historical examples, contemporary challenges, and insights from academic research to paint a more nuanced picture of what makes someone truly competent.</p>

            <h3 class="text-2xl font-bold mt-8 mb-4 text-purple-400">The Parenting Paradox</h3>
            <p class="mb-6">Consider the most demanding job of all: raising children. Parents throughout history have tackled this monumental task without formal qualifications. Their success in raising you to adulthood is a testament to their competence. Despite lacking "degrees in parenting," they navigated sleepless nights, scraped knees, and teenage angst. Their expertise emerged from experience, love, and trial-and-error. If credentials were the sole measure of competence, then your parents, despite raising you successfully, would be deemed incompetent at parenting.</p>

            <h3 class="text-2xl font-bold mt-8 mb-4 text-purple-400">The Illusion of Meritocracy</h3>
            <p class="mb-4">The myth of meritocracy built on formal qualifications suggests a world where individuals rise based purely on skill and ability. However, reality paints a far more complex picture. High-profile scandals in South Africa, where individuals fabricated credentials to secure prestigious positions, illustrate this point.</p>
            <p class="mb-6">In a system overly fixated on qualifications, the ability to navigate the academic hurdles – not necessarily the ability to do the job – becomes the key to advancement. This becomes even more evident in senior positions, where individuals with impressive degrees may make decisions about jobs they've never held.</p>
            
            <!-- ... The rest of your article content can be pasted here as HTML ... -->

            <h3 class="text-2xl font-bold mt-8 mb-4 text-purple-400">Conclusion: Rethinking Competence</h3>
            <p class="mb-4">In conclusion, the overemphasis on formal qualifications as a criterion for determining competence is deeply flawed. Recent events in South Africa, coupled with historical precedents and academic discourse, highlight the limitations and shortcomings of this approach.</p>
            <p>Competence cannot be reduced to a piece of paper or a string of letters after one's name; it is a multifaceted concept that encompasses practical skills, experience, ethical conduct, and the ability to adapt to changing circumstances. At best, formal qualifications—degrees, diplomas, certifications—are prima facie evidence of competency.</p>
        `
    },
    // Add your next article here
];

export const articleCategories = [
    { name: 'All', icon: 'fas fa-globe' },
    { name: 'Opinion & Society', icon: 'fas fa-users' },
    { name: 'Family & Parenting', icon: 'fas fa-child' },
    { name: 'DIY & Hobbies', icon: 'fas fa-tools' },
    { name: 'Tech & Cars', icon: 'fas fa-car' },
    { name: 'Finance', icon: 'fas fa-wallet' },
];
