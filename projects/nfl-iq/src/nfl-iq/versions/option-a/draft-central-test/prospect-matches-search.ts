import type { DraftBoardProspect } from '../../../types'

export function prospectMatchesSearch(
  row: DraftBoardProspect,
  query: string,
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    row.name.toLowerCase().includes(q) ||
    row.position.toLowerCase().includes(q) ||
    row.school.toLowerCase().includes(q) ||
    row.schoolAbbr.toLowerCase().includes(q)
  )
}
