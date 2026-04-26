const functions = require('firebase-functions')
const fetch = require('node-fetch')

const CANVAS_BASE = 'https://canvas.uw.edu/api/v1'
const TOKEN = '10~aN8kxh2nPKtxQz4EuYvTeE7htZERn83kDGGwMxxz39XFGNaykWDmWutfQ4UFcPze'

exports.canvasProxy = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  const path = req.path  // e.g. /courses or /courses/123/assignments
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  const url = `${CANVAS_BASE}${path}${query}`

  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
    const data = await upstream.json()
    res.status(upstream.status).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
