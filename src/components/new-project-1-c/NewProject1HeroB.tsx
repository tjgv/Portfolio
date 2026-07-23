import { useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import { ImgWithLoader } from '../MediaLoader'
import HeroVideoLoop from './HeroVideoLoop'
import './NewProject1Hero.css'
import './NewProject1HeroB.css'

/** Center rising image — formerly the left-slide laptop. */
const HERO_DEVICE_IMAGE = '/new-project-1/laptop1.png'
const HERO_TITLE = 'Making CX Pro easy for anyone to pick up.'

preload(HERO_DEVICE_IMAGE, { as: 'image', fetchPriority: 'low' })

/** Short hold on the video before the handoff begins. */
const PHASE1_RUNWAY_VH = 5
/** Scroll distance for the device to rise from fully below → final rest. */
const PHASE2_IPAD_SCROLL_VH = 47.5
/** Scroll-driven shrink after the image lands. */
const PHASE3_SHRINK_VH = 20
/**
 * Start just below the viewport so the tip of the image enters as soon as
 * the rise begins (synced with the shadow).
 */
const IPAD_ENTRY_OFFSET_VH = 88
/** Final rest: prior was 5vh below center; raise endpoint by 10vh (5vh above center). */
const FINAL_LIFT_VH = 7 - 12 + 10
/** Pre-shrink size (35% larger than the original 1.0). */
const START_SCALE = 1.35
/** Prior settle; shrink amount cut by 50%. */
const PREV_SETTLE_SCALE = 0.729 * 1.12
const SETTLE_SCALE = START_SCALE - (START_SCALE - PREV_SETTLE_SCALE) * 0.5
/** Distance the title slides up during reveal (75% shorter than prior 56px). */
const TITLE_SLIDE_OFFSET_PX = 14
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
 * Variant B hero — fade + device rise (scroll), then shrink (scroll), then
 * title reveal. Uses plain CSS sticky only — no reverse/fixed overlay.
 */
export default function NewProject1HeroB() {
  const scrollRef = useRef<HTMLElement>(null)
  const [scrollPx, setScrollPx] = useState(0)
  const [titleProgress, setTitleProgress] = useState(0)

  const titleAnimStartedRef = useRef(false)
  const titleRafRef = useRef<number | null>(null)
  const titleDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Scroll-driven shrink (50% of prior delta).
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
    titleAnimStartedRef.current = false
    if (titleRafRef.current != null) cancelAnimationFrame(titleRafRef.current)
    if (titleDelayRef.current != null) clearTimeout(titleDelayRef.current)
    titleRafRef.current = null
    titleDelayRef.current = null
    setTitleProgress(0)
  }, [scrollPx])

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

  const washPresence = fadeOpacity
  const titleOpacity = easeOutHeavy(titleProgress) * washPresence

  /** Fade scroll cue out over the first ~12vh of scroll. */
  const scrollCueOpacity = clamp01(1 - scrollPx / Math.max(1, runwayPx(12)))

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
      className="np1c-hero-scroll np1c-hero-scroll--b"
      data-dev-section="hero"
      aria-label="Hero"
    >
      <div className="np1c-hero-b-stage">
        <div className="np1c-hero-b-sticky">
          <div className="np1c-hero__media" aria-hidden>
            <HeroVideoLoop opacity={videoOpacity} />
            <div
              className="np1c-hero__fade-from-bottom"
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

          <div className="np1c-handoff-stack np1c-handoff-stack--b">
            <div className="np1c-handoff-devices">
              <div
                className="np1c-handoff-ipad"
                style={{
                  transform: `translateY(${ipadTranslateY}px) scale(${imageScale})`,
                }}
              >
                <div className="np1c-handoff-ipad__inner">
                  <ImgWithLoader
                    src={HERO_DEVICE_IMAGE}
                    alt="CX Pro on laptop"
                    loading="eager"
                    fetchPriority="low"
                  />
                </div>
              </div>
            </div>
          </div>

          <h1
            className="np1c-hero__title np1c-hero__title--below-image np1c-type-hero-bold"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px)`,
            }}
          >
            {HERO_TITLE}
          </h1>

          <div
            className="np1c-hero-scroll-cue"
            style={{ opacity: scrollCueOpacity }}
            aria-hidden
          >
            <svg
              className="np1c-hero-scroll-cue__mouse"
              viewBox="0 0 24 36"
              fill="none"
              focusable="false"
            >
              <rect
                x="6"
                y="1.5"
                width="12"
                height="20"
                rx="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="12"
                y1="5.5"
                x2="12"
                y2="9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="np1c-hero-scroll-cue__arrow">
              <svg viewBox="0 0 24 12" fill="none" focusable="false">
                <path
                  d="M6 2.5l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
