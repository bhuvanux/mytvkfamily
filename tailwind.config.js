/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        tamil: ['"TAU-Mullai"', 'sans-serif'],
        tamilBold: ['"TAU-Mullai Bold"', 'sans-serif'], // optional for bold style
      },
    },
  },
  plugins: [],
};