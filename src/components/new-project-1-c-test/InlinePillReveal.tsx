import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { ArrowUp } from 'lucide-react'
import CaseStudySlideUpModal, {
  type SlideUpModalSubsection,
  type SlideUpModalVariant,
} from './CaseStudySlideUpModal'
import { computeInlinePillRevealVars } from './inlinePillRevealAnimation'
import {
  INLINE_PILL_LUCIDE_ICON_SIZE,
  INLINE_PILL_MEASURE_BUFFER,
  INLINE_PILL_SEED_SIZE,
} from './inlinePillSizes'
import { useInlinePillRevealProgress } from './useInlinePillRevealProgress'
import { useSlideUpModal } from './useSlideUpModal'
import './InlinePillReveal.css'
import './pillControlSizes.css'

export type InlinePillRevealModalConfig = {
  ariaLabel: string
  headline?: string
  subhead?: string
  heroImage?: string
  heroImageAlt?: string
  hideHero?: boolean
  subsections: readonly SlideUpModalSubsection[]
  variant?: SlideUpModalVariant
}

export type InlinePillRevealProps = {
  sectionRef: RefObject<HTMLElement | null>
  ctaLabel: string
  modal: InlinePillRevealModalConfig
  ariaLabel?: string
  align?: 'left' | 'center'
}

export default function InlinePillReveal({
  sectionRef,
  ctaLabel,
  modal,
  ariaLabel,
  align = 'left',
}: InlinePillRevealProps) {
  const pillRootRef = useRef<HTMLDivElement>(null)
  const pillMeasureRef = useRef<HTMLDivElement>(null)
  const [pillTargetWidth, setPillTargetWidth] = useState(INLINE_PILL_SEED_SIZE)
  const revealProgress = useInlinePillRevealProgress(sectionRef, pillRootRef)
  const pillReveal = computeInlinePillRevealVars(revealProgress, pillTargetWidth)
  const { overlayOpen, overlayPhase, overlayRef, scrollRef, openOverlay, closeOverlay } = useSlideUpModal()

  const controlStyle: CSSProperties = pillReveal.style
  const controlsReady = pillReveal.ready
  const overlayActive = overlayOpen

  useEffect(() => {
    const measurePill = () => {
      const el = pillMeasureRef.current
      if (!el) return
      const rectWidth = el.getBoundingClientRect().width
      const measured =
        Math.ceil(Math.max(rectWidth, el.scrollWidth, el.offsetWidth)) + INLINE_PILL_MEASURE_BUFFER
      setPillTargetWidth(Math.max(INLINE_PILL_SEED_SIZE, measured))
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
  }, [ctaLabel])

  const handleOpen = () => {
    if (!controlsReady) return
    openOverlay()
  }

  return (
    <>
      <div
        ref={pillRootRef}
        className={`np1c-inline-pill np1c-popup-aap np1c-inline-pill--${align}${controlsReady ? ' np1c-inline-pill--ready' : ''}${overlayActive ? ' np1c-inline-pill--overlay-open' : ''}`}
        style={controlStyle}
      >
        <div className="np1c-inline-pill__stage">
          <div className="np1c-inline-pill__pill-measure" ref={pillMeasureRef} aria-hidden>
            <span className="np1c-inline-pill__action-sizer" aria-hidden />
            <span className="np1c-inline-pill__cta-text">{ctaLabel}</span>
          </div>

          <div className="np1c-inline-pill__cluster">
            <button
              type="button"
              className="np1c-inline-pill__shell"
              onClick={handleOpen}
              disabled={!controlsReady}
              aria-label={ariaLabel ?? ctaLabel}
              aria-haspopup="dialog"
              aria-expanded={overlayOpen}
            >
              <span className="np1c-inline-pill__action-grow" aria-hidden>
                <span className="np1c-inline-pill__action">
                  <ArrowUp size={INLINE_PILL_LUCIDE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
                </span>
              </span>
              <span className="np1c-inline-pill__cta-text">{ctaLabel}</span>
            </button>
          </div>
        </div>
      </div>

      <CaseStudySlideUpModal
        open={overlayOpen}
        phase={overlayPhase}
        overlayRef={overlayRef}
        scrollRef={scrollRef}
        onClose={closeOverlay}
        ariaLabel={modal.ariaLabel}
        headline={modal.headline}
        subhead={modal.subhead}
        heroImage={modal.heroImage}
        heroImageAlt={modal.heroImageAlt}
        hideHero={modal.hideHero}
        subsections={modal.subsections}
        variant={modal.variant}
      />
    </>
  )
}
