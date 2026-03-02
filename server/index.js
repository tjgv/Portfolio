/**
 * Workflow run API – executes workflow steps (Discord, Gmail-linked runs).
 * Env: DISCORD_BOT_TOKEN; for Gmail: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL (e.g. http://localhost:3001).
 */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  getAuthUrl,
  getRedirectUri,
  exchangeCodeForTokens,
  getConnection,
  saveConnection,
  getProfile,
  getAccessToken,
  fetchLatestMessage,
  substituteEmailPlaceholders,
} from './gmail.js'

const app = express()
const PORT = process.env.PORT ?? 3001
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5177'

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

// Health check – hit from browser to confirm proxy: http://localhost:5177/api/health
app.get('/api/health', (req, res) => {
  console.log('[api] health check received')
  res.json({ ok: true, message: 'Workflow API is reachable' })
})

// ----- Gmail OAuth -----
app.get('/api/auth/gmail', (req, res) => {
  try {
    const url = getAuthUrl()
    res.redirect(url)
  } catch (e) {
    res.status(500).json({ error: e?.message || 'Gmail auth not configured' })
  }
})

app.get('/api/auth/gmail/callback', async (req, res) => {
  const { code, error } = req.query
  const redirect = `${FRONTEND_URL}/workflow${error ? '?gmail=error' : '?gmail=connected'}`
  if (error || !code) {
    return res.redirect(redirect)
  }
  try {
    const tokens = await exchangeCodeForTokens(code)
    const accessToken = tokens.access_token
    const profile = await getProfile(accessToken)
    const email = profile.emailAddress || ''
    saveConnection({
      email,
      refresh_token: tokens.refresh_token,
      access_token: accessToken,
      expiry_date: tokens.expiry_date,
    })
    res.redirect(redirect)
  } catch (e) {
    console.error('Gmail callback error:', e)
    res.redirect(`${FRONTEND_URL}/workflow?gmail=error&message=${encodeURIComponent(e?.message || '')}`)
  }
})

app.get('/api/gmail/me', (req, res) => {
  const conn = getConnection()
  if (!conn?.email) {
    return res.json({ connected: false })
  }
  res.json({ connected: true, email: conn.email })
})

/**
 * POST /api/run-workflow
 * Body: { nodes: Node[], edges: Edge[] }
 * If workflow has "New email received" trigger, fetches latest Gmail and substitutes {{email.*}} in Discord messages.
 * Finds action nodes with kind 'discord' and posts each message to the configured channel.
 */
app.post('/api/run-workflow', async (req, res) => {
  const { nodes = [], edges = [] } = req.body

  if (!Array.isArray(nodes) || !Array.isArray(edges)) {
    return res.status(400).json({ error: 'Request body must include nodes and edges arrays.' })
  }

  const hasEmailTrigger = nodes.some(
    (n) => n?.type === 'trigger' && n.data?.kind === 'email-received'
  )
  let emailContext = null
  if (hasEmailTrigger) {
    console.log('[run-workflow] New email received trigger – checking Gmail…')
    const conn = getConnection()
    if (!conn?.refresh_token) {
      console.log('[run-workflow] Gmail not connected')
      return res.status(400).json({
        error: 'Connect Gmail first to use the "New email received" trigger. Use the "Connect Gmail" button.',
      })
    }
    try {
      emailContext = await fetchLatestMessage()
      if (emailContext) {
        console.log('[run-workflow] Fetched latest email from:', emailContext.from?.slice(0, 50), 'subject:', emailContext.subject?.slice(0, 50))
      }
    } catch (e) {
      console.error('[run-workflow] Gmail fetch error:', e?.message)
      return res.status(502).json({
        error: `Failed to fetch latest email: ${e?.message || 'Unknown error'}. Try disconnecting and reconnecting Gmail.`,
      })
    }
    if (!emailContext) {
      console.log('[run-workflow] No emails in inbox')
      return res.status(200).json({
        ok: true,
        message: 'No emails in inbox to process.',
      })
    }
  }

  const discordActions = nodes.filter(
    (n) => n?.type === 'action' && n.data?.kind === 'discord'
  )

  console.log('[run-workflow] nodes:', nodes.length, 'discord actions:', discordActions.length)

  if (discordActions.length === 0) {
    return res.status(200).json({
      ok: true,
      message: 'Workflow run completed (no Discord actions to execute).',
    })
  }

  if (!DISCORD_BOT_TOKEN) {
    return res.status(500).json({
      error: 'Discord is not configured. Set DISCORD_BOT_TOKEN in the server environment.',
    })
  }

  const toPost = discordActions
    .map((n) => {
      const channelId = (n.data?.config?.channel ?? '').toString().trim()
      let content = (n.data?.config?.message ?? n.data?.config?.content ?? '').toString().trim()
      if (emailContext) {
        content = substituteEmailPlaceholders(content, emailContext)
      }
      return { channelId, content }
    })
    .filter(({ channelId, content }) => /^\d+$/.test(channelId) && content.length > 0)

  const invalidChannel = discordActions.find((n) => {
    const ch = (n.data?.config?.channel ?? '').toString().trim()
    return !ch || !/^\d+$/.test(ch)
  })
  if (invalidChannel) {
    return res.status(400).json({
      error:
        'Discord action requires a numeric Channel ID. In Discord: enable Developer Mode, right‑click the channel → Copy channel ID.',
    })
  }

  const emptyMessage = discordActions.find((n) => {
    const msg = (n.data?.config?.message ?? n.data?.config?.content ?? '').toString().trim()
    return !msg
  })
  if (emptyMessage) {
    return res.status(400).json({
      error: 'Each Discord action must have a non-empty Message.',
    })
  }

  try {
    console.log('[run-workflow] posting to Discord:', toPost.length, 'message(s)')
    for (const { channelId, content } of toPost) {
      const discordUrl = `https://discord.com/api/v10/channels/${channelId}/messages`
      const response = await fetch(discordUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const text = await response.text()
        let errMessage = `Discord API error ${response.status}`
        try {
          const json = JSON.parse(text)
          if (json.message) errMessage = json.message
        } catch {
          if (text) errMessage = text.slice(0, 200)
        }
        console.error('[run-workflow] Discord API error:', response.status, errMessage)
        return res.status(502).json({
          error: `Failed to post to Discord: ${errMessage}`,
        })
      }
      console.log('[run-workflow] Discord message posted to channel', channelId)
    }

    return res.status(200).json({
      ok: true,
      message: `Posted ${toPost.length} message(s) to Discord.`,
    })
  } catch (e) {
    return res.status(500).json({
      error: e?.message ?? 'Server error while posting to Discord.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`Workflow API running at http://localhost:${PORT}`)
  if (!DISCORD_BOT_TOKEN) {
    console.warn('DISCORD_BOT_TOKEN is not set – Discord actions will fail.')
  }
})
