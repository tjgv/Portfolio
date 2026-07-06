import ResultsPhasesAnimation from './ResultsPhasesAnimation'
import './ResultsSection.css'

export default function ResultsSection() {
  return (
    <section
      className="np1-section np1-results"
      data-dev-section="business-value"
      aria-label="Results"
    >
      <div className="np1-section__inner np1-results__inner">
        <div className="np1-results__intro">
          <h2 className="np1-results__headline">Results</h2>
          <div className="np1-results__copy">
            <h3 className="np1-results__subheadline">
              Cosm aligned around a phased CX Pro roadmap.
            </h3>
            <p className="np1-results__body">
              By separating editing from show running and extending support to iPad, I built
              momentum toward a simpler, more scalable CX Pro — with leadership buy-in secured
              across each phase of the rollout.
            </p>
          </div>
        </div>

        <ResultsPhasesAnimation />
      </div>
    </section>
  )
}
