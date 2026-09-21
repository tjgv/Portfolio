import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import './AnimationPreview.css'

type AnimationPreset = 'brightness-cascade' | 'stretch-in' | 'rotate-cascade' | null
type RingId = 'inner' | 'mid' | 'outer'

type PreviewTab = {
  id: number
  label: string
  isPlaying: boolean
  playGeneration: number
  animation: AnimationPreset
}

const RING_PATHS: Record<RingId, string> = {
  outer:
    'M27.7093 22H11.7653C9.69613 21.9694 7.72126 21.0604 6.26801 19.4697C4.81476 17.879 4 15.7344 4 13.5C4 11.2656 4.81476 9.12105 6.26801 7.53031C7.72126 5.93958 9.69613 5.03059 11.7653 5H27.7093V6.01321H12.8941C11.0549 6.01321 9.29101 6.80208 7.99049 8.20628C6.68998 9.61047 5.95936 11.515 5.95936 13.5008C5.95936 15.4866 6.68998 17.3911 7.99049 18.7953C9.29101 20.1995 11.0549 20.9884 12.8941 20.9884H27.7093V22Z',
  inner:
    'M27.7109 18.7533H21.6453C20.8777 18.7347 20.1475 18.3924 19.6107 17.7998C19.074 17.2071 18.7734 16.4111 18.7734 15.5822C18.7734 14.7533 19.074 13.9573 19.6107 13.3646C20.1475 12.772 20.8777 12.4297 21.6453 12.4111H27.7109V13.4243H22.7725C22.5055 13.4165 22.2397 13.4665 21.9909 13.5715C21.7421 13.6764 21.5153 13.8341 21.3239 14.0352C21.1324 14.2364 20.9803 14.4769 20.8764 14.7426C20.7725 15.0083 20.719 15.2938 20.719 15.5822C20.719 15.8706 20.7725 16.1561 20.8764 16.4218C20.9803 16.6875 21.1324 16.928 21.3239 17.1292C21.5153 17.3303 21.7421 17.488 21.9909 17.593C22.2397 17.6979 22.5055 17.7479 22.7725 17.7401H27.7109V18.7533Z',
  mid:
    'M27.7056 20.3781H16.7015C15.2681 20.3781 13.8934 19.7633 12.8799 18.6689C11.8663 17.5745 11.2969 16.0902 11.2969 14.5426C11.2969 12.9949 11.8663 11.5106 12.8799 10.4162C13.8934 9.32184 15.2681 8.70703 16.7015 8.70703H27.7056V9.72024H17.8273C16.6428 9.72024 15.5068 10.2283 14.6692 11.1327C13.8316 12.037 13.3611 13.2636 13.3611 14.5426C13.3611 15.8215 13.8316 17.0481 14.6692 17.9525C15.5068 18.8568 16.6428 19.3649 17.8273 19.3649H27.713L27.7056 20.3781Z',
}

const RING_DRAW_ORDER: RingId[] = ['outer', 'mid', 'inner']
const RING_PLAY_ORDER: RingId[] = ['outer', 'mid', 'inner']

const VIEWBOX_WIDTH = 31
const REST_RIGHT_X = 27.71
const ENTER_MS = 820
const CONDENSE_MS = 400
const PAIR_STAGGER_MS = 25
const OUTER_LEAD_MS = 220
const LAST_ENTER_MS = OUTER_LEAD_MS + PAIR_STAGGER_MS
const RETRACT_WAVE_MS = ENTER_MS + LAST_ENTER_MS
const STRETCH_END_MS =
  RETRACT_WAVE_MS + (RING_PLAY_ORDER.length - 1) * PAIR_STAGGER_MS + CONDENSE_MS
const HIGHLIGHT_MS = 1400
const HIGHLIGHT_STAGGER_MS = 160
const HIGHLIGHT_START_MS = STRETCH_END_MS + 120
const HIGHLIGHT_FADE_AT = 0.52
const FADE_TAIL_MS = 280
const FADE_START_MS = HIGHLIGHT_START_MS + HIGHLIGHT_MS * HIGHLIGHT_FADE_AT
const FADE_MS =
  HIGHLIGHT_START_MS +
  (RING_PLAY_ORDER.length - 1) * HIGHLIGHT_STAGGER_MS +
  HIGHLIGHT_MS +
  FADE_TAIL_MS -
  FADE_START_MS
const PINK = '#ff4d8d'
const BLUE = '#4d8fff'
const RIGHT_EDGE_MIN = 26.5

const FLUSH_STOPS = [
  { offset: '0%', color: '#ff4d8d' },
  { offset: '48%', color: '#c44bff' },
  { offset: '100%', color: '#4d8fff' },
] as const

const ROTATE_MS = 1800
const ROTATE_STAGGER_MS = 220
const ROTATE_LAST_ENTER_MS = ROTATE_STAGGER_MS * (RING_PLAY_ORDER.length - 1)
const ROTATE_COLOR_OUT_MS = ROTATE_MS + ROTATE_LAST_ENTER_MS

function enterDelayFor(id: RingId) {
  if (id === 'outer') return 0
  if (id === 'mid') return OUTER_LEAD_MS
  return OUTER_LEAD_MS + PAIR_STAGGER_MS
}

function retractDelayFor(id: RingId) {
  const index = RING_PLAY_ORDER.indexOf(id)
  return RETRACT_WAVE_MS + index * PAIR_STAGGER_MS
}

function cascadeDelayFor(id: RingId) {
  return HIGHLIGHT_START_MS + RING_PLAY_ORDER.indexOf(id) * HIGHLIGHT_STAGGER_MS
}

function rotateDelayFor(id: RingId) {
  return RING_PLAY_ORDER.indexOf(id) * ROTATE_STAGGER_MS
}

function rotateColorOutDelayFor(id: RingId) {
  return ROTATE_COLOR_OUT_MS + RING_PLAY_ORDER.indexOf(id) * PAIR_STAGGER_MS
}

function FlushGradient({
  id,
  enterDelayMs,
  colorOutDelayMs,
  x2,
  flushInMs = Math.round(ENTER_MS * 0.55),
  colorOutMs = CONDENSE_MS,
}: {
  id: string
  enterDelayMs: number
  colorOutDelayMs: number
  x2: number
  flushInMs?: number
  colorOutMs?: number
}) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="4" y1="13.5" x2={x2} y2="13.5">
      {FLUSH_STOPS.map((stop) => (
        <stop key={stop.offset} offset={stop.offset} stopColor="#ffffff">
          <animate
            attributeName="stop-color"
            from="#ffffff"
            to={stop.color}
            begin={`${enterDelayMs}ms`}
            dur={`${flushInMs}ms`}
            fill="freeze"
          />
          <animate
            attributeName="stop-color"
            from={stop.color}
            to="#ffffff"
            begin={`${colorOutDelayMs}ms`}
            dur={`${colorOutMs}ms`}
            fill="freeze"
          />
        </stop>
      ))}
    </linearGradient>
  )
}

function StretchFlushGradient({
  id,
  retractDelayMs,
}: {
  id: string
  retractDelayMs: number
}) {
  return (
    <linearGradient
      id={id}
      gradientUnits="objectBoundingBox"
      x1="0"
      y1="0.5"
      x2="1"
      y2="0.5"
      gradientTransform="translate(1 0)"
    >
      <stop offset="0" stopColor={PINK} />
      <stop offset="0.52" stopColor={PINK} />
      <stop offset="0.52" stopColor={BLUE} />
      <stop offset="1" stopColor={BLUE} />
      <animateTransform
        attributeName="gradientTransform"
        type="translate"
        from="1 0"
        to="-1 0"
        begin={`${retractDelayMs}ms`}
        dur={`${CONDENSE_MS}ms`}
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.45 0 0.55 1"
      />
    </linearGradient>
  )
}

function stretchToViewportRight(markWidth: number, markLeft: number) {
  if (markWidth <= 0) return 0
  const unitPx = markWidth / VIEWBOX_WIDTH
  const restRightPx = markLeft + (REST_RIGHT_X / VIEWBOX_WIDTH) * markWidth
  return Math.max((window.innerWidth - restRightPx) / unitPx, 0)
}

function estimateStretchToViewportRight() {
  if (typeof window === 'undefined') return 60
  const viewport = window.innerWidth
  const markWidth = Math.min(viewport * 0.93, 465)
  const markLeft = (viewport - markWidth) / 2
  return stretchToViewportRight(markWidth, markLeft)
}

function newBlankTab(id: number, number: number): PreviewTab {
  return {
    id,
    label: `Tab ${number}`,
    isPlaying: false,
    playGeneration: 0,
    animation: null,
  }
}

function stretchRightEndpoints(d: string, extra: number): string {
  if (extra === 0) return d

  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g)
  if (!tokens) return d

  const arity: Record<string, number> = {
    M: 2,
    L: 2,
    H: 1,
    V: 1,
    C: 6,
    S: 4,
    Q: 4,
    T: 2,
    A: 7,
    Z: 0,
  }

  const isX = (command: string, paramIndex: number) => {
    if (command === 'H') return true
    if (command === 'V' || command === 'Z') return false
    if (command === 'M' || command === 'L' || command === 'T') return paramIndex % 2 === 0
    if (command === 'C') return paramIndex % 2 === 0
    if (command === 'S' || command === 'Q') return paramIndex % 2 === 0
    return false
  }

  const out: string[] = []
  let command = ''
  let paramIndex = 0

  for (const token of tokens) {
    if (/^[A-Za-z]$/.test(token)) {
      command = token.toUpperCase()
      paramIndex = 0
      out.push(token)
      continue
    }

    let value = Number(token)
    if (isX(command, paramIndex) && value > RIGHT_EDGE_MIN) {
      value += extra
    }
    out.push(String(Math.round(value * 10000) / 10000))
    paramIndex += 1
    const count = arity[command]
    if (count && paramIndex >= count) paramIndex = 0
  }

  return out.join(' ')
}

function StretchRing({
  id,
  enterDelayMs,
  retractDelayMs,
  playing,
  stretchAmount,
}: {
  id: RingId
  enterDelayMs: number
  retractDelayMs: number
  playing: boolean
  stretchAmount: number
}) {
  const normal = RING_PATHS[id]
  const stretched = stretchRightEndpoints(normal, stretchAmount)

  if (!playing) {
    return (
      <svg
        className="animation-preview__mark"
        width="31"
        height="27"
        viewBox="0 0 31 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path className={`animation-preview__ring animation-preview__ring--${id}`} d={normal} />
      </svg>
    )
  }

  const gradientId = `stretch-flush-${id}`

  return (
    <svg
      className={`animation-preview__mark animation-preview__stretch-ring animation-preview__stretch-ring--${id}`}
      style={{ animationDelay: `${enterDelayMs}ms` }}
      width="31"
      height="27"
      viewBox="0 0 31 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <StretchFlushGradient id={gradientId} retractDelayMs={retractDelayMs} />
      </defs>
      <path
        className={`animation-preview__ring animation-preview__ring--${id}`}
        d={stretched}
        style={{ fill: `url(#${gradientId})` }}
      >
        <animate
          attributeName="d"
          from={stretched}
          to={stretched}
          begin={`${enterDelayMs}ms`}
          dur={`${ENTER_MS}ms`}
          fill="freeze"
        />
        <animate
          attributeName="d"
          from={stretched}
          to={normal}
          begin={`${retractDelayMs}ms`}
          dur={`${CONDENSE_MS}ms`}
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.45 0 0.55 1"
        />
        <animate
          attributeName="fill"
          values={`${BLUE};${PINK};${PINK};${BLUE};${BLUE};#ffffff`}
          keyTimes="0;0.12;0.4;0.52;0.8;1"
          begin={`${cascadeDelayFor(id)}ms`}
          dur={`${HIGHLIGHT_MS}ms`}
          fill="freeze"
        />
      </path>
    </svg>
  )
}

function RotateRing({
  id,
  enterDelayMs,
  colorOutDelayMs,
  playing,
}: {
  id: RingId
  enterDelayMs: number
  colorOutDelayMs: number
  playing: boolean
}) {
  const normal = RING_PATHS[id]
  const gradientId = `rotate-flush-${id}`

  if (!playing) {
    return (
      <svg
        className="animation-preview__mark"
        width="31"
        height="27"
        viewBox="0 0 31 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path className={`animation-preview__ring animation-preview__ring--${id}`} d={normal} />
      </svg>
    )
  }

  return (
    <svg
      className="animation-preview__mark animation-preview__rotate-ring"
      style={{ animationDelay: `${enterDelayMs}ms` }}
      width="31"
      height="27"
      viewBox="0 0 31 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <FlushGradient
          id={gradientId}
          enterDelayMs={enterDelayMs}
          colorOutDelayMs={colorOutDelayMs}
          x2={REST_RIGHT_X}
          flushInMs={Math.round(ROTATE_MS * 0.55)}
        />
      </defs>
      <path
        className={`animation-preview__ring animation-preview__ring--${id}`}
        d={normal}
        style={{ fill: `url(#${gradientId})` }}
      />
    </svg>
  )
}

function AnimationMark({
  isPlaying,
  playGeneration,
  animation,
}: PreviewTab) {
  const playingCascade = isPlaying && animation === 'brightness-cascade'
  const playingStretch = isPlaying && animation === 'stretch-in'
  const playingRotate = isPlaying && animation === 'rotate-cascade'
  const markStackRef = useRef<HTMLDivElement>(null)
  const [stretchAmount, setStretchAmount] = useState(estimateStretchToViewportRight)

  useLayoutEffect(() => {
    if (animation !== 'stretch-in') return

    const measure = () => {
      const el = markStackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      setStretchAmount(stretchToViewportRight(rect.width, rect.left))
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [animation, playGeneration])

  if (animation === 'stretch-in') {
    return (
      <div
        key={playGeneration}
        className="animation-preview__stretch-fade"
        style={{
          ['--fade-delay' as string]: `${FADE_START_MS}ms`,
          ['--fade-ms' as string]: `${FADE_MS}ms`,
        }}
      >
        <div
          ref={markStackRef}
          className="animation-preview__mark-stack animation-preview__stretch-stack"
          style={{ animationDelay: `${STRETCH_END_MS}ms` }}
        >
          {RING_DRAW_ORDER.map((id) => (
            <StretchRing
              key={id}
              id={id}
              enterDelayMs={enterDelayFor(id)}
              retractDelayMs={retractDelayFor(id)}
              playing={playingStretch}
              stretchAmount={stretchAmount}
            />
          ))}
        </div>
      </div>
    )
  }

  if (animation === 'rotate-cascade') {
    return (
      <div key={playGeneration} className="animation-preview__mark-stack animation-preview__rotate-stack">
        {RING_DRAW_ORDER.map((id) => (
          <RotateRing
            key={id}
            id={id}
            enterDelayMs={rotateDelayFor(id)}
            colorOutDelayMs={rotateColorOutDelayFor(id)}
            playing={playingRotate}
          />
        ))}
      </div>
    )
  }

  return (
    <svg
      key={playGeneration}
      className={`animation-preview__mark${playingCascade ? ' is-playing is-cascade' : ''}`}
      width="31"
      height="27"
      viewBox="0 0 31 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Component 587"
    >
      {RING_DRAW_ORDER.map((id) => (
        <path
          key={id}
          className={`animation-preview__ring animation-preview__ring--${id}`}
          d={RING_PATHS[id]}
        />
      ))}
    </svg>
  )
}

export default function AnimationPreview() {
  const nextIds = useRef({ id: 4, number: 4 })
  const [tabs, setTabs] = useState<PreviewTab[]>(() => [
    {
      id: 1,
      label: 'Tab 1',
      isPlaying: true,
      playGeneration: 0,
      animation: 'brightness-cascade',
    },
    {
      id: 2,
      label: 'Tab 2',
      isPlaying: true,
      playGeneration: 0,
      animation: 'stretch-in',
    },
    {
      id: 3,
      label: 'Tab 3',
      isPlaying: true,
      playGeneration: 0,
      animation: 'rotate-cascade',
    },
  ])
  const [activeTabId, setActiveTabId] = useState(3)
  const [tabMenu, setTabMenu] = useState<{ tabId: number; x: number; y: number } | null>(null)
  const tabMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tabMenu) return

    function closeMenu() {
      setTabMenu(null)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeMenu()
    }

    function onPointerDown(event: MouseEvent) {
      if (tabMenuRef.current?.contains(event.target as Node)) return
      closeMenu()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('scroll', closeMenu, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('scroll', closeMenu, true)
    }
  }, [tabMenu])

  function addTab() {
    const tab = newBlankTab(nextIds.current.id, nextIds.current.number)
    nextIds.current = { id: tab.id + 1, number: nextIds.current.number + 1 }
    setTabs((current) => [...current, tab])
    setActiveTabId(tab.id)
  }

  function closeTab(id: number) {
    setTabs((current) => {
      if (current.length <= 1) return current
      const index = current.findIndex((tab) => tab.id === id)
      const next = current.filter((tab) => tab.id !== id)
      if (id === activeTabId) {
        const neighbor = current[index + 1] ?? current[index - 1]
        if (neighbor) setActiveTabId(neighbor.id)
      }
      return next
    })
  }

  function duplicateTab(sourceId: number) {
    const source = tabs.find((tab) => tab.id === sourceId)
    if (!source) return

    const tab: PreviewTab = {
      id: nextIds.current.id,
      label: `Tab ${nextIds.current.number}`,
      isPlaying: true,
      playGeneration: 0,
      animation: source.animation,
    }
    nextIds.current = { id: tab.id + 1, number: nextIds.current.number + 1 }
    setTabs((current) => {
      const index = current.findIndex((item) => item.id === sourceId)
      if (index === -1) return [...current, tab]
      return [...current.slice(0, index + 1), tab, ...current.slice(index + 1)]
    })
    setActiveTabId(tab.id)
    setTabMenu(null)
  }

  function replayActive() {
    setTabs((current) =>
      current.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, isPlaying: true, playGeneration: tab.playGeneration + 1 }
          : tab,
      ),
    )
  }

  return (
    <div className="animation-preview">
      <header className="animation-preview__chrome">
        <div className="animation-preview__tabs" role="tablist" aria-label="Animation instances">
          {tabs.map((tab) => {
            const selected = tab.id === activeTabId
            return (
              <div
                key={tab.id}
                className={`animation-preview__tab${selected ? ' is-active' : ''}`}
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveTabId(tab.id)}
                onContextMenu={(event) => {
                  if (tab.animation !== 'stretch-in') return
                  event.preventDefault()
                  setActiveTabId(tab.id)
                  setTabMenu({ tabId: tab.id, x: event.clientX, y: event.clientY })
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveTabId(tab.id)
                  }
                }}
              >
                <span className="animation-preview__tab-label">{tab.label}</span>
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="animation-preview__tab-close"
                    aria-label={`Close ${tab.label}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      closeTab(tab.id)
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                )}
              </div>
            )
          })}
          <button
            type="button"
            className="animation-preview__new-tab"
            aria-label="New tab"
            onClick={addTab}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {tabMenu && (
          <div
            ref={tabMenuRef}
            className="animation-preview__menu"
            style={{ left: tabMenu.x, top: tabMenu.y }}
            role="menu"
          >
            <button
              type="button"
              className="animation-preview__menu-item"
              role="menuitem"
              onClick={() => duplicateTab(tabMenu.tabId)}
            >
              Duplicate
            </button>
          </div>
        )}

        <button type="button" className="animation-preview__replay" onClick={replayActive}>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2.2 7A4.8 4.8 0 1 0 3.4 3.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M1.4 1.6v3.1h3.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Replay
        </button>
      </header>

      <main className="animation-preview__stage">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="animation-preview__panel"
            role="tabpanel"
            hidden={tab.id !== activeTabId}
          >
            {tab.id === activeTabId && <AnimationMark {...tab} />}
          </div>
        ))}
      </main>
    </div>
  )
}
