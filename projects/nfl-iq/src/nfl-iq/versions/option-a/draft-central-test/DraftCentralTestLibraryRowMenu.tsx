type DraftCentralTestLibraryRowMenuProps = {
  prospectName: string
  onOpenProspect: () => void
}

export function DraftCentralTestLibraryRowMenu({
  prospectName,
  onOpenProspect,
}: DraftCentralTestLibraryRowMenuProps) {
  return (
    <div className="draft-test__library-row-menu draft-test__library-row-menu--visible">
      <button
        type="button"
        className="draft-test__library-row-menu-trigger"
        aria-label={`View ${prospectName} prospect profile`}
        onClick={(e) => {
          e.stopPropagation()
          onOpenProspect()
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
          className="draft-test__library-row-menu-icon draft-test__library-row-menu-icon--forward"
        >
          <path
            d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  )
}
