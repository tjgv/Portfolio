import { useLayoutEffect, useRef } from 'react'
import { SOLUTION_DEFINITIONS } from '../solution-showcase/solution-definitions'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
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
          <p className="solution-showcase-bar__label">NFL IQ prototype showcase</p>
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
        </div>
        <SolutionShowcaseLandingHint />
      </div>
      <div className="solution-showcase-bar-spacer" aria-hidden />
    </>
  )
}
