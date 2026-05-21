import type { PlayerTrackingSummary } from '../types/combine-tracking-player'

const SCHOOL_NAMES: Record<string, string> = {
  MSST: 'Mississippi State',
  LSU: 'LSU',
  WAKE: 'Wake Forest',
  ARK: 'Arkansas',
  MIZZ: 'Missouri',
  OSU: 'Ohio State',
  ORE: 'Oregon',
  GT: 'Georgia Tech',
  TTU: 'Texas Tech',
  ARIZ: 'Arizona',
  UGA: 'Georgia',
  GAST: 'Georgia State',
  ALA: 'Alabama',
  WASH: 'Washington',
}

const AVG_SPEED_CURVE = [
  { distance: 10, speed: 14.2 },
  { distance: 20, speed: 18.4 },
  { distance: 30, speed: 20.8 },
  { distance: 40, speed: 22.1 },
]

function buildSpeedCurve(topSpeed: number, fortyTime: number): PlayerTrackingSummary['speedCurve'] {
  const start = 12 + (4.5 - fortyTime) * 1.2
  const mid = topSpeed * 0.82
  return [
    { distance: 10, speed: Number((start + 2.1).toFixed(2)) },
    { distance: 20, speed: Number((mid).toFixed(2)) },
    { distance: 30, speed: Number((topSpeed * 0.94).toFixed(2)) },
    { distance: 40, speed: Number(topSpeed.toFixed(2)) },
  ]
}

const RAW: Omit<PlayerTrackingSummary, 'id' | 'rank' | 'schoolDisplay' | 'speedCurve' | 'avgSpeedCurve'>[] = [
  { player: 'Brenen Thompson', position: 'WR', school: 'MSST', year: 2026, fortyTime: 4.26, topSpeed: 24.07, tenTime: 1.52, tenYardSpeed: 16.84, maxAccel: 6.58, height: '5100', weight: 182 },
  { player: 'Barion Brown', position: 'WR', school: 'LSU', year: 2026, fortyTime: 4.4, topSpeed: 23.74, tenTime: 1.58, tenYardSpeed: 16.41, maxAccel: 6.31, height: '5112', weight: 195 },
  { player: 'Demond Claiborne', position: 'RB', school: 'WAKE', year: 2026, fortyTime: 4.37, topSpeed: 23.71, tenTime: 1.55, tenYardSpeed: 16.62, maxAccel: 6.42, height: '5096', weight: 188 },
  { player: 'Zavion Thomas', position: 'WR', school: 'LSU', year: 2026, fortyTime: 4.28, topSpeed: 23.57, tenTime: 1.53, tenYardSpeed: 16.71, maxAccel: 6.48, height: '5094', weight: 178 },
  { player: 'Mike Washington Jr.', position: 'RB', school: 'ARK', year: 2026, fortyTime: 4.33, topSpeed: 23.52, tenTime: 1.56, tenYardSpeed: 16.55, maxAccel: 6.39, height: '5102', weight: 201 },
  { player: 'Toriano Pride Jr.', position: 'CB', school: 'MIZZ', year: 2026, fortyTime: 4.32, topSpeed: 23.5, tenTime: 1.54, tenYardSpeed: 16.68, maxAccel: 6.44, height: '5100', weight: 186 },
  { player: 'Lorenzo Styles Jr.', position: 'S', school: 'OSU', year: 2026, fortyTime: 4.27, topSpeed: 23.48, tenTime: 1.52, tenYardSpeed: 16.79, maxAccel: 6.51, height: '6012', weight: 210 },
  { player: 'Malik Benson', position: 'WR', school: 'ORE', year: 2026, fortyTime: 4.37, topSpeed: 23.46, tenTime: 1.57, tenYardSpeed: 16.48, maxAccel: 6.28, height: '6000', weight: 192 },
  { player: 'Eric Rivers', position: 'WR', school: 'GT', year: 2026, fortyTime: 4.35, topSpeed: 23.41, tenTime: 1.56, tenYardSpeed: 16.52, maxAccel: 6.35, height: '6020', weight: 198 },
  { player: 'Taylen Green', position: 'QB', school: 'ARK', year: 2026, fortyTime: 4.36, topSpeed: 23.4, tenTime: 1.58, tenYardSpeed: 16.44, maxAccel: 6.22, height: '6044', weight: 225 },
  { player: 'Dillon Thieneman', position: 'S', school: 'ORE', year: 2026, fortyTime: 4.35, topSpeed: 23.36, tenTime: 1.55, tenYardSpeed: 16.57, maxAccel: 6.38, height: '6004', weight: 204 },
  { player: 'Caleb Douglas', position: 'WR', school: 'TTU', year: 2026, fortyTime: 4.39, topSpeed: 23.36, tenTime: 1.59, tenYardSpeed: 16.39, maxAccel: 6.19, height: '6028', weight: 191 },
  { player: 'Treydan Stukes', position: 'S', school: 'ARIZ', year: 2026, fortyTime: 4.33, topSpeed: 23.33, tenTime: 1.54, tenYardSpeed: 16.61, maxAccel: 6.41, height: '5110', weight: 196 },
]

export const PLAYER_TRACKING_SUMMARY: PlayerTrackingSummary[] = RAW.map((row, index) => {
  const id = row.player.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    ...row,
    id,
    rank: index + 1,
    schoolDisplay: SCHOOL_NAMES[row.school] ?? row.school,
    speedCurve: buildSpeedCurve(row.topSpeed, row.fortyTime),
    avgSpeedCurve: AVG_SPEED_CURVE,
  }
})

export const DEFAULT_PLAYER_TRACKING_ID = 'demond-claiborne'
