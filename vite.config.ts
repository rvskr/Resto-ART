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
    strictPort: true, // Фиксирует порт
    cors: true, // Включает CORS
  },
  preview: {
    host: true, // Разрешает предпросмотр на внешнем хосте
  },
});
