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
      className="np1c-section np1c-hypothesis np1c-hypothesis--b"
      data-dev-section="challenge"
      aria-label="Challenge"
    >
      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack np1c-h-text-stack--full">
            <p className="np1c-h-text-stack__label">Challenge</p>
            <h2 className="np1c-h-text-stack__headline">
              CX Pro combines{' '}
              <span className="np1c-text-run">Show Running</span> and{' '}
              <span className="np1c-text-edit">Building &amp; Editing</span> workflows into a
              single interface. Balancing both workflows in one UI makes each harder to learn.
            </h2>
          </div>
        </div>

        <div className="np1c-hypothesis__media-block">
          <div className="np1c-hypothesis__media np1c-hypothesis__media--content">
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
