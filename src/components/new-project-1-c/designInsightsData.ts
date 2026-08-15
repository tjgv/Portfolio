export type InsightSegmentId =
  | 'monitoring'
  | 'transitioning'
  | 'setup'
  | 'adjust'
  | 'responding'

export type InsightPersonaId = 'mark' | 'kimi' | 'sarah' | 'mario'

export type InsightTabId = 'sports' | 'studios'

export type InsightShares = Record<InsightSegmentId, number>

export type InsightConcern = {
  rank: number
  segmentId: InsightSegmentId
}

export type InsightPersona = {
  id: InsightPersonaId
  name: string
  role: string
}

/** Clockwise from 3 o'clock — matches Figma ellipse start angles. */
export const INSIGHT_SEGMENTS: readonly {
  id: InsightSegmentId
  label: string
  shortLabel: string
  color: string
}[] = [
  { id: 'adjust', label: 'Adjust / Edit', shortLabel: 'Adjust / Edit', color: '#8e56ed' },
  { id: 'transitioning', label: 'Transitioning', shortLabel: 'Transitioning', color: '#b95153' },
  {
    id: 'responding',
    label: 'Responding (Triggers, State Change)',
    shortLabel: 'Responding',
    color: '#285dbd',
  },
  { id: 'setup', label: 'Setup', shortLabel: 'Setup', color: '#6c9148' },
  {
    id: 'monitoring',
    label: 'Monitoring & Troubleshooting',
    shortLabel: 'Monitoring',
    color: '#3a3a3a',
  },
] as const

export const INSIGHT_LEGEND: readonly InsightSegmentId[] = [
  'monitoring',
  'transitioning',
  'setup',
  'adjust',
  'responding',
] as const

export const INSIGHT_TABS: readonly { id: InsightTabId; label: string }[] = [
  { id: 'sports', label: 'Sports' },
  { id: 'studios', label: 'Studios' },
] as const

export const INSIGHT_PERSONAS: readonly InsightPersona[] = [
  { id: 'mark', name: 'Mark', role: 'Dome Operator (New Hire)' },
  { id: 'kimi', name: 'Kimi', role: 'Operator Intern' },
  { id: 'sarah', name: 'Sarah', role: 'Operator Manager' },
  { id: 'mario', name: 'Mario', role: 'Sr. Operator' },
] as const

const SEGMENT_BY_ID = Object.fromEntries(INSIGHT_SEGMENTS.map((seg) => [seg.id, seg])) as Record<
  InsightSegmentId,
  (typeof INSIGHT_SEGMENTS)[number]
>

export function insightSegment(id: InsightSegmentId) {
  return SEGMENT_BY_ID[id]
}

/** Sports values taken from Figma frame 27104:155613 ellipse arcData. */
const SPORTS_CHART: InsightShares = {
  monitoring: 50,
  responding: 20,
  setup: 20,
  transitioning: 5,
  adjust: 5,
}

export const INSIGHT_DATA: Record<
  InsightTabId,
  {
    final: InsightShares
    personas: Record<InsightPersonaId, InsightShares>
    concerns: Record<InsightPersonaId, readonly InsightConcern[]>
  }
> = {
  sports: {
    final: SPORTS_CHART,
    personas: {
      mark: SPORTS_CHART,
      kimi: SPORTS_CHART,
      sarah: SPORTS_CHART,
      mario: SPORTS_CHART,
    },
    concerns: {
      mark: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 1, segmentId: 'monitoring' },
        { rank: 3, segmentId: 'setup' },
      ],
      kimi: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 1, segmentId: 'monitoring' },
        { rank: 3, segmentId: 'setup' },
      ],
      sarah: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'transitioning' },
        { rank: 3, segmentId: 'setup' },
      ],
      mario: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'transitioning' },
        { rank: 3, segmentId: 'setup' },
      ],
    },
  },
  studios: {
    /** Aggregate from Figma 27101:155488 — modal colors kept. */
    final: { transitioning: 40, monitoring: 30, adjust: 20, setup: 5, responding: 5 },
    personas: {
      mark: { monitoring: 30, setup: 28, responding: 14, transitioning: 18, adjust: 10 },
      kimi: { monitoring: 32, setup: 24, responding: 18, transitioning: 16, adjust: 10 },
      sarah: { monitoring: 38, setup: 22, responding: 16, transitioning: 12, adjust: 12 },
      mario: { monitoring: 36, setup: 20, responding: 20, transitioning: 12, adjust: 12 },
    },
    concerns: {
      mark: [
        { rank: 1, segmentId: 'setup' },
        { rank: 2, segmentId: 'transitioning' },
        { rank: 3, segmentId: 'monitoring' },
      ],
      kimi: [
        { rank: 1, segmentId: 'setup' },
        { rank: 2, segmentId: 'adjust' },
        { rank: 3, segmentId: 'transitioning' },
      ],
      sarah: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'setup' },
        { rank: 3, segmentId: 'responding' },
      ],
      mario: [
        { rank: 1, segmentId: 'setup' },
        { rank: 2, segmentId: 'monitoring' },
        { rank: 3, segmentId: 'adjust' },
      ],
    },
  },
}
