import { useEffect, useState } from 'react'

/** Condense the case-study top nav after 50vh of scroll. */
export function useCaseStudyNavCondense(enabled: boolean) {
  const [condensed, setCondensed] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const update = () => {
      const y = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0)
      const threshold = (window.innerHeight || 1) * 0.5
      setCondensed((prev) => (prev ? y > threshold - 32 : y >= threshold))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    document.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      document.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled])

  return condensed
}
