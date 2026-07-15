import { ImgWithLoader } from '../MediaLoader'
import './Hypothesis.css'
import './HypothesisB.css'

const EDIT_SHOW_IMAGE = '/new-project-1/hypothesis-edit-show.png'
const RUN_SHOW_IMAGE = '/new-project-1/hypothesis-run-show.png'

export default function Hypothesis2B() {
  return (
    <section
      className="np1-section np1-hypothesis np1-hypothesis--b np1-hypothesis--b-follow"
      data-dev-section="hypothesis-2"
      aria-label="Hypothesis"
    >
      <div className="np1-section__inner np1-hypothesis__inner">
        <div className="np1-hypothesis__copy">
          <div className="np1-h-text-stack np1-h-text-stack--full">
            <p className="np1-h-text-stack__label">Hypothesis</p>
            <h2 className="np1-h-text-stack__headline">
              Splitting the tool into two modes would reduce the learning curve for new users while
              improving the usability of both workflows.
            </h2>
          </div>
        </div>

        <div className="np1-hypothesis__media np1-media--xl np1-media--xl-hug np1-media--xl-pair">
          <div className="np1-media-frame">
            <ImgWithLoader src={EDIT_SHOW_IMAGE} alt="CX Pro Edit Show view" />
            <span className="np1-media-tag np1-media-tag--edit">Building &amp; Editing</span>
          </div>
          <div className="np1-media-frame">
            <ImgWithLoader src={RUN_SHOW_IMAGE} alt="CX Pro Run Show view" />
            <span className="np1-media-tag np1-media-tag--run">Show Running</span>
          </div>
        </div>
      </div>
    </section>
  )
}
