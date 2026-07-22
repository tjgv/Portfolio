import { useCallback, useEffect, useRef, useState } from 'react'
import './QuoteCarousel.css'

export type QuoteSlide = {
  id: string
  text: string
  name: string
  role: string
}

const QUOTE_DURATION_MS = 8000

const PROGRESS_RADIUS = 20
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS

function FilledPauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <rect x="3" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="0.75" fill="currentColor" />
    </svg>
  )
}

function FilledPlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M4.5 2.75v10.5c0 .55.6.88 1.05.58l8.25-5.25a.75.75 0 0 0 0-1.26L5.55 2.17A.75.75 0 0 0 4.5 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FilledChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M8.75 2.75 4.5 7l4.25 4.25a.875.875 0 0 1-1.237 1.237L2.513 7.618a.875.875 0 0 1 0-1.237L7.513 1.513a.875.875 0 1 1 1.237 1.237Z"
        fill="currentColor"
      />
    </svg>
  )
}

function FilledChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M5.25 2.75 9.5 7 5.25 11.25a.875.875 0 0 0 1.237 1.237l4.999-4.999a.875.875 0 0 0 0-1.237L6.487 1.513A.875.875 0 0 0 5.25 2.75Z"
        fill="currentColor"
      />
    </svg>
  )
}

type QuotePlaybackControlProps = {
  isPlaying: boolean
  progress: number
  onToggle: () => void
  quoteLabel: string
}

function QuotePlaybackControl({ isPlaying, progress, onToggle, quoteLabel }: QuotePlaybackControlProps) {
  const strokeOffset = PROGRESS_CIRCUMFERENCE * (1 - progress)

  return (
    <button
      type="button"
      className="np1c-quote-card__control"
      onClick={onToggle}
      aria-label={isPlaying ? `Pause quote from ${quoteLabel}` : `Play quote from ${quoteLabel}`}
    >
      <svg className="np1c-quote-card__progress" viewBox="0 0 48 48" aria-hidden>
        <circle className="np1c-quote-card__progress-track" cx="24" cy="24" r={PROGRESS_RADIUS} />
        <circle
          className="np1c-quote-card__progress-fill"
          cx="24"
          cy="24"
          r={PROGRESS_RADIUS}
          strokeDasharray={PROGRESS_CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
        />
      </svg>
      <span className="np1c-quote-card__control-icon">
        {isPlaying ? <FilledPauseIcon /> : <FilledPlayIcon />}
      </span>
    </button>
  )
}

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count
}

type QuoteCarouselProps = {
  quotes: readonly QuoteSlide[]
  /** Optional section marker on the card for dev mode. */
  cardDevSectionId?: string
  className?: string
}

/**
 * Shared quote carousel — hero-aligned card layout + pause / prev / next controls
 * used by hero quote, results quote, and key assumptions.
 */
export default function QuoteCarousel({
  quotes,
  cardDevSectionId = 'user-quotes',
  className = '',
}: QuoteCarouselProps) {
  const quoteCount = quotes.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const elapsedMsRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const progressRef = useRef(0)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  activeIndexRef.current = activeIndex
  progressRef.current = progress

  const activeQuote = quotes[activeIndex] ?? quotes[0]

  const resetTimer = useCallback(() => {
    elapsedMsRef.current = 0
    startTimeRef.current = null
    progressRef.current = 0
    setProgress(0)
  }, [])

  const goToQuote = useCallback(
    (index: number) => {
      if (quoteCount <= 0) return
      const nextIndex = wrapIndex(index, quoteCount)
      if (nextIndex === activeIndexRef.current) return
      setActiveIndex(nextIndex)
      resetTimer()
    },
    [quoteCount, resetTimer]
  )

  const goToPrevious = useCallback(() => {
    goToQuote(activeIndexRef.current - 1)
  }, [goToQuote])

  const goToNext = useCallback(() => {
    goToQuote(activeIndexRef.current + 1)
  }, [goToQuote])

  const togglePlayback = useCallback(() => {
    if (prefersReducedMotion.current) return

    setIsPlaying((playing) => {
      if (playing) {
        elapsedMsRef.current = progressRef.current * QUOTE_DURATION_MS
        startTimeRef.current = null
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
      } else {
        startTimeRef.current = null
      }
      return !playing
    })
  }, [])

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion.current || quoteCount <= 1) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now - elapsedMsRef.current
      }

      const elapsed = now - startTimeRef.current
      const nextProgress = Math.min(elapsed / QUOTE_DURATION_MS, 1)
      progressRef.current = nextProgress
      setProgress(nextProgress)

      if (nextProgress >= 1) {
        elapsedMsRef.current = 0
        startTimeRef.current = null
        progressRef.current = 0
        setProgress(0)
        goToQuote(activeIndexRef.current + 1)
      } else {
        elapsedMsRef.current = elapsed
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isPlaying, goToQuote, quoteCount])

  if (!activeQuote) return null

  return (
    <div className={`np1c-quote-card-stack${className ? ` ${className}` : ''}`}>
      <div
        className="np1c-quote-card"
        data-dev-section={cardDevSectionId}
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="np1c-quote-card__viewport">
          <div
            className="np1c-quote-card__track"
            style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          >
            {quotes.map((quote) => (
              <div key={quote.id} className="np1c-quote-card__slide">
                <blockquote className="np1c-quote-card__quote">
                  <p className="np1c-quote-card__quote-text">&ldquo;{quote.text}&rdquo;</p>
                </blockquote>

                <div className="np1c-quote-card__attribution">
                  <p className="np1c-quote-card__name">{quote.name}</p>
                  <p className="np1c-quote-card__role">{quote.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {quoteCount > 1 && (
        <div className="np1c-quote-card__controls">
          <QuotePlaybackControl
            isPlaying={isPlaying}
            progress={progress}
            onToggle={togglePlayback}
            quoteLabel={activeQuote.name}
          />

          <div className="np1c-quote-card__nav" aria-label="Quote navigation">
            <button
              type="button"
              className="np1c-quote-card__nav-btn"
              onClick={goToPrevious}
              aria-label="Previous quote"
            >
              <FilledChevronLeftIcon />
            </button>
            <button
              type="button"
              className="np1c-quote-card__nav-btn"
              onClick={goToNext}
              aria-label="Next quote"
            >
              <FilledChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
