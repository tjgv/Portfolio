import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ImgWithLoader } from '../components/MediaLoader'
import EmbedControlledVideo from '../components/new-project-1/EmbedControlledVideo'
import ResultsPhasesAnimation from '../components/new-project-1/ResultsPhasesAnimation'
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
import IpadCompatibility from '../components/new-project-1/IpadCompatibility'
import LeadershipQuoteSection from '../components/new-project-1/LeadershipQuoteSection'
import ResultsSection from '../components/new-project-1/ResultsSection'
import TargetAudience from '../components/new-project-1/TargetAudience'
import './NewProject1Page.css'

export const NEW_PROJECT_1_ROUTE = '/new-project-1'

export const NEW_PROJECT_1_META = {
  title: 'Finding Familiarity in Complexity',
  subtitle: 'Consumer-Grade CX Pro',
  timeline: '6 months',
  role: 'Lead Designer',
  org: 'Cosm',
  withPeople: 'Product Director, C-Suite',
} as const

/**
 * At-a-glance blocks — styled after the "My Role" block group from the CX
 * Pro case study (icon + label header, light-grey divider, then a
 * value/paragraph or a list of name/role pairs). Icons are inlined as SVG
 * (rather than <img src>) since the source assets are SVG markup saved with
 * a .png extension.
 */
function GlanceRoleIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M22.9167 43.75V30L13.2292 39.7396L10.2604 36.7708L20 27.0833H6.25V22.9167H20L10.2604 13.2292L13.2292 10.2604L22.9167 20V6.25H27.0833V20L36.7708 10.2604L39.7396 13.2292L30 22.9167H43.75V27.0833H30L39.7396 36.7708L36.7708 39.7396L27.0833 30V43.75H22.9167Z"
      />
    </svg>
  )
}

function GlanceTeamIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M0 37.5V34.2188C0 32.7257 0.763889 31.5104 2.29167 30.5729C3.81944 29.6354 5.83333 29.1667 8.33333 29.1667C8.78472 29.1667 9.21875 29.1753 9.63542 29.1927C10.0521 29.2101 10.4514 29.2535 10.8333 29.3229C10.3472 30.0521 9.98264 30.816 9.73958 31.6146C9.49653 32.4132 9.375 33.2465 9.375 34.1146V37.5H0ZM12.5 37.5V34.1146C12.5 33.0035 12.8038 31.9879 13.4115 31.0677C14.0191 30.1476 14.8785 29.3403 15.9896 28.6458C17.1007 27.9514 18.4288 27.4306 19.974 27.0833C21.5191 26.7361 23.1944 26.5625 25 26.5625C26.8403 26.5625 28.533 26.7361 30.0781 27.0833C31.6233 27.4306 32.9514 27.9514 34.0625 28.6458C35.1736 29.3403 36.0243 30.1476 36.6146 31.0677C37.2049 31.9879 37.5 33.0035 37.5 34.1146V37.5H12.5ZM40.625 37.5V34.1146C40.625 33.2118 40.5122 32.3611 40.2865 31.5625C40.0608 30.7639 39.7222 30.0174 39.2708 29.3229C39.6528 29.2535 40.0434 29.2101 40.4427 29.1927C40.842 29.1753 41.25 29.1667 41.6667 29.1667C44.1667 29.1667 46.1806 29.6267 47.7083 30.5469C49.2361 31.467 50 32.691 50 34.2188V37.5H40.625ZM16.9271 33.3333H33.125C32.7778 32.6389 31.8142 32.0313 30.2344 31.5104C28.6545 30.9896 26.9097 30.7292 25 30.7292C23.0903 30.7292 21.3455 30.9896 19.7656 31.5104C18.1858 32.0313 17.2396 32.6389 16.9271 33.3333ZM8.33333 27.0833C7.1875 27.0833 6.2066 26.6753 5.39063 25.8594C4.57465 25.0434 4.16667 24.0625 4.16667 22.9167C4.16667 21.7361 4.57465 20.7465 5.39063 19.9479C6.2066 19.1493 7.1875 18.75 8.33333 18.75C9.51389 18.75 10.5035 19.1493 11.3021 19.9479C12.1007 20.7465 12.5 21.7361 12.5 22.9167C12.5 24.0625 12.1007 25.0434 11.3021 25.8594C10.5035 26.6753 9.51389 27.0833 8.33333 27.0833ZM41.6667 27.0833C40.5208 27.0833 39.5399 26.6753 38.724 25.8594C37.908 25.0434 37.5 24.0625 37.5 22.9167C37.5 21.7361 37.908 20.7465 38.724 19.9479C39.5399 19.1493 40.5208 18.75 41.6667 18.75C42.8472 18.75 43.8368 19.1493 44.6354 19.9479C45.434 20.7465 45.8333 21.7361 45.8333 22.9167C45.8333 24.0625 45.434 25.0434 44.6354 25.8594C43.8368 26.6753 42.8472 27.0833 41.6667 27.0833ZM25 25C23.2639 25 21.7882 24.3924 20.5729 23.1771C19.3576 21.9618 18.75 20.4861 18.75 18.75C18.75 16.9792 19.3576 15.4948 20.5729 14.2969C21.7882 13.099 23.2639 12.5 25 12.5C26.7708 12.5 28.2552 13.099 29.4531 14.2969C30.651 15.4948 31.25 16.9792 31.25 18.75C31.25 20.4861 30.651 21.9618 29.4531 23.1771C28.2552 24.3924 26.7708 25 25 25ZM25 20.8333C25.5903 20.8333 26.0851 20.6337 26.4844 20.2344C26.8837 19.8351 27.0833 19.3403 27.0833 18.75C27.0833 18.1597 26.8837 17.6649 26.4844 17.2656C26.0851 16.8663 25.5903 16.6667 25 16.6667C24.4097 16.6667 23.9149 16.8663 23.5156 17.2656C23.1163 17.6649 22.9167 18.1597 22.9167 18.75C22.9167 19.3403 23.1163 19.8351 23.5156 20.2344C23.9149 20.6337 24.4097 20.8333 25 20.8333Z"
      />
    </svg>
  )
}

function GlanceScheduleIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M31.875 34.7917L34.7917 31.875L27.0833 24.1667V14.5833H22.9167V25.8333L31.875 34.7917ZM25 45.8333C22.1181 45.8333 19.4097 45.2865 16.875 44.1927C14.3403 43.099 12.1354 41.6146 10.2604 39.7396C8.38542 37.8646 6.90104 35.6597 5.80729 33.125C4.71354 30.5903 4.16667 27.8819 4.16667 25C4.16667 22.1181 4.71354 19.4097 5.80729 16.875C6.90104 14.3403 8.38542 12.1354 10.2604 10.2604C12.1354 8.38542 14.3403 6.90104 16.875 5.80729C19.4097 4.71354 22.1181 4.16667 25 4.16667C27.8819 4.16667 30.5903 4.71354 33.125 5.80729C35.6597 6.90104 37.8646 8.38542 39.7396 10.2604C41.6146 12.1354 43.099 14.3403 44.1927 16.875C45.2865 19.4097 45.8333 22.1181 45.8333 25C45.8333 27.8819 45.2865 30.5903 44.1927 33.125C43.099 35.6597 41.6146 37.8646 39.7396 39.7396C37.8646 41.6146 35.6597 43.099 33.125 44.1927C30.5903 45.2865 27.8819 45.8333 25 45.8333ZM25 41.6667C29.6181 41.6667 33.5504 40.0434 36.7969 36.7969C40.0434 33.5504 41.6667 29.6181 41.6667 25C41.6667 20.3819 40.0434 16.4497 36.7969 13.2031C33.5504 9.9566 29.6181 8.33333 25 8.33333C20.3819 8.33333 16.4497 9.9566 13.2031 13.2031C9.9566 16.4497 8.33333 20.3819 8.33333 25C8.33333 29.6181 9.9566 33.5504 13.2031 36.7969C16.4497 40.0434 20.3819 41.6667 25 41.6667Z"
      />
    </svg>
  )
}

function GlanceReportIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M25 35.4167C25.5903 35.4167 26.0851 35.217 26.4844 34.8177C26.8837 34.4184 27.0833 33.9236 27.0833 33.3333C27.0833 32.7431 26.8837 32.2483 26.4844 31.849C26.0851 31.4497 25.5903 31.25 25 31.25C24.4097 31.25 23.9149 31.4497 23.5156 31.849C23.1163 32.2483 22.9167 32.7431 22.9167 33.3333C22.9167 33.9236 23.1163 34.4184 23.5156 34.8177C23.9149 35.217 24.4097 35.4167 25 35.4167ZM22.9167 27.0833H27.0833V14.5833H22.9167V27.0833ZM17.1875 43.75L6.25 32.8125V17.1875L17.1875 6.25H32.8125L43.75 17.1875V32.8125L32.8125 43.75H17.1875ZM18.9583 39.5833H31.0417L39.5833 31.0417V18.9583L31.0417 10.4167H18.9583L10.4167 18.9583V31.0417L18.9583 39.5833Z"
      />
    </svg>
  )
}

function GlanceStarIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M25 35.9792L37.875 43.75L34.4583 29.1042L45.8333 19.25L30.8542 17.9792L25 4.1667L19.1458 17.9792L4.1667 19.25L15.5417 29.1042L12.125 43.75Z"
      />
    </svg>
  )
}

type GlanceBlock = {
  id: string
  icon: ReactNode
  label: string
  value?: string
  pairs?: readonly { id: string; primary: string; secondary: string }[]
  paragraph?: ReactNode
}

const GLANCE_BLOCKS: readonly GlanceBlock[] = [
  {
    id: 'role',
    icon: <GlanceRoleIcon />,
    label: 'My Role',
    value: 'Product Designer',
    paragraph: (
      <>
        I was the <strong>sole designer</strong> for this project, contributing end-to-end
        across research, design, and product strategy.
      </>
    ),
  },
  {
    id: 'team',
    icon: <GlanceTeamIcon />,
    label: 'Team',
    pairs: [
      { id: 'product-director', primary: 'Product Director', secondary: 'Anna R. / Weekly' },
      { id: 'c-suite', primary: 'C-Suite Leadership', secondary: 'Devin P., Ryan K, Brian D. / Periodic' },
    ],
  },
  {
    id: 'timeline',
    icon: <GlanceScheduleIcon />,
    label: 'Timeline',
    value: '6\u20138 Months',
  },
  {
    id: 'problem',
    icon: <GlanceReportIcon />,
    label: 'Problem',
    paragraph:
      'CX Pro was built for internal experts with deep technical knowledge, but it needed to evolve into a simpler client-facing product for external users. The challenge was identifying the highest-impact improvements needed today while defining the future experience we wanted to create tomorrow.',
  },
  {
    id: 'outcome',
    icon: <GlanceStarIcon />,
    label: 'Outcome',
    paragraph:
      'Aligned leadership around a long-term product vision that separates key workflows, simplified the current experience, and successfully pitched a design direction for CX Pro.',
  },
] as const

/**
 * Simplified preview content for the pop-out modal — mirrors the CX Pro
 * popup's pattern of a label/headline column plus a paragraph-and-image
 * column, instead of reusing the full page's heavier interactive sections
 * (autoplaying video, carousels, animated diagrams).
 */
type EmbedSection = {
  id: string
  header: string
  body: ReactNode
  images?: readonly { src: string; alt: string }[]
  videos?: readonly { src: string; ariaLabel: string; hideReset?: boolean }[]
  extra?: ReactNode
}

const EMBED_SECTIONS: readonly EmbedSection[] = [
  {
    id: 'hypothesis',
    header: 'Hypothesis',
    body: (
      <>
        <p className="np1-embed-body">
          After speaking with users, I learned that the central issue with CX Pro was
          conceptual clarity — what buttons mean, how layers work, what actions are
          instantaneous.
        </p>
        <p className="np1-embed-body">
          Any small tweak would still be constrained by a tool trying to do everything at
          once. I hypothesized that splitting CX Pro into two modes —{' '}
          <strong>Editing</strong> and <strong>Running a Show</strong> — would let each
          workflow communicate its purpose more clearly and create room for the product to
          scale.
        </p>
      </>
    ),
    images: [
      { src: '/new-project-1/edit-show.png', alt: 'CX Pro Edit Show mode' },
      { src: '/new-project-1/run-show.png', alt: 'CX Pro Run Show mode' },
    ],
  },
  {
    id: 'editing-groundwork',
    header: 'MVP Editing + Groundwork Targets',
    body: (
      <p className="np1-embed-body">
        Beyond improving language and interactions, I focused on four changes to simplify
        editing and early show running: <strong>Asset Visualizations</strong> for clearer
        scene building, <strong>Scene Visualizations</strong> to represent asset
        combinations without pre-rendered scenes, <strong>Layering Support</strong> to
        communicate hierarchy and unique layer behaviors, and{' '}
        <strong>Auto-Play Scenes</strong> to move toward a click-and-go show running
        experience.
      </p>
    ),
    videos: [
      {
        src: '/new-project-1/editing-clip-1.mp4',
        ariaLabel: 'CX Pro layer asset thumbnail system demonstration',
      },
    ],
  },
  {
    id: 'guided-transitions',
    header: 'Simplified & Guided Transitions',
    body: (
      <p className="np1-embed-body">
        I designed the Run Show View based on the assumption that this view would be the
        primary touchpoint casual users faced while running CX Pro. I created a baseline
        show management system with familiar UI patterns that scale towards that
        click-and-go dream, while giving the central area workflow flexibility — offering a
        responsive layout towards the various types of workflows that may be needed.
      </p>
    ),
    videos: [
      {
        src: '/new-project-1/feature-show-management.mp4',
        ariaLabel: 'CX Pro show management and run of show view demonstration',
      },
      {
        src: '/new-project-1/feature-guided-transitions.mp4',
        ariaLabel: 'CX Pro simplified and guided transitions — proposed experience',
      },
    ],
  },
  {
    id: 'ipad-compatibility',
    header: 'Pitching iPad Compatibility',
    body: (
      <>
        <p className="np1-embed-body">
          This was a blue-sky exercise to define the ideal version of CX Pro and establish
          its North Star. Most external users weren&apos;t looking to create highly
          customized shows — they wanted to run experiences efficiently in a way that fit
          their operations, and being tied to a desktop only added friction.
        </p>
        <p className="np1-embed-body">
          CX Pro isn&apos;t meant to drive engagement, it&apos;s meant to make operations
          effortless. An iPad gives speakers direct control of their shows, lets event
          staff multitask more freely, and makes the product more accessible.
        </p>
      </>
    ),
    videos: [
      {
        src: '/new-project-1/ipad-trim2.mov',
        ariaLabel: 'CX Pro iPad compatibility demonstration',
        hideReset: true,
      },
    ],
  },
  {
    id: 'business-value',
    header: 'Results',
    body: (
      <p className="np1-embed-body">
        Cosm aligned around a phased CX Pro roadmap. By separating editing from show
        running and extending support to iPad, I built momentum toward a simpler, more
        scalable CX Pro — with leadership buy-in secured across each phase of the rollout.
      </p>
    ),
    extra: (
      <ResultsPhasesAnimation className="np1-embed-results-phases" capStrokeAtLastCircle />
    ),
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
        {embedded ? (
          <div className="np1-embed-banner-block" data-dev-section="hero">
            <img
              className="np1-embed-banner-block__img"
              src="/new-project-1/hero-banner-devices.png"
              alt=""
            />
          </div>
        ) : (
          <NewProject1Hero />
        )}

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

        {!embedded && (
          <section className="np1-section np1-glance" data-dev-section="at-a-glance" aria-label="At a glance">
            <div className="np1-section__inner np1-glance__inner">
              <div className="np1-glance__layout">
                <div className="np1-glance__col1">
                  <h2 className="np1-glance__title">At a glance</h2>
                </div>
                <div className="np1-glance__col2">
                  <div className="np1-glance__blocks">
                    {GLANCE_BLOCKS.map((block) => (
                      <article key={block.id} className="np1-glance-block">
                        <div className="np1-glance-block__head">
                          <span className="np1-glance-block__icon" aria-hidden>
                            {block.icon}
                          </span>
                          <h3 className="np1-glance-block__label">{block.label}</h3>
                        </div>
                        <div className="np1-glance-block__divider" aria-hidden />
                        <div className="np1-glance-block__content">
                          {block.value ? (
                            <p className="np1-glance-block__value">{block.value}</p>
                          ) : null}
                          {block.pairs ? (
                            <div className="np1-glance-block__pairs">
                              {block.pairs.map((pair) => (
                                <div key={pair.id} className="np1-glance-block__pair">
                                  <span className="np1-glance-block__pair-primary">{pair.primary}</span>
                                  <span className="np1-glance-block__pair-secondary">{pair.secondary}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}
                          {block.paragraph ? (
                            <p className="np1-glance-block__paragraph">{block.paragraph}</p>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {embedded && (
          <div className="np1-embed-sections">
            {EMBED_SECTIONS.map((section) => (
              <div
                key={section.id}
                className="np1-embed-block"
                data-dev-section={section.id}
              >
                <div className="np1-embed-block__col1">
                  <h2 className="np1-embed-header">{section.header}</h2>
                </div>
                <div className="np1-embed-block__col2">
                  {section.body}
                  {section.images?.length === 2 ? (
                    <div className="np1-embed-two-images">
                      {section.images.map((image) => (
                        <ImgWithLoader key={image.src} src={image.src} alt={image.alt} />
                      ))}
                    </div>
                  ) : section.images?.length === 1 ? (
                    <div className="np1-embed-full-width">
                      <ImgWithLoader src={section.images[0].src} alt={section.images[0].alt} />
                    </div>
                  ) : null}
                  {section.videos?.length ? (
                    <div className="np1-embed-video-stack">
                      {section.videos.map((video) => (
                        <div key={video.src} className="np1-embed-full-width">
                          <EmbedControlledVideo
                            src={video.src}
                            ariaLabel={video.ariaLabel}
                            hideReset={video.hideReset}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {section.extra}
                </div>
              </div>
            ))}
          </div>
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
