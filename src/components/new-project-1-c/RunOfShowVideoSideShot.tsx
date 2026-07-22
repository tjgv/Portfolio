import { VideoWithLoader } from '../MediaLoader'
import SideShotSection from './SideShotSection'
import { RUN_SHOW_REVEAL } from './runShowReveal'

const RUN_SHOW_VIDEO = '/new-project-1/built-for-show-demo.mov'

export default function RunOfShowVideoSideShot() {
  return (
    <SideShotSection
      title="Built for show running."
      imageAlt="CX Pro run of show view"
      layout="stacked"
      imagePosition="left"
      devSection="run-of-show-video-side-shot"
      ariaLabel="Run of show view video"
      reveal={RUN_SHOW_REVEAL}
      media={
        <VideoWithLoader
          src={RUN_SHOW_VIDEO}
          aria-label="CX Pro run of show view demonstration"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      }
    >
      <p>
        A dedicated run-of-show view gives operators a{' '}
        <strong>calmer interface focused on live cues, transitions, and playback</strong> — without
        the noise of editing tools competing for attention during a show. Everything an operator
        needs to run a studio or sports event lives here: timeline control, scene triggers, and
        status at a glance — built for the pressure of live operation.
      </p>
    </SideShotSection>
  )
}
