import { useMemo, useState } from 'react'
import { NFL_LOGO, ngsTeamLogoUrl } from '../constants'
import { DRAFT_BOARD_MOCK } from '../data/draft-board'
import {
  FREE_AGENCY_AVAILABLE,
  FREE_AGENCY_MARKET,
} from '../data/free-agency-board.mock'
import type { FreeAgencyAvailableAgent } from '../types/free-agency-board'
import type { DraftBoardProspect } from '../types'
import { publicAsset } from '../lib/app-paths'
import { FaBoardTableSearch } from './FaBoardTableSearch'
import { SchoolTableCell } from './SchoolTableCell'
import './fa-board-table-search.css'
import './free-agency-board.css'

const SNAPS_PG_MAX = 70
const TOP_SPEED_MAX = 22
const NFL_DRAFT_LOGO = publicAsset('/images/nfl-draft.png')

function draftOverallTone(score: number): 'super' | 'good' | 'avg' | 'low' {
  if (score >= 93) return 'super'
  if (score >= 84) return 'good'
  if (score >= 75) return 'avg'
  return 'low'
}

function BarMetricCell({
  value,
  max,
  decimals = 1,
}: {
  value: number
  max: number
  decimals?: number
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <td className="fa-board__bar-cell">
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

function agentMatchesSearch(
  row: FreeAgencyAvailableAgent,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    row.player.toLowerCase().includes(q) ||
    row.position.toLowerCase().includes(q) ||
    row.team2025.toLowerCase().includes(q) ||
    row.alignment.toLowerCase().includes(q)
  )
}

function AvailableAgentsCard() {
  const [searchQuery, setSearchQuery] = useState('')
  const rows = useMemo(
    () => FREE_AGENCY_AVAILABLE.filter((row) => agentMatchesSearch(row, searchQuery)),
    [searchQuery],
  )

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
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Pos</th>
              <th scope="col" className="fa-board__th--player-col">
                Player
              </th>
              <th scope="col">2025</th>
              <th scope="col">2026</th>
              <th scope="col">Age</th>
              <th scope="col">GP</th>
              <th scope="col">Snaps</th>
              <th scope="col">Snaps/G</th>
              <th scope="col">Alignment</th>
              <th scope="col">Top Speed</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <AgentRow key={row.rank} row={row} maxSnapsPg={maxSnapsPg} />
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
}: {
  row: FreeAgencyAvailableAgent
  maxSnapsPg: number
}) {
  return (
    <tr>
      <td className="fa-board__rank">#{row.rank}</td>
      <td>{row.position}</td>
      <td className="fa-board__player">
        <span className="fa-board__player-leading">
          {row.injuryOta ? (
            <span className="fa-board__injury" title="Injury affects OTA availability" aria-hidden>
              +
            </span>
          ) : null}
        </span>
        <span className="fa-board__player-name">{row.player}</span>
      </td>
      <td>
        <span className="fa-board__team-cell">
          <TrendIcon trend={row.trend2025} />
          <TeamLogo teamId={row.team2025} label={row.team2025} />
        </span>
      </td>
      <td>
        <img
          className="fa-board__nfl-shield"
          src={NFL_LOGO}
          alt="NFL"
          width={18}
          height={18}
        />
      </td>
      <td className={row.ageNearWall ? 'fa-board__age fa-board__age--wall' : 'fa-board__age'}>
        {row.age}
      </td>
      <td>{row.gamesPlayed}</td>
      <td>{row.snaps.toLocaleString()}</td>
      <BarMetricCell value={row.snapsPerGame} max={maxSnapsPg} decimals={1} />
      <td className="fa-board__alignment">{row.alignment}</td>
      <BarMetricCell value={row.topSpeed} max={TOP_SPEED_MAX} decimals={2} />
    </tr>
  )
}

type MarketTab = 'market' | 'draft'

function DraftBoardTable() {
  const rows = useMemo(() => {
    return [...DRAFT_BOARD_MOCK]
      .filter((p) => p.djRank != null)
      .sort((a, b) => (a.djRank ?? 999) - (b.djRank ?? 999))
  }, [])

  return (
    <table className="fa-board__table fa-board__table--draft">
      <thead>
        <tr>
          <th scope="col" className="fa-board__th--rank">
            DJ 2.0
          </th>
          <th scope="col">Pos</th>
          <th scope="col" className="fa-board__th--player-col">
            Player
          </th>
          <th scope="col" className="fa-board__th--school" aria-label="School" />
          <th scope="col" className="fa-board__th--nextgen">
            NextGen
          </th>
          <th scope="col" className="fa-board__th--status" aria-label="Tier" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <DraftBoardRow key={`${row.djRank}-${row.name}`} row={row} />
        ))}
      </tbody>
    </table>
  )
}

function DraftBoardRow({ row }: { row: DraftBoardProspect }) {
  const tone = draftOverallTone(row.overall)
  return (
    <tr>
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
          aria-label={`Overall tier ${tone}`}
        />
      </td>
    </tr>
  )
}

type MarketCardProps = {
  className?: string
}

export function MarketCard({ className }: MarketCardProps = {}) {
  const [tab, setTab] = useState<MarketTab>('market')
  const rows = FREE_AGENCY_MARKET

  return (
    <section
      className={['fa-board__card', 'fa-board__card--market', className]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="fa-board__market-head">
        {tab === 'market' ? (
          <img className="fa-board__market-nfl" src={NFL_LOGO} alt="" width={22} height={22} />
        ) : null}
        <div className="fa-board__tabs" role="tablist" aria-label="Market view">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'market'}
            className={
              tab === 'market'
                ? 'fa-board__tab fa-board__tab--active'
                : 'fa-board__tab'
            }
            onClick={() => setTab('market')}
          >
            NFL Market
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'draft'}
            className={
              tab === 'draft'
                ? 'fa-board__tab fa-board__tab--active'
                : 'fa-board__tab'
            }
            onClick={() => setTab('draft')}
          >
            Draft Board
          </button>
        </div>
        <img
          className="fa-board__draft-logo"
          src={NFL_DRAFT_LOGO}
          alt="NFL Draft"
          width={28}
          height={28}
        />
      </header>
      <div className="fa-board__scroll">
        {tab === 'market' ? (
          <table className="fa-board__table fa-board__table--market">
            <thead>
              <tr>
                <th scope="col">Pos</th>
                <th scope="col" className="fa-board__th--player-col">
                  Player
                </th>
                <th scope="col">2026</th>
                <th scope="col">Age</th>
                <th scope="col">AAV</th>
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
                    <TeamLogo teamId={row.team2026} label={row.team2026} />
                  </td>
                  <td>{row.age}</td>
                  <td className="fa-board__aav">{row.aav}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <DraftBoardTable />
        )}
      </div>
    </section>
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

export function FreeAgencyBoard() {
  return (
    <div className="fa-board">
      <div className="fa-board__grid">
        <AvailableAgentsCard />
        <MarketCard />
      </div>

      <FreeAgencyLegend />
    </div>
  )
}
