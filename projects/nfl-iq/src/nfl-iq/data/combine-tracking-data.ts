import type {
  CombineTrackingData,
  CombineTrackingRow,
} from '../types/combine-tracking'
import fortyYardDash2026 from './forty-yard-dash-2026.json'
import shuttleTopSpeed2026 from './shuttle-top-speed-2026.json'

export type FortyYardDashRecord = {
  player: string
  position: string
  school: string
  year: number
  top_speed_mph: number
  forty_time: number
}

export type ShuttleTopSpeedRecord = {
  player: string
  position: string
  school: string
  year: number
  shuttle_top_speed_mph: number
  shuttle_time: number
}

function mapFortyYardDashRows(records: FortyYardDashRecord[]): CombineTrackingRow[] {
  return records.map((row) => ({
    player: row.player,
    position: row.position,
    school: row.school,
    year: row.year,
    metric: row.top_speed_mph.toFixed(2),
    time: row.forty_time.toFixed(2),
  }))
}

function mapShuttleTopSpeedRows(
  records: ShuttleTopSpeedRecord[],
): CombineTrackingRow[] {
  return records.map((row) => ({
    player: row.player,
    position: row.position,
    school: row.school,
    year: row.year,
    metric: row.shuttle_top_speed_mph.toFixed(2),
    time: row.shuttle_time.toFixed(2),
  }))
}

const skillDrillRows: CombineTrackingRow[] = [
  { player: 'Carnell Tate', position: 'WR', school: 'OSU', year: 2026, metric: '19.72' },
  { player: 'Jordyn Tyson', position: 'WR', school: 'ASU', year: 2026, metric: '19.64' },
  { player: 'Makai Lemon', position: 'WR', school: 'USC', year: 2026, metric: '19.51' },
  { player: 'Omar Cooper Jr.', position: 'WR', school: 'IND', year: 2026, metric: '19.38' },
  { player: 'Denzel Boston', position: 'WR', school: 'WASH', year: 2026, metric: '19.24' },
  { player: 'KC Concepcion', position: 'WR', school: 'TAMU', year: 2026, metric: '19.11' },
  { player: 'Germie Bernard', position: 'WR', school: 'ORE', year: 2026, metric: '18.97' },
  { player: 'Malachi Fields', position: 'WR', school: 'ND', year: 2026, metric: '18.86' },
  { player: 'Deion Burks', position: 'WR', school: 'OU', year: 2026, metric: '18.74' },
  { player: 'Elijah Sarratt', position: 'WR', school: 'IND', year: 2026, metric: '18.62' },
]

export const COMBINE_TRACKING_DATA: CombineTrackingData = {
  panels: [
    {
      id: 'forty-yard-dash',
      viewLabel: 'VIEW 40 TRACKING METRICS:',
      dropdownOptions: [
        { value: 'top-speed', label: 'Top Speed' },
        { value: 'split-10', label: '10-Yard Split' },
        { value: 'split-20', label: '20-Yard Split' },
      ],
      defaultDropdownValue: 'top-speed',
      titleBold: '40-Yard Dash',
      titleRest: ' Top Speed',
      metricColumnLabel: 'Top Speed',
      showTimeColumn: true,
      rows: mapFortyYardDashRows(fortyYardDash2026 as FortyYardDashRecord[]),
    },
    {
      id: 'shuttle',
      viewLabel: 'VIEW SHUTTLE TRACKING METRICS:',
      dropdownOptions: [
        { value: 'short-shuttle', label: 'Short Shuttle' },
        { value: 'three-cone', label: '3-Cone' },
      ],
      defaultDropdownValue: 'short-shuttle',
      titleBold: 'Shuttle',
      titleRest: ' Short Shuttle Top Speed',
      metricColumnLabel: 'Short Shutt...',
      showTimeColumn: true,
      rows: mapShuttleTopSpeedRows(
        shuttleTopSpeed2026 as ShuttleTopSpeedRecord[],
      ),
    },
    {
      id: 'skill-drills',
      viewLabel: 'VIEW SKILL DRILL METRICS:',
      dropdownOptions: [
        { value: 'wr-gauntlet', label: 'WR Gauntlet Drill' },
        { value: 'db-gauntlet', label: 'DB Gauntlet Drill' },
      ],
      defaultDropdownValue: 'wr-gauntlet',
      titleBold: 'Skill Drills',
      titleRest: ' WR Gauntlet Drill Top Speed',
      metricColumnLabel: 'MPH',
      showTimeColumn: false,
      rows: skillDrillRows,
    },
  ],
}

export const COMBINE_TRACKING_YEARS = ['All', '2023', '2024', '2025', '2026'] as const
export const COMBINE_TRACKING_POSITIONS = [
  'ALL',
  'QB',
  'RB',
  'WR',
  'TE',
  'T',
  'G',
  'C',
  'DT',
  'ED',
  'LB',
  'CB',
  'S',
] as const
