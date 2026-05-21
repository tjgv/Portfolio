import { publicAsset } from '../lib/app-paths'

export type IqHomeValuePick = {
  overall: string
  pickLabel: string
  teamId: string
  playerName: string
  position: string
  schoolAbbr: string
  schoolLogoUrl: string
  playerPhotoUrl: string
}

const VALUE_PICK_PHOTOS = [
  publicAsset('/images/home/value-picks/player-1.png'),
  publicAsset('/images/home/value-picks/makai-lemon.png'),
  publicAsset('/images/home/value-picks/player-arvell.png'),
  publicAsset('/images/home/value-picks/dillon-thieneman.png'),
  publicAsset('/images/home/value-picks/sonny-styles.png'),
]

function assignPhotos(picks: Omit<IqHomeValuePick, 'playerPhotoUrl'>[]): IqHomeValuePick[] {
  return picks.map((pick, index) => ({
    ...pick,
    playerPhotoUrl: VALUE_PICK_PHOTOS[index % VALUE_PICK_PHOTOS.length],
  }))
}

const SCHOOL_LOGO = (abbr: string) =>
  `https://ngs.nfl.com/public/img/college-team-logos/${abbr}.png`

const DAY1_PICKS: Omit<IqHomeValuePick, 'playerPhotoUrl'>[] = [
  {
    overall: '86.5',
    pickLabel: 'Pick 15',
    teamId: 'CHI',
    playerName: 'Dillon Thieneman',
    position: 'ED',
    schoolAbbr: 'OREGON',
    schoolLogoUrl: SCHOOL_LOGO('OREGON'),
  },
  {
    overall: '84.2',
    pickLabel: 'Pick 20',
    teamId: 'PHI',
    playerName: 'Makai Lemon',
    position: 'WR',
    schoolAbbr: 'USC',
    schoolLogoUrl: SCHOOL_LOGO('USC'),
  },
  {
    overall: '82.8',
    pickLabel: 'Pick 7',
    teamId: 'WAS',
    playerName: 'Sonny Styles',
    position: 'LB',
    schoolAbbr: 'OHIO_ST',
    schoolLogoUrl: SCHOOL_LOGO('OHIO_ST'),
  },
  {
    overall: '81.4',
    pickLabel: 'Pick 5',
    teamId: 'NYG',
    playerName: 'Arvell Reese',
    position: 'ED',
    schoolAbbr: 'OHIO_ST',
    schoolLogoUrl: SCHOOL_LOGO('OHIO_ST'),
  },
  {
    overall: '80.1',
    pickLabel: 'Pick 30',
    teamId: 'NYJ',
    playerName: 'Omar Cooper Jr.',
    position: 'WR',
    schoolAbbr: 'INDIANA',
    schoolLogoUrl: SCHOOL_LOGO('INDIANA'),
  },
]

const DAY2_PICKS: Omit<IqHomeValuePick, 'playerPhotoUrl'>[] = [
  {
    overall: '79.3',
    pickLabel: 'Pick 37',
    teamId: 'NYG',
    playerName: 'Colton Hood',
    position: 'CB',
    schoolAbbr: 'TENNESSEE',
    schoolLogoUrl: SCHOOL_LOGO('TENNESSEE'),
  },
  {
    overall: '78.6',
    pickLabel: 'Pick 54',
    teamId: 'PHI',
    playerName: 'Eli Stowers',
    position: 'TE',
    schoolAbbr: 'VANDERBILT',
    schoolLogoUrl: SCHOOL_LOGO('VANDERBILT'),
  },
  {
    overall: '77.9',
    pickLabel: 'Pick 58',
    teamId: 'CLE',
    playerName: 'E. McNeil-Warren',
    position: 'S',
    schoolAbbr: 'TOLEDO',
    schoolLogoUrl: SCHOOL_LOGO('TOLEDO'),
  },
  {
    overall: '76.5',
    pickLabel: 'Pick 60',
    teamId: 'TEN',
    playerName: 'Anthony Hill Jr.',
    position: 'LB',
    schoolAbbr: 'TEXAS',
    schoolLogoUrl: SCHOOL_LOGO('TEXAS'),
  },
  {
    overall: '75.2',
    pickLabel: 'Pick 88',
    teamId: 'JAX',
    playerName: 'Emmanuel Pregnon',
    position: 'G',
    schoolAbbr: 'OREGON',
    schoolLogoUrl: SCHOOL_LOGO('OREGON'),
  },
]

export const IQ_HOME_VALUE_PICKS_DAY1 = assignPhotos(DAY1_PICKS)
export const IQ_HOME_VALUE_PICKS_DAY2 = assignPhotos(DAY2_PICKS)
