import type { DraftBoardProspect } from '../../../types'

/** Prospects shown in both Top 150 library and combine scorecard tables. */
export function isDraftTestTop150Prospect(p: DraftBoardProspect): boolean {
  return p.djRank != null && p.djRank <= 150
}

export function filterDraftTestTop150Prospects(
  rows: DraftBoardProspect[],
): DraftBoardProspect[] {
  return rows.filter(isDraftTestTop150Prospect)
}
