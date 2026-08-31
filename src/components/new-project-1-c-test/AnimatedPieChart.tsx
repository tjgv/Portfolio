import { useEffect, useRef, useState } from 'react'
import { INSIGHT_SEGMENTS, type InsightShares } from './designInsightsData'

const VIEW = 120
const CX = 60
const CY = 60
const RADIUS = 54
/** Figma pies start at 3 o'clock and sweep clockwise. */
const START_OFFSET_DEG = 90
const OVERLAP_DEG = 0.35
const ANIM_MS = 720

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function slicePath(startDeg: number, endDeg: number): string {
  const sweep = Math.max(0, Math.min(360, endDeg - startDeg))
  if (sweep <= 0.01) return ''
  if (sweep >= 359.9) {
    return `M ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CX} ${CY + RADIUS} A ${RADIUS} ${RADIUS} 0 1 1 ${CX} ${CY - RADIUS} Z`
  }
  const [x1, y1] = polar(CX, CY, RADIUS, startDeg)
  const [x2, y2] = polar(CX, CY, RADIUS, endDeg)
  const large = sweep > 180 ? 1 : 0
  return `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${x2} ${y2} Z`
}

function lerpShares(from: InsightShares, to: InsightShares, t: number): InsightShares {
  const out = { ...to }
  for (const seg of INSIGHT_SEGMENTS) {
    out[seg.id] = from[seg.id] + (to[seg.id] - from[seg.id]) * t
  }
  return out
}

function sharesEqual(a: InsightShares, b: InsightShares): boolean {
  return INSIGHT_SEGMENTS.every((seg) => Math.abs(a[seg.id] - b[seg.id]) < 0.001)
}

function sharesKey(shares: InsightShares): string {
  return INSIGHT_SEGMENTS.map((seg) => shares[seg.id]).join(',')
}

type AnimatedPieChartProps = {
  shares: InsightShares
  size?: 'large' | 'small'
  label?: string
}

export default function AnimatedPieChart({ shares, size = 'small', label }: AnimatedPieChartProps) {
  const [display, setDisplay] = useState(shares)
  const displayRef = useRef(display)
  const rafRef = useRef<number | null>(null)
  const key = sharesKey(shares)
  displayRef.current = display

  useEffect(() => {
    const from = displayRef.current
    if (sharesEqual(from, shares)) {
      setDisplay(shares)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(shares)
      return
    }

    const start = performance.now()
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      const t = easeOutCubic(Math.min(1, (now - start) / ANIM_MS))
      setDisplay(lerpShares(from, shares, t))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [key, shares])

  let cursor = START_OFFSET_DEG
  const slices = INSIGHT_SEGMENTS.map((seg) => {
    const start = cursor
    cursor += (display[seg.id] / 100) * 360
    return { ...seg, start, end: cursor, value: display[seg.id] }
  })

  return (
    <svg
      className={`np1c-insight-pie np1c-insight-pie--${size}`}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      role="img"
      aria-label={label}
    >
      {slices.map((slice, index) => {
        const end = slice.end + (index < slices.length - 1 ? OVERLAP_DEG : 0)
        const d = slicePath(slice.start, end)
        if (!d) return null
        return <path key={slice.id} d={d} fill={slice.color} />
      })}
    </svg>
  )
}
