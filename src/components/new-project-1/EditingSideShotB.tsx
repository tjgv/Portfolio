import { ImgWithLoader } from '../MediaLoader'
import './Hypothesis.css'
import './HypothesisB.css'
import './EditingSideShotB.css'

const EDIT_SHOW_IMAGE = '/new-project-1/edit-show.png'

export default function EditingSideShotB() {
  return (
    <section
      className="np1-section np1-hypothesis np1-hypothesis--b np1-editing-mvp"
      data-dev-section="editing-side-shot"
      aria-label="Defining the MVP"
    >
      <div className="np1-section__inner np1-hypothesis__inner">
        <div className="np1-hypothesis__copy">
          <div className="np1-h-text-stack np1-h-text-stack--full">
            <p className="np1-h-text-stack__label">Defining the MVP</p>
            <h2 className="np1-h-text-stack__headline">
              Finding an MVP to lead us towards a dual view.
            </h2>
            <p className="np1-editing-mvp__body">
              A dedicated Show Running Mode would come later. The MVP focused on improving the
              existing experience while laying the groundwork for future Show Running workflows.
            </p>
          </div>
        </div>

        <div className="np1-hypothesis__media np1-hypothesis__media--content">
          <ImgWithLoader src={EDIT_SHOW_IMAGE} alt="CX Pro editing view" />
        </div>
      </div>
    </section>
  )
}
