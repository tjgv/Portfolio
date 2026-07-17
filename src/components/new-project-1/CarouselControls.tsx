import type { CSSProperties, KeyboardEvent } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
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
  style,
  onSelectSlide,
  onPauseAutoplay,
  onPlayPause,
  onDotKeyDown,
}: CarouselControlsProps) {
  const isManual = variant === 'manual'
  const ready = isManual || controlsReady

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
  )
}
