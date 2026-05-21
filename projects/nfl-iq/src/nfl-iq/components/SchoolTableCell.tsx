import { TableColCell } from './TableColCell'
import './school-table-cell.css'

export type SchoolTableCellProps = {
  schoolAbbr: string
  schoolLogoUrl?: string | null
  className?: string
}

/** School column: logo only (no college name text). */
export function SchoolTableCell({
  schoolAbbr,
  schoolLogoUrl,
  className,
}: SchoolTableCellProps) {
  const abbr = schoolAbbr.trim()

  return (
    <td className={['school-table-cell', className].filter(Boolean).join(' ')}>
      <TableColCell center>
        <span className="school-table-cell__wrap">
          {schoolLogoUrl ? (
            <img
              className="school-table-cell__logo"
              src={schoolLogoUrl}
              alt=""
              title={abbr}
            />
          ) : abbr ? (
            <span className="school-table-cell__fallback" aria-hidden>
              {abbr.slice(0, 2).toUpperCase()}
            </span>
          ) : null}
        </span>
      </TableColCell>
    </td>
  )
}
