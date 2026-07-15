import { useCallback, useRef } from 'react'
import { ImgWithLoader } from '../MediaLoader'
import Pill1 from './Pill1'
import { CHALLENGE_FEATURES_REVEAL } from './challengeFeaturesReveal'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'
import './Hypothesis.css'
import './HypothesisB.css'

const CHALLENGE_IMAGE = '/new-project-1/challenge-ui-annotated.png'

export default function HypothesisB() {
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
      className="np1-section np1-hypothesis np1-hypothesis--b"
      data-dev-section="challenge"
      aria-label="Challenge"
    >
      <div className="np1-section__inner np1-hypothesis__inner">
        <div className="np1-hypothesis__copy">
          <div className="np1-h-text-stack np1-h-text-stack--full">
            <p className="np1-h-text-stack__label">Challenge</p>
            <h2 className="np1-h-text-stack__headline">
              CX Pro combines{' '}
              <span className="np1-text-run">Show Running</span> and{' '}
              <span className="np1-text-edit">Show Building</span> workflows into a single
              interface. Balancing both workflows in one UI makes each harder to learn.
            </h2>
          </div>
        </div>

        <div className="np1-hypothesis__media-block">
          <div className="np1-hypothesis__media np1-hypothesis__media--content">
            <ImgWithLoader
              src={CHALLENGE_IMAGE}
              alt="CX Pro interface highlighting Show Running and Building & Editing feature areas"
            />
          </div>

          <Pill1
            sectionRef={sectionRef}
            ctaLabel={CHALLENGE_FEATURES_REVEAL.ctaLabel}
            buttonAriaLabel={CHALLENGE_FEATURES_REVEAL.buttonAriaLabel}
            icon="plus"
            modal={CHALLENGE_FEATURES_REVEAL.modal}
            isInAnimZone={isInAnimZone}
            shouldRetract={shouldRetract}
          />
        </div>
      </div>
    </section>
  )
}
