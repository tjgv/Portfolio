import { useNavigate, useSearchParams } from 'react-router-dom'
import './draft-subnav.css'

export const DRAFT_SUBVIEWS = [
  { id: 'draft-central', label: 'Draft Central', path: '/draft' as const },
  {
    id: 'cheat-sheet',
    label: 'Cheat Sheet',
    path: '/draft' as const,
    view: 'cheat-sheet' as const,
  },
  {
    id: 'big-board',
    label: 'Big Board',
    path: '/draft' as const,
    view: 'big-board' as const,
  },
  {
    id: 'combine-tracking',
    label: 'Combine Tracking',
    path: '/draft' as const,
    view: 'combine-tracking' as const,
  },
] as const

export type DraftSubView = (typeof DRAFT_SUBVIEWS)[number]['id']

export function parseDraftSubView(search: URLSearchParams): DraftSubView {
  const raw = search.get('view')
  if (raw && DRAFT_SUBVIEWS.some((v) => v.id === raw)) {
    return raw as DraftSubView
  }
  return 'draft-central'
}

export function DraftSubnav() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const active = parseDraftSubView(searchParams)

  const select = (id: DraftSubView) => {
    const item = DRAFT_SUBVIEWS.find((v) => v.id === id)
    if (!item) return

    if ('view' in item && item.view) {
      navigate(`/draft?view=${item.view}`)
      return
    }

    navigate('/draft', { replace: false })
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
