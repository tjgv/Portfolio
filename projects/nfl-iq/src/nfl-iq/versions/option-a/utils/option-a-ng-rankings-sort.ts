import type { DraftBoardProspect } from '../../../types'
import type { DraftScoreRankMaps } from '../../../utils/draft-ng-ranks'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { formatSchoolShortLabel } from '../../../utils/school-short'
import type { OptionASortDirection } from '../components/OptionASortableTh'
import { compareAlpha, compareNumeric } from './option-a-sort-utils'

export type NgRankingsSortKey =
  | 'name'
  | 'school'
  | 'rkOverall'
  | 'overall'
  | 'athleticism'
  | 'rkAthleticism'
  | 'production'
  | 'rkProduction'

function parseRankValue(value: string | number | undefined): number {
  if (value == null || value === '—') return Number.POSITIVE_INFINITY
  if (typeof value === 'number') return value
  const n = Number.parseInt(String(value), 10)
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY
}

export function sortNgRankingProspects(
  rows: DraftBoardProspect[],
  ranks: DraftScoreRankMaps,
  key: NgRankingsSortKey,
  direction: OptionASortDirection,
): DraftBoardProspect[] {
  return [...rows].sort((a, b) => {
    const pkA = prospectStableKey(a)
    const pkB = prospectStableKey(b)

    switch (key) {
      case 'name':
        return compareAlpha(a.name, b.name, direction)
      case 'school':
        return compareAlpha(
          formatSchoolShortLabel(a.schoolAbbr || a.school),
          formatSchoolShortLabel(b.schoolAbbr || b.school),
          direction,
        )
      case 'rkOverall':
        return compareNumeric(
          parseRankValue(ranks.overallRank.get(pkA)),
          parseRankValue(ranks.overallRank.get(pkB)),
          direction,
        )
      case 'overall':
        return compareNumeric(a.overall, b.overall, direction)
      case 'athleticism':
        return compareNumeric(a.athleticism, b.athleticism, direction)
      case 'rkAthleticism':
        return compareNumeric(
          parseRankValue(ranks.athleticismRank.get(pkA)),
          parseRankValue(ranks.athleticismRank.get(pkB)),
          direction,
        )
      case 'production':
        return compareNumeric(a.production, b.production, direction)
      case 'rkProduction':
        return compareNumeric(
          parseRankValue(ranks.productionRank.get(pkA)),
          parseRankValue(ranks.productionRank.get(pkB)),
          direction,
        )
      default:
        return 0
    }
  })
}
