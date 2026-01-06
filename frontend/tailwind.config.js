/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#dcfce7', // 100
          DEFAULT: '#16a34a', // 600
          dark: '#14532d', // 900
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        brand: {
          light: '#f0fdfa', // Very light teal-green
          DEFAULT: '#0f766e', // Teal/Emerald mix (Original Deep)
          dark: '#0d5e58',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        earth: {
          50: '#fdfbf7', // Warm Paper
          100: '#f5f0e6',
          200: '#e8dec9',
          300: '#d6c6a5',
          400: '#bfab7f',
          500: '#a8905e',
          600: '#8c7345',
          700: '#705936',
          800: '#5c4931',
          900: '#4d3d2a',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
