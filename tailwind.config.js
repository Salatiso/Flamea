/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',           // Scans all HTML files in the root (e.g., index.html, sidebar.html)
    './games/*.html',     // Scans HTML files in the "games" folder
    './training/*.html',  // Scans HTML files in the "training" folder
    './assets/js/*.js'    // Scans JS files in the "assets/js" folder for Tailwind classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./games/**/*.html",
    "./training/**/*.html",
    "./assets/**/*.js",
  ],
  theme: {
    extend: {
        // You can extend your theme here if needed
    },
  },
  plugins: [],
}