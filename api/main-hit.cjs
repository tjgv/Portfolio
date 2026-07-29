module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(200).json({
    ok: true,
    pageviews: 1,
    uniqueVisitors: 1,
    persistence: 'cjs-smoke',
  })
}
