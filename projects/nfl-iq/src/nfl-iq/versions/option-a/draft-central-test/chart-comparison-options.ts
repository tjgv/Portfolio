import type { DraftBoardProspect } from '../../../types'
import { parseArmToInches, parseHeightToInches } from '../../../utils/combine-measurements'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'

export type ChartComparisonId =
  | 'forty-time-ten-yd'
  | 'forty-time-forty-mph'
  | 'forty-time-weight'
  | 'arm-height'
  | 'ath-prod'
  | 'broad-vert'
  | 'shuttle-cone'
  | 'weight-height'

export type ScatterBubble = {
  key: string
  name: string
  x: number
  y: number
  overall: number
  xLabel: string
  yLabel: string
}

export type ChartComparisonOption = {
  id: ChartComparisonId
  label: string
  xAxisTitle: string
  yAxisTitle: string
  useScoreScale: boolean
  buildBubbles: (prospects: DraftBoardProspect[]) => ScatterBubble[]
}

function parseDecimal(value: string | null | undefined): number | null {
  if (value == null || value === '') return null
  const n = Number.parseFloat(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) ? n : null
}

function parseWeight(value: string | null | undefined): number | null {
  if (value == null || value === '') return null
  const n = Number.parseInt(String(value).replace(/\D/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

function buildFromAxes(
  prospects: DraftBoardProspect[],
  getX: (p: DraftBoardProspect) => number | null,
  getY: (p: DraftBoardProspect) => number | null,
  xLabel: string,
  yLabel: string,
): ScatterBubble[] {
  const out: ScatterBubble[] = []
  for (const p of prospects) {
    const x = getX(p)
    const y = getY(p)
    if (x == null || y == null) continue
    out.push({
      key: prospectStableKey(p),
      name: p.name,
      x,
      y,
      overall: p.overall,
      xLabel,
      yLabel,
    })
  }
  return out
}

export const CHART_COMPARISON_OPTIONS: ChartComparisonOption[] = [
  {
    id: 'forty-time-ten-yd',
    label: '40 Time vs 10-yd Split',
    xAxisTitle: '40 Time',
    yAxisTitle: '10-yd Split',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseDecimal(p.fortyTime),
        (p) => parseDecimal(p.tenYd),
        '40 Time',
        '10-yd Split',
      ),
  },
  {
    id: 'forty-time-forty-mph',
    label: '40 Time vs 40 Top Speed',
    xAxisTitle: '40 Time',
    yAxisTitle: '40 Top Speed',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseDecimal(p.fortyTime),
        (p) => parseDecimal(p.fortyMph),
        '40 Time',
        '40 Top Speed',
      ),
  },
  {
    id: 'forty-time-weight',
    label: '40 Time vs Weight',
    xAxisTitle: '40 Time',
    yAxisTitle: 'Weight',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseDecimal(p.fortyTime),
        (p) => parseWeight(p.wt),
        '40 Time',
        'Weight',
      ),
  },
  {
    id: 'arm-height',
    label: 'Arm Length vs Height',
    xAxisTitle: 'Arm Length',
    yAxisTitle: 'Height',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseArmToInches(p.arm),
        (p) => parseHeightToInches(p.ht),
        'Arm Length',
        'Height',
      ),
  },
  {
    id: 'ath-prod',
    label: 'Athleticism Score vs Production Score',
    xAxisTitle: 'Athleticism Score',
    yAxisTitle: 'Production Score',
    useScoreScale: true,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => p.athleticism,
        (p) => p.production,
        'Athleticism Score',
        'Production Score',
      ),
  },
  {
    id: 'broad-vert',
    label: 'Broad Jump vs Vertical Jump',
    xAxisTitle: 'Broad Jump',
    yAxisTitle: 'Vertical Jump',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseDecimal(p.broad),
        (p) => parseDecimal(p.vert),
        'Broad Jump',
        'Vertical Jump',
      ),
  },
  {
    id: 'shuttle-cone',
    label: 'Short Shuttle vs Three Cone',
    xAxisTitle: 'Short Shuttle',
    yAxisTitle: 'Three Cone',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseDecimal(p.shuttle),
        (p) => parseDecimal(p.cone),
        'Short Shuttle',
        'Three Cone',
      ),
  },
  {
    id: 'weight-height',
    label: 'Weight vs Height',
    xAxisTitle: 'Weight',
    yAxisTitle: 'Height',
    useScoreScale: false,
    buildBubbles: (rows) =>
      buildFromAxes(
        rows,
        (p) => parseWeight(p.wt),
        (p) => parseHeightToInches(p.ht),
        'Weight',
        'Height',
      ),
  },
]

export function getChartComparisonOption(
  id: ChartComparisonId,
): ChartComparisonOption {
  return (
    CHART_COMPARISON_OPTIONS.find((o) => o.id === id) ?? CHART_COMPARISON_OPTIONS[4]
  )
}
