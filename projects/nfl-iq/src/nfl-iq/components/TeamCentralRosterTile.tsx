import type { CSSProperties } from 'react'
import { useMemo, useState } from 'react'
import { NFL_IQ_LOGO, ngsTeamLogoUrl } from '../constants'
import { publicAsset } from '../lib/app-paths'

const NFL_DRAFT_LOGO = publicAsset('/images/nfl-draft.png')
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
  /** FA sidebar: tabs left, logo right, no title */
  headerLayout?: 'default' | 'sidebar'
  /** Sidebar toolbar logo in the top-right corner (defaults to selected team). */
  cornerLogo?: 'team' | 'nfl-draft' | 'nfl-iq'
}

export function TeamCentralRosterTile({
  teamId,
  className,
  headerLayout = 'default',
  cornerLogo = 'team',
}: TeamCentralRosterTileProps) {
  const [rosterTab, setRosterTab] = useState<TeamRosterTab>('STARTERS')
  const logoUrl = ngsTeamLogoUrl(teamId)
  const cornerLogoUrl =
    cornerLogo === 'nfl-iq'
      ? NFL_IQ_LOGO
      : cornerLogo === 'nfl-draft'
        ? NFL_DRAFT_LOGO
        : logoUrl
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
            className={[
              'team-central-charts__tile-logo',
              'team-central-charts__tile-logo--sidebar-end',
              cornerLogo !== 'team'
                ? 'team-central-charts__tile-logo--sidebar-nfl'
                : '',
            ]
              .filter(Boolean)
              .join(' ')}
            src={cornerLogoUrl}
            alt={cornerLogo === 'team' ? '' : 'NFL'}
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
                <th scope="col" className="team-central-charts__col--pos">
                  POS
                </th>
                <th scope="col" className="team-central-charts__col--player">
                  PLAYER
                </th>
                <th scope="col" className="team-central-charts__col--age">
                  AGE
                </th>
                <th scope="col" className="team-central-charts__col--yrs">
                  YRS LEFT
                </th>
                <th scope="col" className="team-central-charts__col--aav">
                  AAV
                </th>
              </tr>
            </thead>
            <tbody>
              {rosterRows.map((row, i) => (
                <tr key={`${row.pos}-${row.player}-${i}`}>
                  <td className="team-central-charts__col--pos">{row.pos}</td>
                  <td className="team-central-charts__col--player">{row.player}</td>
                  <td
                    className={[
                      'team-central-charts__col--age',
                      row.ageHighlight ? 'team-central-charts__age--accent' : undefined,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {row.age}
                  </td>
                  <td className="team-central-charts__col--yrs team-central-charts__yrs">
                    {row.yrs}
                  </td>
                  <td className="team-central-charts__col--aav">
                    <span className="team-central-charts__aav">{row.aav}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="team-central-charts__tfoot-sum">
                <td colSpan={2} className="team-central-charts__col--pos" />
                <td className="team-central-charts__col--age">{rosterSummary.avgAge}</td>
                <td className="team-central-charts__col--yrs" />
                <td className="team-central-charts__col--aav">
                  <span className="team-central-charts__aav">{rosterSummary.totalAav}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </article>
  )
}
