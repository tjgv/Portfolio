export type TeamRosterRow = {
  pos: string
  player: string
  age: string
  yrs: string
  aav: string
  status: string
  ageHighlight?: boolean
}

export type TeamRosterTab = 'STARTERS' | 'TOP 51' | '90-MAN'

export const TEAM_ROSTER_TAB_COUNTS: Record<TeamRosterTab, number> = {
  STARTERS: 11,
  'TOP 51': 51,
  '90-MAN': 90,
}

const STARTER_POSITIONS = [
  'QB',
  'RB',
  'WR',
  'WR',
  'TE',
  'T',
  'G',
  'C',
  'ED',
  'DT',
  'CB',
] as const

const ROSTER_POSITION_POOL = [
  'QB',
  'RB',
  'WR',
  'TE',
  'T',
  'G',
  'C',
  'ED',
  'DT',
  'LB',
  'CB',
  'S',
] as const

const FIRST_NAMES = [
  'James',
  'Michael',
  'Chris',
  'David',
  'Justin',
  'Jordan',
  'Tyler',
  'Brandon',
  'Kevin',
  'Jason',
  'Brian',
  'Eric',
  'Ryan',
  'Kyle',
  'Matt',
  'Josh',
  'Aaron',
  'Patrick',
  'Derek',
  'Trevor',
] as const

const LAST_NAMES = [
  'Johnson',
  'Williams',
  'Brown',
  'Davis',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Garcia',
  'Robinson',
  'Clark',
  'Lewis',
  'Walker',
] as const

function hashSeed(key: string): number {
  let h = 2166136261
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function yrsDots(yearsLeft: number): string {
  const n = Math.min(5, Math.max(0, yearsLeft))
  return '.'.repeat(n) || '—'
}

function formatAav(millions: number): string {
  if (millions >= 10) return `${millions.toFixed(1)}M`
  return `${millions.toFixed(1)}M`
}

function parseAavM(aav: string): number {
  const n = parseFloat(aav.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]
}

function buildPlayerName(rng: () => number, index: number): string {
  const first = pick(rng, FIRST_NAMES)
  const last = pick(rng, LAST_NAMES)
  if (index < 28) return `${first} ${last}`
  return `${first} ${last} ${index - 27}`
}

function buildRow(
  rng: () => number,
  index: number,
  pos: string,
): TeamRosterRow {
  const ageNum = 22 + Math.floor(rng() * 14)
  const yrsLeft = Math.floor(rng() * 6)
  const aavM = 0.75 + rng() * 38
  const statusRoll = rng()
  const status =
    statusRoll < 0.12
      ? '◆'
      : statusRoll < 0.22
        ? 'NEW'
        : statusRoll < 0.32
          ? '?'
          : statusRoll < 0.42
            ? '↗'
            : ''

  return {
    pos,
    player: buildPlayerName(rng, index),
    age: String(ageNum),
    yrs: yrsDots(yrsLeft),
    aav: formatAav(aavM),
    status,
    ageHighlight: ageNum >= 32,
  }
}

export function getTeamRosterRows(teamId: string, tab: TeamRosterTab): TeamRosterRow[] {
  const count = TEAM_ROSTER_TAB_COUNTS[tab]
  const rng = mulberry32(hashSeed(`roster:${teamId}:${tab}`))

  if (tab === 'STARTERS') {
    return STARTER_POSITIONS.map((pos, i) => buildRow(rng, i, pos))
  }

  const rows: TeamRosterRow[] = []
  for (let i = 0; i < count; i++) {
    const pos = ROSTER_POSITION_POOL[i % ROSTER_POSITION_POOL.length]
    rows.push(buildRow(rng, i, pos))
  }
  return rows
}

export function summarizeTeamRosterRows(rows: TeamRosterRow[]): {
  avgAge: string
  totalAav: string
} {
  if (rows.length === 0) {
    return { avgAge: '—', totalAav: '—' }
  }

  const ages = rows.map((r) => parseInt(r.age, 10)).filter((n) => Number.isFinite(n))
  const avgAge =
    ages.length > 0
      ? String(Math.round(ages.reduce((a, b) => a + b, 0) / ages.length))
      : '—'

  const totalM = rows.reduce((sum, r) => sum + parseAavM(r.aav), 0)
  const totalAav = `${totalM.toFixed(1)}M`

  return { avgAge, totalAav }
}
