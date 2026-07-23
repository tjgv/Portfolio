import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { ImgWithLoader, VideoWithLoader } from '../MediaLoader'
import { type HighlightSlide } from './highlightsSlides'
import {
  computeGrowOrbVars,
  computeGrowOrbClose,
  computeGrowOrbFade,
  growOrbStyle,
  REVEAL_PHASE_START,
} from './carouselGrowAnimation'
import { computeCarouselRevealVars } from './carouselRevealAnimation'
import CarouselControls from './CarouselControls'
import './carouselGrowAnimation.css'
import './HighlightsCarouselSection.css'

export type HighlightsCarouselSectionProps = {
  devSectionId: string
  ariaLabel: string
  /** Sub-header above the headline (subheader-1). */
  label?: string
  headline: string
  /** Body copy under the headline (body-1). */
  body?: string
  slides: HighlightSlide[]
}

/** Duration for a full 0 → 1 open animation (ms). 75% faster than prior 5200ms. */
const OPEN_ANIM_MS = 1300
/** Fast close — reverse reveal + fade grow orb (ms). */
const CLOSE_ANIM_MS = 550
/** Wait after scroll trigger before the open animation begins (ms). */
const OPEN_ANIM_DELAY_MS = 500
/** Section scroll progress threshold that triggers the forward animation. */
const ANIM_SCROLL_TRIGGER = 0.5
/** Previous section must show this much (vh) in the viewport to trigger retract. */
const RETRACT_PREV_SECTION_VISIBLE_VH = 25

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2
}

function parseAspectRatio(ratio: string): { w: number; h: number } | null {
  const match = ratio.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
  if (!match) return null
  return { w: Number(match[1]), h: Number(match[2]) }
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function computeSectionScrollProgress(section: HTMLElement): number {
  const vh = window.innerHeight
  const sectionTop = section.offsetTop
  const sectionHeight = section.offsetHeight
  const scrollY = window.scrollY

  const scrollStart = sectionTop - vh
  const scrollEnd = sectionTop + sectionHeight - vh
  const scrollRange = Math.max(1, scrollEnd - scrollStart)

  return clamp01((scrollY - scrollStart) / scrollRange)
}

function getPreviousSection(section: HTMLElement): HTMLElement | null {
  let el = section.previousElementSibling
  while (el) {
    if (el instanceof HTMLElement && (el.tagName === 'SECTION' || el.hasAttribute('data-dev-section'))) {
      return el
    }
    el = el.previousElementSibling
  }
  return null
}

function getElementVisibleHeightPx(element: HTMLElement): number {
  const rect = element.getBoundingClientRect()
  const vh = window.innerHeight
  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(vh, rect.bottom)
  return Math.max(0, visibleBottom - visibleTop)
}

function shouldRetractFromScroll(section: HTMLElement): boolean {
  const prevSection = getPreviousSection(section)
  if (!prevSection) return false
  const thresholdPx = (RETRACT_PREV_SECTION_VISIBLE_VH / 100) * window.innerHeight
  return getElementVisibleHeightPx(prevSection) >= thresholdPx
}

export default function HighlightsCarouselSection({
  devSectionId,
  ariaLabel,
  label,
  headline,
  body,
  slides,
}: HighlightsCarouselSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const reducedMotionRef = useRef(false)
  const openProgressRef = useRef(0)
  const animRafRef = useRef<number | null>(null)
  const animStartTimeRef = useRef<number | null>(null)
  const animFromRef = useRef(0)
  const animToRef = useRef(1)
  const animTargetRef = useRef<number | null>(null)
  const pendingSlideIndexRef = useRef<number | null>(null)
  const scrollAnimRafRef = useRef<number | null>(null)
  const closingGrowFadeRef = useRef(1)
  const activeIndexRef = useRef(0)
  const isPlayingRef = useRef(true)

  const [openProgress, setOpenProgress] = useState(0)
  const [closingGrowFade, setClosingGrowFade] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayProgress, setAutoplayProgress] = useState(0)
  const [ended, setEnded] = useState(false)

  const slideCount = slides.length
  const controlsReady = openProgress >= 0.76

  activeIndexRef.current = activeIndex
  isPlayingRef.current = isPlaying

  const controlStyle: CSSProperties = {
    ...(closingGrowFade < 0.999
      ? growOrbStyle(
          openProgress > REVEAL_PHASE_START
            ? computeGrowOrbClose(closingGrowFade)
            : computeGrowOrbFade(openProgress, closingGrowFade)
        )
      : growOrbStyle(computeGrowOrbVars(openProgress))),
    ...computeCarouselRevealVars(openProgress),
  }

  const updateCenterPadding = useCallback(() => {
    const gallery = galleryRef.current
    const track = trackRef.current
    const first = slideRefs.current[0]
    const last = slideRefs.current[slideCount - 1]
    if (!gallery || !track || !first || !last) return
    const gw = gallery.clientWidth
    track.style.paddingLeft = `${Math.max(0, (gw - first.offsetWidth) / 2)}px`
    track.style.paddingRight = `${Math.max(0, (gw - last.offsetWidth) / 2)}px`
  }, [slideCount])

  const cancelScrollAnim = useCallback(() => {
    if (scrollAnimRafRef.current != null) {
      cancelAnimationFrame(scrollAnimRafRef.current)
      scrollAnimRafRef.current = null
    }
    if (galleryRef.current) {
      galleryRef.current.style.scrollSnapType = ''
    }
  }, [])

  const smoothScrollTo = useCallback(
    (targetLeft: number, duration = 720) => {
      const gallery = galleryRef.current
      if (!gallery) return

      cancelScrollAnim()

      const startLeft = gallery.scrollLeft
      const distance = targetLeft - startLeft
      if (Math.abs(distance) < 1) {
        pendingSlideIndexRef.current = null
        return
      }

      // Disable snap during programmatic scroll so it can't fight the animation
      gallery.style.scrollSnapType = 'none'

      const finish = () => {
        gallery.scrollLeft = targetLeft
        gallery.style.scrollSnapType = ''
        scrollAnimRafRef.current = null
        pendingSlideIndexRef.current = null
      }

      if (reducedMotionRef.current || duration <= 0) {
        finish()
        return
      }

      let startTime: number | null = null
      const step = (now: number) => {
        if (startTime === null) startTime = now
        const t = Math.min(1, (now - startTime) / duration)
        gallery.scrollLeft = startLeft + distance * easeInOutCubic(t)
        if (t < 1) {
          scrollAnimRafRef.current = requestAnimationFrame(step)
        } else {
          finish()
        }
      }
      scrollAnimRafRef.current = requestAnimationFrame(step)
    },
    [cancelScrollAnim]
  )

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const slide = slideRefs.current[index]
      const gallery = galleryRef.current
      if (!slide || !gallery) return
      const left = slide.offsetLeft - (gallery.clientWidth - slide.offsetWidth) / 2
      const target = Math.max(0, left)
      if (behavior === 'auto') {
        cancelScrollAnim()
        gallery.style.scrollSnapType = 'none'
        gallery.scrollLeft = target
        // Re-enable snap on next frame so the settled position sticks
        requestAnimationFrame(() => {
          if (galleryRef.current) galleryRef.current.style.scrollSnapType = ''
        })
        pendingSlideIndexRef.current = null
        return
      }
      smoothScrollTo(target)
    },
    [cancelScrollAnim, smoothScrollTo]
  )

  const goToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const next = ((index % slideCount) + slideCount) % slideCount
      pendingSlideIndexRef.current = next
      setActiveIndex(next)
      setAutoplayProgress(0)
      setEnded(false)
      scrollToSlide(next, behavior)
    },
    [scrollToSlide, slideCount]
  )

  const syncActiveFromScroll = useCallback(() => {
    const gallery = galleryRef.current
    if (!gallery) return

    // Ignore scroll while a programmatic slide change is animating
    if (pendingSlideIndexRef.current !== null) return

    const center = gallery.scrollLeft + gallery.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(slideCenter - center)
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

  useLayoutEffect(() => {
    updateCenterPadding()
    const gallery = galleryRef.current
    if (!gallery) return
    const ro = new ResizeObserver(() => updateCenterPadding())
    ro.observe(gallery)
    return () => ro.disconnect()
  }, [updateCenterPadding, slideCount])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotionRef.current) {
      openProgressRef.current = 1
      setOpenProgress(1)
    }
  }, [])

  useEffect(() => () => cancelScrollAnim(), [cancelScrollAnim])

  useEffect(() => {
    if (reducedMotionRef.current) return

    const stopAnim = () => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current)
      animRafRef.current = null
      animStartTimeRef.current = null
    }

    const applyProgress = (p: number) => {
      const next = clamp01(p)
      openProgressRef.current = next
      setOpenProgress(next)
    }

    const runAnimTo = (target: number) => {
      const from = openProgressRef.current

      if (Math.abs(from - target) < 0.001) {
        animTargetRef.current = target
        applyProgress(target)
        return
      }

      stopAnim()
      animFromRef.current = from
      animToRef.current = target
      animTargetRef.current = target

      if (target === 0 && from > 0.001) {
        const inGrowOnly = from <= REVEAL_PHASE_START
        const closeEnd = inGrowOnly ? 0 : REVEAL_PHASE_START
        const progressSpan = inGrowOnly ? REVEAL_PHASE_START : 1 - REVEAL_PHASE_START
        const duration =
          CLOSE_ANIM_MS * (Math.abs(from - closeEnd) / Math.max(0.001, progressSpan))

        const tick = (now: number) => {
          if (animStartTimeRef.current == null) animStartTimeRef.current = now
          const t =
            duration <= 0 ? 1 : clamp01((now - animStartTimeRef.current) / duration)
          const eased = easeOutCubic(t)
          const p = lerp(from, closeEnd, eased)
          const fade = 1 - eased

          openProgressRef.current = p
          closingGrowFadeRef.current = fade
          setOpenProgress(p)
          setClosingGrowFade(fade)

          if (t < 1) {
            animRafRef.current = requestAnimationFrame(tick)
          } else {
            openProgressRef.current = 0
            closingGrowFadeRef.current = 1
            setOpenProgress(0)
            setClosingGrowFade(1)
            animRafRef.current = null
            animStartTimeRef.current = null
          }
        }

        animRafRef.current = requestAnimationFrame(tick)
        return
      }

      closingGrowFadeRef.current = 1
      setClosingGrowFade(1)

      const tick = (now: number) => {
        if (animStartTimeRef.current == null) animStartTimeRef.current = now
        const duration = OPEN_ANIM_MS * Math.abs(animToRef.current - animFromRef.current)
        const t = duration <= 0 ? 1 : clamp01((now - animStartTimeRef.current) / duration)
        const p = lerp(animFromRef.current, animToRef.current, easeOutCubic(t))

        openProgressRef.current = p
        setOpenProgress(p)

        if (t < 1) {
          animRafRef.current = requestAnimationFrame(tick)
        } else {
          animRafRef.current = null
          animStartTimeRef.current = null
        }
      }

      animRafRef.current = requestAnimationFrame(tick)
    }

    const ensureAnimTarget = (target: number) => {
      if (animTargetRef.current === target && animRafRef.current != null) return
      if (Math.abs(openProgressRef.current - target) < 0.001) {
        animTargetRef.current = target
        return
      }
      runAnimTo(target)
    }

    const tryOpenFromScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const inZone = computeSectionScrollProgress(section) >= ANIM_SCROLL_TRIGGER
      const retract = shouldRetractFromScroll(section)
      if (inZone && !retract && openProgressRef.current < 0.999) {
        ensureAnimTarget(1)
      }
    }

    let openDelayId: ReturnType<typeof setTimeout> | null = null

    const clearOpenDelay = () => {
      if (openDelayId != null) {
        clearTimeout(openDelayId)
        openDelayId = null
      }
    }

    const resetCloseFade = () => {
      if (closingGrowFadeRef.current >= 0.999) return
      closingGrowFadeRef.current = 1
      setClosingGrowFade(1)
    }

    const cancelCloseAnim = () => {
      if (animTargetRef.current !== 0 || animRafRef.current == null) return false
      stopAnim()
      animTargetRef.current = null
      resetCloseFade()
      return true
    }

    /** @param immediate Skip the entry delay (e.g. when resuming after a cancelled close). */
    const scheduleOpenAnim = (immediate = false) => {
      if (animRafRef.current != null && animTargetRef.current === 1) return

      if (immediate) {
        clearOpenDelay()
        tryOpenFromScroll()
        return
      }

      if (openDelayId != null) return

      openDelayId = setTimeout(() => {
        openDelayId = null
        tryOpenFromScroll()
      }, OPEN_ANIM_DELAY_MS)
    }

    const syncFromScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const inZone = computeSectionScrollProgress(section) >= ANIM_SCROLL_TRIGGER
      const retract = shouldRetractFromScroll(section)
      const current = openProgressRef.current

      if (retract) {
        clearOpenDelay()
        if (current > 0.001) {
          ensureAnimTarget(0)
        } else {
          animTargetRef.current = 0
        }
        return
      }

      const wasClosing = inZone ? cancelCloseAnim() : false

      if (inZone && openProgressRef.current < 0.999) {
        const resumeFromPartial = openProgressRef.current > 0.01
        scheduleOpenAnim(wasClosing || resumeFromPartial)
      } else {
        clearOpenDelay()
      }
    }

    let scrollRafId = 0
    const onScroll = () => {
      if (!scrollRafId) scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0
        syncFromScroll()
      })
    }

    syncFromScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', syncFromScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', syncFromScroll)
      if (scrollRafId) cancelAnimationFrame(scrollRafId)
      clearOpenDelay()
      stopAnim()
    }
  }, [])

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return

    let rafId = 0
    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0
          syncActiveFromScroll()
        })
      }
    }

    // User-driven scroll cancels programmatic animation so snap feels native
    const onPointerDown = () => {
      cancelScrollAnim()
      pendingSlideIndexRef.current = null
    }
    const onWheel = () => {
      cancelScrollAnim()
      pendingSlideIndexRef.current = null
    }

    gallery.addEventListener('scroll', onScroll, { passive: true })
    gallery.addEventListener('pointerdown', onPointerDown)
    gallery.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      gallery.removeEventListener('scroll', onScroll)
      gallery.removeEventListener('pointerdown', onPointerDown)
      gallery.removeEventListener('wheel', onWheel)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [syncActiveFromScroll, cancelScrollAnim])

  // Play only the centered video; pause + reset the rest
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
        if (i !== activeIndex) {
          video.currentTime = 0
        }
      }
    })
  }, [activeIndex, isPlaying, controlsReady, ended, slides])

  // Drive progress bar from the active video's currentTime / duration
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
      if (activeIndexRef.current >= slideCount - 1) {
        setEnded(true)
        setIsPlaying(false)
        setAutoplayProgress(1)
        return
      }
      goToSlide(activeIndexRef.current + 1)
    }

    const updateProgress = () => {
      const playable = effectiveDuration()
      if (playable <= 0) return
      if (endTrim > 0 && video.currentTime >= playable) {
        setAutoplayProgress(1)
        advanceFromVideoEnd()
        return
      }
      setAutoplayProgress(Math.min(1, video.currentTime / playable))
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
  }, [activeIndex, goToSlide, slideCount, slides])

  const handlePlayPause = () => {
    if (ended) {
      goToSlide(0, 'auto')
      setEnded(false)
      setIsPlaying(true)
      setAutoplayProgress(0)
      const video = videoRefs.current[0]
      if (video) video.currentTime = 0
      return
    }
    setIsPlaying((v) => !v)
  }

  const handleDotKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToSlide(index)
      setIsPlaying(false)
    }
  }

  return (
    <section
      ref={sectionRef}
      className="np1c-section np1c-carousel-section"
      data-dev-section={devSectionId}
      aria-label={ariaLabel}
    >
      <header className="np1c-carousel-section__header">
        <div className="np1c-section__inner np1c-carousel-section__copy">
          {label ? <p className="np1c-carousel-section__label">{label}</p> : null}
          <h2 className="np1c-carousel-section__headline">{headline}</h2>
          {body ? <p className="np1c-carousel-section__lede">{body}</p> : null}
        </div>
      </header>

      <div className="np1c-carousel-section__body">
        <div
          ref={galleryRef}
          className="np1c-carousel-section__gallery"
          role="region"
          aria-label={`${headline} slides`}
          tabIndex={0}
        >
          <ul ref={trackRef} className="np1c-carousel-section__track">
            {slides.map((slide, index) => {
              const isNarrow = slide.kind === 'video' && slide.narrow
              const aspect = slide.kind === 'video' && slide.aspectRatio
                ? parseAspectRatio(slide.aspectRatio)
                : null
              // Match default frame height (1920×1046); shrink width to this slide's aspect
              const narrowStyle =
                isNarrow && aspect
                  ? ({
                      ['--carousel-narrow-aspect' as string]: `${aspect.w} / ${aspect.h}`,
                      ['--carousel-narrow-basis' as string]: `calc(var(--carousel-slide-width) * ${aspect.w} * 1046 / (${aspect.h} * 1920))`,
                    } as CSSProperties)
                  : undefined
              return (
              <li
                key={slide.id}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                id={`np1c-carousel-slide-${slide.id}`}
                className={`np1c-carousel-section__slide${isNarrow ? ' np1c-carousel-section__slide--narrow' : ''}${index === activeIndex ? ' np1c-carousel-section__slide--active' : ''}`}
                style={narrowStyle}
                aria-hidden={index !== activeIndex}
              >
                <div className="np1c-carousel-section__media-slot">
                  <figure
                    className={`np1c-carousel-section__media${slide.kind === 'video' ? ' np1c-carousel-section__media--video' : ''}`}
                  >
                    {slide.kind === 'video' ? (
                      <VideoWithLoader
                        ref={(node) => {
                          videoRefs.current[index] = node
                        }}
                        className="np1c-carousel-section__video"
                        src={slide.src}
                        aria-label={slide.ariaLabel}
                        style={
                          slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined
                        }
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
                    ) : (
                      <ImgWithLoader
                        className="np1c-carousel-section__image"
                        src={slide.image}
                        alt={slide.imageAlt}
                      />
                    )}
                  </figure>
                </div>
                <p className="np1c-carousel-section__caption">{slide.caption}</p>
              </li>
              )
            })}
          </ul>
        </div>

        <CarouselControls
          slides={slides}
          activeIndex={activeIndex}
          isPlaying={isPlaying}
          ended={ended}
          autoplayProgress={autoplayProgress}
          controlsReady={controlsReady}
          arrowPinRootRef={galleryRef}
          loop={false}
          style={controlStyle}
          onSelectSlide={goToSlide}
          onPauseAutoplay={() => setIsPlaying(false)}
          onPlayPause={handlePlayPause}
          onDotKeyDown={handleDotKeyDown}
        />
      </div>
    </section>
  )
}
