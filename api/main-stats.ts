import type { VercelRequest, VercelResponse } from '@vercel/node'
import { handleOptions, loadMainAnalytics, setCors } from './_lib/mainAnalytics'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res)
  if (handleOptions(req, res)) return

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const store = await loadMainAnalytics()
    res.status(200).json({
      pageviews: store.pageviews,
      uniqueVisitors: store.visitorIds.length,
      persistence: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'memory',
    })
  } catch (error) {
    console.error('[main-stats]', error)
    res.status(500).json({ error: 'Failed to load stats' })
  }
}
