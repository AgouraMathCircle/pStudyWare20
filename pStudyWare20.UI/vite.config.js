import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy PDF document requests to backend server
      '/pStudyWare/Documents': {
        target: 'http://localhost:5281',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, '->', proxyReq.path);
          });
        },
      },
      // Also proxy pstudyware (lowercase) for compatibility
      '/pstudyware/Documents': {
        target: 'http://localhost:5281',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
  },
})
