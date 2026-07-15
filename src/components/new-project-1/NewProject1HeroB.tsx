import { useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { ImgWithLoader, VideoWithLoader } from '../MediaLoader'
import './NewProject1Hero.css'
import './NewProject1HeroB.css'

const HERO_VIDEO = '/new-project-1/hero-video.mp4'
const INTRO_TABLET = '/new-project-1/intro-tablet.png'
const LAPTOP_IMAGE = '/new-project-1/laptop1.png'
const MAC_IMAGE = '/new-project-1/mac1.png'
const HERO_TITLE = 'Making CX Pro Accessible to a Broader Audience'

preload(HERO_VIDEO, { as: 'video', fetchPriority: 'high' })
preload(INTRO_TABLET, { as: 'image', fetchPriority: 'high' })
preload(LAPTOP_IMAGE, { as: 'image', fetchPriority: 'high' })
preload(MAC_IMAGE, { as: 'image', fetchPriority: 'high' })

/** Short hold on the video before the handoff begins. */
const PHASE1_RUNWAY_VH = 5
/** Scroll distance for the iPad to rise from fully below → final rest. */
const PHASE2_IPAD_SCROLL_VH = 47.5
/** Scroll-driven shrink after the image lands. */
const PHASE3_SHRINK_VH = 20
/**
 * Start just below the viewport so the tip of the image enters as soon as
 * the rise begins (synced with the shadow).
 */
const IPAD_ENTRY_OFFSET_VH = 88
/** Final rest was 7vh above center; drop the iPad endpoint by 12vh (5vh below center). */
const FINAL_LIFT_VH = 7 - 12
/** Pre-shrink size (35% larger than the original 1.0). */
const START_SCALE = 1.35
/** Final shrink size — 12% larger than prior 0.729 settle. */
const SETTLE_SCALE = 0.729 * 1.12
/** Distance the title slides up during reveal (75% shorter than prior 56px). */
const TITLE_SLIDE_OFFSET_PX = 14
/** How far side devices travel in from off-screen (as % of their width). */
const SIDE_SLIDE_FROM_PCT = 72
/** Fixed-duration side device slide-in (ms). */
const SIDE_SLIDE_MS = 1600
/** Rise progress at which the right device starts sliding in. */
const RIGHT_SLIDE_TRIGGER = 0.68
/** Shrink progress at which the left device starts sliding in. */
const LEFT_SLIDE_SHRINK_TRIGGER = 0.22
/** Shrink progress at which the title starts (before shrink fully finishes). */
const TITLE_SHRINK_TRIGGER = 0.82
/** Delay after title trigger before reveal starts (ms). */
const TITLE_REVEAL_DELAY_MS = 0
/** Fixed-duration title fade + slide-up (ms). */
const TITLE_REVEAL_MS = 1200

function easeOutHeavy(t: number): number {
  return 1 - (1 - t) ** 9
}

function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t)
}

function runwayPx(vh: number): number {
  return (window.innerHeight * vh) / 100
}

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t))
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Variant B hero — fade + iPad rise (scroll), then shrink (scroll), with
 * independently triggered timed side-slides + title reveal.
 * Uses plain CSS sticky only — no reverse/fixed overlay (that path could
 * re-pin itself and stick the hero over lower sections).
 */
export default function NewProject1HeroB() {
  const scrollRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const ipadRef = useRef<HTMLDivElement>(null)
  const [scrollPx, setScrollPx] = useState(0)
  const [leftProgress, setLeftProgress] = useState(0)
  const [rightProgress, setRightProgress] = useState(0)
  const [titleProgress, setTitleProgress] = useState(0)

  const rightAnimStartedRef = useRef(false)
  const leftAnimStartedRef = useRef(false)
  const titleAnimStartedRef = useRef(false)
  const rightRafRef = useRef<number | null>(null)
  const leftRafRef = useRef<number | null>(null)
  const titleRafRef = useRef<number | null>(null)
  const titleDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  useEffect(() => {
    let rafId = 0

    const update = () => {
      rafId = 0
      const el = scrollRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) {
        setScrollPx(0)
        return
      }
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), scrollable)
      setScrollPx(scrolled)
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  const phase1EndPx = runwayPx(PHASE1_RUNWAY_VH)
  const ipadScrollPx = runwayPx(PHASE2_IPAD_SCROLL_VH)
  const shrinkScrollPx = runwayPx(PHASE3_SHRINK_VH)
  const riseEndPx = phase1EndPx + ipadScrollPx

  const riseProgress =
    scrollPx <= phase1EndPx
      ? 0
      : Math.min(1, (scrollPx - phase1EndPx) / Math.max(1, ipadScrollPx))

  const shrinkProgress =
    scrollPx <= riseEndPx
      ? 0
      : Math.min(1, (scrollPx - riseEndPx) / Math.max(1, shrinkScrollPx))

  // Rise from below the fold → final rest.
  const entryOffsetPx = runwayPx(IPAD_ENTRY_OFFSET_VH)
  const finalLiftPx = runwayPx(FINAL_LIFT_VH)
  const ipadTranslateY = (1 - riseProgress) * entryOffsetPx - riseProgress * finalLiftPx

  // Scroll-driven shrink: 1.35 → ~0.816
  const easedShrink = easeOutQuint(shrinkProgress)
  const imageScale = START_SCALE - easedShrink * (START_SCALE - SETTLE_SCALE)

  // Shadow / video
  const fadeScrollPx = Math.max(0, scrollPx - phase1EndPx)
  const fadeDurationPx = (ipadScrollPx / 1.55) * 2
  const fadeDrive = Math.min(1, fadeScrollPx / Math.max(1, fadeDurationPx))
  const fadeOpacity = easeOutExpo(fadeDrive)
  const coverage = easeOutQuint(fadeDrive)
  const videoOpacity = 1 - easeOutQuint(Math.min(1, fadeDrive * 1.05))

  const runTimedProgress = (
    setProgress: (t: number) => void,
    rafRef: { current: number | null },
    durationMs: number
  ) => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = clamp01((now - start) / durationMs)
      setProgress(t)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Reset timed handoffs when the hero is fully rewound.
  useEffect(() => {
    if (scrollPx > 0) return
    rightAnimStartedRef.current = false
    leftAnimStartedRef.current = false
    titleAnimStartedRef.current = false
    if (rightRafRef.current != null) cancelAnimationFrame(rightRafRef.current)
    if (leftRafRef.current != null) cancelAnimationFrame(leftRafRef.current)
    if (titleRafRef.current != null) cancelAnimationFrame(titleRafRef.current)
    if (titleDelayRef.current != null) clearTimeout(titleDelayRef.current)
    rightRafRef.current = null
    leftRafRef.current = null
    titleRafRef.current = null
    titleDelayRef.current = null
    setLeftProgress(0)
    setRightProgress(0)
    setTitleProgress(0)
  }, [scrollPx])

  // Right slide: once the rising iPad is mostly on-screen — horizontal only.
  useEffect(() => {
    if (rightAnimStartedRef.current) return
    if (riseProgress < RIGHT_SLIDE_TRIGGER) return

    if (prefersReducedMotion()) {
      rightAnimStartedRef.current = true
      setRightProgress(1)
      return
    }

    rightAnimStartedRef.current = true
    runTimedProgress(setRightProgress, rightRafRef, SIDE_SLIDE_MS)
  }, [riseProgress])

  // Left slide: shortly after shrink begins — horizontal + fade.
  useEffect(() => {
    if (shrinkProgress < LEFT_SLIDE_SHRINK_TRIGGER || leftAnimStartedRef.current) return

    if (prefersReducedMotion()) {
      leftAnimStartedRef.current = true
      setLeftProgress(1)
      return
    }

    leftAnimStartedRef.current = true
    runTimedProgress(setLeftProgress, leftRafRef, SIDE_SLIDE_MS)
  }, [shrinkProgress])

  // Title: late in the shrink, slightly before it fully settles.
  const titleReady = shrinkProgress >= TITLE_SHRINK_TRIGGER
  useEffect(() => {
    if (!titleReady || titleAnimStartedRef.current) return

    if (prefersReducedMotion()) {
      titleAnimStartedRef.current = true
      setTitleProgress(1)
      return
    }

    titleDelayRef.current = setTimeout(() => {
      if (titleAnimStartedRef.current) return
      titleAnimStartedRef.current = true
      runTimedProgress(setTitleProgress, titleRafRef, TITLE_REVEAL_MS)
    }, TITLE_REVEAL_DELAY_MS)

    return () => {
      if (titleDelayRef.current != null) clearTimeout(titleDelayRef.current)
    }
  }, [titleReady])

  // Timed overlays fade with the wash on scroll-back.
  const washPresence = fadeOpacity
  const leftOpacity = easeOutHeavy(leftProgress) * washPresence
  const rightOpacity = easeOutHeavy(rightProgress) * washPresence
  const titleOpacity = easeOutHeavy(titleProgress) * washPresence

  const easedLeft = easeOutHeavy(leftProgress)
  const easedRight = easeOutHeavy(rightProgress)
  const leftSlideX = (1 - easedLeft) * -SIDE_SLIDE_FROM_PCT
  const rightSlideX = (1 - easedRight) * SIDE_SLIDE_FROM_PCT

  const easedTitle = easeOutHeavy(titleProgress)
  const titleTranslateY = (1 - easedTitle) * TITLE_SLIDE_OFFSET_PX

  const centerFill = Math.max(0, (coverage - 0.55) / 0.45)
  const holeClear = Math.max(0, 68 * (1 - coverage))
  const holeSoft = Math.min(100, holeClear + 14 * (1 - coverage) + coverage * 10)
  const holeMid = Math.min(100, holeSoft + 12 * (1 - coverage) + coverage * 14)
  const holeDark = Math.min(100, holeMid + 10 * (1 - coverage) + coverage * 22)

  const ellipseW = 150 + coverage * 30
  const ellipseH = 100 + coverage * 55
  const ellipseY = -10 + coverage * 18

  return (
    <section
      ref={scrollRef}
      className="np1-hero-scroll np1-hero-scroll--b"
      data-dev-section="hero"
      aria-label="Hero"
    >
      <div className="np1-hero-b-stage">
        <div className="np1-hero-b-sticky">
          <div className="np1-hero__media" aria-hidden>
            <VideoWithLoader
              ref={videoRef}
              className="np1-hero__video"
              src={HERO_VIDEO}
              style={{ opacity: videoOpacity }}
              fill
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <div
              className="np1-hero__fade-from-bottom"
              style={{
                opacity: fadeOpacity,
                background: `
                  radial-gradient(
                    ellipse ${ellipseW}% ${ellipseH}% at 50% ${ellipseY}%,
                    rgba(0, 0, 0, ${centerFill}) 0%,
                    rgba(0, 0, 0, ${centerFill}) ${holeClear}%,
                    rgba(0, 0, 0, ${Math.max(centerFill, 0.25 + coverage * 0.35)}) ${holeSoft}%,
                    rgba(0, 0, 0, ${Math.max(centerFill, 0.55 + coverage * 0.3)}) ${holeMid}%,
                    rgba(0, 0, 0, ${Math.max(centerFill, 0.85 + coverage * 0.15)}) ${holeDark}%,
                    #000 100%
                  )
                `,
              }}
            />
          </div>

          <div className="np1-handoff-stack np1-handoff-stack--b">
            <div className="np1-handoff-devices">
              <div
                className="np1-handoff-device np1-handoff-device--left"
                style={{
                  opacity: leftOpacity,
                  transform: `translateY(-50%) translateX(${leftSlideX}%)`,
                }}
              >
                <ImgWithLoader src={LAPTOP_IMAGE} alt="CX Pro on laptop" />
              </div>

              <div
                ref={ipadRef}
                className="np1-handoff-ipad"
                style={{
                  transform: `translateY(${ipadTranslateY}px) scale(${imageScale})`,
                }}
              >
                <div className="np1-handoff-ipad__inner">
                  <ImgWithLoader
                    src={INTRO_TABLET}
                    alt="Hands holding CX Pro on tablet"
                    fetchPriority="high"
                  />
                </div>
              </div>

              <div
                className="np1-handoff-device np1-handoff-device--right"
                style={{
                  opacity: rightOpacity,
                  transform: `translateY(-50%) translateX(${rightSlideX}%)`,
                }}
              >
                <ImgWithLoader src={MAC_IMAGE} alt="CX Pro on desktop" />
              </div>
            </div>
          </div>

          <h1
            className="np1-hero__title np1-hero__title--below-image"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`,
            }}
          >
            {HERO_TITLE}
          </h1>
        </div>
      </div>
    </section>
  )
}
