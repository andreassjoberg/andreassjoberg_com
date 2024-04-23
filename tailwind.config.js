/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['"Crimson Pro Variable"', 'serif']
      },
      colors: {
        'palette-beige': '#F4F1DE',
        'palette-red': '#E07A5F',
        'palette-purple': '#3D405B',
        'palette-green': '#81B29A',
        'palette-yellow': '#F2CC8F'
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: false
  }
};
