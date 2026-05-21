import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { SOLUTION_DEFINITIONS } from '../solution-showcase/solution-definitions'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import './solution-showcase-landing-hint.css'

const BOUNCE_MS = 2200
const SCROLL_DISMISS_PX = 6
const EXIT_MS = 280

type AnchorPoint = { top: number; left: number }

function useAnchorBelow(anchorRef: RefObject<HTMLButtonElement | null>, active: boolean) {
  const [point, setPoint] = useState<AnchorPoint | null>(null)

  const measure = useCallback(() => {
    const el = anchorRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPoint({
      top: rect.bottom + 10,
      left: rect.left + rect.width / 2,
    })
  }, [anchorRef])

  useLayoutEffect(() => {
    if (!active) {
      setPoint(null)
      return
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (anchorRef.current) ro.observe(anchorRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [active, measure, anchorRef])

  return point
}

type SolutionShowcaseLandingHintProps = {
  anchorRef: RefObject<HTMLButtonElement | null>
}

export function SolutionShowcaseLandingHint({
  anchorRef,
}: SolutionShowcaseLandingHintProps) {
  const { activeSolutionId } = useSolutionShowcase()
  const firstSolution = SOLUTION_DEFINITIONS[0]
  const [shown, setShown] = useState(true)
  const [bouncing, setBouncing] = useState(true)
  const [exiting, setExiting] = useState(false)
  const initialScrollY = useRef(0)
  const exitTimerRef = useRef(0)
  const active = shown && activeSolutionId === null
  const point = useAnchorBelow(anchorRef, active && !exiting)

  useEffect(() => {
    if (!active) return
    initialScrollY.current = window.scrollY
    const timer = window.setTimeout(() => setBouncing(false), BOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [active])

  useEffect(() => {
    if (!active || exiting) return

    const dismiss = () => {
      setExiting(true)
      window.clearTimeout(exitTimerRef.current)
      exitTimerRef.current = window.setTimeout(() => setShown(false), EXIT_MS)
    }

    const onScroll = () => {
      if (window.scrollY > initialScrollY.current + SCROLL_DISMISS_PX) {
        dismiss()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(exitTimerRef.current)
    }
  }, [active, exiting])

  useEffect(() => {
    if (activeSolutionId !== null) {
      setShown(false)
    }
  }, [activeSolutionId])

  if (!active || !point) return null

  const prefix = firstSolution.showcasePrefix ?? 'Solution 1:'

  return createPortal(
    <div
      className={[
        'solution-showcase-landing-hint',
        bouncing ? 'solution-showcase-landing-hint--bounce' : '',
        exiting ? 'solution-showcase-landing-hint--exiting' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ top: point.top, left: point.left }}
      role="status"
      aria-live="polite"
    >
      <span className="solution-showcase-landing-hint__arrow" aria-hidden />
      <p className="solution-showcase-landing-hint__title">Start the walkthrough</p>
      <p className="solution-showcase-landing-hint__body">
        Tap <strong>{prefix}</strong> {firstSolution.label} above to begin the guided
        walkthrough.
      </p>
    </div>,
    document.body,
  )
}
