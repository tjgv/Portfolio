/** Vite `base` (always ends with `/`), e.g. `/` or `/nfl-iq/`. */
export const APP_BASE = import.meta.env.BASE_URL

/** React Router `basename` (no trailing slash). */
export function routerBasename(): string | undefined {
  const base = APP_BASE.replace(/\/$/, '')
  return base || undefined
}

/** Public asset under Vite `public/` (images, favicon, etc.). */
export function publicAsset(path: string): string {
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${APP_BASE}${clean}`
}

/** In-app path for `<a href>` when not using React Router `Link`. */
export function appRoute(path: string): string {
  const base = APP_BASE.replace(/\/$/, '')
  if (!path || path === '/') return base || '/'
  const segment = path.startsWith('/') ? path : `/${path}`
  return `${base}${segment}`
}
