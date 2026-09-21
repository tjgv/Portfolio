import { ImgWithLoader } from '../MediaLoader'
import HoverReplayVideo from './HoverReplayVideo'
import './EditingGridSection.css'

const THUMBNAIL_VIDEO = '/new-project-1/editing-clip-1.mp4'
const SEQUENCE_VIDEO = '/new-project-1/mvp-sequence-01.mp4'
const INSPECTOR_VIDEO = '/new-project-1/mvp-insp-2-main.mp4'
const AUTOPLAY_IMAGE = '/new-project-1/editing-image-2.png'

const CAPTIONS = {
  thumbnail:
    'Worked with content teams to develop a Thumbnail System for layer assets, and introduced layer-priority logic to use the thumbnails as the key-identifier for a scene.',
  inspector:
    'Worked with 2 engineering teams to barter a property priority system to filter out advanced properties. Then, I utilized progressive discourse to provide high-level view of configuration.',
  autoplay:
    'Found home for optional auto-play functionality, leveraging new sequencer (scene library top bar) to allow users the ability to enable auto-play in between scenes. For certain types of shows, this can eliminate transitions all together.',
  sequence:
    'Designed scene visualizations that communicate asset combinations without pre-rendered scenes, giving editors a clear view of how a show comes together.',
} as const

export default function EditingGridSection() {
  return (
    <section
      className="np1c-section np1c-editing-grid np1c-section-size-1"
      data-dev-section="editing-grid"
      aria-label="Editing media grid"
    >
      <div className="np1c-section__inner np1c-editing-grid__inner">
        <div className="np1c-editing-grid__grid">
          <div className="np1c-editing-grid__cell np1c-editing-grid__cell--full">
            <div className="np1c-editing-grid__media np1c-editing-grid__media--row1">
              <HoverReplayVideo
                src={THUMBNAIL_VIDEO}
                aria-label="Thumbnail system for layer assets"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <p className="np1c-editing-grid__caption">{CAPTIONS.thumbnail}</p>
            </div>
          </div>

          <div className="np1c-editing-grid__cell np1c-editing-grid__cell--inspector">
            <div className="np1c-editing-grid__media np1c-editing-grid__media--inspector">
              <HoverReplayVideo
                src={INSPECTOR_VIDEO}
                aria-label="Property priority inspector"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <p className="np1c-editing-grid__caption">{CAPTIONS.inspector}</p>
            </div>
          </div>

          <div className="np1c-editing-grid__cell">
            <div className="np1c-editing-grid__media np1c-editing-grid__media--autoplay">
              <ImgWithLoader src={AUTOPLAY_IMAGE} alt="Optional auto-play on the scene sequencer" />
              <p className="np1c-editing-grid__caption">{CAPTIONS.autoplay}</p>
            </div>
          </div>

          <div className="np1c-editing-grid__cell np1c-editing-grid__cell--full">
            <div className="np1c-editing-grid__media np1c-editing-grid__media--row2">
              <HoverReplayVideo
                src={SEQUENCE_VIDEO}
                aria-label="Scene visualizations without pre-rendered scenes"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
              <p className="np1c-editing-grid__caption">{CAPTIONS.sequence}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
