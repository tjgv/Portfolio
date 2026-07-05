import { useCallback, useEffect, useRef, useState } from 'react'
import './RevealGradient.css'

const GRADIENT_MASK = '/new-project-1/hero-gradient-mask.png'

export type RevealGradientProps = {
  /** Sizing/positioning wrapper class — controls height for each placement. */
  className?: string
}

/**
 * Full-bleed decorative gradient — a grayscale blob shape that fades in, then
 * colorizes with a blue sweep followed by a full-color sweep, both wiping in
 * from the left edge of the viewport. Shared by the closing hero section and
 * the "Built for editing" carousel section so both use the identical effect.
 */
export default function RevealGradient({ className = '' }: RevealGradientProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  const reveal = useCallback(() => {
    setActive((wasActive) => wasActive || true)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        observer.disconnect()
        reveal()
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(root)

    const rect = root.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      observer.disconnect()
      reveal()
    }

    return () => observer.disconnect()
  }, [reveal])

  return (
    <div
      ref={rootRef}
      className={`np1-reveal-gradient${active ? ' np1-reveal-gradient--active' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <div
        className="np1-reveal-gradient__base"
        style={{ backgroundImage: `url(${GRADIENT_MASK})` }}
      />
      <div className="np1-reveal-gradient__blue">
        <div className="np1-reveal-gradient__blue-fill" />
        <div
          className="np1-reveal-gradient__invert-mask"
          style={{
            WebkitMaskImage: `url(${GRADIENT_MASK})`,
            maskImage: `url(${GRADIENT_MASK})`,
          }}
        />
      </div>
      <div className="np1-reveal-gradient__color">
        <div className="np1-reveal-gradient__color-fill" />
        <div
          className="np1-reveal-gradient__invert-mask"
          style={{
            WebkitMaskImage: `url(${GRADIENT_MASK})`,
            maskImage: `url(${GRADIENT_MASK})`,
          }}
        />
      </div>
    </div>
  )
}
