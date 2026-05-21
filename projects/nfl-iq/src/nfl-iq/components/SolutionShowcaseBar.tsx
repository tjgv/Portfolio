import { SOLUTION_DEFINITIONS } from '../solution-showcase/solution-definitions'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import './solution-showcase-bar.css'

export function SolutionShowcaseBar() {
  const { activeSolutionId, startSolution, stopSolution } = useSolutionShowcase()

  return (
    <div className="solution-showcase-bar" role="region" aria-label="Solution walkthroughs">
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
                      Solution {index + 1}:
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
  )
}
