/** 32 teams in 8 divisions (4 teams each), AFC then NFC. */
export const NFL_DIVISIONS: readonly string[][] = [
  ['BUF', 'MIA', 'NE', 'NYJ'],
  ['BAL', 'CIN', 'CLE', 'PIT'],
  ['HOU', 'IND', 'JAX', 'TEN'],
  ['DEN', 'KC', 'LV', 'LAC'],
  ['DAL', 'NYG', 'PHI', 'WAS'],
  ['CHI', 'DET', 'GB', 'MIN'],
  ['ATL', 'CAR', 'NO', 'TB'],
  ['ARI', 'LAR', 'SF', 'SEA'],
] as const

export function getDivisionForTeam(teamId: string): string[] {
  for (const division of NFL_DIVISIONS) {
    if (division.includes(teamId)) {
      return [...division]
    }
  }
  return [...NFL_DIVISIONS[0]]
}

export function getDivisionIndex(teamId: string): number {
  return NFL_DIVISIONS.findIndex((division) => division.includes(teamId))
}
