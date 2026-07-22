import { createPortal } from 'react-dom'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type RefObject,
} from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { MODAL_CLOSE_REVEAL_START } from './modalCloseRevealAnimation'
import { useModalCloseGrowAnimation } from './useModalCloseGrowAnimation'
import { PILL_CLOSE_ICON_SIZE } from './pillControlSizes'
import type { SlideUpModalPhase } from './useSlideUpModal'
import SlideUpModalCompareTabs from './SlideUpModalCompareTabs'
import ModalSectionTextStack from './ModalSectionTextStack'
import SlideUpModalControlledVideo from './SlideUpModalControlledVideo'
import ImageCarousel, { type CarouselSlide } from './ImageCarousel'
import './CaseStudySlideUpModal.css'
import './PopupGrowAnimation.css'
import './ModalCloseControl.css'
import './pillControlSizes.css'

const LIGHTBOX_ZOOM_SCALE = 1.35

const MODAL_CLOSE_ICON_PATH =
  'M5.95059 4.53638L1.70857 0.294351C1.31524 -0.0989702 0.68426 -0.0967889 0.293735 0.293735C-0.0995116 0.686982 -0.0965132 1.3177 0.294351 1.70857L4.53638 5.95059L0.294351 10.1926C-0.0989702 10.5859 -0.0967889 11.2169 0.293735 11.6074C0.686982 12.0007 1.3177 11.9977 1.70857 11.6068L5.95059 7.3648L10.1926 11.6068C10.5859 12.0001 11.2169 11.998 11.6074 11.6074C12.0007 11.2142 11.9977 10.5835 11.6068 10.1926L7.3648 5.95059L11.6068 1.70857C12.0001 1.31524 11.998 0.68426 11.6074 0.293735C11.2142 -0.0995116 10.5835 -0.0965132 10.1926 0.294351L5.95059 4.53638Z'

export type SlideUpModalQuote = {
  id: string
  text: string
  attribution?: string
}

export type SlideUpModalMediaCompare = {
  beforeLabel?: string
  afterLabel?: string
  beforeVideo: string
  afterVideo: string
  beforeAriaLabel: string
  afterAriaLabel: string
  /** Playback rate multiplier for the before tab (1 = normal speed). */
  beforePlaybackRate?: number
  /** Playback rate multiplier for the after tab (1 = normal speed). */
  afterPlaybackRate?: number
}

export type SlideUpModalSubsection = {
  id: string
  headline?: string
  body?: string
  image?: string
  imageAlt?: string
  compare?: SlideUpModalMediaCompare
  video?: string
  videoAriaLabel?: string
  /** Renders the shared ImageCarousel instead of the usual text + media stack. */
  carousel?: readonly CarouselSlide[]
  carouselAriaLabel?: string
}

export type SlideUpModalVariant = 'default' | 'compact' | 'short' | 'lightbox'

export type CaseStudySlideUpModalProps = {
  open: boolean
  phase: SlideUpModalPhase
  overlayRef: RefObject<HTMLDivElement | null>
  scrollRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  ariaLabel: string
  headline?: string
  subhead?: string
  heroImage?: string
  heroImageAlt?: string
  hideHero?: boolean
  quotes?: readonly SlideUpModalQuote[]
  subsections: readonly SlideUpModalSubsection[]
  variant?: SlideUpModalVariant
}

export default function CaseStudySlideUpModal({
  open,
  phase,
  overlayRef,
  scrollRef,
  onClose,
  ariaLabel,
  headline,
  subhead,
  heroImage,
  heroImageAlt,
  hideHero = false,
  quotes = [],
  subsections,
  variant = 'default',
}: CaseStudySlideUpModalProps) {
  const closeAnimActive = open && phase === 'open'
  const { closeProgress, growOrbCssVars: closeGrowVars, closeReveal, closeReady } =
    useModalCloseGrowAnimation(closeAnimActive)

  const isLightbox = variant === 'lightbox'
  const lightboxSlides = isLightbox ? subsections[0]?.carousel ?? [] : []
  const [activeIndex, setActiveIndex] = useState(0)

  const [lightboxZoomed, setLightboxZoomed] = useState(false)
  const [lightboxPan, setLightboxPan] = useState({ x: 0, y: 0 })
  const [lightboxSpaceHeld, setLightboxSpaceHeld] = useState(false)
  const [lightboxPanning, setLightboxPanning] = useState(false)
  const [lightboxShowPanHint, setLightboxShowPanHint] = useState(false)
  const lightboxDragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(
    null
  )

  useEffect(() => {
    if (open) setActiveIndex(0)
  }, [open])

  // Reset zoom/pan state whenever the active slide changes or the modal (re)opens.
  useEffect(() => {
    setLightboxZoomed(false)
    setLightboxPan({ x: 0, y: 0 })
    setLightboxShowPanHint(false)
  }, [activeIndex, open])

  // Space toggles pan mode — hold it down, then click-drag the image around.
  useEffect(() => {
    if (!isLightbox || !open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      setLightboxSpaceHeld(true)
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return
      setLightboxSpaceHeld(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isLightbox, open])

  useEffect(() => {
    if (!lightboxPanning) return
    const onMouseMove = (e: MouseEvent) => {
      const drag = lightboxDragRef.current
      if (!drag) return
      setLightboxPan({
        x: drag.panX + (e.clientX - drag.startX),
        y: drag.panY + (e.clientY - drag.startY),
      })
    }
    const onMouseUp = () => {
      lightboxDragRef.current = null
      setLightboxPanning(false)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [lightboxPanning])

  const handleLightboxFrameMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!lightboxSpaceHeld) return
    e.preventDefault()
    lightboxDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: lightboxPan.x,
      panY: lightboxPan.y,
    }
    setLightboxPanning(true)
    setLightboxShowPanHint(false)
  }

  const handleLightboxFrameClick = () => {
    if (lightboxSpaceHeld || lightboxPanning) return
    setLightboxZoomed((prev) => {
      const next = !prev
      if (next) {
        setLightboxShowPanHint(true)
      } else {
        setLightboxShowPanHint(false)
        setLightboxPan({ x: 0, y: 0 })
      }
      return next
    })
  }

  const lightboxCursor = lightboxPanning
    ? 'grabbing'
    : lightboxSpaceHeld
      ? 'grab'
      : lightboxZoomed
        ? 'zoom-out'
        : 'zoom-in'

  const lightboxImageStyle: CSSProperties = {
    transform: `translate(${lightboxPan.x}px, ${lightboxPan.y}px) scale(${
      lightboxZoomed ? LIGHTBOX_ZOOM_SCALE : 1
    })`,
    transition: lightboxPanning ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
  }

  if (!open) return null

  if (isLightbox) {
    const activeSlide = lightboxSlides[activeIndex]
    const hasMultiple = lightboxSlides.length > 1

    return createPortal(
      <div
        ref={overlayRef}
        className={`np1c-popup-overlay np1c-popup-overlay--lightbox np1c-popup-overlay--${phase}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        data-modal-theme="dark"
      >
        <button
          type="button"
          className="np1c-popup-overlay__scrim"
          onClick={onClose}
          aria-label="Close overlay"
          tabIndex={-1}
        />

        <div className={`np1c-lightbox${lightboxPanning ? ' np1c-lightbox--panning' : ''}`}>
          <div
            className="np1c-lightbox__frame"
            style={{ cursor: lightboxCursor }}
            onMouseDown={handleLightboxFrameMouseDown}
            onClick={handleLightboxFrameClick}
          >
            {activeSlide?.type === 'image' ? (
              <img
                key={activeSlide.id}
                className="np1c-lightbox__image"
                src={activeSlide.src}
                alt={activeSlide.alt}
                style={lightboxImageStyle}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
              />
            ) : null}
          </div>

          {lightboxShowPanHint ? (
            <div className="np1c-lightbox__hint" role="status">
              <span className="np1c-lightbox__hint-text">Hold space + Click to pan</span>
              <button
                type="button"
                className="np1c-lightbox__hint-close"
                onClick={() => setLightboxShowPanHint(false)}
                aria-label="Dismiss pan hint"
              >
                <X size={11} strokeWidth={2.5} aria-hidden />
              </button>
            </div>
          ) : null}

          {hasMultiple ? (
            <>
              <button
                type="button"
                className="np1c-lightbox__nav np1c-lightbox__nav--prev"
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                aria-label="Previous journey map"
              >
                <ChevronLeft size={PILL_CLOSE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                className="np1c-lightbox__nav np1c-lightbox__nav--next"
                onClick={() => setActiveIndex((i) => Math.min(lightboxSlides.length - 1, i + 1))}
                disabled={activeIndex === lightboxSlides.length - 1}
                aria-label="Next journey map"
              >
                <ChevronRight size={PILL_CLOSE_ICON_SIZE} strokeWidth={2.25} aria-hidden />
              </button>
            </>
          ) : null}

        </div>

        <div className="np1c-popup-overlay__close-host">
          <div
            className={`np1c-modal-close-aap np1c-popup-aap${closeReady ? ' np1c-modal-close-aap--ready' : ''}`}
            style={{ ...closeGrowVars, ...closeReveal.style }}
          >
            <div
              className={`np1c-popup-aap__cluster${closeProgress >= MODAL_CLOSE_REVEAL_START - 0.001 ? ' np1c-popup-aap__cluster--reveal' : ''}`}
            >
              <div
                className="np1c-grow-orb"
                aria-hidden={closeProgress >= MODAL_CLOSE_REVEAL_START}
              >
                <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--out" aria-hidden />
                <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--in" aria-hidden />
                <div className="np1c-grow-orb__seed np1c-popup-aap__seed" aria-hidden />
              </div>

              <span
                className={`np1c-modal-close-aap__icon-grow${closeReveal.iconVisible ? ' np1c-modal-close-aap__icon-grow--visible' : ''}`}
                style={{
                  transform: `translate(-50%, calc(-50% + var(--grow-seed-y, 0))) scale(${closeReveal.iconScale})`,
                }}
                aria-hidden={!closeReveal.iconVisible}
              >
                <div className="np1c-modal-close-aap__shell">
                  <button
                    type="button"
                    className="np1c-modal-close-aap__action"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onClose}
                    disabled={!closeReady}
                    aria-label="Close overlay"
                  >
                    <svg
                      className="np1c-modal-close-aap__icon"
                      width={PILL_CLOSE_ICON_SIZE}
                      height={PILL_CLOSE_ICON_SIZE}
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d={MODAL_CLOSE_ICON_PATH}
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </span>
            </div>
          </div>
        </div>
      </div>,
      document.body
    )
  }

  return createPortal(
    <div
      ref={overlayRef}
      className={`np1c-popup-overlay np1c-popup-overlay--${phase}${variant === 'compact' ? ' np1c-popup-overlay--compact' : ''}${variant === 'short' ? ' np1c-popup-overlay--short' : ''}${hideHero ? ' np1c-popup-overlay--no-hero' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      data-modal-theme="dark"
    >
      <button
        type="button"
        className="np1c-popup-overlay__scrim"
        onClick={onClose}
        aria-label="Close overlay"
        tabIndex={-1}
      />

      <div ref={scrollRef} className="np1c-popup-overlay__scroll">
        <div className="np1c-popup-overlay__stage">
          <div className="np1c-popup-overlay__sheet" data-modal-content-wrapper="">
          {!hideHero ? (
            <div className="np1c-popup-overlay__hero">
              <div className="np1c-popup-overlay__hero-media">
                <img
                  className="np1c-popup-overlay__hero-image"
                  src={heroImage}
                  alt={heroImageAlt ?? ''}
                />
              </div>
              <div className="np1c-popup-overlay__hero-copy">
                <h2 className="np1c-popup-overlay__hero-headline">{headline}</h2>
                {subhead ? (
                  <p className="np1c-popup-overlay__hero-subhead">{subhead}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="np1c-popup-overlay__subsections" id="np1c-modal-subsections">
            {quotes.map((quote) => (
              <section
                key={quote.id}
                className="np1c-popup-overlay__subsection"
                aria-labelledby={`np1c-modal-quote-${quote.id}`}
              >
                <blockquote className="np1c-popup-overlay__quote">
                  <p id={`np1c-modal-quote-${quote.id}`} className="np1c-popup-overlay__quote-text">
                    &ldquo;{quote.text}&rdquo;
                    {quote.attribution ? (
                      <span className="np1c-popup-overlay__quote-attribution">
                        {' '}
                        &mdash; {quote.attribution}
                      </span>
                    ) : null}
                  </p>
                </blockquote>
              </section>
            ))}

            {subsections.map((section) => {
              const sectionLabelId = `np1c-modal-section-${section.id}`
              const sectionLabel =
                section.headline ?? section.carouselAriaLabel ?? section.videoAriaLabel ?? section.id

              return (
              <section
                key={section.id}
                className={`np1c-popup-overlay__subsection${section.carousel && !section.headline && !section.body ? ' np1c-popup-overlay__subsection--carousel-only' : ''}`}
                aria-labelledby={sectionLabelId}
              >
                {section.compare ? (
                  <SlideUpModalCompareTabs
                    sectionId={section.id}
                    headline={section.headline ?? ''}
                    body={section.body ?? ''}
                    compare={section.compare}
                  />
                ) : (
                  <>
                    {section.headline || section.body ? (
                      <ModalSectionTextStack
                        sectionId={section.id}
                        headline={section.headline ?? ''}
                        body={section.body ?? ''}
                      />
                    ) : (
                      <h3 id={sectionLabelId} className="np1c-popup-overlay__sr-only">
                        {sectionLabel}
                      </h3>
                    )}
                    {section.carousel ? (
                      <div className="np1c-modal-carousel">
                        <ImageCarousel
                          slides={section.carousel}
                          ariaLabel={section.carouselAriaLabel ?? section.headline ?? 'Slides'}
                        />
                      </div>
                    ) : section.video ? (
                      <div className="np1c-modal-media">
                        <SlideUpModalControlledVideo
                          src={section.video}
                          ariaLabel={section.videoAriaLabel ?? section.headline ?? 'Video'}
                        />
                      </div>
                    ) : section.image ? (
                      <div className="np1c-popup-overlay__subsection-media">
                        <img
                          className="np1c-popup-overlay__subsection-image"
                          src={section.image}
                          alt={section.imageAlt ?? ''}
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </section>
              )
            })}
          </div>
          </div>
        </div>
      </div>

      {/* Rendered outside the sheet (whose transform would otherwise become
          its containing block) so `position: fixed` below is anchored to the
          true viewport — pinned at the same height the CTA pill floats at
          before it docks into the page. */}
      <div className="np1c-popup-overlay__close-host">
        <div
          className={`np1c-modal-close-aap np1c-popup-aap${closeReady ? ' np1c-modal-close-aap--ready' : ''}`}
          style={{ ...closeGrowVars, ...closeReveal.style }}
        >
          <div
            className={`np1c-popup-aap__cluster${closeProgress >= MODAL_CLOSE_REVEAL_START - 0.001 ? ' np1c-popup-aap__cluster--reveal' : ''}`}
          >
            <div
              className="np1c-grow-orb"
              aria-hidden={closeProgress >= MODAL_CLOSE_REVEAL_START}
            >
              <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--out" aria-hidden />
              <div className="np1c-grow-orb__pulse np1c-grow-orb__pulse--in" aria-hidden />
              <div className="np1c-grow-orb__seed np1c-popup-aap__seed" aria-hidden />
            </div>

            <span
              className={`np1c-modal-close-aap__icon-grow${closeReveal.iconVisible ? ' np1c-modal-close-aap__icon-grow--visible' : ''}`}
              style={{
                transform: `translate(-50%, calc(-50% + var(--grow-seed-y, 0))) scale(${closeReveal.iconScale})`,
              }}
              aria-hidden={!closeReveal.iconVisible}
            >
              <div className="np1c-modal-close-aap__shell">
                <button
                  type="button"
                  className="np1c-modal-close-aap__action"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={onClose}
                  disabled={!closeReady}
                  aria-label="Close overlay"
                >
                  <svg
                    className="np1c-modal-close-aap__icon"
                    width={PILL_CLOSE_ICON_SIZE}
                    height={PILL_CLOSE_ICON_SIZE}
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d={MODAL_CLOSE_ICON_PATH}
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
