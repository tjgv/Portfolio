import type { CSSProperties, KeyboardEvent } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import type { HighlightSlide } from './highlightsSlides'
import { PILL_LUCIDE_ICON_SIZE } from './pillControlSizes'
import './carouselGrowAnimation.css'
import './CarouselControls.css'

export type CarouselControlsProps = {
  slides: HighlightSlide[]
  activeIndex: number
  isPlaying: boolean
  ended: boolean
  autoplayProgress: number
  controlsReady: boolean
  style: CSSProperties
  onSelectSlide: (index: number) => void
  onPauseAutoplay: () => void
  onPlayPause: () => void
  onDotKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void
}

export default function CarouselControls({
  slides,
  activeIndex,
  isPlaying,
  ended,
  autoplayProgress,
  controlsReady,
  style,
  onSelectSlide,
  onPauseAutoplay,
  onPlayPause,
  onDotKeyDown,
}: CarouselControlsProps) {
  return (
    <div
      className={`np1-carousel-controls np1-carousel-aap${controlsReady ? ' np1-carousel-aap--ready np1-carousel-aap--revealed' : ''}`}
      style={style}
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
                        onPauseAutoplay()
                      }}
                      onKeyDown={(e) => onDotKeyDown(e, index)}
                      disabled={!controlsReady}
                    >
                      <span className="visually-hidden">
                        Slide {index + 1}: {slide.imageAlt}
                      </span>
                      <span
                        className="np1-carousel-aap__dot-progress"
                        style={{
                          transform: `scaleX(${isActive ? autoplayProgress : 0})`,
                          opacity: isActive ? 1 : 0,
                        }}
                        aria-hidden
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="np1-carousel-aap__play-orb">
            <div className="np1-grow-orb__pulse np1-grow-orb__pulse--out" aria-hidden />
            <div className="np1-grow-orb__pulse np1-grow-orb__pulse--in" aria-hidden />
            <button
              type="button"
              className="np1-grow-orb__seed np1-carousel-aap__play-shell"
              onClick={onPlayPause}
              disabled={!controlsReady}
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
        </div>
      </div>
    </div>
  )
}
