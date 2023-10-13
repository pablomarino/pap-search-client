/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts}'],
  daisyui: {
    themes: ['light', 'night', 'aqua'],
  },
  plugins: [require("daisyui")],
};
