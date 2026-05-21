/** Short college label matching NGS-style columns (ND, OSU, ORE, …). */
export function formatSchoolShortLabel(schoolDisplay: string): string {
  const x = schoolDisplay.trim().toUpperCase().replace(/\s+/g, ' ')
  if (!x) return '—'

  const words = x.split(' ').filter(Boolean)
  if (words.length >= 2) return words.map((w) => w[0]).join('')

  if (x.length <= 4) return x
  return x.slice(0, 4)
}
