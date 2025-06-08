// assets/js/community.js
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const auth = window.flamea.auth;
const db = window.flamea.db;

const createPostContainer = document.getElementById('create-post-container');
const loginPrompt = document.getElementById('forum-login-prompt');
const createPostForm = document.getElementById('create-post-form');
const postsListContainer = document.getElementById('posts-list-container');

let postsListener = null;

const renderPosts = (posts) => {
    if (!postsListContainer) return;
    postsListContainer.innerHTML = ''; // Clear loading message

    if (posts.length === 0) {
        postsListContainer.innerHTML = '<p class="text-center text-gray-500 py-8">No discussions started yet. Be the first!</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow';
        const postDate = new Date(post.createdAt).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' });

        postElement.innerHTML = `
            <a href="#" class="block">
                <h3 class="font-bold text-lg text-blue-800 hover:underline">${post.title}</h3>
                <p class="text-sm text-gray-500 mt-2">
                    Started by <span class="font-semibold">${post.authorName || 'a member'}</span> on ${postDate}
                </p>
                <div class="mt-4 flex justify-between items-center text-sm">
                    <span class="text-gray-600">0 Replies</span>
                    <span class="flex items-center gap-2 text-blue-600 font-semibold">
                        View Discussion <ion-icon name="arrow-forward-outline"></ion-icon>
                    </span>
                </div>
            </a>
        `;
        postsListContainer.appendChild(postElement);
    });
};

const setupPostsListener = () => {
    const postsRef = collection(db, "communityPosts");
    const q = query(postsRef, orderBy("createdAt", "desc"));

    postsListener = onSnapshot(q, (snapshot) => {
        const posts = [];
        snapshot.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));
        renderPosts(posts);
    }, (error) => {
        console.error("Error fetching community posts:", error);
        postsListContainer.innerHTML = '<p class="text-red-500 text-center py-8">Could not load discussions. Please try again later.</p>';
    });
};

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    if (!createPostContainer || !loginPrompt) return;

    if (user) {
        // User is logged in
        createPostContainer.classList.remove('hidden');
        loginPrompt.classList.add('hidden');
    } else {
        // User is logged out
        createPostContainer.classList.add('hidden');
        loginPrompt.classList.remove('hidden');
    }
});

// Handle form submission for new posts
if (createPostForm) {
    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to start a discussion.");
            return;
        }

        const postData = {
            title: document.getElementById('post-title').value,
            content: document.getElementById('post-content').value,
            authorId: user.uid,
            authorName: user.displayName || user.email.split('@')[0],
            createdAt: new Date().toISOString(),
            replies: 0,
            upvotes: 0
        };

        if (!postData.title || !postData.content) {
            alert("Please provide a title and content for your post.");
            return;
        }

        try {
            const postsRef = collection(db, "communityPosts");
            await addDoc(postsRef, postData);
            alert("Your discussion topic has been posted!");
            createPostForm.reset();
        } catch (error) {
            console.error("Error creating post:", error);
            alert("There was an error posting your topic. Please try again.");
        }
    });
}

// Initial load of posts
setupPostsListener();
