import { useCallback, useEffect, useMemo, useState } from 'react'
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

interface FigPalCharacterBuilderProps {
  onClose: () => void
  onFollowMouseChange?: (state: FigPalFollowState) => void
  initialState?: FigPalBuilderState | null
  onStateChange?: (state: FigPalBuilderState) => void
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

  const ArrowSvgLeft = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
  const ArrowSvgRight = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )

  return (
    <div className="figpal-builder" role="dialog" aria-modal="true" aria-label="FigPal character builder">
      {/* Name row: left char arrow | input | right char arrow */}
      <div className="figpal-builder-name-row">
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--name"
          onClick={() => cycleCharacter(-1)}
          aria-label="Previous character"
        >
          <ArrowSvgLeft />
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
        <button
          type="button"
          className="figpal-builder-arrow figpal-builder-arrow--name"
          onClick={() => cycleCharacter(1)}
          aria-label="Next character"
        >
          <ArrowSvgRight />
        </button>
      </div>

      {/* Light grey container: figpal + arrows only (no colors, no name) */}
      <div className="figpal-builder-pal-container">
        <div className="figpal-builder-pal-section">
          {/* Left arrows: accessory top, expression middle (no character) */}
          <div className="figpal-builder-arrows figpal-builder-arrows--left">
            <button
              type="button"
              className="figpal-builder-arrow figpal-builder-arrow--top"
              onClick={() => cycleAccessory(-1)}
              aria-label="Previous accessory"
            >
              <ArrowSvgLeft />
            </button>
            <button
              type="button"
              className="figpal-builder-arrow figpal-builder-arrow--middle"
              onClick={() => cycleExpression(-1)}
              aria-label="Previous expression"
            >
              <ArrowSvgLeft />
            </button>
          </div>

          {/* Center: character above stage */}
          <div className="figpal-builder-center">
            <div className="figpal-builder-stage" style={{ backgroundImage: 'url(/figpal/Stage2.png)' }} />
            <div className="figpal-builder-character-wrap">
              <img src={characterUrl} alt="" className="figpal-builder-character" />
              {accessoryUrl && (
                <img src={accessoryUrl} alt="" className="figpal-builder-accessory" />
              )}
            </div>
          </div>

          {/* Right arrows: accessory top, expression middle */}
          <div className="figpal-builder-arrows figpal-builder-arrows--right">
            <button
              type="button"
              className="figpal-builder-arrow figpal-builder-arrow--top"
              onClick={() => cycleAccessory(1)}
              aria-label="Next accessory"
            >
              <ArrowSvgRight />
            </button>
            <button
              type="button"
              className="figpal-builder-arrow figpal-builder-arrow--middle"
              onClick={() => cycleExpression(1)}
              aria-label="Next expression"
            >
              <ArrowSvgRight />
            </button>
          </div>
        </div>
      </div>

      {/* Colors – below grey container */}
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

      {/* Follow mouse toggle */}
      <div className="figpal-builder-toggle-wrap">
        <span className="figpal-builder-toggle-label">Follow Me</span>
        <button
          type="button"
          role="switch"
          aria-checked={followMouse}
          className={`figpal-builder-toggle ${followMouse ? 'figpal-builder-toggle--on' : ''}`}
          onClick={() => setFollowMouse((v) => !v)}
        >
          <span className="figpal-builder-toggle-track" />
          <span className="figpal-builder-toggle-thumb" />
        </button>
      </div>
    </div>
  )
}
