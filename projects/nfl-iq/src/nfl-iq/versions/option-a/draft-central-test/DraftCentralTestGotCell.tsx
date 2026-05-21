import { ngsTeamLogoUrl } from '../../../constants'
import { TableColCell } from '../../../components/TableColCell'
import '../components/option-a-draft-central-need.css'

type DraftCentralTestGotCellProps = {
  teamId: string | null
  tourAnchor?: boolean
}

export function DraftCentralTestGotCell({
  teamId,
  tourAnchor = false,
}: DraftCentralTestGotCellProps) {
  return (
    <td className="draft-board__td draft-board__td--got">
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
