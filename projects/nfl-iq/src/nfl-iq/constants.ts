export const NFL_LOGO =
  'https://static.www.nfl.com/image/upload/v1554321393/league/nvfr7ogywskqrfaiu38m.png'

export const NFL_IQ_LOGO =
  'https://iq.nextgenstats.nfl.com/NFL_IQ_Primary_Horz.png'

export type NflTeamMeta = {
  id: string
  name: string
}

/** All 32 NFL teams for the quicksuite team picker */
export const ALL_NFL_TEAMS: NflTeamMeta[] = [
  { id: 'ARI', name: 'Arizona Cardinals' },
  { id: 'ATL', name: 'Atlanta Falcons' },
  { id: 'BAL', name: 'Baltimore Ravens' },
  { id: 'BUF', name: 'Buffalo Bills' },
  { id: 'CAR', name: 'Carolina Panthers' },
  { id: 'CHI', name: 'Chicago Bears' },
  { id: 'CIN', name: 'Cincinnati Bengals' },
  { id: 'CLE', name: 'Cleveland Browns' },
  { id: 'DAL', name: 'Dallas Cowboys' },
  { id: 'DEN', name: 'Denver Broncos' },
  { id: 'DET', name: 'Detroit Lions' },
  { id: 'GB', name: 'Green Bay Packers' },
  { id: 'HOU', name: 'Houston Texans' },
  { id: 'IND', name: 'Indianapolis Colts' },
  { id: 'JAX', name: 'Jacksonville Jaguars' },
  { id: 'KC', name: 'Kansas City Chiefs' },
  { id: 'LAC', name: 'Los Angeles Chargers' },
  { id: 'LAR', name: 'Los Angeles Rams' },
  { id: 'LV', name: 'Las Vegas Raiders' },
  { id: 'MIA', name: 'Miami Dolphins' },
  { id: 'MIN', name: 'Minnesota Vikings' },
  { id: 'NE', name: 'New England Patriots' },
  { id: 'NO', name: 'New Orleans Saints' },
  { id: 'NYG', name: 'New York Giants' },
  { id: 'NYJ', name: 'New York Jets' },
  { id: 'PHI', name: 'Philadelphia Eagles' },
  { id: 'PIT', name: 'Pittsburgh Steelers' },
  { id: 'SEA', name: 'Seattle Seahawks' },
  { id: 'SF', name: 'San Francisco 49ers' },
  { id: 'TB', name: 'Tampa Bay Buccaneers' },
  { id: 'TEN', name: 'Tennessee Titans' },
  { id: 'WAS', name: 'Washington Commanders' },
]

/** Mock 2026 draft order for “Draft” sort in team picker */
export const DRAFT_PICK_ORDER: string[] = [
  'LV',
  'NYJ',
  'TEN',
  'CLE',
  'NE',
  'ARI',
  'NYG',
  'CAR',
  'NO',
  'CHI',
  'SF',
  'MIA',
  'LAR',
  'DAL',
  'IND',
  'ATL',
  'CIN',
  'SEA',
  'TB',
  'DEN',
  'GB',
  'LAC',
  'PIT',
  'PHI',
  'MIN',
  'JAX',
  'DET',
  'BUF',
  'BAL',
  'HOU',
  'KC',
  'WAS',
]

export function espnTeamLogoUrl(teamId: string) {
  const slug = teamId === 'WAS' ? 'wsh' : teamId.toLowerCase()
  return `https://a.espncdn.com/i/teamlogos/nfl/500/${slug}.png`
}

export function teamLogoUrl(abbr: string) {
  return `https://static.www.nfl.com/h_48,w_48,q_auto,f_auto,dpr_2.0/league/api/clubs/logos/${abbr}`
}

/** NGS team logos used on nfl.com/iq draft board */
export function ngsTeamLogoUrl(teamId: string) {
  return `https://ngs.nfl.com/public/svg/logos/teams/${teamId}.svg`
}

export const SCORE_STRIP_GAMES = [
  { away: 'NE', home: 'SEA', network: 'NBC' },
  { away: 'SF', home: 'LAR', network: 'NETFLIX', intl: true },
  { away: 'CHI', home: 'CAR', network: 'FOX' },
  { away: 'TB', home: 'CIN', network: 'FOX' },
  { away: 'NO', home: 'DET', network: 'FOX' },
  { away: 'BUF', home: 'HOU', network: 'CBS' },
  { away: 'BAL', home: 'IND', network: 'CBS' },
  { away: 'DEN', home: 'KC', network: 'ESPN' },
]
