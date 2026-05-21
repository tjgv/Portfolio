import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { DraftBoardProspect } from '../../../types'
import {
  type ChartComparisonId,
  getChartComparisonOption,
  type ScatterBubble,
} from './chart-comparison-options'
import {
  DRAFT_TEST_FOCUS_SLOTS,
  draftTestFocusSlotIndex,
} from './focus-slot-colors'

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

/** Space from container edge to tick labels */
const PLOT_PAD_EDGE = 8
const PLOT_TICK_LABEL_W = 32
const PLOT_TICK_LABEL_H = 14
const PLOT_PAD_R_EXTRA = 12

type PlotLayout = {
  w: number
  h: number
  padL: number
  padR: number
  padT: number
  padB: number
  innerW: number
  innerH: number
  xTickY: number
  yTickX: number
  axisY: number
}

function buildPlotLayout(width: number, height: number): PlotLayout {
  const w = Math.max(Math.round(width), 1)
  const h = Math.max(Math.round(height), 1)
  const padL = PLOT_PAD_EDGE + PLOT_TICK_LABEL_W
  const padR = PLOT_PAD_EDGE + PLOT_PAD_R_EXTRA
  const padT = PLOT_PAD_EDGE
  const padB = PLOT_PAD_EDGE + PLOT_TICK_LABEL_H
  const innerW = Math.max(w - padL - padR, 1)
  const innerH = Math.max(h - padT - padB, 1)
  return {
    w,
    h,
    padL,
    padR,
    padT,
    padB,
    innerW,
    innerH,
    xTickY: h - PLOT_PAD_EDGE - 4,
    yTickX: PLOT_PAD_EDGE + PLOT_TICK_LABEL_W - 4,
    axisY: padT + innerH,
  }
}

const SCORE_MIN = 50
const SCORE_MAX = 95
const SCORE_X_TICKS = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]
const SCORE_Y_TICKS = [50, 60, 70, 80, 90]
const BUBBLE_R = 5
const FOCUS_BUBBLE_R = 7.2
const FOCUS_BUBBLE_RING_PAD = 4.5

function padRange(minV: number, maxV: number, padRatio: number) {
  const span = maxV - minV || 1
  const pad = span * padRatio
  return { min: minV - pad, max: maxV + pad }
}

function buildTicks(min: number, max: number, count = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1]
  const span = max - min || 1
  const step = span / Math.max(count - 1, 1)
  return Array.from({ length: count }, (_, i) => {
    const v = min + step * i
    return Number(v.toFixed(max < 10 ? 2 : 0))
  })
}

type DraftCentralTestAthProdScatterProps = {
  prospects: DraftBoardProspect[]
  comparisonId: ChartComparisonId
  focusedKeys: string[]
}

export function DraftCentralTestAthProdScatter({
  prospects,
  comparisonId,
  focusedKeys,
}: DraftCentralTestAthProdScatterProps) {
  const comparison = useMemo(
    () => getChartComparisonOption(comparisonId),
    [comparisonId],
  )
  const bubbles = useMemo(
    () => comparison.buildBubbles(prospects),
    [comparison, prospects],
  )
  const focusedSet = useMemo(() => new Set(focusedKeys), [focusedKeys])
  const hasFocus = focusedKeys.length > 0

  const scale = useMemo(() => {
    if (comparison.useScoreScale) {
      return {
        minX: SCORE_MIN,
        maxX: SCORE_MAX,
        minY: SCORE_MIN,
        maxY: SCORE_MAX,
        xTicks: SCORE_X_TICKS,
        yTicks: SCORE_Y_TICKS,
        showRef75: true,
      }
    }
    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    for (const b of bubbles) {
      minX = Math.min(minX, b.x)
      maxX = Math.max(maxX, b.x)
      minY = Math.min(minY, b.y)
      maxY = Math.max(maxY, b.y)
    }
    if (!Number.isFinite(minX)) {
      return {
        minX: 0,
        maxX: 1,
        minY: 0,
        maxY: 1,
        xTicks: [0, 1],
        yTicks: [0, 1],
        showRef75: false,
      }
    }
    const xr = padRange(minX, maxX, 0.08)
    const yr = padRange(minY, maxY, 0.08)
    return {
      minX: xr.min,
      maxX: xr.max,
      minY: yr.min,
      maxY: yr.max,
      xTicks: buildTicks(xr.min, xr.max, 6),
      yTicks: buildTicks(yr.min, yr.max, 5),
      showRef75: false,
    }
  }, [bubbles, comparison.useScoreScale])

  const clipId = useId()
  const plotRef = useRef<HTMLDivElement>(null)
  const [plotLayout, setPlotLayout] = useState<PlotLayout | null>(null)
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [tooltipAnchor, setTooltipAnchor] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const el = plotRef.current
    if (!el) return

    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      if (width > 0 && height > 0) {
        setPlotLayout(buildPlotLayout(width, height))
      }
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const sx = useCallback(
    (xv: number) => {
      if (!plotLayout) return 0
      return (
        plotLayout.padL +
        ((xv - scale.minX) / (scale.maxX - scale.minX || 1)) * plotLayout.innerW
      )
    },
    [plotLayout, scale.maxX, scale.minX],
  )
  const sy = useCallback(
    (yv: number) => {
      if (!plotLayout) return 0
      return (
        plotLayout.padT +
        (1 - (yv - scale.minY) / (scale.maxY - scale.minY || 1)) * plotLayout.innerH
      )
    },
    [plotLayout, scale.maxY, scale.minY],
  )

  const hovered = hoverKey ? bubbles.find((b) => b.key === hoverKey) : null

  const paintOrder = useMemo(() => {
    const unfocused = bubbles.filter((b) => !focusedSet.has(b.key))
    const focused = bubbles.filter((b) => focusedSet.has(b.key))
    return [...unfocused, ...focused]
  }, [bubbles, focusedSet])

  const refX = scale.showRef75 && scale.minX <= 75 && scale.maxX >= 75 ? sx(75) : null
  const refY = scale.showRef75 && scale.minY <= 75 && scale.maxY >= 75 ? sy(75) : null

  const clearHover = () => {
    setHoverKey(null)
    setTooltipAnchor(null)
  }

  const handleBubbleEnter = (pt: ScatterBubble, group: SVGGElement) => {
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

  if (bubbles.length === 0) {
    return (
      <div className="draft-test__scatter">
        <p className="ng-scatter__empty">Not enough data to plot this comparison.</p>
      </div>
    )
  }

  const layout = plotLayout

  return (
    <div className="draft-test__scatter">
      <div
        ref={plotRef}
        className="ng-scatter__plot ng-scatter__plot--hc"
        onMouseLeave={clearHover}
      >
        {layout ? (
        <svg
          className="ng-scatter__svg ng-scatter__svg--hc draft-test__scatter-svg"
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          role="img"
          aria-label={`Scatter of ${comparison.xAxisTitle} versus ${comparison.yAxisTitle}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                x={layout.padL}
                y={layout.padT}
                width={layout.innerW}
                height={layout.innerH}
              />
            </clipPath>
          </defs>

          {scale.xTicks.map((v) => {
            const x = sx(v)
            return (
              <line
                key={`gx-${v}`}
                x1={x}
                y1={layout.padT}
                x2={x}
                y2={layout.axisY}
                className="ng-scatter__grid ng-scatter__grid--hc"
              />
            )
          })}
          {scale.yTicks.map((v) => {
            const y = sy(v)
            return (
              <line
                key={`gy-${v}`}
                x1={layout.padL}
                y1={y}
                x2={layout.padL + layout.innerW}
                y2={y}
                className="ng-scatter__grid ng-scatter__grid--hc"
              />
            )
          })}

          {refX != null ? (
            <>
              <line
                x1={refX}
                y1={layout.padT}
                x2={refX}
                y2={layout.axisY}
                className="ng-scatter__ref-line ng-scatter__ref-line--hc"
              />
              <text x={refX + 4} y={layout.padT + 15} className="ng-scatter__ref-label">
                75
              </text>
            </>
          ) : null}
          {refY != null ? (
            <>
              <line
                x1={layout.padL}
                y1={refY}
                x2={layout.padL + layout.innerW}
                y2={refY}
                className="ng-scatter__ref-line ng-scatter__ref-line--hc"
              />
              <text
                x={layout.padL + layout.innerW - 6}
                y={refY + 15}
                textAnchor="end"
                className="ng-scatter__ref-label"
              >
                75
              </text>
            </>
          ) : null}

          <g clipPath={`url(#${clipId})`}>
            {paintOrder.map((pt) => {
              const { fill, stroke } = bubbleStyle(pt.overall)
              const focusSlot = draftTestFocusSlotIndex(pt.key, focusedKeys)
              const isFocused = focusSlot != null
              const focusColor = isFocused
                ? DRAFT_TEST_FOCUS_SLOTS[focusSlot].border
                : null
              const isHovered = pt.key === hoverKey
              const active = isFocused || isHovered
              const dimmed = hasFocus && !isFocused
              const cx = sx(pt.x)
              const cy = sy(pt.y)
              const r = isFocused ? FOCUS_BUBBLE_R : active ? 7 : BUBBLE_R
              const ringPad = isFocused ? FOCUS_BUBBLE_RING_PAD : 5
              const ringStroke = focusColor ?? stroke
              return (
                <g
                  key={pt.key}
                  className={
                    isFocused
                      ? `ng-scatter__bubble ng-scatter__bubble--focused ng-scatter__bubble--focus-slot-${focusSlot}`
                      : active
                        ? 'ng-scatter__bubble ng-scatter__bubble--active'
                        : 'ng-scatter__bubble'
                  }
                  style={{ opacity: dimmed ? 0.9 : 1 }}
                  onMouseEnter={(e) => handleBubbleEnter(pt, e.currentTarget)}
                  onFocus={(e) => handleBubbleEnter(pt, e.currentTarget)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${pt.name}, overall ${pt.overall}`}
                >
                  {active ? (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={r + ringPad}
                      fill={ringStroke}
                      fillOpacity={isFocused ? 0.35 : 0.25}
                      pointerEvents="none"
                    />
                  ) : null}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={fill}
                    stroke={ringStroke}
                    strokeWidth={isFocused ? 2.7 : active ? 2 : 1}
                    className="ng-scatter__bubble-dot"
                  />
                </g>
              )
            })}
          </g>

          {scale.xTicks.map((v) => (
            <text
              key={`xt-${v}`}
              x={v === scale.minX ? sx(v) + 6 : sx(v)}
              y={layout.xTickY}
              textAnchor="middle"
              className="ng-scatter__tick ng-scatter__tick--hc"
            >
              {v}
            </text>
          ))}
          {scale.yTicks.map((v) => (
            <text
              key={`yt-${v}`}
              x={layout.yTickX}
              y={v === scale.minY ? sy(v) + 1 : sy(v) + 4}
              textAnchor="end"
              className="ng-scatter__tick ng-scatter__tick--hc"
            >
              {v}
            </text>
          ))}

          <line
            x1={layout.padL}
            y1={layout.axisY}
            x2={layout.padL + layout.innerW}
            y2={layout.axisY}
            className="ng-scatter__axis-line"
          />

          <text
            x={layout.padL + layout.innerW / 2}
            y={layout.axisY - 10}
            textAnchor="middle"
            className="ng-scatter__axis-title ng-scatter__axis-title--hc draft-test__scatter-axis-title"
          >
            {comparison.xAxisTitle}
          </text>
          <text
            x={layout.padL + 28}
            y={layout.padT + layout.innerH / 2}
            textAnchor="middle"
            transform={`rotate(-90 ${layout.padL + 28} ${layout.padT + layout.innerH / 2})`}
            className="ng-scatter__axis-title ng-scatter__axis-title--hc draft-test__scatter-axis-title"
          >
            {comparison.yAxisTitle}
          </text>
        </svg>
        ) : null}

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
                <dt>{hovered.xLabel}</dt>
                <dd>{hovered.x}</dd>
              </div>
              <div>
                <dt>{hovered.yLabel}</dt>
                <dd>{hovered.y}</dd>
              </div>
              <div>
                <dt>Overall Score</dt>
                <dd>{hovered.overall}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  )
}
