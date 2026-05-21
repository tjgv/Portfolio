import { TableColCell } from '../../../components/TableColCell'
import type { FreeAgencyNeedIndicator } from '../data/free-agency-team-needs'
import './option-a-free-agency-need.css'

type FreeAgencyNeedCellProps = {
  indicator: FreeAgencyNeedIndicator
}

export function FreeAgencyNeedCell({ indicator }: FreeAgencyNeedCellProps) {
  return (
    <td className="fa-board__td fa-board__td--need">
      <TableColCell center>
        {indicator === 'check' ? (
          <span className="fa-board__need-check" aria-label="Matches a team need">
            ✓
          </span>
        ) : indicator === 'star' ? (
          <span className="fa-board__need-star" aria-label="Matches multiple team needs">
            ★
          </span>
        ) : null}
      </TableColCell>
    </td>
  )
}
