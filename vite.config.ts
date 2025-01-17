import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Корень для локальной разработки
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
