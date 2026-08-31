import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import {
  computeGrowOrbClose,
  computeGrowOrbFade,
  computeGrowOrbVars,
  growOrbStyle,
  REVEAL_PHASE_START,
} from './carouselGrowAnimation'
import { computeCarouselRevealVars } from './carouselRevealAnimation'

/** Duration for a full 0 → 1 open animation (ms). */
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

export type CarouselPillGrow = {
  openProgress: number
  controlsReady: boolean
  controlStyle: CSSProperties
}

/**
 * Scroll-triggered grow/reveal for carousel control pills
 * (Addressing Unmet Needs / MVP Priorities).
 */
export function useCarouselPillGrow(
  sectionRef: RefObject<HTMLElement | null>,
  enabled = true
): CarouselPillGrow {
  const reducedMotionRef = useRef(false)
  const openProgressRef = useRef(0)
  const animRafRef = useRef<number | null>(null)
  const animStartTimeRef = useRef<number | null>(null)
  const animFromRef = useRef(0)
  const animToRef = useRef(1)
  const animTargetRef = useRef<number | null>(null)
  const closingGrowFadeRef = useRef(1)

  const [openProgress, setOpenProgress] = useState(0)
  const [closingGrowFade, setClosingGrowFade] = useState(1)

  const controlsReady = !enabled || openProgress >= 0.76

  const controlStyle: CSSProperties = enabled
    ? ({
        ...(closingGrowFade < 0.999
          ? growOrbStyle(
              openProgress > REVEAL_PHASE_START
                ? computeGrowOrbClose(closingGrowFade)
                : computeGrowOrbFade(openProgress, closingGrowFade)
            )
          : growOrbStyle(computeGrowOrbVars(openProgress))),
        ...computeCarouselRevealVars(openProgress),
      } as CSSProperties)
    : {}

  useEffect(() => {
    if (!enabled) {
      openProgressRef.current = 1
      setOpenProgress(1)
      return
    }

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotionRef.current) {
      openProgressRef.current = 1
      setOpenProgress(1)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || reducedMotionRef.current) return

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
      if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(() => {
          scrollRafId = 0
          syncFromScroll()
        })
      }
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
  }, [enabled, sectionRef])

  return { openProgress, controlsReady, controlStyle }
}
