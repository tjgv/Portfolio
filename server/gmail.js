/**
 * Gmail OAuth and API helpers. Requires GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and
 * API_BASE_URL (e.g. http://localhost:3001) in env. Redirect URI must be API_BASE_URL + /api/auth/gmail/callback
 */
import path from 'node:path'
import fs from 'node:fs'

const GMAIL_SCOPE = 'https://www.googleapis.com/auth/gmail.readonly'
const GMAIL_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GMAIL_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me'

function getDataDir() {
  const dir = path.join(process.cwd(), 'server', 'data')
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

function getConnectionPath() {
  return path.join(getDataDir(), 'gmail-connection.json')
}

export function getConnection() {
  try {
    const raw = fs.readFileSync(getConnectionPath(), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveConnection(data) {
  fs.writeFileSync(getConnectionPath(), JSON.stringify(data, null, 2), 'utf8')
}

export function getAuthUrl() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const baseUrl = (process.env.API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')
  const redirectUri = `${baseUrl}/api/auth/gmail/callback`
  if (!clientId) throw new Error('GOOGLE_CLIENT_ID is not set')
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GMAIL_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
  })
  return `${GMAIL_AUTH_URL}?${params.toString()}`
}

export function getRedirectUri() {
  const baseUrl = (process.env.API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '')
  return `${baseUrl}/api/auth/gmail/callback`
}

export async function exchangeCodeForTokens(code) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = getRedirectUri()
  if (!clientId || !clientSecret) throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set')

  const res = await fetch(GMAIL_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token exchange failed: ${res.status} ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
  }
}

export async function refreshAccessToken(refreshToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set')

  const res = await fetch(GMAIL_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
    }).toString(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token refresh failed: ${res.status} ${text.slice(0, 200)}`)
  }

  const data = await res.json()
  return {
    access_token: data.access_token,
    expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
  }
}

export async function getAccessToken() {
  const conn = getConnection()
  if (!conn?.refresh_token) return null

  const margin = 60 * 1000 // refresh 1 min before expiry
  if (conn.access_token && conn.expiry_date && conn.expiry_date > Date.now() + margin) {
    return conn.access_token
  }

  const refreshed = await refreshAccessToken(conn.refresh_token)
  const updated = {
    ...conn,
    access_token: refreshed.access_token,
    expiry_date: refreshed.expiry_date ?? conn.expiry_date,
  }
  saveConnection(updated)
  return updated.access_token
}

export async function getProfile(accessToken) {
  const res = await fetch(`${GMAIL_API_BASE}/profile`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`Gmail profile failed: ${res.status}`)
  return res.json()
}

export async function fetchLatestMessage() {
  const accessToken = await getAccessToken()
  if (!accessToken) return null

  const listRes = await fetch(
    `${GMAIL_API_BASE}/messages?maxResults=1&labelIds=INBOX`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!listRes.ok) throw new Error(`Gmail list failed: ${listRes.status}`)
  const listData = await listRes.json()
  const messages = listData.messages || []
  if (messages.length === 0) return null

  const msgRes = await fetch(
    `${GMAIL_API_BASE}/messages/${messages[0].id}?format=full`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!msgRes.ok) throw new Error(`Gmail get message failed: ${msgRes.status}`)
  const msg = await msgRes.json()

  const headers = (msg.payload?.headers || [])
  const getHeader = (name) => headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? ''

  let body = msg.snippet || ''
  const parts = msg.payload?.parts || []
  if (msg.payload?.body?.data) {
    try {
      body = Buffer.from(msg.payload.body.data, 'base64').toString('utf8')
    } catch {
      body = msg.snippet || ''
    }
  } else if (parts.length > 0) {
    const textPart = parts.find((p) => p.mimeType === 'text/plain')
    if (textPart?.body?.data) {
      try {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf8')
      } catch {}
    }
  }

  return {
    from: getHeader('From'),
    to: getHeader('To'),
    subject: getHeader('Subject'),
    snippet: msg.snippet || body.slice(0, 200),
    body: body.slice(0, 5000),
    date: getHeader('Date'),
  }
}

export function substituteEmailPlaceholders(text, email) {
  if (!text || !email) return text
  return text
    .replace(/\{\{email\.from\}\}/gi, email.from)
    .replace(/\{\{email\.to\}\}/gi, email.to)
    .replace(/\{\{email\.subject\}\}/gi, email.subject)
    .replace(/\{\{email\.snippet\}\}/gi, email.snippet)
    .replace(/\{\{email\.body\}\}/gi, email.body)
    .replace(/\{\{email\.date\}\}/gi, email.date)
}
