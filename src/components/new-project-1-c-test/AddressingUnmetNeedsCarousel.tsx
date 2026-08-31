import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ImgWithLoader, VideoWithLoader } from '../MediaLoader'
import CarouselVideoReplayButton from './CarouselVideoReplayButton'
import { SOLUTION_VIDEO_SLIDES } from './solutionVideoSlides'
import { type HighlightSlide } from './highlightsSlides'
import { PILL_LUCIDE_ICON_SIZE } from './pillControlSizes'
import './AddressingUnmetNeedsCarousel.css'

function GiantPlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function AddressingUnmetNeedsCarousel() {
  const slides = SOLUTION_VIDEO_SLIDES
  const slideCount = slides.length

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isPlayingRef = useRef(true)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  activeIndexRef.current = activeIndex
  isPlayingRef.current = isPlaying

  const goToSlide = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), slideCount - 1)
      setActiveIndex(next)
      setIsPlaying(true)
    },
    [slideCount]
  )

  const goPrev = () => goToSlide(activeIndex - 1)
  const goNext = () => goToSlide(activeIndex + 1)

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing)
  }, [])

  const handleVideoRestart = () => {
    setIsPlaying(true)
  }

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      const slide = slides[i]
      if (slide?.kind === 'video' && slide.playbackRate) {
        video.playbackRate = slide.playbackRate
        video.defaultPlaybackRate = slide.playbackRate
      }
      const shouldPlay = i === activeIndex && isPlaying
      if (shouldPlay) {
        const playPromise = video.play()
        if (playPromise) playPromise.catch(() => {})
      } else {
        video.pause()
        if (i !== activeIndex) video.currentTime = 0
      }
    })
  }, [activeIndex, isPlaying, slides])

  useEffect(() => {
    const video = videoRefs.current[activeIndex]
    const slide = slides[activeIndex]
    if (!video || slide?.kind !== 'video') return

    const endTrim = slide.endTrimSeconds ?? 0
    let advanced = false

    const effectiveDuration = () => {
      const duration = video.duration
      if (!duration || !Number.isFinite(duration) || duration <= 0) return 0
      return Math.max(0.01, duration - endTrim)
    }

    const advanceFromVideoEnd = () => {
      if (advanced || !isPlayingRef.current) return
      advanced = true
      video.pause()
      if (activeIndexRef.current < slideCount - 1) {
        goToSlide(activeIndexRef.current + 1)
      } else {
        setIsPlaying(false)
      }
    }

    const onTimeUpdate = () => {
      const playable = effectiveDuration()
      if (playable <= 0) return
      if (endTrim > 0 && video.currentTime >= playable) {
        advanceFromVideoEnd()
      }
    }

    const onEnded = () => advanceFromVideoEnd()

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [activeIndex, goToSlide, slideCount, slides])

  const canPrev = activeIndex > 0
  const canNext = activeIndex < slideCount - 1
  const activeSlide = slides[activeIndex]
  const isPaused = !isPlaying

  return (
    <section
      className="np1c-section np1c-aun-section"
      data-dev-section="how-it-addresses"
      aria-label="Addressing Unmet Needs"
    >
      <div className="np1c-aun-section__stack">
        <div
          className="np1c-aun-carousel"
          style={{ ['--np1c-aun-slide-count' as string]: slideCount }}
          role="region"
          aria-roledescription="carousel"
          aria-label="Addressing Unmet Needs feature highlights"
        >
          <p className="np1c-aun-carousel__overlay-label np1c-type-subheader-3">Selling Points</p>

          <button
            type="button"
            className="np1c-aun-carousel__arrow np1c-aun-carousel__arrow--prev"
            onClick={goPrev}
            disabled={!canPrev}
            aria-label="Previous slide"
            hidden={!canPrev}
          >
            <ChevronLeft size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} aria-hidden />
          </button>

          <button
            type="button"
            className="np1c-aun-carousel__arrow np1c-aun-carousel__arrow--next"
            onClick={goNext}
            disabled={!canNext}
            aria-label="Next slide"
            hidden={!canNext}
          >
            <ChevronRight size={PILL_LUCIDE_ICON_SIZE} strokeWidth={2} aria-hidden />
          </button>

          <div className="np1c-aun-carousel__content">
            <div className="np1c-aun-carousel__media-stack">
              <div
                className="np1c-aun-carousel__track"
                style={{
                  width: `${slideCount * 100}%`,
                  transform: `translateX(-${(activeIndex * 100) / slideCount}%)`,
                }}
              >
                {slides.map((slide, index) => (
                  <SlidePanel
                    key={slide.id}
                    slide={slide}
                    index={index}
                    active={index === activeIndex}
                    isPaused={isPaused && index === activeIndex}
                    onTogglePlay={handleTogglePlay}
                    getVideo={() => videoRefs.current[index]}
                    videoRef={(node) => {
                      videoRefs.current[index] = node
                    }}
                    onVideoRestart={handleVideoRestart}
                  />
                ))}
              </div>
            </div>

            <p className="np1c-aun-carousel__caption" aria-live="polite">
              {activeSlide.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

type SlidePanelProps = {
  slide: HighlightSlide
  index: number
  active: boolean
  isPaused: boolean
  onTogglePlay: () => void
  getVideo: () => HTMLVideoElement | null
  videoRef: (node: HTMLVideoElement | null) => void
  onVideoRestart: () => void
}

function SlidePanel({
  slide,
  index,
  active,
  isPaused,
  onTogglePlay,
  getVideo,
  videoRef,
  onVideoRestart,
}: SlidePanelProps) {
  return (
    <div
      className="np1c-aun-carousel__panel"
      id={`np1c-aun-slide-${slide.id}`}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${SOLUTION_VIDEO_SLIDES.length}`}
      aria-hidden={!active}
    >
      <figure className="np1c-aun-carousel__media np1c-aun-carousel__media--scaled">
        {slide.kind === 'video' ? (
          <div className="np1c-aun-carousel__video-wrap">
            <VideoWithLoader
              ref={videoRef}
              fill
              className="np1c-aun-carousel__video"
              src={slide.src}
              aria-label={slide.ariaLabel}
              muted
              playsInline
              preload="auto"
              onLoadedData={(e) => {
                if (slide.playbackRate) {
                  e.currentTarget.playbackRate = slide.playbackRate
                  e.currentTarget.defaultPlaybackRate = slide.playbackRate
                }
              }}
            />
            <button
              type="button"
              className="np1c-aun-carousel__toggle"
              aria-label={isPaused ? 'Play video' : 'Pause video'}
              tabIndex={active ? 0 : -1}
              onClick={onTogglePlay}
            />
            {isPaused ? (
              <span className="np1c-aun-carousel__play" aria-hidden>
                <GiantPlayIcon />
              </span>
            ) : null}
            <CarouselVideoReplayButton getVideo={getVideo} onRestart={onVideoRestart} />
          </div>
        ) : (
          <ImgWithLoader
            className="np1c-aun-carousel__image"
            src={slide.image}
            alt={slide.imageAlt}
          />
        )}
      </figure>
    </div>
  )
}
