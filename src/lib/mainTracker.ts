const SELF_KEY = 'main_tracker_self'
const VISITOR_KEY = 'main_visitor_id'

function createVisitorId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function isMainSelfExcluded(): boolean {
  try {
    return localStorage.getItem(SELF_KEY) === '1'
  } catch {
    return false
  }
}

export function markMainSelfExcluded(): void {
  try {
    localStorage.setItem(SELF_KEY, '1')
  } catch {
    // ignore
  }
}

export function getOrCreateMainVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY)
    if (existing) return existing
    const id = createVisitorId()
    localStorage.setItem(VISITOR_KEY, id)
    return id
  } catch {
    return createVisitorId()
  }
}

/** Record one pageview for /main. No-ops if this browser is marked as you. */
export async function trackMainPageview(): Promise<void> {
  if (typeof window === 'undefined') return
  if (isMainSelfExcluded()) return

  // Collapse React Strict Mode double-mount + accidental rapid remounts
  try {
    const lockKey = 'main_hit_lock_ms'
    const now = Date.now()
    const last = Number(sessionStorage.getItem(lockKey) || 0)
    if (now - last < 2000) return
    sessionStorage.setItem(lockKey, String(now))
  } catch {
    // ignore
  }

  const visitorId = getOrCreateMainVisitorId()

  try {
    await fetch('/api/main-hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId }),
      keepalive: true,
    })
  } catch {
    // Tracking should never break the page
  }
}

export type MainStats = {
  pageviews: number
  uniqueVisitors: number
  persistence?: 'blob' | 'memory'
}

export async function fetchMainStats(): Promise<MainStats> {
  const res = await fetch('/api/main-stats', { cache: 'no-store' })
  const payload = (await res.json().catch(() => null)) as
    | (Partial<MainStats> & { error?: string })
    | null

  if (!res.ok) {
    throw new Error(payload?.error || `Stats request failed (${res.status})`)
  }

  return {
    pageviews: typeof payload?.pageviews === 'number' ? payload.pageviews : 0,
    uniqueVisitors: typeof payload?.uniqueVisitors === 'number' ? payload.uniqueVisitors : 0,
    persistence:
      payload?.persistence === 'blob' || payload?.persistence === 'memory'
        ? payload.persistence
        : undefined,
  }
}
