import { TableColCell } from '../../../components/TableColCell'
import {
  getFreeAgencyNeedIndicator,
  getFreeAgencyNeedTooltip,
} from '../data/free-agency-team-needs'
import './option-a-free-agency-need.css'

type FreeAgencyNeedCellProps = {
  alignment: string
  teamId: string
}

export function FreeAgencyNeedCell({ alignment, teamId }: FreeAgencyNeedCellProps) {
  const indicator = getFreeAgencyNeedIndicator(alignment, teamId)
  const tooltip = getFreeAgencyNeedTooltip(alignment, teamId)

  return (
    <td
      className={`fa-board__td fa-board__td--need${
        indicator !== 'none' ? ` fa-board__td--need-${indicator}` : ''
      }`}
    >
      <TableColCell center>
        {indicator !== 'none' ? (
          <span
            className="fa-board__need-marker"
            title={tooltip}
            aria-label={tooltip}
          />
        ) : (
          <span className="fa-board__need-empty" title={tooltip} aria-label={tooltip} />
        )}
      </TableColCell>
    </td>
  )
}
