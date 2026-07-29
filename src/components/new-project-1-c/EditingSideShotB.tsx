import { ImgWithLoader } from '../MediaLoader'
import RevealGradient from './RevealGradient'
import './Hypothesis.css'
import './HypothesisB.css'
import './EditingSideShotB.css'

const EDIT_SHOW_IMAGE = '/new-project-1/edit-show.png'

export default function EditingSideShotB() {
  return (
    <section
      className="np1c-section np1c-hypothesis np1c-hypothesis--b np1c-editing-mvp"
      data-dev-section="editing-side-shot"
      aria-label="MVP"
    >
      <RevealGradient className="np1c-editing-mvp__gradient" />

      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack np1c-h-text-stack--full">
            <p className="np1c-h-text-stack__label">MVP</p>
            <h2 className="np1c-h-text-stack__headline">
              Taking Incremental Steps.
            </h2>
            <p className="np1c-editing-mvp__body">
              I achieved stakeholder alignment on the direction, but we needed to take baby steps
              to get there. I had to figure out how to make meaningful progress towards the north
              star while keeping the tool close to current state.
            </p>
          </div>
        </div>

        <div className="np1c-hypothesis__media np1c-hypothesis__media--content">
          <ImgWithLoader src={EDIT_SHOW_IMAGE} alt="CX Pro editing view" />
        </div>
      </div>
    </section>
  )
}
