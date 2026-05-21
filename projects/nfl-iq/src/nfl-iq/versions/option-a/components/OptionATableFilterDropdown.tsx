import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { TableColCell } from '../../../components/TableColCell'
import './option-a-table-filter-dropdown.css'

type OptionATableFilterDropdownProps = {
  label: string
  options: string[]
  selected: Set<string>
  onSelectedChange: (next: Set<string>) => void
  /** Table header class (e.g. draft-board__th) so column matches other headers */
  className?: string
}

export function OptionATableFilterDropdown({
  label,
  options,
  selected,
  onSelectedChange,
  className,
}: OptionATableFilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({})
  const rootRef = useRef<HTMLTableCellElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const hasSelection = selected.size > 0

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + 2,
        left: rect.left,
        minWidth: Math.max(rect.width, 120),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !rootRef.current?.contains(target) &&
        !(event.target as Element).closest?.('.fa-table-filter-menu')
      ) {
        setOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const toggleOption = (option: string) => {
    const next = new Set(selected)
    if (next.has(option)) next.delete(option)
    else next.add(option)
    onSelectedChange(next)
  }

  return (
    <th
      ref={rootRef}
      scope="col"
      className={[
        'fa-table-filter-th',
        hasSelection ? 'fa-table-filter-th--active' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <TableColCell>
        <button
          ref={triggerRef}
          type="button"
          className={
            open
              ? 'fa-table-filter-trigger fa-table-filter-trigger--open'
              : 'fa-table-filter-trigger'
          }
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <span>{label}</span>
        </button>
      </TableColCell>

      {open ? (
        <div
          id={menuId}
          className="fa-table-filter-menu"
          style={menuStyle}
          role="listbox"
          aria-label={`${label} filter`}
          aria-multiselectable
        >
          <div className="fa-table-filter-menu__banner">
            {hasSelection ? (
              <button
                type="button"
                className="fa-table-filter-menu__show-all"
                onClick={() => onSelectedChange(new Set())}
              >
                show all
              </button>
            ) : (
              <span className="fa-table-filter-menu__note">displaying all</span>
            )}
          </div>
          <ul className="fa-table-filter-menu__list">
            {options.map((option) => {
              const checked = selected.has(option)
              return (
                <li key={option}>
                  <label className="fa-table-filter-menu__option">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleOption(option)}
                    />
                    <span>{option}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </th>
  )
}
