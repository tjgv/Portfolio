/**
 * FigPal character builder config – asset paths and catalog
 * Characters: position (top|bottom|left|right) + name + color + expression (1–9)
 * Accessories: position-matched, layer over character
 */

/** Cute names for FigPal characters (user-display name, not from asset files) */
export const CUTE_NON_HUMAN_NAMES = [
  'Pip', 'Bumble', 'Fidget', 'Snuggs', 'Willow', 'Cricket', 'Button', 'Puddle',
  'Gizmo', 'Noodle', 'Sprout', 'Mochi', 'Ziggy', 'Trixie', 'Fig', 'Barnaby',
  'Pipkin', 'Waffles', 'Sprocket', 'Bramble',
]

export function getRandomCuteName(): string {
  return CUTE_NON_HUMAN_NAMES[Math.floor(Math.random() * CUTE_NON_HUMAN_NAMES.length)]
}

export type PositionType = 'top' | 'bottom' | 'left' | 'right'
export type ColorType =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'grey'
  | 'black'
  | 'peach'

const FIGPAL_BASE = '/figpal'
const SVG_CHARACTERS_BASE = `${FIGPAL_BASE}/SVG Characters`
const SVG_ACCESSORIES_BASE = `${FIGPAL_BASE}/SVG Accessories`

// Position folder names (note: "Left Chatacters" has typo in source)
const POSITION_FOLDERS: Record<PositionType, string> = {
  top: 'Top Characters',
  bottom: 'Bottom Characters',
  left: 'Left Chatacters',
  right: 'Right Characters',
}

// All colors (peach only for fruit character)
export const COLORS: ColorType[] = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'grey',
  'black',
]

// Placeholder hex for color picker circles
export const COLOR_HEX: Record<ColorType, string> = {
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green: '#22c55e',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  grey: '#6b7280',
  black: '#1f2937',
  peach: '#fbbf24',
}

// Character catalog: [position, characterName][] – deterministic order for cycling
// Built from: Top (alphabetical), Bottom, Left, Right
export const CHARACTER_CATALOG: [PositionType, string][] = [
  ['top', 'boba'],
  ['top', 'cloud'],
  ['top', 'egg'],
  ['top', 'elephant'],
  ['top', 'fish'],
  ['top', 'frog'],
  ['top', 'fruit'],
  ['top', 'onigiri'],
  ['top', 'pizza'],
  ['top', 'poop'],
  ['top', 'pufferfish'],
  ['top', 'sushi'],
  ['bottom', 'cat'],
  ['bottom', 'dog'],
  ['left', 'Snake'],
  ['right', 'Snail'],
]

// Accessory names (same for all positions) – exclude 1–9.png (expression files if any)
const ACCESSORY_NAMES = [
  'Angry',
  'Antennae',
  'BeigeHat',
  'BlueHat',
  'Candle',
  'Excitement',
  'Flower',
  'GrayHat',
  'GreenBeanie',
  'Halo',
  'Heart',
  'Lightbulb',
  'PartyHat',
  'PinkBeanie',
  'PropellerHat',
  'Question',
  'RedBeanie',
  'Sparkle',
  'Sprout',
  'Sweat',
  'Thinking',
  'Tophat',
  'WitchHat',
  'WizardHat',
]

// SVG Accessories: {Position}/{Subfolder}/{name}/XL.svg – subfolder matches position
const ACCESSORY_POSITION_SUBFOLDERS: Record<PositionType, string> = {
  top: 'Top',
  bottom: 'Bottom',
  left: 'Left',
  right: 'Right',
}

// Characters that use flat format: name/color/XL.png (onigiri - no expression in path)
const FLAT_PATH_CHARACTERS = new Set(['onigiri'])
// Dog: use XL PNGs at Characters/Bottom Characters/ (224×257); small pngs at dog/color/expr.png are 48×55
const DOG_XL_CHARACTERS = new Set(['dog'])

export interface CharacterSpec {
  position: PositionType
  characterName: string
  color: ColorType
  expression: number
}

/** Resolve character image path. SVG when available; dog uses XL PNGs for crisp display. */
export function getCharacterImageUrl(spec: CharacterSpec): string {
  const posFolder = POSITION_FOLDERS[spec.position]
  const charName = spec.characterName
  const color = spec.color
  const expr = spec.expression

  if (DOG_XL_CHARACTERS.has(charName)) {
    const colorIdx = Math.max(0, COLORS.indexOf(color))
    const exprClamped = Math.max(1, Math.min(7, expr))
    const idx = colorIdx * 7 + (exprClamped - 1)
    const file = idx === 0 ? 'XL.png' : `XL-${idx}.png`
    return `${FIGPAL_BASE}/Characters/${posFolder}/${file}`
  }
  if (FLAT_PATH_CHARACTERS.has(charName)) {
    // Onigiri etc.: variants are XL.svg, XL-1.svg … XL-7.svg in the color folder (no /expr/ subfolder)
    const v = (expr - 1) % 8
    const file = v === 0 ? 'XL.svg' : `XL-${v}.svg`
    return `${SVG_CHARACTERS_BASE}/${posFolder}/${charName}/${color}/${file}`
  }
  return `${SVG_CHARACTERS_BASE}/${posFolder}/${charName}/${color}/${expr}/XL.svg`
}

/** Get accessory image URL (SVG). SVG Accessories/{Position}/{Subfolder}/{name}/XL.svg */
export function getAccessoryImageUrl(
  position: PositionType,
  accessoryIndex: number
): string | null {
  if (accessoryIndex < 0) return null
  const names = ACCESSORY_NAMES
  if (accessoryIndex >= names.length) return null
  const folder = folderForPosition(position)
  const subfolder = ACCESSORY_POSITION_SUBFOLDERS[position]
  const name = names[accessoryIndex]
  return `${SVG_ACCESSORIES_BASE}/${folder}/${subfolder}/${name}/XL.svg`
}

function folderForPosition(position: PositionType): string {
  return { top: 'Top', bottom: 'Bottom', left: 'Left', right: 'Right' }[position]
}

/** Get all accessory URLs for a position (including "none" as first) */
export function getAccessoryOptions(position: PositionType): (string | null)[] {
  const opts: (string | null)[] = [null] // none first
  for (let i = 0; i < ACCESSORY_NAMES.length; i++) {
    const url = getAccessoryImageUrl(position, i)
    if (url) opts.push(url)
  }
  return opts
}

/** Pick random character from catalog, with random color from available */
export function getRandomCharacter(): {
  characterIndex: number
  color: ColorType
  expression: number
} {
  const charIndex = Math.floor(Math.random() * CHARACTER_CATALOG.length)
  const [pos, name] = CHARACTER_CATALOG[charIndex]
  const colorsForChar = getColorsForCharacter(pos, name)
  const color = colorsForChar[Math.floor(Math.random() * colorsForChar.length)]
  const expression = 1
  return { characterIndex: charIndex, color, expression }
}

/** Colors available for a character (fruit has peach instead of pink) */
function getColorsForCharacter(_position: PositionType, name: string): ColorType[] {
  if (name === 'fruit') {
    return ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey', 'black', 'peach']
  }
  return COLORS.filter((c) => c !== 'peach')
}

export function getColorsForCharacterSafe(position: PositionType, name: string): ColorType[] {
  return getColorsForCharacter(position, name)
}
