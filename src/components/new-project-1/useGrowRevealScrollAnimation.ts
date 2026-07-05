import { useEffect, useRef, useState, type RefObject } from 'react'
import {
  computeGrowOrbClose,
  computeGrowOrbFade,
  computeGrowOrbVars,
  growOrbStyle,
  REVEAL_PHASE_START,
} from './carouselGrowAnimation'
import {
  ANIM_SCROLL_TRIGGER,
  clamp01,
  CLOSE_ANIM_MS,
  computeSectionScrollProgress,
  CONTROLS_READY_PROGRESS,
  easeOutCubic,
  lerp,
  OPEN_ANIM_DELAY_MS,
  OPEN_ANIM_MS,
  shouldRetractFromScroll,
} from './growRevealScrollUtils'

export type GrowRevealScrollConfig = {
  /** Observe scroll against this section instead of an internal ref. */
  sectionRef?: RefObject<HTMLElement | null>
  /** When true, the forward open animation may run. Defaults to section scroll progress ≥ 0.5. */
  isInAnimZone?: (section: HTMLElement) => boolean
  /** When true, run the close animation. Defaults to previous-section retract rule. */
  shouldRetract?: (section: HTMLElement) => boolean
  /** Delay before the open animation begins (ms). Defaults to OPEN_ANIM_DELAY_MS. */
  openAnimDelayMs?: number
  /** Skip the close animation and snap to hidden when retract fires. */
  instantRetract?: boolean
  /** Keep the control fully open until retract; no reverse animation on scroll-up. */
  holdOpenUntilRetract?: boolean
}

export function useGrowRevealScrollAnimation(config?: GrowRevealScrollConfig): {
  sectionRef: RefObject<HTMLElement | null>
  openProgress: number
  closingGrowFade: number
  controlsReady: boolean
  growOrbCssVars: Record<string, string | number>
} {
  const internalSectionRef = useRef<HTMLElement>(null)
  const sectionRef = config?.sectionRef ?? internalSectionRef
  const reducedMotionRef = useRef(false)
  const openProgressRef = useRef(0)
  const animRafRef = useRef<number | null>(null)
  const animStartTimeRef = useRef<number | null>(null)
  const animFromRef = useRef(0)
  const animToRef = useRef(1)
  const animTargetRef = useRef<number | null>(null)
  const closingGrowFadeRef = useRef(1)
  const configRef = useRef(config)
  configRef.current = config

  const [openProgress, setOpenProgress] = useState(0)
  const [closingGrowFade, setClosingGrowFade] = useState(1)

  const controlsReady = openProgress >= CONTROLS_READY_PROGRESS

  const growOrbCssVars =
    closingGrowFade < 0.999
      ? growOrbStyle(
          openProgress > REVEAL_PHASE_START
            ? computeGrowOrbClose(closingGrowFade)
            : computeGrowOrbFade(openProgress, closingGrowFade)
        )
      : growOrbStyle(computeGrowOrbVars(openProgress))

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

    const getScrollState = () => {
      const section = sectionRef.current
      if (!section) return { inZone: false, retract: false }
      const cfg = configRef.current
      const inZone =
        cfg?.isInAnimZone?.(section) ??
        computeSectionScrollProgress(section) >= ANIM_SCROLL_TRIGGER
      const retract = cfg?.shouldRetract?.(section) ?? shouldRetractFromScroll(section)
      return { inZone, retract }
    }

    const tryOpenFromScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const { inZone, retract } = getScrollState()
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
      }, configRef.current?.openAnimDelayMs ?? OPEN_ANIM_DELAY_MS)
    }

    const syncFromScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const { inZone, retract } = getScrollState()
      const current = openProgressRef.current
      const cfg = configRef.current

      if (retract) {
        clearOpenDelay()
        if (current <= 0.001) {
          animTargetRef.current = 0
          return
        }

        if (cfg?.instantRetract) {
          stopAnim()
          animTargetRef.current = 0
          closingGrowFadeRef.current = 1
          applyProgress(0)
          setClosingGrowFade(1)
          return
        }

        ensureAnimTarget(0)
        return
      }

      if (cfg?.holdOpenUntilRetract && current >= 0.999) {
        clearOpenDelay()
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
  }, [])

  return {
    sectionRef,
    openProgress,
    closingGrowFade,
    controlsReady,
    growOrbCssVars,
  }
}
