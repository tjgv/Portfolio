import '../../../components/big-board.css'
import { useIqTeam } from '../../../context/useIqTeam'
import { OptionABigBoardTable } from './OptionABigBoardTable'
import './option-a-big-board.css'
import './option-a-big-board-team-view.css'

const DEFAULT_TEAM_ID = 'NE'

export function OptionABigBoardBoard() {
  const { selectedTeamId } = useIqTeam()
  const teamViewActive = selectedTeamId != null
  const teamId = selectedTeamId ?? DEFAULT_TEAM_ID

  return (
    <div className="draft-board draft-board--option-a">
      <div className="draft-board__primary-wrap draft-board__primary-wrap--big-board">
        <div className="draft-board__primary-card draft-board__primary-card--big-board">
          <OptionABigBoardTable
            teamViewActive={teamViewActive}
            teamId={teamId}
          />
        </div>
      </div>
    </div>
  )
}
