export const TEAM_TOUR_QUERY = 'team'

export function teamTourSearch(teamId: string): string {
  const params = new URLSearchParams()
  params.set(TEAM_TOUR_QUERY, teamId.toUpperCase())
  return `?${params.toString()}`
}

export function draftCentralTeamTourSearch(teamId: string): string {
  const params = new URLSearchParams()
  params.set(TEAM_TOUR_QUERY, teamId.toUpperCase())
  return `?${params.toString()}`
}

export function freeAgencyTeamTourSearch(teamId: string): string {
  return teamTourSearch(teamId)
}

export function draftBigBoardTeamTourSearch(teamId: string): string {
  const params = new URLSearchParams()
  params.set('view', 'big-board')
  params.set(TEAM_TOUR_QUERY, teamId.toUpperCase())
  return `?${params.toString()}`
}
