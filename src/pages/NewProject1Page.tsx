import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaseStudyDevMode from '../components/case-study-dev-mode/CaseStudyDevMode'
import CurrentToolHotspotMap, { type Hotspot } from '../components/new-project-1/CurrentToolHotspotMap'
import CaseStudyNavSection from '../components/new-project-1/CaseStudyNavSection'
import CurrentToolUseCases from '../components/new-project-1/CurrentToolUseCases'
import NewProject1Hero from '../components/new-project-1/NewProject1Hero'
import DeducingUserNeeds from '../components/new-project-1/DeducingUserNeeds'
import Hypothesis from '../components/new-project-1/Hypothesis'
import Problem from '../components/new-project-1/Problem'
import RunOfShowSideShot from '../components/new-project-1/RunOfShowSideShot'
import EditingSideShot from '../components/new-project-1/EditingSideShot'
import EditingCarousel from '../components/new-project-1/EditingCarousel'
import EndHeroSection from '../components/new-project-1/EndHeroSection'
import GuidedTransitions from '../components/new-project-1/GuidedTransitions'
import IpadCompatibility from '../components/new-project-1/IpadCompatibility'
import LeadershipQuoteSection from '../components/new-project-1/LeadershipQuoteSection'
import ResultsSection from '../components/new-project-1/ResultsSection'
import TargetAudience from '../components/new-project-1/TargetAudience'
import './NewProject1Page.css'

export const NEW_PROJECT_1_ROUTE = '/new-project-1'

export const NEW_PROJECT_1_META = {
  title: 'Finding Familiarity in Complexity',
  subtitle: 'Consumer-Grade CX Pro',
  timeline: 'TBD',
  role: 'Product Design',
  org: 'Cosm',
  withPeople: 'TBD',
} as const

const GLANCE_ITEMS = [
  {
    id: 'team',
    title: 'Team & Role',
    body: (
      <>
        I was the <strong>sole designer</strong> for this project. I collaborated frequently with the
        Product Director, and periodically with C-Suite leadership.
      </>
    ),
  },
  {
    id: 'duration',
    title: 'Duration',
    body: 'This project had multiple phases spanning over 6-8months.',
  },
  {
    id: 'challenge',
    title: 'Challenge',
    body:
      'CX Pro was built for internal operators who understood our technology deeply. To support external clients, I needed to understand whether the product itself was ready for a broader audience.',
  },
  {
    id: 'outcome',
    title: 'Outcome',
    body:
      'Aligned leadership around a long-term product vision that separates key workflows, simplified the current experience, and created a foundation for future Run Show and mobile experiences.',
  },
] as const

const CURRENT_TOOL_IMAGE = '/new-project-1/v2.1.png'

const CURRENT_USE_CASES = [
  {
    id: 'sports-shows',
    image: '/new-project-1/use-case-sports.png',
    imageAlt: 'Sports show in the Cosm dome during a Lakers vs Warriors game',
    body: 'Sports Shows are Cosm\u2019s marquee experience. This is our most advanced use case as there are more moving parts to manage: dynamic scoring, custom visual setups, responsive effects to real-time events, syncing live-feeds, live feed swaps, non-linear run of show.',
  },
  {
    id: 'studio-shows',
    image: '/new-project-1/use-case-studio.png',
    imageAlt: 'Studio show with audience viewing immersive dome content',
    body: 'Studio Shows are Cosm\u2019s marquee experience. This is our most advanced use case as there are more moving parts to manage: dynamic scoring, custom visual setups, responsive effects to real-time events, syncing live-feeds, live feed swaps, non-linear run of show.',
  },
] as const

const CURRENT_TOOL_HOTSPOTS: Hotspot[] = [
  {
    id: 'scenes',
    x: 19,
    y: 10,
    title: 'Scenes',
    body: 'These are the individual components of a show. Each scene has a configuration of assets which make up the audience experience.',
  },
  {
    id: 'media-widgets',
    x: 48,
    y: 42,
    title: 'Media Widgets',
    body: 'These are configurations of media containers that are intended to overlay on top of the main content in the display. These come in a pre-configured group/scheme called a "Layout Layer."',
  },
  {
    id: 'asset-libraries',
    x: 4,
    y: 24,
    title: 'Asset Libraries',
    body: 'This is where users find the assets used to build a show. There are layer assets:\nEnvironment Layer — virtual decorations for a screen\nImmersive Layer — main feature of a display, like the movie or game\nLayout Layer — schemes of media widgets to overlay on top of the screen\n\nThen, there are normal asset libraries to populate media widgets.',
  },
  {
    id: 'inspector',
    x: 82,
    y: 22,
    title: 'Inspector',
    body: 'This is the settings panel to edit the unique settings each layer brings.',
  },
  {
    id: 'triggers',
    x: 38,
    y: 93,
    title: 'Triggers',
    body: 'Triggers are effects the operator can press during a live show to make an effect occur instantaneously. Think "fireworks" when a team scores a goal.',
  },
  {
    id: 'transition-controls',
    x: 24,
    y: 3,
    title: 'Transition Controls',
    body: 'These are the specific controls users must utilize in a sequence to correctly transition between scenes that require an Unreal Engine reset.',
  },
]

const CURRENT_TOOL_TABS = [
  { id: 'current-tool', label: 'Current tool' },
  { id: 'current-use-cases', label: 'Experiences' },
] as const

type CurrentToolTabId = (typeof CURRENT_TOOL_TABS)[number]['id']

const UPCOMING_SECTIONS = [
  {
    label: 'Goal',
    title: 'Make CX Pro accessible to a broader audience.',
    body: 'CX Pro is built for internal power users. To support customer adoption, it needs a lower learning curve while preserving its flexibility.',
  },
  { label: 'Audience', title: 'The target audience' },
  { label: 'Key Assumptions', title: 'Deducing User Needs' },
  { label: 'Problem', title: 'CX Pro is too conceptually complex for newer users to grasp.' },
  { label: 'Hypothesis', title: 'Splitting the tool would improve comprehension and scalability.' },
  { label: 'Phase 3', title: 'Pitching iPad Compatibility' },
  { label: 'Business Value', title: 'Results' },
] as const

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

export interface NewProject1PageProps {
  embedded?: boolean
}

export default function NewProject1Page({ embedded = false }: NewProject1PageProps = {}) {
  const pageRef = useRef<HTMLDivElement>(null)
  const goalRevealRef = useRef<HTMLDivElement>(null)
  const goalObserverRef = useRef<IntersectionObserver | null>(null)
  const [goalInView, setGoalInView] = useState(false)
  const [currentToolTab, setCurrentToolTab] = useState<CurrentToolTabId>('current-tool')

  useLayoutEffect(() => {
    if (embedded) return
    scrollToTop()
    const id = requestAnimationFrame(scrollToTop)
    return () => cancelAnimationFrame(id)
  }, [embedded])

  useEffect(() => {
    if (embedded) return

    let rafId = 0

    const update = () => {
      rafId = 0

      const goalEl = goalRevealRef.current
      if (goalEl) {
        const rect = goalEl.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92) {
          setGoalInView((visible) => visible || true)
        }
      }
    }

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [embedded])

  const setGoalRevealRef = useCallback(
    (node: HTMLDivElement | null) => {
      goalRevealRef.current = node
      goalObserverRef.current?.disconnect()
      goalObserverRef.current = null

      if (!node || embedded) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) setGoalInView(true)
        },
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
      )

      observer.observe(node)
      goalObserverRef.current = observer

      const rect = node.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.92) {
        setGoalInView(true)
      }
    },
    [embedded]
  )

  useEffect(() => () => goalObserverRef.current?.disconnect(), [])

  return (
    <div
      ref={pageRef}
      className={`new-project-1-page${embedded ? ' cx-pro-page--embedded' : ''}`}
    >
      {!embedded && (
        <>
          <nav className="new-project-1-nav" aria-label="Main navigation">
            <Link to="/" className="new-project-1-nav__back" aria-label="Back to home">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="new-project-1-nav__links">
              <a href="https://www.linkedin.com/in/trent-gomez-vidal/" target="_blank" rel="noopener noreferrer" className="new-project-1-nav__link">LinkedIn</a>
              <Link to="/contact" className="new-project-1-nav__link">Contact</Link>
            </div>
          </nav>
          <CaseStudyDevMode scopeRef={pageRef} activeClassName="new-project-1-page--dev-mode" />
        </>
      )}

      <main className={`project-main${embedded ? ' project-main--embedded' : ''}`}>
        <NewProject1Hero embedded={embedded} />

        <div className="np1-content" data-dev-section="content">
        <section className="np1-section np1-intro" data-dev-section="intro" aria-label="Introduction">
          <div className="np1-section__inner np1-intro__inner">
            <div className="np1-split">
              <h2 className="np1-split__headline">
                Preparing an internal tool for an external release.
              </h2>
              <p className="np1-split__body">
                I was the sole designer for CX Pro. This is a tool used to build, run, and manage
                Cosm&apos;s advanced displays, including their marquee product: the immersive dome.
                Early 2025, I learned the tool was being positioned for external clients. At the
                time, we only had internal venue staff using the tool.
              </p>
            </div>
          </div>
        </section>

        <section className="np1-section np1-glance" data-dev-section="at-a-glance" aria-label="At a glance">
          <div className="np1-section__inner np1-glance__inner">
            <h2 className="np1-glance__title">At a glance</h2>
            <div className="np1-glance__grid">
              <div className="np1-glance__row">
                {GLANCE_ITEMS.slice(0, 2).map((item) => (
                  <article key={item.id} className="np1-glance-item">
                    <h3 className="np1-glance-item__title">{item.title}</h3>
                    <p className="np1-glance-item__body">{item.body}</p>
                  </article>
                ))}
              </div>
              <div className="np1-glance__row">
                {GLANCE_ITEMS.slice(2).map((item) => (
                  <article key={item.id} className="np1-glance-item">
                    <h3 className="np1-glance-item__title">{item.title}</h3>
                    <p className="np1-glance-item__body">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {embedded && (
          <>
            <Hypothesis />
            <EditingCarousel />
            <GuidedTransitions />
            <IpadCompatibility />
            <ResultsSection />
          </>
        )}

        {!embedded && (
          <section
            className="np1-section np1-current-tool"
            data-dev-section="current-tool"
            aria-label="Current tool"
          >
            <div className="np1-section__inner np1-current-tool__inner">
              <div className="np1-current-tool__tabs" role="tablist" aria-label="Current tool views">
                {CURRENT_TOOL_TABS.map((tab) => {
                  const selected = currentToolTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`np1-current-tool-tab-${tab.id}`}
                      aria-selected={selected}
                      aria-controls={`np1-current-tool-panel-${tab.id}`}
                      className={`np1-current-tool__tab${selected ? ' np1-current-tool__tab--active' : ''}`}
                      onClick={() => setCurrentToolTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
              {CURRENT_TOOL_TABS.map((tab) => {
                const selected = currentToolTab === tab.id
                return (
                  <div
                    key={tab.id}
                    role="tabpanel"
                    id={`np1-current-tool-panel-${tab.id}`}
                    aria-labelledby={`np1-current-tool-tab-${tab.id}`}
                    className="np1-current-tool__panel"
                    hidden={!selected}
                  >
                    {tab.id === 'current-tool' && (
                      <CurrentToolHotspotMap
                        src={CURRENT_TOOL_IMAGE}
                        alt="CX Pro current tool interface"
                        hotspots={CURRENT_TOOL_HOTSPOTS}
                      />
                    )}
                    {tab.id === 'current-use-cases' && (
                      <CurrentToolUseCases items={[...CURRENT_USE_CASES]} />
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {!embedded &&
          UPCOMING_SECTIONS.map((section) => {
            const isGoal = section.label === 'Goal'
            const isAudience = section.label === 'Audience'
            const isKeyAssumptions = section.label === 'Key Assumptions'
            const isProblem = section.label === 'Problem'
            const isHypothesis = section.label === 'Hypothesis'
            const isIpadCompat = section.label === 'Phase 3'
            const isBusinessValue = section.label === 'Business Value'

            if (isAudience) {
              return <TargetAudience key={section.label} />
            }

            if (isKeyAssumptions) {
              return <DeducingUserNeeds key={section.label} />
            }

            if (isProblem) {
              return <Problem key={section.label} />
            }

            if (isHypothesis) {
              return (
                <>
                  <Hypothesis key={section.label} />
                  <EditingSideShot key="editing-side-shot" />
                  <EditingCarousel key="editing-carousel" />
                  <RunOfShowSideShot key="run-of-show-side-shot" />
                </>
              )
            }

            if (isIpadCompat) {
              return <IpadCompatibility key={section.label} />
            }

            if (isBusinessValue) {
              return (
                <>
                  <ResultsSection key={section.label} />
                  <LeadershipQuoteSection key="leadership-quote" />
                </>
              )
            }

            return (
              <section
                key={section.label}
                className={`np1-section np1-stub${isGoal ? ' np1-stub--goal' : ''}${isGoal && goalInView ? ' np1-stub--goal-in-view' : ''}`}
                data-dev-section={section.label.toLowerCase().replace(/\s+/g, '-')}
                aria-label={section.label}
              >
                <div
                  ref={isGoal ? setGoalRevealRef : undefined}
                  className={`np1-section__inner${isGoal ? ' np1-stub__reveal' : ''}`}
                >
                  <p className="np1-stub__label">{section.label}</p>
                  <h2 className="np1-stub__title">{section.title}</h2>
                  {'body' in section && section.body ? (
                    <p className="np1-stub__body">{section.body}</p>
                  ) : null}
                </div>
              </section>
            )
          })}

        {!embedded && <EndHeroSection />}
        {!embedded && <CaseStudyNavSection />}

        {!embedded && (
          <footer className="new-project-1-footer" data-dev-section="footer">
            <div className="new-project-1-footer__inner">
              <span>TJ Gomez-Vidal ©</span>
              <a href="mailto:tjgomezvidal@gmail.com">tjgomezvidal@gmail.com</a>
              <a href="tel:+15593600445">(559) 360-0445</a>
            </div>
            <p className="new-project-1-footer__quote">
              "Great design is invisible—it anticipates needs before users articulate them."
            </p>
          </footer>
        )}
        </div>
      </main>
    </div>
  )
}
