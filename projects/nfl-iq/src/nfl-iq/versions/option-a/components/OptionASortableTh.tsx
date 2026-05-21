import { TableColCell } from '../../../components/TableColCell'
import './option-a-sortable-table.css'

export type OptionASortDirection = 'asc' | 'desc'

type OptionASortableThProps = {
  label: string
  sortKey: string
  activeKey: string
  direction: OptionASortDirection
  onSort: (key: string) => void
  /** Alpha: sort A-Z / Z-A */
  sortVariant?: 'numeric' | 'alpha'
  className?: string
  /** Center label over centered cell content (e.g. school logos) */
  align?: 'left' | 'center'
  /**
   * Center label + sort icon as one tight group in the cell (icon beside label;
   * no ::before optical balance).
   */
  groupCenter?: boolean
  /** Match rows with injury/diamond prefix in the first column */
  leadingGutter?: boolean
}

function SortIcon({ direction }: { direction: OptionASortDirection }) {
  return (
    <svg
      className={
        direction === 'desc'
          ? 'fa-table-sort__icon fa-table-sort__icon--desc'
          : 'fa-table-sort__icon'
      }
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M11 18V8.8L7.4 12.4L6 11L12 5L18 11L16.6 12.4L13 8.8V18H11Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function OptionASortableTh({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  sortVariant = 'numeric',
  className,
  align = 'left',
  groupCenter = false,
  leadingGutter = false,
}: OptionASortableThProps) {
  const isActive = activeKey === sortKey
  const centered = align === 'center'
  const cellCenter = centered || groupCenter

  return (
    <th
      scope="col"
      className={[
        className,
        centered ? 'fa-table-sort-th--center' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-sort={
        isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <TableColCell center={cellCenter}>
        <button
          type="button"
          className={[
            'fa-table-sort',
            isActive ? 'fa-table-sort--active' : undefined,
            centered ? 'fa-table-sort--center' : undefined,
            groupCenter ? 'fa-table-sort--group-center' : undefined,
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => onSort(sortKey)}
          aria-label={
            isActive
              ? sortVariant === 'alpha'
                ? `${label}, sorted ${direction === 'asc' ? 'A to Z' : 'Z to A'}`
                : `${label}, sorted ${direction === 'asc' ? 'ascending' : 'descending'}`
              : `Sort by ${label}`
          }
        >
          {leadingGutter ? (
            <span className="fa-table-sort__gutter" aria-hidden />
          ) : null}
          <span className="fa-table-sort__content">
            <span className="fa-table-sort__label">{label}</span>
            <span className="fa-table-sort__icon-slot" aria-hidden>
              {isActive ? <SortIcon direction={direction} /> : null}
            </span>
          </span>
        </button>
      </TableColCell>
    </th>
  )
}
