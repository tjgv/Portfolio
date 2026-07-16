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
      className="np1-section np1-assumptions-quote"
      data-dev-section="key-assumptions"
      aria-label="Deducing user needs"
    >
      <div className="np1-section__inner np1-assumptions-quote__inner">
        <p className="np1-assumptions-quote__label">Key Assumptions</p>

        <div className="np1-assumptions-quote__copy">
          <h2 className="np1-assumptions-quote__headline">
            Establishing a User Baseline
          </h2>
          <div className="np1-assumptions-quote__body">
            <p>
              Without access to prospective users, I spoke with the sales team to draft core
              assumptions.
            </p>
            <p>&nbsp;</p>
            <ol>
              <li>
                <span className="np1-text-emphasis">Most clients will be casual users</span>
              </li>
              <li>
                <span className="np1-text-emphasis">
                  Most use cases will be simpler in terms of set up and run of show.
                </span>
              </li>
            </ol>
            <p>&nbsp;</p>
            <p>
              I mapped these assumptions to similar internal users to establish a baseline for user
              needs. With a target in sight, I began speaking with users, focusing on the experience
              of newer operators.
            </p>
          </div>
        </div>

        <div className="np1-assumptions-quote__quotes-block">
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
