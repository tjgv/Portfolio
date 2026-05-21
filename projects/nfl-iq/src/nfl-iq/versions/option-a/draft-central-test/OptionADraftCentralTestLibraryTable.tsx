import { useMemo } from 'react'
import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { tierFromNgsScore } from '../../../utils/draft-score-tier'
import { SchoolTableCell } from '../../../components/SchoolTableCell'
import { useOptionATableSort } from '../hooks/useOptionATableSort'
import {
  getUniquePositions,
  matchesPositionFilter,
} from '../utils/option-a-sort-utils'
import {
  sortCombineProspects,
  type CombineSortKey,
} from '../utils/option-a-draft-combine-sort'
import { OptionASortableTh } from '../components/OptionASortableTh'
import { OptionATableFilterDropdown } from '../components/OptionATableFilterDropdown'
import { filterDraftTestTop150Prospects } from './draft-test-top-150'
import { prospectMatchesSearch } from './prospect-matches-search'
import { DraftCentralTestLibraryRowMenu } from './DraftCentralTestLibraryRowMenu'
import { DraftTestEmptyDash } from './DraftTestEmptyDash'
import '../components/option-a-sortable-table.css'
import '../components/option-a-table-filter-dropdown.css'

function NgsScoreCell({ score }: { score: number }) {
  const tier = tierFromNgsScore(score)
  return (
    <td className="draft-board__td draft-board__td--score draft-board__td--ngs-metric">
      <span className="draft-board__ngs-wrap">
        <span className={`draft-board__ngs-icon draft-board__ngs-icon--${tier}`} aria-hidden />
        <span className="draft-board__ngs-num">{score}</span>
      </span>
    </td>
  )
}

type OptionADraftCentralTestLibraryTableProps = {
  rows: DraftBoardProspect[]
  searchQuery: string
  selectedPositions: Set<string>
  onSelectedPositionsChange: (next: Set<string>) => void
  focusedKeys: string[]
  onSelectProspect: (key: string, shiftKey: boolean) => void
  onOpenProspect: (key: string) => void
}

export function OptionADraftCentralTestLibraryTable({
  rows,
  searchQuery,
  selectedPositions,
  onSelectedPositionsChange,
  focusedKeys,
  onSelectProspect,
  onOpenProspect,
}: OptionADraftCentralTestLibraryTableProps) {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<CombineSortKey>('djRank')

  const top150 = useMemo(() => filterDraftTestTop150Prospects(rows), [rows])

  const positionOptions = useMemo(
    () => getUniquePositions(top150.map((r) => r.position)),
    [top150],
  )

  const libraryRows = useMemo(() => {
    const filtered = top150.filter(
      (r) =>
        prospectMatchesSearch(r, searchQuery) &&
        matchesPositionFilter(r.position, selectedPositions),
    )
    return sortCombineProspects(filtered, sortKey, sortDirection)
  }, [top150, searchQuery, selectedPositions, sortKey, sortDirection])

  const th = (label: string, key: CombineSortKey, alpha = false) => {
    const isNgsMetric =
      key === 'athleticism' || key === 'production' || key === 'overall'
    return (
      <OptionASortableTh
        key={key}
        label={label}
        sortKey={key}
        sortVariant={alpha ? 'alpha' : 'numeric'}
        activeKey={sortKey}
        direction={sortDirection}
        onSort={handleSort}
        align={key === 'school' || isNgsMetric ? 'center' : 'left'}
        className={
          key === 'name'
            ? 'draft-board__th--player-col'
            : key === 'school'
              ? 'draft-board__th--school'
              : isNgsMetric
                ? 'draft-board__th--ngs-metric'
                : undefined
        }
      />
    )
  }

  return (
    <table className="draft-board__table draft-test__library-table">
      <colgroup>
        <col className="draft-test__library-col draft-test__library-col--dj" />
        <col className="draft-test__library-col draft-test__library-col--pos" />
        <col className="draft-test__library-col draft-test__library-col--player" />
        <col className="draft-test__library-col draft-test__library-col--school" />
        <col className="draft-test__library-col draft-test__library-col--metric" />
        <col className="draft-test__library-col draft-test__library-col--metric" />
        <col className="draft-test__library-col draft-test__library-col--metric" />
        <col className="draft-test__library-col draft-test__library-col--actions" />
      </colgroup>
      <thead>
        <tr>
          {th('DJ', 'djRank')}
          <OptionATableFilterDropdown
            label="Pos"
            className="draft-board__th"
            options={positionOptions}
            selected={selectedPositions}
            onSelectedChange={onSelectedPositionsChange}
          />
          {th('Player', 'name', true)}
          {th('School', 'school', true)}
          {th('Athleticism', 'athleticism')}
          {th('Production', 'production')}
          {th('Overall', 'overall')}
          <th
            scope="col"
            className="draft-board__th draft-test__library-th--actions"
            aria-label="Actions"
          />
        </tr>
      </thead>
      <tbody>
        {libraryRows.map((p) => {
          const key = prospectStableKey(p)
          const isFocused = focusedKeys.includes(key)
          return (
            <tr
              key={key}
              className={
                isFocused
                  ? 'draft-test__library-row draft-test__library-row--focused'
                  : 'draft-test__library-row'
              }
              {...(p.name === 'Sonny Styles'
                ? { 'data-solution-tour': 'draft-library-sonny-styles' }
                : {})}
              tabIndex={0}
              aria-selected={isFocused}
              onClick={(e) => onSelectProspect(key, e.shiftKey)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectProspect(key, e.shiftKey)
                }
              }}
            >
              <td className="draft-board__td">
                {p.djRank != null ? `#${p.djRank}` : <DraftTestEmptyDash />}
              </td>
              <td className="draft-board__td">{p.position}</td>
              <td className="draft-board__td draft-board__td--player">{p.name}</td>
              <SchoolTableCell
                className="draft-board__td draft-board__td--school"
                schoolAbbr={p.schoolAbbr || p.school}
                schoolLogoUrl={p.schoolLogoUrl}
              />
              <NgsScoreCell score={p.athleticism} />
              <NgsScoreCell score={p.production} />
              <NgsScoreCell score={p.overall} />
              <td className="draft-board__td draft-test__library-td--actions">
                <DraftCentralTestLibraryRowMenu
                  prospectName={p.name}
                  onOpenProspect={() => onOpenProspect(key)}
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
