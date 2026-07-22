import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Minus, Plus } from 'lucide-react'
import { ImgWithLoader } from '../MediaLoader'
import { VideoWithLoader } from '../MediaLoader/VideoWithLoader'
import CarouselControls from './CarouselControls'
import './EditingCarousel.css'

type SlideBase = {
  id: string
  caption: string
  /** Body-2 paragraph shown on the card's flipped-over back face. */
  backText?: string
}
type VideoSlide = SlideBase & { type: 'video'; src: string }
type ImageSlide = SlideBase & { type: 'image'; src: string; alt: string; narrow?: boolean }
export type CarouselSlide = VideoSlide | ImageSlide

const FLIP_BUTTON_ICON_SIZE = 16

/**
 * SHELVED FEATURE — flip-to-reveal card details ("+" button in the top-right
 * corner of each slide, flips the media to a text-only back face). Revisit
 * later; the button, back-face markup, and CSS below are all still intact
 * and fully wired up — just flip this back to `true` to bring it back.
 */
const SHOW_FLIP_DETAILS_BUTTON = false

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
}

/** Center-snap, trackpad-swipeable carousel with per-slide captions — shared by
 * the "Built for editing" page section and the "View Journey Maps" modal. */
export default function ImageCarousel({ slides, ariaLabel }: ImageCarouselProps) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const animRafRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(() => new Set())

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
  const NARROW_INDEX = slides.findIndex((s) => s.type === 'image' && (s as ImageSlide).narrow)

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
      const img = slide.querySelector<HTMLImageElement>('img')
      if (!img || !img.naturalWidth) return
      const rect = img.getBoundingClientRect()
      if (rect.width > 0) {
        slide.style.width = `${Math.round(rect.width)}px`
        // The narrow frame otherwise shrink-wraps the image (width/height:
        // auto), which breaks the absolutely-positioned flip back-face.
        // Pin the frame to the image's rendered box so both faces (and the
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
    if (Math.abs(distance) < 1) return

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
      setActiveIndex(next)
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

  // Sync active index from native trackpad scroll (no snap, so read scroll position)
  const syncFromScroll = useCallback(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    const center = gallery.scrollLeft + gallery.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      const sc = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(sc - center)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    let rafId = 0
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; syncFromScroll() })
    }
    gallery.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      gallery.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [syncFromScroll])

  // Clean up animation on unmount
  useEffect(() => () => {
    if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current)
  }, [])

  return (
    <div className="np1-editing-carousel__carousel">
      <div
        ref={galleryRef}
        className="np1-editing-carousel__gallery"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <ul ref={trackRef} className="np1-editing-carousel__track">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            const narrow = slide.type === 'image' && slide.narrow
            const flipped = flippedIndices.has(index)

            return (
              <li
                key={slide.id}
                id={`np1-carousel-slide-${slide.id}`}
                ref={(node) => { slideRefs.current[index] = node }}
                className={[
                  'np1-editing-carousel__slide',
                  isActive && 'np1-editing-carousel__slide--active',
                  narrow && 'np1-editing-carousel__slide--narrow',
                  flipped && 'np1-editing-carousel__slide--flipped',
                ].filter(Boolean).join(' ')}
                aria-hidden={!isActive}
              >
                <div
                  className="np1-editing-carousel__media-frame"
                  ref={(node) => { frameRefs.current[index] = node }}
                >
                  <div
                    className={`np1-editing-carousel__flip${flipped ? ' np1-editing-carousel__flip--back' : ''}`}
                  >
                    <div className="np1-editing-carousel__flip-face np1-editing-carousel__flip-face--front">
                      {slide.type === 'video' ? (
                        <VideoWithLoader
                          className="np1-editing-carousel__video"
                          src={slide.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          onLoad={updatePadding}
                          onLoadedMetadata={updatePadding}
                        />
                      ) : (
                        <ImgWithLoader
                          className="np1-editing-carousel__image"
                          src={slide.src}
                          alt={slide.alt}
                          onLoad={narrow ? syncNarrowWidth : updatePadding}
                        />
                      )}
                    </div>

                    <div className="np1-editing-carousel__flip-face np1-editing-carousel__flip-face--back">
                      <p className="np1-editing-carousel__flip-text">{slide.backText}</p>
                    </div>
                  </div>

                  {SHOW_FLIP_DETAILS_BUTTON && (
                    <button
                      type="button"
                      className="np1-editing-carousel__flip-btn"
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

                <p className="np1-editing-carousel__caption">
                  {slide.caption}
                </p>
              </li>
            )
          })}
        </ul>
      </div>

      <CarouselControls
        variant="manual"
        slides={slides}
        activeIndex={activeIndex}
        loop={false}
        arrowPinRootRef={galleryRef}
        onSelectSlide={goToSlide}
        onDotKeyDown={handleDotKeyDown}
      />
    </div>
  )
}
