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

/**
 * Instantly sequences three hero clips in a loop. Clip 1 starts immediately
 * with high fetch priority; clips 2–3 begin buffering as soon as the first
 * is playing so handoffs stay seamless.
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
    next.load()
  }, [playIndex])

  useEffect(() => {
    const first = videoRefs.current[0]
    if (!first) return
    first.play().catch(() => {})

    // Kick off buffering for the rest once clip 1 is under way.
    const warmRest = () => {
      for (let i = 1; i < HERO_VIDEO_CLIPS.length; i++) {
        const video = videoRefs.current[i]
        if (!video) continue
        video.preload = 'auto'
        if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
          video.load()
        }
      }
    }

    if (first.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      warmRest()
    } else {
      first.addEventListener('playing', warmRest, { once: true })
      first.addEventListener('canplay', warmRest, { once: true })
    }

    return () => {
      first.removeEventListener('playing', warmRest)
      first.removeEventListener('canplay', warmRest)
    }
  }, [])

  return (
    <div
      className={`media-with-loader-wrap media-with-loader-wrap--fill np1-hero-video-loop${className ? ` ${className}` : ''}`}
      style={{ position: 'relative' }}
    >
      <img
        className="np1-hero__video np1-hero-video-loop__clip np1-hero-video-loop__poster"
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
          className="np1-hero__video np1-hero-video-loop__clip"
          src={src}
          poster={index === 0 ? HERO_VIDEO_POSTER : undefined}
          muted
          playsInline
          preload={index === 0 ? 'auto' : 'metadata'}
          onEnded={() => {
            if (activeIndexRef.current === index) advance()
          }}
          onPlaying={() => {
            if (index === 0) setFirstReady(true)
          }}
          onCanPlay={() => {
            if (index === 0) setFirstReady(true)
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
