import { useCallback, useId, useRef, useState, type ReactElement } from 'react'
import type { DraftBoardProspect } from '../types'
import { parseArmToInches, parseHeightToInches } from '../utils/combine-measurements'
import { prospectStableKey } from '../utils/draft-ng-ranks'

type ScatterPoint = { x: number; y: number; key: string; overall: number }

type AthProdBubble = {
  key: string
  name: string
  x: number
  y: number
  overall: number
  athleticism: number
  production: number
}

export type ScatterMode = 'arm-height' | 'ath-prod'

/** panel = boxed card • inline = legacy minimal • bottom = draft board lower-right cell */
export type ScatterVariant = 'panel' | 'inline' | 'bottom'

type OverallTone = 'super' | 'good' | 'avg' | 'low'

function overallTone(overall: number): OverallTone {
  if (overall >= 93) return 'super'
  if (overall >= 84) return 'good'
  if (overall >= 75) return 'avg'
  return 'low'
}

function bubbleStyle(overall: number): { fill: string; stroke: string } {
  switch (overallTone(overall)) {
    case 'super':
      return { fill: 'rgba(0, 0, 255, 0.5)', stroke: 'Blue' }
    case 'good':
      return { fill: 'rgba(0, 128, 0, 0.5)', stroke: 'Green' }
    case 'avg':
      return { fill: 'rgba(255, 215, 0, 0.5)', stroke: 'Gold' }
    default:
      return { fill: 'rgba(255, 0, 0, 0.5)', stroke: 'Red' }
  }
}

function tierColor(overall: number): string {
  if (overall >= 90) return 'rgba(43, 87, 247, 0.48)'
  if (overall >= 75) return 'rgba(52, 168, 83, 0.48)'
  if (overall >= 60) return 'rgba(251, 188, 4, 0.52)'
  return 'rgba(234, 67, 53, 0.45)'
}

const W = 420
const H = 340
const PAD_L = 44
const PAD_R = 16
const PAD_T = 40
const PAD_B = 40

const HC_W = 784
const HC_H = 396
const HC_PAD_L = 64
const HC_PAD_R = 30
const HC_PAD_T = 10
const HC_PAD_B = 65
const HC_MIN_X = 50
const HC_MAX_X = 95
const HC_MIN_Y = 50
const HC_MAX_Y = 90
const HC_X_TICKS = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
const HC_Y_TICKS = [50, 60, 70, 80, 90]
const BUBBLE_R = 5

function buildAthProdBubbles(prospects: DraftBoardProspect[]): AthProdBubble[] {
  return prospects.map((p) => ({
    key: prospectStableKey(p),
    name: p.name,
    x: p.athleticism,
    y: p.production,
    overall: p.overall,
    athleticism: p.athleticism,
    production: p.production,
  }))
}

function buildPoints(
  prospects: DraftBoardProspect[],
  mode: ScatterMode,
): ScatterPoint[] {
  if (mode === 'ath-prod') {
    return prospects.map((p) => ({
      x: p.athleticism,
      y: p.production,
      key: prospectStableKey(p),
      overall: p.overall,
    }))
  }
  return prospects
    .map((p) => {
      const arm = parseArmToInches(p.arm)
      const ht = parseHeightToInches(p.ht)
      if (arm == null || ht == null) return null
      return { x: arm, y: ht, key: prospectStableKey(p), overall: p.overall } satisfies ScatterPoint
    })
    .filter((x): x is ScatterPoint => x !== null)
}

function padRange(
  minV: number,
  maxV: number,
  padRatio: number,
): { min: number; max: number } {
  const span = maxV - minV || 1
  const pad = span * padRatio
  return { min: minV - pad, max: maxV + pad }
}

const MODE_COPY: Record<
  ScatterMode,
  {
    optionLabel: string
    title: string
    xLabel: string
    yLabel: string
    aria: string
    empty: string
  }
> = {
  'arm-height': {
    optionLabel: 'Arm Length vs Height',
    title: '2026 | Arm Length vs Height',
    xLabel: 'Arm Length',
    yLabel: 'Height',
    aria: 'Scatter of arm length versus height for draft prospects',
    empty: 'Not enough arm / height measurements to plot.',
  },
  'ath-prod': {
    optionLabel: 'Athleticism Score vs Production Score',
    title: '2026 | Athleticism Score vs Production Score',
    xLabel: 'Athleticism Score',
    yLabel: 'Production Score',
    aria: 'Scatter of athleticism score versus production score for draft prospects',
    empty: 'No prospects to plot.',
  },
}

function splitDraftMastTitle(full: string): { yearPart: string; metricPart: string } {
  const i = full.indexOf('|')
  if (i < 0) return { yearPart: '', metricPart: full.trim() }
  return {
    yearPart: `${full.slice(0, i + 1).trim()} `,
    metricPart: full.slice(i + 1).trim(),
  }
}

type PlotProps = {
  copy: (typeof MODE_COPY)['arm-height']
  minX: number
  maxX: number
  minY: number
  maxY: number
  points: ScatterPoint[]
  mode: ScatterMode
  stretch?: boolean
}

function AthProdScatterPlot({
  bubbles,
  aria,
}: {
  bubbles: AthProdBubble[]
  aria: string
}): ReactElement {
  const clipId = useId()
  const plotRef = useRef<HTMLDivElement>(null)
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [tooltipAnchor, setTooltipAnchor] = useState<{ x: number; y: number } | null>(null)

  const innerW = HC_W - HC_PAD_L - HC_PAD_R
  const innerH = HC_H - HC_PAD_T - HC_PAD_B

  const sx = useCallback(
    (xv: number) => HC_PAD_L + ((xv - HC_MIN_X) / (HC_MAX_X - HC_MIN_X)) * innerW,
    [innerW],
  )
  const sy = useCallback(
    (yv: number) => HC_PAD_T + (1 - (yv - HC_MIN_Y) / (HC_MAX_Y - HC_MIN_Y)) * innerH,
    [innerH],
  )

  const hovered = hoverKey ? bubbles.find((b) => b.key === hoverKey) : null
  const ordered = hoverKey
    ? [...bubbles.filter((b) => b.key !== hoverKey), ...bubbles.filter((b) => b.key === hoverKey)]
    : bubbles

  const refX = sx(75)
  const refY = sy(75)

  const clearHover = () => {
    setHoverKey(null)
    setTooltipAnchor(null)
  }

  const handleBubbleEnter = (pt: AthProdBubble, group: SVGGElement) => {
    setHoverKey(pt.key)
    const circle = group.querySelector('.ng-scatter__bubble-dot')
    const plot = plotRef.current
    if (!circle || !plot) return
    const cr = circle.getBoundingClientRect()
    const pr = plot.getBoundingClientRect()
    setTooltipAnchor({
      x: cr.left - pr.left + cr.width / 2,
      y: cr.top - pr.top + cr.height / 2,
    })
  }

  return (
    <div ref={plotRef} className="ng-scatter__plot ng-scatter__plot--hc" onMouseLeave={clearHover}>
      <svg
        className="ng-scatter__svg ng-scatter__svg--hc"
        viewBox={`0 0 ${HC_W} ${HC_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={aria}
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={HC_PAD_L} y={HC_PAD_T} width={innerW} height={innerH} />
          </clipPath>
        </defs>

        {HC_X_TICKS.map((v) => {
          const x = sx(v)
          return (
            <line
              key={`gx-${v}`}
              x1={x}
              y1={HC_PAD_T}
              x2={x}
              y2={HC_PAD_T + innerH}
              className="ng-scatter__grid ng-scatter__grid--hc"
            />
          )
        })}
        {HC_Y_TICKS.map((v) => {
          const y = sy(v)
          return (
            <line
              key={`gy-${v}`}
              x1={HC_PAD_L}
              y1={y}
              x2={HC_PAD_L + innerW}
              y2={y}
              className="ng-scatter__grid ng-scatter__grid--hc"
            />
          )
        })}

        <line
          x1={refX}
          y1={HC_PAD_T}
          x2={refX}
          y2={HC_PAD_T + innerH}
          className="ng-scatter__ref-line ng-scatter__ref-line--hc"
        />
        <text x={refX + 4} y={HC_PAD_T + 15} className="ng-scatter__ref-label">
          75
        </text>
        <line
          x1={HC_PAD_L}
          y1={refY}
          x2={HC_PAD_L + innerW}
          y2={refY}
          className="ng-scatter__ref-line ng-scatter__ref-line--hc"
        />
        <text
          x={HC_PAD_L + innerW + 10}
          y={refY + 15}
          textAnchor="end"
          className="ng-scatter__ref-label"
        >
          75
        </text>

        <g clipPath={`url(#${clipId})`}>
          {ordered.map((pt) => {
            const { fill, stroke } = bubbleStyle(pt.overall)
            const active = pt.key === hoverKey
            const cx = sx(pt.x)
            const cy = sy(pt.y)
            const r = active ? 7 : BUBBLE_R
            return (
              <g
                key={pt.key}
                className={active ? 'ng-scatter__bubble ng-scatter__bubble--active' : 'ng-scatter__bubble'}
                onMouseEnter={(e) => handleBubbleEnter(pt, e.currentTarget)}
                onFocus={(e) => handleBubbleEnter(pt, e.currentTarget)}
                tabIndex={0}
                role="button"
                aria-label={`${pt.name}, overall ${pt.overall}`}
              >
                {active ? (
                  <circle cx={cx} cy={cy} r={r + 4} fill={stroke} fillOpacity={0.25} pointerEvents="none" />
                ) : null}
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={active ? 2 : 1}
                  className="ng-scatter__bubble-dot"
                />
              </g>
            )
          })}
        </g>

        {HC_X_TICKS.map((v) => (
          <text
            key={`xt-${v}`}
            x={sx(v)}
            y={HC_PAD_T + innerH + 27}
            textAnchor="middle"
            className="ng-scatter__tick ng-scatter__tick--hc"
          >
            {v}
          </text>
        ))}
        {HC_Y_TICKS.map((v) => (
          <text
            key={`yt-${v}`}
            x={HC_PAD_L - 15}
            y={sy(v) + 4}
            textAnchor="end"
            className="ng-scatter__tick ng-scatter__tick--hc"
          >
            {v}
          </text>
        ))}

        <line
          x1={HC_PAD_L}
          y1={HC_PAD_T + innerH}
          x2={HC_PAD_L + innerW}
          y2={HC_PAD_T + innerH}
          className="ng-scatter__axis-line"
        />

        <text
          x={HC_PAD_L + innerW / 2}
          y={HC_H - 18}
          textAnchor="middle"
          className="ng-scatter__axis-title ng-scatter__axis-title--hc"
        >
          Athleticism Score
        </text>
        <text
          x={24}
          y={HC_PAD_T + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 24 ${HC_PAD_T + innerH / 2})`}
          className="ng-scatter__axis-title ng-scatter__axis-title--hc"
        >
          Production Score
        </text>
      </svg>

      {hovered && tooltipAnchor ? (
        <div
          className="ng-scatter__tooltip"
          style={{
            left: tooltipAnchor.x,
            top: tooltipAnchor.y,
            borderColor: bubbleStyle(hovered.overall).stroke,
          }}
          role="tooltip"
        >
          <p className="ng-scatter__tooltip-name">{hovered.name}</p>
          <dl className="ng-scatter__tooltip-stats">
            <div>
              <dt>Overall Score</dt>
              <dd>{hovered.overall}</dd>
            </div>
            <div>
              <dt>Athleticism Score</dt>
              <dd>{hovered.athleticism}</dd>
            </div>
            <div>
              <dt>Production Score</dt>
              <dd>{hovered.production}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  )
}

function ScatterSvgPlot({
  copy,
  minX,
  maxX,
  minY,
  maxY,
  points,
  mode,
  stretch = false,
}: PlotProps): ReactElement {
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const sx = (xv: number) => PAD_L + ((xv - minX) / (maxX - minX || 1)) * innerW
  const sy = (yv: number) => PAD_T + (1 - (yv - minY) / (maxY - minY || 1)) * innerH

  const xTicks = 5
  const yTicks = 5
  const xStep = (maxX - minX) / (xTicks - 1)
  const yStep = (maxY - minY) / (yTicks - 1)

  const showRef75X = mode === 'ath-prod' && minX <= 75 && maxX >= 75
  const showRef75Y = mode === 'ath-prod' && minY <= 75 && maxY >= 75

  return (
    <svg
      className="ng-scatter__svg"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={stretch ? 'none' : 'xMidYMid meet'}
      role="img"
      aria-label={copy.aria}
    >
      <text x={W / 2} y={H - 8} textAnchor="middle" className="ng-scatter__axis-label">
        {copy.xLabel}
      </text>
      <text
        transform={`translate(18 ${PAD_T + innerH / 2}) rotate(-90)`}
        textAnchor="middle"
        dominantBaseline="middle"
        className="ng-scatter__axis-label"
      >
        {copy.yLabel}
      </text>
      {Array.from({ length: xTicks }, (_, i) => {
        const v = minX + i * xStep
        const x = sx(v)
        return (
          <g key={`xt-${i}`}>
            <line x1={x} y1={PAD_T} x2={x} y2={H - PAD_B} className="ng-scatter__grid" />
            <text x={x} y={H - PAD_B + 14} textAnchor="middle" className="ng-scatter__tick">
              {v.toFixed(0)}
            </text>
          </g>
        )
      })}
      {Array.from({ length: yTicks }, (_, i) => {
        const v = minY + i * yStep
        const y = sy(v)
        return (
          <g key={`yt-${i}`}>
            <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} className="ng-scatter__grid" />
            <text x={PAD_L - 8} y={y + 4} textAnchor="end" className="ng-scatter__tick">
              {v.toFixed(0)}
            </text>
          </g>
        )
      })}
      <rect
        x={PAD_L}
        y={PAD_T}
        width={innerW}
        height={innerH}
        fill="none"
        className="ng-scatter__plot-border"
      />
      {showRef75X ? (
        <line
          x1={sx(75)}
          x2={sx(75)}
          y1={PAD_T}
          y2={H - PAD_B}
          className="ng-scatter__ref-line"
          aria-hidden
        />
      ) : null}
      {showRef75Y ? (
        <line
          x1={PAD_L}
          x2={W - PAD_R}
          y1={sy(75)}
          y2={sy(75)}
          className="ng-scatter__ref-line"
          aria-hidden
        />
      ) : null}
      {points.map((pt) => (
        <circle
          key={pt.key}
          cx={sx(pt.x)}
          cy={sy(pt.y)}
          r={4.5}
          fill={tierColor(pt.overall)}
          stroke="rgba(17,24,39,0.12)"
          strokeWidth={0.6}
        />
      ))}
    </svg>
  )
}

function ScatterToolbar({
  mode,
  copy,
}: {
  mode: ScatterMode
  copy: (typeof MODE_COPY)[ScatterMode]
}): ReactElement {
  return (
    <div className="ng-scatter__toolbar">
      <label className="ng-scatter__select-wrap">
        <span className="ng-scatter__select-label ng-scatter__sr-only">Chart</span>
        <select className="ng-scatter__select" aria-label="Scatter chart metric" defaultValue={mode}>
          <option value={mode}>{copy.optionLabel}</option>
        </select>
      </label>
    </div>
  )
}

function BottomMasthead({ copy }: { copy: (typeof MODE_COPY)[ScatterMode] }) {
  const { yearPart, metricPart } = splitDraftMastTitle(copy.title)
  return (
    <div className="ng-scatter__masthead">
      <h3 className="ng-scatter__masthead-heading">
        <span className="ng-scatter__masthead-year">{yearPart}</span>
        <span className="ng-scatter__masthead-metric">{metricPart}</span>
      </h3>
      <div className="ng-scatter__logo-lockup" aria-hidden="true">
        <span className="ng-scatter__logo-ng">NEXT GEN </span>
        <span className="ng-scatter__logo-stats">STATS</span>
      </div>
    </div>
  )
}

export function ArmLengthHeightScatter({
  prospects,
  mode = 'arm-height',
  variant = 'panel',
}: {
  prospects: DraftBoardProspect[]
  mode?: ScatterMode
  variant?: ScatterVariant
}) {
  const copy = MODE_COPY[mode]
  const isBottomAthProd = variant === 'bottom' && mode === 'ath-prod'
  const athProdBubbles = isBottomAthProd ? buildAthProdBubbles(prospects) : []
  const points = isBottomAthProd ? [] : buildPoints(prospects, mode)

  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const pt of points) {
    minX = Math.min(minX, pt.x)
    maxX = Math.max(maxX, pt.x)
    minY = Math.min(minY, pt.y)
    maxY = Math.max(maxY, pt.y)
  }

  const xPad = mode === 'ath-prod' ? 0.04 : 0.06
  const yPad = mode === 'ath-prod' ? 0.04 : 0.04
  const xr = Number.isFinite(minX) ? padRange(minX, maxX, xPad) : { min: 0, max: 1 }
  const yr = Number.isFinite(minY) ? padRange(minY, maxY, yPad) : { min: 0, max: 1 }
  minX = xr.min
  maxX = xr.max
  minY = yr.min
  maxY = yr.max

  const isBottom = variant === 'bottom'
  const plotProps: PlotProps = { copy, minX, maxX, minY, maxY, points, mode, stretch: isBottom }
  const hasData = isBottomAthProd ? athProdBubbles.length > 0 : points.length > 0

  const rootClass = [
    'ng-scatter',
    variant === 'bottom' && 'ng-scatter--bottom',
    variant === 'inline' && 'ng-scatter--inline',
    isBottomAthProd && 'ng-scatter--ath-prod-hc',
  ]
    .filter(Boolean)
    .join(' ')

  if (!hasData) {
    if (isBottom) {
      return (
        <div className={rootClass}>
          <BottomMasthead copy={copy} />
          <ScatterToolbar mode={mode} copy={copy} />
          <div className="ng-scatter__plot">
            <p className="ng-scatter__empty">{copy.empty}</p>
          </div>
        </div>
      )
    }
    return (
      <div className={rootClass}>
        <div className="ng-scatter__head">
          <label className="ng-scatter__select-wrap">
            <span className="ng-scatter__select-label">Chart</span>
            <select className="ng-scatter__select" aria-label="Scatter chart metric" defaultValue={mode}>
              <option value={mode}>{copy.optionLabel}</option>
            </select>
          </label>
          <span className="ng-scatter__brand">Next Gen Stats</span>
        </div>
        <div className="ng-scatter__title">{copy.title}</div>
        <p className="ng-scatter__empty">{copy.empty}</p>
      </div>
    )
  }

  if (isBottom) {
    return (
      <div className={rootClass}>
        <BottomMasthead copy={copy} />
        <ScatterToolbar mode={mode} copy={copy} />
        {isBottomAthProd ? (
          <AthProdScatterPlot bubbles={athProdBubbles} aria={copy.aria} />
        ) : (
          <div className="ng-scatter__plot">
            <ScatterSvgPlot {...plotProps} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={rootClass}>
      <div className="ng-scatter__head">
        <label className="ng-scatter__select-wrap">
          <span className="ng-scatter__select-label">Chart</span>
          <select className="ng-scatter__select" aria-label="Scatter chart metric" defaultValue={mode}>
            <option value={mode}>{copy.optionLabel}</option>
          </select>
        </label>
        <span className="ng-scatter__brand">Next Gen Stats</span>
      </div>
      <div className="ng-scatter__title">{copy.title}</div>
      <ScatterSvgPlot {...plotProps} />
    </div>
  )
}
