import { useMemo, useState } from 'react'
import {
  DEFAULT_PLAYER_TRACKING_ID,
  PLAYER_TRACKING_SUMMARY,
} from '../data/combine-tracking-player-detail.mock'
import type { PlayerTrackingSummary } from '../types/combine-tracking-player'
import { SchoolTableCell } from './SchoolTableCell'
import './combine-tracking-player-detail.css'

const CHART_WIDTH = 420
const CHART_HEIGHT = 200
const CHART_PAD = { top: 12, right: 16, bottom: 32, left: 40 }

function SemiGauge({
  value,
  label,
  unit,
  max,
}: {
  value: number
  label: string
  unit: string
  max: number
}) {
  const pct = Math.min(1, Math.max(0, value / max))
  const angle = 180 - pct * 180
  const rad = (angle * Math.PI) / 180
  const cx = 52
  const cy = 48
  const r = 38
  const nx = cx + r * Math.cos(rad)
  const ny = cy - r * Math.sin(rad)

  return (
    <div className="ct-gauge">
      <svg
        className="ct-gauge__svg"
        viewBox="0 0 104 72"
        width={104}
        height={72}
        aria-hidden
      >
        <path
          d="M 14 48 A 38 38 0 0 1 90 48"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d="M 14 48 A 38 38 0 0 1 90 48"
          fill="none"
          stroke="url(#ctGaugeGreen)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${pct * 119} 119`}
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#013369"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={3} fill="#013369" />
        <defs>
          <linearGradient id="ctGaugeGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
        </defs>
      </svg>
      <p className="ct-gauge__value">
        {value.toFixed(2)} {unit}
      </p>
      <p className="ct-gauge__label">{label}</p>
    </div>
  )
}

function SpeedDistanceChart({
  player,
}: {
  player: PlayerTrackingSummary
}) {
  const yMin = 16
  const yMax = 24
  const xMin = 10
  const xMax = 40

  const plotW = CHART_WIDTH - CHART_PAD.left - CHART_PAD.right
  const plotH = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom

  const xScale = (d: number) =>
    CHART_PAD.left + ((d - xMin) / (xMax - xMin)) * plotW
  const yScale = (s: number) =>
    CHART_PAD.top + plotH - ((s - yMin) / (yMax - yMin)) * plotH

  const toPath = (points: { distance: number; speed: number }[]) =>
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.distance)} ${yScale(p.speed)}`)
      .join(' ')

  const yTicks = [16, 18, 20, 22, 24]
  const xTicks = [10, 15, 20, 25, 30, 35, 40]

  return (
    <div className="ct-speed-chart">
      <svg
        className="ct-speed-chart__svg"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
        role="img"
        aria-label={`Speed by distance for ${player.player}`}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={CHART_PAD.left}
              y1={yScale(tick)}
              x2={CHART_WIDTH - CHART_PAD.right}
              y2={yScale(tick)}
              stroke="#f0f2f3"
              strokeWidth={1}
            />
            <text
              x={CHART_PAD.left - 6}
              y={yScale(tick) + 3}
              textAnchor="end"
              className="ct-speed-chart__tick"
            >
              {tick}
            </text>
          </g>
        ))}
        {xTicks.map((tick) => (
          <text
            key={tick}
            x={xScale(tick)}
            y={CHART_HEIGHT - 8}
            textAnchor="middle"
            className="ct-speed-chart__tick"
          >
            {tick}
          </text>
        ))}
        <text
          x={CHART_PAD.left - 28}
          y={CHART_PAD.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90, ${CHART_PAD.left - 28}, ${CHART_PAD.top + plotH / 2})`}
          className="ct-speed-chart__axis-label"
        >
          Speed (mph)
        </text>
        <text
          x={CHART_PAD.left + plotW / 2}
          y={CHART_HEIGHT - 2}
          textAnchor="middle"
          className="ct-speed-chart__axis-label"
        >
          Distance (Yards)
        </text>
        <path
          d={toPath(player.avgSpeedCurve)}
          fill="none"
          stroke="#c4c9cf"
          strokeWidth={2}
        />
        {player.avgSpeedCurve.map((p) => (
          <circle
            key={`avg-${p.distance}`}
            cx={xScale(p.distance)}
            cy={yScale(p.speed)}
            r={3.5}
            fill="#fff"
            stroke="#c4c9cf"
            strokeWidth={2}
          />
        ))}
        <path
          d={toPath(player.speedCurve)}
          fill="none"
          stroke="#013369"
          strokeWidth={2.5}
        />
        {player.speedCurve.map((p) => (
          <circle
            key={`pl-${p.distance}`}
            cx={xScale(p.distance)}
            cy={yScale(p.speed)}
            r={4}
            fill="#013369"
            stroke="#fff"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      <div className="ct-speed-chart__logo" aria-hidden>
        <span className="ct-speed-chart__logo-ng">NEXT GEN </span>
        <span className="ct-speed-chart__logo-stats">STATS</span>
      </div>
    </div>
  )
}

function PlayerAvatar({ player }: { player: PlayerTrackingSummary }) {
  const initials = player.player
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="ct-player__avatar" aria-hidden>
      <span className="ct-player__avatar-initials">{initials}</span>
    </div>
  )
}

function PlayerDetailPanel({ player }: { player: PlayerTrackingSummary }) {
  return (
    <article className="ct-player">
      <div className="ct-player__header">
        <PlayerAvatar player={player} />
        <div className="ct-player__meta">
          <h3 className="ct-player__name">{player.player}</h3>
          <p className="ct-player__sub">
            {player.year} {player.position} | {player.schoolDisplay}
          </p>
          <p className="ct-player__measurables">
            HT: {player.height} WT: {player.weight} 40 Time:{' '}
            {player.fortyTime.toFixed(2)}
          </p>
        </div>
        <div className="ct-player__gauges">
          <SemiGauge
            value={player.topSpeed}
            unit="mph"
            label="Top Speed"
            max={25}
          />
          <SemiGauge
            value={player.maxAccel}
            unit="yd/s/s"
            label="Max Acceleration"
            max={7}
          />
        </div>
      </div>
      <SpeedDistanceChart player={player} />
    </article>
  )
}

function SummaryTable({
  rows,
  selectedId,
  onSelect,
}: {
  rows: PlayerTrackingSummary[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <section className="ct-summary">
      <h3 className="ct-summary__title">
        <span className="ct-summary__title--bold">40-YARD DASH</span> PLAYER
        TRACKING SUMMARY METRICS
      </h3>
      <div className="ct-summary__scroll">
        <table className="ct-summary__table">
          <thead>
            <tr>
              <th scope="col">Rk</th>
              <th scope="col" className="ct-summary__th--player">Player</th>
              <th scope="col">Pos</th>
              <th scope="col">School</th>
              <th scope="col">Year</th>
              <th scope="col">40 Time</th>
              <th
                scope="col"
                className="ct-summary__th ct-summary__th--metric"
              >
                Top Speed
              </th>
              <th scope="col">10 Time</th>
              <th scope="col">10Y Speed</th>
              <th scope="col">Max Accel</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const selected = row.id === selectedId
              return (
                <tr
                  key={row.id}
                  className={
                    selected
                      ? 'ct-summary__row ct-summary__row--selected'
                      : 'ct-summary__row'
                  }
                  onClick={() => onSelect(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect(row.id)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected}
                >
                  <td>{row.rank}</td>
                  <td className="ct-summary__td--player">{row.player}</td>
                  <td>{row.position}</td>
                  <SchoolTableCell
                    className="ct-summary__td ct-summary__td--school"
                    schoolAbbr={row.school}
                  />
                  <td>{row.year}</td>
                  <td>{row.fortyTime.toFixed(2)}</td>
                  <td className="ct-summary__td ct-summary__td--metric">
                    {row.topSpeed.toFixed(2)}
                  </td>
                  <td>{row.tenTime.toFixed(2)}</td>
                  <td>{row.tenYardSpeed.toFixed(2)}</td>
                  <td>{row.maxAccel.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function CombineTrackingPlayerDetail() {
  const [selectedId, setSelectedId] = useState(DEFAULT_PLAYER_TRACKING_ID)

  const selected = useMemo(
    () =>
      PLAYER_TRACKING_SUMMARY.find((p) => p.id === selectedId) ??
      PLAYER_TRACKING_SUMMARY[0],
    [selectedId],
  )

  return (
    <div className="combine-tracking__detail-wrap">
      <div className="combine-tracking__detail-row">
        <div className="combine-tracking__detail-shell combine-tracking__detail-shell--summary">
          <SummaryTable
            rows={PLAYER_TRACKING_SUMMARY}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
        <div className="combine-tracking__detail-shell combine-tracking__detail-shell--player">
          <PlayerDetailPanel player={selected} />
        </div>
      </div>
    </div>
  )
}
