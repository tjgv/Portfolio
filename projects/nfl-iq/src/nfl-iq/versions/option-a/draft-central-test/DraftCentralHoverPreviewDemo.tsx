import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import hoverPreviewImage from '../../../assets/draft-hover-preview.png'
import './draft-central-hover-preview.css'

const CARD_WIDTH_PX = 520

type DraftCentralHoverPreviewDemoProps = {
  visible: boolean
}

export function DraftCentralHoverPreviewDemo({
  visible,
}: DraftCentralHoverPreviewDemoProps) {
  const [expanded, setExpanded] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  )

  const measure = useCallback((): (() => void) | void => {
    const row = document.querySelector<HTMLElement>(
      '[data-solution-tour="draft-scorecard-hover-row"]',
    )
    if (!row) {
      setPosition(null)
      return
    }
    const rect = row.getBoundingClientRect()
    setPosition({
      top: rect.top - 10,
      left: rect.left + rect.width / 2 - CARD_WIDTH_PX / 2,
    })
    row.classList.add('draft-scorecard-hover-row--preview-active')
    return () => {
      row.classList.remove('draft-scorecard-hover-row--preview-active')
    }
  }, [])

  useLayoutEffect(() => {
    if (!visible) {
      setPosition(null)
      setExpanded(false)
      document
        .querySelectorAll('.draft-scorecard-hover-row--preview-active')
        .forEach((el) => el.classList.remove('draft-scorecard-hover-row--preview-active'))
      return
    }

    let cleanupRowClass = measure()
    const onReflow = () => {
      cleanupRowClass?.()
      cleanupRowClass = measure()
    }
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      cleanupRowClass?.()
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [visible, measure])

  useEffect(() => {
    if (!visible) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, expanded])

  if (!visible || !position) return null

  return createPortal(
    <>
      <div
        className="draft-hover-preview"
        style={{
          top: position.top,
          left: Math.max(
            12,
            Math.min(position.left, window.innerWidth - CARD_WIDTH_PX - 12),
          ),
          width: CARD_WIDTH_PX,
        }}
        role="presentation"
      >
        <button
          type="button"
          className="draft-hover-preview__shot"
          aria-label="Expand hover preview full screen"
          onClick={() => setExpanded(true)}
        >
          <img
            className="draft-hover-preview__img"
            src={hoverPreviewImage}
            alt="Play style comparison hover card with archetype percentiles and top comps"
          />
        </button>
      </div>

      {expanded ? (
        <div
          className="draft-hover-preview-fs"
          role="dialog"
          aria-modal="true"
          aria-label="Hover preview full screen"
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
        </div>
      ) : null}
    </>,
    document.body,
  )
}
