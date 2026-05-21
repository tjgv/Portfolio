import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'

export const DRAFT_TEST_FOCUS_QUERY = 'focus'

/** Home display names that differ from draft-board prospect names */
const HOME_PLAYER_NAME_ALIASES: Record<string, string> = {
  'E. McNeil-Warren': 'Emmanuel McNeil-Warren',
}

export function draftTestFocusSearch(playerName: string): string {
  const params = new URLSearchParams()
  params.set(DRAFT_TEST_FOCUS_QUERY, playerName)
  return `?${params.toString()}`
}

export function draftTestFocusPath(playerName: string): string {
  return `/draft${draftTestFocusSearch(playerName)}`
}

export function findProspectByDisplayName(
  rows: DraftBoardProspect[],
  displayName: string,
): DraftBoardProspect | undefined {
  const trimmed = displayName.trim()
  if (!trimmed) return undefined

  const canonical = HOME_PLAYER_NAME_ALIASES[trimmed] ?? trimmed
  const norm = canonical.toLowerCase()

  const exact = rows.find((p) => p.name.toLowerCase() === norm)
  if (exact) return exact

  const lastToken = norm.split(/\s+/).pop() ?? norm
  return rows.find((p) => {
    const name = p.name.toLowerCase()
    return name === norm || name.includes(lastToken) && lastToken.length > 3
  })
}

export function prospectKeyFromDisplayName(
  rows: DraftBoardProspect[],
  displayName: string,
): string | undefined {
  const prospect = findProspectByDisplayName(rows, displayName)
  return prospect ? prospectStableKey(prospect) : undefined
}
