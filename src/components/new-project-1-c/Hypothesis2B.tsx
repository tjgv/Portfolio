import { ImgWithLoader } from '../MediaLoader'
import './Hypothesis.css'
import './HypothesisB.css'

const EDIT_SHOW_IMAGE = '/new-project-1/hypothesis-edit-show.png'
const RUN_SHOW_IMAGE = '/new-project-1/hypothesis-run-show.png'

export default function Hypothesis2B() {
  return (
    <section
      className="np1c-section np1c-hypothesis np1c-hypothesis--b np1c-hypothesis--b-follow"
      data-dev-section="hypothesis-2"
      aria-label="Hypothesis"
    >
      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack np1c-h-text-stack--full">
            <p className="np1c-h-text-stack__label">Hypothesis</p>
            <h2 className="np1c-h-text-stack__headline">
              Splitting the tool into two modes would reduce the learning curve for new users while
              improving the usability of both workflows.
            </h2>
          </div>
        </div>

        <div className="np1c-hypothesis__media np1c-media--xl np1c-media--xl-hug np1c-media--xl-pair">
          <div className="np1c-media-frame">
            <ImgWithLoader src={EDIT_SHOW_IMAGE} alt="CX Pro Edit Show view" />
            <span className="np1c-media-tag np1c-media-tag--edit">Building &amp; Editing</span>
          </div>
          <div className="np1c-media-frame">
            <ImgWithLoader src={RUN_SHOW_IMAGE} alt="CX Pro Run Show view" />
            <span className="np1c-media-tag np1c-media-tag--run">Show Running</span>
          </div>
        </div>
      </div>
    </section>
  )
}
