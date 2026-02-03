/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#0a1929',
          dark: '#1a365d',
          blue: '#2c5282',
          light: '#4299e1',
          aqua: '#63b3ed',
        },
        mystic: {
          purple: '#6b46c1',
          violet: '#8b5cf6',
          lavender: '#a78bfa',
        }
      },
      fontFamily: {
        elegant: ['Playfair Display', 'serif'],
        modern: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
