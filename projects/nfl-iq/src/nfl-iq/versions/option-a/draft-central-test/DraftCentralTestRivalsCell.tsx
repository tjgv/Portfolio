import { ngsTeamLogoUrl } from '../../../constants'
import { TableColCell } from '../../../components/TableColCell'
import '../components/option-a-draft-central-need.css'

type DraftCentralTestRivalsCellProps = {
  teamId: string | null
  tourAnchor?: boolean
}

export function DraftCentralTestRivalsCell({
  teamId,
  tourAnchor = false,
}: DraftCentralTestRivalsCellProps) {
  return (
    <td className="draft-board__td draft-board__td--rivals">
      <TableColCell center>
        <span
          className="draft-board__team-logo-wrap"
          {...(tourAnchor && teamId
            ? { 'data-solution-tour': 'draft-scorecard-got-rivals-logo' }
            : {})}
        >
          {teamId ? (
            <img
              className="draft-board__team-logo"
              src={ngsTeamLogoUrl(teamId)}
              alt=""
              title={teamId}
            />
          ) : null}
        </span>
      </TableColCell>
    </td>
  )
}
