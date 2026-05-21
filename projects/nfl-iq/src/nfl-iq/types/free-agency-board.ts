export type FreeAgencyTrend = 'down' | 'up'

export type FreeAgencyAvailableAgent = {
  rank: number
  position: string
  player: string
  team2025: string
  trend2025?: FreeAgencyTrend
  age: number
  ageNearWall?: boolean
  gamesPlayed: number
  snaps: number
  snapsPerGame: number
  alignment: string
  topSpeed: number
  injuryOta?: boolean
}

export type FreeAgencyMarketPlayer = {
  position: string
  player: string
  team2026: string
  age: number
  aav: string
  elite?: boolean
}
