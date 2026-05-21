import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import hoverPreviewImage from '../../../assets/draft-hover-preview.png'
import './draft-central-hover-preview.css'

/** Static hover-card screenshot on the prospect profile (expandable). */
export function DraftProspectPlayStyleHomePanel() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  return (
    <>
      <button
        type="button"
        className="draft-hover-preview__shot draft-prospect-play-style-home__shot"
        aria-label="Expand play style comparison full screen"
        onClick={() => setExpanded(true)}
      >
        <img
          className="draft-hover-preview__img"
          src={hoverPreviewImage}
          alt="Play style comparison with archetype percentiles and top comps"
        />
      </button>

      {expanded
        ? createPortal(
            <div
              className="draft-hover-preview-fs"
              role="dialog"
              aria-modal="true"
              aria-label="Play style comparison full screen"
              onClick={() => setExpanded(false)}
            >
              <button
                type="button"
                className="draft-hover-preview-fs__close"
                aria-label="Close full screen preview"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(false)
                }}
              >
                ×
              </button>
              <img
                className="draft-hover-preview-fs__img"
                src={hoverPreviewImage}
                alt=""
                onClick={(e) => e.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
