import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import CarouselControls from './CarouselControls'
import CarouselVideoReplayButton from './CarouselVideoReplayButton'
import ImageCarousel, { type CarouselSlide } from './ImageCarousel'
import { SOLUTION_VIDEO_SLIDES } from './solutionVideoSlides'
import { useCarouselPillGrow } from './useCarouselPillGrow'
import './AddressingUnmetNeedsCarousel.css'

const MOBILE_SLIDES: CarouselSlide[] = SOLUTION_VIDEO_SLIDES.flatMap((slide) =>
  slide.kind === 'video'
    ? [{ id: slide.id, type: 'video' as const, src: slide.src, caption: slide.caption }]
    : [],
)

function useIsPhone() {
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return isPhone
}

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

function AddressingUnmetNeedsCarouselMobile() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="np1c-section np1c-editing-carousel np1c-section-size-1 np1c-aun-mobile-carousel"
      data-dev-section="how-it-addresses"
      aria-label="Addressing Unmet Needs"
    >
      <ImageCarousel
        slides={MOBILE_SLIDES}
        ariaLabel="Addressing Unmet Needs feature highlights"
        controlsVariant="autoplay"
        pillGrowSectionRef={sectionRef}
      />
    </section>
  )
}

export default function AddressingUnmetNeedsCarousel() {
  const isPhone = useIsPhone()
  if (isPhone) return <AddressingUnmetNeedsCarouselMobile />
  return <AddressingUnmetNeedsCarouselDesktop />
}

function AddressingUnmetNeedsCarouselDesktop() {
  const slides = SOLUTION_VIDEO_SLIDES
  const slideCount = slides.length
  const sectionRef = useRef<HTMLElement>(null)
  const { controlsReady, controlStyle } = useCarouselPillGrow(sectionRef, true)

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const activeIndexRef = useRef(0)
  const isPlayingRef = useRef(true)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayProgress, setAutoplayProgress] = useState(0)
  const [ended, setEnded] = useState(false)

  activeIndexRef.current = activeIndex
  isPlayingRef.current = isPlaying

  const goToSlide = useCallback(
    (index: number) => {
      const next = Math.min(Math.max(index, 0), slideCount - 1)
      setActiveIndex(next)
      setIsPlaying(true)
      setEnded(false)
      setAutoplayProgress(0)
    },
    [slideCount]
  )

  const goPrev = () => goToSlide(activeIndex - 1)
  const goNext = () => goToSlide(activeIndex + 1)

  const handleTogglePlay = useCallback(() => {
    if (ended) {
      goToSlide(0)
      const video = videoRefs.current[0]
      if (video) video.currentTime = 0
      return
    }
    setIsPlaying((playing) => !playing)
  }, [ended, goToSlide])

  const handleDotKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        goToSlide(index)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goToSlide(activeIndex - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        goToSlide(activeIndex + 1)
      }
    },
    [activeIndex, goToSlide]
  )

  const handleVideoRestart = () => {
    setIsPlaying(true)
  }

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStartX.current = touch.clientX
    touchStartY.current = touch.clientY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - touchStartX.current
    const dy = touch.clientY - touchStartY.current
    touchStartX.current = null
    touchStartY.current = null
    if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.2) return
    if (dx < 0) goNext()
    else goPrev()
  }

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      const slide = slides[i]
      if (slide?.kind === 'video' && slide.playbackRate) {
        video.playbackRate = slide.playbackRate
        video.defaultPlaybackRate = slide.playbackRate
      }
      const shouldPlay = i === activeIndex && isPlaying && controlsReady && !ended
      if (shouldPlay) {
        const playPromise = video.play()
        if (playPromise) playPromise.catch(() => {})
      } else {
        video.pause()
        if (i !== activeIndex) video.currentTime = 0
      }
    })
  }, [activeIndex, controlsReady, ended, isPlaying, slides])

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
        setEnded(true)
        setIsPlaying(false)
        setAutoplayProgress(1)
      }
    }

    const onTimeUpdate = () => {
      const playable = effectiveDuration()
      if (playable <= 0) return
      setAutoplayProgress(Math.min(1, video.currentTime / playable))
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

  const activeSlide = slides[activeIndex]
  const isPaused = !isPlaying

  return (
    <section
      ref={sectionRef}
      className="np1c-section np1c-aun-section np1c-section-size-1"
      data-dev-section="how-it-addresses"
      aria-label="Addressing Unmet Needs"
    >
      <div className="np1c-aun-section__stack">
        <div
          className="np1c-aun-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Addressing Unmet Needs feature highlights"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <CarouselVideoReplayButton
            getVideo={() => videoRefs.current[activeIndex]}
            onRestart={handleVideoRestart}
          />

          <div className="np1c-aun-carousel__viewport">
            <div
              className="np1c-aun-carousel__track"
              style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
            >
              {slides.map((slide, index) => {
                if (slide.kind !== 'video') return null
                const active = index === activeIndex
                return (
                  <div
                    key={slide.id}
                    id={`np1c-carousel-slide-${slide.id}`}
                    className={`np1c-aun-carousel__clip${index === 3 ? ' np1c-aun-carousel__clip--rounded' : ''}`}
                    aria-hidden={!active}
                    onClick={handleTogglePlay}
                  >
                    <VideoWithLoader
                      ref={(node) => {
                        videoRefs.current[index] = node
                      }}
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
                    {isPaused && active ? (
                      <span className="np1c-aun-carousel__play" aria-hidden>
                        <GiantPlayIcon />
                      </span>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>

          <p className="np1c-aun-carousel__caption" aria-live="polite">
            {activeSlide.caption}
          </p>
        </div>

        <CarouselControls
          variant="autoplay"
          slides={slides}
          activeIndex={activeIndex}
          isPlaying={isPlaying}
          ended={ended}
          autoplayProgress={autoplayProgress}
          controlsReady={controlsReady}
          loop={false}
          style={controlStyle}
          onSelectSlide={goToSlide}
          onPlayPause={handleTogglePlay}
          onDotKeyDown={handleDotKeyDown}
        />
      </div>
    </section>
  )
}
