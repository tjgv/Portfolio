import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'
import { appRoute } from '../lib/app-paths'
import './iq-site-footer.css'

/** Conference order: East, North, South, West × 4 teams each */
const AFC_TEAM_IDS = [
  'BUF',
  'MIA',
  'NE',
  'NYJ',
  'BAL',
  'CIN',
  'CLE',
  'PIT',
  'HOU',
  'IND',
  'JAX',
  'TEN',
  'DEN',
  'KC',
  'LV',
  'LAC',
] as const

const NFC_TEAM_IDS = [
  'DAL',
  'NYG',
  'PHI',
  'WAS',
  'CHI',
  'DET',
  'GB',
  'MIN',
  'ATL',
  'CAR',
  'NO',
  'TB',
  'ARI',
  'LAR',
  'SF',
  'SEA',
] as const

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'General & legal',
    links: [
      { label: 'Support', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Subscription Terms & Conditions', href: '#' },
      { label: 'Accessibility', href: '#' },
      { label: 'Ad Choices', href: '#' },
      { label: 'Your Privacy Choices', href: '#' },
      { label: 'Cookie Settings', href: '#' },
      { label: 'Preference Center', href: '#' },
      { label: 'Sitemap', href: '#' },
    ],
  },
  {
    heading: 'NFL Culture',
    links: [
      { label: 'Careers', href: '#' },
      { label: 'In the Community', href: '#' },
      { label: 'Inspire Change', href: '#' },
      { label: 'NFL HBCU', href: '#' },
      { label: 'Por La Cultura', href: '#' },
      { label: 'Play Football', href: '#' },
      { label: 'Play 60', href: '#' },
      { label: 'NFL Origins', href: '#' },
    ],
  },
  {
    heading: 'NFL Ecosystems',
    links: [
      { label: 'NFL Football Operations', href: '#' },
      { label: 'NFL Shop', href: '#' },
      { label: 'NFL Films', href: '#' },
      { label: 'On Location', href: '#' },
      { label: 'Pro Football Hall of Fame', href: '#' },
      { label: 'USA Football', href: '#' },
      { label: 'NFL Extra Points Credit Card', href: '#' },
      { label: 'NFL Ticket Exchange', href: '#' },
      { label: 'NFL Auction', href: '#' },
      { label: 'Flag Football', href: '#' },
      { label: 'Activate - CTV', href: '#' },
    ],
  },
  {
    heading: 'Media',
    links: [
      { label: 'NFL Communications', href: '#' },
      { label: 'Media Guides', href: '#' },
      { label: 'Record & Fact Book', href: '#' },
      { label: 'Rule Book', href: '#' },
      { label: 'Licensing', href: '#' },
    ],
  },
  {
    heading: 'Players',
    links: [
      { label: 'NFL Health & Safety', href: '#' },
      { label: 'Player Engagement', href: '#' },
      { label: 'NFL Legends Community', href: '#' },
      { label: 'NFL Alumni Association', href: '#' },
      { label: 'NFL Player Care', href: '#' },
    ],
  },
]

export function IqSiteFooter() {
  return (
    <footer className="iq-site-footer">
      <div className="iq-site-footer__inner">
        <div className="iq-site-footer__conferences">
          <div className="iq-site-footer__conf">
            <h2 className="iq-site-footer__conf-title">AFC</h2>
            <ul className="iq-site-footer__logo-grid" aria-label="AFC teams">
              {AFC_TEAM_IDS.map((id) => {
                const name =
                  ALL_NFL_TEAMS.find((t) => t.id === id)?.name ?? id
                return (
                  <li key={id}>
                    <a
                      href={appRoute('/teams')}
                      className="iq-site-footer__logo-link"
                      aria-label={name}
                    >
                      <img src={ngsTeamLogoUrl(id)} alt="" width={40} height={40} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="iq-site-footer__conf-split" aria-hidden />
          <div className="iq-site-footer__conf">
            <h2 className="iq-site-footer__conf-title">NFC</h2>
            <ul className="iq-site-footer__logo-grid" aria-label="NFC teams">
              {NFC_TEAM_IDS.map((id) => {
                const name =
                  ALL_NFL_TEAMS.find((t) => t.id === id)?.name ?? id
                return (
                  <li key={id}>
                    <a
                      href={appRoute('/teams')}
                      className="iq-site-footer__logo-link"
                      aria-label={name}
                    >
                      <img src={ngsTeamLogoUrl(id)} alt="" width={40} height={40} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="iq-site-footer__links-wrap">
          <nav className="iq-site-footer__nav" aria-label="NFL.com footer">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading} className="iq-site-footer__col">
                <h3 className="iq-site-footer__col-head">{col.heading}</h3>
                <ul className="iq-site-footer__link-list">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="iq-site-footer__link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="iq-site-footer__col iq-site-footer__col--apps">
              <h3 className="iq-site-footer__col-head">Download the app</h3>
              <div className="iq-site-footer__stores">
                <a
                  href="#"
                  className="iq-site-footer__store iq-site-footer__store--apple"
                  aria-label="Download on the App Store"
                >
                  <span className="iq-site-footer__store-text">Download on the</span>
                  <span className="iq-site-footer__store-name">App Store</span>
                </a>
                <a
                  href="#"
                  className="iq-site-footer__store iq-site-footer__store--google"
                  aria-label="Get it on Google Play"
                >
                  <span className="iq-site-footer__store-prefix">GET IT ON</span>
                  <span className="iq-site-footer__store-name">Google Play</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
