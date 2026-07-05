import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { ImgWithLoader } from '../MediaLoader'
import { OPEN_ANIM_DELAY_MS } from './growRevealScrollUtils'
import './CurrentToolHotspotMap.css'

/** Native image dimensions — keeps overlay aligned before / after load */
const IMAGE_ASPECT = 3058 / 1729
/** Light stagger so each bubble reads individually after the shared offset. */
const GROW_STAGGER_MS = 75

export type Hotspot = {
  id: string
  x: number
  y: number
  title: string
  body: string
}

type CurrentToolHotspotMapProps = {
  src: string
  alt: string
  hotspots: Hotspot[]
}

function getAnchorClasses(x: number, y: number): string {
  const classes: string[] = []
  if (x >= 72) classes.push('np1-info-bubble-anchor--right')
  else if (x <= 28) classes.push('np1-info-bubble-anchor--left')
  else classes.push('np1-info-bubble-anchor--center-x')

  if (y >= 78) classes.push('np1-info-bubble-anchor--bottom')
  else classes.push('np1-info-bubble-anchor--top')

  return classes.join(' ')
}

function InfoBubble({
  hotspot,
  expanded,
  entered,
  onToggle,
}: {
  hotspot: Hotspot
  expanded: boolean
  entered: boolean
  onToggle: () => void
}) {
  const titleId = useId()

  return (
    <div
      className={`np1-info-bubble-anchor ${getAnchorClasses(hotspot.x, hotspot.y)}${entered ? ' np1-info-bubble-anchor--entered' : ''}`}
      style={{
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        ['--anchor-width' as string]: expanded
          ? 'min(280px, calc(100vw - 80px))'
          : 'clamp(32px, 2.6vw, 40px)',
      }}
    >
      <button
        type="button"
        className={`np1-info-bubble${expanded ? ' np1-info-bubble--expanded' : ''}`}
        aria-expanded={expanded}
        aria-labelledby={expanded ? titleId : undefined}
        aria-label={expanded ? undefined : `More information: ${hotspot.title}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        <span className="np1-info-bubble__icon" aria-hidden>
          i
        </span>
        <span className="np1-info-bubble__body" id={titleId}>
          <span className="np1-info-bubble__body-inner">
            <span className="np1-info-bubble__title">{hotspot.title}</span>
            <span className="np1-info-bubble__text">{hotspot.body}</span>
          </span>
        </span>
      </button>
    </div>
  )
}

export default function CurrentToolHotspotMap({ src, alt, hotspots }: CurrentToolHotspotMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [enteredIds, setEnteredIds] = useState<Set<string>>(() => new Set())
  const growTimersRef = useRef<number[]>([])
  const hasScheduledGrowRef = useRef(false)

  const closeAll = useCallback(() => setExpandedId(null), [])

  useEffect(() => {
    const el = mapRef.current
    if (!el) return

    const clearGrowTimers = () => {
      growTimersRef.current.forEach((id) => window.clearTimeout(id))
      growTimersRef.current = []
    }

    const scheduleGrowth = () => {
      if (hasScheduledGrowRef.current) return
      hasScheduledGrowRef.current = true

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setEnteredIds(new Set(hotspots.map((hotspot) => hotspot.id)))
        return
      }

      hotspots.forEach((hotspot, index) => {
        const delay = OPEN_ANIM_DELAY_MS + index * GROW_STAGGER_MS
        const timerId = window.setTimeout(() => {
          setEnteredIds((current) => {
            if (current.has(hotspot.id)) return current
            const next = new Set(current)
            next.add(hotspot.id)
            return next
          })
        }, delay)
        growTimersRef.current.push(timerId)
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) scheduleGrowth()
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )

    observer.observe(el)

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
      scheduleGrowth()
    }

    return () => {
      observer.disconnect()
      clearGrowTimers()
    }
  }, [hotspots])

  useEffect(() => {
    if (!expandedId) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (mapRef.current?.contains(target)) return
      closeAll()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAll()
    }

    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [expandedId, closeAll])

  return (
    <div ref={mapRef} className="np1-hotspot-map" onClick={closeAll}>
      <div className="np1-hotspot-map__stage" style={{ aspectRatio: IMAGE_ASPECT }}>
        <ImgWithLoader className="np1-hotspot-map__image" src={src} alt={alt} />
        <div className="np1-hotspot-map__layer" aria-live="polite">
          {hotspots.map((hotspot) => (
            <InfoBubble
              key={hotspot.id}
              hotspot={hotspot}
              expanded={expandedId === hotspot.id}
              entered={enteredIds.has(hotspot.id)}
              onToggle={() => setExpandedId((current) => (current === hotspot.id ? null : hotspot.id))}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
