import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ImgWithLoader } from '../MediaLoader'
import { FilledChevronLeftIcon, FilledChevronRightIcon } from './ImageCarousel'
import './CurrentToolUseCases.css'

export type UseCaseItem = {
  id: string
  image: string
  imageAlt: string
  body: string
}

type CurrentToolUseCasesProps = {
  items: UseCaseItem[]
}

/** Ease-in-out cubic — feels natural and slower at start/end */
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/** Center-snap, trackpad-swipeable carousel — same gallery/track mechanics and
 * peeking-slide sizing as the "Built for editing" carousel. */
export default function CurrentToolUseCases({ items }: CurrentToolUseCasesProps) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const slideRefs = useRef<(HTMLLIElement | null)[]>([])
  const animRafRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const itemCount = items.length

  const updatePadding = useCallback(() => {
    const gallery = galleryRef.current
    const track = trackRef.current
    const firstSlide = slideRefs.current[0]
    const lastSlide = slideRefs.current[itemCount - 1]
    if (!gallery || !track || !firstSlide || !lastSlide) return

    const gw = gallery.clientWidth
    track.style.paddingLeft = `${Math.max(0, (gw - firstSlide.offsetWidth) / 2)}px`
    track.style.paddingRight = `${Math.max(0, (gw - lastSlide.offsetWidth) / 2)}px`
  }, [itemCount])

  useLayoutEffect(() => {
    updatePadding()
    const ro = new ResizeObserver(updatePadding)
    if (galleryRef.current) ro.observe(galleryRef.current)
    return () => ro.disconnect()
  }, [updatePadding])

  const smoothScrollTo = useCallback((targetLeft: number, duration = 950) => {
    const gallery = galleryRef.current
    if (!gallery) return

    if (animRafRef.current !== null) {
      cancelAnimationFrame(animRafRef.current)
      animRafRef.current = null
    }

    const startLeft = gallery.scrollLeft
    const distance = targetLeft - startLeft
    if (Math.abs(distance) < 1) return

    let startTime: number | null = null

    const step = (now: number) => {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      gallery.scrollLeft = startLeft + distance * easeInOutCubic(t)
      if (t < 1) {
        animRafRef.current = requestAnimationFrame(step)
      } else {
        animRafRef.current = null
      }
    }

    animRafRef.current = requestAnimationFrame(step)
  }, [])

  const scrollToIndex = useCallback(
    (index: number) => {
      const slide = slideRefs.current[index]
      const gallery = galleryRef.current
      if (!slide || !gallery) return
      const target = slide.offsetLeft - (gallery.clientWidth - slide.offsetWidth) / 2
      smoothScrollTo(Math.max(0, target))
    },
    [smoothScrollTo]
  )

  const goToPrev = useCallback(() => {
    const next = Math.max(0, activeIndex - 1)
    setActiveIndex(next)
    scrollToIndex(next)
  }, [activeIndex, scrollToIndex])

  const goToNext = useCallback(() => {
    const next = Math.min(itemCount - 1, activeIndex + 1)
    setActiveIndex(next)
    scrollToIndex(next)
  }, [activeIndex, scrollToIndex, itemCount])

  // Sync active index from native trackpad scroll (no snap, so read scroll position)
  const syncFromScroll = useCallback(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    const center = gallery.scrollLeft + gallery.clientWidth / 2
    let closest = 0
    let minDist = Infinity
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      const sc = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(sc - center)
      if (dist < minDist) { minDist = dist; closest = i }
    })
    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    const gallery = galleryRef.current
    if (!gallery) return
    let rafId = 0
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; syncFromScroll() })
    }
    gallery.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      gallery.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [syncFromScroll])

  useEffect(() => () => {
    if (animRafRef.current !== null) cancelAnimationFrame(animRafRef.current)
  }, [])

  return (
    <div className="np1-use-cases-carousel">
      <div
        ref={galleryRef}
        className="np1-use-cases"
        role="region"
        aria-label="Experience use cases"
        tabIndex={0}
      >
        <ul ref={trackRef} className="np1-use-cases__track">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <li
                key={item.id}
                ref={(node) => { slideRefs.current[index] = node }}
                className={[
                  'np1-use-case-card',
                  isActive && 'np1-use-case-card--active',
                ].filter(Boolean).join(' ')}
                aria-hidden={!isActive}
              >
                <div className="np1-use-case-card__media">
                  <ImgWithLoader src={item.image} alt="" aria-hidden onLoad={updatePadding} />
                </div>
                <p className="np1-use-case-card__text">{item.body}</p>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="np1-use-cases-carousel__controls">
        <nav className="np1-quote-card__nav" aria-label="Use case slide navigation">
          <button
            type="button"
            className="np1-quote-card__nav-btn"
            onClick={goToPrev}
            disabled={activeIndex === 0}
            aria-label="Previous use case"
          >
            <FilledChevronLeftIcon />
          </button>
          <button
            type="button"
            className="np1-quote-card__nav-btn"
            onClick={goToNext}
            disabled={activeIndex === itemCount - 1}
            aria-label="Next use case"
          >
            <FilledChevronRightIcon />
          </button>
        </nav>
      </div>
    </div>
  )
}
