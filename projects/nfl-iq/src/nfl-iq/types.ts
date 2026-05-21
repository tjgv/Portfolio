export type Team = {
  id: string
  name: string
  conference: string
  division: string
  capSpace: number
  draftPicks: number
  wins: number
}

export type TeamNeed = {
  position: string
  priority: 'High' | 'Medium' | 'Low'
  note: string
}

export type DepthUnit = {
  unit: string
  slots: string[]
}

export type FreeAgent = {
  rank: number
  name: string
  position: string
  prevTeam: string
  status: string
  newTeam: string | null
  deal: string | null
}

export type Transaction = {
  date: string
  team: string
  summary: string
  type: string
}

export type DraftBoardProspect = {
  /** DJ rank; null when unranked (shown as em dash in the board) */
  djRank: number | null
  name: string
  school: string
  schoolAbbr: string
  schoolLogoUrl?: string | null
  position: string
  fortyMph?: string | null
  fortyTime?: string | null
  tenYd?: string | null
  broad?: string | null
  vert?: string | null
  shuttle?: string | null
  cone?: string | null
  bench?: string | null
  rawAth: number | null
  athleticism: number
  production: number
  overall: number
  ht: string
  wt: string
  hand?: string | null
  arm?: string | null
  wing?: string | null
}

export type IqSection = 'home' | 'teams' | 'free-agency' | 'draft' | 'news' | 'coach'
