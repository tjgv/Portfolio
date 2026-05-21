import type { Team } from '../types'

export type TeamStaffColumn = {
  roleLabel: string
  name: string
}

export type TeamCentralProfile = {
  recordLine: string
  staff: TeamStaffColumn[]
}

const TEAM_PROFILES: Partial<Record<string, TeamCentralProfile>> = {
  BUF: {
    recordLine: '2025 RECORD 12-5, 2ND IN AFC EAST (LOST IN DIVISIONAL)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2017)', name: 'BRANDON BEANE' },
      { roleLabel: 'HEAD COACH (SINCE 2017)', name: 'SEAN McDERMOTT' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2024)', name: 'JOE BRADY' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2024)', name: 'BOBBY BABICH' },
    ],
  },
  SEA: {
    recordLine: '2025 RECORD 14-3, 1ST IN NFC WEST (LOST IN DIVISIONAL)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2010)', name: 'JOHN SCHNEIDER' },
      { roleLabel: 'HEAD COACH (SINCE 2024)', name: 'MIKE MacDONALD' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2024)', name: 'RYAN GRUBB' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2024)', name: 'MIKE MacDONALD' },
    ],
  },
  KC: {
    recordLine: '2025 RECORD 12-5, 2ND IN AFC WEST (LOST IN WILD CARD)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2017)', name: 'BRETT VEACH' },
      { roleLabel: 'HEAD COACH (SINCE 2013)', name: 'ANDY REID' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2018)', name: 'MATT NAGY' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2023)', name: 'STEVE SPAGNUOLO' },
    ],
  },
  DET: {
    recordLine: '2025 RECORD 13-4, 1ST IN NFC NORTH (LOST IN CONFERENCE)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2022)', name: 'BRAD HOLMES' },
      { roleLabel: 'HEAD COACH (SINCE 2021)', name: 'DAN CAMPBELL' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2022)', name: 'BEN JOHNSON' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2022)', name: 'AARON GLENN' },
    ],
  },
  PHI: {
    recordLine: '2025 RECORD 11-6, 2ND IN NFC EAST (LOST IN WILD CARD)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2016)', name: 'HOWIE ROSEMAN' },
      { roleLabel: 'HEAD COACH (SINCE 2024)', name: 'NICK SIRIANNI' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2024)', name: 'KEVIN PATULLO' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2022)', name: 'VIC FANGIO' },
    ],
  },
  BAL: {
    recordLine: '2025 RECORD 12-5, 1ST IN AFC NORTH (LOST IN CONFERENCE)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2012)', name: 'ERIC DeCOSTA' },
      { roleLabel: 'HEAD COACH (SINCE 2008)', name: 'JOHN HARBAUGH' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2023)', name: 'TODD MONKEN' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2023)', name: 'MIKE MacDONALD' },
    ],
  },
  SF: {
    recordLine: '2025 RECORD 10-7, 3RD IN NFC WEST (MISSED PLAYOFFS)',
    staff: [
      { roleLabel: 'GENERAL MANAGER (SINCE 2017)', name: 'JOHN LYNCH' },
      { roleLabel: 'HEAD COACH (SINCE 2017)', name: 'KYLE SHANAHAN' },
      { roleLabel: 'OFF. COORDINATOR (SINCE 2021)', name: 'KYLE SHANAHAN' },
      { roleLabel: 'DEF. COORDINATOR (SINCE 2022)', name: 'NICK SORENSEN' },
    ],
  },
}

function defaultStaff(teamName: string): TeamStaffColumn[] {
  const city = teamName.replace(/ (Cardinals|Falcons|Ravens|Bills|Panthers|Bears|Bengals|Browns|Cowboys|Broncos|Lions|Packers|Texans|Colts|Jaguars|Chiefs|Chargers|Rams|Raiders|Dolphins|Vikings|Patriots|Saints|Giants|Jets|Eagles|Steelers|Seahawks|49ers|Buccaneers|Titans|Commanders)$/i, '')
  return [
    { roleLabel: 'GENERAL MANAGER', name: `${city.toUpperCase()} GM` },
    { roleLabel: 'HEAD COACH', name: `${city.toUpperCase()} HC` },
    { roleLabel: 'OFF. COORDINATOR', name: `${city.toUpperCase()} OC` },
    { roleLabel: 'DEF. COORDINATOR', name: `${city.toUpperCase()} DC` },
  ]
}

function formatRecord(team: Team): string {
  const losses = Math.max(0, 17 - team.wins)
  return `2025 RECORD ${team.wins}-${losses}, ${team.conference.toUpperCase()} ${team.division.toUpperCase()}`
}

export function getTeamCentralProfile(
  teamId: string,
  team: Team,
): TeamCentralProfile {
  const custom = TEAM_PROFILES[teamId]
  if (custom) return custom
  return {
    recordLine: formatRecord(team),
    staff: defaultStaff(team.name),
  }
}
