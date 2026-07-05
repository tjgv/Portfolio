import { useCallback, useEffect, useRef, useState } from 'react'
import Pill1 from './Pill1'
import { isSectionInViewport, isSectionOutOfViewport } from './growRevealScrollUtils'
import { JOURNEY_MAPS_REVEAL } from './journeyMapsReveal'
import './AssumptionsQuoteSection.css'

const USER_QUOTES = [
  {
    id: 'kimi',
    text:
      'The terminology doesn\u2019t make sense, like, what does Fade Stop Reset actually mean? I have to sit there and think about it for a while.',
    name: 'Kimi K.',
    role: 'Operator Intern',
  },
  {
    id: 'niel',
    text:
      'Even though studios are simpler, they\u2019re way more scary because there\u2019s more transitions. Transitions are the most nerve racking part of the job.',
    name: 'Niel J.',
    role: 'Operator New Hire',
  },
  {
    id: 'sarah',
    text:
      'The tool makes sense to me, but having to explain it to newer operators is a bit cumbersome. There\u2019s a lot of concepts to go over.',
    name: 'Sarah S.',
    role: 'Operator Manager',
  },
] as const

const QUOTE_DURATION_MS = 8000
const QUOTE_COUNT = USER_QUOTES.length

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
      className="np1-quote-card__control"
      onClick={onToggle}
      aria-label={isPlaying ? `Pause quote from ${quoteLabel}` : `Play quote from ${quoteLabel}`}
    >
      <svg className="np1-quote-card__progress" viewBox="0 0 48 48" aria-hidden>
        <circle
          className="np1-quote-card__progress-track"
          cx="24"
          cy="24"
          r={PROGRESS_RADIUS}
        />
        <circle
          className="np1-quote-card__progress-fill"
          cx="24"
          cy="24"
          r={PROGRESS_RADIUS}
          strokeDasharray={PROGRESS_CIRCUMFERENCE}
          strokeDashoffset={strokeOffset}
        />
      </svg>
      <span className="np1-quote-card__control-icon">
        {isPlaying ? <FilledPauseIcon /> : <FilledPlayIcon />}
      </span>
    </button>
  )
}

function wrapIndex(index: number) {
  return ((index % QUOTE_COUNT) + QUOTE_COUNT) % QUOTE_COUNT
}

export default function AssumptionsQuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const quotesRef = useRef<HTMLDivElement>(null)

  const isInAnimZone = useCallback(
    (section: HTMLElement) => isSectionInViewport(section),
    []
  )

  const shouldRetract = useCallback(
    (section: HTMLElement) => isSectionOutOfViewport(section),
    []
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)

  const elapsedMsRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const activeIndexRef = useRef(activeIndex)
  const progressRef = useRef(0)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  activeIndexRef.current = activeIndex
  progressRef.current = progress

  const activeQuote = USER_QUOTES[activeIndex]

  const resetTimer = useCallback(() => {
    elapsedMsRef.current = 0
    startTimeRef.current = null
    progressRef.current = 0
    setProgress(0)
  }, [])

  const goToQuote = useCallback(
    (index: number) => {
      const nextIndex = wrapIndex(index)
      if (nextIndex === activeIndexRef.current) return
      setActiveIndex(nextIndex)
      resetTimer()
    },
    [resetTimer]
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
    if (!isPlaying || prefersReducedMotion.current) {
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
  }, [isPlaying, goToQuote])

  return (
    <section
      ref={sectionRef}
      className="np1-section np1-assumptions-quote"
      data-dev-section="key-assumptions"
      aria-label="Deducing user needs"
    >
      <div className="np1-section__inner np1-assumptions-quote__inner">
        <p className="np1-assumptions-quote__label">Key Assumptions</p>

        <div className="np1-assumptions-quote__copy">
          <h2 className="np1-assumptions-quote__headline">
            Mapping prospective users to current experiences.
          </h2>
          <div className="np1-assumptions-quote__body">
            <p>
              Without access to prospective users, I talked with the sales team to draft core
              assumptions.
            </p>
            <p>&nbsp;</p>
            <ol>
              <li>
                <span className="np1-text-emphasis">Most clients will be casual users</span>
              </li>
              <li>
                <span className="np1-text-emphasis">
                  Most use cases will be simpler in terms of set up and run of show.
                </span>
              </li>
            </ol>
            <p>&nbsp;</p>
            <p>
              I mapped these assumptions to similar internal users to establish a baseline for user
              needs. With a target in sight, I began speaking with users, focusing on the experience
              of newer operators.
            </p>
          </div>
        </div>

        <div className="np1-assumptions-quote__quotes-block">
          <div className="np1-quote-card-stack">
            <div
              ref={quotesRef}
              className="np1-quote-card"
              data-dev-section="user-quotes"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="np1-quote-card__viewport">
                <div
                  className="np1-quote-card__track"
                  style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
                >
                  {USER_QUOTES.map((quote) => (
                    <div key={quote.id} className="np1-quote-card__slide">
                      <blockquote className="np1-quote-card__quote">
                        <p className="np1-quote-card__quote-text">&ldquo;{quote.text}&rdquo;</p>
                      </blockquote>

                      <div className="np1-quote-card__attribution">
                        <p className="np1-quote-card__name">{quote.name}</p>
                        <p className="np1-quote-card__role">{quote.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="np1-quote-card__controls">
              <QuotePlaybackControl
                isPlaying={isPlaying}
                progress={progress}
                onToggle={togglePlayback}
                quoteLabel={activeQuote.name}
              />

              <div className="np1-quote-card__nav" aria-label="Quote navigation">
                <button
                  type="button"
                  className="np1-quote-card__nav-btn"
                  onClick={goToPrevious}
                  aria-label="Previous quote"
                >
                  <FilledChevronLeftIcon />
                </button>
                <button
                  type="button"
                  className="np1-quote-card__nav-btn"
                  onClick={goToNext}
                  aria-label="Next quote"
                >
                  <FilledChevronRightIcon />
                </button>
              </div>
            </div>
          </div>

          <Pill1
            sectionRef={sectionRef}
            ctaLabel={JOURNEY_MAPS_REVEAL.ctaLabel}
            buttonAriaLabel={JOURNEY_MAPS_REVEAL.buttonAriaLabel}
            icon="plus"
            modal={JOURNEY_MAPS_REVEAL.modal}
            isInAnimZone={isInAnimZone}
            shouldRetract={shouldRetract}
          />
        </div>
      </div>
    </section>
  )
}
