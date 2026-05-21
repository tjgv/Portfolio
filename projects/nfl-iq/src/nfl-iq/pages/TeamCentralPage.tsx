import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchTeam } from '../api'
import { TeamCentralCharts } from '../components/TeamCentralCharts'
import { TeamCentralHeader } from '../components/TeamCentralHeader'
import { buildFallbackTeam } from '../data/team-fallback'
import { useIqTeam } from '../context/useIqTeam'
import type { Team } from '../types'
import './team-central.css'

export function TeamCentralPage() {
  const { pathname } = useLocation()
  const { selectedTeamId, teamCentralActivated, activateTeamCentral } = useIqTeam()
  const [team, setTeam] = useState<Team | null>(null)

  useEffect(() => {
    if (pathname.startsWith('/teams')) {
      activateTeamCentral()
    }
  }, [pathname, activateTeamCentral])

  useEffect(() => {
    if (!selectedTeamId) return
    setTeam(null)

    void fetchTeam(selectedTeamId)
      .then((data) => {
        setTeam(data.team)
      })
      .catch(() => {
        setTeam(buildFallbackTeam(selectedTeamId))
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
        <TeamCentralHeader teamId={selectedTeamId} team={displayTeam} />
      )}

      {displayTeam && <TeamCentralCharts teamId={selectedTeamId} />}
    </div>
  )
}
