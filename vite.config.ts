import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, 
    proxy: {
      '/api': {
        target: 'https://resto-art.onrender.com', 
        changeOrigin: true,
        secure: true, 
      },
    },
  },
});
