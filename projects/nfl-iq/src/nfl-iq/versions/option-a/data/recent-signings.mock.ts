import { ALL_NFL_TEAMS } from '../../../constants'

export type SigningType = 'Sold' | 'Resigned'

export type RecentSigning = {
  id: string
  /** ISO date — used for default newest-first ordering */
  date: string
  player: string
  position: string
  teamId: string
  type: SigningType
  price: string
  years: number
}

const NFL_TEAM_IDS = ALL_NFL_TEAMS.map((t) => t.id)

const SIGNING_PLAYER_POOL: { player: string; position: string }[] = [
  { player: 'Kenneth Walker III', position: 'RB' },
  { player: 'Micah Parsons', position: 'EDGE' },
  { player: 'James Cook', position: 'RB' },
  { player: 'Emmanuel Moseley', position: 'CB' },
  { player: 'Zack Baun', position: 'LB' },
  { player: 'Odafe Oweh', position: 'ED' },
  { player: 'Tyler Lockett', position: 'WR' },
  { player: 'D.J. Reed', position: 'CB' },
  { player: 'Javon Hargrave', position: 'DT' },
  { player: 'Noah Fant', position: 'TE' },
  { player: 'Cooper Kupp', position: 'WR' },
  { player: 'Justin Simmons', position: 'S' },
  { player: 'Joel Bitonio', position: 'G' },
  { player: 'Aaron Jones', position: 'RB' },
  { player: "Za'Darius Smith", position: 'ED' },
  { player: 'Taylor Moton', position: 'T' },
  { player: 'Jordan Poyer', position: 'S' },
  { player: 'Dalvin Cook', position: 'RB' },
  { player: 'Von Miller', position: 'ED' },
  { player: 'Xavier McKinney', position: 'S' },
  { player: 'Courtland Sutton', position: 'WR' },
  { player: 'Deebo Samuel', position: 'WR' },
  { player: 'Chris Jones', position: 'DT' },
  { player: 'Fred Warner', position: 'LB' },
  { player: 'Tristan Wirfs', position: 'T' },
  { player: 'Lamar Jackson', position: 'QB' },
  { player: 'Josh Allen', position: 'QB' },
  { player: 'Justin Jefferson', position: 'WR' },
]

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

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!
}

function formatDealPrice(millions: number): string {
  return `$${millions.toFixed(1)}M`
}

function buildRecentSignings(): RecentSigning[] {
  const rng = mulberry32(hashSeed('fa-recent-signings-v1'))
  const count = 28
  const signings: RecentSigning[] = []

  for (let i = 0; i < count; i++) {
    const poolEntry = SIGNING_PLAYER_POOL[i % SIGNING_PLAYER_POOL.length]!
    const dayOffset = Math.floor(i / 2)
    const date = new Date(2026, 2, 15 - dayOffset)
    const years = 2 + Math.floor(rng() * 4)
    const priceM = 1.2 + rng() * 28

    signings.push({
      id: `signing-${i}`,
      date: date.toISOString().slice(0, 10),
      player: poolEntry.player,
      position: poolEntry.position,
      teamId: pick(rng, NFL_TEAM_IDS),
      type: rng() < 0.58 ? 'Sold' : 'Resigned',
      price: formatDealPrice(priceM),
      years,
    })
  }

  return signings.sort((a, b) => b.date.localeCompare(a.date))
}

export const RECENT_SIGNINGS: RecentSigning[] = buildRecentSignings()
