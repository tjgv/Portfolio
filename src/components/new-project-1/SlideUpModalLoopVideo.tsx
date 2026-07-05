import { useCallback, type RefObject } from 'react'
import { VideoWithLoader } from '../MediaLoader'

const LOOP_LEAD_SEC = 0.05

type SlideUpModalLoopVideoProps = {
  src: string
  ariaLabel: string
  className?: string
  /** Ref forwarded to the underlying <video> element for external control */
  videoRef?: RefObject<HTMLVideoElement | null>
  /** Called each frame with progress 0–1 */
  onProgress?: (progress: number) => void
  /** Playback rate multiplier (1 = normal speed). */
  playbackRate?: number
}

export default function SlideUpModalLoopVideo({
  src,
  ariaLabel,
  className = 'np1-modal-subsection-video',
  videoRef,
  onProgress,
  playbackRate = 1,
}: SlideUpModalLoopVideoProps) {
  const applyPlaybackRate = useCallback(
    (video: HTMLVideoElement) => {
      video.defaultPlaybackRate = playbackRate
      video.playbackRate = playbackRate
    },
    [playbackRate]
  )

  const restartLoop = useCallback((video: HTMLVideoElement) => {
    applyPlaybackRate(video)
    if (video.fastSeek) {
      video.fastSeek(0)
    } else {
      video.currentTime = 0
    }
    void video.play()
  }, [applyPlaybackRate])

  const handleLoopTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      const { duration, currentTime } = video
      if (!Number.isFinite(duration) || duration <= LOOP_LEAD_SEC) return
      if (duration - currentTime <= LOOP_LEAD_SEC) {
        restartLoop(video)
        onProgress?.(0)
      } else {
        onProgress?.(currentTime / duration)
      }
    },
    [restartLoop, onProgress]
  )

  const handleLoopEnded = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      restartLoop(e.currentTarget)
    },
    [restartLoop]
  )

  return (
    <div className={className}>
      <VideoWithLoader
        ref={videoRef}
        src={src}
        aria-label={ariaLabel}
        autoPlay
        muted
        playsInline
        preload="auto"
        onLoadedData={(e) => applyPlaybackRate(e.currentTarget)}
        onCanPlay={(e) => applyPlaybackRate(e.currentTarget)}
        onTimeUpdate={handleLoopTimeUpdate}
        onEnded={handleLoopEnded}
      />
    </div>
  )
}
