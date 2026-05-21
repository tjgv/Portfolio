import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'
import { getTeamCentralProfile } from '../data/team-central-profiles'
import { teamPrimaryColor } from '../data/team-colors'
import type { Team } from '../types'
import { IqHeaderPartners } from './IqHeaderPartners'
import './iq-header-partners.css'
import './team-central-header.css'

const RECORD_HEADER = '2025 RECORD'

type TeamCentralHeaderProps = {
  teamId: string
  team: Team
}

export function TeamCentralHeader({ teamId, team }: TeamCentralHeaderProps) {
  const meta = ALL_NFL_TEAMS.find((t) => t.id === teamId)
  const displayName = (meta?.name ?? team.name).toUpperCase()
  const primaryColor = teamPrimaryColor(teamId)
  const profile = getTeamCentralProfile(teamId, team)

  return (
    <header className="team-central-header">
      <div className="team-central-header__left">
        <div className="team-central-header__logo-wrap">
          <img
            className="team-central-header__logo"
            src={ngsTeamLogoUrl(teamId)}
            alt=""
          />
        </div>
        <div className="team-central-header__body">
          <h1
            className="team-central-header__name"
            style={{ color: primaryColor }}
          >
            {displayName}
          </h1>
          <div className="team-central-header__info-scroll">
            <div className="team-central-header__info" role="presentation">
              <div className="team-central-header__col team-central-header__col--record">
                <div className="team-central-header__col-title">{RECORD_HEADER}</div>
                <div className="team-central-header__col-value">{profile.recordLine}</div>
              </div>
              {profile.staff.map((member) => (
                <div
                  key={member.roleLabel}
                  className="team-central-header__col team-central-header__col--staff"
                >
                  <div className="team-central-header__col-title">{member.roleLabel}</div>
                  <div className="team-central-header__col-value">{member.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="team-central-header__partners">
        <IqHeaderPartners />
      </div>
    </header>
  )
}
