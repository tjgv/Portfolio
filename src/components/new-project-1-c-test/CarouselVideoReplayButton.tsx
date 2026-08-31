import type { MouseEvent } from 'react'
import './EmbedControlledVideo.css'

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

type CarouselVideoReplayButtonProps = {
  getVideo: () => HTMLVideoElement | null
  /** Called after the clip is seeked to 0 and play() is requested. */
  onRestart?: () => void
}

/** Top-right restart control for carousel video slides. */
export default function CarouselVideoReplayButton({
  getVideo,
  onRestart,
}: CarouselVideoReplayButtonProps) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const video = getVideo()
    if (!video) return
    if (video.fastSeek) video.fastSeek(0)
    else video.currentTime = 0
    const playPromise = video.play()
    if (playPromise) playPromise.catch(() => {})
    onRestart?.()
  }

  return (
    <button
      type="button"
      className="np1c-embed-video-reset np1c-embed-video-reset--carousel"
      onClick={handleClick}
      aria-label="Restart video from beginning"
    >
      <span className="np1c-embed-video-reset__icon">
        <ResetIcon />
      </span>
    </button>
  )
}
