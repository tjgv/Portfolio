import QuoteCarousel, { type QuoteSlide } from './QuoteCarousel'
import './AssumptionsQuoteSection.css'

const USER_QUOTES: readonly QuoteSlide[] = [
  {
    id: 'kimi',
    text:
      'The terminology doesn\u2019t make sense, like, what does Fade Stop Reset actually mean? I have to sit there and think about it for a while.',
    name: 'Kimi K.',
    role: 'Operator Intern',
  },
  {
    id: 'niel',
    text:
      'Even though studios are simpler, they\u2019re way more scary because there\u2019s more transitions. Transitions are the most nerve racking part of the job.',
    name: 'Niel J.',
    role: 'Operator New Hire',
  },
  {
    id: 'sarah',
    text:
      'The tool makes sense to me, but having to explain it to newer operators is a bit cumbersome. There\u2019s a lot of concepts to go over.',
    name: 'Sarah S.',
    role: 'Operator Manager',
  },
] as const

export default function AssumptionsQuoteSection() {
  return (
    <section
      className="np1c-section np1c-assumptions-quote"
      data-dev-section="key-assumptions"
      aria-label="Deducing user needs"
    >
      <div className="np1c-section__inner np1c-assumptions-quote__inner">
        <div className="np1c-assumptions-quote__copy">
          <div className="np1c-h-text-stack">
            <p className="np1c-h-text-stack__label">Key Assumptions</p>
            <div className="np1c-h-text-stack__row">
              <h2 className="np1c-h-text-stack__headline">
                Establishing a User Through-line
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  I needed to balance needs of current venue operators (specialists) with new
                  external users (casuals). So, I conducted user
                  interviews on internal operators and their experiences, with added focus on the
                  types of internal users that resembled those incoming new users we&apos;re
                  anticipating.
                </p>
                <p>&nbsp;</p>
                <p>New clients will:</p>
                <p>
                  <span className="np1c-text-emphasis">
                    Be casual, non-specialists → Cosm New Hires / Interns
                  </span>
                </p>
                <p>
                  <span className="np1c-text-emphasis">
                    Have simpler shows → Cosm Studio Shows
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <QuoteCarousel quotes={USER_QUOTES} cardDevSectionId="user-quotes" />
      </div>
    </section>
  )
}
