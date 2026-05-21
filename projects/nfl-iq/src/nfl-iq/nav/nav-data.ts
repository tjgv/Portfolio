import { teamLogoUrl } from '../constants'

export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export type NavColumn = {
  heading: string
  headingIcon?: 'nfl-plus' | 'play' | 'calendar' | 'possession' | 'trophy' | 'news' | 'coach'
  links: NavLink[]
  variant?: 'default' | 'nfl-plus'
}

export type NavItem = {
  id: string
  label: string
  columns: NavColumn[]
  /** Teams mega-menu uses custom layout */
  layout?: 'teams'
}

export type TeamDivision = {
  name: string
  teams: { abbr: string; name: string; slug: string }[]
}

export const UTILITY_LINKS: NavLink[] = [
  { label: 'NFL Shop', href: 'https://www.nflshop.com/', external: true },
  { label: 'Tickets', href: 'https://www.ticketmaster.com/nfl', external: true },
  { label: 'ESPN Fantasy', href: 'https://fantasy.espn.com/football/welcome', external: true },
  { label: 'VIP Experiences', href: 'https://onlocationexp.com/nfl', external: true },
]

export const MOBILE_QUICK_LINKS: NavLink[] = [
  { label: 'SCHEDULE RELEASE', href: '/nfl-schedule-release' },
  { label: 'SHOP', href: 'https://www.nflshop.com/', external: true },
]

export const DESKTOP_PROMO_LINKS: NavLink[] = [
  { label: 'SCHEDULE RELEASE', href: '/nfl-schedule-release' },
]

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'watch',
    label: 'WATCH',
    columns: [
      {
        heading: 'NFL+',
        headingIcon: 'nfl-plus',
        variant: 'nfl-plus',
        links: [
          { label: 'NFL+ Home', href: '/plus/' },
          { label: 'NFL RedZone', href: '/redzone/watch' },
          { label: 'International Games', href: '/plus/international/' },
          { label: 'NFL Network', href: '/network/' },
          { label: 'Game Replays', href: '/plus/replays/' },
          { label: 'Shows', href: '/plus/shows' },
        ],
      },
      {
        heading: 'Video',
        headingIcon: 'play',
        links: [
          { label: 'Videos', href: '/videos' },
          { label: 'NFL Channel', href: '/watch/nfl-channel-live' },
          { label: 'Ways to Watch', href: '/ways-to-watch/by-week/' },
          { label: 'Highlights', href: '/videos/channel/game-highlights-vc/' },
          { label: 'NFL Films', href: 'https://www.nflfilms.com/', external: true },
        ],
      },
    ],
  },
  {
    id: 'games',
    label: 'GAMES',
    columns: [
      {
        heading: 'Plan Ahead',
        headingIcon: 'calendar',
        links: [
          { label: 'Schedule', href: '/schedules/' },
          { label: 'Ways to Watch', href: '/ways-to-watch/by-week/' },
          { label: 'Team Schedules', href: '/schedules/2026/by-team' },
          { label: 'NFL Network Games', href: '/network/games/' },
          { label: 'Tickets', href: 'https://www.ticketmaster.com/nfl', external: true },
          { label: 'VIP Experiences', href: 'https://onlocationexp.com/nfl', external: true },
        ],
      },
      {
        heading: 'Game Recap',
        headingIcon: 'possession',
        links: [
          { label: 'Scores', href: '/scores/' },
          { label: 'Game Replays', href: '/plus/replays/' },
          { label: 'Highlights', href: '/videos/channel/game-highlights-vc/' },
        ],
      },
      {
        heading: 'Playoffs',
        headingIcon: 'trophy',
        links: [
          { label: 'Pro Bowl Games', href: '/pro-bowl-games/' },
          { label: 'Super Bowl', href: '/super-bowl/' },
        ],
      },
    ],
  },
  {
    id: 'news',
    label: 'NEWS',
    columns: [
      {
        heading: 'News & Updates',
        headingIcon: 'news',
        links: [
          { label: 'Latest', href: '/news/' },
          { label: 'Injuries', href: '/injuries/' },
          { label: 'Transactions', href: '/transactions/' },
          { label: 'Podcasts', href: '/podcasts/' },
          { label: 'Photos', href: '/photos/' },
          { label: 'Community', href: '/community/' },
        ],
      },
      {
        heading: 'Events',
        headingIcon: 'news',
        links: [
          { label: 'Super Bowl', href: '/super-bowl/' },
          { label: 'Pro Bowl Games', href: '/pro-bowl-games/' },
          { label: 'Combine', href: '/combine' },
          { label: 'Draft', href: '/draft' },
        ],
      },
      {
        heading: 'Offsite News',
        headingIcon: 'news',
        links: [
          { label: 'Fantasy News', href: 'https://www.nfl.com/news/series/fantasy', external: true },
          { label: 'En Espanol', href: 'https://www.nfl.com/mundo/', external: true },
        ],
      },
    ],
  },
  {
    id: 'teams',
    label: 'TEAMS',
    layout: 'teams',
    columns: [],
  },
  {
    id: 'stats',
    label: 'STATS',
    columns: [
      {
        heading: 'Season Stats',
        headingIcon: 'coach',
        links: [
          { label: 'Team Stats', href: '/stats/team-stats/' },
          { label: 'Player Stats', href: '/stats/player-stats/' },
          { label: 'Standings', href: '/standings/' },
        ],
      },
      {
        heading: 'Advanced Stats',
        headingIcon: 'coach',
        links: [
          { label: 'Next Gen Stats', href: 'https://nextgenstats.nfl.com/stats/', external: true },
          { label: 'NFL PRO', href: 'https://pro.nfl.com', external: true },
        ],
      },
    ],
  },
]

export const TEAMS_SIDEBAR: NavLink[] = [
  { label: 'All Teams', href: '/teams/' },
  { label: 'Players', href: '/players/' },
  { label: 'Standings', href: '/standings/' },
  { label: 'Shop', href: 'https://www.nflshop.com/', external: true },
]

export const TEAM_DIVISIONS: TeamDivision[] = [
  {
    name: 'AFC East',
    teams: [
      { abbr: 'BUF', name: 'Bills', slug: 'buffalo-bills' },
      { abbr: 'MIA', name: 'Dolphins', slug: 'miami-dolphins' },
      { abbr: 'NE', name: 'Patriots', slug: 'new-england-patriots' },
      { abbr: 'NYJ', name: 'Jets', slug: 'new-york-jets' },
    ],
  },
  {
    name: 'AFC North',
    teams: [
      { abbr: 'BAL', name: 'Ravens', slug: 'baltimore-ravens' },
      { abbr: 'CIN', name: 'Bengals', slug: 'cincinnati-bengals' },
      { abbr: 'CLE', name: 'Browns', slug: 'cleveland-browns' },
      { abbr: 'PIT', name: 'Steelers', slug: 'pittsburgh-steelers' },
    ],
  },
  {
    name: 'AFC South',
    teams: [
      { abbr: 'HOU', name: 'Texans', slug: 'houston-texans' },
      { abbr: 'IND', name: 'Colts', slug: 'indianapolis-colts' },
      { abbr: 'JAX', name: 'Jaguars', slug: 'jacksonville-jaguars' },
      { abbr: 'TEN', name: 'Titans', slug: 'tennessee-titans' },
    ],
  },
  {
    name: 'AFC West',
    teams: [
      { abbr: 'DEN', name: 'Broncos', slug: 'denver-broncos' },
      { abbr: 'KC', name: 'Chiefs', slug: 'kansas-city-chiefs' },
      { abbr: 'LV', name: 'Raiders', slug: 'las-vegas-raiders' },
      { abbr: 'LAC', name: 'Chargers', slug: 'los-angeles-chargers' },
    ],
  },
  {
    name: 'NFC East',
    teams: [
      { abbr: 'DAL', name: 'Cowboys', slug: 'dallas-cowboys' },
      { abbr: 'NYG', name: 'Giants', slug: 'new-york-giants' },
      { abbr: 'PHI', name: 'Eagles', slug: 'philadelphia-eagles' },
      { abbr: 'WAS', name: 'Commanders', slug: 'washington-commanders' },
    ],
  },
  {
    name: 'NFC North',
    teams: [
      { abbr: 'CHI', name: 'Bears', slug: 'chicago-bears' },
      { abbr: 'DET', name: 'Lions', slug: 'detroit-lions' },
      { abbr: 'GB', name: 'Packers', slug: 'green-bay-packers' },
      { abbr: 'MIN', name: 'Vikings', slug: 'minnesota-vikings' },
    ],
  },
  {
    name: 'NFC South',
    teams: [
      { abbr: 'ATL', name: 'Falcons', slug: 'atlanta-falcons' },
      { abbr: 'CAR', name: 'Panthers', slug: 'carolina-panthers' },
      { abbr: 'NO', name: 'Saints', slug: 'new-orleans-saints' },
      { abbr: 'TB', name: 'Buccaneers', slug: 'tampa-bay-buccaneers' },
    ],
  },
  {
    name: 'NFC West',
    teams: [
      { abbr: 'ARI', name: 'Cardinals', slug: 'arizona-cardinals' },
      { abbr: 'LA', name: 'Rams', slug: 'los-angeles-rams' },
      { abbr: 'SF', name: '49ers', slug: 'san-francisco-49ers' },
      { abbr: 'SEA', name: 'Seahawks', slug: 'seattle-seahawks' },
    ],
  },
]

export function teamHref(slug: string) {
  return `/teams/${slug}`
}

export { teamLogoUrl }
