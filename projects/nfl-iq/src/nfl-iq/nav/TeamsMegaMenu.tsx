import { TEAM_DIVISIONS, TEAMS_SIDEBAR, teamHref, teamLogoUrl } from './nav-data'
import { ArrowUpright } from './NavIcons'

export function TeamsMegaMenu() {
  const row1 = TEAM_DIVISIONS.slice(0, 4)
  const row2 = TEAM_DIVISIONS.slice(4)

  return (
    <div className="site-nav__teams">
      <ul className="site-nav__teams-sidebar">
        {TEAMS_SIDEBAR.map((link) => (
          <li key={link.label} className={link.label === 'All Teams' ? 'site-nav__teams-sidebar-all' : ''}>
            <a
              className="site-nav__teams-sidebar-link"
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              <span>{link.label}</span>
              {link.external ? <ArrowUpright size={16} className="site-nav__external-icon" /> : null}
            </a>
          </li>
        ))}
      </ul>
      <div className="site-nav__teams-grid">
        {[row1, row2].map((row, rowIdx) => (
          <div key={rowIdx} className="site-nav__teams-row">
            {row.map((division) => (
              <div key={division.name} className="site-nav__division">
                <span className="site-nav__division-name">{division.name}</span>
                <ul className="site-nav__division-teams">
                  {division.teams.map((team) => (
                    <li key={team.abbr}>
                      <a className="site-nav__team-link" href={teamHref(team.slug)}>
                        <img src={teamLogoUrl(team.abbr)} alt="" width={16} height={16} />
                        <span>{team.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
