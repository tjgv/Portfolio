import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, cpSync, existsSync, rmSync } from 'fs'
import { resolve } from 'path'
const root = process.cwd()

function giqOrPortfolioSpaFallback(
  req: { url?: string | null },
  _res: unknown,
  next: () => void,
) {
  const url = req.url ?? ''
  const pathname = url.split('?')[0]
  const query = url.includes('?') ? url.slice(url.indexOf('?')) : ''

  // Hidden NFL IQ app at /giq (static bundle in public/giq, not a React route)
  if (pathname === '/giq' || pathname === '/giq/') {
    req.url = `/giq/index.html${query}`
    return next()
  }
  if (pathname.startsWith('/giq/')) {
    if (
      pathname.startsWith('/giq/assets/') ||
      pathname.startsWith('/giq/images/') ||
      /\.[a-z0-9]+$/i.test(pathname)
    ) {
      return next()
    }
    req.url = `/giq/index.html${query}`
    return next()
  }

  // Portfolio SPA
  if (
    url.startsWith('/api') ||
    url.startsWith('/src/') ||
    url.startsWith('/@') ||
    url.startsWith('/node_modules/') ||
    url.startsWith('/assets/') ||
    /\.[a-z0-9]+$/i.test(pathname)
  ) {
    return next()
  }
  req.url = `/index.html${query}`
  next()
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Dev/preview: SPA fallbacks for portfolio routes and /giq client routes
    {
      name: 'spa-fallback',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use(giqOrPortfolioSpaFallback)
      },
      configurePreviewServer(server) {
        server.middlewares.use(giqOrPortfolioSpaFallback)
      },
    },
    // Build: ensure NFL IQ bundle is in dist (Vercel serves dist/giq as static files)
    {
      name: 'copy-giq-to-dist',
      closeBundle() {
        const src = resolve(root, 'public/giq')
        const dest = resolve(root, 'dist/giq')
        if (!existsSync(resolve(src, 'index.html'))) {
          throw new Error('[copy-giq] public/giq/index.html missing — run build:nfl-iq first')
        }
        rmSync(dest, { recursive: true, force: true })
        cpSync(src, dest, { recursive: true })
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
    // Listen on all interfaces so you can open the dev URL from a phone on the same Wi‑Fi
    host: true,
    port: 5177,
    strictPort: true, // fail if 5177 is taken — close other dev server tabs/terminals first
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // Production build preview (`npm run build && npm run preview`) — same LAN access as dev
  preview: {
    host: true,
    port: 4177,
    strictPort: true,
  },
})
