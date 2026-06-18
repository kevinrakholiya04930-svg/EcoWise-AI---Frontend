/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0f0a',
          surface: '#111a11',
          elevated: '#1a2b1a',
        },
        accent: {
          green: '#22c55e',
          emerald: '#10b981',
          lime: '#84cc16',
        },
        text: {
          primary: '#f0fdf4',
          secondary: '#86efac',
          muted: '#4ade80',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
