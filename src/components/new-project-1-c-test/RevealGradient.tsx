import { useCallback, useEffect, useRef, useState } from 'react'
import './RevealGradient.css'

const GRADIENT_MASK = '/new-project-1/hero-gradient-mask.png'

export type RevealGradientVariant = 'spectrum' | 'teal' | 'rose'

export type RevealGradientProps = {
  /** Sizing/positioning wrapper class — controls height for each placement. */
  className?: string
  /**
   * `spectrum` — pink→blue (default, end hero).
   * `teal` — blue/teal family with darker blues on the left (North Star).
   * `rose` — pink/red family with darker roses on the left (MVP).
   */
  variant?: RevealGradientVariant
}

/**
 * Full-bleed decorative gradient — a grayscale blob shape that fades in, then
 * colorizes with a solid sweep followed by a full-color sweep, both wiping in
 * from the left edge of the viewport.
 */
export default function RevealGradient({
  className = '',
  variant = 'spectrum',
}: RevealGradientProps) {
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

  const variantClass =
    variant === 'spectrum' ? '' : ` np1c-reveal-gradient--${variant}`

  return (
    <div
      ref={rootRef}
      className={`np1c-reveal-gradient${active ? ' np1c-reveal-gradient--active' : ''}${variantClass}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <div
        className="np1c-reveal-gradient__base"
        style={{ backgroundImage: `url(${GRADIENT_MASK})` }}
      />
      <div className="np1c-reveal-gradient__blue">
        <div className="np1c-reveal-gradient__blue-fill" />
        <div
          className="np1c-reveal-gradient__invert-mask"
          style={{
            WebkitMaskImage: `url(${GRADIENT_MASK})`,
            maskImage: `url(${GRADIENT_MASK})`,
          }}
        />
      </div>
      <div className="np1c-reveal-gradient__color">
        <div className="np1c-reveal-gradient__color-fill" />
        <div
          className="np1c-reveal-gradient__invert-mask"
          style={{
            WebkitMaskImage: `url(${GRADIENT_MASK})`,
            maskImage: `url(${GRADIENT_MASK})`,
          }}
        />
      </div>
    </div>
  )
}
