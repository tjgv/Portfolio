export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { get, put } = await import('@vercel/blob')
    const pathname = 'main-analytics.json'
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const opts = token ? { token } : {}

    let visitorId = ''
    const body = req.body
    if (body && typeof body === 'object' && typeof body.visitorId === 'string') {
      visitorId = body.visitorId.trim()
    } else if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body)
        if (typeof parsed.visitorId === 'string') visitorId = parsed.visitorId.trim()
      } catch {
        // ignore
      }
    }

    if (!visitorId || visitorId.length > 128) {
      res.status(400).json({ error: 'visitorId required' })
      return
    }

    let pageviews = 0
    let visitorIds = []

    try {
      const result = await get(pathname, {
        access: 'private',
        useCache: false,
        ...opts,
      })
      if (result && result.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text()
        if (text) {
          const data = JSON.parse(text)
          pageviews = typeof data.pageviews === 'number' ? data.pageviews : 0
          visitorIds = Array.isArray(data.visitorIds)
            ? data.visitorIds.filter((id) => typeof id === 'string')
            : []
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!/not found|404|BlobNotFound/i.test(message)) throw err
    }

    pageviews += 1
    if (!visitorIds.includes(visitorId)) visitorIds.push(visitorId)

    await put(pathname, JSON.stringify({ pageviews, visitorIds }), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...opts,
    })

    res.status(200).json({
      ok: true,
      pageviews,
      uniqueVisitors: visitorIds.length,
      persistence: token ? 'blob-token' : 'blob-oidc',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[main-hit]', error)
    res.status(500).json({
      error: message,
      hint: 'Confirm Blob is connected, BLOB_READ_WRITE_TOKEN is on Production, then redeploy.',
      hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      hasStoreId: Boolean(process.env.BLOB_STORE_ID),
    })
  }
}
