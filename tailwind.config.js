/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'azul-escuro-personalizado': '#0A2B4C',
      }
    },
  },
  plugins: [],
}