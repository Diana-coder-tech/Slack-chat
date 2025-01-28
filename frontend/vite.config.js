import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5002,
    proxy: {
      // Проксируем запросы к API
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true, // Изменяем origin для запросов
        rewrite: (path) => path.replace(/^\/api/, '/api'), 
      },
      // Проксируем WebSocket соединения
      '/ws': {
        target: 'ws://localhost:5001',
        rewrite: (path) => path.replace(/^\/ws/, ''),
        ws: true,
        rewriteWsOrigin: true,
      },
    },
    historyApiFallback: true,
  },
});
