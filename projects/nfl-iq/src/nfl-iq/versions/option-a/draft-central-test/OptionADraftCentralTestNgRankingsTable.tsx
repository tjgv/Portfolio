import { useMemo, useState } from 'react'
import { DraftNgRankingsRows } from '../../../components/DraftNgRankingsTable'
import type { DraftBoardProspect } from '../../../types'
import type { DraftScoreRankMaps } from '../../../utils/draft-ng-ranks'
import { useOptionATableSort } from '../hooks/useOptionATableSort'
import {
  getUniquePositions,
  matchesPositionFilter,
} from '../utils/option-a-sort-utils'
import {
  sortNgRankingProspects,
  type NgRankingsSortKey,
} from '../utils/option-a-ng-rankings-sort'
import { OptionASortableTh } from '../components/OptionASortableTh'
import { OptionATableFilterDropdown } from '../components/OptionATableFilterDropdown'
import '../components/option-a-sortable-table.css'
import '../components/option-a-table-filter-dropdown.css'

type OptionADraftCentralTestNgRankingsTableProps = {
  rows: DraftBoardProspect[]
  ranks: DraftScoreRankMaps
}

export function OptionADraftCentralTestNgRankingsTable({
  rows,
  ranks,
}: OptionADraftCentralTestNgRankingsTableProps) {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<NgRankingsSortKey>('overall', 'desc')
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
    return sortNgRankingProspects(filtered, ranks, sortKey, sortDirection)
  }, [rows, ranks, selectedPositions, sortKey, sortDirection])

  const th = (label: string, key: NgRankingsSortKey, alpha = false) => (
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
        key.startsWith('rk')
          ? 'ng-rankings__th ng-rankings__th--rk'
          : key === 'name'
            ? 'ng-rankings__th ng-rankings__th--name'
            : key === 'school'
              ? 'ng-rankings__th ng-rankings__th--school'
              : key === 'overall'
                ? 'ng-rankings__th ng-rankings__th--overall'
                : key === 'athleticism'
                  ? 'ng-rankings__th ng-rankings__th--metric'
                  : key === 'production'
                    ? 'ng-rankings__th ng-rankings__th--production'
                    : 'ng-rankings__th'
      }
    />
  )

  return (
    <table className="ng-rankings__table">
      <thead>
        <tr>
          {th('Name', 'name', true)}
          <OptionATableFilterDropdown
            label="Pos"
            className="ng-rankings__th ng-rankings__th--short"
            options={positionOptions}
            selected={selectedPositions}
            onSelectedChange={setSelectedPositions}
          />
          {th('School', 'school', true)}
          {th('Rk', 'rkOverall')}
          {th('Overall', 'overall')}
          {th('Athleticism', 'athleticism')}
          {th('Rk', 'rkAthleticism')}
          {th('Production', 'production')}
          {th('Rk', 'rkProduction')}
        </tr>
      </thead>
      <tbody>
        <DraftNgRankingsRows rows={sortedRows} ranks={ranks} />
      </tbody>
    </table>
  )
}
