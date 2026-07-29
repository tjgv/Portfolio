module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  res.status(200).json({
    pageviews: 0,
    uniqueVisitors: 0,
    persistence: 'cjs-smoke',
  })
}
