import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUp, Plus, X } from 'lucide-react'
import { GROW_PHASE_END } from './carouselGrowAnimation'
import CaseStudySlideUpModal from './CaseStudySlideUpModal'
import type { InlinePillRevealModalConfig } from './InlinePillReveal'
import {
  computePopupRevealVars,
  POPUP_EXPAND_LAYOUT_START,
  POPUP_REVEAL_START,
} from './popupRevealAnimation'
import { useSlideUpModal } from './useSlideUpModal'
import { PILL_LUCIDE_ICON_SIZE, PILL_MEASURE_BUFFER, PILL_SEED_SIZE } from './pillControlSizes'
import './pillControlSizes.css'
import './PopupGrowAnimation.css'
import './PopupRevealControl.css'

const LEGACY_OVERLAY_IMAGE = '/new-project-1/intro-tablet.png'
const LEGACY_OVERLAY_HEADLINE = 'What users said'
const LEGACY_OVERLAY_SUBHEAD = 'Verbatim feedback from interns and newer venue operators.'

export type Pill1Icon = 'plus' | 'arrow-up'

export type PopupRevealControlProps = {
  visible: boolean
  openProgress: number
  controlsReady: boolean
  growOrbCssVars: CSSProperties
  ctaLabel: string
  buttonAriaLabel?: string
  icon?: Pill1Icon
  /** Slide-up modal content. Omit to use the legacy user-insights overlay. */
  modal?: InlinePillRevealModalConfig
  /** Fixed to viewport bottom while scrolling; releases into document flow when false. */
  pinned?: boolean
  overlayOpen?: boolean
  onOverlayOpenChange?: (open: boolean) => void
}

function Pill1ActionIcon({ icon }: { icon: Pill1Icon }) {
  if (icon === 'arrow-up') {
    return <ArrowUp size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
  }
  return <Plus size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
}

export default function PopupRevealControl({
  visible,
  openProgress,
  controlsReady,
  growOrbCssVars,
  ctaLabel,
  buttonAriaLabel,
  icon = 'plus',
  modal,
  pinned = false,
  overlayOpen: overlayOpenProp,
  onOverlayOpenChange,
}: PopupRevealControlProps) {
  const [legacyOverlayOpen, setLegacyOverlayOpen] = useState(false)
  const [legacyOverlayPhase, setLegacyOverlayPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [pillTargetWidth, setPillTargetWidth] = useState(PILL_SEED_SIZE)
  const pillMeasureRef = useRef<HTMLDivElement>(null)

  const slideUpModal = useSlideUpModal()
  const usesSlideUpModal = Boolean(modal)

  const overlayOpen = usesSlideUpModal
    ? slideUpModal.overlayOpen
    : (overlayOpenProp ?? legacyOverlayOpen)

  const closeOverlay = useCallback(() => {
    if (usesSlideUpModal) {
      slideUpModal.closeOverlay()
      return
    }

    if (onOverlayOpenChange) {
      onOverlayOpenChange(false)
      return
    }

    setLegacyOverlayPhase('closing')
    window.setTimeout(() => {
      setLegacyOverlayOpen(false)
      setLegacyOverlayPhase('closed')
    }, 480)
  }, [usesSlideUpModal, slideUpModal, onOverlayOpenChange])

  const openOverlay = useCallback(() => {
    if (!controlsReady) return

    if (usesSlideUpModal) {
      slideUpModal.openOverlay()
      return
    }

    if (onOverlayOpenChange) {
      onOverlayOpenChange(true)
      return
    }

    setLegacyOverlayOpen(true)
    setLegacyOverlayPhase('opening')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setLegacyOverlayPhase('open'))
    })
  }, [controlsReady, usesSlideUpModal, slideUpModal, onOverlayOpenChange])

  useEffect(() => {
    if (!overlayOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOverlay()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [overlayOpen, closeOverlay])

  useEffect(() => {
    const measurePill = () => {
      const el = pillMeasureRef.current
      if (!el) return
      const rectWidth = el.getBoundingClientRect().width
      const measured = Math.ceil(Math.max(rectWidth, el.scrollWidth, el.offsetWidth)) + PILL_MEASURE_BUFFER
      setPillTargetWidth(Math.max(PILL_SEED_SIZE, measured))
    }

    measurePill()
    const el = pillMeasureRef.current
    const observer = el ? new ResizeObserver(measurePill) : null
    if (el && observer) observer.observe(el)
    window.addEventListener('resize', measurePill)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measurePill)
    }
    // `pinned` re-parents the control between the viewport portal and the
    // in-flow dock — the DOM node is recreated, so re-measure and re-observe.
  }, [ctaLabel, pinned])

  const revealActive = openProgress >= POPUP_REVEAL_START - 0.001
  const revealResult = computePopupRevealVars(
    openProgress,
    Math.max(PILL_SEED_SIZE, pillTargetWidth)
  )
  const expandActive = revealResult.expand >= POPUP_EXPAND_LAYOUT_START

  const controlStyle: CSSProperties = {
    ...growOrbCssVars,
    ...revealResult.style,
  }

  const actionIcon = <Pill1ActionIcon icon={icon} />
  const actionAriaLabel = buttonAriaLabel ?? ctaLabel

  let overlayPortal: ReactNode = null

  if (usesSlideUpModal && modal) {
    overlayPortal = (
      <CaseStudySlideUpModal
        open={slideUpModal.overlayOpen}
        phase={slideUpModal.overlayPhase}
        overlayRef={slideUpModal.overlayRef}
        scrollRef={slideUpModal.scrollRef}
        onClose={slideUpModal.closeOverlay}
        ariaLabel={modal.ariaLabel}
        headline={modal.headline}
        subhead={modal.subhead}
        heroImage={modal.heroImage}
        heroImageAlt={modal.heroImageAlt}
        hideHero={modal.hideHero}
        subsections={modal.subsections}
        variant={modal.variant}
      />
    )
  } else if (!usesSlideUpModal && (overlayOpenProp ?? legacyOverlayOpen)) {
    overlayPortal = createPortal(
      <div
        className={`np1c-popup-overlay np1c-popup-overlay--${legacyOverlayPhase}`}
        role="dialog"
        aria-modal="true"
        aria-label={LEGACY_OVERLAY_HEADLINE}
      >
        <button
          type="button"
          className="np1c-popup-overlay__backdrop"
          onClick={closeOverlay}
          aria-label="Close overlay"
          tabIndex={-1}
        />
        <div className="np1c-popup-overlay__content">
          <header className="np1c-popup-overlay__header">
            <h3 className="np1c-popup-overlay__headline">{LEGACY_OVERLAY_HEADLINE}</h3>
            <p className="np1c-popup-overlay__subhead">{LEGACY_OVERLAY_SUBHEAD}</p>
          </header>
          <div className="np1c-popup-overlay__panel">
            <img
              className="np1c-popup-overlay__image"
              src={LEGACY_OVERLAY_IMAGE}
              alt="iPad showing user research insights"
            />
          </div>
        </div>
        <button
          type="button"
          className="np1c-popup-aap__action np1c-popup-overlay__close"
          onClick={closeOverlay}
          aria-label="Close overlay"
        >
          <X size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
        </button>
      </div>,
      document.body
    )
  }

  const controlEl = (
    <div
      className={`np1c-popup-reveal${visible ? ' np1c-popup-reveal--visible' : ''}${pinned ? ' np1c-popup-reveal--pinned' : ''} np1c-popup-aap${expandActive ? ' np1c-popup-aap--grow-done' : ''}${controlsReady ? ' np1c-popup-aap--ready np1c-popup-aap--revealed' : ''}${overlayOpen ? ' np1c-popup-reveal--overlay-open' : ''}`}
      style={controlStyle}
      aria-hidden={!visible}
    >
      <div className="np1c-popup-aap__stage">
        <div
          className="np1c-popup-aap__morph-pill np1c-popup-aap__morph-pill--measure"
          ref={pillMeasureRef}
          aria-hidden
        >
          <span className="np1c-popup-aap__label" style={{ opacity: 1 }}>
            {ctaLabel}
          </span>
          <button type="button" className="np1c-popup-aap__action" tabIndex={-1} style={{ opacity: 1 }}>
            {actionIcon}
          </button>
        </div>

        <div className={`np1c-popup-aap__cluster${revealActive ? ' np1c-popup-aap__cluster--reveal' : ''}`}>
          <div
            className="np1c-popup-aap__play-orb"
            aria-hidden={openProgress >= GROW_PHASE_END - 0.001}
          >
            <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--out" aria-hidden />
            <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--in" aria-hidden />
            <div className="np1c-grow-orb__seed np1c-popup-aap__seed" aria-hidden />
          </div>

          <div
            className={`np1c-popup-aap__morph-pill${expandActive ? ' np1c-popup-aap__morph-pill--expanding' : ''}`}
            aria-hidden={!revealActive}
          >
            <span className="np1c-popup-aap__label">{ctaLabel}</span>
            <button
              type="button"
              className="np1c-popup-aap__action"
              onClick={openOverlay}
              disabled={!controlsReady}
              aria-label={actionAriaLabel}
              aria-haspopup="dialog"
              aria-expanded={overlayOpen}
            >
              {actionIcon}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const pinnedPortal =
    pinned && visible
      ? createPortal(
          <div className="np1c-popup-reveal-portal-host">{controlEl}</div>,
          document.body
        )
      : null

  return (
    <>
      {!pinned ? controlEl : null}
      {pinnedPortal}
      {overlayPortal}
    </>
  )
}

