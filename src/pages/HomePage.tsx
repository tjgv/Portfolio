import { useEffect, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PROMPTS, TYPE_FILTERS } from '../data/prompts'

const CARD_FINAL_WIDTH = 900
const CARD_FINAL_HEIGHT = 506
const workProjects = ['Project 1', 'Project 2', 'Project 3']
const PROJECT_1_IMAGE = '/project1-cx.png'
const PROJECT_2_IMAGE = '/project2-events.png'
const PROJECT_3_IMAGE = '/project3.png'

const WORK_PROJECTS_DATA: Record<string, { headline: string; subheadline: string; ctaText: string; ctaHref: string; logoUrl?: string; chips?: string[] }> = {
  'Project 1': { headline: 'CX Pro', subheadline: 'Scaling 0 → 1 Enterprise Platform to Commercial Launch', ctaText: 'View Case Study', ctaHref: '/project1', chips: ['0 -> 1 Design Leadership', 'Stakeholder Alignment', 'User Research', 'Design System'], logoUrl: '/project1-logo.png' },
  'Project 2': { headline: 'Validus', subheadline: 'Reviving a Legacy Product with +72% Satisfaction', ctaText: 'View Case Study', ctaHref: '/project2', chips: ['Usability testing', 'User Interviews', 'Empathy Mapping', 'Rapid Iteration', 'UX Design'], logoUrl: '/project2-logo.png' },
  'Project 3': { headline: 'Validus', subheadline: 'Finding opportunity to scale a niche feature into a cornerstone feature', ctaText: 'Coming Soon', ctaHref: '#', chips: ['Stakeholder Alignment', 'Product Strategy', 'UX Design', 'Domain Research'], logoUrl: '/project2-logo.png' },
}
const STICKY_WRAPPER_VH = 200
const HERO_CONTAINER_FADE_VH = 10
const SCRIM_FADE_VH = 60
const SCRIM_OPACITY_START = 0.1

export default function HomePage() {
  const location = useLocation()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [heroContainerOpacity, setHeroContainerOpacity] = useState(1)
  const [scrimOpacity, setScrimOpacity] = useState(SCRIM_OPACITY_START)
  const [condenseProgress, setCondenseProgress] = useState(0)
  const [workIndex, setWorkIndex] = useState(0)
  const [slideOffset, setSlideOffset] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('All')
  const heroRef = useRef<HTMLDivElement>(null)
  const stickyWrapperRef = useRef<HTMLDivElement>(null)
  const workWrapperRef = useRef<HTMLDivElement>(null)
  const cardsGridRef = useRef<HTMLDivElement>(null)
  const prevRectTopRef = useRef<number>(0)
  const [cardsVisible, setCardsVisible] = useState(false)

  const SLIDE_PX = CARD_FINAL_WIDTH + 20
  const SLIDE_DURATION_MS = 500
  const SLIDE_EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)'

  const goPrevProject = () => {
    if (isSliding) return
    setIsSliding(true)
    setSlideOffset(SLIDE_PX)
    setTimeout(() => {
      setWorkIndex((i) => (i - 1 + workProjects.length) % workProjects.length)
      setSlideOffset(0)
      setIsSliding(false)
    }, SLIDE_DURATION_MS)
  }

  const goNextProject = () => {
    if (isSliding) return
    setIsSliding(true)
    setSlideOffset(-SLIDE_PX)
    setTimeout(() => {
      setWorkIndex((i) => (i + 1) % workProjects.length)
      setSlideOffset(0)
      setIsSliding(false)
    }, SLIDE_DURATION_MS)
  }

  const getActiveCardStyle = (p: number) => {
    const w = p >= 1 ? `${CARD_FINAL_WIDTH}px` : p <= 0 ? '100vw' : `calc(${(1 - p) * 100}vw + ${p * CARD_FINAL_WIDTH}px)`
    const h = p >= 1 ? `${CARD_FINAL_HEIGHT}px` : p <= 0 ? '100vh' : `calc(${(1 - p) * 100}vh + ${p * CARD_FINAL_HEIGHT}px)`
    return { width: w, height: h }
  }

  const getSideCardStyle = (p: number) => {
    if (p >= 1) return { width: `${CARD_FINAL_WIDTH}px`, height: `${CARD_FINAL_HEIGHT}px` }
    return { width: '75vw', height: '60vh' }
  }

  const getCardBackgroundStyle = (projectLabel: string) => {
    if (projectLabel === 'Project 1') return { backgroundImage: `url(${PROJECT_1_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    if (projectLabel === 'Project 2') return { backgroundImage: `url(${PROJECT_2_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    if (projectLabel === 'Project 3') return { backgroundImage: `url(${PROJECT_3_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    return {}
  }

  const getRevealStyle = (start: number, duration: number) => {
    const progress = Math.min(Math.max((scrollProgress - start) / duration, 0), 1)
    return { opacity: progress, transform: `translateY(${40 * (1 - progress)}px)` }
  }

  const heroRevealStarts = [0.08, 0.2, 0.32, 0.44, 0.56]
  const heroRevealDuration = 0.12

  const filteredCards = PROMPTS.filter((card) => {
    const matchesType = selectedFilter === 'All' || card.type === selectedFilter
    const q = searchQuery.trim().toLowerCase()
    const matchesSearch = !q ||
      card.title.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q) ||
      card.type.toLowerCase().includes(q) ||
      card.tags.some((t) => t.toLowerCase().includes(q))
    return matchesType && matchesSearch
  })

  const scrollTargetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (location.hash === '#prompts') {
      const scroll = () => {
        const el = scrollTargetRef.current || document.getElementById('prompts')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      const t1 = setTimeout(scroll, 100)
      const t2 = setTimeout(scroll, 400)
      const t3 = setTimeout(scroll, 800)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }
  }, [location.hash])

  useEffect(() => {
    let rafId: number
    const update = () => {
      const scrolled = window.scrollY
      const vh = window.innerHeight

      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight
        const progress = heroHeight > 0 ? Math.min(scrolled / heroHeight, 1) : 0
        setScrollProgress(progress)
        const fadeRangePx = vh * (HERO_CONTAINER_FADE_VH / 100)
        const heroOpacity = fadeRangePx > 0 ? Math.max(0, 1 - scrolled / fadeRangePx) : scrolled > 0 ? 0 : 1
        setHeroContainerOpacity(heroOpacity)
      }

      const scrimFadeRangePx = (vh * SCRIM_FADE_VH) / 100
      const scrimProgress = scrimFadeRangePx > 0 ? Math.min(scrolled / scrimFadeRangePx, 1) : 0
      setScrimOpacity(SCRIM_OPACITY_START + (1 - SCRIM_OPACITY_START) * scrimProgress)

      if (workWrapperRef.current) {
        const rect = workWrapperRef.current.getBoundingClientRect()
        const prevTop = prevRectTopRef.current
        prevRectTopRef.current = rect.top
        const scrollingUp = rect.top > prevTop
        const condenseRangePx = vh * 0.5
        const expandRangePx = vh * 0.2
        const triggerTop = vh * 0.5
        let progress: number
        if (rect.top > triggerTop) progress = 0
        else if (rect.top <= 0) progress = 1
        else if (scrollingUp) progress = Math.max(0, 1 - rect.top / expandRangePx)
        else progress = (triggerTop - rect.top) / condenseRangePx
        setCondenseProgress(Math.min(1, Math.max(0, progress)))
      }

      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const el = cardsGridRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCardsVisible(true) },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="app">
      <nav className="navbar-glass" aria-label="Main navigation">
        <div className="navbar-content">
          <Link to="/" className="nav-brand">TJ Gomez-Vidal</Link>
          <div className="nav-links">
            <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="nav-link">LinkedIn</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-link">Resume</a>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </nav>

      <section className="section-hero" ref={heroRef}>
        <div className="section-content">
          <div className="hero-lockup" style={{ opacity: heroContainerOpacity }} aria-hidden={heroContainerOpacity < 0.01}>
            <div className="hero-headline-container">
              <h1 className="visuallyhidden">TJ Gomez-Vidal - Product Designer</h1>
              <h2 className="hero-headline">TJ Gomez-Vidal<br /><span className="hero-headline-sub">Product Designer</span></h2>
            </div>
            <div className="cta-wrapper-container">
              <div className="cta-wrapper">
                <a href="#contact" className="hero-cta">Get in touch</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky-wrapper" ref={stickyWrapperRef} style={{ height: `${STICKY_WRAPPER_VH}vh` }}>
          <div className="sticky-inner">
            <video className="sticky-video" autoPlay loop muted playsInline>
              <source src="/Bg-No-Audio.mp4" type="video/mp4" />
            </video>
            <div className="sticky-scrim" style={{ opacity: scrimOpacity }} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="section-value-props">
        <div className="section-content">
          <ul className="value-props-list">
            {heroRevealStarts.map((start, i) => (
              <li key={i} className="hero-line" style={getRevealStyle(start, heroRevealDuration)}>
                {['5+ Years of Experience', 'FinTech, Immersive Entertainment, Sports Entertainment', 'Founding designer of CX Pro - (Immersive Venue Controller)', 'B2B + B2B2C Specialization', 'Visual Design Background'][i]}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div id="work" className="work-section-wrapper" ref={workWrapperRef}>
        <section className="work-section work-section-sticky" aria-label="Work">
          <h2
            className="work-section-title"
            style={{
              opacity: condenseProgress >= 0.88 ? Math.min(1, (condenseProgress - 0.88) / 0.12) : 0,
              transform: condenseProgress >= 0.88
                ? `translate(-50%, ${-24 * (1 - Math.min(1, (condenseProgress - 0.88) / 0.12))}px)`
                : 'translate(-50%, -24px)',
              transition: 'opacity 0.35s ease-out, transform 0.4s ease-out',
            }}
          >
            My Work
          </h2>
          {condenseProgress >= 0.8 && (
            <>
              <button type="button" className="work-arrow work-arrow-left" onClick={goPrevProject} aria-label="Previous project">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <button type="button" className="work-arrow work-arrow-right" onClick={goNextProject} aria-label="Next project">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </>
          )}
          <div className="work-carousel" style={{ transform: `translate3d(${slideOffset}px, 0, 0)`, transition: slideOffset === 0 ? 'none' : `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}` }} data-sliding={isSliding || undefined}>
            {[-1, 0, 1].map((offset) => {
              const idx = (workIndex + offset + workProjects.length) % workProjects.length
              const label = workProjects[idx]
              const isPrev = offset === -1
              const isNext = offset === 1
              return (
                <div
                  key={offset}
                  className={`work-card ${offset === 0 ? 'work-card-active' : 'work-card-side'} ${isPrev ? 'work-card-prev' : ''} ${isNext ? 'work-card-next' : ''} ${label === 'Project 1' || label === 'Project 2' || label === 'Project 3' ? 'work-card-has-bg' : ''}${label === 'Project 3' ? ' work-card-coming-soon' : ''}`}
                  style={{
                    ...(offset === 0 ? getActiveCardStyle(condenseProgress) : getSideCardStyle(condenseProgress)),
                    ...getCardBackgroundStyle(label),
                    ...(offset !== 0 && { opacity: condenseProgress * 0.8, ['--condense' as string]: condenseProgress }),
                  }}
                  aria-hidden={offset !== 0 && condenseProgress < 0.99}
                  onClick={() => !isSliding && (offset === -1 ? goPrevProject() : offset === 1 ? goNextProject() : null)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSliding && (offset === -1 ? goPrevProject() : offset === 1 ? goNextProject() : null)}
                  role="button"
                  tabIndex={offset !== 0 && condenseProgress >= 0.99 ? 0 : -1}
                >
                  <div className="work-card-inner">{condenseProgress < 1 && (label === 'Project 1' || label === 'Project 2' || label === 'Project 3' ? '' : label)}</div>
                  {condenseProgress > 0 && (() => {
                    const data = WORK_PROJECTS_DATA[label]
                    if (!data) return null
                    return (
                      <div className={`work-card-overlay ${condenseProgress < 0.5 ? 'work-card-overlay-faded' : ''}`} style={{ opacity: condenseProgress, transition: 'opacity 0.35s ease-out' }}>
                        <div className="work-card-overlay-subtitle">
                          <div className="work-card-overlay-header">
                            {data.logoUrl ? <img src={data.logoUrl} alt="" className="work-card-logo" /> : <div className="work-card-logo" aria-hidden />}
                            <h2 className="typography-heading-headline">{data.headline}</h2>
                          </div>
                        </div>
                        <div className="work-card-overlay-bottom">
                          <div className="work-card-overlay-bottom-left">
                            {data.chips && data.chips.length > 0 && (
                              <div className="work-card-chips">
                                {data.chips.map((chip) => (
                                  <span key={chip} className="work-card-chip">{chip}</span>
                                ))}
                              </div>
                            )}
                            <h3 className="typography-heading-subheadline">{data.subheadline}</h3>
                          </div>
                          {data.ctaText === 'Coming Soon' ? (
                            <span className="button button-coming-soon work-card-cta" aria-hidden>{data.ctaText}</span>
                          ) : data.ctaHref.startsWith('http') ? (
                            <a href={data.ctaHref} className="button button-neutral work-card-cta" aria-label={`${data.ctaText}, ${label}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                              <span aria-hidden="true">{data.ctaText}</span>
                            </a>
                          ) : (
                            <Link to={data.ctaHref} className="button button-neutral work-card-cta" aria-label={`${data.ctaText}, ${label}`} onClick={(e) => e.stopPropagation()}>
                              <span aria-hidden="true">{data.ctaText}</span>
                            </Link>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )
            })}
          </div>
        </section>
        <div className="work-section-spacer" aria-hidden="true" />
      </div>

      <section id="prompts" className={`content-section ${cardsVisible ? 'prompts-grid-visible' : ''}`} ref={scrollTargetRef}>
        <div className="prompts-grid-bg" aria-hidden />
        <h2 className="prompts-section-title">A.I. Prompts I Am Using</h2>
        <p className="prompts-section-subtitle">
          A.I. is changing how designers work. Below are prompts that I have found helpful for speeding up nearly every stage of my design process.
        </p>
        <div className="search-filter-wrap">
          <div className="search-input-wrap">
            <input type="text" placeholder="Search prompts..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} aria-label="Search cards" />
          </div>
          <div className="filter-chips-row">
            <div className="filter-chips">
              {TYPE_FILTERS.map((filter) => (
                <button key={filter} type="button" className={`filter-chip ${selectedFilter === filter ? 'filter-chip-active' : ''}`} onClick={() => setSelectedFilter(filter)}>
                  {filter}
                </button>
              ))}
            </div>
            <div className="prompts-results-count">
              {filteredCards.length} {filteredCards.length === 1 ? 'prompt' : 'prompts'}
            </div>
          </div>
        </div>
        <div ref={cardsGridRef} className={`cards-grid ${cardsVisible ? 'cards-visible' : ''}`}>
          {filteredCards.length === 0 ? (
            <p className="cards-empty">No cards match your search.</p>
          ) : filteredCards.map((card, index) => (
            <a key={card.id} href={`/prompts/${card.slug}`} className={`card-link ${card.pillClass}`} aria-label={`${card.title} - Read more`} style={{ transitionDelay: cardsVisible ? `${index * 50}ms` : '0ms' }}>
              <div className="card-inner">
                <div className="card-header">
                  <span className="card-pill">{card.type}</span>
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.description}</p>
                <div className="card-tags">
                  {card.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-info">
          <div>TJ Gomez-Vidal ©</div>
          <div>tjgomezvidal@gmail.com</div>
          <div>(559) 360-0445</div>
        </div>
        <p className="footer-quote">"Great design is invisible—it anticipates needs before users articulate them."</p>
      </footer>
    </div>
  )
}
