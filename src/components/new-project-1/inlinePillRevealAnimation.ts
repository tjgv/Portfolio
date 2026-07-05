import type { CSSProperties } from 'react'
import { clamp01, easeOutCubic, lerp, phaseRange } from './growRevealScrollUtils'
import { POPUP_SHELL_BG } from './popupRevealAnimation'
import {
  INLINE_PILL_ACTION_SIZE,
  INLINE_PILL_SEED_SIZE,
  INLINE_PILL_WIDTH_FALLBACK,
} from './inlinePillSizes'

const SEED_SIZE = INLINE_PILL_SEED_SIZE
const ACTION_SIZE = INLINE_PILL_ACTION_SIZE

const BTN_GROW_END = 0.38
const SHELL_RGB = '62, 69, 85'

export const INLINE_PILL_READY_PROGRESS = 1

export type InlinePillRevealResult = {
  style: CSSProperties
  btnScale: number
  ready: boolean
}

/**
 * Inline pill reveal sequence:
 * 1. Blue button scales 0 → full (no grey shell)
 * 2. Grey shell expands right; label slides out from under the button
 */
export function computeInlinePillRevealVars(
  progress: number,
  pillTargetWidth = INLINE_PILL_WIDTH_FALLBACK
): InlinePillRevealResult {
  const p = clamp01(progress)
  const targetW = Math.max(SEED_SIZE, pillTargetWidth)

  const btnGrow = easeOutCubic(phaseRange(p, 0, BTN_GROW_END))
  const btnScale = p >= BTN_GROW_END ? 1 : btnGrow

  const expand = easeOutCubic(phaseRange(p, BTN_GROW_END, 1))
  const pillWidth = p < BTN_GROW_END ? SEED_SIZE : lerp(SEED_SIZE, targetW, expand)
  const textSlide = lerp(-ACTION_SIZE * 0.45, 0, expand)
  const shellAlpha = p >= BTN_GROW_END ? expand : 0

  return {
    btnScale,
    ready: p >= INLINE_PILL_READY_PROGRESS,
    style: {
      '--inline-pill-shell-bg': POPUP_SHELL_BG,
      '--inline-pill-shell-alpha': shellAlpha,
      '--inline-pill-btn-scale': btnScale,
      '--inline-pill-expand': expand,
      '--inline-pill-width': `${pillWidth}px`,
      '--inline-pill-target-width': `${targetW}px`,
      '--inline-pill-text-slide': `${textSlide}px`,
      '--inline-pill-shell-bg-rgb': SHELL_RGB,
    } as CSSProperties,
  }
}
