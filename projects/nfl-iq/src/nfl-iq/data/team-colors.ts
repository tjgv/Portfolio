/** Primary brand colors for Team Central header typography */
export const TEAM_PRIMARY_COLORS: Record<string, string> = {
  ARI: '#97233f',
  ATL: '#a71930',
  BAL: '#241773',
  BUF: '#00338d',
  CAR: '#0085ca',
  CHI: '#e64100',
  CIN: '#fb4f14',
  CLE: '#311d00',
  DAL: '#002244',
  DEN: '#fb4f14',
  DET: '#0076b6',
  GB: '#203731',
  HOU: '#03202f',
  IND: '#002c5f',
  JAX: '#006778',
  KC: '#e31837',
  LAC: '#002244',
  LAR: '#003594',
  LV: '#000000',
  MIA: '#008e97',
  MIN: '#4f2683',
  NE: '#002244',
  NO: '#d3bc8d',
  NYG: '#a71930',
  NYJ: '#115740',
  PHI: '#004c54',
  PIT: '#ffb612',
  SEA: '#002244',
  SF: '#aa0000',
  TB: '#d50a0a',
  TEN: '#4b92db',
  WAS: '#5a1414',
}

export function teamPrimaryColor(teamId: string): string {
  return TEAM_PRIMARY_COLORS[teamId] ?? '#013369'
}

function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.trim().replace(/^#/, '')
  if (normalized.length !== 6 && normalized.length !== 3) return null
  const full =
    normalized.length === 3
      ? [...normalized].map((c) => c + c).join('')
      : normalized
  const n = Number.parseInt(full, 16)
  if (Number.isNaN(n)) return null
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Text color (#fff or #111) for readable contrast on a team primary background */
export function teamContrastText(hex: string): '#ffffff' | '#111111' {
  const rgb = parseHexColor(hex)
  if (!rgb) return '#ffffff'
  return relativeLuminance(rgb.r, rgb.g, rgb.b) > 0.45 ? '#111111' : '#ffffff'
}
