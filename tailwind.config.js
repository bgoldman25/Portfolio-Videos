/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        acid: '#B7FF00',
        dark: '#080808',
        charcoal: '#121212',
        surface: '#161616',
        panel: '#1E1E1E',
        muted: '#A9A9B0',
        'off-white': '#F4F4F0',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: { marquee: 'marquee 28s linear infinite' },
    },
  },
  plugins: [],
};
