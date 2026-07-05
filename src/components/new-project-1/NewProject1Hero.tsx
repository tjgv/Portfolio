import { useEffect, useRef, useState } from 'react'
import { ImgWithLoader, VideoWithLoader } from '../MediaLoader'
import './NewProject1Hero.css'

const HERO_VIDEO = '/new-project-1/hero-video.mp4'
const INTRO_TABLET = '/new-project-1/intro-tablet.png'

const TITLE_SLIDE_OFFSET_PX = 120
const PHASE1_RUNWAY_VH = 75
const PHASE2_IPAD_SCROLL_VH = 72
const IPAD_ENTRY_OFFSET_VH = 52

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5
}

function runwayPx(vh: number): number {
  return (window.innerHeight * vh) / 100
}

export default function NewProject1Hero({ embedded = false }: { embedded?: boolean }) {
  const scrollRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollPx, setScrollPx] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (embedded) return

    let rafId = 0

    const update = () => {
      rafId = 0
      const el = scrollRef.current
      if (!el) return
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) {
        setScrollPx(0)
        return
      }
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), scrollable)
      setScrollPx(scrolled)
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [embedded])

  const phase1EndPx = runwayPx(PHASE1_RUNWAY_VH)
  const ipadScrollPx = runwayPx(PHASE2_IPAD_SCROLL_VH)
  const handoffEndPx = phase1EndPx + ipadScrollPx

  const phase1Progress = embedded ? 1 : Math.min(1, scrollPx / phase1EndPx)

  const phase2Progress = embedded
    ? 0
    : scrollPx <= phase1EndPx
      ? 0
      : Math.min(1, (scrollPx - phase1EndPx) / ipadScrollPx)

  const eased1 = easeOutCubic(phase1Progress)
  const eased2 = easeOutCubic(phase2Progress)
  const easedIpad = easeOutQuint(phase2Progress)

  const inTitleHandoff = !embedded && scrollPx >= phase1EndPx && scrollPx < handoffEndPx
  const handoffComplete = !embedded && scrollPx >= handoffEndPx

  const ipadEntryOffsetPx = runwayPx(IPAD_ENTRY_OFFSET_VH)
  const ipadTranslateY = embedded ? 0 : Math.max(0, (1 - easedIpad) * ipadEntryOffsetPx)

  const videoOpacityPhase1 = 1 - eased1 * 0.75
  const videoOpacity = phase2Progress > 0 ? videoOpacityPhase1 * (1 - eased2) : videoOpacityPhase1

  const titleOpacityPhase1 = eased1
  const titleTranslateYPhase1 = (1 - eased1) * TITLE_SLIDE_OFFSET_PX

  const titleStyle = embedded
    ? { opacity: 1, transform: 'none' }
    : handoffComplete
      ? { opacity: 0, transform: 'translateY(-24px)' }
      : {
          opacity: titleOpacityPhase1,
          transform: `translateY(${titleTranslateYPhase1}px)`,
        }

  const videoOpacityFinal = embedded ? 0.25 : videoOpacity

  return (
    <section
      ref={scrollRef}
      className={`np1-hero-scroll${embedded ? ' np1-hero-scroll--embedded' : ''}`}
      data-dev-section="hero"
      aria-label="Hero"
    >
      <div className="np1-hero np1-hero--video np1-video-stage" data-dev-section="video">
        <div className="np1-video-sticky">
          <div className="np1-hero__media" aria-hidden>
            <VideoWithLoader
              ref={videoRef}
              className="np1-hero__video"
              src={HERO_VIDEO}
              style={{ opacity: videoOpacityFinal }}
              fill
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          </div>
          {(embedded || !handoffComplete) && (
            <h1 className="np1-hero__title np1-hero__title--in-video" style={titleStyle}>
              Finding Familiarity in Complexity
            </h1>
          )}
        </div>
      </div>

      <div className="np1-hero np1-hero--ipad np1-handoff-stage" data-dev-section="ipad">
        <div className="np1-handoff-sticky">
          <div className="np1-handoff-stack">
            {embedded && (
              <h1 className="np1-hero__title np1-hero__title--handoff" style={titleStyle}>
                Finding Familiarity in Complexity
              </h1>
            )}
            {(embedded || inTitleHandoff || handoffComplete) && (
              <>
                {!embedded && <div className="np1-handoff-stack__title-spacer" aria-hidden />}
                <div
                  className="np1-handoff-ipad"
                  style={{
                    transform: embedded ? undefined : `translateY(${ipadTranslateY}px)`,
                  }}
                >
                  <div className="np1-handoff-ipad__inner">
                    <ImgWithLoader src={INTRO_TABLET} alt="Hands holding CX Pro on tablet" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
