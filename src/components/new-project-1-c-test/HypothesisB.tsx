import { useCallback, useRef } from 'react'
import { Plus } from 'lucide-react'
import { ImgWithLoader } from '../MediaLoader'
import Pill1 from './Pill1'
import { CHALLENGE_FEATURES_REVEAL } from './challengeFeaturesReveal'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'
import './Hypothesis.css'
import './HypothesisB.css'

const CHALLENGE_IMAGE = '/new-project-1/challenge-ui.png'

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
      aria-label="My Argument"
    >
      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack">
            <p className="np1c-h-text-stack__label">My Argument</p>
            <div className="np1c-h-text-stack__row">
              <h2 className="np1c-h-text-stack__headline">
                CX Pro is doing too much at once.
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  CX Pro combines{' '}
                  <span className="np1c-text-run">Show Running</span> and{' '}
                  <span className="np1c-text-edit">Building &amp; Editing</span> workflows into a
                  single interface. Balancing both workflows in one UI makes each harder to learn.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="np1c-hypothesis__media-block">
          <div className="np1c-hypothesis__media-stack">
            <div className="np1c-hypothesis__tag-legend" aria-hidden>
              <span className="np1c-media-tag np1c-media-tag--static np1c-media-tag--edit">
                Building &amp; Editing
              </span>
              <Plus className="np1c-hypothesis__tag-plus" size={14} strokeWidth={2.5} />
              <span className="np1c-media-tag np1c-media-tag--static np1c-media-tag--run">
                Show Running
              </span>
            </div>

            <div className="np1c-hypothesis__media np1c-hypothesis__media--content">
              <ImgWithLoader
                src={CHALLENGE_IMAGE}
                alt="CX Pro interface highlighting Show Running and Building & Editing feature areas"
              />
            </div>
          </div>

          <Pill1
            sectionRef={sectionRef}
            ctaLabel={CHALLENGE_FEATURES_REVEAL.ctaLabel}
            buttonAriaLabel={CHALLENGE_FEATURES_REVEAL.buttonAriaLabel}
            icon="plus"
            modal={CHALLENGE_FEATURES_REVEAL.modal}
            isInAnimZone={isInAnimZone}
            shouldRetract={shouldRetract}
            dockBottomInset={9}
          />
        </div>
      </div>
    </section>
  )
}
