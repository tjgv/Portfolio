import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { Minus, Plus } from 'lucide-react'
import { ImgWithLoader } from '../MediaLoader'
import { VideoWithLoader } from '../MediaLoader/VideoWithLoader'
import CarouselControls from './CarouselControls'
import CarouselVideoReplayButton from './CarouselVideoReplayButton'
import { useCarouselPillGrow } from './useCarouselPillGrow'
import './carouselGrowAnimation.css'
import './EditingCarousel.css'

type SlideBase = {
  id: string
  caption: string
  /** Body-2 paragraph shown on the card's flipped-over back face. */
  backText?: string
}
type VideoSlide = SlideBase & { type: 'video'; src: string }
type ImageSlide = SlideBase & { type: 'image'; src: string; alt: string; narrow?: boolean }
/** Gradient panel with centered inset video (MVP inspector slide). */
type PanelSlide = SlideBase & {
  type: 'panel'
  videoSrc: string
  videoAlt: string
  narrow?: boolean
}
export type CarouselSlide = VideoSlide | ImageSlide | PanelSlide

const FLIP_BUTTON_ICON_SIZE = 16
/** Dwell time for static image slides when autoplay controls are enabled. */
const IMAGE_DWELL_MS = 10_000

/**
 * SHELVED FEATURE — flip-to-reveal card details ("+" button in the top-right
 * corner of each slide, flips the media to a text-only back face). Revisit
 * later; the button, back-face markup, and CSS below are all still intact
 * and fully wired up — just flip this back to `true` to bring it back.
 */
const SHOW_FLIP_DETAILS_BUTTON = false

function slideHasVideo(slide: CarouselSlide): boolean {
  return slide.type === 'video' || slide.type === 'panel'
}

/** Ease-in-out cubic — feels natural and slower at start/end */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function FilledChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M8.75 2.75 4.5 7l4.25 4.25a.875.875 0 0 1-1.237 1.237L2.513 7.618a.875.875 0 0 1 0-1.237L7.513 1.513a.875.875 0 1 1 1.237 1.237Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function FilledChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M5.25 2.75 9.5 7 5.25 11.25a.875.875 0 0 0 1.237 1.237l4.999-4.999a.875.875 0 0 0 0-1.237L6.487 1.513A.875.875 0 0 0 5.25 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

export type ImageCarouselProps = {
  slides: readonly CarouselSlide[]
  ariaLabel: string
  /**
   * `autoplay` — Addressing Unmet Needs-style controls: play only the active
   * video, advance on end (or 10s dwell for images), progress dots + play orb.
   * `manual` — dots/arrows only (modal image carousels).
   */
  controlsVariant?: 'autoplay' | 'manual'
  /** Section root used for the scroll-triggered pill grow/reveal animation. */
  pillGrowSectionRef?: RefObject<HTMLElement | null>
}

/** Center-snap, trackpad-swipeable carousel with per-slide captions — shared by
 * the "Built for editing" page section and the "View Journey Maps" modal. */
export default function ImageCarousel({
  slides,
  ariaLabel,
  controlsVariant = 'manual',
  pillGrowSectionRef,
}: ImageCarouselProps) {
  const isAutoplay = controlsVariant === 'autoplay'
  const fallbackSectionRef = useRef<HTMLElement | null>(null)
  const sectionRef = pillGrowSectionRef ?? fallbackSectionRef
  const { controlsReady, controlStyle: pillControlStyle } = useCarouselPillGrow(
    sectionRef,
    isAutoplay
  )

  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const animRafRef = useRef<number | null>(null)
  const pendingSlideIndexRef = useRef<number | null>(null)
  const activeIndexRef = useRef(0)
  const isPlayingRef = useRef(true)
  const autoplayProgressRef = useRef(0)

  const [activeIndex, setActiveIndex] = useState(0)
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(() => new Set())
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayProgress, setAutoplayProgress] = useState(0)
  const [ended, setEnded] = useState(false)
  const didAutoStartRef = useRef(false)

  activeIndexRef.current = activeIndex
  isPlayingRef.current = isPlaying
  autoplayProgressRef.current = autoplayProgress

  // When the pill finishes growing in, start playback (same default as Addressing Unmet Needs).
  useEffect(() => {
    if (!isAutoplay || !controlsReady || ended || didAutoStartRef.current) return
    didAutoStartRef.current = true
    setIsPlaying(true)
  }, [isAutoplay, controlsReady, ended])

  const toggleFlip = useCallback((index: number) => {
    setFlippedIndices((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])
  const slideCount = slides.length
  /** Index of the narrow slide — used for JS width measurement */
  const NARROW_INDEX = slides.findIndex(
    (s) => (s.type === 'image' || s.type === 'panel') && s.narrow
  )

  const controlStyle = isAutoplay ? pillControlStyle : undefined

  // Compute track padding so each slide can be fully centred in the gallery
  const updatePadding = useCallback(() => {
    const gallery = galleryRef.current
    const track = trackRef.current
    const firstSlide = slideRefs.current[0]
    const lastSlide = slideRefs.current[slideCount - 1]
    if (!gallery || !track || !firstSlide || !lastSlide) return

    const gw = gallery.clientWidth
    track.style.paddingLeft = `${Math.max(0, (gw - firstSlide.offsetWidth) / 2)}px`
    track.style.paddingRight = `${Math.max(0, (gw - lastSlide.offsetWidth) / 2)}px`
  }, [slideCount])

  /**
   * CSS cannot constrain a flex-column's width to its image child rather than
   * its text child (caption). Measure the image's actual rendered width and
   * set the slide's explicit width so the caption wraps within it.
   */
  const syncNarrowWidth = useCallback(() => {
    const slide = slideRefs.current[NARROW_INDEX]
    if (!slide) return

    requestAnimationFrame(() => {
      const media = slide.querySelector<HTMLElement>(
        '.np1c-editing-carousel__panel, .np1c-editing-carousel__image'
      )
      if (!media) return
      const rect = media.getBoundingClientRect()
      if (rect.width > 0) {
        slide.style.width = `${Math.round(rect.width)}px`
        // The narrow frame otherwise shrink-wraps the media (width/height:
        // auto), which breaks the absolutely-positioned flip back-face.
        // Pin the frame to the media's rendered box so both faces (and the
        // container) share one fixed size that never changes on flip.
        const frame = frameRefs.current[NARROW_INDEX]
        if (frame) {
          frame.style.width = `${Math.round(rect.width)}px`
          frame.style.height = `${Math.round(rect.height)}px`
        }
        updatePadding()
      }
    })
  }, [NARROW_INDEX, updatePadding])

  useLayoutEffect(() => {
    syncNarrowWidth()
    updatePadding()
    const ro = new ResizeObserver(() => {
      syncNarrowWidth()
      updatePadding()
    })
    if (galleryRef.current) ro.observe(galleryRef.current)
    return () => ro.disconnect()
  }, [syncNarrowWidth, updatePadding])

  /** Custom smooth scroll — slower, ease-in-out, gives that premium feel */
  const smoothScrollTo = useCallback((targetLeft: number, duration = 950) => {
    const gallery = galleryRef.current
    if (!gallery) return

    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current)
      animRafRef.current = null
    }

    const startLeft = gallery.scrollLeft
    const distance = targetLeft - startLeft
    if (Math.abs(distance) < 1) {
      pendingSlideIndexRef.current = null
      return
    }

    let startTime: number | null = null

    const step = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      gallery.scrollLeft = startLeft + distance * easeInOutCubic(t)
      if (t < 1) {
        animRafRef.current = requestAnimationFrame(step)
      } else {
        animRafRef.current = null
        pendingSlideIndexRef.current = null
      }
    }

    animRafRef.current = requestAnimationFrame(step)
  }, [])

  const scrollToIndex = useCallback(
    (index: number) => {
      const slide = slideRefs.current[index]
      const gallery = galleryRef.current
      if (!slide || !gallery) return
      const target = slide.offsetLeft - (gallery.clientWidth - slide.offsetWidth) / 2
      smoothScrollTo(Math.max(0, target))
    },
    [smoothScrollTo]
  )

  const goToSlide = useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(slideCount - 1, index))
      pendingSlideIndexRef.current = next
      setActiveIndex(next)
      setAutoplayProgress(0)
      setEnded(false)
      scrollToIndex(next)
    },
    [scrollToIndex, slideCount]
  )

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

  const handlePlayPause = useCallback(() => {
    if (!isAutoplay) return
    if (ended) {
      goToSlide(0)
      setEnded(false)
      setIsPlaying(true)
      setAutoplayProgress(0)
      const video = videoRefs.current[0]
      if (video) video.currentTime = 0
      return
    }
    setIsPlaying((v) => !v)
  }, [ended, goToSlide, isAutoplay])

  const handleVideoRestart = useCallback(() => {
    if (!isAutoplay) return
    setEnded(false)
    setIsPlaying(true)
    setAutoplayProgress(0)
  }, [isAutoplay])

  // Sync active index from native trackpad scroll (no snap, so read scroll position)
  const syncFromScroll = useCallback(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    if (pendingSlideIndexRef.current !== null) return

    const center = gallery.scrollLeft + gallery.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      const sc = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(sc - center)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    if (closest !== activeIndexRef.current) {
      setActiveIndex(closest)
      setAutoplayProgress(0)
      setEnded(false)
    }
  }, [])

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    let rafId = 0
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(() => {
        rafId = 0
        syncFromScroll()
      })
    }
    gallery.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      gallery.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [syncFromScroll])

  // Play only the centered video; pause + reset the rest
  useEffect(() => {
    if (!isAutoplay) return

    const syncPlayback = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video) return
        const shouldPlay =
          i === activeIndex && isPlaying && controlsReady && !ended && slideHasVideo(slides[i]!)
        if (shouldPlay) {
          const playPromise = video.play()
          if (playPromise) playPromise.catch(() => {})
        } else {
          video.pause()
          if (i !== activeIndex) video.currentTime = 0
        }
      })
    }

    syncPlayback()

    const activeVideo = videoRefs.current[activeIndex]
    if (!activeVideo) return
    activeVideo.addEventListener('loadeddata', syncPlayback)
    activeVideo.addEventListener('canplay', syncPlayback)
    return () => {
      activeVideo.removeEventListener('loadeddata', syncPlayback)
      activeVideo.removeEventListener('canplay', syncPlayback)
    }
  }, [activeIndex, isPlaying, controlsReady, ended, isAutoplay, slides])

  // Drive progress + auto-advance from the active video
  useEffect(() => {
    if (!isAutoplay) return
    const slide = slides[activeIndex]
    if (!slide || !slideHasVideo(slide)) return
    const video = videoRefs.current[activeIndex]
    if (!video) return

    let advanced = false

    const advanceFromVideoEnd = () => {
      if (advanced || !isPlayingRef.current) return
      advanced = true
      video.pause()
      if (activeIndexRef.current >= slideCount - 1) {
        setEnded(true)
        setIsPlaying(false)
        setAutoplayProgress(1)
        return
      }
      goToSlide(activeIndexRef.current + 1)
    }

    const updateProgress = () => {
      const duration = video.duration
      if (!duration || !Number.isFinite(duration) || duration <= 0) return
      setAutoplayProgress(Math.min(1, video.currentTime / duration))
    }

    const onEnded = () => {
      advanceFromVideoEnd()
    }

    video.addEventListener('timeupdate', updateProgress)
    video.addEventListener('ended', onEnded)
    video.addEventListener('loadedmetadata', updateProgress)
    updateProgress()

    return () => {
      video.removeEventListener('timeupdate', updateProgress)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('loadedmetadata', updateProgress)
    }
  }, [activeIndex, goToSlide, isAutoplay, slideCount, slides])

  // 10s dwell for static image slides
  useEffect(() => {
    if (!isAutoplay) return
    const slide = slides[activeIndex]
    if (!slide || slide.type !== 'image') return
    if (!isPlaying || ended) return

    const progressAtStart = autoplayProgressRef.current
    const startTime = performance.now()
    let rafId = 0
    let advanced = false

    const tick = (now: number) => {
      if (!isPlayingRef.current) return
      const next = Math.min(1, progressAtStart + (now - startTime) / IMAGE_DWELL_MS)
      setAutoplayProgress(next)
      if (next >= 1) {
        if (advanced) return
        advanced = true
        if (activeIndexRef.current >= slideCount - 1) {
          setEnded(true)
          setIsPlaying(false)
          setAutoplayProgress(1)
          return
        }
        goToSlide(activeIndexRef.current + 1)
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [activeIndex, isPlaying, ended, isAutoplay, goToSlide, slideCount, slides])

  // Clean up animation on unmount
  useEffect(() => () => {
    if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current)
  }, [])

  return (
    <div className="np1c-editing-carousel__carousel">
      <div
        ref={galleryRef}
        className="np1c-editing-carousel__gallery"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <ul ref={trackRef} className="np1c-editing-carousel__track">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            const narrow =
              (slide.type === 'image' || slide.type === 'panel') && slide.narrow
            const flipped = flippedIndices.has(index)

            return (
              <li
                key={slide.id}
                id={`np1c-carousel-slide-${slide.id}`}
                ref={(node) => { slideRefs.current[index] = node }}
                className={[
                  'np1c-editing-carousel__slide',
                  isActive && 'np1c-editing-carousel__slide--active',
                  narrow && 'np1c-editing-carousel__slide--narrow',
                  flipped && 'np1c-editing-carousel__slide--flipped',
                ].filter(Boolean).join(' ')}
                aria-hidden={!isActive}
              >
                <div
                  className="np1c-editing-carousel__media-frame"
                  ref={(node) => { frameRefs.current[index] = node }}
                >
                  <div
                    className={`np1c-editing-carousel__flip${flipped ? ' np1c-editing-carousel__flip--back' : ''}`}
                  >
                    <div className="np1c-editing-carousel__flip-face np1c-editing-carousel__flip-face--front">
                      {slide.type === 'video' ? (
                        <div className="np1c-editing-carousel__video-wrap">
                          <VideoWithLoader
                            ref={(node) => { videoRefs.current[index] = node }}
                            className="np1c-editing-carousel__video"
                            src={slide.src}
                            muted
                            playsInline
                            preload="auto"
                            onLoad={updatePadding}
                            onLoadedMetadata={updatePadding}
                          />
                          <CarouselVideoReplayButton
                            getVideo={() => videoRefs.current[index]}
                            onRestart={() => {
                              if (index !== activeIndexRef.current) goToSlide(index)
                              handleVideoRestart()
                            }}
                          />
                        </div>
                      ) : slide.type === 'panel' ? (
                        <div className="np1c-editing-carousel__panel">
                          <div className="np1c-editing-carousel__video-wrap np1c-editing-carousel__video-wrap--panel">
                            <VideoWithLoader
                              ref={(node) => { videoRefs.current[index] = node }}
                              className="np1c-editing-carousel__panel-video"
                              src={slide.videoSrc}
                              muted
                              playsInline
                              preload="auto"
                              aria-label={slide.videoAlt}
                              onLoadedMetadata={narrow ? syncNarrowWidth : updatePadding}
                            />
                            <CarouselVideoReplayButton
                              getVideo={() => videoRefs.current[index]}
                              onRestart={() => {
                                if (index !== activeIndexRef.current) goToSlide(index)
                                handleVideoRestart()
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <ImgWithLoader
                          className="np1c-editing-carousel__image"
                          src={slide.src}
                          alt={slide.alt}
                          onLoad={narrow ? syncNarrowWidth : updatePadding}
                        />
                      )}
                    </div>

                    <div className="np1c-editing-carousel__flip-face np1c-editing-carousel__flip-face--back">
                      <p className="np1c-editing-carousel__flip-text">{slide.backText}</p>
                    </div>
                  </div>

                  {SHOW_FLIP_DETAILS_BUTTON && (
                    <button
                      type="button"
                      className="np1c-editing-carousel__flip-btn"
                      onClick={() => toggleFlip(index)}
                      aria-label={flipped ? 'Show media' : 'Show details'}
                      aria-pressed={flipped}
                    >
                      {flipped ? (
                        <Minus size={FLIP_BUTTON_ICON_SIZE} strokeWidth={2.25} aria-hidden />
                      ) : (
                        <Plus size={FLIP_BUTTON_ICON_SIZE} strokeWidth={2.25} aria-hidden />
                      )}
                    </button>
                  )}
                </div>

                <p className="np1c-editing-carousel__caption">
                  {slide.caption}
                </p>
              </li>
            )
          })}
        </ul>
      </div>

      <CarouselControls
        variant={isAutoplay ? 'autoplay' : 'manual'}
        slides={slides}
        activeIndex={activeIndex}
        isPlaying={isPlaying}
        ended={ended}
        autoplayProgress={autoplayProgress}
        controlsReady={controlsReady}
        loop={false}
        style={controlStyle}
        arrowPinRootRef={galleryRef}
        onSelectSlide={goToSlide}
        onPlayPause={isAutoplay ? handlePlayPause : undefined}
        onDotKeyDown={handleDotKeyDown}
      />
    </div>
  )
}
