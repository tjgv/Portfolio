import { useMemo } from 'react'
import { ngsTeamLogoUrl } from '../constants'
import {
  getTeamDraftClassLevel,
  getTeamDraftClassRows,
} from '../data/team-draft-class.mock'
import './team-central-charts.css'

type TeamCentralDraftClassTileProps = {
  teamId: string
  className?: string
}

export function TeamCentralDraftClassTile({
  teamId,
  className,
}: TeamCentralDraftClassTileProps) {
  const logoUrl = ngsTeamLogoUrl(teamId)
  const draftRows = useMemo(() => getTeamDraftClassRows(teamId), [teamId])
  const draftClassLevel = useMemo(() => getTeamDraftClassLevel(teamId), [teamId])

  return (
    <article
      className={['team-central-charts__tile', 'team-central-charts__tile--draft', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="team-central-charts__tile-head team-central-charts__tile-head--draft">
        <div className="team-central-charts__tile-head-main">
          <img className="team-central-charts__tile-logo" src={logoUrl} alt="" />
          <h2
            className="team-central-charts__tile-title"
            id="team-central-chart-draft-title"
          >
            2026 NFL Draft Class
          </h2>
        </div>
        <div className="team-central-charts__draft-class-level">
          <span className="team-central-charts__draft-class-level-label">
            Draft Class Level:
          </span>
          <span
            className={`team-central-charts__ovr team-central-charts__ovr--${draftClassLevel.grade}`}
          >
            {draftClassLevel.level}
          </span>
        </div>
      </div>
      <p className="team-central-charts__draft-note">
        Illustrative board · connect live mocks when the API is wired.
      </p>

      <div
        className="team-central-charts__body"
        role="region"
        aria-labelledby="team-central-chart-draft-title"
        data-chart-slot="draft-class-2026"
      >
        <div className="team-central-charts__table-scroll">
          <table className="team-central-charts__table team-central-charts__table--draft">
            <thead>
              <tr>
                <th scope="col">PK/PROJ</th>
                <th scope="col">POS</th>
                <th scope="col">PLAYER</th>
                <th scope="col">DJ RANK</th>
                <th scope="col">HT</th>
                <th scope="col">WT</th>
                <th scope="col">OVR</th>
              </tr>
            </thead>
            <tbody>
              {draftRows.map((row) => (
                <tr
                  key={`${row.pk}-${row.player}`}
                  className={
                    row.highlight ? 'team-central-charts__tr--highlight' : undefined
                  }
                >
                  <td>{row.pk}</td>
                  <td>{row.pos}</td>
                  <td>{row.player}</td>
                  <td>{row.rank}</td>
                  <td>{row.ht}</td>
                  <td>{row.wt}</td>
                  <td>
                    <span
                      className={`team-central-charts__ovr team-central-charts__ovr--${row.grade}`}
                    >
                      {row.ovr}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="team-central-charts__draft-credit">Grinding the Mocks</p>
      </div>
    </article>
  )
}
