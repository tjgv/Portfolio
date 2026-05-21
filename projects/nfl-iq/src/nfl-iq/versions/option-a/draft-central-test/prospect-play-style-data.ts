import type { DraftBoardProspect } from '../../../types'

export type ArchetypeSlice = {
  label: string
  pct: number
  color: string
}

export type PlayStyleComp = {
  year: number
  name: string
  similarity: number
  ngsProd: number
}

export type ProspectPlayStyleProfile = {
  archetypes: ArchetypeSlice[]
  comps: PlayStyleComp[]
  nflComparison: string
}

const ARCHETYPE_BY_POSITION: Record<string, { label: string; color: string }[]> = {
  RB: [
    { label: 'One Cut Elusive Back', color: '#3b82f6' },
    { label: 'Downhill Bruiser', color: '#9ca3af' },
    { label: 'Pass-Catching Back', color: '#22c55e' },
  ],
  WR: [
    { label: 'Vertical Threat', color: '#3b82f6' },
    { label: 'Possession Route Runner', color: '#9ca3af' },
    { label: 'YAC Playmaker', color: '#22c55e' },
  ],
  TE: [
    { label: 'Move TE', color: '#3b82f6' },
    { label: 'Inline Blocker', color: '#9ca3af' },
    { label: 'Red-Zone Target', color: '#22c55e' },
  ],
  QB: [
    { label: 'Rhythm Passer', color: '#3b82f6' },
    { label: 'Play-Action Operator', color: '#9ca3af' },
    { label: 'Scramble Creator', color: '#22c55e' },
  ],
  EDGE: [
    { label: 'Speed Rusher', color: '#3b82f6' },
    { label: 'Power Edge', color: '#9ca3af' },
    { label: 'Versatile Edge', color: '#22c55e' },
  ],
  DL: [
    { label: 'Penetrating 3-Tech', color: '#3b82f6' },
    { label: 'Two-Gap Nose', color: '#9ca3af' },
    { label: 'Run-Stuffer', color: '#22c55e' },
  ],
  LB: [
    { label: 'Sideline-to-Sideline', color: '#3b82f6' },
    { label: 'Blitzing LB', color: '#9ca3af' },
    { label: 'Coverage LB', color: '#22c55e' },
  ],
  CB: [
    { label: 'Press Man', color: '#3b82f6' },
    { label: 'Zone Cover', color: '#9ca3af' },
    { label: 'Ball Hawk', color: '#22c55e' },
  ],
  S: [
    { label: 'Deep Safety', color: '#3b82f6' },
    { label: 'Box Safety', color: '#9ca3af' },
    { label: 'Hybrid Nickel', color: '#22c55e' },
  ],
  OL: [
    { label: 'Pass Protector', color: '#3b82f6' },
    { label: 'Road Grader', color: '#9ca3af' },
    { label: 'Athletic Lineman', color: '#22c55e' },
  ],
}

const DEFAULT_ARCHETYPES = ARCHETYPE_BY_POSITION.RB

const NFL_COMP_BY_POSITION: Record<string, string[]> = {
  RB: ['Jahmyr Gibbs', 'Breece Hall', 'Kenneth Walker III', 'Bijan Robinson'],
  WR: ['Garrett Wilson', 'Chris Olave', 'Drake London', 'Jaxon Smith-Njigba'],
  TE: ['Sam LaPorta', 'Trey McBride', 'Kyle Pitts', 'Brock Bowers'],
  QB: ['C.J. Stroud', 'Anthony Richardson', 'Bo Nix', 'Jayden Daniels'],
  EDGE: ['Will Anderson Jr.', 'Jalen Carter', 'Laiatu Latu', 'Dallas Turner'],
  DL: ['Jalen Carter', 'Calijah Kancey', 'Tyleik Williams', 'Tyleik Williams'],
  LB: ['Jack Campbell', 'Devin Lloyd', 'Zavien Hamilton', 'Sonny Styles'],
  CB: ['Derek Stingley Jr.', 'Sauce Gardner', 'Patrick Surtain II', 'Joey Porter Jr.'],
  S: ['Kyle Hamilton', 'Jordan Battle', 'Tyler Nubin', 'Jalen McMillan'],
  OL: ['Peter Skoronski', 'Paris Johnson Jr.', 'Darnell Wright', 'Tyler Steen'],
}

const COMP_POOL: Omit<PlayStyleComp, 'similarity'>[] = [
  { year: 2022, name: 'Israel Abanikanda', ngsProd: 78 },
  { year: 2023, name: 'Mohamed Ibrahim', ngsProd: 78 },
  { year: 2022, name: 'Tyler Allgeier', ngsProd: 81 },
  { year: 2023, name: 'Bijan Robinson', ngsProd: 99 },
  { year: 2023, name: 'Roschon Johnson', ngsProd: 63 },
  { year: 2024, name: 'Greg Bell', ngsProd: 56 },
  { year: 2025, name: 'Devin Neal', ngsProd: 81 },
  { year: 2023, name: 'George Holani', ngsProd: 66 },
  { year: 2022, name: 'Jahmyr Gibbs', ngsProd: 92 },
  { year: 2023, name: 'Sean Tucker', ngsProd: 71 },
  { year: 2024, name: 'Ollie Gordon II', ngsProd: 88 },
  { year: 2022, name: 'Zach Charbonnet', ngsProd: 74 },
]

function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function archetypeTemplates(position: string) {
  const pos = position.toUpperCase()
  return ARCHETYPE_BY_POSITION[pos] ?? DEFAULT_ARCHETYPES
}

function nflCompPool(position: string): string[] {
  const pos = position.toUpperCase()
  return NFL_COMP_BY_POSITION[pos] ?? NFL_COMP_BY_POSITION.RB
}

/** Stable archetype % + comps for a prospect (mirrors NFL.com hover card). */
export function buildProspectPlayStyleProfile(
  prospect: DraftBoardProspect,
  prospectKey: string,
): ProspectPlayStyleProfile {
  const h = hashKey(prospectKey)
  const templates = archetypeTemplates(prospect.position)

  const raw = [
    42 + (h % 22),
    18 + ((h >> 3) % 18),
    8 + ((h >> 6) % 14),
  ]
  const sum = raw[0] + raw[1] + raw[2]
  const archetypes: ArchetypeSlice[] = templates.map((t, i) => ({
    label: t.label,
    color: t.color,
    pct: Math.round((raw[i] / sum) * 1000) / 10,
  }))

  const comps: PlayStyleComp[] = Array.from({ length: 8 }, (_, i) => {
    const entry = COMP_POOL[(h + i * 5) % COMP_POOL.length]
    const sim = 83.4 + ((h >> i) % 40) / 10
    return {
      ...entry,
      similarity: Math.round(sim * 10) / 10,
    }
  }).sort((a, b) => b.similarity - a.similarity)

  const nflPool = nflCompPool(prospect.position)
  const nflComparison = nflPool[h % nflPool.length]

  return { archetypes, comps, nflComparison }
}
