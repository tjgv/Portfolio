import { useMemo } from 'react'
import { TableColCell } from '../../../components/TableColCell'
import { useIqTeam } from '../../../context/useIqTeam'
import type { DraftBoardProspect } from '../../../types'
import { computeDraftCentralTeamNeeds } from '../data/draft-central-team-needs'
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
import { OptionADraftCentralTestCombineScorecardRows } from './OptionADraftCentralTestCombineScorecardRows'
import { filterDraftTestTop150Prospects } from './draft-test-top-150'
import { prospectMatchesSearch } from './prospect-matches-search'
import '../components/option-a-draft-central-need.css'
import '../components/option-a-sortable-table.css'
import '../components/option-a-table-filter-dropdown.css'

type OptionADraftCentralTestCombineScorecardTableProps = {
  rows: DraftBoardProspect[]
  searchQuery: string
  selectedPositions: Set<string>
  onSelectedPositionsChange: (next: Set<string>) => void
  focusedKeys: string[]
  onSelectProspect: (key: string, shiftKey: boolean) => void
}

export function OptionADraftCentralTestCombineScorecardTable({
  rows,
  searchQuery,
  selectedPositions,
  onSelectedPositionsChange,
  focusedKeys,
  onSelectProspect,
}: OptionADraftCentralTestCombineScorecardTableProps) {
  const { selectedTeamId } = useIqTeam()
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<CombineSortKey>('djRank')

  const top150 = useMemo(() => filterDraftTestTop150Prospects(rows), [rows])

  const positionOptions = useMemo(
    () => getUniquePositions(top150.map((r) => r.position)),
    [top150],
  )

  const teamNeedsLayout = useMemo(() => {
    if (selectedTeamId == null) return null
    return computeDraftCentralTeamNeeds(selectedTeamId, rows)
  }, [selectedTeamId, rows])

  const sortedRows = useMemo(() => {
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
    <table className="draft-board__table draft-test__scorecard-table">
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
          <th scope="col" className="draft-board__th draft-board__th--got">
            <TableColCell as="span" center>
              Got
            </TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--rivals">
            <TableColCell as="span" center>
              Rivals
            </TableColCell>
          </th>
          {th('School', 'school', true)}
          {th('40 MPH', 'fortyMph')}
          {th('40 Time', 'fortyTime')}
          {th('10-Yd', 'tenYd')}
          {th('Broad', 'broad')}
          {th('Vert', 'vert')}
          {th('Shuttle', 'shuttle')}
          {th('Cone', 'cone')}
          {th('Bench', 'bench')}
          {th('Raw Ath', 'rawAth')}
          {th('Athleticism', 'athleticism')}
          {th('Production', 'production')}
          {th('Overall', 'overall')}
          {th('Ht', 'ht')}
          {th('Wt', 'wt')}
          {th('Hand', 'hand')}
          {th('Arm', 'arm')}
          {th('Wing', 'wing')}
        </tr>
      </thead>
      <tbody>
        <OptionADraftCentralTestCombineScorecardRows
          rows={sortedRows}
          teamNeedsLayout={teamNeedsLayout}
          focusedKeys={focusedKeys}
          onSelectProspect={onSelectProspect}
        />
      </tbody>
    </table>
  )
}
