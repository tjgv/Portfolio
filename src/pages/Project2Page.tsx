import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import './CxProPage.css'

const VALIDUS_IMAGES = '/validus-images'

/* Full-screen image lightbox – Validus project */
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

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  const root = document.scrollingElement
  if (root && root !== document.body) (root as HTMLElement).scrollTop = 0
}

const SMOOTH_SCROLL_DURATION_MS = 1100
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}
function smoothScrollToTop() {
  const start = performance.now()
  const startY = window.scrollY ?? document.documentElement.scrollTop ?? 0
  const scroll = () => {
    const elapsed = performance.now() - start
    const t = Math.min(elapsed / SMOOTH_SCROLL_DURATION_MS, 1)
    const eased = easeInOutCubic(t)
    const y = startY * (1 - eased)
    window.scrollTo(0, y)
    document.documentElement.scrollTop = y
    document.body.scrollTop = y
    const root = document.scrollingElement
    if (root && root !== document.body) (root as HTMLElement).scrollTop = y
    if (t < 1) requestAnimationFrame(scroll)
  }
  requestAnimationFrame(scroll)
}

export default function Project2Page() {
  const [lightbox, setLightbox] = useState<{ items: string[]; index: number } | null>(null)
  const openLightbox = useCallback((items: string[], index: number) => setLightbox({ items, index }), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const pageTopRef = useRef<HTMLDivElement>(null)
  const s28WrapRef = useRef<HTMLDivElement>(null)
  const [s28InView, setS28InView] = useState(false)
  const s2Ref = useRef<HTMLDivElement>(null)
  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    const update = () => {
      const s2 = s2Ref.current
      const scrollY = window.scrollY ?? document.documentElement.scrollTop ?? 0
      if (s2) {
        const r2 = s2.getBoundingClientRect()
        setShowScrollToTop(r2.bottom <= 100)
      } else {
        setShowScrollToTop(scrollY > 500)
      }
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    document.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const t = setTimeout(update, 200)
    const t2 = setTimeout(update, 600)
    return () => {
      window.removeEventListener('scroll', update)
      document.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    const el = s28WrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setS28InView(true)
      },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Fallback: trigger S28 phone animation if observer hasn't (e.g. section already in view on load) */
  useEffect(() => {
    const t = setTimeout(() => setS28InView((v) => v || true), 800)
    return () => clearTimeout(t)
  }, [])

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
    <div ref={pageTopRef} className="app project-page cx-pro-page validus-page">
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
            <img src="/validus-logo.svg" alt="Validus" className="cx-hero-logo" />
            <p className="cx-hero-text">
              How might we help officers trust that they're seeing every crucial signal, and not drowning in market data?
            </p>
            <div className="cx-hero-chips">
              {['Usability testing', 'User Interviews', 'Empathy Mapping', 'Rapid Iteration', 'UX Design'].map((chip) => (
                <span key={chip} className="cx-hero-chip">{chip}</span>
              ))}
            </div>
            <div className="cx-hero-arrow" aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
          </div>
          <div className="validus-hero-bridge" aria-hidden>
            <img src="/validus-images/hero-bridge.png" alt="" />
          </div>
        </section>

        {/* 2. (2x1) Col1 empty, Col2: "Context" XL Header */}
        <div ref={s2Ref} data-section="s2" className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Context</h2>
          </div>
        </div>
        </div>

        {/* 3. (2x1) Col1: "Context" Header 2 | Col2: paragraph + placeholder image */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1">
            <h2 className="header-2">Context</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Eventus is a software company which offers products that monitor global market data to identify patterns of illegal activity. Eventus tailors their products to Compliance Officers—people who are hired by organizations to ensure they are compliant with trading regulations. Eventus' main platform is Validus. Validus helps compliance officers by using algorithms which detect suspicious behavior, and contextualizes that data for compliance officer review.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/3.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/3.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/3.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 4. (2x1) Col1: "Problem Solved" | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1">
            <h2 className="header-2">Problem Solved</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              The previous dashboard forced users to hunt for important information and offered no sense of priority or progress. We redesigned it to do the opposite: lead users to the right alerts quickly, present data in a way that matches their intuition, and make high-volume work feel approachable through clear visual progress indicators.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/4.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/4.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/4.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 5. (2x1) Has top divider. Col1: "My Role" H2 | Col2: role/team/timeline blocks + paragraph */}
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
                <p className="cx-s5-para">Contributed to Validus product team through end-to-end UX Design processes, usability testing, and stakeholder alignment.</p>
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
              <div className="cx-s5-stack">
                <div className="cx-s5-heading-wrap">
                  <div className="cx-s5-row">
                    <svg className="cx-s5-icon cx-s5-icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM707-253q93-93 93-227t-93-227q-93-93-227-93t-227 93q-93 93-93 227t93 227q93 93 227 93t227-93Zm-397-57q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47Zm-169.5-56.5Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5Z"/></svg>
                    <span className="cx-s5-label">Outcomes</span>
                  </div>
                  <div className="cx-s5-divider" aria-hidden />
                </div>
              </div>
            </div>
            <div className="cx-stat-cards cx-stat-cards--section9-headers">
              <div className="cx-stat-card">
                <span className="header-2" style={{ marginBottom: 0 }}>75-90%</span>
                <span style={{ fontWeight: 600 }}>Fewer nav clicks</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">Estimated based on observed workflows of participating user studies.</p>
              </div>
              <div className="cx-stat-card">
                <span className="header-2" style={{ marginBottom: 0 }}>82.5%</span>
                <span style={{ fontWeight: 600 }}>Elevated user satisfaction</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">Measured by exit interviews comparing proposed designs to current platform.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* XL header section: "Discovery" */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Discovery</h2>
          </div>
        </div>
        </div>

        {/* 5. Header section: Icon + "Research and Synthesis" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="M495-155q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Zm113.5-56.5Q620-223 620-240t-11.5-28.5Q597-280 580-280t-28.5 11.5Q540-257 540-240t11.5 28.5Q563-200 580-200t28.5-11.5ZM504-464q-64-64-64-156t64-156q64-64 156-64t156 64q64 64 64 156t-64 156q-64 64-156 64t-156-64Zm255.5-56.5Q800-561 800-620t-40.5-99.5Q719-760 660-760t-99.5 40.5Q520-679 520-620t40.5 99.5Q601-480 660-480t99.5-40.5ZM280-240q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm56.5-103.5Q360-367 360-400t-23.5-56.5Q313-480 280-480t-56.5 23.5Q200-433 200-400t23.5 56.5Q247-320 280-320t56.5-23.5ZM580-240Zm80-380ZM280-400Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Research and Synthesis</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Pendo Usage Data, Jobs-to-be-done research synthesis, user emotion mapping</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 7. (2x1) Has divider. Col1: "Analyzing current dashboard usage data" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Analyzing current dashboard usage data</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Pendo feature usage showed us that users spent the vast majority of their time operating in the bottom-left and upper-right quadrants in the original dashboard. This is where our users go to work their alerts. An alert is created when the system detects potential manipulation. The bottom-left quadrant groups alerts by manipulation type (“procedures”), and the upper-right quadrant shows the individual alerts within the selected procedure.
            </p>
          </div>
        </div>
        </div>

        {/* 8. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${VALIDUS_IMAGES}/8.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/8.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/8.png`], 0)} />
        </div>
        </div>

        {/* 9. (2x1) Has divider. Col1: "Comparing usage data to platform CTR's" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Comparing usage data to platform CTR's</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              I mapped the typical Compliance Officer workflow against click-rate data to identify wasted space in the interface. Surprisingly, the Market Overview page—the first page users see—was almost always skipped, making the Alert Overview page the de facto dashboard. This CTR map now guides how I structure the navigation for the solution.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/9-ctr.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/9-ctr.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/9-ctr.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 10. (2x1) Has divider. Col1: "Emotional-Social Mapping " H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Emotional-Social Mapping </h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              With usage data enlightening us on what pages to prioritize, I looked at our qualitative research to guide how we should design those pages. I leveraged our Jobs-to-be-done user interviews to get an understanding of what Compliance Officers feel during each step of their total job. Our research found that any compliance officers job - agnostic of any particular tool - can be categorized in 5 distinct phases: Design (Designing the algorithms to catch what they're looking for), Investigate (Filtering through false positives), Evaluate (Proving if positive hits are malicious), Respond (Raising to organizations & financial regulatory institutions), Educate (Advising members of organization how to avoid such activity). Validus is directly involved in the first 3 steps in the Compliance Officer's job. So, I looked at how they felt during these stages and found that the core issues they felt are: 1. Fear of missing crucial information 2. Dread of high-volume workflows
            </p>
          </div>
        </div>
        </div>

        {/* 11. Full viewport image (100vh, bypasses margins) */}
        <div className="cx-section">        <div className="cx-fullscreen-image">
          <img src={`${VALIDUS_IMAGES}/social-mapping.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/social-mapping.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/social-mapping.png`], 0)} />
        </div>
        </div>

        {/* 12. (2x1) Col1 empty | Col2: "Design" XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Design</h2>
          </div>
        </div>
        </div>

        {/* 13. Header section: Icon + "Post Launch Design Initatives" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Empathy driven design</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Addressing the emotions CO's face during the steps in their job that Validus touches.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 14. (2x1) Has divider. Col1: "Prioritizing Fast Follow Items" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Prioritizing Fast Follow Items</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              After launch, our focus shifted to stabilizing the product and improving day-to-day workflows. The most important changes in the dynamic is: 1. We now have users to learn from 2. Design is now ahead of engineering, but not by much. Immediate goals post launch: 1. Fill engineering backlog to create a steady lead on engineering 2. Rectify usability pitfalls from the assumption-based phase of design. As Validus had been built at warp speed, Operators (our users) were dealing with bugs, system errors, and an unfamiliar workflow all at once. To address this, I created a shared system-request document to collect user insights and guide design initatives.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/18.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/18.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/18.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 15. (2x1) Has divider. Col1: "Addressing the fear of the unknown" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Addressing the fear of the unknown</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              The reality is that Validus cannot ever do the job that a Compliance Officer does, but we can do more to help point users in the right direction through:
            </p>
            <p className="paragraph-text">
              1. (New) For You Section: Champions team-flagged alerts in dashboard.<br />
              2. (New) High Alert Accounts: Shows accounts with abnormal activity which provides a new perspective of reviewing alerts.<br />
              3. (New) Progress bar: Helps gamify the alert review workflow & provides a point of reference for High Alert Accounts<br />
              4. (Updated) Procedures: section expanded as this is always the first step users take when starting their workflow.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/15-features.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/15-features.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/15-features.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 16. (2x1) Has divider. Col1: "Addressing high volume workloads" H2 | Col2: paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Addressing high volume workloads</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              In the original dashboard, the alert-overview dashboard took up less than 25% of the allocated real estate of the page but absorbed 90% of user clicks. So, we gave that quadrant its own page and powered it up with a new feature: Bulk Actions.
            </p>
            <p className="paragraph-text">
              Often, a string of alerts are related to each other, which creates tedious and duplicative workflows. Bulk Actions enables users to work on a multiple alerts simultaneously.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/16-bulk-actions.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/16-bulk-actions.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/16-bulk-actions.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 17. (2x1) Has divider. Col1: "Streamlining Workflows" H2 | Col2: paragraph + gif */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Streamlining Workflows</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Originally, when users found an alert, they had to copy its ID and hunt it down again in other tools. This forced them into multiple tabs, extra searches, and unnecessary workflow friction. To fix this, we introduced the Alert Bar—a streamlined way for users to "carry" an alert with them throughout the controller as they evaluate it. This eliminates redundant steps and saves an immeasurable number of clicks.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/17-alert-bar.gif`} alt="" />
            </div>
          </div>
        </div>
        </div>

        {/* 18. (2x1) Col1 empty | Col2: "Evaluative Research" XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Evaluative Research</h2>
          </div>
        </div>
        </div>

        {/* 19. Header section: Icon + "Validating Designs" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <svg className="cx-header-section__icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" fill="#000" aria-hidden><path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z"/></svg>
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Validating Designs</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Conducting user interviews to validate designs, rapidly iterate, and priortize features.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 20. (2x1) Has divider. Col1: "Research Strategy" H2 | Col2: paragraph + 4 icon lines */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Research Strategy</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Method: Eight 60-minute usability sessions with a moderator. Small design updates throughout using the RITE method of testing and 1 informal information gathering session.
            </p>
            <ul className="cx-icon-lines" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="cx-icon-line">
                <span className="cx-icon-line__icon" aria-hidden><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z"/></svg></span>
                <span className="cx-icon-line__text">Validate we solved the right problem</span>
              </li>
              <li className="cx-icon-line">
                <span className="cx-icon-line__icon" aria-hidden><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="m320-410 79-110h170L320-716v306ZM551-80 406-392 240-160v-720l560 440H516l144 309-109 51ZM399-520Z"/></svg></span>
                <span className="cx-icon-line__text">Determine usability of new features</span>
              </li>
              <li className="cx-icon-line">
                <span className="cx-icon-line__icon" aria-hidden><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z"/></svg></span>
                <span className="cx-icon-line__text">Prove new tools are an improvement from existing workflow</span>
              </li>
              <li className="cx-icon-line">
                <span className="cx-icon-line__icon" aria-hidden><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M720-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-600 40q-33 0-56.5-23.5T40-200v-560q0-33 23.5-56.5T120-840h560q33 0 56.5 23.5T760-760v200h-80v-80H120v440h520v80H120Zm0-600h560v-40H120v40Zm0 0v-40 40Z"/></svg></span>
                <span className="cx-icon-line__text">Identify any underserved needs that need design attention</span>
              </li>
            </ul>
          </div>
        </div>
        </div>

        {/* 21. Full width image */}
        <div className="cx-section">        <div className="cx-full-width">
          <img src={`${VALIDUS_IMAGES}/37.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/37.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/37.png`], 0)} />
        </div>
        </div>

        {/* 22. (2x1) Has divider. Col1: "Problem Validation:" H2 | Col2: paragraph */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Problem Validation:</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Q: How well did these designs address the original (problem) statement that we talked about in the beginning of the session?
            </p>
            <p className="paragraph-text">
              <strong>Problem Statement:</strong> as a compliance officer conducting my daily review of the previous day's activity finding / honing in on what needs further investigation can be challenging, which makes me uneasy about missing a potential issue.
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/22-problem-validation.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/22-problem-validation.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/22-problem-validation.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 23. (2x1) Has divider. Col1: "Testing Satisfaction" H2 | Col2: Q paragraph + image */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Testing Satisfaction</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Q: If you had to use this dashboard and design flow for the next six months instead of the dashboard you have now, how would you feel?
            </p>
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/6924b480886cc2d4f122e99b_2o.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/6924b480886cc2d4f122e99b_2o.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/6924b480886cc2d4f122e99b_2o.png`], 0)} />
            </div>
          </div>
        </div>
        </div>

        {/* 24. (2x1) Has divider. Col1: "Task Completion Metrics" H2 | Col2: paragraph + 2 stat cards (speed icon on line 1) */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">Task Completion Metrics</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              Accompanied with the user interviews were two usability tests to analyze usability of the new workflow features, Bulk Actions & the Alert Bar System. We found a massive success in mitigating redundancies in the Compliance Officer workflow.
            </p>
            <div className="cx-stat-cards cx-stat-cards--section9-headers">
              <div className="cx-stat-card">
                <div className="cx-stat-card__line1">
                  <span className="header-2" style={{ marginBottom: 0 }}>6.5 / 7</span>
                  <img src={`${VALIDUS_IMAGES}/speed_24dp.svg`} alt="" width={24} height={24} aria-hidden />
                </div>
                <span style={{ fontWeight: 600 }}>In ease of operating bulk actions</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">This tool was met with the most amount of excitement amongst new users.</p>
              </div>
              <div className="cx-stat-card">
                <div className="cx-stat-card__line1">
                  <span className="header-2" style={{ marginBottom: 0 }}>5.37 out of 7</span>
                  <img src={`${VALIDUS_IMAGES}/speed_24dp.svg`} alt="" width={24} height={24} aria-hidden />
                </div>
                <span style={{ fontWeight: 600 }}>In ease & comprehension of Alert Bar</span>
                <div className="cx-stat-card-divider" aria-hidden />
                <p className="paragraph-text">This feature had initial comprehension hurdles but quickly grew on users once figured out.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 25. (2x1) Col1 empty | Col2: XL Header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <h2 className="xl-header">Final Product</h2>
          </div>
        </div>
        </div>

        {/* 26. Header section: Icon + "Validus Dashboard" + sub-header */}
        <div className="cx-section">        <div className="cx-block">
          <div className="cx-block__col1" />
          <div className="cx-block__col2">
            <div className="cx-header-section">
              <div className="cx-header-section__icon">
                <img src={`${VALIDUS_IMAGES}/done_all_24dp.svg`} alt="" className="cx-header-section__icon-svg" width={28} height={28} aria-hidden />
              </div>
              <div className="cx-header-section__title">
                <h2 className="header-1">Validus Dashboard</h2>
              </div>
              <div className="cx-header-section__sub">
                <p className="sub-header-1">Finalized designs born out of empathy with users social & emotional needs.</p>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* 27. (2x1) Has divider. Col1: "User Quote" H2 | Col2: quote + attribution block */}
        <div className="cx-section">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <h2 className="header-2">User Quote</h2>
          </div>
          <div className="cx-block__col2 cx-stack">
            <p className="paragraph-text">
              &ldquo;I will make one comment that this interface right here is 100 times easier to use than the one that&rsquo;s currently in there....&rdquo; &ldquo;... This is the type of thing I would like to see going forward&rdquo;
            </p>
            <div className="cx-quote-attribution">
              <div className="cx-quote-attribution__row1">
                <img src={`${VALIDUS_IMAGES}/account_circle_24dp.svg`} alt="" width={24} height={24} aria-hidden />
                <span style={{ fontWeight: 600 }}>Robert L.</span>
              </div>
              <div className="cx-quote-attribution__role">Chief Compliance Officer, Legal Counsel</div>
            </div>
          </div>
        </div>
        </div>

        {/* 28. Full width image + phone overlay (slides in from right when in view) */}
        <div className="cx-section">        <div ref={s28WrapRef} className="cx-s28-wrap">
          <div className="cx-full-width">
            <img src={`${VALIDUS_IMAGES}/6924b8127adfc98991b18d6b_ccccc.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/6924b8127adfc98991b18d6b_ccccc.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/6924b8127adfc98991b18d6b_ccccc.png`], 0)} />
          </div>
          <div className={`cx-s28-phone ${s28InView ? 'cx-s28-phone--visible' : ''}`}>
            <img src={`${VALIDUS_IMAGES}/6924b82f0283ad193c127b32_mockmock.png`} alt="" className="cx-img-openable" onClick={() => openLightbox([`${VALIDUS_IMAGES}/6924b82f0283ad193c127b32_mockmock.png`], 0)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openLightbox([`${VALIDUS_IMAGES}/6924b82f0283ad193c127b32_mockmock.png`], 0)} />
          </div>
        </div>
        </div>

        {/* 29. (2x1) Col1: gif loop | Col2: gif loop */}
        <div className="cx-section cx-section--s29">        <div className="cx-block cx-block--divider">
          <div className="cx-block__col1">
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/6924c0a3b71c1080835011d7_Beta-UI-Promo-2.gif`} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
          <div className="cx-block__col2 cx-stack">
            <div className="cx-full-width">
              <img src={`${VALIDUS_IMAGES}/6924c0ab9875ece72795d5df_Beta-UI-Promo.gif`} alt="" style={{ width: '100%', display: 'block' }} />
            </div>
          </div>
        </div>
        </div>

        <footer className="project-footer site-footer-offwhite" id="contact">
          <div className="footer-info">
            <div>TJ Gomez-Vidal ©</div>
            <div><a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a></div>
            <div><a href="tel:+15593600445">(559) 360-0445</a></div>
          </div>
          <p className="footer-quote">"Great design is invisible—it anticipates needs before users articulate them."</p>
        </footer>
      </main>

      <button
        type="button"
        className={`cx-scroll-to-top ${showScrollToTop ? 'cx-scroll-to-top--visible' : ''}`}
        onClick={smoothScrollToTop}
        aria-label="Scroll to top"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </button>
    </div>
  )
}
