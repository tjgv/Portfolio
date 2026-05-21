import { useLocation } from 'react-router-dom'
import { useIqTeam } from '../context/useIqTeam'
import { FreeAgencyTeamFilterBar } from '../versions/option-a/components/FreeAgencyTeamFilterBar'
import '../versions/option-a/components/free-agency-team-filter.css'
import '../versions/option-a/components/option-a-team-filter-strip.css'

export function TeamPicker() {
  const { pathname } = useLocation()
  const { selectedTeamId, teamCentralActivated, selectTeam } = useIqTeam()

  if (!pathname.startsWith('/teams') || !teamCentralActivated || !selectedTeamId) {
    return null
  }

  return (
    <div
      id="quicksuite-team-picker"
      className="quicksuite-team-picker option-a-team-filter-strip"
    >
      <div className="iq-page-inner quicksuite-team-picker__inner option-a-team-filter-strip__inner">
        <FreeAgencyTeamFilterBar
          selectedTeamId={selectedTeamId}
          onSelectTeam={(teamId) => {
            if (teamId) selectTeam(teamId)
          }}
        />
      </div>
    </div>
  )
}
