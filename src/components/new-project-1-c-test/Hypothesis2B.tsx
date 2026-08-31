import { useEffect, useRef, useState } from 'react'
import { Split } from 'lucide-react'
import { ImgWithLoader } from '../MediaLoader'
import './Hypothesis.css'
import './HypothesisB.css'

const EDIT_SHOW_IMAGE = '/new-project-1/hypothesis-edit-show.png'
const RUN_SHOW_IMAGE = '/new-project-1/hypothesis-run-show.png'

export default function Hypothesis2B() {
  const pairRef = useRef<HTMLDivElement>(null)
  const [pairInView, setPairInView] = useState(false)

  useEffect(() => {
    const el = pairRef.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPairInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPairInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.28, rootMargin: '0px 0px -8% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="np1c-section np1c-hypothesis np1c-hypothesis--b np1c-hypothesis--b-follow"
      data-dev-section="hypothesis-2"
      aria-label="Hypothesis"
    >
      <div className="np1c-section__inner np1c-hypothesis__inner">
        <div className="np1c-hypothesis__copy">
          <div className="np1c-h-text-stack">
            <p className="np1c-h-text-stack__label">Hypothesis</p>
            <div className="np1c-h-text-stack__row">
              <h2 className="np1c-h-text-stack__headline">
                Splitting the tool into 2 views will reduce the learning curve.
              </h2>
              <div className="np1c-h-text-stack__body">
                <p>
                  Most users will{' '}
                  <span className="np1c-text-run">run through a show</span>, far less users{' '}
                  <span className="np1c-text-edit">will create shows</span>. Users that will only
                  run shows are cognitively burdened with unnecessary features.
                </p>
                <p>
                  Therefore, isolating the workflows should result in a lower learning curve for
                  each respective job.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          ref={pairRef}
          className={`np1c-hypothesis__media np1c-hypothesis__media--content np1c-hypothesis__media--pair${
            pairInView ? ' np1c-hypothesis__media--pair-in-view' : ''
          }`}
        >
          <div className="np1c-media-frame np1c-media-frame--edit">
            <ImgWithLoader src={EDIT_SHOW_IMAGE} alt="CX Pro Edit Show view" />
            <span className="np1c-media-tag np1c-media-tag--edit">Building &amp; Editing</span>
          </div>

          <div className="np1c-hypothesis__pair-split" aria-hidden>
            <Split size={28} strokeWidth={2} />
          </div>

          <div className="np1c-media-frame np1c-media-frame--run">
            <ImgWithLoader src={RUN_SHOW_IMAGE} alt="CX Pro Run Show view" />
            <span className="np1c-media-tag np1c-media-tag--run">Show Running</span>
          </div>
        </div>
      </div>
    </section>
  )
}
