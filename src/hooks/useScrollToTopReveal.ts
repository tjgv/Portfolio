import { useEffect, useState, type RefObject } from 'react'

export function smoothScrollToTop() {
  const startY = window.scrollY ?? document.documentElement.scrollTop ?? 0
  if (startY <= 0) return

  const duration = 450
  const start = performance.now()

  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - (1 - t) ** 3
    const y = Math.round(startY * (1 - eased))
    window.scrollTo(0, y)
    document.documentElement.scrollTop = y
    document.body.scrollTop = y
    const root = document.getElementById('root')
    if (root && root !== document.body) (root as HTMLElement).scrollTop = y
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
    const t = setTimeout(update, 200)
    const t2 = setTimeout(update, 600)
    return () => {
      window.removeEventListener('scroll', update)
      document.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [triggerRef])

  return showScrollToTop
}
