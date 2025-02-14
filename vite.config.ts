import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Корень для локальной разработки
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Разрешает доступ извне
    strictPort: true, // Гарантирует, что порт не изменится
    cors: true, // Разрешает CORS для всех источников
    proxy: {
      '/api': {
        target: 'https://resto-art.onrender.com', // Адрес API
        changeOrigin: true,
        secure: true, // true, если сервер работает на HTTPS
      },
    },
  },
});
