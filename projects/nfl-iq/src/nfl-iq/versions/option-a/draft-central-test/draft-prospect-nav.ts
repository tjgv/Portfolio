import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'

export const DRAFT_PROSPECT_QUERY = 'prospect'

export function draftProspectDetailPath(prospectKey: string): string {
  const params = new URLSearchParams()
  params.set(DRAFT_PROSPECT_QUERY, prospectKey)
  return `/draft?${params.toString()}`
}

export function findProspectByKey(
  rows: DraftBoardProspect[],
  key: string,
): DraftBoardProspect | undefined {
  const trimmed = key.trim()
  if (!trimmed) return undefined
  return rows.find((p) => prospectStableKey(p) === trimmed)
}
