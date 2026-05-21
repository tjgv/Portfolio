export type DraftScoreTier = 'elite' | 'good' | 'average' | 'below'

export function tierFromNgsScore(score: number): DraftScoreTier {
  if (score >= 90) return 'elite'
  if (score >= 75) return 'good'
  if (score >= 60) return 'average'
  return 'below'
}
