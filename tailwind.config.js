/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' for dark mode based on system preference
  theme: {
    extend: {
      colors: {
        // You can customize your color palette here
      },
      spacing: {
        // Custom spacing if needed
      },
      fontFamily: {
        // Custom fonts if needed
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}