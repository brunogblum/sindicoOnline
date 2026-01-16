import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    middlewareMode: false,
    fs: {
      strict: false
    },
    // Configurar redirecionamentos e proxy
    proxy: {
      // Proxy para APIs REST
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy para WebSocket (socket.io)
      '/socket.io': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        ws: true,
      },
      '/admin/audit-logs': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: () => '/audit.html'
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
