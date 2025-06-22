LegalHelp South AfricaThe Law, Demystified.LegalHelp is a community-driven, open-source web platform designed to make South African law accessible and understandable to every citizen. From navigating the court system to understanding your constitutional rights, LegalHelp provides the tools, information, and support needed to empower individuals on their legal journeys.This project has evolved from a simple information portal into a dynamic Single Page Application (SPA), offering a seamless, fast, and interactive user experience.✨ Key FeaturesResource Compass: An interactive map and searchable directory to find legal and support services across South Africa. This includes courts, government service points (DSD, Home Affairs), and NGOs, powered by a comprehensive, consolidated database.Personal Case Tracker: A secure, private tool for registered users to manage and track the steps, dates, and documents for any legal, administrative, or traditional process.Forms & Documents Hub: An intelligent wizard and manual explorer to help users find and understand the necessary legal forms for various situations.Community Platform: A space for legal professionals, students, and citizens to collaborate, share knowledge, and help keep the legal database accurate and up-to-date.Firebase Authentication: A complete user system allowing registration and login via Email/Password, Google, and Apple, with a dedicated user dashboard.Multi-language Support: The interface is designed to be translated into multiple South African languages to ensure maximum accessibility.🛠️ Technology StackLegalHelp is built with modern, accessible web technologies, focusing on performance and maintainability.Frontend:HTML5Tailwind CSS for styling.Vanilla JavaScript (ES6 Modules) for all client-side logic.Backend & Database:Firebase: Used for all backend services.Firebase Authentication for user management.Firestore as the NoSQL database for storing user data, case tracker information, and other application data.Architecture:Single Page Application (SPA): The application uses a client-side router (app-router.js) to dynamically load page content from templates within a single index.html shell. This results in a faster, app-like experience with no full-page reloads during navigation.📂 Project Structure (SPA Version)The project is organized into a modular structure to keep the code clean and scalable.legalhelp/
│
├── 📂 assets/
│   ├── 📂 css/
│   │   └── 📄 style.css
│   ├── 📂 js/
│   │   ├── 📂 modules/               # Page-specific JavaScript logic
│   │   │   ├── 📄 auth-module.js
│   │   │   ├── 📄 casetracker-module.js
│   │   │   ├── 📄 forms-module.js
│   │   │   ├── 📄 locator-module.js
│   │   │   └── 📄 ui-module.js
│   │   │
│   │   ├── 📄 app-router.js           # The core SPA router
│   │   ├── 📄 firebase-config.js     # Central Firebase credentials
│   │   ├── 📄 legalhelp-master-db.js  # Consolidated resource database
│   │   └── ... (other data files)
│   │
│   └── 📂 documents/
│
├── 📄 index.html                     # The main SPA shell with all content templates
├── 📄 login.html                     # Separate user login page
├── 📄 dashboard.html                 # Separate user dashboard page
│
└── 📄 README.md                      # This file
index.html is the main entry point.app-router.js handles all navigation.The /modules/ directory contains the specific JavaScript for each "page" or feature, which is loaded on demand by the router.🤝 How to ContributeThis is a living project built for the community, by the community. We welcome all contributions. Please visit the Community and Join the Movement sections on the website to see how you can help.