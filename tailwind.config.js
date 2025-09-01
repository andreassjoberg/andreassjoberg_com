/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}", 
    "./src/app.html",
    "./src/**/*.svelte"
  ],
  darkMode: "class",
  safelist: [
    'hover:bg-bg-hover',
    'hover:shadow-glow', 
    'hover:scale-[1.02]',
    'transition-all',
    'duration-200',
    'text-accent',
    'w-full',
    // Background colors
    'bg-black',
    'bg-bg',
    'bg-bg-card',
    'bg-bg-hover',
    'bg-accent',
    // Text colors
    'text-text',
    'text-text-muted',
    'text-accent',
    // Button styles
    'btn-primary',
    'btn-secondary',
    // Layout
    'min-h-screen',
    'flex',
    'items-center',
    'justify-center'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: "#121212",
          card: "#181818",
          hover: "#282828",
          border: "#2A2A2A",
        },
        text: {
          DEFAULT: "#E5E5E5",
          muted: "#B3B3B3",
        },
        accent: {
          DEFAULT: "#1DB954",
        },
      },
      borderRadius: { 
        xl2: "1.25rem" 
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 0 0 3px rgba(29,185,84,0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
