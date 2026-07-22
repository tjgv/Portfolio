import { ImgWithLoader } from '../MediaLoader'
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
      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack np1c-h-text-stack--full">
            <p className="np1c-h-text-stack__label">MVP</p>
            <h2 className="np1c-h-text-stack__headline">
              Choosing Build Mode as MVP
            </h2>
            <p className="np1c-editing-mvp__body">
              The MVP had to be closer to current state CX Pro. Since the current state skewed
              towards show building/editing features, I had to make this the starting place for
              adding Show Running features and eventually a split view.
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
