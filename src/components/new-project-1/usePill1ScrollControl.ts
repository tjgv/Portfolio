import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'

const PILL_DOCK_BOTTOM_INSET = 24

export type Pill1ScrollControlConfig = {
  sectionRef: RefObject<HTMLElement | null>
  dockRef: RefObject<HTMLElement | null>
  /** When true, the grow animation may run. Defaults to section entering the viewport. */
  isInAnimZone?: (section: HTMLElement) => boolean
  /** When true, run the close animation. Defaults to section leaving the viewport. */
  shouldRetract?: (section: HTMLElement) => boolean
}

export function usePill1ScrollControl({
  sectionRef,
  dockRef,
  isInAnimZone: isInAnimZoneProp,
  shouldRetract: shouldRetractProp,
}: Pill1ScrollControlConfig) {
  const [controlsShown, setControlsShown] = useState(false)
  const [controlsPinned, setControlsPinned] = useState(false)
  /** Once the pill docks, it stays in-flow until the section fully leaves the viewport. */
  const hasDockedRef = useRef(false)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const isInAnimZone = useCallback(
    (section: HTMLElement) => isInAnimZoneProp?.(section) ?? isSectionInViewport(section),
    [isInAnimZoneProp]
  )

  const shouldRetract = useCallback(
    (section: HTMLElement) => shouldRetractProp?.(section) ?? isSectionOutOfViewport(section),
    [shouldRetractProp]
  )

  useEffect(() => {
    const sync = () => {
      const section = sectionRef.current
      const dock = dockRef.current
      if (!section || !dock) return

      const outOfView = isSectionOutOfViewport(section)

      if (outOfView) {
        hasDockedRef.current = false
        setControlsShown(false)
        setControlsPinned(false)
        return
      }

      const inZone = isInAnimZone(section)
      setControlsShown(inZone || hasDockedRef.current)

      if (prefersReducedMotion.current || hasDockedRef.current) {
        setControlsPinned(false)
        return
      }

      if (!inZone) {
        setControlsPinned(false)
        return
      }

      const dockRect = dock.getBoundingClientRect()
      const dockHeight = dock.offsetHeight || dock.getBoundingClientRect().height
      const pinLine = window.innerHeight - PILL_DOCK_BOTTOM_INSET - dockHeight
      const atDock = dockRect.top <= pinLine + 0.5

      if (atDock) {
        hasDockedRef.current = true
        setControlsPinned(false)
        return
      }

      // Pin only on the initial scroll-in; never re-pin after docking
      setControlsPinned(true)
    }

    sync()
    window.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      window.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sectionRef, dockRef, isInAnimZone])

  return {
    controlsShown,
    controlsPinned,
    isInAnimZone,
    shouldRetract,
  }
}
