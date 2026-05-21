import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { fetchTeam } from '../api'
import { TeamCentralCharts } from '../components/TeamCentralCharts'
import { TeamCentralSummaryPanel } from '../components/TeamCentralSummaryPanel'
import type { TeamNeed } from '../types'
import { buildFallbackTeam } from '../data/team-fallback'
import { useIqTeam } from '../context/useIqTeam'
import { TEAM_TOUR_QUERY } from '../solution-showcase/team-tour-nav'
import type { Team } from '../types'
import './team-central.css'

export function TeamCentralPage() {
  const { pathname } = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedTeamId, teamCentralActivated, activateTeamCentral, selectTeam } =
    useIqTeam()
  const [team, setTeam] = useState<Team | null>(null)
  const [needs, setNeeds] = useState<TeamNeed[]>([])

  useEffect(() => {
    if (pathname.startsWith('/teams')) {
      activateTeamCentral()
    }
  }, [pathname, activateTeamCentral])

  useEffect(() => {
    const teamId = searchParams.get(TEAM_TOUR_QUERY)
    if (!teamId || !pathname.startsWith('/teams')) return

    selectTeam(teamId)
    // Defer clearing the param so tour navigation can land on /teams?team=TEN first.
    const timer = window.setTimeout(() => {
      setSearchParams(
        (prev) => {
          if (!prev.get(TEAM_TOUR_QUERY)) return prev
          const next = new URLSearchParams(prev)
          next.delete(TEAM_TOUR_QUERY)
          return next
        },
        { replace: true },
      )
    }, 0)
    return () => window.clearTimeout(timer)
  }, [pathname, searchParams, selectTeam, setSearchParams])

  useEffect(() => {
    if (!selectedTeamId) return
    setTeam(null)
    setNeeds([])

    void fetchTeam(selectedTeamId)
      .then((data) => {
        setTeam(data.team)
        setNeeds(data.needs)
      })
      .catch(() => {
        setTeam(buildFallbackTeam(selectedTeamId))
        setNeeds([])
      })
  }, [selectedTeamId])

  const displayTeam = useMemo(
    () =>
      selectedTeamId ? (team ?? buildFallbackTeam(selectedTeamId)) : null,
    [selectedTeamId, team],
  )

  if (!teamCentralActivated || !selectedTeamId) {
    return (
      <p className="iq-loading team-central-loading">
        Select a team above to open Team Central.
      </p>
    )
  }

  return (
    <div className="team-central-page">
      {displayTeam && (
        <TeamCentralSummaryPanel
          teamId={selectedTeamId}
          team={displayTeam}
          needs={needs}
        />
      )}

      {displayTeam && <TeamCentralCharts teamId={selectedTeamId} />}
    </div>
  )
}
