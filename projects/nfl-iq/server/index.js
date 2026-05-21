import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {
  CHAT_RESPONSES,
  CHAT_SUGGESTIONS,
  DRAFT_BOARD,
  DEPTH_CHART,
  FREE_AGENTS,
  TEAM_NEEDS,
  TEAMS,
  TRANSACTIONS,
} from './data.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'NFL IQ API is running' })
})

app.get('/api/iq/teams', (_req, res) => {
  res.json({ teams: TEAMS })
})

const TEAM_META = {
  ARI: { name: 'Arizona Cardinals', conference: 'NFC', division: 'West' },
  ATL: { name: 'Atlanta Falcons', conference: 'NFC', division: 'South' },
  BAL: { name: 'Baltimore Ravens', conference: 'AFC', division: 'North' },
  BUF: { name: 'Buffalo Bills', conference: 'AFC', division: 'East' },
  CAR: { name: 'Carolina Panthers', conference: 'NFC', division: 'South' },
  CHI: { name: 'Chicago Bears', conference: 'NFC', division: 'North' },
  CIN: { name: 'Cincinnati Bengals', conference: 'AFC', division: 'North' },
  CLE: { name: 'Cleveland Browns', conference: 'AFC', division: 'North' },
  DAL: { name: 'Dallas Cowboys', conference: 'NFC', division: 'East' },
  DEN: { name: 'Denver Broncos', conference: 'AFC', division: 'West' },
  DET: { name: 'Detroit Lions', conference: 'NFC', division: 'North' },
  GB: { name: 'Green Bay Packers', conference: 'NFC', division: 'North' },
  HOU: { name: 'Houston Texans', conference: 'AFC', division: 'South' },
  IND: { name: 'Indianapolis Colts', conference: 'AFC', division: 'South' },
  JAX: { name: 'Jacksonville Jaguars', conference: 'AFC', division: 'South' },
  KC: { name: 'Kansas City Chiefs', conference: 'AFC', division: 'West' },
  LAC: { name: 'Los Angeles Chargers', conference: 'AFC', division: 'West' },
  LAR: { name: 'Los Angeles Rams', conference: 'NFC', division: 'West' },
  LV: { name: 'Las Vegas Raiders', conference: 'AFC', division: 'West' },
  MIA: { name: 'Miami Dolphins', conference: 'AFC', division: 'East' },
  MIN: { name: 'Minnesota Vikings', conference: 'NFC', division: 'North' },
  NE: { name: 'New England Patriots', conference: 'AFC', division: 'East' },
  NO: { name: 'New Orleans Saints', conference: 'NFC', division: 'South' },
  NYG: { name: 'New York Giants', conference: 'NFC', division: 'East' },
  NYJ: { name: 'New York Jets', conference: 'AFC', division: 'East' },
  PHI: { name: 'Philadelphia Eagles', conference: 'NFC', division: 'East' },
  PIT: { name: 'Pittsburgh Steelers', conference: 'AFC', division: 'North' },
  SEA: { name: 'Seattle Seahawks', conference: 'NFC', division: 'West' },
  SF: { name: 'San Francisco 49ers', conference: 'NFC', division: 'West' },
  TB: { name: 'Tampa Bay Buccaneers', conference: 'NFC', division: 'South' },
  TEN: { name: 'Tennessee Titans', conference: 'AFC', division: 'South' },
  WAS: { name: 'Washington Commanders', conference: 'NFC', division: 'East' },
}

function resolveTeam(id) {
  const upper = id.toUpperCase()
  const existing = TEAMS.find((t) => t.id === upper)
  if (existing) return existing
  const meta = TEAM_META[upper]
  if (!meta) return null
  return {
    id: upper,
    name: meta.name,
    conference: meta.conference,
    division: meta.division,
    capSpace: 14.5,
    draftPicks: 7,
    wins: 9,
  }
}

app.get('/api/iq/teams/:id', (req, res) => {
  const team = resolveTeam(req.params.id)
  if (!team) return res.status(404).json({ error: 'Team not found' })

  res.json({
    team,
    needs: TEAM_NEEDS[team.id] ?? [
      {
        position: 'EDGE',
        priority: 'Medium',
        note: 'Modeling roster needs for this team — check back for full breakdown',
      },
    ],
    depthChart: DEPTH_CHART[team.id] ?? [
      { unit: 'Offense', slots: ['Depth chart data loading for this team'] },
      { unit: 'Defense', slots: ['Depth chart data loading for this team'] },
    ],
  })
})

app.get('/api/iq/free-agency', (_req, res) => {
  res.json({ agents: FREE_AGENTS, transactions: TRANSACTIONS })
})

app.get('/api/iq/draft', (_req, res) => {
  res.json({ prospects: DRAFT_BOARD })
})

app.get('/api/iq/chat/suggestions', (_req, res) => {
  res.json({ suggestions: CHAT_SUGGESTIONS })
})

app.post('/api/iq/chat', (req, res) => {
  const message = String(req.body?.message ?? '').toLowerCase()
  let reply = CHAT_RESPONSES.default

  if (message.includes('seahawk')) reply = CHAT_RESPONSES.seahawks
  else if (message.includes('edge') || message.includes('rusher')) reply = CHAT_RESPONSES.edge
  else if (message.includes('draft score') || message.includes('ngs')) reply = CHAT_RESPONSES.draftscore
  else if (message.includes('lion') || message.includes('cap')) reply = CHAT_RESPONSES.lions

  res.json({ reply })
})

app.listen(PORT, () => {
  console.log(`NFL IQ API running at http://localhost:${PORT}`)
})
