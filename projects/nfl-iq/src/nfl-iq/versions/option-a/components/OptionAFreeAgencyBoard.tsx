import { useMemo, useState } from 'react'
import { NFL_LOGO, ngsTeamLogoUrl } from '../../../constants'
import {
  FREE_AGENCY_AVAILABLE,
} from '../../../data/free-agency-board.mock'
import type { FreeAgencyAvailableAgent } from '../../../types/free-agency-board'
import { useIqTeam } from '../../../context/useIqTeam'
import { MarketCard } from '../../../components/FreeAgencyBoard'
import { TeamCentralRosterTile } from '../../../components/TeamCentralRosterTile'
import {
  OptionASortableTh,
  type OptionASortDirection,
} from './OptionASortableTh'
import { OptionATableFilterDropdown } from './OptionATableFilterDropdown'
import { getFreeAgencyNeedSortRank } from '../data/free-agency-team-needs'
import {
  agentMatchesAlignmentFilter,
  agentMatchesPositionFilter,
  agentMatchesSearchQuery,
  getFreeAgencyAlignmentOptions,
  getFreeAgencyPositionOptions,
} from '../utils/free-agency-filters'
import { FreeAgencyNeedCell } from './FreeAgencyNeedCell'
import { FaBoardTableSearch } from '../../../components/FaBoardTableSearch'
import '../../../components/fa-board-table-search.css'
import '../../../components/free-agency-board.css'
import '../../../components/team-central-charts.css'
import './option-a-free-agency-board.css'
import './option-a-free-agency-need.css'

const SNAPS_PG_MAX = 70
const TOP_SPEED_MAX = 22

type AgentSortKey =
  | 'rank'
  | 'need'
  | 'player'
  | 'age'
  | 'gamesPlayed'
  | 'snaps'
  | 'snapsPerGame'
  | 'topSpeed'

function compareAgents(
  a: FreeAgencyAvailableAgent,
  b: FreeAgencyAvailableAgent,
  key: AgentSortKey,
  direction: OptionASortDirection,
  teamId: string | null,
): number {
  let cmp: number
  if (key === 'player') {
    cmp = a.player.localeCompare(b.player, undefined, { sensitivity: 'base' })
  } else if (key === 'need' && teamId) {
    cmp =
      getFreeAgencyNeedSortRank(a.alignment, teamId) -
      getFreeAgencyNeedSortRank(b.alignment, teamId)
  } else if (key === 'need') {
    cmp = 0
  } else {
    const av = a[key]
    const bv = b[key]
    cmp = av < bv ? -1 : av > bv ? 1 : 0
  }
  return direction === 'asc' ? cmp : -cmp
}
function BarMetricCell({
  value,
  max,
  decimals = 1,
  columnClass,
}: {
  value: number
  max: number
  decimals?: number
  columnClass: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <td className={`fa-board__bar-cell ${columnClass}`}>
      <span className="fa-board__bar-track" aria-hidden>
        <span className="fa-board__bar-fill" style={{ width: `${pct}%` }} />
      </span>
      <span className="fa-board__bar-value">{value.toFixed(decimals)}</span>
    </td>
  )
}

function TrendIcon({ trend }: { trend?: 'down' | 'up' }) {
  if (!trend) return null
  return (
    <span
      className={
        trend === 'down'
          ? 'fa-board__trend fa-board__trend--down'
          : 'fa-board__trend fa-board__trend--up'
      }
      aria-hidden
    />
  )
}

function TeamLogo({ teamId, label }: { teamId: string; label: string }) {
  return (
    <img
      className="fa-board__team-logo"
      src={ngsTeamLogoUrl(teamId)}
      alt={label}
      width={20}
      height={20}
    />
  )
}

function AgentsTableColGroup({ showNeedColumn }: { showNeedColumn: boolean }) {
  return (
    <colgroup>
      <col className="fa-board__col-w--rank" />
      <col className="fa-board__col-w--pos" />
      {showNeedColumn ? <col className="fa-board__col-w--need" /> : null}
      <col className="fa-board__col-w--player" />
      <col className="fa-board__col-w--team" />
      <col className="fa-board__col-w--team" />
      <col className="fa-board__col-w--num" />
      <col className="fa-board__col-w--num" />
      <col className="fa-board__col-w--snaps" />
      <col className="fa-board__col-w--snaps-pg" />
      <col className="fa-board__col-w--alignment" />
      <col className="fa-board__col-w--top-speed" />
    </colgroup>
  )
}

function AvailableAgentsCard({ selectedTeamId }: { selectedTeamId: string | null }) {
  const showNeedColumn = selectedTeamId != null
  const [sortKey, setSortKey] = useState<AgentSortKey>('rank')
  const [sortDirection, setSortDirection] = useState<OptionASortDirection>('asc')
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(
    () => new Set(),
  )
  const [selectedAlignments, setSelectedAlignments] = useState<Set<string>>(
    () => new Set(),
  )
  const [searchQuery, setSearchQuery] = useState('')
  const positionOptions = useMemo(() => getFreeAgencyPositionOptions(), [])
  const alignmentOptions = useMemo(() => getFreeAgencyAlignmentOptions(), [])

  const handleSort = (key: string) => {
    const nextKey = key as AgentSortKey
    if (sortKey === nextKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(nextKey)
      setSortDirection(nextKey === 'need' ? 'desc' : 'asc')
    }
  }

  const rows = useMemo(() => {
    const filtered = FREE_AGENCY_AVAILABLE.filter(
      (row) =>
        agentMatchesSearchQuery(row, searchQuery) &&
        agentMatchesPositionFilter(row.position, selectedPositions) &&
        agentMatchesAlignmentFilter(row.alignment, selectedAlignments),
    )
    return [...filtered].sort((a, b) =>
      compareAgents(a, b, sortKey, sortDirection, selectedTeamId),
    )
  }, [
    searchQuery,
    selectedPositions,
    selectedAlignments,
    selectedTeamId,
    sortKey,
    sortDirection,
  ])

  const maxSnapsPg = useMemo(
    () => Math.max(...rows.map((r) => r.snapsPerGame), SNAPS_PG_MAX),
    [rows],
  )

  return (
    <section className="fa-board__card fa-board__card--agents">
      <header className="fa-board__card-head">
        <h2 className="fa-board__card-title">BEST AVAILABLE FREE AGENTS</h2>
        <FaBoardTableSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search players…"
          aria-label="Search free agents"
        />
      </header>
      <div className="fa-board__scroll">
        <table className="fa-board__table fa-board__table--agents">
          <AgentsTableColGroup showNeedColumn={showNeedColumn} />
          <thead>
            <tr>
              <OptionASortableTh
                label="Rank"
                sortKey="rank"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--rank"
              />
              <OptionATableFilterDropdown
                label="Pos"
                className="fa-board__col--pos"
                options={positionOptions}
                selected={selectedPositions}
                onSelectedChange={setSelectedPositions}
              />
              {showNeedColumn && selectedTeamId ? (
                <OptionASortableTh
                  label="Need"
                  sortKey="need"
                  activeKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                  groupCenter
                  className="fa-board__th fa-board__th--need"
                />
              ) : null}
              <OptionASortableTh
                label="Player"
                sortKey="player"
                sortVariant="alpha"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__th--player-col"
              />
              <th scope="col" className="fa-board__col--team">
                2025
              </th>
              <th scope="col" className="fa-board__col--team">
                2026
              </th>
              <OptionASortableTh
                label="Age"
                sortKey="age"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--num"
              />
              <OptionASortableTh
                label="GP"
                sortKey="gamesPlayed"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--num"
              />
              <OptionASortableTh
                label="Snaps"
                sortKey="snaps"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--snaps"
              />
              <OptionASortableTh
                label="Snaps/G"
                sortKey="snapsPerGame"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--snaps-pg"
              />
              <OptionATableFilterDropdown
                label="Alignment"
                className="fa-board__col--alignment"
                options={alignmentOptions}
                selected={selectedAlignments}
                onSelectedChange={setSelectedAlignments}
              />
              <OptionASortableTh
                label="Top Speed"
                sortKey="topSpeed"
                activeKey={sortKey}
                direction={sortDirection}
                onSort={handleSort}
                className="fa-board__col--top-speed"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <AgentRow
                key={row.rank}
                row={row}
                maxSnapsPg={maxSnapsPg}
                selectedTeamId={selectedTeamId}
                showNeedColumn={showNeedColumn}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AgentRow({
  row,
  maxSnapsPg,
  selectedTeamId,
  showNeedColumn,
}: {
  row: FreeAgencyAvailableAgent
  maxSnapsPg: number
  selectedTeamId: string | null
  showNeedColumn: boolean
}) {
  return (
    <tr>
      <td className="fa-board__rank fa-board__col--rank">#{row.rank}</td>
      <td className="fa-board__col--pos">{row.position}</td>
      {showNeedColumn && selectedTeamId ? (
        <FreeAgencyNeedCell alignment={row.alignment} teamId={selectedTeamId} />
      ) : null}
      <td className="fa-board__player">
        {row.injuryOta ? (
          <span className="fa-board__player-leading">
            <span className="fa-board__injury" title="Injury affects OTA availability" aria-hidden>
              +
            </span>
          </span>
        ) : null}
        <span className="fa-board__player-name">{row.player}</span>
      </td>
      <td className="fa-board__col--team">
        <span className="fa-board__team-cell">
          <TrendIcon trend={row.trend2025} />
          <TeamLogo teamId={row.team2025} label={row.team2025} />
        </span>
      </td>
      <td className="fa-board__col--team">
        <img
          className="fa-board__nfl-shield"
          src={NFL_LOGO}
          alt="NFL"
          width={18}
          height={18}
        />
      </td>
      <td
        className={
          row.ageNearWall
            ? 'fa-board__age fa-board__age--wall fa-board__col--num'
            : 'fa-board__age fa-board__col--num'
        }
      >
        {row.age}
      </td>
      <td className="fa-board__col--num">{row.gamesPlayed}</td>
      <td className="fa-board__col--snaps">{row.snaps.toLocaleString()}</td>
      <BarMetricCell
        value={row.snapsPerGame}
        max={maxSnapsPg}
        decimals={1}
        columnClass="fa-board__col--snaps-pg"
      />
      <td className="fa-board__alignment fa-board__col--alignment">{row.alignment}</td>
      <BarMetricCell
        value={row.topSpeed}
        max={TOP_SPEED_MAX}
        decimals={2}
        columnClass="fa-board__col--top-speed"
      />
    </tr>
  )
}

function FreeAgencyLegend() {
  return (
    <footer className="fa-board__legend" aria-label="Chart legend">
      <span className="fa-board__legend-item">
        <span className="fa-board__diamond fa-board__diamond--elite" aria-hidden />
        Elite Blue-Chip
      </span>
      <span className="fa-board__legend-item">
        <span className="fa-board__diamond fa-board__diamond--traits" aria-hidden />
        Blue Traits
      </span>
      <span className="fa-board__legend-item">
        <span className="fa-board__trend fa-board__trend--down" aria-hidden />
        <span className="fa-board__trend fa-board__trend--up" aria-hidden />
        Ascending/Descending Solid Starter
      </span>
      <span className="fa-board__legend-item">
        <span className="fa-board__injury" aria-hidden>
          +
        </span>
        Injury Affects OTA Availability
      </span>
      <span className="fa-board__legend-item">
        <span className="fa-board__age fa-board__age--wall">32</span>
        Near Position Wall Age
      </span>
    </footer>
  )
}

export function OptionAFreeAgencyBoard() {
  const { selectedTeamId } = useIqTeam()

  return (
    <div className="fa-board fa-board--option-a">
      <div className="fa-board__grid">
        <AvailableAgentsCard selectedTeamId={selectedTeamId} />
        {selectedTeamId ? (
          <section
            className="fa-board__card fa-board__card--sidebar fa-board__card--team-roster"
            data-solution-tour="free-agency-roster-panel"
          >
            <TeamCentralRosterTile teamId={selectedTeamId} headerLayout="sidebar" />
          </section>
        ) : (
          <MarketCard className="fa-board__card--sidebar" />
        )}
      </div>

      <FreeAgencyLegend />
    </div>
  )
}
