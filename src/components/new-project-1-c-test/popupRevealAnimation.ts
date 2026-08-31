import type { CSSProperties } from 'react'
import { GROW_PHASE_END } from './carouselGrowAnimation'
import { clamp01, easeOutCubic, lerp, phaseRange } from './growRevealScrollUtils'
import {
  CAROUSEL_NAV_CIRCLE,
  PILL_ACTION_SIZE,
  PILL_INNER_GAP,
  PILL_PAD,
  PILL_SEED_SIZE,
  PILL_TEXT_SLIDE_DEFAULT,
  PILL_WIDTH_FALLBACK,
} from './pillControlSizes'

export const POPUP_SHELL_BG = '#3e4555'

const SEED_SIZE = PILL_SEED_SIZE
const PILL_H = CAROUSEL_NAV_CIRCLE
const ACTION_SIZE = PILL_ACTION_SIZE
const TEXT_SLIDE_PX = PILL_TEXT_SLIDE_DEFAULT

/** Morph handoff — after full grow orb sequence (matches carousel). */
const REVEAL_START = GROW_PHASE_END
/** + button fades in (matches carousel UI fade window). */
const BTN_FADE_END = 0.86
/** Pill expands; label slides out left behind the button. */
const EXPAND_START = GROW_PHASE_END
const EXPAND_END = 0.94

/** Don't pull label into flex until the shell has room to grow. */
export const POPUP_EXPAND_LAYOUT_START = 0.12

const PILL_PAD_CENTER = (SEED_SIZE - ACTION_SIZE) / 2

export type PopupRevealResult = {
  style: CSSProperties
  expand: number
  btnOpacity: number
}

/**
 * Reveal sequence after grow handoff:
 * 1. Grey pill shell + button fade in (seed-sized circle, label out of layout)
 * 2. Pill width grows; label slides left from behind the button
 */
export function computePopupRevealVars(
  openProgress: number,
  pillTargetWidth = PILL_WIDTH_FALLBACK
): PopupRevealResult {
  const p = clamp01(openProgress)
  const targetW = Math.max(SEED_SIZE, pillTargetWidth)

  const btnFade = easeOutCubic(phaseRange(p, REVEAL_START, BTN_FADE_END))
  const expand = easeOutCubic(phaseRange(p, EXPAND_START, EXPAND_END))
  const glass = expand

  const pillWidth = p < EXPAND_START ? SEED_SIZE : lerp(SEED_SIZE, targetW, expand)
  const pillHeight = p < EXPAND_START ? SEED_SIZE : lerp(SEED_SIZE, PILL_H, glass)

  const padLeft = expand > 0 ? lerp(PILL_PAD_CENTER, 30, expand) : PILL_PAD_CENTER
  const padRight = expand > 0 ? lerp(PILL_PAD_CENTER, PILL_PAD / 2, expand) : PILL_PAD_CENTER

  return {
    expand,
    btnOpacity: btnFade,
    style: {
      '--popup-pill-width': `${pillWidth}px`,
      '--popup-pill-target-width': `${targetW}px`,
      '--popup-pill-height': `${pillHeight}px`,
      '--popup-action-size': `${ACTION_SIZE}px`,
      '--popup-pad-left': `${padLeft}px`,
      '--popup-pad-right': `${padRight}px`,
      '--popup-pill-gap': `${lerp(0, PILL_INNER_GAP, expand)}px`,
      '--popup-glass': glass,
      '--popup-btn-opacity': btnFade,
      '--popup-text-opacity': expand,
      '--popup-text-slide-x': `${lerp(TEXT_SLIDE_PX, 0, expand)}px`,
      '--popup-expand': expand,
    } as CSSProperties,
  }
}

export const POPUP_REVEAL_START = REVEAL_START
export const POPUP_GROW_PHASE_END = GROW_PHASE_END
