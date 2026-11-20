/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './404.html'],
  theme: {
    extend: {
      colors: {
        'background-light': '#FDF5E6',
        'primary-brown': '#6F4E37',
        'secondary-orange': '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
