import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          if (
            url.startsWith('/api') ||
            url.startsWith('/src/') ||
            url.startsWith('/@') ||
            url.startsWith('/node_modules/') ||
            url.startsWith('/assets/') ||
            /\.[a-z0-9]+$/i.test(url.split('?')[0])
          ) {
            return next()
          }
          req.url = '/index.html'
          next()
        })
      },
    },
    {
      name: 'spa-404',
      closeBundle() {
        const outDir = resolve(root, 'dist')
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5177,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '127.0.0.1',
    port: 4177,
    strictPort: true,
  },
})
