import type { VercelRequest, VercelResponse } from '@vercel/node'
import { list, put } from '@vercel/blob'

export type MainAnalyticsStore = {
  pageviews: number
  visitorIds: string[]
}

const BLOB_PATHNAME = 'main-analytics.json'

/** In-memory fallback when Blob token is missing (local / misconfigured). */
let memoryStore: MainAnalyticsStore = { pageviews: 0, visitorIds: [] }

function emptyStore(): MainAnalyticsStore {
  return { pageviews: 0, visitorIds: [] }
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export async function loadMainAnalytics(): Promise<MainAnalyticsStore> {
  if (!hasBlobToken()) {
    return { ...memoryStore, visitorIds: [...memoryStore.visitorIds] }
  }

  try {
    const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 10 })
    const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME)
    if (!blob) return emptyStore()

    const res = await fetch(blob.url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
      cache: 'no-store',
    })
    if (!res.ok) return emptyStore()

    const data = (await res.json()) as Partial<MainAnalyticsStore>
    return {
      pageviews: typeof data.pageviews === 'number' ? data.pageviews : 0,
      visitorIds: Array.isArray(data.visitorIds)
        ? data.visitorIds.filter((id): id is string => typeof id === 'string')
        : [],
    }
  } catch {
    return emptyStore()
  }
}

export async function saveMainAnalytics(store: MainAnalyticsStore): Promise<void> {
  if (!hasBlobToken()) {
    memoryStore = {
      pageviews: store.pageviews,
      visitorIds: [...store.visitorIds],
    }
    return
  }

  await put(BLOB_PATHNAME, JSON.stringify(store), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}

export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function handleOptions(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    setCors(res)
    res.status(204).end()
    return true
  }
  return false
}
