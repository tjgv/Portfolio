import { parseAlignmentCodes } from '../utils/free-agency-filters'
import { positionFullName } from './position-names'
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

export function getFreeAgencyMatchedNeedPositions(
  alignment: string,
  teamId: string,
): string[] {
  const codes = parseAlignmentCodes(alignment)
  const matched: string[] = []
  for (const need of getFreeAgencyTeamNeedPositions(teamId)) {
    const needCodes = alignmentCodesForNeed(need)
    if (needCodes.some((code) => codes.includes(code))) {
      matched.push(need)
    }
  }
  return matched
}

export function countFreeAgencyNeedMatches(alignment: string, teamId: string): number {
  return getFreeAgencyMatchedNeedPositions(alignment, teamId).length
}

export function getFreeAgencyNeedTooltip(
  alignment: string,
  teamId: string,
): string {
  const matched = getFreeAgencyMatchedNeedPositions(alignment, teamId)
  if (matched.length === 0) {
    return 'No match — this player’s alignment does not fill an open team need.'
  }
  const labels = matched.map((pos) => positionFullName(pos))
  if (matched.length >= 2) {
    return `Matches multiple open needs: ${labels.join(', ')}.`
  }
  return `Matches open team need at ${labels[0]}.`
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
