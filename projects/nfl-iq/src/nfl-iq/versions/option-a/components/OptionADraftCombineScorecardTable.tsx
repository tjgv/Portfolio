import { useMemo, useState } from 'react'
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
import { OptionADraftCombineScorecardRows } from './OptionADraftCombineScorecardRows'
import { OptionASortableTh } from './OptionASortableTh'
import { OptionATableFilterDropdown } from './OptionATableFilterDropdown'
import './option-a-draft-central-need.css'
import './option-a-sortable-table.css'
import './option-a-table-filter-dropdown.css'

type OptionADraftCombineScorecardTableProps = {
  rows: DraftBoardProspect[]
}

export function OptionADraftCombineScorecardTable({
  rows,
}: OptionADraftCombineScorecardTableProps) {
  const { selectedTeamId } = useIqTeam()
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<CombineSortKey>('djRank')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )

  const positionOptions = useMemo(
    () => getUniquePositions(rows.map((r) => r.position)),
    [rows],
  )

  const teamNeedsLayout = useMemo(() => {
    if (selectedTeamId == null) return null
    return computeDraftCentralTeamNeeds(selectedTeamId, rows)
  }, [selectedTeamId, rows])

  const sortedRows = useMemo(() => {
    const filtered = rows.filter((r) =>
      matchesPositionFilter(r.position, selectedPositions),
    )
    return sortCombineProspects(filtered, sortKey, sortDirection)
  }, [rows, selectedPositions, sortKey, sortDirection])

  const th = (label: string, key: CombineSortKey, alpha = false) => (
    <OptionASortableTh
      key={key}
      label={label}
      sortKey={key}
      sortVariant={alpha ? 'alpha' : 'numeric'}
      activeKey={sortKey}
      direction={sortDirection}
      onSort={handleSort}
      align={key === 'school' ? 'center' : 'left'}
      className={
        key === 'name'
          ? 'draft-board__th--player-col'
          : key === 'school'
            ? 'draft-board__th--school'
            : undefined
      }
    />
  )

  return (
    <table className="draft-board__table">
      <thead>
        <tr>
          {th('DJ', 'djRank')}
          <OptionATableFilterDropdown
            label="Pos"
            className="draft-board__th"
            options={positionOptions}
            selected={selectedPositions}
            onSelectedChange={setSelectedPositions}
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
        <OptionADraftCombineScorecardRows
          rows={sortedRows}
          teamNeedsLayout={teamNeedsLayout}
        />
      </tbody>
    </table>
  )
}
