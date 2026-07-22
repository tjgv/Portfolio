import { useEffect, useRef, useState } from 'react'
import { computeGrowOrbVars, growOrbStyle } from './carouselGrowAnimation'
import { clamp01, easeOutCubic } from './growRevealScrollUtils'
import { computeModalCloseRevealVars, ICON_BOUNCE_END } from './modalCloseRevealAnimation'

export const MODAL_CLOSE_ANIM_MS = 2800

export function useModalCloseGrowAnimation(active: boolean) {
  const [closeProgress, setCloseProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      startRef.current = null
    }

    if (reducedMotion) {
      stop()
      setCloseProgress(active ? 1 : 0)
      return
    }

    if (!active) {
      stop()
      setCloseProgress(0)
      return
    }

    stop()
    const tick = (now: number) => {
      if (startRef.current == null) startRef.current = now
      const t = clamp01((now - startRef.current) / MODAL_CLOSE_ANIM_MS)
      setCloseProgress(easeOutCubic(t))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return stop
  }, [active])

  const growOrbCssVars = growOrbStyle(computeGrowOrbVars(closeProgress))
  const closeReveal = computeModalCloseRevealVars(closeProgress)
  const closeReady = closeProgress >= ICON_BOUNCE_END

  return { closeProgress, growOrbCssVars, closeReveal, closeReady }
}
