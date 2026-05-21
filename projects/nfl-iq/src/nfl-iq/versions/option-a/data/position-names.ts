/** NFL position abbreviations → display names */
export const POSITION_FULL_NAMES: Record<string, string> = {
  QB: 'Quarterback',
  RB: 'Running Back',
  FB: 'Fullback',
  WR: 'Wide Receiver',
  TE: 'Tight End',
  OL: 'Offensive Line',
  C: 'Center',
  G: 'Guard',
  LG: 'Left Guard',
  RG: 'Right Guard',
  T: 'Tackle',
  LT: 'Left Tackle',
  RT: 'Right Tackle',
  DL: 'Defensive Line',
  DE: 'Defensive End',
  DT: 'Defensive Tackle',
  NT: 'Nose Tackle',
  EDGE: 'Edge Rusher',
  ED: 'Edge Rusher',
  LB: 'Linebacker',
  MLB: 'Middle Linebacker',
  MIKE: 'Middle Linebacker',
  OLB: 'Outside Linebacker',
  SLB: 'Outside Linebacker',
  WLB: 'Outside Linebacker',
  DB: 'Defensive Back',
  CB: 'Cornerback',
  S: 'Safety',
  FS: 'Free Safety',
  SS: 'Strong Safety',
  K: 'Kicker',
  P: 'Punter',
  LS: 'Long Snapper',
  KR: 'Kick Returner',
  PR: 'Punt Returner',
}

export function positionAbbrev(pos: string): string {
  return pos.replace(/!+$/u, '').trim().toUpperCase()
}

export function positionFullName(pos: string): string {
  const abbrev = positionAbbrev(pos)
  return POSITION_FULL_NAMES[abbrev] ?? abbrev
}

export function formatPositionLabel(
  pos: string,
  mode: 'full' | 'abbrev',
  critical: boolean,
): string {
  const base = mode === 'full' ? positionFullName(pos) : positionAbbrev(pos)
  return critical ? `${base}!` : base
}
