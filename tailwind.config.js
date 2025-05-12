/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mining-themed color palette
        primary: '#1F2937',
        secondary: '#F59E0B',
        accent: '#10B981'
      }
    },
  },
  plugins: [],
}