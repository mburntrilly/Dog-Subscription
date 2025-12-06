/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#fdf7f0',
        kraft: '#e4c9a2',
        sage: '#a5b79f'
      },
      fontFamily: {
        script: ['"Comic Sans MS"', 'cursive'],
        body: ['"Nunito"', '"Segoe UI"', 'sans-serif']
      }
    },
  },
  plugins: [],
};
