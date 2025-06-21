# Flamea Web Platform - v2.0

**Project:** Flamea - Fathers' Rights & Advocacy
**Version:** 2.0
**Last Updated:** 2025-06-21

---

### 1. Project Overview

**Flamea** is a web-based platform dedicated to supporting and empowering fathers in South Africa, particularly those navigating the complexities of family law. The platform provides a rich set of resources, including educational content, interactive tools, community features, and direct access to legal information and templates.

The mission is to address systemic bias, provide practical guidance, and foster a supportive community to ensure children's best interests are served through equitable co-parenting.

### 2. Core Features

* **Educational Hub:** Articles, training courses, and access to a library of digital books.
* **Interactive Tools:**
    * **Parenting Plan Builder:** A step-by-step tool to create comprehensive, legally sound parenting plans.
    * **AI Chatbot:** An integrated assistant to answer questions on family law and platform features.
    * **Resource Locator:** A map-based tool to find legal aid, social services, and other support.
    * **Gamified Learning:** A suite of simple games designed to teach concepts about the constitution and family law.
* **Media Content:** An integrated podcast player to stream episodes directly from the "FLAMEA Voice" podcast.
* **Community & Advocacy:** Information on joining the movement, community discussion forums (future feature), and access to legal document templates.

### 3. Technology Stack

* **Frontend:** HTML5, Tailwind CSS, Vanilla JavaScript
* **Backend & Database:** Google Firebase (Firestore, Authentication)
* **APIs:** Google Gemini API

### 4. Getting Started & Development

#### Prerequisites
* A modern web browser (Chrome, Firefox, Edge).
* A local web server for development to avoid CORS issues.
* Node.js and npm (for running Tailwind CSS).

#### Setup
1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Install dependencies:**
    This project uses Tailwind CSS for styling. To recompile the CSS after making changes, you need to install the development dependencies.
    ```bash
    npm install
    ```
3.  **Run the Tailwind CSS compiler:**
    To watch for changes in your HTML and `input.css` file and automatically generate the `style.min.css` file, run:
    ```bash
    npm run tailwind
    ```
    This command is configured in `package.json`.

4.  **Firebase Configuration:**
    * A valid Firebase project must be set up.
    * The Firebase configuration object must be placed in `/assets/js/firebase-config.js`. **This file should not be committed to public repositories.**

### 5. File Structure
The project follows a standard web project structure. See the `Technical_Specification.md` document for a detailed breakdown. Key directories include:
* `/`: Root HTML files.
* `/assets/`: Contains all static assets (JS, CSS, images, documents, etc.).
* `/games/`: Self-contained game modules.
* `/training/`: Pages for training courses.

---
