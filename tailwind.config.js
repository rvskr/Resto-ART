/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        // Минимальный и максимальный размер шрифта для текста
        'base': 'clamp(1rem, 2vw, 1.5rem)',  // Минимум 1rem, максимум 1.5rem
        'xl': 'clamp(1.25rem, 3vw, 2rem)',   // Минимум 1.25rem, максимум 2rem
        '2xl': 'clamp(2rem, 5vw, 4rem)',     // Минимум 2rem, максимум 4rem
      },
    },
  },
  plugins: [],
};
