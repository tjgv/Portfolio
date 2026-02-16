import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Serve index.html for client routes so /project1, /project2 etc. load the app instead of 404
    {
      name: 'spa-fallback',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          // Let static assets and Vite internals through
          if (url.startsWith('/src/') || url.startsWith('/@') || url.startsWith('/node_modules/') || url.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(url.split('?')[0])) {
            return next()
          }
          req.url = '/index.html'
          next()
        })
      },
    },
  ],
  server: {
    port: 5177,
    strictPort: true, // fail if 5177 is taken — close other dev server tabs/terminals first
  },
})
