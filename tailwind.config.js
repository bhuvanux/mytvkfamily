/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './node_modules/@clerk/**/*.{js,ts,jsx,tsx}', // ✅ This enables Clerk UI styling
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
