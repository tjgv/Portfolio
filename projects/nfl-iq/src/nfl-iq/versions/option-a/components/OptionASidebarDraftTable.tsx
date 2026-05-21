import { useMemo, useState } from 'react'
import { DRAFT_BOARD_MOCK } from '../../../data/draft-board'
import type { DraftBoardProspect } from '../../../types'
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

type DraftSortKey = 'djRank' | 'player' | 'overall'

function draftOverallTone(score: number): 'super' | 'good' | 'avg' | 'low' {
  if (score >= 93) return 'super'
  if (score >= 84) return 'good'
  if (score >= 75) return 'avg'
  return 'low'
}

function sortDraftRows(
  rows: DraftBoardProspect[],
  key: DraftSortKey,
  direction: 'asc' | 'desc',
): DraftBoardProspect[] {
  return [...rows].sort((a, b) => {
    switch (key) {
      case 'djRank':
        return compareNumeric(
          a.djRank ?? Number.POSITIVE_INFINITY,
          b.djRank ?? Number.POSITIVE_INFINITY,
          direction,
        )
      case 'player':
        return compareAlpha(a.name, b.name, direction)
      case 'overall':
        return compareNumeric(a.overall, b.overall, direction)
      default:
        return 0
    }
  })
}

export function OptionASidebarDraftTable() {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<DraftSortKey>('djRank')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )

  const baseRows = useMemo(
    () => DRAFT_BOARD_MOCK.filter((p) => p.djRank != null),
    [],
  )

  const positionOptions = useMemo(
    () => getUniquePositions(baseRows.map((r) => r.position)),
    [baseRows],
  )

  const rows = useMemo(() => {
    const filtered = baseRows.filter((r) =>
      matchesPositionFilter(r.position, selectedPositions),
    )
    return sortDraftRows(filtered, sortKey, sortDirection)
  }, [baseRows, selectedPositions, sortKey, sortDirection])

  return (
    <table className="fa-board__table fa-board__table--draft">
      <thead>
        <tr>
          <OptionASortableTh
            label="DJ 2.0"
            sortKey="djRank"
            activeKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
            className="fa-board__th--rank"
          />
          <OptionATableFilterDropdown
            label="Pos"
            options={positionOptions}
            selected={selectedPositions}
            onSelectedChange={setSelectedPositions}
          />
          <OptionASortableTh
            label="Player"
            sortKey="player"
            sortVariant="alpha"
            activeKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
            className="fa-board__th--player-col"
          />
          <th scope="col" className="fa-board__th--school" aria-label="School" />
          <OptionASortableTh
            label="NextGen"
            sortKey="overall"
            activeKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
            className="fa-board__th--nextgen"
          />
          <th scope="col" className="fa-board__th--status" aria-label="Tier" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const tone = draftOverallTone(row.overall)
          return (
            <tr key={`${row.djRank}-${row.name}`}>
              <td className="fa-board__draft-rank">#{row.djRank}</td>
              <td>{row.position}</td>
              <td className="fa-board__player">{row.name}</td>
              <SchoolTableCell
                className="fa-board__school-cell"
                schoolAbbr={row.schoolAbbr || row.school}
                schoolLogoUrl={row.schoolLogoUrl}
              />
              <td className="fa-board__nextgen">{row.overall}</td>
              <td className="fa-board__status-cell">
                <span
                  className={`fa-board__draft-dot fa-board__draft-dot--${tone}`}
                  aria-hidden
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
