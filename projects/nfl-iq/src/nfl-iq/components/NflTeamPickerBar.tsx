import { useMemo } from 'react'
import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'

export type NflTeamPickerBarProps = {
  selectedTeamId: string | null
  onSelectTeam: (teamId: string | null) => void
  /** When true, clicking the active team clears selection */
  allowDeselect?: boolean
}

export function NflTeamPickerBar({
  selectedTeamId,
  onSelectTeam,
  allowDeselect = false,
}: NflTeamPickerBarProps) {
  const sortedTeams = useMemo(
    () => [...ALL_NFL_TEAMS].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  return (
    <div className="team-picker-scroll" role="radiogroup" aria-label="Select team">
      {sortedTeams.map((team) => {
        const isActive = team.id === selectedTeamId
        return (
          <button
            key={team.id}
            type="button"
            className={`team-picker-item${isActive ? ' active' : ''}`}
            data-team={team.id}
            title={team.name}
            role="radio"
            aria-checked={isActive}
            aria-label={team.name}
            tabIndex={isActive ? 0 : -1}
            onClick={() => {
              if (allowDeselect && isActive) {
                onSelectTeam(null)
              } else {
                onSelectTeam(team.id)
              }
            }}
          >
            <img
              src={ngsTeamLogoUrl(team.id)}
              alt=""
              className="team-picker-logo loaded"
            />
          </button>
        )
      })}
    </div>
  )
}
