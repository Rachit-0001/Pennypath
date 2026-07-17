/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eefbf3',
          100: '#d6f5e0',
          200: '#aeebc4',
          300: '#7adca4',
          400: '#48c583',
          500: '#22a866',
          600: '#158a52',
          700: '#126e44',
          800: '#125738',
          900: '#0f472f',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
};
