import { useMemo } from 'react'
import type { DraftBoardProspect } from '../types'
import { computeDraftScoreRanks } from '../utils/draft-ng-ranks'
import { ArmLengthHeightScatter } from './ArmLengthHeightScatter'
import { DraftCombineScorecardTable } from './DraftCombineScorecardTable'
import { DraftNgRankingsTable } from './DraftNgRankingsTable'
import './draft-central-board.css'
import './iq-table-col-cell.css'

export { tierFromNgsScore } from '../utils/draft-score-tier'
export type { DraftScoreTier } from '../utils/draft-score-tier'

const OFF_POSITIONS = new Set([
  'QB',
  'RB',
  'WR',
  'TE',
  'OL',
  'T',
  'G',
  'C',
  'OT',
  'IOL',
  'FB',
])
const DEF_POSITIONS = new Set([
  'DT',
  'ED',
  'EDGE',
  'DE',
  'LB',
  'DB',
  'CB',
  'S',
  'SAF',
  'FS',
  'SS',
  'ILB',
  'OLB',
  'DL',
  'IDL',
])

export function prospectMatchesDraftFilter(filter: string, position: string): boolean {
  const p = position.toUpperCase()
  const f = filter.toUpperCase()
  if (f === 'ALL') return true
  if (f === 'OFF') return OFF_POSITIONS.has(p)
  if (f === 'DEF') return DEF_POSITIONS.has(p)
  if (f === 'ED') return p === 'EDGE' || p === 'ED' || p === 'DE'
  return p === f
}

type DraftCentralBoardProps = {
  rows: DraftBoardProspect[]
  loading: boolean
}

export function DraftCentralBoard({ rows, loading }: DraftCentralBoardProps) {
  const rankMaps = useMemo(() => computeDraftScoreRanks(rows), [rows])

  const sortedCombine = useMemo(() => {
    return [...rows].sort((a, b) => {
      const ar = a.djRank
      const br = b.djRank
      if (ar != null && br != null) return ar - br
      if (ar != null) return -1
      if (br != null) return 1
      return a.name.localeCompare(b.name)
    })
  }, [rows])

  const sortedRankings = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (b.overall !== a.overall) return b.overall - a.overall
      return a.name.localeCompare(b.name)
    })
  }, [rows])

  return (
    <div className="draft-board">
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
                  {sortedCombine.length > 0 ? (
                    <DraftCombineScorecardTable rows={sortedCombine} />
                  ) : (
                    <p className="draft-board__empty">No prospects available.</p>
                  )}
                </div>
                <div className="draft-board__legend draft-board__legend--primary" aria-label="Score tier legend">
                  <span className="draft-board__legend-brand">Next Gen Stats</span>
                  <ul className="draft-board__legend-list">
                    <li>
                      <span className="draft-board__ngs-icon draft-board__ngs-icon--elite draft-board__ngs-icon--legend" aria-hidden />
                      Elite (90–99)
                    </li>
                    <li>
                      <span className="draft-board__ngs-icon draft-board__ngs-icon--good draft-board__ngs-icon--legend" aria-hidden />
                      Good (75–89)
                    </li>
                    <li>
                      <span className="draft-board__ngs-icon draft-board__ngs-icon--average draft-board__ngs-icon--legend" aria-hidden />
                      Average (60–74)
                    </li>
                    <li>
                      <span className="draft-board__ngs-icon draft-board__ngs-icon--below draft-board__ngs-icon--legend" aria-hidden />
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
                {sortedRankings.length > 0 ? (
                  <DraftNgRankingsTable rows={sortedRankings} ranks={rankMaps} />
                ) : (
                  <p className="draft-board__empty draft-board__empty--tight">
                    No prospects available.
                  </p>
                )}
              </div>
            </div>
            <div className="draft-board__bottom-chart draft-board__bottom-chart--scatter">
              <ArmLengthHeightScatter prospects={sortedRankings} mode="ath-prod" variant="bottom" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
