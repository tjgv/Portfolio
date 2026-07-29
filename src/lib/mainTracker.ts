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
  if (!res.ok) {
    throw new Error(`Stats request failed (${res.status})`)
  }
  const data = (await res.json()) as Partial<MainStats>
  return {
    pageviews: typeof data.pageviews === 'number' ? data.pageviews : 0,
    uniqueVisitors: typeof data.uniqueVisitors === 'number' ? data.uniqueVisitors : 0,
    persistence: data.persistence === 'blob' || data.persistence === 'memory' ? data.persistence : undefined,
  }
}
