import { useEffect, useId, useRef, useState } from 'react'
import {
  CHART_COMPARISON_OPTIONS,
  type ChartComparisonId,
  getChartComparisonOption,
} from './chart-comparison-options'

type DraftCentralTestChartComparisonMenuProps = {
  value: ChartComparisonId
  onChange: (id: ChartComparisonId) => void
}

export function DraftCentralTestChartComparisonMenu({
  value,
  onChange,
}: DraftCentralTestChartComparisonMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = getChartComparisonOption(value)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div
      ref={rootRef}
      className="draft-test__chart-menu"
      data-solution-tour="chart-comparison"
    >
      <button
        type="button"
        className="draft-test__chart-menu-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className="draft-test__table-title"
          {...(value === 'ath-prod'
            ? { 'data-solution-tour': 'chart-comparison-ath-prod-label' }
            : {})}
        >
          {selected.label}
        </span>
        <svg
          className={`draft-test__chart-menu-chevron${open ? ' draft-test__chart-menu-chevron--open' : ''}`}
          viewBox="0 0 12 12"
          aria-hidden
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul id={listId} className="draft-test__chart-menu-list" role="listbox">
          {CHART_COMPARISON_OPTIONS.map((option) => {
            const isSelected = option.id === value
            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={
                    isSelected
                      ? 'draft-test__chart-menu-option draft-test__chart-menu-option--selected'
                      : 'draft-test__chart-menu-option'
                  }
                  onClick={() => {
                    onChange(option.id)
                    setOpen(false)
                  }}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
