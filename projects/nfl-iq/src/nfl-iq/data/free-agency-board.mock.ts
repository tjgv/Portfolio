import { ALL_NFL_TEAMS } from '../constants'
import type {
  FreeAgencyAvailableAgent,
  FreeAgencyMarketPlayer,
} from '../types/free-agency-board'

export const FREE_AGENCY_AVAILABLE_COUNT = 50

const NFL_TEAM_IDS = ALL_NFL_TEAMS.map((t) => t.id)

const POSITION_POOL = [
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
  'Malik',
  'Devin',
  'Cameron',
  'Nate',
  'Isaiah',
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
  'Hall',
  'Young',
  'Allen',
  'Wright',
  'King',
] as const

/** Hand-curated agents (shown at ranks 37–50). */
const SEED_AGENTS: Omit<FreeAgencyAvailableAgent, 'rank'>[] = [
  { position: 'ED', player: 'Odafe Oweh', team2025: 'BAL', trend2025: 'down', age: 27, gamesPlayed: 17, snaps: 812, snapsPerGame: 47.8, alignment: 'EDGE (534), DT (11)', topSpeed: 17.33 },
  { position: 'WR', player: 'Tyler Lockett', team2025: 'SEA', trend2025: 'down', age: 33, ageNearWall: true, gamesPlayed: 16, snaps: 621, snapsPerGame: 38.8, alignment: 'WR (612), SL (24)', topSpeed: 19.12, injuryOta: true },
  { position: 'CB', player: 'D.J. Reed', team2025: 'NYJ', trend2025: 'down', age: 29, ageNearWall: true, gamesPlayed: 15, snaps: 891, snapsPerGame: 59.4, alignment: 'CB (891)', topSpeed: 20.44 },
  { position: 'LB', player: 'Zack Baun', team2025: 'PHI', age: 29, ageNearWall: true, gamesPlayed: 17, snaps: 978, snapsPerGame: 57.5, alignment: 'LB (812), EDGE (166)', topSpeed: 18.91 },
  { position: 'DT', player: 'Javon Hargrave', team2025: 'SF', trend2025: 'down', age: 32, ageNearWall: true, gamesPlayed: 14, snaps: 512, snapsPerGame: 36.6, alignment: 'DT (498), EDGE (14)', topSpeed: 16.02 },
  { position: 'TE', player: 'Noah Fant', team2025: 'SEA', trend2025: 'down', age: 28, gamesPlayed: 16, snaps: 702, snapsPerGame: 43.9, alignment: 'TE (702)', topSpeed: 18.24 },
  { position: 'WR', player: 'Cooper Kupp', team2025: 'LAR', trend2025: 'down', age: 32, ageNearWall: true, gamesPlayed: 12, snaps: 488, snapsPerGame: 40.7, alignment: 'WR (412), SL (76)', topSpeed: 18.88, injuryOta: true },
  { position: 'S', player: 'Justin Simmons', team2025: 'DEN', age: 31, ageNearWall: true, gamesPlayed: 17, snaps: 1044, snapsPerGame: 61.4, alignment: 'S (1044)', topSpeed: 19.55 },
  { position: 'G', player: 'Joel Bitonio', team2025: 'CLE', age: 34, ageNearWall: true, gamesPlayed: 16, snaps: 1012, snapsPerGame: 63.3, alignment: 'G (1012)', topSpeed: 15.41 },
  { position: 'QB', player: 'Aaron Rodgers', team2025: 'NYJ', trend2025: 'down', age: 42, ageNearWall: true, gamesPlayed: 17, snaps: 1028, snapsPerGame: 60.5, alignment: 'QB (1028)', topSpeed: 16.18 },
  { position: 'RB', player: 'Aaron Jones', team2025: 'MIN', trend2025: 'down', age: 31, ageNearWall: true, gamesPlayed: 15, snaps: 412, snapsPerGame: 27.5, alignment: 'RB (388), WR (24)', topSpeed: 20.12 },
  { position: 'ED', player: 'Za\'Darius Smith', team2025: 'CLE', age: 33, ageNearWall: true, gamesPlayed: 13, snaps: 498, snapsPerGame: 38.3, alignment: 'EDGE (482), DT (16)', topSpeed: 17.08 },
  { position: 'CB', player: 'Emmanuel Moseley', team2025: 'DET', trend2025: 'down', age: 29, gamesPlayed: 11, snaps: 612, snapsPerGame: 55.6, alignment: 'CB (612)', topSpeed: 20.01 },
  { position: 'T', player: 'Taylor Moton', team2025: 'CAR', age: 31, ageNearWall: true, gamesPlayed: 17, snaps: 1088, snapsPerGame: 64.0, alignment: 'T (1088)', topSpeed: 14.88 },
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

function buildPlayerName(rng: () => number, index: number): string {
  const first = pick(rng, FIRST_NAMES)
  const last = pick(rng, LAST_NAMES)
  if (index % 9 !== 0) return `${first} ${last}`
  return `${first} ${last} Jr.`
}

function buildAlignment(position: string, snaps: number, rng: () => number): string {
  const primary = Math.max(1, snaps - Math.floor(rng() * 40))
  switch (position) {
    case 'ED': {
      const edge = Math.floor(primary * (0.85 + rng() * 0.1))
      const dt = primary - edge
      return dt > 8 ? `EDGE (${edge}), DT (${dt})` : `EDGE (${primary})`
    }
    case 'LB': {
      const lb = Math.floor(primary * (0.75 + rng() * 0.15))
      const edge = primary - lb
      return edge > 40 ? `LB (${lb}), EDGE (${edge})` : `LB (${primary})`
    }
    case 'WR': {
      const wr = Math.floor(primary * (0.88 + rng() * 0.08))
      const sl = primary - wr
      return sl > 12 ? `WR (${wr}), SL (${sl})` : `WR (${primary})`
    }
    case 'RB': {
      const rb = Math.floor(primary * (0.92 + rng() * 0.06))
      const wr = primary - rb
      return wr > 10 ? `RB (${rb}), WR (${wr})` : `RB (${primary})`
    }
    default:
      return `${position} (${primary})`
  }
}

function buildGeneratedAgent(
  rng: () => number,
  rank: number,
): FreeAgencyAvailableAgent {
  const position = POSITION_POOL[(rank + Math.floor(rng() * 5)) % POSITION_POOL.length]!
  const age = 23 + Math.floor(rng() * 11)
  const gamesPlayed = 12 + Math.floor(rng() * 6)
  const snaps = 520 + Math.floor(rng() * 560)
  const snapsPerGame = Math.round((snaps / gamesPlayed) * 10) / 10
  const topSpeed =
    position === 'QB' || position === 'T' || position === 'G' || position === 'C'
      ? 14.5 + rng() * 2.5
      : position === 'ED' || position === 'DT'
        ? 16 + rng() * 2.5
        : 18 + rng() * 3.5

  const agent: FreeAgencyAvailableAgent = {
    rank,
    position,
    player: buildPlayerName(rng, rank),
    team2025: pick(rng, NFL_TEAM_IDS),
    age,
    gamesPlayed,
    snaps,
    snapsPerGame,
    alignment: buildAlignment(position, snaps, rng),
    topSpeed: Math.round(topSpeed * 100) / 100,
  }

  if (age >= 32) agent.ageNearWall = true
  if (rng() < 0.18) agent.trend2025 = rng() < 0.55 ? 'down' : 'up'
  if (rng() < 0.08) agent.injuryOta = true

  return agent
}

function buildFreeAgencyAvailable(): FreeAgencyAvailableAgent[] {
  const generatedCount = FREE_AGENCY_AVAILABLE_COUNT - SEED_AGENTS.length
  const rng = mulberry32(hashSeed('fa-available-agents-v1'))
  const generated: FreeAgencyAvailableAgent[] = []

  for (let rank = 1; rank <= generatedCount; rank++) {
    generated.push(buildGeneratedAgent(rng, rank))
  }

  const seeds: FreeAgencyAvailableAgent[] = SEED_AGENTS.map((seed, i) => ({
    ...seed,
    rank: generatedCount + 1 + i,
  }))

  return [...generated, ...seeds]
}

export const FREE_AGENCY_AVAILABLE: FreeAgencyAvailableAgent[] =
  buildFreeAgencyAvailable()

export const FREE_AGENCY_MARKET: FreeAgencyMarketPlayer[] = [
  { position: 'QB', player: 'Josh Allen', team2026: 'BUF', age: 30, aav: '$60M', elite: true },
  { position: 'QB', player: 'Lamar Jackson', team2026: 'BAL', age: 29, aav: '$55M', elite: true },
  { position: 'EDGE', player: 'Micah Parsons', team2026: 'GB', age: 26, aav: '$46.5M', elite: true },
  { position: 'WR', player: 'Justin Jefferson', team2026: 'MIN', age: 26, aav: '$35M', elite: true },
  { position: 'RB', player: 'Christian McCaffrey', team2026: 'SF', age: 29, aav: '$19M' },
  { position: 'TE', player: 'Travis Kelce', team2026: 'KC', age: 36, aav: '$17M', elite: true },
  { position: 'CB', player: 'Sauce Gardner', team2026: 'NYJ', age: 25, aav: '$20M', elite: true },
  { position: 'S', player: 'Minkah Fitzpatrick', team2026: 'MIA', age: 29, aav: '$18.5M' },
  { position: 'DT', player: 'Chris Jones', team2026: 'KC', age: 31, aav: '$31M', elite: true },
  { position: 'LB', player: 'Fred Warner', team2026: 'SF', age: 29, aav: '$19M' },
  { position: 'G', player: 'Chris Lindstrom', team2026: 'ATL', age: 28, aav: '$21M' },
  { position: 'T', player: 'Tristan Wirfs', team2026: 'TB', age: 27, aav: '$25M', elite: true },
]
