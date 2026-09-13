import { useCallback, useEffect, useState } from 'react'
import './NavStudyProgress.css'

export type NavCheckpoint = {
  id: string
  label: string
  selector: string
}

export const CONSUMER_CX_PRO_CHECKPOINTS: readonly NavCheckpoint[] = [
  { id: 'context', label: 'Context', selector: '[data-dev-section="hero"]' },
  { id: 'audience', label: 'Research', selector: '[data-dev-section="audience"]' },
  { id: 'hypothesis', label: 'Hypothesis', selector: '[data-dev-section="challenge"]' },
  { id: 'design', label: 'Design', selector: '[data-dev-section="north-star"]' },
  { id: 'results', label: 'Results', selector: '[data-dev-section="business-value"]' },
]

type NavStudyProgressProps = {
  checkpoints?: readonly NavCheckpoint[]
}

function readScrollY() {
  const page = document.querySelector('.np1c-page') as HTMLElement | null
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
    page?.scrollTop || 0,
  )
}

function documentTop(el: Element) {
  return el.getBoundingClientRect().top + readScrollY()
}

export default function NavStudyProgress({
  checkpoints = CONSUMER_CX_PRO_CHECKPOINTS,
}: NavStudyProgressProps) {
  const [progress, setProgress] = useState(0)
  const [stops, setStops] = useState<number[]>(() =>
    checkpoints.map((_, i) => i / Math.max(checkpoints.length - 1, 1)),
  )

  const measure = useCallback(() => {
    const nodes = checkpoints.map((point) => document.querySelector(point.selector))
    const startEl = nodes[0]
    const endEl = nodes[nodes.length - 1]
    if (!startEl || !endEl) return

    const start = documentTop(startEl)
    const end = documentTop(endEl)
    const span = Math.max(end - start, 1)
    const nextStops = nodes.map((node) => {
      if (!node) return 0
      return Math.min(1, Math.max(0, (documentTop(node) - start) / span))
    })
    nextStops[0] = 0
    nextStops[nextStops.length - 1] = 1
    setStops(nextStops)

    const next = Math.min(1, Math.max(0, (readScrollY() - start) / span))
    setProgress(next)
  }, [checkpoints])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        measure()
      })
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const page = document.querySelector('.np1c-page')
    page?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      page?.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [measure])

  const scrollToCheckpoint = (selector: string) => {
    const el = document.querySelector(selector)
    if (!el) return
    const offset = 80
    const top = Math.max(0, documentTop(el) - offset)
    window.scrollTo({ top, behavior: 'smooth' })
    document.documentElement.scrollTop = top
    const page = document.querySelector('.np1c-page') as HTMLElement | null
    if (page) page.scrollTop = top
  }

  return (
    <div className="np1c-nav-progress" aria-label="Case study progress">
      <div className="np1c-nav-progress__track" aria-hidden>
        <div className="np1c-nav-progress__fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <ol className="np1c-nav-progress__dots">
        {checkpoints.map((point, index) => {
          const stop = stops[index] ?? index / Math.max(checkpoints.length - 1, 1)
          const reached = progress >= stop - 0.002
          return (
            <li
              key={point.id}
              className="np1c-nav-progress__stop"
              style={{ left: `${stop * 100}%` }}
            >
              <button
                type="button"
                className={`np1c-nav-progress__dot${reached ? ' np1c-nav-progress__dot--reached' : ''}`}
                aria-label={point.label}
                aria-current={
                  reached &&
                  (index === checkpoints.length - 1 || progress < (stops[index + 1] ?? 1) - 0.002)
                    ? 'step'
                    : undefined
                }
                onClick={() => scrollToCheckpoint(point.selector)}
              />
              <span className="np1c-nav-progress__label">{point.label}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
