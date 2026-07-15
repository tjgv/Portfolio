import { useCallback } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import './Hypothesis.css'

const HYPOTHESIS_VIDEO = '/new-project-1/hypothesis-comp.mp4'
const PLAYBACK_RATE = 1.5

export default function Hypothesis() {
  const setPlaybackRate = useCallback((video: HTMLVideoElement) => {
    video.defaultPlaybackRate = PLAYBACK_RATE
    video.playbackRate = PLAYBACK_RATE
  }, [])

  return (
    <section
      className="np1-section np1-hypothesis"
      data-dev-section="hypothesis"
      aria-label="Hypothesis"
    >
      <div className="np1-section__inner np1-hypothesis__inner">
        <div className="np1-hypothesis__copy">
          <div className="np1-h-text-stack">
            <p className="np1-h-text-stack__label">Hypothesis</p>
            <div className="np1-h-text-stack__row">
              <h2 className="np1-h-text-stack__headline">
                Splitting the tool would improve comprehension and scalability.
              </h2>
              <div className="np1-h-text-stack__body">
                <p>
                  After speaking with users, I had learned that the central issue with the tool was conceptual
                  clarity — what do buttons mean, how do layers work, what actions are instantaneous.
                </p>
                <p>
                  There were plenty of tweaks that could be made, but any solution would still be
                  constrained by the fact that the tool was designed to do everything all at once. I
                  believe by splitting the tool into two modes, each workflow would communicate its
                  functionality more clearly and create more room for organic scalability.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="np1-hypothesis__media">
          <VideoWithLoader
            src={HYPOTHESIS_VIDEO}
            aria-label="CX Pro interface highlighting running show controls and editing show controls"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={(e) => setPlaybackRate(e.currentTarget)}
            onCanPlay={(e) => setPlaybackRate(e.currentTarget)}
            onPlay={(e) => setPlaybackRate(e.currentTarget)}
          />
        </div>
      </div>
    </section>
  )
}
