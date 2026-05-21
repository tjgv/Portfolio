import { useMemo, useState } from 'react'
import { ngsTeamLogoUrl } from '../../../constants'
import { FREE_AGENCY_MARKET } from '../../../data/free-agency-board.mock'
import type { FreeAgencyMarketPlayer } from '../../../types/free-agency-board'
import { useOptionATableSort } from '../hooks/useOptionATableSort'
import {
  compareAlpha,
  compareNumeric,
  getUniquePositions,
  matchesPositionFilter,
  parseAavMillions,
} from '../utils/option-a-sort-utils'
import { OptionASortableTh } from './OptionASortableTh'
import { OptionATableFilterDropdown } from './OptionATableFilterDropdown'
import './option-a-sortable-table.css'
import './option-a-table-filter-dropdown.css'

type MarketSortKey = 'player' | 'age' | 'aav'

function sortMarketRows(
  rows: FreeAgencyMarketPlayer[],
  key: MarketSortKey,
  direction: 'asc' | 'desc',
): FreeAgencyMarketPlayer[] {
  return [...rows].sort((a, b) => {
    switch (key) {
      case 'player':
        return compareAlpha(a.player, b.player, direction)
      case 'age':
        return compareNumeric(a.age, b.age, direction)
      case 'aav':
        return compareNumeric(
          parseAavMillions(a.aav),
          parseAavMillions(b.aav),
          direction,
        )
      default:
        return 0
    }
  })
}

function TeamLogo({ teamId }: { teamId: string }) {
  return (
    <img
      className="fa-board__team-logo"
      src={ngsTeamLogoUrl(teamId)}
      alt=""
      width={20}
      height={20}
    />
  )
}

export function OptionAMarketTable() {
  const { sortKey, sortDirection, handleSort } =
    useOptionATableSort<MarketSortKey>('player')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )

  const positionOptions = useMemo(
    () => getUniquePositions(FREE_AGENCY_MARKET.map((r) => r.position)),
    [],
  )

  const rows = useMemo(() => {
    const filtered = FREE_AGENCY_MARKET.filter((r) =>
      matchesPositionFilter(r.position, selectedPositions),
    )
    return sortMarketRows(filtered, sortKey, sortDirection)
  }, [selectedPositions, sortKey, sortDirection])

  return (
    <table className="fa-board__table fa-board__table--market">
      <thead>
        <tr>
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
            leadingGutter
          />
          <th scope="col">2026</th>
          <OptionASortableTh
            label="Age"
            sortKey="age"
            activeKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
          <OptionASortableTh
            label="AAV"
            sortKey="aav"
            activeKey={sortKey}
            direction={sortDirection}
            onSort={handleSort}
          />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.player}-${row.team2026}`}>
            <td>{row.position}</td>
            <td className="fa-board__player">
              <span className="fa-board__player-leading">
                {row.elite ? (
                  <span className="fa-board__diamond fa-board__diamond--elite" aria-hidden />
                ) : null}
              </span>
              <span className="fa-board__player-name">{row.player}</span>
            </td>
            <td>
              <TeamLogo teamId={row.team2026} />
            </td>
            <td>{row.age}</td>
            <td className="fa-board__aav">{row.aav}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
