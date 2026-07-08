import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { clamp01, easeOutCubic, lerp, phaseRange } from './new-project-1/growRevealScrollUtils'
import './CaseStudyPreviewNav.css'

const MOUNT_PILL_ANIM_MS = 1400
const CTA_LABEL = 'View Case Study'
const CTA_SEED_SIZE = 36
const CTA_GAP = 8
const CTA_ICON_SIZE = 15
const CTA_MEASURE_BUFFER = 2
const BTN_GROW_END = 0.38

function computePreviewCtaRevealVars(progress: number, targetWidth: number) {
  const p = clamp01(progress)
  const targetW = Math.max(CTA_SEED_SIZE, targetWidth)

  const btnGrow = easeOutCubic(phaseRange(p, 0, BTN_GROW_END))
  const expand = easeOutCubic(phaseRange(p, BTN_GROW_END, 1))

  const pillWidth = p < BTN_GROW_END ? CTA_SEED_SIZE : lerp(CTA_SEED_SIZE, targetW, expand)
  const iconScale = p >= BTN_GROW_END ? 1 : btnGrow
  const textReveal = p >= BTN_GROW_END ? expand : 0
  const textMaxWidth = textReveal * Math.max(0, targetW - CTA_SEED_SIZE - CTA_GAP)

  return {
    ready: p >= 1,
    style: {
      '--preview-cta-width': `${pillWidth}px`,
      '--preview-cta-icon-scale': iconScale,
      '--preview-cta-text-opacity': textReveal,
      '--preview-cta-text-max-width': `${textMaxWidth}px`,
    } as CSSProperties,
  }
}

function useMountPillRevealProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProgress(1)
      return
    }

    const startTime = performance.now()

    const tick = (now: number) => {
      const t = clamp01((now - startTime) / MOUNT_PILL_ANIM_MS)
      setProgress(easeOutCubic(t))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}

type CaseStudyPreviewNavProps = {
  onClose: () => void
  onViewCaseStudy: () => void
}

export default function CaseStudyPreviewNav({ onClose, onViewCaseStudy }: CaseStudyPreviewNavProps) {
  const pillMeasureRef = useRef<HTMLDivElement>(null)
  const [pillTargetWidth, setPillTargetWidth] = useState(CTA_SEED_SIZE)
  const revealProgress = useMountPillRevealProgress()
  const pillReveal = computePreviewCtaRevealVars(revealProgress, pillTargetWidth)
  const controlsReady = pillReveal.ready

  useEffect(() => {
    const measurePill = () => {
      const el = pillMeasureRef.current
      if (!el) return
      const rectWidth = el.getBoundingClientRect().width
      const measured =
        Math.ceil(Math.max(rectWidth, el.scrollWidth, el.offsetWidth)) + CTA_MEASURE_BUFFER
      setPillTargetWidth(Math.max(CTA_SEED_SIZE, measured))
    }

    measurePill()
    const el = pillMeasureRef.current
    const observer = el ? new ResizeObserver(measurePill) : null
    if (el && observer) observer.observe(el)
    window.addEventListener('resize', measurePill)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measurePill)
    }
  }, [])

  const handleViewCaseStudy = useCallback(() => {
    if (!controlsReady) return
    onViewCaseStudy()
  }, [controlsReady, onViewCaseStudy])

  return (
    <nav className="home-v2-popup-nav" aria-label="Preview actions">
      <div className="home-v2-popup-nav-start">
        <button
          type="button"
          className="home-v2-popup-close"
          onClick={onClose}
          aria-label="Close preview"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="home-v2-popup-nav-title">Preview Case Study</span>
      </div>

      <div className="home-v2-preview-cta-wrap">
        <div className="home-v2-preview-cta-measure" ref={pillMeasureRef} aria-hidden>
          <span>{CTA_LABEL}</span>
          <span className="home-v2-preview-cta__icon-sizer" aria-hidden />
        </div>

        <button
          type="button"
          className={`home-v2-preview-cta${controlsReady ? ' home-v2-preview-cta--ready' : ''}`}
          style={pillReveal.style}
          onClick={handleViewCaseStudy}
          disabled={!controlsReady}
          aria-label="View case study"
        >
          <span className="home-v2-preview-cta__text">{CTA_LABEL}</span>
          <span className="home-v2-preview-cta__icon" aria-hidden>
            <ArrowUpRight size={CTA_ICON_SIZE} strokeWidth={2.25} />
          </span>
        </button>
      </div>
    </nav>
  )
}
