import { useCallback, useRef, useState } from 'react'
import SlideUpModalLoopVideo from './SlideUpModalLoopVideo'

const PROGRESS_RADIUS = 20
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function FilledPlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FilledPauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
      <rect x="3" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function ReplayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

type SlideUpModalControlledVideoProps = {
  src: string
  ariaLabel: string
  className?: string
  /** Playback rate multiplier (1 = normal speed). */
  playbackRate?: number
}

/** A looping modal video paired with the same replay / play-pause controls
 *  used in the before/after compare tabs, for standalone video subsections. */
export default function SlideUpModalControlledVideo({
  src,
  ariaLabel,
  className = 'np1-modal-subsection-video',
  playbackRate = 1,
}: SlideUpModalControlledVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      void video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const handleReplay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.fastSeek) video.fastSeek(0)
    else video.currentTime = 0
    void video.play()
    setIsPlaying(true)
    setProgress(0)
  }, [])

  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - progress)

  return (
    <div className="np1-modal-controlled-video">
      <SlideUpModalLoopVideo
        src={src}
        ariaLabel={ariaLabel}
        className={className}
        videoRef={videoRef}
        onProgress={setProgress}
        playbackRate={playbackRate}
      />

      <div className="np1-modal-video-controls">
        <button
          type="button"
          className="np1-modal-video-btn"
          onClick={handleReplay}
          aria-label="Replay video from beginning"
        >
          <ReplayIcon />
        </button>

        <button
          type="button"
          className="np1-modal-video-btn np1-modal-video-btn--progress"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          <svg className="np1-modal-video-progress" viewBox="0 0 48 48" aria-hidden>
            <circle
              className="np1-modal-video-progress__track"
              cx="24"
              cy="24"
              r={PROGRESS_RADIUS}
            />
            <circle
              className="np1-modal-video-progress__fill"
              cx="24"
              cy="24"
              r={PROGRESS_RADIUS}
              strokeDasharray={PROGRESS_CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <span className="np1-modal-video-btn__icon">
            {isPlaying ? <FilledPauseIcon /> : <FilledPlayIcon />}
          </span>
        </button>
      </div>
    </div>
  )
}
