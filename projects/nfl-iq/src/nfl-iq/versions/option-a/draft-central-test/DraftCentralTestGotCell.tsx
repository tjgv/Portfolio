import { ngsTeamLogoUrl } from '../../../constants'
import { TableColCell } from '../../../components/TableColCell'
import '../components/option-a-draft-central-need.css'

type DraftCentralTestGotCellProps = {
  teamId: string | null
}

export function DraftCentralTestGotCell({ teamId }: DraftCentralTestGotCellProps) {
  return (
    <td className="draft-board__td draft-board__td--got">
      <TableColCell center>
        <span className="draft-board__team-logo-wrap">
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
