import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://chat-app-ejxv.onrender.com',
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: 'https://chat-app-ejxv.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true, // Enable WebSocket proxying
      },
    },
  },
});