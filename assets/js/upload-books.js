/**
 * Flamea.org - AI-Powered Firestore Knowledge Base Uploader
 *
 * Description:
 * This Node.js script reads .docx and .txt files, splits them into chunks,
 * uses the Gemini AI to generate keywords for each chunk, checks for duplicates
 * using a content hash, and uploads new content to the 'knowledge_base' collection.
 *
 * Instructions:
 * 1. Follow the setup guide to create the project folder and get credentials.
 * 2. Install dependencies: npm install firebase-admin mammoth @google/generative-ai crypto
 * 3. Place book/article files into the './books' subdirectory.
 * 4. Run from your terminal: `node upload-books.js`
 */

const admin = require('firebase-admin');
const fs = require('fs').promises;
const path = require('path');
const mammoth = require('mammoth');
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- CONFIGURATION ---
const SERVICE_ACCOUNT_FILE = './serviceAccountKey.json';
const API_KEY = ""; // LEAVE EMPTY - WILL BE POPULATED IN THE ENVIRONMENT
const COLLECTION_NAME = 'knowledge_base';
const BOOKS_DIRECTORY = path.join(__dirname, 'books');
const CHUNK_SIZE = 2500; // Characters per chunk (approx. 400-500 words)

// --- INITIALIZE FIREBASE & GEMINI ---
try {
    const serviceAccount = require(SERVICE_ACCOUNT_FILE);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized.');
} catch (error) {
    console.error('Firebase Admin initialization failed. Is serviceAccountKey.json present?', error.message);
    process.exit(1);
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


/**
 * Creates a unique and consistent hash for a string of content.
 * @param {string} text The content to hash.
 * @returns {string} A SHA-256 hash.
 */
function createContentHash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Splits text into manageable chunks.
 * @param {string} text The full text to chunk.
 * @returns {string[]} An array of text chunks.
 */
function chunkText(text) {
    const chunks = [];
    let remainingText = text.replace(/\s\s+/g, ' ').trim(); // Standardize whitespace

    while (remainingText.length > 0) {
        if (remainingText.length <= CHUNK_SIZE) {
            chunks.push(remainingText);
            break;
        }
        let chunk = remainingText.substring(0, CHUNK_SIZE);
        let lastPeriod = chunk.lastIndexOf('.');
        let lastNewLine = chunk.lastIndexOf('\n');
        let splitPoint = Math.max(lastPeriod, lastNewLine);

        // If no good split point found, use last space
        if (splitPoint === -1) {
            splitPoint = chunk.lastIndexOf(' ');
        }
        // If still no space, force a split
        if (splitPoint === -1) {
             splitPoint = CHUNK_SIZE;
        }

        chunk = remainingText.substring(0, splitPoint + 1);
        chunks.push(chunk.trim());
        remainingText = remainingText.substring(chunk.length).trim();
    }
    return chunks;
}

/**
 * Uses the Gemini API to generate keywords for a text chunk.
 * @param {string} content The text chunk.
 * @returns {Promise<string[]>} A promise that resolves to an array of keywords.
 */
async function generateKeywords(content) {
    const prompt = `Analyze the following text and extract a list of 5-10 precise, relevant keywords or key phrases that capture the main topics. Return the keywords as a JSON array of strings. Text: "${content}"`;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // Clean and parse the JSON response
        const jsonString = text.replace(/```json|```/g, '').trim();
        const keywords = JSON.parse(jsonString);
        return Array.isArray(keywords) ? keywords.map(k => k.toLowerCase()) : [];
    } catch (error) {
        console.error('  -> AI Keyword generation failed:', error.message);
        return []; // Return empty array on failure
    }
}


/**
 * Main function to process all books, generate keywords, and upload new content.
 */
async function processAndUpload() {
    console.log('--- Flamea Knowledge Base Uploader (AI-Powered) ---');
    try {
        const files = await fs.readdir(BOOKS_DIRECTORY);

        for (const file of files) {
            const filePath = path.join(BOOKS_DIRECTORY, file);
            let textContent = '';
            console.log(`\n[Processing]: ${file}`);

            if (path.extname(file).toLowerCase() === '.docx') {
                textContent = (await mammoth.extractRawText({ path: filePath })).value;
            } else if (path.extname(file).toLowerCase() === '.txt') {
                textContent = await fs.readFile(filePath, 'utf8');
            } else {
                console.log(`  -> Skipping unsupported file: ${file}`);
                continue;
            }

            if (!textContent.trim()) {
                console.log('  -> Skipping empty file.');
                continue;
            }

            const chunks = chunkText(textContent);
            console.log(`  -> Split into ${chunks.length} chunk(s).`);

            for (const [index, chunk] of chunks.entries()) {
                const contentHash = createContentHash(chunk);
                const docRef = db.collection(COLLECTION_NAME).where('content_hash', '==', contentHash);
                const snapshot = await docRef.get();

                if (snapshot.empty) {
                    console.log(`    - Processing new chunk ${index + 1}...`);
                    const keywords = await generateKeywords(chunk);
                    console.log(`      > AI Keywords: [${keywords.join(', ')}]`);

                    const docData = {
                        book_title: path.basename(file, path.extname(file)).replace(/_/g, ' '),
                        source_file: file,
                        content: chunk,
                        content_hash: contentHash,
                        keywords: keywords,
                        chunk_number: index + 1,
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    };
                    await db.collection(COLLECTION_NAME).add(docData);
                    console.log(`      > Uploaded to Firestore.`);

                } else {
                    console.log(`    - Skipping duplicate chunk ${index + 1}.`);
                }
            }
        }
        console.log('\n--- Upload Process Complete ---');
    } catch (error) {
        console.error('\nAn error occurred during the process:', error);
    }
}

processAndUpload();
