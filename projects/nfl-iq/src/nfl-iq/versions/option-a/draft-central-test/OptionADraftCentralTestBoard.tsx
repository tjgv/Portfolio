import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import '../../../components/draft-central-board.css'
import '../../../components/iq-table-col-cell.css'
import { DraftCentralTestAthProdScatter } from './DraftCentralTestAthProdScatter'
import { OptionADraftCentralTestCombineScorecardTable } from './OptionADraftCentralTestCombineScorecardTable'
import { FaBoardTableSearch } from '../../../components/FaBoardTableSearch'
import type { ChartComparisonId } from './chart-comparison-options'
import { DraftCentralTestChartComparisonMenu } from './DraftCentralTestChartComparisonMenu'
import { DraftCentralTestFocusPortraits } from './DraftCentralTestFocusPortraits'
import { DraftCentralTestTableHead } from './DraftCentralTestTableHead'
import { OptionADraftCentralTestLibraryTable } from './OptionADraftCentralTestLibraryTable'
import {
  DRAFT_TEST_FOCUS_QUERY,
  findProspectByDisplayName,
} from './draft-test-focus-nav'
import './option-a-draft-central-test.css'
import '../../../components/fa-board-table-search.css'

type OptionADraftCentralTestBoardProps = {
  rows: DraftBoardProspect[]
  loading: boolean
  onOpenProspect: (key: string) => void
}

export function OptionADraftCentralTestBoard({
  rows,
  loading,
  onOpenProspect,
}: OptionADraftCentralTestBoardProps) {
  const [focusedKeys, setFocusedKeys] = useState<string[]>([])
  const [tableSearch, setTableSearch] = useState('')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )
  const [chartComparison, setChartComparison] =
    useState<ChartComparisonId>('ath-prod')
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const focusName = searchParams.get(DRAFT_TEST_FOCUS_QUERY)
    if (!focusName || loading || rows.length === 0) return

    const prospect = findProspectByDisplayName(rows, focusName)
    if (!prospect) return

    setFocusedKeys([prospectStableKey(prospect)])
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete(DRAFT_TEST_FOCUS_QUERY)
        return next
      },
      { replace: true },
    )
  }, [loading, rows, searchParams, setSearchParams])

  const handleSelectProspect = useCallback((key: string, shiftKey: boolean) => {
    setFocusedKeys((prev) => {
      if (shiftKey) {
        if (prev.includes(key)) {
          return prev.filter((k) => k !== key)
        }
        if (prev.length >= 2) {
          return [prev[0], key]
        }
        return [...prev, key]
      }
      return [key]
    })
  }, [])

  const handleRemoveFocus = useCallback((key: string) => {
    setFocusedKeys((prev) => prev.filter((k) => k !== key))
  }, [])

  return (
    <div className="draft-board draft-board--option-a draft-board--draft-test">
      {loading ? (
        <div className="draft-board__primary-wrap">
          <div className="draft-board__primary-card">
            <p className="draft-board__loading">Loading prospects…</p>
          </div>
        </div>
      ) : (
        <>
          <div className="draft-board__primary-wrap draft-test__explorer-wrap">
            <section
              className="draft-board__primary-card draft-test__explorer"
              aria-label="Top 150 library and athleticism versus production scatter"
            >
              <header className="draft-test__explorer-head">
                <div className="draft-test__explorer-head-table">
                  <h2 className="draft-test__table-title">Top 150 Prospect Library</h2>
                  <FaBoardTableSearch
                    value={tableSearch}
                    onChange={setTableSearch}
                    placeholder="Search top 150…"
                    aria-label="Search top 150 prospect library"
                  />
                </div>
                <div className="draft-test__explorer-head-chart">
                  <DraftCentralTestChartComparisonMenu
                    value={chartComparison}
                    onChange={setChartComparison}
                  />
                  <DraftCentralTestFocusPortraits
                    prospects={rows}
                    focusedKeys={focusedKeys}
                    onRemoveFocus={handleRemoveFocus}
                  />
                </div>
              </header>

              <div className="draft-test__explorer-body">
                <div className="draft-test__explorer-table-pane">
                  <div className="draft-board__scroll draft-board__scroll--primary draft-test__library-scroll">
                    {rows.length > 0 ? (
                      <OptionADraftCentralTestLibraryTable
                        rows={rows}
                        searchQuery={tableSearch}
                        selectedPositions={selectedPositions}
                        onSelectedPositionsChange={setSelectedPositions}
                        focusedKeys={focusedKeys}
                        onSelectProspect={handleSelectProspect}
                        onOpenProspect={onOpenProspect}
                      />
                    ) : (
                      <p className="draft-board__empty">No prospects available.</p>
                    )}
                  </div>
                </div>
                <div className="draft-test__explorer-chart-pane">
                  <DraftCentralTestAthProdScatter
                    prospects={rows}
                    comparisonId={chartComparison}
                    focusedKeys={focusedKeys}
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="draft-board__primary-wrap draft-test__detail-wrap">
            <section
              className="draft-board__primary-card"
              aria-label="Full scouting combine scorecard"
            >
              <div className="draft-board__primary-body">
                <DraftCentralTestTableHead
                  title="Scouting Combine Scorecard"
                  searchQuery={tableSearch}
                  onSearchChange={setTableSearch}
                  searchPlaceholder="Search top 150…"
                  searchAriaLabel="Search scouting combine scorecard"
                />
                <div className="draft-board__scroll draft-board__scroll--primary">
                  {rows.length > 0 ? (
                    <OptionADraftCentralTestCombineScorecardTable
                      rows={rows}
                      searchQuery={tableSearch}
                      selectedPositions={selectedPositions}
                      onSelectedPositionsChange={setSelectedPositions}
                      focusedKeys={focusedKeys}
                      onSelectProspect={handleSelectProspect}
                    />
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
        </>
      )}
    </div>
  )
}
