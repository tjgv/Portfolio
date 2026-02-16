import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'
import { resolve } from 'path'
const root = process.cwd()

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Dev: serve index.html for client routes so /project1, /prompts/:slug etc. load the app
    {
      name: 'spa-fallback',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          if (url.startsWith('/src/') || url.startsWith('/@') || url.startsWith('/node_modules/') || url.startsWith('/assets/') || /\.[a-z0-9]+$/i.test(url.split('?')[0])) {
            return next()
          }
          req.url = '/index.html'
          next()
        })
      },
    },
    // Build: copy index.html to 404.html so hosts (e.g. GitHub Pages) serve the SPA on unknown paths
    {
      name: 'spa-404',
      closeBundle() {
        const outDir = resolve(root, 'dist')
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      },
    },
  ],
  server: {
    port: 5177,
    strictPort: true, // fail if 5177 is taken — close other dev server tabs/terminals first
  },
})
