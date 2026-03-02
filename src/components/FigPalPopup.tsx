import { useEffect } from 'react'
import { FigPalCharacterBuilder } from './FigPalCharacterBuilder'
import type { FigPalFollowState, FigPalBuilderState } from './FigPalCharacterBuilder'

export default function FigPalPopup({
  onClose,
  onFollowMouseChange,
  initialState,
  onStateChange,
}: {
  onClose: () => void
  onFollowMouseChange: (state: FigPalFollowState) => void
  initialState?: FigPalBuilderState | null
  onStateChange?: (state: FigPalBuilderState) => void
}) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  return (
    <div
      className="home-v2-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="FigPal character builder"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="home-v2-popup home-v2-popup--figpal" onClick={(e) => e.stopPropagation()}>
        <nav className="home-v2-popup-nav" aria-label="Preview actions">
          <span className="home-v2-popup-figpal-title">FigPal</span>
          <button
            type="button"
            className="home-v2-popup-close"
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </nav>
        <div className="home-v2-popup-scroll home-v2-popup-scroll--figpal">
          <FigPalCharacterBuilder
            onClose={onClose}
            onFollowMouseChange={onFollowMouseChange}
            initialState={initialState}
            onStateChange={onStateChange}
          />
        </div>
      </div>
    </div>
  )
}
