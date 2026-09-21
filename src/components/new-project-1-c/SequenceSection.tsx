import { useEffect, useRef, useState } from 'react'
import HoverReplayVideo from './HoverReplayVideo'
import './SequenceSection.css'

const SEQUENCE_VIDEO = '/new-project-1/sequence-01-3.mp4'

export default function SequenceSection() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        setRevealed(true)
      },
      { threshold: 0.2, rootMargin: '0px 0px -14% 0px' }
    )
    observer.observe(media)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      className="np1c-section np1c-sequence np1c-section-size-1"
      data-dev-section="sequence"
      aria-label="Product sequence"
    >
      <div
        className={`np1c-section__inner np1c-sequence__inner${revealed ? ' np1c-sequence__inner--revealed' : ''}`}
      >
        <div ref={mediaRef} className="np1c-sequence__media">
          <HoverReplayVideo
            src={SEQUENCE_VIDEO}
            aria-label="CX Pro product sequence demonstration"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        <p className="np1c-sequence__body">
          With a standalone show running mode, we can be more intentional with how users interact
          with the core CX Pro experience. iPad compatibility unlocks pathways that empower users
          to run shows how they want to.
        </p>
      </div>
    </section>
  )
}
