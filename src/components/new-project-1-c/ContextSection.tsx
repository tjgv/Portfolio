import { useCallback } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import './ContextSection.css'

const CONTEXT_VIDEO = '/new-project-1/context-1-final.mp4'
const PLAYBACK_RATE = 1.35

export default function ContextSection() {
  const setPlaybackRate = useCallback((video: HTMLVideoElement) => {
    video.defaultPlaybackRate = PLAYBACK_RATE
    video.playbackRate = PLAYBACK_RATE
  }, [])

  return (
    <section
      className="np1c-section np1c-context"
      data-dev-section="context"
      aria-label="Context"
    >
      <div className="np1c-section__inner np1c-context__inner">
        <div className="np1c-context__copy">
          <div className="np1c-h-text-stack">
            <p className="np1c-h-text-stack__label">Context</p>
            <div className="np1c-h-text-stack__row">
              <h2 className="np1c-h-text-stack__headline">CX Pro controls immersive screens.</h2>
              <p className="np1c-h-text-stack__body">
                I was the sole designer for CX Pro. This is a tool used to build, run, and manage
                Cosm&apos;s advanced displays, including their marquee product: the immersive dome.
                Early 2025, I learned the tool was being positioned for external clients. At the
                time, we only had internal venue staff using the tool.
              </p>
            </div>
          </div>
        </div>

        <div className="np1c-context__media">
          <VideoWithLoader
            src={CONTEXT_VIDEO}
            aria-label="CX Pro controlling immersive displays"
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
