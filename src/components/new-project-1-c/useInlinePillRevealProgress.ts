import { useEffect, useRef, useState, type RefObject } from 'react'
import { clamp01, easeOutCubic } from './growRevealScrollUtils'

const INLINE_PILL_ANIM_MS = 1400
const PILL_REVEAL_VISIBLE_RATIO = 0.15

function isPillInView(pill: HTMLElement): boolean {
  const vh = window.innerHeight
  const rect = pill.getBoundingClientRect()
  if (rect.height <= 0) return false

  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(vh, rect.bottom)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)

  return visibleHeight / rect.height >= PILL_REVEAL_VISIBLE_RATIO
}

/** Plays 0→1 once the pill is at least 15% within the viewport. */
export function useInlinePillRevealProgress(
  sectionRef: RefObject<HTMLElement | null>,
  pillRef: RefObject<HTMLElement | null>,
) {
  const [progress, setProgress] = useState(0)
  const startedRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return stop
    }

    const runAnimation = () => {
      if (startedRef.current) return
      startedRef.current = true
      const startTime = performance.now()

      const tick = (now: number) => {
        const t = clamp01((now - startTime) / INLINE_PILL_ANIM_MS)
        setProgress(easeOutCubic(t))
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          rafRef.current = null
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    const sync = () => {
      const pill = pillRef.current
      if (pill && isPillInView(pill)) runAnimation()
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      stop()
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sectionRef, pillRef])

  return progress
}
