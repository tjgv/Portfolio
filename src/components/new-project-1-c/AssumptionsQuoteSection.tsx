import { useCallback, useRef } from 'react'
import Pill1 from './Pill1'
import QuoteCarousel, { type QuoteSlide } from './QuoteCarousel'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'
import { JOURNEY_MAPS_REVEAL } from './journeyMapsReveal'
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
  const sectionRef = useRef<HTMLElement>(null)

  const isInAnimZone = useCallback(
    (section: HTMLElement) => isSectionInViewport(section),
    []
  )

  const shouldRetract = useCallback(
    (section: HTMLElement) => isSectionOutOfViewport(section),
    []
  )

  return (
    <section
      ref={sectionRef}
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
                Establishing a User Baseline
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  I didn&apos;t have access to these new users, so I made assumptions about them based
                  on talks with sales:
                </p>
                <p>&nbsp;</p>
                <p>
                  <span className="np1c-text-emphasis">
                    Most clients will be casual, non-specialists.
                  </span>
                </p>
                <p>
                  <span className="np1c-text-emphasis">
                    These clients will have simpler shows.
                  </span>
                </p>
                <p>&nbsp;</p>
                <p>
                  To assess the needs for these users, I drew internal comparisons. Ex:
                </p>
                <p>
                  <span className="np1c-text-emphasis">Casual Clients → Cosm Interns</span>
                </p>
                <p>
                  <span className="np1c-text-emphasis">Simpler Shows → Cosm Studio Shows</span>
                </p>
                <p>&nbsp;</p>
                <p>
                  I conducted user interviews to learn more about challenges these users would face.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="np1c-assumptions-quote__quotes-block">
          <QuoteCarousel quotes={USER_QUOTES} cardDevSectionId="user-quotes" />

          <Pill1
            sectionRef={sectionRef}
            ctaLabel={JOURNEY_MAPS_REVEAL.ctaLabel}
            buttonAriaLabel={JOURNEY_MAPS_REVEAL.buttonAriaLabel}
            icon="plus"
            modal={JOURNEY_MAPS_REVEAL.modal}
            isInAnimZone={isInAnimZone}
            shouldRetract={shouldRetract}
          />
        </div>
      </div>
    </section>
  )
}
