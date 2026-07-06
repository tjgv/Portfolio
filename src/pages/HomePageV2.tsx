import { useCallback, useEffect, useState, useRef, lazy, Suspense } from 'react'
import { ArrowUpRight, Gamepad2, Maximize2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { FigPalFollowState, FigPalBuilderState } from '../components/FigPalCharacterBuilder'
import FigPalSign from '../components/FigPalSign'
import { MediaLoader, ImgWithLoader } from '../components/MediaLoader'
import CxProPage from './CxProPage'
import Project2Page from './Project2Page'
import NewProject1Page, { NEW_PROJECT_1_META, NEW_PROJECT_1_ROUTE } from './NewProject1Page'
import './HomePageV2.css'

const FigPalPopup = lazy(() => import('../components/FigPalPopup'))
const FigPalFloatingCharacter = lazy(() =>
  import('../components/FigPalCharacterBuilder').then((m) => ({ default: m.FigPalFloatingCharacter }))
)


type CaseStudyId = 'placeholder1' | 'project1' | 'project2' | 'project3' | 'project4' | null

const PROJECT3_FIGMA_EMBED =
  'https://embed.figma.com/design/kfYbHeyfx7kIagEc0BxvMb/Genius-Sports--Copy-?node-id=56-1067&embed-host=share'

const RESUME_PDF_PATH = '/resume/TJ-Gomez-Vidal-Resume.pdf'
const LINKEDIN_URL = 'https://www.linkedin.com/in/trent-gomez-vidal/?skipRedirect=true'

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
      <span className="home-v2-card-pill"><span className="home-v2-card-pill-label">{label}</span><span className="home-v2-card-pill-year"> · {year}</span></span>
    </button>
  )
}


/* New project 1 preview popup — slot 1 case study shell */
function NewProject1Popup({ onClose }: { onClose: () => void }) {
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
        className={`home-v2-popup home-v2-popup--dark ${isExpanding ? 'home-v2-popup--expanding' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="home-v2-popup-nav" aria-label="Preview actions">
          <button
            type="button"
            className="home-v2-popup-expand"
            onClick={handleExpandClick}
            aria-label="View full case study"
          >
            <Maximize2 size={18} aria-hidden />
            <span className="home-v2-popup-expand-text">View Full</span>
          </button>
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
        </nav>
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
            <NewProject1Page embedded />
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
function CaseStudyPopup({
  caseStudyId,
  onClose,
}: {
  caseStudyId: 'project1' | 'project2'
  onClose: () => void
}) {
  const navigate = useNavigate()
  const fullHref = caseStudyId === 'project1' ? '/project1' : '/project2'
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

  const title = caseStudyId === 'project1' ? 'CX Pro' : 'Validus'
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
        <nav className="home-v2-popup-nav" aria-label="Preview actions">
          <button
            type="button"
            className="home-v2-popup-expand"
            onClick={handleExpandClick}
            aria-label="View full case study"
          >
            <Maximize2 size={18} aria-hidden />
            <span className="home-v2-popup-expand-text">View Full</span>
          </button>
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
        </nav>
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

const WORK_CARDS = [
  {
    id: 'placeholder1',
    label: 'Consumer-Grade CX Pro',
    year: '2026',
    hoverLine: 'Defining MVP and north star direction for a consumer-grade CX Pro',
    bgStyle: { backgroundImage: 'url(/new-project-1/hero-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'project1' as const,
    label: 'CX Pro',
    year: '2023-25',
    hoverLine: 'Scaling 0→1 enterprise platform to commercial launch.',
    bgStyle: { backgroundImage: 'url(/project1-cx.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'project2' as const,
    label: 'Validus',
    year: '2022',
    hoverLine: 'Reviving a legacy product with +72% satisfaction.',
    bgStyle: { backgroundImage: 'url(/project2-events.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'dark',
  },
  {
    id: 'project3' as const,
    label: 'NFL IQ',
    year: '2026',
    hoverLine: 'More work on the way.',
    bgStyle: { backgroundImage: 'url(/project3-placeholder.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
  {
    id: 'placeholder2',
    label: 'Coming soon',
    year: '—',
    hoverLine: 'More work on the way.',
    bgStyle: { backgroundImage: 'url(/project5-cosm-app.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'placeholder',
  },
  {
    id: 'project4' as const,
    label: 'FigPal Forever',
    year: '2026',
    hoverLine: 'Create your own character. Customize and take it with you.',
    bgStyle: { backgroundImage: 'url(/figpal-cover.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
    visual: 'apple',
  },
]

export default function HomePageV2() {
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
              <nav className="home-v2-nav" aria-label="Main">
                <button type="button" className="home-v2-nav-item home-v2-nav-item--active">Work</button>
                <Link to="/contact" className="home-v2-nav-item">About</Link>
                <span className="home-v2-nav-divider" aria-hidden="true" />
                <a
                  href={RESUME_PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-v2-nav-item home-v2-nav-item--external"
                >
                  Resume
                  <NavExternalArrow />
                </a>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home-v2-nav-item home-v2-nav-item--external"
                >
                  LinkedIn
                  <NavExternalArrow />
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="home-v2-main">
          <div className="home-v2-cards">
            {WORK_CARDS.map((card) => {
              const isPlaying =
                (card.id === 'placeholder1' && heroShowVideo) ||
                (card.id === 'project1' && project1ShowVideo) ||
                (card.id === 'project2' && project2ShowVideo)
              return (
              <div key={card.id} className={`home-v2-card-wrap${isPlaying ? ' home-v2-card-wrap--playing' : ''}`}>
                {card.id === 'placeholder1' ? (
                  <MediaCycleCard
                    onClick={() => openPopup('placeholder1')}
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
                ) : card.id === 'placeholder2' ? (
                  <button
                    type="button"
                    className={`home-v2-card home-v2-card--${card.visual}`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    disabled
                    aria-label={card.label}
                  >
                    <span className="home-v2-card-pill"><span className="home-v2-card-pill-label">{card.label}</span><span className="home-v2-card-pill-year"> · {card.year}</span></span>
                  </button>
                ) : card.id === 'project1' ? (
                  <MediaCycleCard
                    onClick={() => openPopup('project1')}
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
                    onClick={() => openPopup('project2')}
                    imgSrc="/project2-events.png"
                    videoSrc="/Vid2.mov"
                    label="Validus"
                    year="2022"
                    visual="dark"
                    showVideo={project2ShowVideo}
                    onVideoEnded={onProject2VideoEnded}
                    videoPreload="metadata"
                  />
                ) : card.id === 'project3' ? (
                  <button
                    type="button"
                    className={`home-v2-card home-v2-card--${card.visual} home-v2-card--has-bg home-v2-card--project3`}
                    style={'bgStyle' in card ? card.bgStyle : undefined}
                    onClick={() => openPopup('project3')}
                    aria-label="Open NFL IQ Figma prototype"
                  >
                    <span className="home-v2-card-pill"><span className="home-v2-card-pill-label">{card.label}</span><span className="home-v2-card-pill-year"> · {card.year}</span></span>
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
                    <span className="home-v2-card-pill"><span className="home-v2-card-pill-label">{card.label}</span><span className="home-v2-card-pill-year"> · {card.year}</span></span>
                    <span className="home-v2-card-chip home-v2-card-chip--try">
                      <Gamepad2 size={14} strokeWidth={2.5} aria-hidden />
                      Try it out!
                    </span>
                  </button>
                ) : null}
                <span className="home-v2-card-hover-line">{card.hoverLine}</span>
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
      ) : popupCaseStudy === 'project3' ? (
        <Project3FigmaPopup onClose={closePopup} />
      ) : popupCaseStudy === 'placeholder1' ? (
        <NewProject1Popup onClose={closePopup} />
      ) : popupCaseStudy === 'project1' || popupCaseStudy === 'project2' ? (
        <CaseStudyPopup caseStudyId={popupCaseStudy} onClose={closePopup} />
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

