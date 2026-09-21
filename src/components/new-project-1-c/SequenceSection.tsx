import HoverReplayVideo from './HoverReplayVideo'
import './SequenceSection.css'

const SEQUENCE_VIDEO = '/new-project-1/sequence-01.mp4'

export default function SequenceSection() {
  return (
    <section
      className="np1c-section np1c-sequence np1c-section-size-1"
      data-dev-section="sequence"
      aria-label="Product sequence"
    >
      <div className="np1c-section__inner np1c-sequence__inner">
        <div className="np1c-sequence__media">
          <HoverReplayVideo
            src={SEQUENCE_VIDEO}
            aria-label="CX Pro product sequence demonstration"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <p className="np1c-sequence__body">
          The sequence is the operating picture for consumer users — prepare the next beat, move
          between scenes, and stay in the show without dropping into engine-level controls.
        </p>
      </div>
    </section>
  )
}
