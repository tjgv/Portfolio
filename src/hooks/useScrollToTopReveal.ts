import { useEffect, useState, type RefObject } from 'react'

const SMOOTH_SCROLL_DURATION_MS = 1100

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

function readScrollTop() {
  const page = document.querySelector('.np1c-page') as HTMLElement | null
  const appRoot = document.getElementById('root')
  const scrolling = document.scrollingElement as HTMLElement | null
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
    scrolling && scrolling !== document.body ? scrolling.scrollTop || 0 : 0,
    appRoot?.scrollTop || 0,
    page?.scrollTop || 0,
  )
}

function writeScrollTop(y: number) {
  window.scrollTo(0, y)
  document.documentElement.scrollTop = y
  document.body.scrollTop = y
  const scrolling = document.scrollingElement
  if (scrolling && scrolling !== document.body) (scrolling as HTMLElement).scrollTop = y
  const appRoot = document.getElementById('root')
  if (appRoot) appRoot.scrollTop = y
  const page = document.querySelector('.np1c-page') as HTMLElement | null
  if (page) page.scrollTop = y
}

/** Matches CX Pro C2C: ease-in-out cubic over ~1.1s, all likely scroll roots. */
export function smoothScrollToTop() {
  const startY = readScrollTop()
  if (startY <= 0) return

  const start = performance.now()
  const step = () => {
    const t = Math.min((performance.now() - start) / SMOOTH_SCROLL_DURATION_MS, 1)
    writeScrollTop(startY * (1 - easeInOutCubic(t)))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/** Matches CX Pro: button appears once the trigger section's bottom crosses ~100px from the top. */
export function useScrollToTopReveal(triggerRef: RefObject<HTMLElement | null>) {
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const update = () => {
      const trigger = triggerRef.current
      const scrollY = window.scrollY ?? document.documentElement.scrollTop ?? 0
      if (trigger) {
        const rect = trigger.getBoundingClientRect()
        setShowScrollToTop(rect.bottom <= 100)
      } else {
        setShowScrollToTop(scrollY > 500)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    document.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const page = document.querySelector('.np1c-page')
    page?.addEventListener('scroll', update, { passive: true })
    const t = setTimeout(update, 200)
    const t2 = setTimeout(update, 600)
    return () => {
      window.removeEventListener('scroll', update)
      document.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      page?.removeEventListener('scroll', update)
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [triggerRef])

  return showScrollToTop
}
