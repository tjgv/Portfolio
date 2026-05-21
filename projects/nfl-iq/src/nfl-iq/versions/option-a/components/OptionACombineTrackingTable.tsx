import { useMemo, useState } from 'react'
import type { CombineTrackingPanel, CombineTrackingRow } from '../../../types/combine-tracking'
import { useOptionATableSort } from '../hooks/useOptionATableSort'
import {
  compareAlpha,
  compareNumeric,
  getUniquePositions,
  matchesPositionFilter,
} from '../utils/option-a-sort-utils'
import { SchoolTableCell } from '../../../components/SchoolTableCell'
import { OptionASortableTh } from './OptionASortableTh'
import { OptionATableFilterDropdown } from './OptionATableFilterDropdown'
import './option-a-sortable-table.css'
import './option-a-table-filter-dropdown.css'

type CombineTrackSortKey = 'player' | 'school' | 'year' | 'metric' | 'time'

function sortCombineTrackingRows(
  rows: CombineTrackingRow[],
  key: CombineTrackSortKey,
  direction: 'asc' | 'desc',
): CombineTrackingRow[] {
  return [...rows].sort((a, b) => {
    switch (key) {
      case 'player':
        return compareAlpha(a.player, b.player, direction)
      case 'school':
        return compareAlpha(a.school, b.school, direction)
      case 'year':
        return compareNumeric(a.year, b.year, direction)
      case 'metric':
        return compareAlpha(a.metric, b.metric, direction)
      case 'time':
        return compareAlpha(a.time ?? '', b.time ?? '', direction)
      default:
        return 0
    }
  })
}

type OptionACombineTrackingTableProps = {
  panel: CombineTrackingPanel
  rows: CombineTrackingRow[]
}

export function OptionACombineTrackingTable({
  panel,
  rows,
}: OptionACombineTrackingTableProps) {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<CombineTrackSortKey>('player')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )

  const positionOptions = useMemo(
    () => getUniquePositions(rows.map((r) => r.position)),
    [rows],
  )

  const sortedRows = useMemo(() => {
    const filtered = rows.filter((r) =>
      matchesPositionFilter(r.position, selectedPositions),
    )
    return sortCombineTrackingRows(filtered, sortKey, sortDirection)
  }, [rows, selectedPositions, sortKey, sortDirection])

  return (
    <div className="combine-tracking__table-scroll">
      <table className="combine-tracking__table">
        <thead>
          <tr>
            <OptionASortableTh
              label="Player"
              sortKey="player"
              sortVariant="alpha"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
              className="combine-tracking__th--player"
            />
            <OptionATableFilterDropdown
              label="Pos"
              options={positionOptions}
              selected={selectedPositions}
              onSelectedChange={setSelectedPositions}
            />
            <OptionASortableTh
              label="School"
              sortKey="school"
              sortVariant="alpha"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <OptionASortableTh
              label="Year"
              sortKey="year"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
            />
            <OptionASortableTh
              label={panel.metricColumnLabel}
              sortKey="metric"
              activeKey={sortKey}
              direction={sortDirection}
              onSort={handleSort}
              className="combine-tracking__th combine-tracking__th--metric"
            />
            {panel.showTimeColumn ? (
              <OptionASortableTh
                label="Time"
                sortKey="time"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
              />
            ) : null}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr key={`${row.player}-${row.year}-${row.metric}`}>
              <td className="combine-tracking__td combine-tracking__td--player">
                {row.player}
              </td>
              <td>{row.position}</td>
              <SchoolTableCell
                className="combine-tracking__td combine-tracking__td--school"
                schoolAbbr={row.school}
              />
              <td>{row.year}</td>
              <td className="combine-tracking__td combine-tracking__td--metric">
                {row.metric}
              </td>
              {panel.showTimeColumn ? <td>{row.time ?? '—'}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
