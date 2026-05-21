/** Maps cheat-sheet display nicknames to NFL team IDs for logo URLs */
const CHEAT_SHEET_TEAM_IDS: Record<string, string> = {
  Raiders: 'LV',
  Jets: 'NYJ',
  Cardinals: 'ARI',
  Titans: 'TEN',
  Giants: 'NYG',
  Chiefs: 'KC',
  Commanders: 'WAS',
  Saints: 'NO',
  Browns: 'CLE',
  Cowboys: 'DAL',
  Dolphins: 'MIA',
  Rams: 'LAR',
  Ravens: 'BAL',
  Buccaneers: 'TB',
  Lions: 'DET',
  Vikings: 'MIN',
  Panthers: 'CAR',
  Eagles: 'PHI',
  Steelers: 'PIT',
  Bears: 'CHI',
  Texans: 'HOU',
  Patriots: 'NE',
  Seahawks: 'SEA',
}

export function cheatSheetTeamId(teamNickname: string): string {
  return CHEAT_SHEET_TEAM_IDS[teamNickname] ?? teamNickname
}
