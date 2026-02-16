import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CxProPage.css'

const CX_IMAGES = '/cx-pro-images'
/** Bump this when you replace section 21 images (same filenames) to avoid cache */
const CX_SECTION_21_CACHE = 2
const CX_CAROUSEL_CARD_WIDTH = 560
const CX_CAROUSEL_GAP = 20
const CX_SLIDE_DURATION_MS = 500
const CX_SLIDE_EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

type CarouselItem = { id: string; imageUrl?: string; caption?: string }

/* Full-screen image lightbox – CX Pro project only */
const LIGHTBOX_FADEOUT_MS = 220

function CxLightbox({
  items,
  initialIndex,
  onClose,
}: {
  items: string[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const [isClosing, setIsClosing] = useState(false)
  const hasMultiple = items.length > 1

  useEffect(() => {
    setIndex(initialIndex)
  }, [initialIndex])

  const handleClose = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    setTimeout(onClose, LIGHTBOX_FADEOUT_MS)
  }, [onClose, isClosing])

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [handleClose])

  const goPrev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length])
  const goNext = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length])

  return (
    <div
      className={`cx-lightbox-overlay ${isClosing ? 'cx-lightbox-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Image full screen"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <button type="button" className="cx-lightbox-close" onClick={handleClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
      {hasMultiple && (
        <>
          <button type="button" className="cx-lightbox-arrow cx-lightbox-arrow-left" onClick={goPrev} aria-label="Previous image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cx-lightbox-arrow cx-lightbox-arrow-right" onClick={goNext} aria-label="Next image">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
      <div className="cx-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={items[index]} alt="" className="cx-lightbox-img" />
      </div>
      {hasMultiple && (
        <div className="cx-lightbox-strip" onClick={(e) => e.stopPropagation()}>
          {items.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`cx-lightbox-thumb ${i === index ? 'cx-lightbox-thumb-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const CX_CAROUSEL_SECTION6_CARD_WIDTH = 700
const CX_CAROUSEL_SECTION6_GAP = 20

function CxCarousel({
  items,
  onOpenLightbox,
  cardWidth,
  cardGap,
}: {
  items: CarouselItem[]
  onOpenLightbox?: (urls: string[], index: number) => void
  cardWidth?: number
  cardGap?: number
}) {
  const [index, setIndex] = useState(0)
  const [slideOffset, setSlideOffset] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const imageUrls = items.map((i) => i.imageUrl).filter((u): u is string => !!u)
  const slidePx = (cardWidth ?? CX_CAROUSEL_CARD_WIDTH) + (cardGap ?? CX_CAROUSEL_GAP)

  if (items.length === 0) return null

  const goPrev = () => {
    if (isSliding || items.length <= 1) return
    setIsSliding(true)
    setSlideOffset(slidePx)
    setTimeout(() => {
      setIndex((i) => (i - 1 + items.length) % items.length)
      setSlideOffset(0)
      setIsSliding(false)
    }, CX_SLIDE_DURATION_MS)
  }

  const goNext = () => {
    if (isSliding || items.length <= 1) return
    setIsSliding(true)
    setSlideOffset(-slidePx)
    setTimeout(() => {
      setIndex((i) => (i + 1) % items.length)
      setSlideOffset(0)
      setIsSliding(false)
    }, CX_SLIDE_DURATION_MS)
  }

  const handleCardClick = (idx: number) => {
    if (isSliding) return
    if (onOpenLightbox && imageUrls.length > 0) {
      onOpenLightbox(imageUrls, idx)
    } else if (items.length > 1) {
      if (idx !== index) {
        if ((idx - index + items.length) % items.length === 1) goNext()
        else goPrev()
      }
    }
  }

  return (
    <div className="cx-carousel-wrapper">
      {items.length > 1 && (
        <>
          <button type="button" className="cx-carousel-arrow cx-carousel-arrow-left" onClick={goPrev} aria-label="Previous slide" aria-hidden={isSliding}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" className="cx-carousel-arrow cx-carousel-arrow-right" onClick={goNext} aria-label="Next slide" aria-hidden={isSliding}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </>
      )}
      <div
        className="cx-carousel"
        style={{
          transform: `translate(calc(-50% + ${slideOffset}px), 0)`,
          transition: slideOffset === 0 ? 'none' : `transform ${CX_SLIDE_DURATION_MS}ms ${CX_SLIDE_EASING}`,
        }}
        data-sliding={isSliding || undefined}
      >
        {(items.length === 1 ? [0] : [-1, 0, 1]).map((offset) => {
          const idx = (index + offset + items.length) % items.length
          const item = items[idx]
          const isActive = offset === 0
          const isPrev = offset === -1
          const isNext = offset === 1
          return (
            <div
              key={`${offset}-${item.id}`}
              className={`cx-carousel-card ${isActive ? 'cx-carousel-card-active' : 'cx-carousel-card-side'} ${item.imageUrl ? 'cx-carousel-card-clickable' : ''}`}
              role={item.imageUrl ? 'button' : !isActive && items.length > 1 ? 'button' : undefined}
              tabIndex={item.imageUrl || !isActive ? 0 : -1}
              onClick={() => handleCardClick(idx)}
              onKeyDown={(e) => e.key === 'Enter' && (item.imageUrl ? handleCardClick(idx) : !isSliding && items.length > 1 && (isPrev ? goPrev() : isNext ? goNext() : null))}
              aria-hidden={!isActive}
            >
              {item.imageUrl ? (
                <>
                  <img src={item.imageUrl} alt="" className="cx-carousel-card-img" />
                  {item.caption != null && <span className="cx-carousel-card-caption">{item.caption}</span>}
                </>
              ) : (
                <>
                  <span>Image {idx + 1}</span>
                  {item.caption != null && <span className="cx-carousel-card-caption">{item.caption}</span>}
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  const root = document.scrollingElement
  if (root && root !== document.body) (root as HTMLElement).scrollTop = 0
}

export default function CxProPage() {
  const [lightbox, setLightbox] = useState<{ items: string[]; index: number } | null>(null)
  const openLightbox = useCallback((items: string[], index: number) => setLightbox({ items, index }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const pageTopRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    scrollToTop()
    pageTopRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    const timeouts: ReturnType<typeof setTimeout>[] = []
    for (const ms of [0, 10, 50, 100, 200, 350, 500]) {
      timeouts.push(setTimeout(() => {
        scrollToTop()
        pageTopRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
      }, ms))
    }
    return () => timeouts.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      scrollToTop()
      pageTopRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' })
    }, 50)
    const stop = setTimeout(() => clearInterval(id), 400)
    return () => {
      clearInterval(id)
      clearTimeout(stop)
    }
  }, [])

  return (
    <div ref={pageTopRef} className="app project-page cx-pro-page">
      {lightbox != null && (
        <CxLightbox items={lightbox.items} initialIndex={lightbox.index} onClose={closeLightbox} />
      )}
      <nav className="navbar-glass" aria-label="Main navigation">
        <div className="navbar-content">
          <Link to="/" className="nav-brand nav-brand-back" aria-label="Back to home">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </Link>
          <div className="nav-links">
            <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="project-main">
        {/* 1. Intro section – hero with logo, hero text, chips, arrow */}
        <section className="cx-hero-intro" aria-label="Project intro">
          <div className="cx-hero-intro-body">
            <img src="/cosm-logotype.png" alt="Cosm" className="cx-hero-logo" />
            <p className="cx-hero-text">
              Leading the design of Cosm's immersive venue platform, evolving a 0→1 product into a scalable B2B2C flagship
            </p>
            <div className="cx-hero-chips">
              {['0 -> 1 Design Leadership', 'Stakeholder Alignment', 'User Research', 'Design System'].map((chip) => (
                <span key={chip} className="cx-hero-chip">{chip}</span>
              ))}
            </div>
          </div>
          <div className="cx-hero-arrow" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
          </div>
        </section>

        {/* 2. (2x1) Col1 empty, Col2: "Context" XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Context</h2>
          </div>
        </div>
        </div>

        {/* 3. (2x1) Col1: "What is Cosm?" Header 2 | Col2: paragraph + placeholder image */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1">
            <h2 className="header-2">What is Cosm?</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Cosm is a company formed by several teams uniting to reinvent how audiences experience content through <em>Shared Reality</em>. <strong>Think virtual reality - but shared experienced along side an audience.</strong> At the heart of this vision is the CX Display, a massive dome-like environment that <em>immerses</em> viewers, transforming the venue into anything imaginable.
            </p>
            <div className="cx-full-width">
              <img src={`${CX_IMAGES}/3.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/3.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/3.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 4. (2x1) Has top divider. Col1: "My Role" H2 | Col2: role/team/timeline blocks + paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">My Role</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <div className="cx-s5-blocks">
              <div className="cx-s5-stack">
                <div className="cx-s5-heading-wrap">
                  <div className="cx-s5-row">
                    <svg className="cx-s5-icon cx-s5-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                    <span className="cx-s5-label">My Role</span>
                  </div>
                  <div className="cx-s5-divider" aria-hidden />
                </div>
                <span className="cx-s5-value">Product Designer</span>
                <p className="cx-s5-para">Sole Designer for CX Pro Product Team, conducted end-to-end UX Design processes and contributed heavily to product strategy.</p>
              </div>
              <div className="cx-s5-stack">
                <div className="cx-s5-heading-wrap">
                  <div className="cx-s5-row">
                    <svg className="cx-s5-icon cx-s5-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                    <span className="cx-s5-label">Team</span>
                  </div>
                  <div className="cx-s5-divider" aria-hidden />
                </div>
                <div className="cx-s5-person">
                  <span className="cx-s5-name">Ryan Kuttler</span>
                  <span className="cx-s5-role">Head of Product</span>
                </div>
                <div className="cx-s5-person">
                  <span className="cx-s5-name">Brian DeBoer</span>
                  <span className="cx-s5-role">VP of Engineering</span>
                </div>
              </div>
              <div className="cx-s5-stack">
                <div className="cx-s5-heading-wrap">
                  <div className="cx-s5-row">
                    <svg className="cx-s5-icon cx-s5-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M200-640h560v-80H200v80Zm0 0v-80 80Zm0 560q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v227q-19-9-39-15t-41-9v-43H200v400h252q7 22 16.5 42T491-80H200Zm378.5-18.5Q520-157 520-240t58.5-141.5Q637-440 720-440t141.5 58.5Q920-323 920-240T861.5-98.5Q803-40 720-40T578.5-98.5ZM787-145l28-28-75-75v-112h-40v128l87 87Z"/></svg>
                    <span className="cx-s5-label">Timeline</span>
                  </div>
                  <div className="cx-s5-divider" aria-hidden />
                </div>
                <span className="cx-s5-value">Nov 23 - Nov 25</span>
              </div>
            </div>
            <p className="paragraph-text">
              My role at Cosm was the <strong>sole designer</strong> of a 0 to 1 platform: CX Pro, a desktop application which controls the companies immersive experiences across all venues. Below is an overview of how <strong>I evolved CX Pro from an engineering mockup to an enterprise flagship product.</strong>
            </p>
          </div>
        </div>
        </div>

        {/* 5. Header section: Icon + "Evolution of CX Pro" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m256-240-56-56 384-384H240v-80h480v480h-80v-344L256-240Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Evolution of CX Pro</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Iterations of CX Pro from concept to venue launch to B2B cliental.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 5b. (2x1) Has divider. Col1: H2 | Col2: paragraph – same style as Learning and Alignment */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Problems Solved</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              This case study demonstrates the various problem spaces I guided CX Pro which each version represents.
            </p>
            <p className="paragraph-text">
              <strong>Version 1.0:</strong> (Dec 23 – Jun 24) Rapid pivots around constant shifting of engineering scope to find an MVP
            </p>
            <p className="paragraph-text">
              <strong>Version 2.0:</strong> (Jul 24 – Feb 25) Re-centering product around user needs post launch as we began to have users.
            </p>
            <p className="paragraph-text">
              <strong>Version 3.0:</strong> (Mar 25 – Oct 25) Honing in on conceptual clarity to prepare for an external B2B2C launch.
            </p>
          </div>
        </div>
        </div>

        {/* 6. Carousel of images */}
        <div className="cx-section">          <div className="cx-carousel-bleed cx-carousel-bleed--large-cards">
            <CxCarousel
              items={[
                { id: '6.1', imageUrl: `${CX_IMAGES}/6.1.png` },
                { id: '6.2', imageUrl: `${CX_IMAGES}/6.2.png` },
                { id: '6.3', imageUrl: `${CX_IMAGES}/6.3.png` },
                { id: '6.4', imageUrl: `${CX_IMAGES}/6.4.png` },
                { id: '6.5', imageUrl: `${CX_IMAGES}/6.5.png` },
              ]}
              onOpenLightbox={openLightbox}
              cardWidth={CX_CAROUSEL_SECTION6_CARD_WIDTH}
              cardGap={CX_CAROUSEL_SECTION6_GAP}
            />
          </div>
        </div>

        {/* 7. Header section: Icon + "From 0 to 1" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m499-287 335-335-52-52-335 335 52 52Zm-261 87q-100-5-149-42T40-349q0-65 53.5-105.5T242-503q39-3 58.5-12.5T320-542q0-26-29.5-39T193-600l7-80q103 8 151.5 41.5T400-542q0 53-38.5 83T248-423q-64 5-96 23.5T120-349q0 35 28 50.5t94 18.5l-4 80Zm280 7L353-358l382-382q20-20 47.5-20t47.5 20l70 70q20 20 20 47.5T900-575L518-193Zm-159 33q-17 4-30-9t-9-30l33-159 165 165-159 33Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">From 0 to 1</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Leading the design initatives of an immersive entertainment controller from concept to reality</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 8. (2x1) Has divider. Col1: "Problem" H2 | Col2: paragraph + 3 stat cards */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Problem</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Given the tight development timeline, the MVP for CX Pro needed to be defined at least two months before opening—by June. This challenge was compounded by the fact that the venue's actual run-of-show needs were still unknown, and the runtime engine's required controls to support those schedules were not yet fully defined.
            </p>
            <div className="cx-stat-cards cx-stat-cards--section9-headers">
              <div className="cx-stat-card">
                <span className="header-2" style={{ marginBottom: 0 }}>Unknown</span>
                <span style={{ fontWeight: 600 }}>Workflow & Needs</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">The details for what the run-time tech required to produce an event were still unknown.</p>
              </div>
              <div className="cx-stat-card">
                <span className="header-2" style={{ marginBottom: 0 }}>3-4</span>
                <span style={{ fontWeight: 600 }}>Months to Launch</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">Although it was 6 months out from venue launch, we needed to consider development time.</p>
              </div>
              <div className="cx-stat-card">
                <span className="header-2" style={{ marginBottom: 0 }}>Design Trailing</span>
                <span style={{ fontWeight: 600 }}>Engineering efforts</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">I onboarded as the technical systems were in the midst of rapid development & constant pivoting.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 9. (2x1) Has divider. Col1: "Learning and Alignment" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Learning and Alignment</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              When I joined the team, Engineering was already deep into building the underlying features/systems that CX Pro would eventually control. With aggressive timelines, these systems were constantly in flux - both in scope and in behavior - as requirements shifted to meet delivery deadlines. The created a dynamic where design trailed engineering innovation. To ensure this didn't snowball into an aimless direction, I organized a feature priortization working session with stakeholders so that I had a list of tangible flows to iterate on as engineering built those systems. To understand how those flows should be designed, I followed up with a user-understanding working session to discuss what we can assume about our future users' needs.
            </p>
          </div>
        </div>
        </div>

        {/* 10. Full width Figma embed */}
        <div className="cx-section">        <div className="cx-figma-embed">
          <iframe
            src="https://embed.figma.com/design/74MwW6NWOIc6F23o2q8jVP/Figma-Portfolio?node-id=550-32512&embed-host=share"
            style={{ width: '100%', height: '100%', minHeight: 480, border: '1px solid rgba(0,0,0,0.1)' }}
            allowFullScreen
            title="Figma embed"
          />
        </div>
        </div>

        {/* 11. (2x1) Has divider. Col1: "Gaining Alignment" H2 | Col2: 2 divs horizontal + paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Gaining Alignment</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <div className="cx-two-cols">
              <div className="cx-learning-item">
                <span className="header-1" style={{ marginTop: 0 }}>01</span>
                <span className="cx-line2">Core use cases: Building Scenes & Running Shows</span>
              </div>
              <div className="cx-learning-item">
                <span className="header-1" style={{ marginTop: 0 }}>02</span>
                <span className="cx-line2">Be more like Canva, less like Photoshop</span>
              </div>
            </div>
            <p className="paragraph-text">
              After the initial set of stakeholder review sessions, we gained alignment on primary use-cases and the fundamental nature for how the product should behave.
            </p>
          </div>
        </div>
        </div>

        {/* 12. Header section: Icon + "Version 1 CX Pro" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm155-121.5q0-33.5 23-56.5t57-23q34 0 57 23t23 56.5q0 33.5-23 56.5t-57 23q-34 0-57-23t-23-56.5ZM565-220l84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Version 1 CX Pro</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">MVP Candidate to lead Cosm into venue launch</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 13. (2x1) Has divider. Col1: "MVP Candidate" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">MVP Candidate</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              9 Weeks out to venue launch, we had an agreed on MVP for CX Pro which mirrored the near-future of technical development. To make this happen, I leaned heavily into engineering meetings & scrum sessions to answer questions and get ahead of any pivots that needed to be made.
            </p>
          </div>
        </div>
        </div>

        {/* 14. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${CX_IMAGES}/14.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/14.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/14.png`], 0)} />
        </div>
        </div>

        {/* 15. Full screen loop background video */}
        <div className="cx-section">        <div className="cx-full-screen cx-video-backdrop">
          <video
            className="cx-video-backdrop__video"
            src="/cx-pro-images/15.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
          <div className="cx-video-backdrop__overlay" aria-hidden>
            VENUE LAUNCH
          </div>
        </div>
        </div>

        {/* 16. (2x1) Col1 empty | Col2: "Design" XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Design</h2>
          </div>
        </div>
        </div>

        {/* 17. Header section: Icon + "Post Launch Design Initatives" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H200Zm0-80h560v-160H200v160Zm0 480q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h560q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H200Zm0-80h560v-160H200v160Zm0-560v160-160Zm0 400v160-160Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Post Launch Design Initatives</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Developing and executing product strategy to smooth operations</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 18. (2x1) Has divider. Col1: "Prioritizing Fast Follow Items" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Prioritizing Fast Follow Items</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              After launch, our focus shifted to stabilizing the product and improving day-to-day workflows. The most important changes in the dynamic is: 1. We now have users to learn from 2. Design is now ahead of engineering, but not by much. Immediate goals post launch: 1. Fill engineering backlog to create a steady lead on engineering 2. Rectify usability pitfalls from the assumption-based phase of design. As CX Pro had been built at warp speed, Operators (our users) were dealing with bugs, system errors, and an unfamiliar workflow all at once. To address this, I created a shared system-request document to collect user insights and guide design initatives.
            </p>
            <div className="cx-full-width">
              <img src={`${CX_IMAGES}/18.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/18.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/18.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 19. (2x1) Has divider. Col1: "Addressing the right problems" H2 | Col2: paragraph + 3 colored cards (2 top, 1 bottom) */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Addressing the right problems</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              As users became more familiar with the tool, the reoccurring pain points became more obvious: Operators felt overly rushed to set up the next show in back to back schedules. Operators were constantly anxious of technical errors that might affect (many) scenes in front of a live audience. Operators were getting lost in their scenes as Cosm Run of Shows became more and more complex.
            </p>
            <div className="cx-feature-cards">
              <div className="cx-feature-card cx-feature-card--purple">
                <h3 className="cx-feature-card-title" style={{ color: '#a75fd8' }}>Templates & Show Manager</h3>
                <p className="cx-feature-card-desc">How can we optimize the show management process so that users can confidently transition to the next show during back-to-back schedules?</p>
                <div className="cx-feature-card-icon" style={{ background: '#a75fd8' }} aria-hidden />
              </div>
              <div className="cx-feature-card cx-feature-card--blue">
                <h3 className="cx-feature-card-title" style={{ color: '#71b6e4' }}>Global Controls</h3>
                <p className="cx-feature-card-desc">How can we quickly fix a show when dome operators encounter an error which spans across many scenes?</p>
                <div className="cx-feature-card-icon" style={{ background: '#71b6e4' }} aria-hidden />
              </div>
              <div className="cx-feature-card cx-feature-card--orange">
                <h3 className="cx-feature-card-title" style={{ color: '#f2a854' }}>Sequencer</h3>
                <p className="cx-feature-card-desc">How might we help operators easily understand and track the full sequence of scenes during complex Run-of-Shows?</p>
                <div className="cx-feature-card-icon" style={{ background: '#f2a854' }} aria-hidden />
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 20. (2x1) Has divider. Col1: "Project #1: Global Controls" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Project #1: Global Controls</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              <strong>Problem:</strong> Scene re-creation in CX Pro became a primary method of troubleshooting system bugs. This process would cause severe audience impacts during live environments as re-creating scenes within a show took too much time.<br /><br />
              <strong>Constraints:</strong> - 1 month to deliver: Meaning I had 1-2 week design cycle to ideate, design, validate, and align on a solution. - Additionally, the solution must be light-weight enough for engineers to meet deadline.<br /><br />
              <strong>Solution:</strong> A parent-child system of global controls, granting the ability to designate a scene as a 'parent' and make copies of it as 'children scenes.' Making a change to the parent would affect all children, but not vice-versa to retain children-distinctiveness. This enables users to configure many scenes simultaenously, thus drastically reducting time to re-create scenes.
            </p>
          </div>
        </div>
        </div>

        {/* 21. Carousel */}
        <div className="cx-section">          <div className="cx-carousel-bleed cx-carousel-bleed--large-cards">
            <CxCarousel
              items={[
                { id: '21.1', imageUrl: `${CX_IMAGES}/21.1.png?v=${CX_SECTION_21_CACHE}` },
                { id: '21.2', imageUrl: `${CX_IMAGES}/21.2.png?v=${CX_SECTION_21_CACHE}` },
                { id: '21.3', imageUrl: `${CX_IMAGES}/21.3.png?v=${CX_SECTION_21_CACHE}` },
              ]}
              onOpenLightbox={openLightbox}
              cardWidth={CX_CAROUSEL_SECTION6_CARD_WIDTH}
              cardGap={CX_CAROUSEL_SECTION6_GAP}
            />
          </div>
        </div>

        {/* 22. (2x1) Has divider. Col1: "Project #2: Show Manager" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Project #2: Show Manager</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              <strong>Problem:</strong> it was taking too long in back-to-back event schedules for users to setup next event.<br /><br />
              <strong>Methodologies used:</strong> Conducted user interviews with Operators and tangiental teams in event startup process, created System Map of user touchpoints<br /><br />
              <strong>Findings:</strong> - Too much overhead (Event itinerary, long file paths, asset-population-guides) - Long setup (Shows often not pre-built, or can only be pre-built to a certain extent)<br /><br />
              <strong>Solution:</strong> - (Addressing overhead) Show Manager: I worked with our CMS team to create an integration of file-path locations and event scheduling into CX Pro, creating a singular place for operators to find, load, and save shows for their venue. - (Addressing long setup) Show Templates: A way for users to save a configuration as a "template" for reuse when creating newshows. Leadership was keen on increasing standardization as more venues were on the way. I took this opportunity to introduce show templates as a way to increase show setup speed and standardize our shows.
            </p>
          </div>
        </div>
        </div>

        {/* 23. Carousel */}
        <div className="cx-section">          <div className="cx-carousel-bleed cx-carousel-bleed--large-cards">
            <CxCarousel
              items={[
                { id: '23.1', imageUrl: `${CX_IMAGES}/23.1.png` },
                { id: '23.2', imageUrl: `${CX_IMAGES}/23.2.png` },
                { id: '23.3', imageUrl: `${CX_IMAGES}/23.3.png` },
              ]}
              onOpenLightbox={openLightbox}
              cardWidth={CX_CAROUSEL_SECTION6_CARD_WIDTH}
              cardGap={CX_CAROUSEL_SECTION6_GAP}
            />
          </div>
        </div>

        {/* 24. Full width Figma embed */}
        <div className="cx-section">        <div className="cx-figma-embed">
          <iframe
            src="https://embed.figma.com/design/74MwW6NWOIc6F23o2q8jVP/Figma-Portfolio---Library-Snipept?node-id=52-13783&embed-host=share"
            style={{ width: '100%', height: '100%', minHeight: 480, border: '1px solid rgba(0,0,0,0.1)' }}
            allowFullScreen
            title="Figma Library embed"
          />
        </div>
        </div>

        {/* 25. (2x1) Has divider. Col1: "Design System Upkeep and Scaling" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Design System Upkeep and Scaling</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              With 1-week release cycles and no shortage of large-sclae projects, most engineering efforts went toward shipping and fixing. While working through feature design were my main priority, I partnered with engineers to scale the design system in tandem, introducing patterns gradually and setting up library versioning so design stayed in step with implementation.
            </p>
          </div>
        </div>
        </div>

        {/* 26. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${CX_IMAGES}/26.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/26.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/26.png`], 0)} />
        </div>
        </div>

        {/* 27. Header section: Icon + "Version 2.0" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Version 2.0</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">2 Quarters: 4+ high impact features delivered + refined & expanded design library</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 28. (2x1) Has divider. Col1: "Optimized Workflows" H2 | Col2: paragraph + quote block */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Optimized Workflows</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              With the delivery of these new features, users saw a massive boost to workflow speeds. More importantly, our users felt more safe/confident running shows with the added power boost that global controls grants.
            </p>
            <div className="cx-quote-block">
              <p className="paragraph-text">"I feel like I can really set up my scenes in a way that makes more sense to me because I know the parent state is there to save me if an error happens"</p>
              <cite>— <strong>Mario R.</strong> <em>- Dome Operator</em></cite>
            </div>
          </div>
        </div>
        </div>

        {/* 29. Full width Figma embed */}
        <div className="cx-section">        <div className="cx-figma-embed">
          <iframe
            src="https://embed.figma.com/design/74MwW6NWOIc6F23o2q8jVP/Figma-Portfolio?node-id=2749-32695&embed-host=share"
            style={{ width: '100%', height: '100%', minHeight: 480, border: '1px solid rgba(0,0,0,0.1)' }}
            allowFullScreen
            title="Figma embed"
          />
        </div>
        </div>

        {/* 30. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${CX_IMAGES}/30.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/30.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/30.png`], 0)} />
        </div>
        </div>

        {/* ----- Section: Impact (31-33) – background #e7e7e7 ----- */}
        <section className="cx-section-gray">
          {/* 31. (2x1) Col1 empty | Col2: "Impact" XL Header */}
          <div className="cx-section">          <div className="cx-block">
            <div className="cx-block__col1" />
            <div className="cx-block__col2">
              <h2 className="xl-header">Impact</h2>
            </div>
          </div>
          </div>

          {/* 32. Header section: Icon + "Version 2.0 Results" + sub-header */}
          <div className="cx-section">          <div className="cx-block">
            <div className="cx-block__col1" />
            <div className="cx-block__col2">
              <div className="cx-header-section">
                <div className="cx-header-section__icon">
                  <div className="cx-icon-placeholder" aria-hidden />
                </div>
                <div className="cx-header-section__title">
                  <h2 className="header-1">Version 2.0 Results</h2>
                </div>
                <div className="cx-header-section__sub">
                  <p className="sub-header-1">Slashed training time & event set-up clicks resulted in new operators running shows within the first week.</p>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* 33. (2x1) Has divider. Col1: "Impact Scores" H2 | Col2: paragraph + 3 metric blocks */}
          <div className="cx-section">          <div className="cx-block cx-block--divider">
            <div className="cx-block__col1">
              <h2 className="header-2">Impact Scores</h2>
            </div>
            <div className="cx-block__col2 cx-stack">
              <p className="paragraph-text">
                Fortunately for us, version 2.0 released in around the time of a hiring spurt for new dome operators. This allowed us to compare how training progressed with new hires in version 2.0 opposed to the last training session with version 1.0. The differences in new users going through the learning curve were clear:
              </p>
              <div className="cx-metric-blocks">
                <div className="cx-metric-block">
                  <span className="cx-metric-label">Operators running shows</span>
                  <div className="cx-metric-value-row">
                    <span className="cx-metric-value">First Week</span>
                  </div>
                </div>
                <div className="cx-metric-block">
                  <span className="cx-metric-label">Event Startup Time</span>
                  <div className="cx-metric-value-row">
                    <span className="cx-metric-value">5 Minutes</span>
                    <span className="cx-metric-old">40 min</span>
                  </div>
                </div>
                <div className="cx-metric-block">
                  <span className="cx-metric-label">Operator Training Time</span>
                  <div className="cx-metric-value-row">
                    <span className="cx-metric-value">2 Weeks</span>
                    <span className="cx-metric-old">6 Weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 34. (2x1) Col1 empty | Col2: "Discovery" XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Discovery</h2>
          </div>
        </div>
        </div>

        {/* 35. Header section: Icon + "User Research" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M824-80 716-188q-22 13-46 20.5t-50 7.5q-75 0-127.5-52.5T440-340q0-75 52.5-127.5T620-520q75 0 127.5 52.5T800-340q0 26-7.5 50T772-244l108 108-56 56ZM691-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29Zm149-291h-80v-200h-80v120H280v-120h-80v560h200v80H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h167q11-35 43-57.5t70-22.5q40 0 71.5 22.5T594-840h166q33 0 56.5 23.5T840-760v200ZM508.5-771.5Q520-783 520-800t-11.5-28.5Q497-840 480-840t-28.5 11.5Q440-817 440-800t11.5 28.5Q463-760 480-760t28.5-11.5Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">User Research</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Getting granular with user understanding to prepare for an external launch.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 36. (2x1) Has divider. Col1: "Auditing Use Cases" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Auditing Use Cases</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              At this time CX Pro was running in a smooth state for internal use. Now, we needed to prepare for an external B2B launch, where use-cases were undefined. The most glaring uncertainty we had about usability is that all of our users were paid team members, meaning all of our users were power-users with advanced use-cases (running enterprise-level shows). In short, we needed to anticipate usability pitfalls for future clients with unknown workflows and unknown user types. While product was investigating more about prospective clients, I worked with what I had by getting creating journey maps of current workflows that existed to gain a holisitic view of current painpoints.
            </p>
          </div>
        </div>
        </div>

        {/* 37. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${CX_IMAGES}/37.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/37.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/37.png`], 0)} />
        </div>
        </div>

        {/* 38. (2x1) Has divider. Col1: "Understanding New Users" H2 | Col2: paragraph + 2 images horizontal */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Understanding New Users</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              From product investigations, we learned that our prosepctive clients were likely to be: Many will be from academic instutions. Mostly casual users. A sprinkle of advanced users. I hypothesized the best way to learn about casual users was to focus on the new user experience. So, I conducted user interviews with the newest members of our operator teams. <strong>What I found:</strong> Workflow usability was high, but the learning curve of CX Pro concepts was low.
            </p>
            <div className="cx-two-images cx-two-images--stacked">
              <img src={`${CX_IMAGES}/38.1.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/38.1.png`, `${CX_IMAGES}/38.2.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/38.1.png`, `${CX_IMAGES}/38.2.png`], 0)} />
              <img src={`${CX_IMAGES}/38.2.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/38.1.png`, `${CX_IMAGES}/38.2.png`], 1)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/38.1.png`, `${CX_IMAGES}/38.2.png`], 1)} />
            </div>
          </div>
        </div>
        </div>

        {/* 39. Header section: Icon + "Designing for B2B2C" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m270-120-10-88 114-314q15 14 32.5 23.5T444-484L334-182l-64 62Zm420 0-64-62-110-302q20-5 37.5-14.5T586-522l114 314-10 88ZM395-555q-35-35-35-85 0-39 22.5-69.5T440-752v-88h80v88q35 12 57.5 42.5T600-640q0 50-35 85t-85 35q-50 0-85-35Zm113.5-56.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Designing for B2B2C</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Created a North Star for CX Pro and scaled back to deliver on early 2026 goal.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 40. (2x1) Has divider. Col1: "Finding our North Star" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Finding our North Star</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              To set us up for success with a casual user base, we had to address the problem: <strong>Problem Statement:</strong> How can we conceptually simplify CX Pro workflows so that newer users can successfully run shows without much learning? <strong>Process: Blue-Sky Exploration → User Validation</strong> - Explored more familiar interfaces - Explored different ways to visualize CX Pro concepts (scenes, publishing, layers) - Break up workflows of building a show vs Running a Show - Do one thing at a time
            </p>
            <div className="cx-full-width">
              <img src={`${CX_IMAGES}/40.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/40.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/40.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 41. (2x1) Has divider. Col1: "Scaling it back" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Scaling it back</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              The mock above, albeit not the prettiest, garned a huge postive reaction from our user base. "If you can only build one thing now, I would want this" — S.S., Lead Operator. While this raised eyebrows in the Product Team, we ultimately decided to walk before we run and integrate elements of a more visual tool into the current controller, with the plan to iterate towards a more split view of the controller.
            </p>
            <div className="cx-full-width">
              <img src={`${CX_IMAGES}/41.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/41.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/41.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 42. Header section: Icon + "Version 3.0" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M360-720h80v-80h-80v80Zm160 0v-80h80v80h-80ZM360-400v-80h80v80h-80Zm320-160v-80h80v80h-80Zm0 160v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm160-320v-80h80v80h-80Zm-240 80v-80h80v80h-80ZM200-160v-640h80v80h80v80h-80v80h80v80h-80v320h-80Zm400-320v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm160 0v-80h80v80h-80Zm80-80v-80h80v80h-80Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Version 3.0</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">B2B2C Launch Candidate</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 43. (2x1) Has divider. Col1: "Conceptually Simplifying" H2 | Col2: numbered list */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Conceptually Simplifying</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">I conceptually simplified CX Pro by:</p>
            <ol className="project-list project-list-numbered">
              <li>Incoroprating scene and layer visualizations</li>
              <li>Creating an opt-in approach to global controls (parent/child scenes) by re-working how scenes are structured so users are not forced into advanced functionality</li>
              <li>Re-working how our layers were visualized in a familiar top-down layering menu</li>
              <li>Worked with unreal engineers & front end-engineers to classify properties and automate a filtering system so that only the simplest properties are shown</li>
              <li>Utilized interaction design to teach users about nuanced layer differences</li>
            </ol>
          </div>
        </div>
        </div>

        {/* 44. Full width image */}
        <div className="cx-section">          <div className="cx-full-width">
            <img src={`${CX_IMAGES}/44.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${CX_IMAGES}/44.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${CX_IMAGES}/44.png`], 0)} />
          </div>
        </div>

        {/* ----- Section: Projected Impact / Revenue (45-47) – background #e7e7e7 ----- */}
        <section className="cx-section-gray">
          {/* 45. (2x1) Col1 empty | Col2: "Projected Impact" XL Header */}
          <div className="cx-section">          <div className="cx-block">
            <div className="cx-block__col1" />
            <div className="cx-block__col2">
              <h2 className="xl-header">Projected Impact</h2>
            </div>
          </div>
          </div>

          {/* 46. (2x1) Has divider. Col1: "Revenue Outlook" H2 | Col2: paragraph + 2-line revenue block */}
          <div className="cx-section">          <div className="cx-block cx-block--divider">
            <div className="cx-block__col1">
              <h2 className="header-2">Revenue Outlook</h2>
            </div>
            <div className="cx-block__col2 cx-stack">
              <p className="paragraph-text">
                Given CX Pro's strong usability performance in Cosm venues, leadership chose to replace Digistar—a 40-year legacy tool—with CX Pro as the primary operating software for external clients. Because CX Pro was built from a user-centric foundation, the Sales team can now position it as a key differentiator: a modern live-production platform capable of supporting any show or broadcast schedule, from simple to highly complex.
              </p>
              <div className="cx-revenue-block">
                <span className="cx-line1">Over the next 5 years</span>
                <span className="cx-line2">$X-XX Million in Revenue</span>
              </div>
            </div>
          </div>
          </div>

          {/* 47. Carousel */}
          <div className="cx-section">            <div className="cx-carousel-bleed cx-carousel-bleed--large-cards">
              <CxCarousel
                items={[
                  { id: '47.1', imageUrl: `${CX_IMAGES}/47.1.png` },
                  { id: '47.2', imageUrl: `${CX_IMAGES}/47.2.png` },
                  { id: '47.3', imageUrl: `${CX_IMAGES}/47.3.png` },
                  { id: '47.4', imageUrl: `${CX_IMAGES}/47.4.png` },
                  { id: '47.5', imageUrl: `${CX_IMAGES}/47.5.png` },
                  { id: '47.6', imageUrl: `${CX_IMAGES}/47.6.png` },
                  { id: '47.7', imageUrl: `${CX_IMAGES}/47.7.png` },
                  { id: '47.8', imageUrl: `${CX_IMAGES}/47.8.png` },
                  { id: '47.9', imageUrl: `${CX_IMAGES}/47.9.png` },
                  { id: '47.10', imageUrl: `${CX_IMAGES}/47.10.png` },
                  { id: '47.11', imageUrl: `${CX_IMAGES}/47.11.png` },
                  { id: '47.12', imageUrl: `${CX_IMAGES}/47.12.png` },
                  { id: '47.13', imageUrl: `${CX_IMAGES}/47.13.png` },
                  { id: '47.14', imageUrl: `${CX_IMAGES}/47.14.png` },
                  { id: '47.15', imageUrl: `${CX_IMAGES}/47.15.png` },
                  { id: '47.16', imageUrl: `${CX_IMAGES}/47.16.png` },
                ]}
                onOpenLightbox={openLightbox}
                cardWidth={CX_CAROUSEL_SECTION6_CARD_WIDTH}
                cardGap={CX_CAROUSEL_SECTION6_GAP}
              />
            </div>
          </div>

        </section>

        <footer className="project-footer site-footer-offwhite" id="contact">
          <div className="footer-info">
            <div>TJ Gomez-Vidal ©</div>
            <div><a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a></div>
            <div><a href="tel:+15593600445">(559) 360-0445</a></div>
          </div>
          <p className="footer-quote">"Great design is invisible—it anticipates needs before users articulate them."</p>
        </footer>
      </main>
    </div>
  )
}
