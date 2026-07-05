import { useCallback } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import './GuidedTransitions.css'

const GUIDED_TRANSITIONS_VIDEO = '/new-project-1/feature-guided-transitions.mp4'
const LOOP_LEAD_SEC = 0.05

export default function GuidedTransitions() {
  const restartLoop = useCallback((video: HTMLVideoElement) => {
    if (video.fastSeek) {
      video.fastSeek(0)
    } else {
      video.currentTime = 0
    }
    void video.play()
  }, [])

  const handleLoopTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      const { duration, currentTime } = video
      if (!Number.isFinite(duration) || duration <= LOOP_LEAD_SEC) return
      if (duration - currentTime <= LOOP_LEAD_SEC) restartLoop(video)
    },
    [restartLoop]
  )

  const handleLoopEnded = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      restartLoop(e.currentTarget)
    },
    [restartLoop]
  )

  return (
    <section
      className="np1-section np1-guided-transitions"
      data-dev-section="guided-transitions"
      aria-label="Simplified and Guided Transitions"
    >
      <div className="np1-section__inner np1-guided-transitions__inner">
        <div className="np1-guided-transitions__copy">
          <h2 className="np1-guided-transitions__title">Simplified &amp; Guided Transitions</h2>
          <p className="np1-guided-transitions__body">
            I worked with the Run Time engineeirng squad to simplify the transition process by
            combining the publish scene/start engine actions. Then, I decided to center the Run of
            Show UI around this process because this is the most frequent and complicated action the
            tool requires.
          </p>
        </div>

        <div className="np1-guided-transitions__media">
          <VideoWithLoader
            src={GUIDED_TRANSITIONS_VIDEO}
            aria-label="CX Pro simplified and guided transitions demonstration"
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleLoopTimeUpdate}
            onEnded={handleLoopEnded}
          />
        </div>
      </div>
    </section>
  )
}
