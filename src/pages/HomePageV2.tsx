import { useCallback, useEffect, useState, useRef, useMemo, lazy, Suspense } from 'react'
import { ArrowUpRight, Gamepad2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { FigPalFollowState, FigPalBuilderState } from '../components/FigPalCharacterBuilder'
import FigPalSign from '../components/FigPalSign'
import { MediaLoader, ImgWithLoader } from '../components/MediaLoader'
import CxProPage from './CxProPage'
import Project2Page from './Project2Page'
import NewProject1PageC, { NEW_PROJECT_1_META, NEW_PROJECT_1_ROUTE } from './NewProject1PageC'
import CaseStudyPreviewNav from '../components/CaseStudyPreviewNav'
import SiteMainNav, {
  SITE_LINKEDIN_URL,
  SITE_RESUME_PDF_PATH,
} from '../components/SiteMainNav'
import { CASE_STUDIES } from '../data/caseStudies'
import './HomePageV2.css'

const FigPalPopup = lazy(() => import('../components/FigPalPopup'))
const FigPalFloatingCharacter = lazy(() =>
  import('../components/FigPalCharacterBuilder').then((m) => ({ default: m.FigPalFloatingCharacter }))
)


type CaseStudyId = 'placeholder1' | 'project1' | 'project2' | 'project3' | 'project4' | 'lab37' | null

const PROJECT3_FIGMA_EMBED =
  'https://embed.figma.com/design/kfYbHeyfx7kIagEc0BxvMb/Genius-Sports--Copy-?node-id=56-1067&embed-host=share'

const LAB37_SLIDE_COUNT = 38
const LAB37_SLIDES = Array.from(
  { length: LAB37_SLIDE_COUNT },
  (_, i) => `/lab37/slides/slide-${String(i + 1).padStart(2, '0')}.jpg`
)

const RESUME_PDF_PATH = SITE_RESUME_PDF_PATH
const LINKEDIN_URL = SITE_LINKEDIN_URL

/* Diagonal arrow that slides up-and-out on hover, replaced by a duplicate
   sliding in from the opposite corner — signals "opens in a new tab". */
function NavExternalArrow() {
  return (
    <span className="home-v2-nav-arrow" aria-hidden="true">
      <ArrowUpRight
        className="home-v2-nav-arrow__icon home-v2-nav-arrow__icon--primary"
        size={13}
        strokeWidth={2.25}
      />
      <ArrowUpRight
        className="home-v2-nav-arrow__icon home-v2-nav-arrow__icon--secondary"
        size={13}
        strokeWidth={2.25}
      />
    </span>
  )
}

const FIGPAL_PARK_HINT_SESSION_KEY = 'figpal-park-hint-shown'
const FIGPAL_MOBILE_MAX_WIDTH = 767

function useFigpalMobileViewport() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${FIGPAL_MOBILE_MAX_WIDTH}px)`)
    const sync = () => setIsMobile(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    return () => mql.removeEventListener('change', sync)
  }, [])
  return isMobile
}

/* Card with image/video – controlled by parent for alternating sync */
function MediaCycleCard({
  onClick,
  imgSrc,
  videoSrc,
  label,
  year,
  visual,
  showVideo,
  onVideoEnded,
  videoPreload,
  onImageLoaded,
}: {
  onClick: () => void
  imgSrc: string
  videoSrc: string
  label: string
  year: string
  visual: 'apple' | 'dark'
  showVideo: boolean
  onVideoEnded: () => void
  videoPreload?: 'auto' | 'metadata' | 'none'
  onImageLoaded?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  const showLoader = showVideo ? !videoReady : !imgLoaded

  useEffect(() => {
    const video = videoRef.current
    if (!showVideo || !video) return

    video.currentTime = 0
    video.play().catch(() => {})
  }, [showVideo])

  return (
    <button
      type="button"
      className={`home-v2-card home-v2-card--${visual}${showVideo ? ' home-v2-card--playing' : ''}`}
      onClick={onClick}
      aria-label={`Open ${label} case study`}
    >
      <div className="home-v2-card-media">
        <MediaLoader visible={showLoader} variant={visual === 'dark' ? 'dark' : 'default'} />
        <img
          src={imgSrc}
          alt=""
          className={`home-v2-card-img ${showVideo ? 'home-v2-card-img--hidden' : ''}`}
          onLoad={() => {
            setImgLoaded(true)
            onImageLoaded?.()
          }}
        />
        <video
          ref={videoRef}
          src={videoSrc}
          preload={videoPreload ?? 'metadata'}
          className={`home-v2-card-vid ${showVideo ? 'home-v2-card-vid--visible' : ''}`}
          muted
          playsInline
          onEnded={onVideoEnded}
          onLoadedData={() => setVideoReady(true)}
          onCanPlay={() => setVideoReady(true)}
          aria-hidden
        />
      </div>
      <span className="home-v2-card-pill">
        <span className="home-v2-card-pill-label">{label}</span>
        <span className="home-v2-card-pill-year"> · {year}</span>
      </span>
    </button>
  )
}


/* =============================================================================
 * DORMANT: home-case-study-preview-modals
 * NewProject1Popup + CaseStudyPopup are kept for easy restore but currently
 * unwired — HomePageV2 cards navigate straight to CASE_STUDIES routes instead.
 * See .cursor/rules/home-case-study-preview-modals.mdc
 * ============================================================================= */

/* New project 1 preview popup — slot 1 case study shell */
export function NewProject1Popup({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [isExpanding, setIsExpanding] = useState(false)
  const { title, timeline, role, org, withPeople } = NEW_PROJECT_1_META

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  const handleExpandClick = useCallback(() => {
    setIsExpanding(true)
  }, [])

  useEffect(() => {
    if (!isExpanding) return
    const id = setTimeout(() => navigate(NEW_PROJECT_1_ROUTE), 650)
    return () => clearTimeout(id)
  }, [isExpanding, navigate])

  return (
    <div
      className={`home-v2-popup-backdrop ${isExpanding ? 'home-v2-popup-backdrop--expanding' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${title}`}
      onClick={(e) => !isExpanding && e.target === e.currentTarget && onClose()}
    >
      <div
        className={`home-v2-popup ${isExpanding ? 'home-v2-popup--expanding' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CaseStudyPreviewNav onClose={onClose} onViewCaseStudy={handleExpandClick} />
        <div className="home-v2-popup-scroll">
          <header className="home-v2-popup-header">
            <h1 className="home-v2-popup-title">{title}</h1>
          </header>
          <div className="home-v2-popup-meta">
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Timeline</span>
              <span className="home-v2-popup-meta-value">{timeline}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Role</span>
              <span className="home-v2-popup-meta-value">{role}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Org</span>
              <span className="home-v2-popup-meta-value">{org}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">With</span>
              <span className="home-v2-popup-meta-value">{withPeople}</span>
            </div>
          </div>
          <div className="home-v2-popup-preview">
            <NewProject1PageC embedded />
          </div>
          <div className="home-v2-popup-read-more-wrap">
            <Link to={NEW_PROJECT_1_ROUTE} className="home-v2-popup-read-more">
              View Entire Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Scrollable case study popup: expand (top-left), close on backdrop, full sections + read more */
export function CaseStudyPopup({
  caseStudyId,
  onClose,
}: {
  caseStudyId: 'project1' | 'project2'
  onClose: () => void
}) {
  const navigate = useNavigate()
  const study = CASE_STUDIES.find((entry) => entry.homeCardId === caseStudyId)
  const fullHref = study?.route ?? '/'
  const [isExpanding, setIsExpanding] = useState(false)

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  const handleExpandClick = useCallback(() => {
    setIsExpanding(true)
  }, [])

  useEffect(() => {
    if (!isExpanding) return
    const id = setTimeout(() => navigate(fullHref), 650)
    return () => clearTimeout(id)
  }, [isExpanding, navigate, fullHref])

  const title = study?.title ?? 'Case Study'
  const timeline = caseStudyId === 'project1' ? 'Nov 23 – Nov 25' : 'Nov 23 – Nov 25'
  const role = 'Product Design'
  const org = caseStudyId === 'project1' ? 'Cosm' : 'Eventus'
  const withPeople = caseStudyId === 'project1' ? 'Ryan Kuttler, Brian DeBoer' : 'Ryan Kuttler, Brian DeBoer'

  return (
    <div
      className={`home-v2-popup-backdrop ${isExpanding ? 'home-v2-popup-backdrop--expanding' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Case study: ${title}`}
      onClick={(e) => !isExpanding && e.target === e.currentTarget && onClose()}
    >
      <div
        className={`home-v2-popup ${isExpanding ? 'home-v2-popup--expanding' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CaseStudyPreviewNav onClose={onClose} onViewCaseStudy={handleExpandClick} />
        <div className="home-v2-popup-scroll">
          <header className="home-v2-popup-header">
            <h1 className="home-v2-popup-title">{title}</h1>
          </header>
          <div className="home-v2-popup-meta">
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Timeline</span>
              <span className="home-v2-popup-meta-value">{timeline}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Role</span>
              <span className="home-v2-popup-meta-value">{role}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">Org</span>
              <span className="home-v2-popup-meta-value">{org}</span>
            </div>
            <div className="home-v2-popup-meta-item">
              <span className="home-v2-popup-meta-label">With</span>
              <span className="home-v2-popup-meta-value">{withPeople}</span>
            </div>
          </div>
          <div className="home-v2-popup-preview">
            {caseStudyId === 'project1' ? <CxProPage embedded /> : <Project2Page embedded />}
          </div>
          <div className="home-v2-popup-read-more-wrap">
            <Link to={fullHref} className="home-v2-popup-read-more">
              View Entire Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Full-width Figma embed popup for project 3 */
function Project3FigmaPopup({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [onClose])

  return (
    <div
      className="home-v2-popup-backdrop home-v2-popup-backdrop--figma-embed"
      role="dialog"
      aria-modal="true"
      aria-label="Genius Sports take home assignment"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="home-v2-popup home-v2-popup--figma-embed" onClick={(e) => e.stopPropagation()}>
        <nav className="home-v2-popup-nav home-v2-popup-nav--figma-embed" aria-label="Preview actions">
          <span className="home-v2-popup-figma-embed-title">Genius Sports Take Home Assignment</span>
          <div className="home-v2-popup-nav-actions">
            <a href="/giq" className="home-v2-popup-figma-embed-cta" onClick={onClose}>
              View Solutions
            </a>
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
          </div>
        </nav>
        <div className="home-v2-popup-figma-embed-intro">
          <p className="home-v2-popup-figma-embed-text">
            <strong>Process:</strong> This project was a take-home assignment for Genius Sports. The objective of the assignment was to identify the top 3 problems with the current NFL IQ product experience. The product seemed to be in its infancy, and as such, there were many problems with it. To ensure that the &ldquo;top&rdquo; 3 problems were truly the highest impact items, I audited the tool through the lens of how the product is positioned within the larger NFL Draft product eco-system. From this context, I was able to make key assumptions about users - defining primary and secondary types. Then, I audited the experience from those users perspective and contrasted that against assumed key use-cases. I took the many problems which overlapped (weighing primary user problems more heavily) to form 3 foundational top problems to solve. Then, I brain stormed solutions to address said-problems, leaning on a balanced mix of solutions with modest effort value constraints.
          </p>
          <p className="home-v2-popup-figma-embed-text">
            For design deliverables, I chose to quickly rebuild the tool within Cursor then implement my solutions within the tool for a fully interactable prototype.
          </p>
        </div>
        <div className="home-v2-popup-figma-embed-body">
          <iframe
            src={PROJECT3_FIGMA_EMBED}
            allowFullScreen
            title="Genius Sports take home assignment Figma prototype"
          />
        </div>
      </div>
    </div>
  )
}

/* Lab37 take-home — slide deck with looping left/right navigation */
function Lab37SlideDeckPopup({ onClose }: { onClose: () => void }) {
  const slideCount = LAB37_SLIDES.length
  // Extended track: [last clone, ...slides, first clone] so wrap animates forward/back one step
  const trackSlides = useMemo(
    () => [LAB37_SLIDES[slideCount - 1], ...LAB37_SLIDES, LAB37_SLIDES[0]],
    [slideCount]
  )
  // Position on the extended track (1 = first real slide)
  const [trackIndex, setTrackIndex] = useState(1)
  const [animate, setAnimate] = useState(true)
  const settlingRef = useRef(false)

  const logicalIndex = ((trackIndex - 1) % slideCount + slideCount) % slideCount

  const goPrev = useCallback(() => {
    if (settlingRef.current) return
    setAnimate(true)
    setTrackIndex((i) => i - 1)
  }, [])

  const goNext = useCallback(() => {
    if (settlingRef.current) return
    setAnimate(true)
    setTrackIndex((i) => i + 1)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    if (trackIndex === 0) {
      // Landed on last-clone while going prev from first — snap to real last
      settlingRef.current = true
      setAnimate(false)
      setTrackIndex(slideCount)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settlingRef.current = false
          setAnimate(true)
        })
      })
      return
    }
    if (trackIndex === slideCount + 1) {
      // Landed on first-clone while going next from last — snap to real first
      settlingRef.current = true
      setAnimate(false)
      setTrackIndex(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settlingRef.current = false
          setAnimate(true)
        })
      })
    }
  }, [trackIndex, slideCount])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, goPrev, goNext])

  // Prefetch neighbors (and wrap targets)
  useEffect(() => {
    const neighbors = [
      (logicalIndex - 1 + slideCount) % slideCount,
      (logicalIndex + 1) % slideCount,
    ]
    neighbors.forEach((i) => {
      const img = new Image()
      img.src = LAB37_SLIDES[i]
    })
  }, [logicalIndex, slideCount])

  return (
    <div
      className="home-v2-popup-backdrop home-v2-popup-backdrop--slide-deck"
      role="dialog"
      aria-modal="true"
      aria-label="Lab37 take home assignment slides"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="home-v2-popup home-v2-popup--slide-deck" onClick={(e) => e.stopPropagation()}>
        <nav className="home-v2-popup-nav home-v2-popup-nav--slide-deck" aria-label="Slide deck actions">
          <span className="home-v2-popup-slide-deck-title">Lab37</span>
          <div className="home-v2-popup-nav-actions">
            <span className="home-v2-popup-slide-deck-count" aria-live="polite">
              {logicalIndex + 1} / {slideCount}
            </span>
            <button
              type="button"
              className="home-v2-popup-close"
              onClick={onClose}
              aria-label="Close slide deck"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </nav>

        <div className="home-v2-popup-slide-deck-stage">
          <button
            type="button"
            className="home-v2-popup-slide-deck-arrow home-v2-popup-slide-deck-arrow--prev"
            onClick={goPrev}
            aria-label="Previous slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="home-v2-popup-slide-deck-frame">
            <div
              className={`home-v2-popup-slide-deck-track${animate ? '' : ' home-v2-popup-slide-deck-track--no-anim'}`}
              style={{ transform: `translateX(-${trackIndex * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {trackSlides.map((src, i) => (
                <div key={`${src}-${i}`} className="home-v2-popup-slide-deck-slide">
                  <img
                    className="home-v2-popup-slide-deck-image"
                    src={src}
                    alt={
                      i === 0 || i === trackSlides.length - 1
                        ? ''
                        : `Lab37 slide ${i} of ${slideCount}`
                    }
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="home-v2-popup-slide-deck-arrow home-v2-popup-slide-deck-arrow--next"
            onClick={goNext}
            aria-label="Next slide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const WORK_CARDS = [
  {
    id: 'placeholder1',
    label: 'Consumer-Grade CX Pro',
    year: '2026',
    hoverLine: 'Simplifying CX Pro for Commercial Launch',
    sub: 'Projected to generate $X00K over 5 years.',
    bgStyle: { backgroundImage: 'url(/new-project-1/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'project1' as const,
    label: 'CX Pro: Concept to Commercialization',
    year: '2023-25',
    hoverLine: 'Taking a live operations tool from 0 to 1.',
    sub: 'Slashed operator training time by 66%',
    bgStyle: { backgroundImage: 'url(/project1-cx.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'project2' as const,
    label: 'Validus Overhaul',
    year: '2022',
    hoverLine: 'Re-designing the home page experience',
    sub: 'User satisfaction increased +72%',
    bgStyle: { backgroundImage: 'url(/project2-events.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'dark',
  },
  {
    id: 'project3' as const,
    label: 'NFL IQ',
    year: '2026',
    hoverLine: 'Auditing and transforming the NFL IQ user experience.',
    sub: '2026 Take Home Challenge',
    bgStyle: { backgroundImage: 'url(/nfl-iq-cover.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'lab37' as const,
    label: 'Lab37',
    year: '2026',
    hoverLine: 'Creating an error framework system to process any kind of obstacle.',
    sub: '2026 Take Home Challenge',
    bgStyle: { backgroundImage: 'url(/lab37-cover.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'placeholder2',
    label: 'Coming Soon',
    year: '—',
    hoverLine: 'Iterating on mobile check out flows',
    sub: 'Mobile ticket increased +17%',
    bgStyle: { backgroundImage: 'url(/project5-cosm-app.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'placeholder',
  },
  {
    id: 'project4' as const,
    label: 'FigPal Forever',
    year: '2026',
    hoverLine: 'Create your own character. Customize and take it with you.',
    sub: '2026',
    bgStyle: { backgroundImage: 'url(/figpal-cover.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
]

export default function HomePageV2() {
  const navigate = useNavigate()
  const [popupCaseStudy, setPopupCaseStudy] = useState<CaseStudyId>(null)
  const [heroShowVideo, setHeroShowVideo] = useState(false)
  const [project1ShowVideo, setProject1ShowVideo] = useState(false)
  const [project2ShowVideo, setProject2ShowVideo] = useState(false)
  const [heroImageLoaded, setHeroImageLoaded] = useState(false)
  const [heroInitialVideoStarted, setHeroInitialVideoStarted] = useState(false)
  const [figpalFollowState, setFigpalFollowState] = useState<FigPalFollowState>({
    enabled: false,
    characterUrl: '',
    accessoryUrl: null,
    displayName: '',
  })
  const [figpalBuilderState, setFigpalBuilderState] = useState<FigPalBuilderState | null>(null)
  const [figpalParked, setFigpalParked] = useState(false)
  const [figpalParkHintOpen, setFigpalParkHintOpen] = useState(false)
  const justUnparkedRef = useRef(false)
  const isFigpalMobile = useFigpalMobileViewport()

  const openPopup = useCallback((id: CaseStudyId) => setPopupCaseStudy(id), [])
  const closePopup = useCallback(() => setPopupCaseStudy(null), [])

  /** Case-study cards skip the preview modal and go straight to the full page.
   *  (DORMANT restore: home-case-study-preview-modals → openPopup instead) */
  const openCaseStudy = useCallback(
    (homeCardId: 'placeholder1' | 'project1' | 'project2') => {
      const study = CASE_STUDIES.find((entry) => entry.homeCardId === homeCardId)
      if (study) navigate(study.route)
    },
    [navigate]
  )

  /** Warm Consumer CX Pro hero clip before navigation so the case study paints faster. */
  const prefetchConsumerHero = useCallback(() => {
    const poster = document.createElement('link')
    poster.rel = 'prefetch'
    poster.as = 'image'
    poster.href = '/new-project-1/hero-poster.jpg'
    document.head.appendChild(poster)

    const video = document.createElement('link')
    video.rel = 'prefetch'
    video.as = 'video'
    video.href = '/new-project-1/hero-1of3.mp4'
    video.type = 'video/mp4'
    document.head.appendChild(video)
  }, [])

  useEffect(() => {
    const warm = () => prefetchConsumerHero()
    const ric = window.requestIdleCallback?.bind(window)
    if (ric) {
      const id = ric(warm, { timeout: 2500 })
      return () => window.cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(warm, 1200)
    return () => window.clearTimeout(t)
  }, [prefetchConsumerHero])

  const handleFigPalClose = useCallback(() => {
    try {
      if (
        figpalFollowState.enabled &&
        !isFigpalMobile &&
        !sessionStorage.getItem(FIGPAL_PARK_HINT_SESSION_KEY)
      ) {
        sessionStorage.setItem(FIGPAL_PARK_HINT_SESSION_KEY, '1')
        setFigpalParkHintOpen(true)
      }
    } catch {
      /* sessionStorage unavailable */
    }
    setPopupCaseStudy(null)
  }, [figpalFollowState.enabled, isFigpalMobile])

  useEffect(() => {
    if (!figpalParkHintOpen) return
    const id = window.setTimeout(() => setFigpalParkHintOpen(false), 8000)
    return () => window.clearTimeout(id)
  }, [figpalParkHintOpen])

  useEffect(() => {
    if (isFigpalMobile) setFigpalParkHintOpen(false)
  }, [isFigpalMobile])

  const handleUnpark = useCallback(() => {
    setFigpalParked(false)
    justUnparkedRef.current = true
    setTimeout(() => { justUnparkedRef.current = false }, 300)
  }, [])

  const handlePark = useCallback(() => {
    if (justUnparkedRef.current) return
    setFigpalParkHintOpen(false)
    setFigpalParked(true)
  }, [])

  /* Ensure on page load: hero card image shows first, then video starts and the 3-way loop begins. */
  useEffect(() => {
    setHeroShowVideo(false)
    setProject1ShowVideo(false)
    setProject2ShowVideo(false)
  }, [])

  useEffect(() => {
    if (!heroImageLoaded || heroInitialVideoStarted) return
    const delayId = setTimeout(() => {
      setHeroShowVideo(true)
      setHeroInitialVideoStarted(true)
    }, 2000)
    return () => clearTimeout(delayId)
  }, [heroImageLoaded, heroInitialVideoStarted])

  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* Rotation order: hero card -> project1 -> project2 -> back to hero card. */
  const onHeroVideoEnded = useCallback(() => {
    setHeroShowVideo(false)
    switchTimeoutRef.current = setTimeout(() => setProject1ShowVideo(true), 5000)
  }, [])

  const onProject1VideoEnded = useCallback(() => {
    setProject1ShowVideo(false)
    switchTimeoutRef.current = setTimeout(() => setProject2ShowVideo(true), 5000)
  }, [])

  const onProject2VideoEnded = useCallback(() => {
    setProject2ShowVideo(false)
    switchTimeoutRef.current = setTimeout(() => setHeroShowVideo(true), 5000)
  }, [])

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current)
    }
  }, [])

  return (
    <div className="home-v2">
      <div className="home-v2-gradient" aria-hidden />
      <div className="home-v2-content-margin">
        <header className="home-v2-header" data-page="home-v2">
          <Link to="/" className="home-v2-logo" aria-label="Home">
            <ImgWithLoader src="/logo-personal.png" alt="" className="home-v2-logo-img" />
          </Link>
          <div className="home-v2-header-inner">
            <h1 className="home-v2-name"><span className="home-v2-name-initials">T.J.</span> Gomez-Vidal</h1>
            <div className="home-v2-header-bottom">
              <div className="home-v2-header-text">
                <p className="home-v2-tagline">
                  Product designer with a speciality in crafting simple workflows based on complex systems.
                </p>
              </div>
              <SiteMainNav theme="light" active="work" />
            </div>
          </div>
        </header>
        <main className="home-v2-main home-v2-main--work">
          <div className="home-v2-cards">
            {WORK_CARDS.map((card, index) => {
              const isPlaying =
                (card.id === 'placeholder1' && heroShowVideo) ||
                (card.id === 'project1' && project1ShowVideo) ||
                (card.id === 'project2' && project2ShowVideo)
              return (
              <div
                key={card.id}
                className={`home-v2-card-wrap${isPlaying ? ' home-v2-card-wrap--playing' : ''}`}
                style={{ '--home-v2-card-stagger': index } as React.CSSProperties}
              >
                {card.id === 'placeholder1' ? (
                  <div
                    onMouseEnter={prefetchConsumerHero}
                    onFocus={prefetchConsumerHero}
                    onTouchStart={prefetchConsumerHero}
                  >
                    <MediaCycleCard
                      onClick={() => openCaseStudy('placeholder1')}
                      imgSrc="/consumer-cx-cover.png"
                      videoSrc="/consumer-cx-cover.mp4"
                      label={card.label}
                      year={card.year}
                      visual="apple"
                      showVideo={heroShowVideo}
                      onVideoEnded={onHeroVideoEnded}
                      videoPreload="auto"
                      onImageLoaded={() => setHeroImageLoaded(true)}
                    />
                  </div>
                ) : card.id === 'placeholder2' ? (
                  <button
                    type="button"
                    className={`home-v2-card home-v2-card--${card.visual}`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    disabled
                    aria-label={card.label}
                  >
                    <span className="home-v2-card-pill">
                      <span className="home-v2-card-pill-label">{card.label}</span>
                      <span className="home-v2-card-pill-year"> · {card.year}</span>
                    </span>
                  </button>
                ) : card.id === 'project1' ? (
                  <MediaCycleCard
                    onClick={() => openCaseStudy('project1')}
                    imgSrc="/project1-cx.png"
                    videoSrc="/clip-3-cosm.mov"
                    label="CX Pro"
                    year="2023-25"
                    visual="apple"
                    showVideo={project1ShowVideo}
                    onVideoEnded={onProject1VideoEnded}
                    videoPreload="auto"
                  />
                ) : card.id === 'project2' ? (
                  <MediaCycleCard
                    onClick={() => openCaseStudy('project2')}
                    imgSrc="/project2-events.png"
                    videoSrc="/Vid2.mov"
                    label="Validus Overhaul"
                    year="2022"
                    visual="dark"
                    showVideo={project2ShowVideo}
                    onVideoEnded={onProject2VideoEnded}
                    videoPreload="metadata"
                  />
                ) : card.id === 'lab37' ? (
                  <button
                    type="button"
                    className={`home-v2-card home-v2-card--${card.visual} home-v2-card--has-bg`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    onClick={() => openPopup('lab37')}
                    aria-label="Open Lab37 case study"
                  >
                    <span className="home-v2-card-pill">
                      <span className="home-v2-card-pill-label">{card.label}</span>
                      <span className="home-v2-card-pill-year"> · {card.year}</span>
                    </span>
                  </button>
                ) : card.id === 'project3' ? (
                  <button
                    type="button"
                    className={`home-v2-card home-v2-card--${card.visual} home-v2-card--has-bg home-v2-card--project3`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    onClick={() => openPopup('project3')}
                    aria-label="Open NFL IQ Figma prototype"
                  >
                    <span className="home-v2-card-pill">
                      <span className="home-v2-card-pill-label">{card.label}</span>
                      <span className="home-v2-card-pill-year"> · {card.year}</span>
                    </span>
                  </button>
                ) : card.id === 'project4' ? (
                  <button
                    type="button"
                    data-figpal-card
                    className={`home-v2-card home-v2-card--${card.visual} home-v2-card--has-bg`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    onClick={() => openPopup('project4')}
                    aria-label={`Open ${card.label} preview`}
                  >
                    <span className="home-v2-card-chip home-v2-card-chip--try">
                      <Gamepad2 size={14} strokeWidth={2.5} aria-hidden />
                      Try it out!
                    </span>
                    <span className="home-v2-card-pill">
                      <span className="home-v2-card-pill-label">{card.label}</span>
                      <span className="home-v2-card-pill-year"> · {card.year}</span>
                    </span>
                  </button>
                ) : null}
                <div className="home-v2-card-caption-stack">
                  <p className="home-v2-card-caption">{card.hoverLine}</p>
                  <p className="home-v2-card-caption-secondary">{card.sub}</p>
                </div>
              </div>
            )})}
          </div>
        </main>
        <footer className="home-v2-footer">
          <div className="home-v2-footer-inner">
            <span className="home-v2-footer-name">T.J. Gomez-Vidal</span>
            <div className="home-v2-footer-links">
              <button type="button" className="home-v2-footer-link">Work</button>
              <Link to="/contact" className="home-v2-footer-link">About</Link>
              <span className="home-v2-footer-divider" aria-hidden="true" />
              <a
                href={RESUME_PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="home-v2-footer-link home-v2-footer-link--external"
              >
                Resume
                <NavExternalArrow />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="home-v2-footer-link home-v2-footer-link--external"
              >
                LinkedIn
                <NavExternalArrow />
              </a>
            </div>
            <div className="home-v2-footer-contact">
              <span>Let&apos;s work together!</span>
              <a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a>
            </div>
          </div>
        </footer>
      </div>
      {popupCaseStudy === 'project4' ? (
        <Suspense fallback={null}>
          <FigPalPopup
            onClose={handleFigPalClose}
            onFollowMouseChange={setFigpalFollowState}
            initialState={figpalBuilderState}
            onStateChange={setFigpalBuilderState}
          />
        </Suspense>
      ) : popupCaseStudy === 'lab37' ? (
        <Lab37SlideDeckPopup onClose={closePopup} />
      ) : popupCaseStudy === 'project3' ? (
        <Project3FigmaPopup onClose={closePopup} />
      ) : null}
      {figpalFollowState.enabled &&
        (figpalParked || isFigpalMobile) &&
        popupCaseStudy !== 'project4' && (
        <div
          className={`figpal-parked${isFigpalMobile ? ' figpal-parked--mobile' : ''}`}
          onClick={isFigpalMobile ? undefined : handleUnpark}
          role={isFigpalMobile ? undefined : 'button'}
          tabIndex={isFigpalMobile ? undefined : 0}
          onKeyDown={
            isFigpalMobile ? undefined : (e) => e.key === 'Enter' && handleUnpark()
          }
          aria-label={isFigpalMobile ? 'FigPal' : 'Click to unpark FigPal'}
        >
          <span className="figpal-parked-name">{figpalFollowState.displayName || 'FigPal'}</span>
          <div className="figpal-parked-stage" style={{ backgroundImage: 'url(/figpal/Stage2.png)' }} />
          <div className="figpal-parked-char-wrap">
            <img src={figpalFollowState.characterUrl} alt="" className="figpal-parked-char" />
            {figpalFollowState.accessoryUrl && (
              <img src={figpalFollowState.accessoryUrl} alt="" className="figpal-parked-acc" />
            )}
          </div>
        </div>
      )}
      {figpalFollowState.enabled && !figpalParked && !isFigpalMobile && (
        <>
          <Suspense fallback={null}>
            <FigPalFloatingCharacter
              enabled={figpalFollowState.enabled}
              characterUrl={figpalFollowState.characterUrl}
              accessoryUrl={figpalFollowState.accessoryUrl}
            />
          </Suspense>
          <div className="figpal-sign-stack">
            {figpalParkHintOpen && (
              <div className="figpal-park-hint" role="status">
                <button
                  type="button"
                  className="figpal-park-hint__close"
                  onClick={() => setFigpalParkHintOpen(false)}
                  aria-label="Dismiss message"
                >
                  ×
                </button>
                <p className="figpal-park-hint__text">
                  You can park your FigPal by clicking the sign below!
                </p>
              </div>
            )}
            <div
              className="figpal-sign-wrap figpal-sign-wrap--clickable"
              onClick={popupCaseStudy !== 'project4' ? handlePark : undefined}
              role={popupCaseStudy !== 'project4' ? 'button' : undefined}
              tabIndex={popupCaseStudy !== 'project4' ? 0 : undefined}
              onKeyDown={popupCaseStudy !== 'project4' ? (e) => e.key === 'Enter' && handlePark() : undefined}
              aria-label={popupCaseStudy !== 'project4' ? 'Click to park FigPal' : undefined}
            >
              <FigPalSign name={figpalFollowState.displayName || 'FigPal'} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

