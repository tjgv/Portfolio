export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    pageviews: 0,
    uniqueVisitors: 0,
    persistence: 'probe',
  })
}
