import { useEffect, useRef, useState } from 'react'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import './solution-showcase-landing-hint.css'

const SCROLL_DISMISS_PX = 6
const EXIT_MS = 280

export function SolutionShowcaseLandingHint() {
  const { activeSolutionId } = useSolutionShowcase()
  const [shown, setShown] = useState(true)
  const [exiting, setExiting] = useState(false)
  const initialScrollY = useRef(0)
  const exitTimerRef = useRef(0)
  const active = shown && activeSolutionId === null

  useEffect(() => {
    if (!active || exiting) return

    initialScrollY.current = window.scrollY

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

  if (!active) return null

  return (
    <div
      className={[
        'solution-showcase-landing-hint',
        exiting ? 'solution-showcase-landing-hint--exiting' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className="solution-showcase-landing-hint__arrow" aria-hidden />
      <p className="solution-showcase-landing-hint__title">
        Solution walk throughs up here!
      </p>
      <p className="solution-showcase-landing-hint__body">
        Click any solution to walk through my design decisions.
      </p>
    </div>
  )
}
