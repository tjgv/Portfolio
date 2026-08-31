import { useCallback, useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import './EmbedControlledVideo.css'

const LOOP_LEAD_SEC = 0.05
const PROGRESS_RADIUS = 16
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function ResetIcon() {
  return (
    <svg
      width="18.9"
      height="18.9"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function GiantPlayIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

type EmbedControlledVideoProps = {
  src: string
  ariaLabel: string
  /** Hides the corner restart/progress button (e.g. for a short clip where
   *  restarting isn't a useful action). */
  hideReset?: boolean
  /** CSS `object-position` for the video within its (letterboxed) frame —
   *  e.g. `'center bottom'` to crop off unwanted headroom from the top of
   *  the source clip instead of cropping evenly on both edges. */
  objectPosition?: string
}

/** Preview-modal video: stays paused until scrolled into view, then autoplays
 *  and loops. Clicking the video toggles play/pause (with a giant play glyph
 *  while paused); a separate reset button in the corner always restarts the
 *  clip from the beginning without affecting play/pause state. */
export default function EmbedControlledVideo({ src, ariaLabel, hideReset, objectPosition }: EmbedControlledVideoProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasEnteredRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    const video = videoRef.current
    if (!el || !video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasEnteredRef.current) {
          hasEnteredRef.current = true
          void video.play()
          setIsPlaying(true)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const restartLoop = useCallback((video: HTMLVideoElement) => {
    if (video.fastSeek) video.fastSeek(0)
    else video.currentTime = 0
    void video.play()
  }, [])

  const handleTimeUpdate = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget
      const { duration, currentTime } = video
      if (!Number.isFinite(duration) || duration <= LOOP_LEAD_SEC) return
      if (duration - currentTime <= LOOP_LEAD_SEC) {
        restartLoop(video)
        setProgress(0)
      }
    },
    [restartLoop]
  )

  // `timeupdate` only fires a handful of times per second, which made the
  // progress ring visibly jump/stutter. Drive it from rAF instead so it
  // reads the video's real currentTime every frame for smooth motion.
  useEffect(() => {
    if (!isPlaying) return
    const video = videoRef.current
    if (!video) return

    let rafId = requestAnimationFrame(function tick() {
      const { duration, currentTime } = video
      if (Number.isFinite(duration) && duration > LOOP_LEAD_SEC) {
        setProgress(currentTime / duration)
      }
      rafId = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(rafId)
  }, [isPlaying])

  const handleEnded = useCallback(
    (e: SyntheticEvent<HTMLVideoElement>) => {
      restartLoop(e.currentTarget)
    },
    [restartLoop]
  )

  const handleTogglePlay = useCallback(() => {
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

  const handleReset = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      const video = videoRef.current
      if (!video) return
      restartLoop(video)
      setIsPlaying(true)
      setProgress(0)
    },
    [restartLoop]
  )

  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - progress)

  return (
    <div
      ref={wrapRef}
      className="np1c-embed-video-controlled"
      onClick={handleTogglePlay}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? `Pause video: ${ariaLabel}` : `Play video: ${ariaLabel}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleTogglePlay()
        }
      }}
    >
      <VideoWithLoader
        ref={videoRef}
        fill
        src={src}
        aria-label={ariaLabel}
        muted
        playsInline
        preload="auto"
        style={objectPosition ? { objectPosition } : undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {!hideReset && (
        <button
          type="button"
          className="np1c-embed-video-reset"
          onClick={handleReset}
          aria-label="Restart video from beginning"
        >
          <svg className="np1c-embed-video-progress" viewBox="0 0 36 36" aria-hidden>
            <circle
              className="np1c-embed-video-progress__track"
              cx="18"
              cy="18"
              r={PROGRESS_RADIUS}
            />
            <circle
              className="np1c-embed-video-progress__fill"
              cx="18"
              cy="18"
              r={PROGRESS_RADIUS}
              strokeDasharray={PROGRESS_CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <span className="np1c-embed-video-reset__icon">
            <ResetIcon />
          </span>
        </button>
      )}

      {!isPlaying && (
        <span className="np1c-embed-video-giant-play" aria-hidden>
          <GiantPlayIcon />
        </span>
      )}
    </div>
  )
}
