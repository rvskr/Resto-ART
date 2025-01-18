/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'base': 'clamp(1rem, 2vw, 1.5rem)', // Динамичный размер для обычного текста
        '2xl': 'clamp(2rem, 5vw, 4rem)',  // Динамичный размер для заголовков
        'xl': 'clamp(1.25rem, 3vw, 2rem)', // Динамичный размер для текста
      },
    },
  },
  plugins: [],
};
