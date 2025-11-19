/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7c3aed',
        accent: '#a855f7'
      },
      boxShadow: {
        card: '0 10px 25px rgba(0,0,0,0.08)'
      }
    },
  },
  plugins: [],
};
