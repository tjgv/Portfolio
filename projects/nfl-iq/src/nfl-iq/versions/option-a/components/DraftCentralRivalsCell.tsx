import { ngsTeamLogoUrl } from '../../../constants'
import { TableColCell } from '../../../components/TableColCell'
import './option-a-draft-central-need.css'

type DraftCentralRivalsCellProps = {
  teamId: string | null
}

export function DraftCentralRivalsCell({ teamId }: DraftCentralRivalsCellProps) {
  return (
    <td className="draft-board__td draft-board__td--rivals">
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
