import HeroQuoteSection from './HeroQuoteSection'
import ResultsPhasesAnimation from './ResultsPhasesAnimation'
import './ResultsSection.css'

export default function ResultsSection() {
  return (
    <>
      <section
        className="np1c-section np1c-results"
        data-dev-section="business-value"
        aria-label="Results"
      >
        <div className="np1c-section__inner np1c-results__inner">
          <div className="np1c-results__intro">
            <div className="np1c-h-text-stack">
              <p className="np1c-h-text-stack__label">Results</p>
              <div className="np1c-h-text-stack__row">
                <h2 className="np1c-h-text-stack__headline">
                  User Validation Received &amp; Stakeholders Aligned.
                </h2>
                <div className="np1c-h-text-stack__body">
                  <p>
                    I re-interviewed internal CX Pro operators and received overwhelmingly positive
                    feedback. Then, I returned to stakeholders and successfully garnered buy-in for a
                    split view. The tool is currently en route towards this direction.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ResultsPhasesAnimation />
        </div>
      </section>

      <HeroQuoteSection ariaLabel="Results quote" devSectionId="results-quote" />
    </>
  )
}
