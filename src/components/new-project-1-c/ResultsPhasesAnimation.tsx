import { useCallback, useEffect, useRef, useState } from 'react'
import './ResultsSection.css'

type PhaseTone = 'green' | 'yellow'

type Phase = {
  id: string
  label: string
  title: string
  status: string
  tone: PhaseTone
  borderStyle: 'solid' | 'dashed'
  /** Fraction (0–1) along the track where the traveling stroke "hits" this circle. */
  hitFraction: number
}

const PHASES: Phase[] = [
  {
    id: 'phase-1',
    label: 'Phase 1',
    title: 'Editing Mode',
    status: 'Complete',
    tone: 'green',
    borderStyle: 'solid',
    hitFraction: 0.15,
  },
  {
    id: 'phase-2',
    label: 'Phase 2',
    title: 'Run of Show',
    status: 'In Progress...',
    tone: 'green',
    borderStyle: 'dashed',
    hitFraction: 0.5,
  },
  {
    id: 'phase-3',
    label: 'Phase 3',
    title: 'iPad Support',
    status: 'Tentative',
    tone: 'yellow',
    borderStyle: 'solid',
    hitFraction: 0.85,
  },
]

const CIRCLE_FADE_MS = 550
const CIRCLE_STAGGER_MS = 260
const STROKE_START_DELAY_MS = 350
const STROKE_DURATION_MS = 1600

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

/**
 * Phased-rollout circle diagram — scroll-triggered reveal with a traveling
 * stroke that "lights up" each phase circle in turn. Shared between the full
 * case study page's Results section and the preview modal's condensed
 * Results block (via the `className` prop for layout/sizing overrides).
 *
 * `capStrokeAtLastCircle` measures the last circle's center and clips the
 * stroke's max width there, instead of letting it run to the container's
 * right edge — needed when the row doesn't stretch edge-to-edge (e.g. a
 * fixed gap that leaves trailing empty space).
 */
export default function ResultsPhasesAnimation({
  className,
  capStrokeAtLastCircle,
}: {
  className?: string
  capStrokeAtLastCircle?: boolean
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const strokeRef = useRef<HTMLDivElement>(null)
  const [strokeMaxWidth, setStrokeMaxWidth] = useState<number | null>(null)

  const [visibleCount, setVisibleCount] = useState(0)
  const [strokeProgress, setStrokeProgress] = useState(0)
  const [activated, setActivated] = useState<boolean[]>(() => PHASES.map(() => false))

  /** Mirrors state for synchronous reads inside timeouts / rAF without stale closures. */
  const phaseStateRef = useRef<'idle' | 'playing' | 'done'>('idle')
  const activatedRef = useRef<boolean[]>(PHASES.map(() => false))
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const rafIdRef = useRef<number | null>(null)
  const lastScrollYRef = useRef(0)
  const reducedMotionRef = useRef(false)

  const clearScheduled = useCallback(() => {
    timeoutIdsRef.current.forEach((id) => clearTimeout(id))
    timeoutIdsRef.current = []
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  const hardReset = useCallback(() => {
    clearScheduled()
    phaseStateRef.current = 'idle'
    activatedRef.current = PHASES.map(() => false)
    setVisibleCount(0)
    setStrokeProgress(0)
    setActivated(PHASES.map(() => false))
  }, [clearScheduled])

  const activatePhase = useCallback((index: number) => {
    if (activatedRef.current[index]) return
    activatedRef.current[index] = true
    setActivated((prev) => {
      const next = [...prev]
      next[index] = true
      return next
    })
  }, [])

  const startStroke = useCallback(() => {
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const p = clamp01(elapsed / STROKE_DURATION_MS)
      setStrokeProgress(p)

      PHASES.forEach((phase, i) => {
        if (p >= phase.hitFraction) activatePhase(i)
      })

      if (p < 1) {
        rafIdRef.current = requestAnimationFrame(tick)
      } else {
        rafIdRef.current = null
        phaseStateRef.current = 'done'
      }
    }

    rafIdRef.current = requestAnimationFrame(tick)
  }, [activatePhase])

  const playSequence = useCallback(() => {
    if (phaseStateRef.current !== 'idle') return
    phaseStateRef.current = 'playing'

    if (reducedMotionRef.current) {
      setVisibleCount(PHASES.length)
      setStrokeProgress(1)
      activatedRef.current = PHASES.map(() => true)
      setActivated(PHASES.map(() => true))
      phaseStateRef.current = 'done'
      return
    }

    PHASES.forEach((_, i) => {
      const id = setTimeout(() => setVisibleCount(i + 1), i * CIRCLE_STAGGER_MS)
      timeoutIdsRef.current.push(id)
    })

    const strokeStartAt = (PHASES.length - 1) * CIRCLE_STAGGER_MS + CIRCLE_FADE_MS + STROKE_START_DELAY_MS
    const strokeId = setTimeout(startStroke, strokeStartAt)
    timeoutIdsRef.current.push(strokeId)
  }, [startStroke])

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) playSequence()
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(section)

    // Already in view on mount (e.g. deep link / fast scroll)
    const rect = section.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      playSequence()
    }

    lastScrollYRef.current = window.scrollY

    let rafScrollId = 0
    const onScroll = () => {
      if (rafScrollId) return
      rafScrollId = requestAnimationFrame(() => {
        rafScrollId = 0
        const currentY = window.scrollY
        const scrollingUp = currentY < lastScrollYRef.current
        lastScrollYRef.current = currentY

        if (!scrollingUp || phaseStateRef.current === 'idle') return

        const sectionEl = sectionRef.current
        if (!sectionEl) return
        const sectionRect = sectionEl.getBoundingClientRect()
        const fullyBelowViewport = sectionRect.top >= window.innerHeight
        if (fullyBelowViewport) hardReset()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (rafScrollId) cancelAnimationFrame(rafScrollId)
      clearScheduled()
    }
  }, [playSequence, hardReset, clearScheduled])

  const measureStrokeMaxWidth = useCallback(() => {
    const strokeEl = strokeRef.current
    const listEl = listRef.current
    if (!strokeEl || !listEl) return
    const lastItem = listEl.lastElementChild as HTMLElement | null
    if (!lastItem) return
    const strokeLeft = strokeEl.getBoundingClientRect().left
    const lastRect = lastItem.getBoundingClientRect()
    const lastCenterX = lastRect.left + lastRect.width / 2
    const width = lastCenterX - strokeLeft
    if (width > 0) setStrokeMaxWidth(width)
  }, [])

  useEffect(() => {
    if (!capStrokeAtLastCircle) return
    measureStrokeMaxWidth()

    const container = sectionRef.current
    if (!container || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measureStrokeMaxWidth())
    ro.observe(container)
    return () => ro.disconnect()
  }, [capStrokeAtLastCircle, measureStrokeMaxWidth])

  return (
    <div
      ref={sectionRef}
      className={`np1c-results__phases${className ? ` ${className}` : ''}`}
    >
      <div
        ref={strokeRef}
        className="np1c-results__stroke"
        aria-hidden="true"
        style={{
          transform: `scaleX(${strokeProgress})`,
          ...(capStrokeAtLastCircle && strokeMaxWidth != null
            ? { width: `${strokeMaxWidth}px`, right: 'auto' }
            : null),
        }}
      />

      <ul ref={listRef} className="np1c-results__list">
        {PHASES.map((phase, i) => {
          const isVisible = i < visibleCount
          const isActivated = activated[i]

          return (
            <li
              key={phase.id}
              className={`np1c-results__item${isVisible ? ' np1c-results__item--visible' : ''}`}
            >
              <div
                className={[
                  'np1c-phase-circle',
                  `np1c-phase-circle--${phase.tone}`,
                  `np1c-phase-circle--${phase.borderStyle}`,
                  isActivated && 'np1c-phase-circle--activated',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <p className="np1c-phase-circle__label">{phase.label}</p>
                <p className="np1c-phase-circle__title">{phase.title}</p>
                <p
                  className={`np1c-phase-circle__status${isActivated ? ' np1c-phase-circle__status--visible' : ''}`}
                >
                  {phase.status}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
