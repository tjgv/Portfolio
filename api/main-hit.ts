import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  handleOptions,
  loadMainAnalytics,
  saveMainAnalytics,
  setCors,
} from './_lib/mainAnalytics'

function readVisitorId(req: VercelRequest): string | null {
  const body = req.body
  if (body && typeof body === 'object' && typeof body.visitorId === 'string') {
    const id = body.visitorId.trim()
    return id.length > 0 && id.length <= 128 ? id : null
  }
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body) as { visitorId?: unknown }
      if (typeof parsed.visitorId === 'string') {
        const id = parsed.visitorId.trim()
        return id.length > 0 && id.length <= 128 ? id : null
      }
    } catch {
      return null
    }
  }
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const visitorId = readVisitorId(req)
  if (!visitorId) {
    res.status(400).json({ error: 'visitorId required' })
    return
  }

  try {
    const store = await loadMainAnalytics()
    store.pageviews += 1
    if (!store.visitorIds.includes(visitorId)) {
      store.visitorIds.push(visitorId)
    }
    await saveMainAnalytics(store)

    res.status(200).json({
      ok: true,
      pageviews: store.pageviews,
      uniqueVisitors: store.visitorIds.length,
      persistence: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'memory',
    })
  } catch (error) {
    console.error('[main-hit]', error)
    res.status(500).json({ error: 'Failed to record hit' })
  }
}
