import type { OptionASortDirection } from '../components/OptionASortableTh'

export function compareAlpha(a: string, b: string, direction: OptionASortDirection): number {
  const cmp = a.localeCompare(b, undefined, { sensitivity: 'base' })
  return direction === 'asc' ? cmp : -cmp
}

export function compareNumeric(
  a: number,
  b: number,
  direction: OptionASortDirection,
): number {
  const cmp = a < b ? -1 : a > b ? 1 : 0
  return direction === 'asc' ? cmp : -cmp
}

export function parseSortableNumber(
  value: string | number | null | undefined,
): number {
  if (value == null || value === '' || value === '—') return Number.NEGATIVE_INFINITY
  if (typeof value === 'number') return value
  const n = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : Number.NEGATIVE_INFINITY
}

export function parseAavMillions(aav: string): number {
  const n = Number.parseFloat(aav.replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function matchesPositionFilter(
  position: string,
  selected: Set<string>,
): boolean {
  return selected.size === 0 || selected.has(position)
}

export function getUniquePositions(
  items: Iterable<string>,
): string[] {
  return [...new Set(items)].sort((a, b) => a.localeCompare(b))
}
