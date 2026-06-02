import { useLayoutEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { NFL_IQ_ORIGINAL_SITE_URL, portfolioHomeUrl } from '../lib/app-paths'
import { SOLUTION_DEFINITIONS } from '../solution-showcase/solution-definitions'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import { ArrowUpright } from '../nav/NavIcons'
import { SolutionShowcaseLandingHint } from './SolutionShowcaseLandingHint'
import './solution-showcase-bar.css'

export function SolutionShowcaseBar() {
  const barShellRef = useRef<HTMLDivElement>(null)
  const { activeSolutionId, startSolution, stopSolution } = useSolutionShowcase()

  useLayoutEffect(() => {
    const shell = barShellRef.current
    if (!shell) return

    const updateBarHeight = () => {
      document.documentElement.style.setProperty(
        '--solution-showcase-bar-height',
        `${shell.getBoundingClientRect().height}px`,
      )
    }

    updateBarHeight()
    const resizeObserver =
      'ResizeObserver' in window ? new ResizeObserver(updateBarHeight) : null
    resizeObserver?.observe(shell)
    window.addEventListener('resize', updateBarHeight)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateBarHeight)
      document.documentElement.style.removeProperty('--solution-showcase-bar-height')
    }
  }, [])

  return (
    <>
      <div
        ref={barShellRef}
        className="solution-showcase-bar-shell"
        role="region"
        aria-label="Solution walkthroughs"
      >
        <div className="solution-showcase-bar">
          <a
            className="solution-showcase-bar__side-link solution-showcase-bar__side-link--left"
            href={portfolioHomeUrl()}
          >
            <ArrowLeft className="solution-showcase-bar__side-icon" size={14} aria-hidden />
            Return to Portfolio
          </a>
          <div
            className="solution-showcase-bar__options"
            role="group"
            aria-label="Start a solution walkthrough"
          >
            {SOLUTION_DEFINITIONS.map((solution, index) => {
              const active = activeSolutionId === solution.id
              const running = activeSolutionId !== null
              return (
                <button
                  key={solution.id}
                  type="button"
                  className={
                    active
                      ? 'solution-showcase-bar__option solution-showcase-bar__option--active'
                      : running
                        ? 'solution-showcase-bar__option solution-showcase-bar__option--dimmed'
                        : 'solution-showcase-bar__option'
                  }
                  aria-pressed={active}
                  onClick={() => {
                    if (active) stopSolution()
                    else startSolution(solution.id)
                  }}
                >
                  {active ? (
                    <span className="solution-showcase-bar__spinner" aria-hidden />
                  ) : null}
                  <span className="solution-showcase-bar__option-text">
                    {active ? (
                      'Stop the show!'
                    ) : (
                      <>
                        <span className="solution-showcase-bar__option-index">
                          {solution.showcasePrefix ?? `Solution ${index + 1}:`}
                        </span>{' '}
                        {solution.label}
                      </>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
          <a
            className="solution-showcase-bar__side-link solution-showcase-bar__side-link--right"
            href={NFL_IQ_ORIGINAL_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Original Site
            <ArrowUpright className="solution-showcase-bar__side-icon" size={14} />
          </a>
        </div>
        <SolutionShowcaseLandingHint />
      </div>
      <div className="solution-showcase-bar-spacer" aria-hidden />
    </>
  )
}
