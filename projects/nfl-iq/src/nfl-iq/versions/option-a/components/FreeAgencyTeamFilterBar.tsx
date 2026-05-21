import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../../../constants'
import { NFL_DIVISIONS, getDivisionIndex } from '../data/nfl-divisions'
import './free-agency-team-filter.css'

type FreeAgencyTeamFilterBarProps = {
  selectedTeamId: string | null
  onSelectTeam: (teamId: string | null) => void
  /** When true, clicking the active team clears selection */
  allowDeselect?: boolean
}

export function FreeAgencyTeamFilterBar({
  selectedTeamId,
  onSelectTeam,
  allowDeselect = false,
}: FreeAgencyTeamFilterBarProps) {
  const activeDivisionIndex =
    selectedTeamId != null ? getDivisionIndex(selectedTeamId) : -1

  return (
    <div
      className="fa-team-filter"
      role="toolbar"
      aria-label="Filter by NFL team division"
    >
      <div className="fa-team-filter__scroll team-picker-scroll">
        {NFL_DIVISIONS.map((division, divisionIndex) => {
          const isDivisionHighlighted = divisionIndex === activeDivisionIndex

          return (
            <div
              key={division.join('-')}
              className={
                isDivisionHighlighted
                  ? 'fa-team-filter__division fa-team-filter__division--highlight'
                  : 'fa-team-filter__division'
              }
            >
              {division.map((teamId) => {
                const team = ALL_NFL_TEAMS.find((t) => t.id === teamId)
                const isSelected = teamId === selectedTeamId

                return (
                  <button
                    key={teamId}
                    type="button"
                    className={
                      isSelected
                        ? 'fa-team-filter__team fa-team-filter__team--selected'
                        : 'fa-team-filter__team'
                    }
                    {...(teamId === 'TEN'
                      ? { 'data-solution-tour': 'team-filter-ten' }
                      : teamId === 'IND'
                        ? { 'data-solution-tour': 'team-filter-ind' }
                        : {})}
                    aria-pressed={isSelected}
                    aria-label={team?.name ?? teamId}
                    title={team?.name ?? teamId}
                    onClick={() => {
                      if (allowDeselect && isSelected) {
                        onSelectTeam(null)
                      } else {
                        onSelectTeam(teamId)
                      }
                    }}
                  >
                    <span
                      className={
                        isSelected
                          ? 'fa-team-filter__team-ring fa-team-filter__team-ring--selected'
                          : 'fa-team-filter__team-ring'
                      }
                      aria-hidden
                    >
                      <span
                        className={
                          isSelected
                            ? 'fa-team-filter__team-core fa-team-filter__team-core--selected'
                            : 'fa-team-filter__team-core'
                        }
                      >
                        <img
                          className="fa-team-filter__logo"
                          src={ngsTeamLogoUrl(teamId)}
                          alt=""
                        />
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
