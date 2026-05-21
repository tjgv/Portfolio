import { useMemo } from 'react'
import { ArmLengthHeightScatter } from '../../../components/ArmLengthHeightScatter'
import { OptionADraftCombineScorecardTable } from './OptionADraftCombineScorecardTable'
import { OptionADraftNgRankingsTable } from './OptionADraftNgRankingsTable'
import type { DraftBoardProspect } from '../../../types'
import { computeDraftScoreRanks } from '../../../utils/draft-ng-ranks'
import '../../../components/draft-central-board.css'
import '../../../components/iq-table-col-cell.css'

type OptionADraftCentralBoardProps = {
  rows: DraftBoardProspect[]
  loading: boolean
}

export function OptionADraftCentralBoard({ rows, loading }: OptionADraftCentralBoardProps) {
  const rankMaps = useMemo(() => computeDraftScoreRanks(rows), [rows])

  return (
    <div className="draft-board draft-board--option-a">
      {loading ? (
        <div className="draft-board__primary-wrap">
          <div className="draft-board__primary-card">
            <p className="draft-board__loading">Loading prospects…</p>
          </div>
        </div>
      ) : (
        <>
          <div className="draft-board__primary-wrap">
            <section
              className="draft-board__primary-card"
              aria-label="Scouting combine scorecard"
            >
              <div className="draft-board__primary-body">
                <div className="draft-board__scroll draft-board__scroll--primary">
                  {rows.length > 0 ? (
                    <OptionADraftCombineScorecardTable rows={rows} />
                  ) : (
                    <p className="draft-board__empty">No prospects available.</p>
                  )}
                </div>
                <div
                  className="draft-board__legend draft-board__legend--primary"
                  aria-label="Score tier legend"
                >
                  <span className="draft-board__legend-brand">Next Gen Stats</span>
                  <ul className="draft-board__legend-list">
                    <li>
                      <span
                        className="draft-board__ngs-icon draft-board__ngs-icon--elite draft-board__ngs-icon--legend"
                        aria-hidden
                      />
                      Elite (90–99)
                    </li>
                    <li>
                      <span
                        className="draft-board__ngs-icon draft-board__ngs-icon--good draft-board__ngs-icon--legend"
                        aria-hidden
                      />
                      Good (75–89)
                    </li>
                    <li>
                      <span
                        className="draft-board__ngs-icon draft-board__ngs-icon--average draft-board__ngs-icon--legend"
                        aria-hidden
                      />
                      Average (60–74)
                    </li>
                    <li>
                      <span
                        className="draft-board__ngs-icon draft-board__ngs-icon--below draft-board__ngs-icon--legend"
                        aria-hidden
                      />
                      Below average (50–59)
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="draft-board__split-row">
            <div className="draft-board__bottom-chart">
              <h3 className="draft-board__bottom-masthead draft-board__bottom-masthead--rankings">
                <span className="draft-board__bottom-masthead-strong">NEXT GEN STATS</span>
                <span className="draft-board__bottom-masthead-light"> DRAFT SCORE RANKINGS</span>
              </h3>
              <div className="draft-board__scroll draft-board__scroll--secondary">
                {rows.length > 0 ? (
                  <OptionADraftNgRankingsTable rows={rows} ranks={rankMaps} />
                ) : (
                  <p className="draft-board__empty draft-board__empty--tight">
                    No prospects available.
                  </p>
                )}
              </div>
            </div>
            <div className="draft-board__bottom-chart draft-board__bottom-chart--scatter">
              <ArmLengthHeightScatter
                prospects={rows}
                mode="ath-prod"
                variant="bottom"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
