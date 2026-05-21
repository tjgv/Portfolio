import type { DraftBoardProspect } from '../../../types'
import type { OptionASortDirection } from '../components/OptionASortableTh'
import { compareAlpha, compareNumeric } from './option-a-sort-utils'

export type CombineSortKey =
  | 'djRank'
  | 'name'
  | 'school'
  | 'fortyMph'
  | 'fortyTime'
  | 'tenYd'
  | 'broad'
  | 'vert'
  | 'shuttle'
  | 'cone'
  | 'bench'
  | 'rawAth'
  | 'athleticism'
  | 'production'
  | 'overall'
  | 'ht'
  | 'wt'
  | 'hand'
  | 'arm'
  | 'wing'

export function sortCombineProspects(
  rows: DraftBoardProspect[],
  key: CombineSortKey,
  direction: OptionASortDirection,
): DraftBoardProspect[] {
  return [...rows].sort((a, b) => {
    switch (key) {
      case 'djRank':
        return compareNumeric(
          a.djRank ?? Number.NEGATIVE_INFINITY,
          b.djRank ?? Number.NEGATIVE_INFINITY,
          direction,
        )
      case 'name':
        return compareAlpha(a.name, b.name, direction)
      case 'school':
        return compareAlpha(
          a.schoolAbbr || a.school,
          b.schoolAbbr || b.school,
          direction,
        )
      case 'fortyMph':
        return compareAlpha(a.fortyMph ?? '', b.fortyMph ?? '', direction)
      case 'fortyTime':
        return compareAlpha(a.fortyTime ?? '', b.fortyTime ?? '', direction)
      case 'tenYd':
        return compareAlpha(a.tenYd ?? '', b.tenYd ?? '', direction)
      case 'broad':
        return compareAlpha(a.broad ?? '', b.broad ?? '', direction)
      case 'vert':
        return compareAlpha(a.vert ?? '', b.vert ?? '', direction)
      case 'shuttle':
        return compareAlpha(a.shuttle ?? '', b.shuttle ?? '', direction)
      case 'cone':
        return compareAlpha(a.cone ?? '', b.cone ?? '', direction)
      case 'bench':
        return compareAlpha(a.bench ?? '', b.bench ?? '', direction)
      case 'rawAth':
        return compareNumeric(
          a.rawAth ?? Number.NEGATIVE_INFINITY,
          b.rawAth ?? Number.NEGATIVE_INFINITY,
          direction,
        )
      case 'athleticism':
        return compareNumeric(a.athleticism, b.athleticism, direction)
      case 'production':
        return compareNumeric(a.production, b.production, direction)
      case 'overall':
        return compareNumeric(a.overall, b.overall, direction)
      case 'ht':
        return compareAlpha(a.ht, b.ht, direction)
      case 'wt':
        return compareAlpha(a.wt, b.wt, direction)
      case 'hand':
        return compareAlpha(a.hand ?? '', b.hand ?? '', direction)
      case 'arm':
        return compareAlpha(a.arm ?? '', b.arm ?? '', direction)
      case 'wing':
        return compareAlpha(a.wing ?? '', b.wing ?? '', direction)
      default:
        return 0
    }
  })
}
