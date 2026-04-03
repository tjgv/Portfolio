import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  CHARACTER_CATALOG,
  COLOR_HEX,
  getAccessoryOptions,
  getCharacterImageUrl,
  getColorsForCharacterSafe,
  getRandomCharacter,
  getRandomCuteName,
  type CharacterSpec,
  type ColorType,
} from '../../figpal/config'
import './FigPalCharacterBuilder.css'

const FIGPAL_ARROW_ASSETS = {
  back: {
    default: '/figpal/arrows/back-default.svg',
    hover: '/figpal/arrows/back-hover.svg',
  },
  forward: {
    default: '/figpal/arrows/forward-default.svg',
    hover: '/figpal/arrows/forward-hover.svg',
  },
} as const

function FigPalArrowMark({ direction }: { direction: 'back' | 'forward' }) {
  const a = FIGPAL_ARROW_ASSETS[direction]
  return (
    <>
      <img
        src={a.default}
        alt=""
        className="figpal-builder-arrow-img figpal-builder-arrow-img--default"
        draggable={false}
      />
      <img
        src={a.hover}
        alt=""
        className="figpal-builder-arrow-img figpal-builder-arrow-img--hover"
        draggable={false}
      />
    </>
  )
}

/** Dice — outer hit area matches arrow buttons; inner die scaled like arrow glyph; #313A5A 35% / 100% */
function FigPalDiceMark() {
  const pips = (
    <g className="figpal-builder-dice-face">
      <rect x="14" y="14" width="20" height="20" rx="3.5" fill="rgba(255, 255, 255, 0.92)" />
      <circle cx="18.5" cy="18.5" r="1.75" fill="#313A5A" />
      <circle cx="29.5" cy="18.5" r="1.75" fill="#313A5A" />
      <circle cx="24" cy="24" r="1.75" fill="#313A5A" />
      <circle cx="18.5" cy="29.5" r="1.75" fill="#313A5A" />
      <circle cx="29.5" cy="29.5" r="1.75" fill="#313A5A" />
    </g>
  )
  return (
    <>
      <svg
        className="figpal-builder-arrow-img figpal-builder-arrow-img--default figpal-builder-dice-svg"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="24" cy="24" r="24" fill="rgba(49, 58, 90, 0.35)" />
        {pips}
      </svg>
      <svg
        className="figpal-builder-arrow-img figpal-builder-arrow-img--hover figpal-builder-dice-svg"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <circle cx="24" cy="24" r="24" fill="#313A5A" />
        {pips}
      </svg>
    </>
  )
}

export interface FigPalFollowState {
  enabled: boolean
  characterUrl: string
  accessoryUrl: string | null
  displayName: string
}

export interface FigPalBuilderState {
  characterIndex: number
  color: ColorType
  expression: number
  accessoryIndex: number
  displayName: string
  lastSavedName: string
  userHasSavedName: boolean
  followMouse: boolean
}

export interface FigPalSidebarContext {
  followMouse: boolean
  setFollowMouse: (value: boolean) => void
}

interface FigPalCharacterBuilderProps {
  onClose: () => void
  onFollowMouseChange?: (state: FigPalFollowState) => void
  initialState?: FigPalBuilderState | null
  onStateChange?: (state: FigPalBuilderState) => void
  /** Two-column modal: customizer left, this panel right (e.g. title + Follow Me). */
  renderSidebar?: (ctx: FigPalSidebarContext) => ReactNode
}

const FIGPAL_TOGGLE_OFF = '/figpal/toggle-off.svg'
const FIGPAL_TOGGLE_ON = '/figpal/toggle-on.svg'

export function FigPalFollowMeToggle({
  followMouse,
  onToggle,
  label = 'Follow Me!',
}: {
  followMouse: boolean
  onToggle: () => void
  label?: string
}) {
  return (
    <div className="figpal-builder-toggle-wrap">
      <span className="figpal-builder-toggle-label">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={followMouse}
        className="figpal-builder-toggle"
        onClick={onToggle}
      >
        <img
          src={followMouse ? FIGPAL_TOGGLE_ON : FIGPAL_TOGGLE_OFF}
          alt=""
          className="figpal-builder-toggle-img"
          draggable={false}
        />
      </button>
    </div>
  )
}

function getInitialState(): FigPalBuilderState {
  const c = getRandomCharacter()
  const name = getRandomCuteName()
  return {
    characterIndex: c.characterIndex,
    color: c.color,
    expression: c.expression,
    accessoryIndex: 0,
    displayName: name,
    lastSavedName: name,
    userHasSavedName: false,
    followMouse: false,
  }
}

export default function FigPalCharacterBuilder({
  onClose: _onClose,
  onFollowMouseChange,
  initialState,
  onStateChange,
  renderSidebar,
}: FigPalCharacterBuilderProps) {
  const [characterIndex, setCharacterIndex] = useState(initialState?.characterIndex ?? 0)
  const [color, setColor] = useState<ColorType>(initialState?.color ?? 'red')
  const [expression, setExpression] = useState(initialState?.expression ?? 1)
  const [accessoryIndex, setAccessoryIndex] = useState(initialState?.accessoryIndex ?? 0)
  const [followMouse, setFollowMouse] = useState(initialState?.followMouse ?? false)
  const [displayName, setDisplayName] = useState(initialState?.displayName ?? '')
  const [lastSavedName, setLastSavedName] = useState(initialState?.lastSavedName ?? '')
  const [userHasSavedName, setUserHasSavedName] = useState(initialState?.userHasSavedName ?? false)

  const [spec, availableColors] = useMemo(() => {
    const [position, characterName] = CHARACTER_CATALOG[characterIndex]
    const colors = getColorsForCharacterSafe(position, characterName)
    const spec: CharacterSpec = {
      position,
      characterName,
      color: colors.includes(color) ? color : colors[0],
      expression,
    }
    return [spec, colors] as const
  }, [characterIndex, color, expression])

  const characterUrl = getCharacterImageUrl(spec)
  const accessoryOptions = useMemo(
    () => getAccessoryOptions(spec.position),
    [spec.position]
  )
  const accessoryUrl = accessoryIndex < accessoryOptions.length ? accessoryOptions[accessoryIndex] : null

  useEffect(() => {
    if (!initialState) {
      const s = getInitialState()
      setCharacterIndex(s.characterIndex)
      setColor(s.color)
      setExpression(s.expression)
      setAccessoryIndex(s.accessoryIndex)
      setDisplayName(s.displayName)
      setLastSavedName(s.lastSavedName)
      setUserHasSavedName(s.userHasSavedName)
    }
  }, [])

  useEffect(() => {
    onStateChange?.({
      characterIndex,
      color,
      expression,
      accessoryIndex,
      displayName,
      lastSavedName,
      userHasSavedName,
      followMouse,
    })
  }, [characterIndex, color, expression, accessoryIndex, displayName, lastSavedName, userHasSavedName, followMouse, onStateChange])

  useEffect(() => {
    const nameToPass = displayName.trim() || lastSavedName || getRandomCuteName()
    if (followMouse && !displayName.trim() && !lastSavedName) {
      setDisplayName(nameToPass)
      setLastSavedName(nameToPass)
    }
    onFollowMouseChange?.({
      enabled: followMouse,
      characterUrl: followMouse ? characterUrl : '',
      accessoryUrl: followMouse ? accessoryUrl : null,
      displayName: followMouse ? nameToPass : '',
    })
  }, [followMouse, characterUrl, accessoryUrl, displayName, lastSavedName, onFollowMouseChange])

  const cycleAccessory = useCallback(
    (dir: number) => {
      const len = accessoryOptions.length
      setAccessoryIndex((i) => (i + dir + len) % len)
    },
    [accessoryOptions.length]
  )

  const cycleCharacter = useCallback(
    (dir: number) => {
      const len = CHARACTER_CATALOG.length
      setCharacterIndex((i) => (i + dir + len) % len)
      if (!userHasSavedName) {
        const name = getRandomCuteName()
        setDisplayName(name)
        setLastSavedName(name)
      }
    },
    [userHasSavedName]
  )

  const cycleExpression = useCallback((dir: number) => {
    setExpression((e) => {
      const next = e + dir
      if (next < 1) return 9
      if (next > 9) return 1
      return next
    })
  }, [])

  const selectColor = useCallback((c: ColorType) => {
    if (availableColors.includes(c)) setColor(c)
  }, [availableColors])

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setDisplayName(val)
    if (val.trim()) {
      setLastSavedName(val.trim())
      setUserHasSavedName(true)
    }
  }, [])

  const handleNameBlur = useCallback(() => {
    const trimmed = displayName.trim()
    if (!trimmed) {
      const randomName = getRandomCuteName()
      setDisplayName(randomName)
      setLastSavedName(randomName)
      setUserHasSavedName(false)
    } else {
      setLastSavedName(trimmed)
      setDisplayName(trimmed)
    }
  }, [displayName])

  const randomizeSelections = useCallback(() => {
    const charIndex = Math.floor(Math.random() * CHARACTER_CATALOG.length)
    const [position, _characterName] = CHARACTER_CATALOG[charIndex]
    const colors = getColorsForCharacterSafe(position, _characterName)
    const newColor = colors[Math.floor(Math.random() * colors.length)]
    const newExpression = Math.floor(Math.random() * 9) + 1
    const accOpts = getAccessoryOptions(position)
    const accIdx = Math.floor(Math.random() * accOpts.length)
    const name = getRandomCuteName()
    setCharacterIndex(charIndex)
    setColor(newColor)
    setExpression(newExpression)
    setAccessoryIndex(accIdx)
    setDisplayName(name)
    setLastSavedName(name)
    setUserHasSavedName(false)
  }, [])

  const colorPicker = (
    <div className="figpal-builder-colors">
      {availableColors.map((c) => (
        <button
          key={c}
          type="button"
          className={`figpal-builder-color-dot ${color === c ? 'figpal-builder-color-dot--active' : ''}`}
          style={{ backgroundColor: COLOR_HEX[c] }}
          onClick={() => selectColor(c)}
          aria-label={`Select ${c} color`}
          aria-pressed={color === c}
        />
      ))}
    </div>
  )

  const palSection = (
    <div className="figpal-builder-pal-section">
      <div className="figpal-builder-arrows figpal-builder-arrows--left">
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--top"
          onClick={() => cycleAccessory(-1)}
          aria-label="Previous accessory"
        >
          <FigPalArrowMark direction="back" />
        </button>
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--middle"
          onClick={() => cycleExpression(-1)}
          aria-label="Previous expression"
        >
          <FigPalArrowMark direction="back" />
        </button>
      </div>
      <div className="figpal-builder-center">
        <div className="figpal-builder-stage" style={{ backgroundImage: 'url(/figpal/Stage2.png)' }} />
        <div className="figpal-builder-character-wrap">
          <img src={characterUrl} alt="" className="figpal-builder-character" />
          {accessoryUrl && <img src={accessoryUrl} alt="" className="figpal-builder-accessory" />}
        </div>
      </div>
      <div className="figpal-builder-arrows figpal-builder-arrows--right">
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--top"
          onClick={() => cycleAccessory(1)}
          aria-label="Next accessory"
        >
          <FigPalArrowMark direction="forward" />
        </button>
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--middle"
          onClick={() => cycleExpression(1)}
          aria-label="Next expression"
        >
          <FigPalArrowMark direction="forward" />
        </button>
      </div>
    </div>
  )

  const nameRow = (
    <div className={`figpal-builder-name-row ${renderSidebar ? 'figpal-builder-name-row--modal' : ''}`}>
      <button
        type="button"
        className="figpal-builder-arrow figpal-builder-arrow--name"
        onClick={() => cycleCharacter(-1)}
        aria-label="Previous character"
      >
        <FigPalArrowMark direction="back" />
      </button>
      <input
        type="text"
        className={`figpal-builder-name-input ${userHasSavedName ? 'figpal-builder-name-input--saved' : ''}`}
        value={displayName}
        onChange={handleNameChange}
        onBlur={handleNameBlur}
        maxLength={15}
        aria-label="Character name"
        placeholder="Name"
      />
      <div className="figpal-builder-name-row-trailing">
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--name"
          onClick={() => cycleCharacter(1)}
          aria-label="Next character"
        >
          <FigPalArrowMark direction="forward" />
        </button>
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--name figpal-builder-arrow--randomize"
          onClick={randomizeSelections}
          aria-label="Randomize FigPal"
        >
          <FigPalDiceMark />
        </button>
      </div>
    </div>
  )

  const sidebarCtx: FigPalSidebarContext = {
    followMouse,
    setFollowMouse,
  }

  return (
    <div
      className={`figpal-builder${renderSidebar ? ' figpal-builder--split' : ''}`}
      aria-label="FigPal character builder"
    >
      <div className="figpal-builder-col figpal-builder-col--customize">
        {nameRow}
        <div className="figpal-builder-pal-container">{palSection}</div>
        {colorPicker}
        {!renderSidebar && (
          <FigPalFollowMeToggle followMouse={followMouse} onToggle={() => setFollowMouse((v) => !v)} label="Follow Me" />
        )}
      </div>
      {renderSidebar && (
        <div className="figpal-builder-col figpal-builder-col--side">{renderSidebar(sidebarCtx)}</div>
      )}
    </div>
  )
}
