import { FaBoardTableSearch } from '../../../components/FaBoardTableSearch'

type DraftCentralTestTableHeadProps = {
  title: string
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  searchAriaLabel?: string
}

export function DraftCentralTestTableHead({
  title,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search players…',
  searchAriaLabel = 'Search table',
}: DraftCentralTestTableHeadProps) {
  return (
    <header className="draft-test__table-head">
      <h2 className="draft-test__table-title">{title}</h2>
      <FaBoardTableSearch
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        aria-label={searchAriaLabel}
      />
    </header>
  )
}
