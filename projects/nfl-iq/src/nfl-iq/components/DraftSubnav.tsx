import { useSearchParams } from 'react-router-dom'
import './draft-subnav.css'

export const DRAFT_SUBVIEWS = [
  { id: 'draft-central', label: 'Draft Central' },
  { id: 'cheat-sheet', label: 'Cheat Sheet' },
  { id: 'big-board', label: 'Big Board' },
  { id: 'combine-tracking', label: 'Combine Tracking' },
] as const

export type DraftSubView = (typeof DRAFT_SUBVIEWS)[number]['id']

export function parseDraftSubView(search: URLSearchParams): DraftSubView {
  const raw = search.get('view')
  if (
    raw &&
    DRAFT_SUBVIEWS.some((v) => v.id === raw)
  ) {
    return raw as DraftSubView
  }
  return 'draft-central'
}

export function DraftSubnav() {
  const [searchParams, setSearchParams] = useSearchParams()
  const active = parseDraftSubView(searchParams)

  const select = (id: DraftSubView) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id === 'draft-central') {
          next.delete('view')
        } else {
          next.set('view', id)
        }
        return next
      },
      { replace: true },
    )
  }

  return (
    <div className="draft-subnav">
      <div className="iq-page-inner draft-subnav__inner">
        <nav className="draft-subnav__pills" aria-label="NFL Draft views">
          {DRAFT_SUBVIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={
                active === item.id
                  ? 'draft-subnav__pill draft-subnav__pill--active'
                  : 'draft-subnav__pill'
              }
              aria-pressed={active === item.id}
              onClick={() => select(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
