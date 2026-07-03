/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef1f8',
          100: '#d4dbec',
          200: '#a9b7d9',
          300: '#7e93c6',
          400: '#4a5f9e',
          500: '#1c2f5f',
          600: '#16264d',
          700: '#111d3d',
          800: '#0b1730',
          900: '#080f20',
          950: '#050914',
        },
        gold: {
          50: '#fbf6e7',
          100: '#f5e8bd',
          200: '#eed690',
          300: '#e6c35f',
          400: '#dbb03e',
          500: '#c99a2e',
          600: '#a87d22',
          700: '#82601a',
          800: '#5c4413',
          900: '#3a2b0c',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11,23,48,0.06), 0 8px 24px -8px rgba(11,23,48,0.18)',
        cardHover: '0 1px 2px rgba(11,23,48,0.08), 0 16px 32px -12px rgba(11,23,48,0.26)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
