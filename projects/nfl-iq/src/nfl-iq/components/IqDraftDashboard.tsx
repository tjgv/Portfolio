import { ngsTeamLogoUrl } from '../constants'
import { IqTabHeader } from './IqTabHeader'
import {
  DAY1_VALUE_PICKS,
  DAY2_VALUE_PICKS,
  MOST_ATHLETIC_DRAFT_CLASSES,
  MOST_PRODUCTIVE_DRAFT_CLASSES,
  NGS_DRAFT_SCORE_RANKINGS,
  type TeamScoreRow,
} from '../data/draft-data'
import { IqDraftRoundBoard } from './IqDraftRoundBoard'
import './iq-dashboard.css'
import './iq-draft-round-board.css'

function ScoreTable({ rows }: { rows: TeamScoreRow[] }) {
  return (
    <table className="iq-draft-score-table">
      <thead>
        <tr>
          <th scope="col" aria-label="Team logo" />
          <th scope="col">TEAM</th>
          <th scope="col">SCORE</th>
          <th scope="col" aria-label="Tier" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.teamId}>
            <td className="iq-draft-score-table__logo">
              <img src={ngsTeamLogoUrl(row.teamId)} alt="" />
            </td>
            <td>{row.teamName}</td>
            <td>{row.score.toFixed(1)}</td>
            <td>
              <span
                className={`iq-draft-tier iq-draft-tier--${row.tier}`}
                aria-hidden="true"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ValuePicksTable({
  picks,
}: {
  picks: { round: string; teamId: string; player: string }[]
}) {
  return (
    <table className="iq-draft-value-table">
      <tbody>
        {picks.map((row) => (
          <tr key={`${row.round}-${row.player}`}>
            <td>{row.round}</td>
            <td className="iq-draft-value-table__logo">
              <img src={ngsTeamLogoUrl(row.teamId)} alt="" />
            </td>
            <td>{row.player}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function IqDraftDashboard() {
  return (
    <div className="iq-draft-dashboard">
      <IqTabHeader
        title="2026 NFL DRAFT RESULTS"
        subtitle="GO INSIDE THE DRAFT ROOM WITH NFL IQ POWERED BY AMAZON QUICK"
      />

      <section className="iq-draft-widget-section" aria-label="Live draft board">
        <IqDraftRoundBoard />
      </section>

      <section className="iq-draft-analytics-section" aria-label="Draft analytics">
        <div className="iq-draft-analytics-card">
          <div className="iq-draft-panels">
          <article className="iq-draft-panel iq-draft-panel--score">
            <header className="iq-draft-panel__head">
              <h2 className="iq-draft-panel__title">NGS DRAFT SCORE RANKINGS</h2>
              <p className="iq-draft-panel__subtitle">
                AVERAGE SCORE OF FIRST SEVEN PICKS
              </p>
            </header>
            <div className="iq-draft-panel__body">
              <ScoreTable rows={NGS_DRAFT_SCORE_RANKINGS} />
            </div>
          </article>

          <article className="iq-draft-panel iq-draft-panel--score">
            <header className="iq-draft-panel__head">
              <h2 className="iq-draft-panel__title">MOST ATHLETIC DRAFT CLASSES</h2>
              <p className="iq-draft-panel__subtitle">
                AVERAGE SCORE OF FIRST SEVEN PICKS
              </p>
            </header>
            <div className="iq-draft-panel__body">
              <ScoreTable rows={MOST_ATHLETIC_DRAFT_CLASSES} />
            </div>
          </article>

          <article className="iq-draft-panel iq-draft-panel--score">
            <header className="iq-draft-panel__head">
              <h2 className="iq-draft-panel__title">MOST PRODUCTIVE DRAFT CLASSES</h2>
              <p className="iq-draft-panel__subtitle">
                AVERAGE SCORE OF FIRST SEVEN PICKS
              </p>
            </header>
            <div className="iq-draft-panel__body">
              <ScoreTable rows={MOST_PRODUCTIVE_DRAFT_CLASSES} />
            </div>
          </article>

          <div className="iq-draft-panels__value-col">
            <article className="iq-draft-panel iq-draft-panel--value">
              <header className="iq-draft-panel__head iq-draft-panel__head--title-only">
                <h2 className="iq-draft-panel__title">NGS DAY 1 VALUE PICKS</h2>
              </header>
              <div className="iq-draft-panel__body">
                <ValuePicksTable picks={DAY1_VALUE_PICKS} />
              </div>
            </article>

            <article className="iq-draft-panel iq-draft-panel--value">
              <header className="iq-draft-panel__head iq-draft-panel__head--title-only">
                <h2 className="iq-draft-panel__title">NGS DAY 2 VALUE PICKS</h2>
              </header>
              <div className="iq-draft-panel__body">
                <ValuePicksTable picks={DAY2_VALUE_PICKS} />
              </div>
            </article>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}
