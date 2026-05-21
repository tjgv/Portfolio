import { parseAlignmentCodes } from '../utils/free-agency-filters'
import { generateTeamTopNeeds } from './team-top-needs.mock'

const NEED_POSITION_TO_ALIGNMENT: Record<string, string> = {
  ED: 'EDGE',
  LB: 'LB',
  WR: 'WR',
  SL: 'SL',
  DT: 'DT',
}

export type FreeAgencyNeedIndicator = 'none' | 'check' | 'star'

function alignmentCodesForNeed(needPos: string): string[] {
  const mapped = NEED_POSITION_TO_ALIGNMENT[needPos]
  return mapped ? [mapped] : [needPos]
}

/** Open needs (red) used for Need-column matching against agent alignments. */
export function getFreeAgencyTeamNeedPositions(teamId: string): readonly string[] {
  return generateTeamTopNeeds(teamId)
    .filter((tag) => tag.status === 'need' || tag.status === 'critical')
    .map((tag) => tag.pos)
}

export function countFreeAgencyNeedMatches(alignment: string, teamId: string): number {
  const codes = parseAlignmentCodes(alignment)
  let count = 0
  for (const need of getFreeAgencyTeamNeedPositions(teamId)) {
    const needCodes = alignmentCodesForNeed(need)
    if (needCodes.some((code) => codes.includes(code))) {
      count++
    }
  }
  return count
}

export function getFreeAgencyNeedIndicator(
  alignment: string,
  teamId: string,
): FreeAgencyNeedIndicator {
  const matches = countFreeAgencyNeedMatches(alignment, teamId)
  if (matches === 0) return 'none'
  if (matches >= 2) return 'star'
  return 'check'
}

const NEED_INDICATOR_SORT_RANK: Record<FreeAgencyNeedIndicator, number> = {
  none: 0,
  check: 1,
  star: 2,
}

export function getFreeAgencyNeedSortRank(
  alignment: string,
  teamId: string,
): number {
  return NEED_INDICATOR_SORT_RANK[getFreeAgencyNeedIndicator(alignment, teamId)]
}
