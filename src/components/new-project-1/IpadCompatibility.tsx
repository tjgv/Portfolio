import { VideoWithLoader } from '../MediaLoader'
import './IpadCompatibility.css'

const IPAD_VIDEO = '/new-project-1/ipad-trim2.mov'

export default function IpadCompatibility() {
  return (
    <section
      className="np1-section np1-ipad-compat"
      data-dev-section="ipad-compatibility"
      aria-label="Pitching iPad Compatibility"
    >
      <div className="np1-section__inner np1-ipad-compat__inner">
        <header className="np1-ipad-compat__header">
          <p className="np1-ipad-compat__label">Phase 3</p>
          <h2 className="np1-ipad-compat__headline">Pitching iPad Compatibility</h2>
        </header>

        <div className="np1-ipad-compat__split">
          <div className="np1-ipad-compat__media">
            <VideoWithLoader
              src={IPAD_VIDEO}
              aria-label="CX Pro iPad compatibility demonstration"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>

          <div className="np1-ipad-compat__body">
            <p>
              This project was a blue-sky exercise to define the ideal version of CX Pro and
              establish its North Star.
            </p>
            <p>
              To do that, I first needed to understand why external users would adopt this product.
              I concluded that most were not looking to create highly customized shows, but to run
              experiences efficiently in a way that fits their operations.
            </p>
            <p>
              Ultimately, CX Pro is not meant to drive engagement, it&apos;s meant to make operations
              effortless. An iPad gives speakers direct control of their shows, allows event staff
              to multitask more freely, and makes the product more accessible.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
