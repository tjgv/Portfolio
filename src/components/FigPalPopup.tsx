import { useCallback, useEffect, useRef, useState } from 'react'
import { FigPalCharacterBuilder, FigPalFollowMeToggle } from './FigPalCharacterBuilder'
import type {
  FigPalFollowState,
  FigPalBuilderState,
  FigPalSidebarContext,
} from './FigPalCharacterBuilder'

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
  const [maximized, setMaximized] = useState(false)
  const [minimizing, setMinimizing] = useState(false)
  const minimizeDoneRef = useRef(false)

  const runMinimizeClose = useCallback(() => {
    if (minimizing) return
    minimizeDoneRef.current = false
    setMinimizing(true)
  }, [minimizing])

  const handleMinimizeAnimationEnd = useCallback(
    (e: React.AnimationEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return
      if (!e.animationName.includes('figpal-window-minimize')) return
      if (!minimizing || minimizeDoneRef.current) return
      minimizeDoneRef.current = true
      onClose()
    },
    [minimizing, onClose]
  )

  const toggleMaximize = useCallback(() => {
    setMaximized((v) => !v)
  }, [])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (minimizing) return
      runMinimizeClose()
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [minimizing, runMinimizeClose])

  const backdropClass = [
    'home-v2-popup-backdrop',
    'home-v2-popup-backdrop--figpal',
    maximized && 'home-v2-popup-backdrop--figpal-maximized',
    minimizing && 'home-v2-popup-backdrop--figpal-minimizing',
  ]
    .filter(Boolean)
    .join(' ')

  const shellClass = [
    'home-v2-popup',
    'home-v2-popup--figpal',
    maximized && 'home-v2-popup--figpal-maximized',
    minimizing && 'home-v2-popup--figpal-minimizing',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={backdropClass}
      role="dialog"
      aria-modal="true"
      aria-labelledby="figpal-xp-window-title"
      aria-label="FigPal character builder"
      onClick={(e) => {
        if (minimizing) return
        e.target === e.currentTarget && onClose()
      }}
    >
      <div
        className={shellClass}
        onAnimationEnd={handleMinimizeAnimationEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="home-v2-popup-xp-titlebar">
          <span id="figpal-xp-window-title" className="home-v2-popup-xp-titlebar-text">
            FigPal Forever
          </span>
          <div className="home-v2-popup-xp-window-controls">
            <button
              type="button"
              className="home-v2-popup-xp-caption home-v2-popup-xp-caption--min"
              onClick={runMinimizeClose}
              aria-label="Minimize"
            />
            <button
              type="button"
              className={`home-v2-popup-xp-caption home-v2-popup-xp-caption--max${maximized ? ' home-v2-popup-xp-caption--restore' : ''}`}
              onClick={toggleMaximize}
              aria-label={maximized ? 'Restore window' : 'Maximize'}
            />
            <button
              type="button"
              className="home-v2-popup-xp-close"
              onClick={onClose}
              aria-label="Close FigPal preview"
            >
            <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M2.5 2.5l7 7M9.5 2.5l-7 7"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
          </div>
        </header>
        <div className="home-v2-popup-scroll home-v2-popup-scroll--figpal">
          <FigPalCharacterBuilder
            onClose={onClose}
            onFollowMouseChange={onFollowMouseChange}
            initialState={initialState}
            onStateChange={onStateChange}
            renderSidebar={({ followMouse, setFollowMouse }: FigPalSidebarContext) => (
              <div className="home-v2-popup-figpal-side">
                <div className="home-v2-popup-figpal-top">
                  <img
                    className="home-v2-popup-figpal-wordmark"
                    src="/figpal-forever-logo.png"
                    alt=""
                    width={743}
                    height={487}
                    decoding="async"
                  />
                </div>
                <div className="home-v2-popup-figpal-glass">
                  <div className="home-v2-popup-figpal-copy">
                    <h2 className="home-v2-popup-figpal-heading">
                      &quot;But why are you doing this?&quot;
                    </h2>
                    <p className="home-v2-popup-figpal-text">
                      Well, partly because I&apos;d like to showcase how A.I. development tools can push
                      creativity... but also because now I&apos;m enabled to bring back the best April Fools
                      feature Figma ever released: FigPals.
                    </p>
                    <p className="home-v2-popup-figpal-text">
                      Non-stop A.I. discourse can be exhausting, but the results are clear as day. Will A.I.
                      take over the world some day? Maybe, but somewhere in that process, creativity is
                      unleashed. Ironically, A.I. can enable a more human element in every day experiences.
                    </p>
                    <p className="home-v2-popup-figpal-text">
                      Try making your own FigPal and have it follow you around so you can balance out that
                      ~seriousness~ of B2B work.
                    </p>
                  </div>
                </div>
                <div className="home-v2-popup-figpal-follow">
                  <FigPalFollowMeToggle
                    followMouse={followMouse}
                    onToggle={() => setFollowMouse(!followMouse)}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
