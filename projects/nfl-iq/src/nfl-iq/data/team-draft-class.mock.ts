import { prospectPortraitUrl } from '../versions/option-a/draft-central-test/prospect-portrait'

export type TeamDraftClassRow = {
  pk: string
  pos: string
  player: string
  portraitUrl: string
  rank: string
  ht: string
  wt: string
  ovr: string
  grade: 'high' | 'mid' | 'low'
  highlight?: boolean
}

const DRAFT_PROSPECTS: {
  pos: string
  player: string
  rank: string
  ht: string
  wt: string
  ovr: string
  grade: 'high' | 'mid' | 'low'
}[] = [
  { pos: 'OT', player: 'Joe Alt', rank: '12', ht: '6080', wt: '321', ovr: '92', grade: 'high' },
  { pos: 'WR', player: 'Xavier Worthy', rank: '28', ht: '6010', wt: '165', ovr: '88', grade: 'high' },
  { pos: 'DT', player: 'Tyleik Williams', rank: '45', ht: '6020', wt: '310', ovr: '76', grade: 'mid' },
  { pos: 'CB', player: 'Decamerion Richardson', rank: '89', ht: '6020', wt: '200', ovr: '71', grade: 'low' },
  { pos: 'QB', player: 'Michael Penix Jr.', rank: '18', ht: '6030', wt: '213', ovr: '85', grade: 'high' },
  { pos: 'LB', player: 'Payton Wilson', rank: '52', ht: '6040', wt: '242', ovr: '74', grade: 'mid' },
  { pos: 'S', player: 'Jalen McMillan', rank: '67', ht: '6010', wt: '192', ovr: '72', grade: 'mid' },
  { pos: 'TE', player: 'Ja\'Tavion Sanders', rank: '41', ht: '6040', wt: '252', ovr: '78', grade: 'mid' },
  { pos: 'RB', player: 'Blake Corum', rank: '95', ht: '5080', wt: '210', ovr: '69', grade: 'low' },
  { pos: 'ED', player: 'Jared Verse', rank: '22', ht: '6040', wt: '254', ovr: '86', grade: 'high' },
  { pos: 'G', player: 'Jonah Savaiinaea', rank: '38', ht: '6050', wt: '325', ovr: '80', grade: 'high' },
  { pos: 'C', player: 'Jackson Powers-Johnson', rank: '55', ht: '6040', wt: '328', ovr: '75', grade: 'mid' },
]

const PICK_ROUNDS = [1, 2, 3, 4, 5, 6] as const

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

function formatPick(round: number, slot: number): string {
  return `${round}-${String(slot).padStart(2, '0')}`
}

/** Illustrative draft board rows for Team Central (placeholder until API). */
export function getTeamDraftClassRows(teamId: string): TeamDraftClassRow[] {
  const rng = mulberry32(hashSeed(`draft-class:${teamId}`))
  const count = 10
  const rows: TeamDraftClassRow[] = []

  for (let i = 0; i < count; i++) {
    const prospect = DRAFT_PROSPECTS[(i + hashSeed(teamId)) % DRAFT_PROSPECTS.length]
    const round = PICK_ROUNDS[i % PICK_ROUNDS.length]
    const slot = 4 + Math.floor(rng() * 28) + i * 3
    const pk = formatPick(round, slot)
    rows.push({
      ...prospect,
      pk,
      portraitUrl: prospectPortraitUrl(pk, prospect.player),
      highlight: i === 2,
    })
  }

  return rows
}

export type TeamDraftClassLevel = {
  level: number
  grade: 'high' | 'mid' | 'low'
}

function ovrGradeForLevel(level: number): TeamDraftClassLevel['grade'] {
  if (level >= 82) return 'high'
  if (level >= 75) return 'mid'
  return 'low'
}

/** Stable draft class level (68–90) per team for the header badge. */
export function getTeamDraftClassLevel(teamId: string): TeamDraftClassLevel {
  const level = 68 + (hashSeed(`draft-class-level:${teamId}`) % 23)
  return { level, grade: ovrGradeForLevel(level) }
}
