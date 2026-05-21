import type { ReactNode } from 'react'
import './iq-table-col-cell.css'

type TableColCellProps = {
  children: ReactNode
  /** Horizontal center (e.g. school logos) */
  center?: boolean
  as?: 'span' | 'div'
  className?: string
}

/** Full-height column shell — fills cell from top to row border, centers content */
export function TableColCell({
  children,
  center = false,
  as: Tag = 'div',
  className,
}: TableColCellProps) {
  return (
    <Tag
      className={[
        'iq-table-col-cell',
        center ? 'iq-table-col-cell--center' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  )
}
