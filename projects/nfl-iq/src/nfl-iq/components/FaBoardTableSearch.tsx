import './fa-board-table-search.css'

type FaBoardTableSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  'aria-label'?: string
}

export function FaBoardTableSearch({
  value,
  onChange,
  placeholder = 'Search players…',
  'aria-label': ariaLabel = 'Search table',
}: FaBoardTableSearchProps) {
  const hasValue = value.length > 0

  return (
    <div className="fa-board__search">
      <svg
        className="fa-board__search-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
          fill="currentColor"
        />
      </svg>
      <input
        type="search"
        className="fa-board__search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
      {hasValue ? (
        <button
          type="button"
          className="fa-board__search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <svg
            className="fa-board__search-clear-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"
              fill="currentColor"
            />
          </svg>
        </button>
      ) : null}
    </div>
  )
}
