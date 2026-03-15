import { useCallback, useEffect, useState, useRef, lazy, Suspense } from 'react'
import { Gamepad2, Maximize2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { FigPalFollowState, FigPalBuilderState } from '../components/FigPalCharacterBuilder'
import { SvgOrImg } from '../components/FigPalCharacterBuilder'
import { MediaLoader, ImgWithLoader } from '../components/MediaLoader'
import CxProPage from './CxProPage'
import Project2Page from './Project2Page'
import './HomePageV2.css'

const FigPalPopup = lazy(() => import('../components/FigPalPopup'))
const FigPalFloatingCharacter = lazy(() =>
  import('../components/FigPalCharacterBuilder').then((m) => ({ default: m.FigPalFloatingCharacter }))
)


type CaseStudyId = 'project1' | 'project2' | 'project4' | null

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
          onLoad={() => setImgLoaded(true)}
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

const WORK_CARDS = [
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
    id: 'placeholder2',
    label: 'Coming soon',
    year: '—',
    hoverLine: 'More work on the way.',
    bgStyle: { backgroundImage: 'url(/project3-placeholder.png)', backgroundSize: 'cover', backgroundPosition: 'center' },
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
  const [project1ShowVideo, setProject1ShowVideo] = useState(true)
  const [project2ShowVideo, setProject2ShowVideo] = useState(false)
  const [figpalFollowState, setFigpalFollowState] = useState<FigPalFollowState>({
    enabled: false,
    characterUrl: '',
    accessoryUrl: null,
    displayName: '',
  })
  const [figpalBuilderState, setFigpalBuilderState] = useState<FigPalBuilderState | null>(null)
  const [figpalParked, setFigpalParked] = useState(false)

  const openPopup = useCallback((id: CaseStudyId) => setPopupCaseStudy(id), [])
  const closePopup = useCallback(() => setPopupCaseStudy(null), [])

  /* Ensure on page load: project 1 plays first, loop starts with project 1. */
  useEffect(() => {
    setProject1ShowVideo(true)
    setProject2ShowVideo(false)
  }, [])

  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onProject1VideoEnded = useCallback(() => {
    setProject1ShowVideo(false)
    switchTimeoutRef.current = setTimeout(() => setProject2ShowVideo(true), 5000)
  }, [])

  const onProject2VideoEnded = useCallback(() => {
    setProject2ShowVideo(false)
    switchTimeoutRef.current = setTimeout(() => setProject1ShowVideo(true), 5000)
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
                <Link to="/ai" className="home-v2-nav-item">A.I Prompts</Link>
                <Link to="/contact" className="home-v2-nav-item">About</Link>
              </nav>
            </div>
          </div>
        </header>
        <main className="home-v2-main">
          <div className="home-v2-cards">
            {WORK_CARDS.map((card) => {
              const isPlaying = (card.id === 'project1' && project1ShowVideo) || (card.id === 'project2' && project2ShowVideo)
              return (
              <div key={card.id} className={`home-v2-card-wrap${isPlaying ? ' home-v2-card-wrap--playing' : ''}`}>
                {card.id === 'project1' ? (
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
              <Link to="/ai" className="home-v2-footer-link">A.I Prompts</Link>
              <Link to="/contact" className="home-v2-footer-link">About</Link>
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
            onClose={closePopup}
            onFollowMouseChange={setFigpalFollowState}
            initialState={figpalBuilderState}
            onStateChange={setFigpalBuilderState}
          />
        </Suspense>
      ) : popupCaseStudy ? (
        <CaseStudyPopup caseStudyId={popupCaseStudy} onClose={closePopup} />
      ) : null}
      {figpalFollowState.enabled && figpalParked && popupCaseStudy !== 'project4' && (
        <div
          className="figpal-parked"
          onClick={() => setFigpalParked(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setFigpalParked(false)}
          aria-label="Click to unpark FigPal"
        >
          <span className="figpal-parked-name">{figpalFollowState.displayName || 'FigPal'}</span>
          <div className="figpal-parked-stage" style={{ backgroundImage: 'url(/figpal/Stage2.png)' }} />
          <div className="figpal-parked-char-wrap">
            <SvgOrImg src={figpalFollowState.characterUrl} className="figpal-parked-char" />
            {figpalFollowState.accessoryUrl && (
              <SvgOrImg src={figpalFollowState.accessoryUrl} className="figpal-parked-acc" />
            )}
          </div>
        </div>
      )}
      {figpalFollowState.enabled && !figpalParked && (
        <>
          <Suspense fallback={null}>
            <FigPalFloatingCharacter
              enabled={figpalFollowState.enabled}
              characterUrl={figpalFollowState.characterUrl}
              accessoryUrl={figpalFollowState.accessoryUrl}
            />
          </Suspense>
          <div
            className="figpal-sign-wrap figpal-sign-wrap--clickable"
            onClick={popupCaseStudy !== 'project4' ? () => setFigpalParked(true) : undefined}
            role={popupCaseStudy !== 'project4' ? 'button' : undefined}
            tabIndex={popupCaseStudy !== 'project4' ? 0 : undefined}
            onKeyDown={popupCaseStudy !== 'project4' ? (e) => e.key === 'Enter' && setFigpalParked(true) : undefined}
            aria-label={popupCaseStudy !== 'project4' ? 'Click to park FigPal' : undefined}
          >
            <span className="figpal-sign-name">{figpalFollowState.displayName || 'FigPal'}</span>
            <ImgWithLoader
              src="/figpal/FigPalSign.svg"
              alt="FigPal"
              className="figpal-sign"
              aria-hidden
            />
          </div>
        </>
      )}
    </div>
  )
}

