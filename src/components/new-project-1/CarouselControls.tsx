import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react'
import { CAROUSEL_NAV_FULL, PILL_LUCIDE_ICON_SIZE } from './pillControlSizes'
import './carouselGrowAnimation.css'
import './CarouselControls.css'

export type CarouselControlSlide = {
  id: string
  caption: string
}

export type CarouselControlsProps = {
  slides: readonly CarouselControlSlide[]
  activeIndex: number
  /** Manual = clickable dots only (no play/pause, no duration fill). */
  variant?: 'autoplay' | 'manual'
  isPlaying?: boolean
  ended?: boolean
  autoplayProgress?: number
  controlsReady?: boolean
  /** Kept for call-site compatibility; arrows sit statically over the carousel. */
  arrowPinRootRef?: RefObject<HTMLElement | null>
  /** When false, prev/next stop at the ends instead of wrapping. */
  loop?: boolean
  style?: CSSProperties
  onSelectSlide: (index: number) => void
  onPauseAutoplay?: () => void
  onPlayPause?: () => void
  onDotKeyDown?: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

export default function CarouselControls({
  slides,
  activeIndex,
  variant = 'autoplay',
  isPlaying = false,
  ended = false,
  autoplayProgress = 0,
  controlsReady = true,
  loop = true,
  style,
  onSelectSlide,
  onPauseAutoplay,
  onPlayPause,
  onDotKeyDown,
}: CarouselControlsProps) {
  const isManual = variant === 'manual'
  const ready = isManual || controlsReady
  const styleVars = style as Record<string, string | number> | undefined
  const uiOpacity = isManual ? 1 : (styleVars?.['--aap-ui-opacity'] ?? 0)
  const arrowsInteractive = ready && Number(uiOpacity) > 0.5
  const slideCount = slides.length
  const canPrev = loop || activeIndex > 0
  const canNext = loop || activeIndex < slideCount - 1

  const goPrev = () => {
    if (!arrowsInteractive || !canPrev) return
    const next = loop
      ? (activeIndex - 1 + slideCount) % slideCount
      : Math.max(0, activeIndex - 1)
    onSelectSlide(next)
    onPauseAutoplay?.()
  }

  const goNext = () => {
    if (!arrowsInteractive || !canNext) return
    const next = loop
      ? (activeIndex + 1) % slideCount
      : Math.min(slideCount - 1, activeIndex + 1)
    onSelectSlide(next)
    onPauseAutoplay?.()
  }

  const manualStyle: CSSProperties | undefined = isManual
    ? ({
        '--aap-morph': 1,
        '--aap-nav-width': `${CAROUSEL_NAV_FULL}px`,
        '--aap-cluster-width': `${CAROUSEL_NAV_FULL}px`,
        '--aap-nav-right': '0px',
        '--aap-ui-opacity': 1,
        '--aap-gap': '0px',
        ...style,
      } as CSSProperties)
    : style

  return (
    <>
      <div
        className={`np1-carousel-edge-arrows${ready ? ' np1-carousel-edge-arrows--visible' : ''}`}
        style={{ '--aap-ui-opacity': uiOpacity } as CSSProperties}
      >
        <button
          type="button"
          className="np1-carousel-edge-arrow np1-carousel-edge-arrow--prev"
          onClick={goPrev}
          disabled={!arrowsInteractive || !canPrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} aria-hidden />
        </button>
        <button
          type="button"
          className="np1-carousel-edge-arrow np1-carousel-edge-arrow--next"
          onClick={goNext}
          disabled={!arrowsInteractive || !canNext}
          aria-label="Next slide"
        >
          <ChevronRight size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <div
        className={[
          'np1-carousel-controls',
          'np1-carousel-aap',
          ready ? 'np1-carousel-aap--ready np1-carousel-aap--revealed' : '',
          isManual ? 'np1-carousel-aap--manual' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={manualStyle}
      >
        <div className="np1-carousel-aap__stage">
          <div className="np1-carousel-aap__cluster">
            <div className="np1-carousel-aap__nav-shell" role="tablist" aria-label="Carousel slides">
              <div className="np1-carousel-aap__nav">
                {slides.map((slide, index) => {
                  const isActive = index === activeIndex
                  return (
                    <div
                      key={slide.id}
                      role="presentation"
                      className={`np1-carousel-aap__dot-track${isActive ? ' np1-carousel-aap__dot-track--active' : ''}`}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`np1-carousel-slide-${slide.id}`}
                        className={`np1-carousel-aap__dot${isActive ? ' np1-carousel-aap__dot--active' : ''}`}
                        onClick={() => {
                          onSelectSlide(index)
                          onPauseAutoplay?.()
                        }}
                        onKeyDown={(e) => onDotKeyDown?.(e, index)}
                        disabled={!ready}
                      >
                        <span className="visually-hidden">
                          Slide {index + 1}: {slide.caption}
                        </span>
                        {!isManual ? (
                          <span
                            className="np1-carousel-aap__dot-progress"
                            style={{
                              transform: `scaleX(${isActive ? autoplayProgress : 0})`,
                              opacity: isActive ? 1 : 0,
                            }}
                            aria-hidden
                          />
                        ) : null}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {!isManual ? (
              <div className="np1-carousel-aap__play-orb">
                <div className="np1-grow-orb__pulse np1-grow-orb__pulse--out" aria-hidden />
                <div className="np1-grow-orb__pulse np1-grow-orb__pulse--in" aria-hidden />
                <button
                  type="button"
                  className="np1-grow-orb__seed np1-carousel-aap__play-shell"
                  onClick={onPlayPause}
                  disabled={!ready}
                  aria-label={
                    ended ? 'Replay carousel' : isPlaying ? 'Pause carousel' : 'Play carousel'
                  }
                >
                  <span className="np1-carousel-aap__play-icon" aria-hidden>
                    {ended ? (
                      <RotateCcw size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} />
                    ) : isPlaying ? (
                      <Pause size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} />
                    ) : (
                      <Play size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} />
                    )}
                  </span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
