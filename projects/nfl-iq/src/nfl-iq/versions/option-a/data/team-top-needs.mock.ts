import type { TopNeedTag, TopNeedStatus } from './team-spending.mock'
import { hashTeamSeed, mulberry32, shuffle } from './big-board-team-view'

/** One of these pairs is always included in each team's top 5 needs. */
export const RIGGED_NEED_PAIRS = [
  ['WR', 'SL'],
  ['DT', 'ED'],
  ['LB', 'ED'],
] as const

const EXTRA_NEED_POOL = [
  'QB',
  'RB',
  'TE',
  'CB',
  'S',
  'C',
  'G',
  'T',
  'NT',
  'MLB',
  'FS',
  'SS',
  'OL',
  'DE',
  'FB',
  'K',
] as const

const DISPLAY_STATUSES: TopNeedStatus[] = ['done', 'partial', 'need']

function pickDisplayStatus(rng: () => number): TopNeedStatus {
  return DISPLAY_STATUSES[Math.floor(rng() * DISPLAY_STATUSES.length)]!
}

/** Deterministic top-5 needs: rigged pair + 3 extras with mixed done / addressed / need. */
export function generateTeamTopNeeds(teamId: string): TopNeedTag[] {
  const rng = mulberry32(hashTeamSeed(`fa-top-needs:${teamId}`))
  const pair =
    RIGGED_NEED_PAIRS[Math.floor(rng() * RIGGED_NEED_PAIRS.length)] ?? RIGGED_NEED_PAIRS[0]
  const pairSet = new Set<string>(pair)

  const available = EXTRA_NEED_POOL.filter((pos) => !pairSet.has(pos))
  const extras = shuffle([...available], rng).slice(0, 3)

  const tags: TopNeedTag[] = [
    ...pair.map((pos) => ({ pos, status: 'need' as const })),
    ...extras.map((pos) => ({ pos, status: pickDisplayStatus(rng) })),
  ]

  return shuffle(tags, rng)
}
