/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './404.html'],
  theme: {
    extend: {
      colors: {
        ardoise: '#262C38',
        'ardoise-deep': '#1B2029',
        papier: '#F4F6F8',
        lagon: '#0E7C86',
        'lagon-light': '#3CC4CF',
        rose: '#C2185B',
        amber: '#FFC94A',
      },
      fontFamily: {
        body: ['Barlow', 'system-ui', 'sans-serif'],
        display: ['"Big Shoulders Display"', 'Impact', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
