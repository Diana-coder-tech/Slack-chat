import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['react-i18next'], // исключаем react-i18next из бандла
    },
  },
  server: {
    port: 5002,
    proxy: {
      '/api': {
        target: 'http://172.25.168.98',
        changeOrigin: false,
        secure: false,
      },
      cors: false,
      '/socket.io': {
        // target: 'ws://localhost:5001',
        target: 'http://172.25.168.98',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
});
