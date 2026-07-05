import { useCallback } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import SideShotSection from './SideShotSection'

const TRANSITION_SUPPORT_VIDEO = '/new-project-1/feature-transition-support.mp4'
const LOOP_LEAD_SEC = 0.05

export default function TransitionSupport() {
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
    <SideShotSection
      label="Need"
      title="Transition Support"
      imagePosition="right"
      devSection="transition-support"
      ariaLabel="Transition Support"
      media={
        <VideoWithLoader
          src={TRANSITION_SUPPORT_VIDEO}
          aria-label="CX Pro transition support workflow demonstration"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleLoopTimeUpdate}
          onEnded={handleLoopEnded}
        />
      }
    >
      <p>
        When transitioning between scenes that used different Unreal Engine environments, users
        must go through a series of steps in front of an audience. This causes fear in operators,
        because of potential system which is compounded by the learning curve of memorizing the
        steps.
      </p>
    </SideShotSection>
  )
}
