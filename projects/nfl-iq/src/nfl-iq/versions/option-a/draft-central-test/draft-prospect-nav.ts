import type { DraftBoardProspect } from '../../../types'
import { DRAFT_BOARD_MOCK } from '../../../data/draft-board'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { findProspectByDisplayName } from './draft-test-focus-nav'

export const DRAFT_PROSPECT_QUERY = 'prospect'

export function draftProspectDetailSearch(displayName: string): string {
  const prospect = findProspectByDisplayName(DRAFT_BOARD_MOCK, displayName)
  if (!prospect) return ''
  const params = new URLSearchParams()
  params.set(DRAFT_PROSPECT_QUERY, prospectStableKey(prospect))
  return `?${params.toString()}`
}

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
