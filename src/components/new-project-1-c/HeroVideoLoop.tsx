import { useCallback, useEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'

/** Split hero reel — clip 1 priority-loads so 2/3 can buffer while it plays. */
export const HERO_VIDEO_CLIPS = [
  '/new-project-1/hero-1of3.mp4',
  '/new-project-1/hero-2of3.mp4',
  '/new-project-1/hero-3of3.mp4',
] as const

/** First-frame poster so the hero paints before clip 1 finishes buffering. */
export const HERO_VIDEO_POSTER = '/new-project-1/hero-poster.jpg'

preload(HERO_VIDEO_POSTER, { as: 'image', fetchPriority: 'high' })
preload(HERO_VIDEO_CLIPS[0], { as: 'video', fetchPriority: 'high' })

type HeroVideoLoopProps = {
  className?: string
  /** Scroll-driven wash fade (1 = full video, 0 = fully washed out). */
  opacity?: number
}

function warmClip(video: HTMLVideoElement | null) {
  if (!video) return
  video.preload = 'auto'
  if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    video.load()
  }
}

/**
 * Instantly sequences three hero clips in a loop. Clip 1 starts immediately
 * with high fetch priority; only the *next* clip buffers while the current
 * one plays so later clips never contend with the first paint.
 */
export default function HeroVideoLoop({ className = '', opacity = 1 }: HeroVideoLoopProps) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([null, null, null])
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [firstReady, setFirstReady] = useState(false)

  const playIndex = useCallback((index: number) => {
    const videos = videoRefs.current
    const next = videos[index]
    if (!next) return

    videos.forEach((video, i) => {
      if (!video || i === index) return
      video.pause()
    })

    try {
      next.currentTime = 0
    } catch {
      /* ignore seek errors before metadata */
    }
    next.play().catch(() => {})
    activeIndexRef.current = index
    setActiveIndex(index)

    // Prefetch only the upcoming clip — never all remaining at once.
    const upcoming = (index + 1) % HERO_VIDEO_CLIPS.length
    warmClip(videos[upcoming])
  }, [])

  const advance = useCallback(() => {
    const nextIndex = (activeIndexRef.current + 1) % HERO_VIDEO_CLIPS.length
    const next = videoRefs.current[nextIndex]
    if (!next) return

    if (next.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      playIndex(nextIndex)
      return
    }

    // Hold last frame of the current clip until the next one can play.
    const onReady = () => {
      next.removeEventListener('canplay', onReady)
      playIndex(nextIndex)
    }
    next.addEventListener('canplay', onReady)
    warmClip(next)
  }, [playIndex])

  const markFirstReady = useCallback(() => {
    setFirstReady(true)
  }, [])

  useEffect(() => {
    const first = videoRefs.current[0]
    if (!first) return
    first.play().catch(() => {})

    // Only warm clip 2 after clip 1 is actually playing (not on canplay),
    // so we don't steal bandwidth from the first download.
    const onPlaying = () => {
      markFirstReady()
      warmClip(videoRefs.current[1])
    }

    first.addEventListener('playing', onPlaying, { once: true })
    // loadeddata fires earlier than canplay — reveal as soon as a frame exists.
    first.addEventListener('loadeddata', markFirstReady, { once: true })

    return () => {
      first.removeEventListener('playing', onPlaying)
      first.removeEventListener('loadeddata', markFirstReady)
    }
  }, [markFirstReady])

  return (
    <div
      className={`media-with-loader-wrap media-with-loader-wrap--fill np1c-hero-video-loop${className ? ` ${className}` : ''}`}
      style={{ position: 'relative' }}
    >
      <img
        className="np1c-hero__video np1c-hero-video-loop__clip np1c-hero-video-loop__poster"
        src={HERO_VIDEO_POSTER}
        alt=""
        aria-hidden
        decoding="async"
        fetchPriority="high"
        style={{ opacity: firstReady ? 0 : opacity }}
      />
      {HERO_VIDEO_CLIPS.map((src, index) => (
        <video
          key={src}
          ref={(el) => {
            videoRefs.current[index] = el
          }}
          className="np1c-hero__video np1c-hero-video-loop__clip"
          src={src}
          poster={index === 0 ? HERO_VIDEO_POSTER : undefined}
          muted
          playsInline
          preload={index === 0 ? 'auto' : 'none'}
          onEnded={() => {
            if (activeIndexRef.current === index) advance()
          }}
          onPlaying={() => {
            if (index === 0) markFirstReady()
          }}
          onLoadedData={() => {
            if (index === 0) markFirstReady()
          }}
          style={{
            opacity: firstReady && index === activeIndex ? opacity : 0,
          }}
          aria-hidden
          {...({ fetchPriority: index === 0 ? 'high' : 'low' } as object)}
        />
      ))}
    </div>
  )
}
