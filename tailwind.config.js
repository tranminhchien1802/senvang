/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gold': '#D4AF37',
        'navy': '#003366',
        'gold-light': '#E6C25C',
        'navy-light': '#336699',
        'navy-dark': '#001F4D',
        'black': '#000000',
      },
    },
  },
  plugins: [],
}