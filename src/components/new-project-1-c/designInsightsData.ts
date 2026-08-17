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
  { id: 'sports', label: 'Sports (Advanced)' },
  { id: 'studios', label: 'Studios (Simple)' },
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
  responding: 22,
  setup: 18,
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
    /** Time-spent shares. Mean of the four equals `final`. */
    personas: {
      mark: { monitoring: 47, setup: 16, transitioning: 8, adjust: 7, responding: 22 },
      kimi: { monitoring: 49, setup: 9, transitioning: 6, adjust: 6, responding: 30 },
      sarah: { monitoring: 53, setup: 24, transitioning: 2, adjust: 2, responding: 19 },
      mario: { monitoring: 51, setup: 22, transitioning: 4, adjust: 5, responding: 18 },
    },
    concerns: {
      mark: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 2, segmentId: 'monitoring' },
        { rank: 3, segmentId: 'setup' },
      ],
      kimi: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 2, segmentId: 'adjust' },
        { rank: 3, segmentId: 'monitoring' },
      ],
      sarah: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'setup' },
        { rank: 3, segmentId: 'responding' },
      ],
      mario: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'setup' },
        { rank: 3, segmentId: 'transitioning' },
      ],
    },
  },
  studios: {
    /** Aggregate from Figma 27101:155488 — modal colors kept. */
    final: { transitioning: 47, monitoring: 27, adjust: 13, setup: 4, responding: 9 },
    /** Time-spent shares. Mean of the four equals `final`. */
    personas: {
      mark: { monitoring: 21, setup: 0, transitioning: 58, adjust: 7, responding: 14 },
      kimi: { monitoring: 24, setup: 0, transitioning: 54, adjust: 17, responding: 5 },
      sarah: { monitoring: 37, setup: 7, transitioning: 42, adjust: 5, responding: 9 },
      mario: { monitoring: 26, setup: 8, transitioning: 34, adjust: 22, responding: 10 },
    },
    concerns: {
      mark: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 2, segmentId: 'adjust' },
        { rank: 3, segmentId: 'monitoring' },
      ],
      kimi: [
        { rank: 1, segmentId: 'transitioning' },
        { rank: 2, segmentId: 'responding' },
        { rank: 3, segmentId: 'adjust' },
      ],
      sarah: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'transitioning' },
      ],
      mario: [
        { rank: 1, segmentId: 'monitoring' },
        { rank: 2, segmentId: 'transitioning' },
        { rank: 3, segmentId: 'adjust' },
      ],
    },
  },
}
