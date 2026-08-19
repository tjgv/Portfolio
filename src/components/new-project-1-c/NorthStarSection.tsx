import { useCallback, useRef } from 'react'
import { ImgWithLoader } from '../MediaLoader'
import RevealGradient from './RevealGradient'
import Pill1 from './Pill1'
import { DESIGN_INSIGHTS_REVEAL } from './designInsightsReveal'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'
import './Hypothesis.css'
import './HypothesisB.css'
import './EditingSideShotB.css'

const NORTH_STAR_IMAGE = '/new-project-1/ros3.png'

export default function NorthStarSection() {
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
      className="np1c-section np1c-hypothesis np1c-hypothesis--b np1c-editing-mvp"
      data-dev-section="north-star"
      aria-label="Defining North Star"
    >
      <RevealGradient className="np1c-editing-mvp__gradient" />

      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack np1c-h-text-stack--full">
            <p className="np1c-h-text-stack__label">Defining North Star</p>
            <h2 className="np1c-h-text-stack__headline">Dedicated Show Running View.</h2>
            <p className="np1c-editing-mvp__body">
              I took interview insights from all user types, with added weight on newer users, to
              define a vision for show running.
            </p>
          </div>
        </div>

        <div className="np1c-hypothesis__media-block">
          <div className="np1c-hypothesis__media np1c-hypothesis__media--content">
            <ImgWithLoader src={NORTH_STAR_IMAGE} alt="Dedicated show running view for CX Pro" />
          </div>

          <Pill1
            sectionRef={sectionRef}
            ctaLabel={DESIGN_INSIGHTS_REVEAL.ctaLabel}
            buttonAriaLabel={DESIGN_INSIGHTS_REVEAL.buttonAriaLabel}
            icon="plus"
            modal={DESIGN_INSIGHTS_REVEAL.modal}
            isInAnimZone={isInAnimZone}
            shouldRetract={shouldRetract}
          />
        </div>
      </div>
    </section>
  )
}
