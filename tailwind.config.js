/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // <<< CORREÇÃO APLICADA AQUI
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Encode Sans', 'sans-serif'],
      },
      colors: {
        'primary': '#1154D9',
        'primary-dark': '#0F5CBF',
        'secondary': '#3BBF82',
        'dark-bg': '#081526',
        'light-bg': '#F2F2F2',
      }
    },
  },
  plugins: [],
}