import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'
import { ImgWithLoader } from '../MediaLoader'
import { AUTOPLAY_MS, type HighlightSlide } from './highlightsSlides'
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
  headline: string
  subhead?: string
  slides: HighlightSlide[]
  /** Section scroll progress (0–1) at which the open animation auto-starts. */
  sectionScrollHeight?: string
}

/** Duration for a full 0 → 1 open animation (ms). */
const OPEN_ANIM_MS = 5200
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
  headline,
  subhead,
  slides,
  sectionScrollHeight = '200vh',
}: HighlightsCarouselSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const progressRef = useRef<number | null>(null)
  const reducedMotionRef = useRef(false)
  const openProgressRef = useRef(0)
  const animRafRef = useRef<number | null>(null)
  const animStartTimeRef = useRef<number | null>(null)
  const animFromRef = useRef(0)
  const animToRef = useRef(1)
  const animTargetRef = useRef<number | null>(null)
  const pendingSlideIndexRef = useRef<number | null>(null)
  const closingGrowFadeRef = useRef(1)

  const [openProgress, setOpenProgress] = useState(0)
  const [closingGrowFade, setClosingGrowFade] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [autoplayProgress, setAutoplayProgress] = useState(0)
  const [ended, setEnded] = useState(false)

  const slideCount = slides.length
  const controlsReady = openProgress >= 0.76

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

  const scrollToSlide = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const slide = slideRefs.current[index]
    const gallery = galleryRef.current
    if (!slide || !gallery) return
    const left = slide.offsetLeft - (gallery.clientWidth - slide.clientWidth) / 2
    gallery.scrollTo({ left: Math.max(0, left), behavior })
  }, [])

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

    const pending = pendingSlideIndexRef.current
    if (pending !== null) {
      const slide = slideRefs.current[pending]
      if (!slide) return

      const center = gallery.scrollLeft + gallery.clientWidth / 2
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2
      if (Math.abs(slideCenter - center) < 6) {
        pendingSlideIndexRef.current = null
      }
      return
    }

    const center = gallery.scrollLeft + gallery.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2
      const dist = Math.abs(slideCenter - center)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotionRef.current) {
      openProgressRef.current = 1
      setOpenProgress(1)
    }
  }, [])

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

    gallery.addEventListener('scroll', onScroll, { passive: true })
    return () => gallery.removeEventListener('scroll', onScroll)
  }, [syncActiveFromScroll])

  useEffect(() => {
    if (!isPlaying || !controlsReady || ended) {
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
      return
    }

    let start: number | null = null

    const tick = (now: number) => {
      if (start == null) start = now
      const elapsed = now - start
      const progress = Math.min(1, elapsed / AUTOPLAY_MS)
      setAutoplayProgress(progress)

      if (progress >= 1) {
        if (activeIndex >= slideCount - 1) {
          setEnded(true)
          setIsPlaying(false)
          setAutoplayProgress(1)
          return
        }
        goToSlide(activeIndex + 1)
        start = null
      }

      progressRef.current = requestAnimationFrame(tick)
    }

    progressRef.current = requestAnimationFrame(tick)
    return () => {
      if (progressRef.current) cancelAnimationFrame(progressRef.current)
    }
  }, [isPlaying, controlsReady, ended, activeIndex, goToSlide, slideCount])

  const handlePlayPause = () => {
    if (ended) {
      goToSlide(0, 'auto')
      setEnded(false)
      setIsPlaying(true)
      setAutoplayProgress(0)
      return
    }
    setIsPlaying((v) => !v)
    if (!isPlaying) setAutoplayProgress(0)
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
      className="np1-section np1-carousel-section"
      data-dev-section={devSectionId}
      aria-label={ariaLabel}
      style={{ ['--carousel-section-height' as string]: sectionScrollHeight }}
    >
      <header className="np1-carousel-section__header">
        <div className="np1-section__inner">
          <h2 className="np1-carousel-section__headline">{headline}</h2>
          {subhead ? <p className="np1-carousel-section__subhead">{subhead}</p> : null}
        </div>
      </header>

      <div className="np1-carousel-section__body">
        <div
          ref={galleryRef}
          className="np1-carousel-section__gallery"
          role="region"
          aria-label={`${headline} slides`}
          tabIndex={0}
        >
          <ul className="np1-carousel-section__track">
            {slides.map((slide, index) => (
              <li
                key={slide.id}
                ref={(node) => {
                  slideRefs.current[index] = node
                }}
                id={`np1-carousel-slide-${slide.id}`}
                className={`np1-carousel-section__slide${index === activeIndex ? ' np1-carousel-section__slide--active' : ''}`}
                aria-hidden={index !== activeIndex}
              >
                <figure className="np1-carousel-section__media">
                  <ImgWithLoader
                    className="np1-carousel-section__image"
                    src={slide.image}
                    alt={slide.imageAlt}
                  />
                </figure>
              </li>
            ))}
          </ul>
        </div>

        <CarouselControls
          slides={slides}
          activeIndex={activeIndex}
          isPlaying={isPlaying}
          ended={ended}
          autoplayProgress={autoplayProgress}
          controlsReady={controlsReady}
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
