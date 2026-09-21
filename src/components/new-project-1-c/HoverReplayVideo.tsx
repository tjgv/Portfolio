import { useCallback, useState, useRef, type ComponentProps, type MouseEvent } from 'react'
import { VideoWithLoader } from '../MediaLoader'
import CarouselVideoReplayButton from './CarouselVideoReplayButton'
import './HoverReplayVideo.css'

type HoverReplayVideoProps = ComponentProps<typeof VideoWithLoader>

function GiantPlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function HoverReplayVideo(props: HoverReplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [paused, setPaused] = useState(false)

  const handleTogglePlay = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).closest('.np1c-embed-video-reset')) return
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      const playPromise = video.play()
      if (playPromise) playPromise.catch(() => {})
      setPaused(false)
    } else {
      video.pause()
      setPaused(true)
    }
  }, [])

  const handleRestart = useCallback(() => {
    setPaused(false)
  }, [])

  return (
    <div className="np1c-hover-replay" onClick={handleTogglePlay}>
      <VideoWithLoader
        ref={videoRef}
        {...props}
        onPlay={(e) => {
          setPaused(false)
          props.onPlay?.(e)
        }}
        onPause={(e) => {
          setPaused(true)
          props.onPause?.(e)
        }}
      />
      <CarouselVideoReplayButton getVideo={() => videoRef.current} onRestart={handleRestart} />
      {paused ? (
        <span className="np1c-hover-replay__play" aria-hidden>
          <GiantPlayIcon />
        </span>
      ) : null}
    </div>
  )
}
