export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  try {
    const { get } = await import('@vercel/blob')
    const pathname = 'main-analytics.json'
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const opts = {
      access: 'private',
      useCache: false,
      ...(token ? { token } : {}),
    }

    let pageviews = 0
    let visitorIds = []

    try {
      const result = await get(pathname, opts)
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

    res.status(200).json({
      pageviews,
      uniqueVisitors: visitorIds.length,
      persistence: token ? 'blob-token' : 'blob-oidc',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[main-stats]', error)
    res.status(500).json({
      error: message,
      hint: 'Confirm Blob is connected, BLOB_READ_WRITE_TOKEN is on Production, then redeploy.',
      hasToken: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      hasStoreId: Boolean(process.env.BLOB_STORE_ID),
    })
  }
}
