import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { ngsTeamLogoUrl } from '../constants'
import { teamContrastText, teamPrimaryColor } from '../data/team-colors'
import {
  getTeamRosterRows,
  summarizeTeamRosterRows,
  type TeamRosterTab,
} from '../data/team-roster.mock'
import './team-central-charts.css'

const ROSTER_TABS: TeamRosterTab[] = ['STARTERS', 'TOP 51', '90-MAN']

type TeamCentralRosterTileProps = {
  teamId: string
  className?: string
  /** FA sidebar: tabs left, team logo right, no title */
  headerLayout?: 'default' | 'sidebar'
}

export function TeamCentralRosterTile({
  teamId,
  className,
  headerLayout = 'default',
}: TeamCentralRosterTileProps) {
  const [rosterTab, setRosterTab] = useState<TeamRosterTab>('STARTERS')
  const logoUrl = ngsTeamLogoUrl(teamId)
  const teamColor = teamPrimaryColor(teamId)
  const activeTabText = teamContrastText(teamColor)

  const rosterRows = useMemo(
    () => getTeamRosterRows(teamId, rosterTab),
    [teamId, rosterTab],
  )
  const rosterSummary = useMemo(
    () => summarizeTeamRosterRows(rosterRows),
    [rosterRows],
  )

  const tileStyle = {
    '--tc-team-tab-bg': teamColor,
    '--tc-team-tab-text': activeTabText,
  } as CSSProperties

  return (
    <article
      className={['team-central-charts__tile', 'team-central-charts__tile--roster', className]
        .filter(Boolean)
        .join(' ')}
      style={tileStyle}
    >
      {headerLayout === 'sidebar' ? (
        <div className="team-central-charts__tile-toolbar team-central-charts__tile-toolbar--sidebar">
          <div
            className="team-central-charts__tabs team-central-charts__tabs--sidebar"
            role="tablist"
            aria-label="Roster view"
          >
            {ROSTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={rosterTab === tab}
                className={
                  rosterTab === tab
                    ? 'team-central-charts__tab team-central-charts__tab--active'
                    : 'team-central-charts__tab'
                }
                onClick={() => setRosterTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <img
            className="team-central-charts__tile-logo team-central-charts__tile-logo--sidebar-end"
            src={logoUrl}
            alt=""
          />
        </div>
      ) : (
        <>
          <div
            className="team-central-charts__tile-head"
            id="team-central-chart-roster-title"
          >
            <img className="team-central-charts__tile-logo" src={logoUrl} alt="" />
            <h2 className="team-central-charts__tile-title">2026 Roster</h2>
          </div>

          <div className="team-central-charts__tabs" role="tablist" aria-label="Roster view">
            {ROSTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={rosterTab === tab}
                className={
                  rosterTab === tab
                    ? 'team-central-charts__tab team-central-charts__tab--active'
                    : 'team-central-charts__tab'
                }
                onClick={() => setRosterTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </>
      )}

      <div
        className="team-central-charts__body"
        role="region"
        aria-labelledby={
          headerLayout === 'sidebar' ? undefined : 'team-central-chart-roster-title'
        }
        aria-label={headerLayout === 'sidebar' ? '2026 roster' : undefined}
        data-chart-slot="roster-2026"
        data-roster-tab={rosterTab}
      >
        <div className="team-central-charts__table-scroll">
          <table className="team-central-charts__table">
            <thead>
              <tr>
                <th scope="col">POS</th>
                <th scope="col">PLAYER</th>
                <th scope="col">AGE</th>
                <th scope="col">YRS LEFT</th>
                <th scope="col">AAV</th>
                <th scope="col">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {rosterRows.map((row, i) => (
                <tr key={`${row.pos}-${row.player}-${i}`}>
                  <td>{row.pos}</td>
                  <td>{row.player}</td>
                  <td
                    className={
                      row.ageHighlight ? 'team-central-charts__age--accent' : undefined
                    }
                  >
                    {row.age}
                  </td>
                  <td className="team-central-charts__yrs">{row.yrs}</td>
                  <td>
                    <span className="team-central-charts__aav">{row.aav}</span>
                  </td>
                  <td className="team-central-charts__status">{row.status}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="team-central-charts__tfoot-sum">
                <td colSpan={2} />
                <td>{rosterSummary.avgAge}</td>
                <td />
                <td>
                  <span className="team-central-charts__aav">{rosterSummary.totalAav}</span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="team-central-charts__legend">
          Status: ◆ elite · NEW rookie / priority · ? volatile · ↗ trending
        </p>
      </div>
    </article>
  )
}
