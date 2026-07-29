import { get, put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

type Store = {
  pageviews: number
  visitorIds: string[]
}

const BLOB_PATHNAME = 'main-analytics.json'

function emptyStore(): Store {
  return { pageviews: 0, visitorIds: [] }
}

function blobOptions() {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  return token ? { token } : {}
}

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

async function loadStore(): Promise<Store> {
  const result = await get(BLOB_PATHNAME, {
    access: 'private',
    useCache: false,
    ...blobOptions(),
  })

  if (!result || result.statusCode !== 200 || !result.stream) {
    return emptyStore()
  }

  const text = await new Response(result.stream).text()
  if (!text) return emptyStore()

  const data = JSON.parse(text) as Partial<Store>
  return {
    pageviews: typeof data.pageviews === 'number' ? data.pageviews : 0,
    visitorIds: Array.isArray(data.visitorIds)
      ? data.visitorIds.filter((id): id is string => typeof id === 'string')
      : [],
  }
}

async function saveStore(store: Store): Promise<void> {
  await put(BLOB_PATHNAME, JSON.stringify(store), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    ...blobOptions(),
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)

  try {
    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const store = await loadStore()
    res.status(200).json({
      pageviews: store.pageviews,
      uniqueVisitors: store.visitorIds.length,
      persistence: process.env.BLOB_READ_WRITE_TOKEN ? 'blob-token' : 'blob-oidc',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[main-stats]', error)
    res.status(500).json({
      error: message,
      hint: 'Confirm Blob is connected and BLOB_READ_WRITE_TOKEN exists on Production, then redeploy.',
    })
  }
}
