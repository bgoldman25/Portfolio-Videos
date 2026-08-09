/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        acid: '#B7FF00',
        'acid-glow': 'rgba(183, 255, 0, 0.25)',
        dark: '#080808',
        charcoal: '#121212',
        surface: '#161616',
        panel: '#1E1E1E',
        muted: '#8E8E93',
        'off-white': '#F4F4F0',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 1s linear infinite',
        'pulse-fast': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
