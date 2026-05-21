import { FREE_AGENCY_AVAILABLE } from '../../../data/free-agency-board.mock'
import type { FreeAgencyAvailableAgent } from '../../../types/free-agency-board'

/** Alignment codes from strings like "EDGE (534), DT (11)" */
export function parseAlignmentCodes(alignment: string): string[] {
  const matches = alignment.matchAll(/([A-Z]+)\s*\(/g)
  return [...matches].map((m) => m[1])
}

export function getFreeAgencyPositionOptions(): string[] {
  return [...new Set(FREE_AGENCY_AVAILABLE.map((r) => r.position))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function getFreeAgencyAlignmentOptions(): string[] {
  const codes = new Set<string>()
  for (const row of FREE_AGENCY_AVAILABLE) {
    for (const code of parseAlignmentCodes(row.alignment)) {
      codes.add(code)
    }
  }
  return [...codes].sort((a, b) => a.localeCompare(b))
}

export function agentMatchesPositionFilter(
  position: string,
  selected: Set<string>,
): boolean {
  return selected.size === 0 || selected.has(position)
}

export function agentMatchesAlignmentFilter(
  alignment: string,
  selected: Set<string>,
): boolean {
  if (selected.size === 0) return true
  return parseAlignmentCodes(alignment).some((code) => selected.has(code))
}

export function agentMatchesSearchQuery(
  row: FreeAgencyAvailableAgent,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    row.player.toLowerCase().includes(q) ||
    row.position.toLowerCase().includes(q) ||
    row.team2025.toLowerCase().includes(q) ||
    row.alignment.toLowerCase().includes(q)
  )
}
