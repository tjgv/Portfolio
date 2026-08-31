import type { CSSProperties } from 'react'
import { GROW_PHASE_END, PULSE_RETRACT_START } from './carouselGrowAnimation'
import { clamp01, easeOutCubic, lerp, phaseRange } from './growRevealScrollUtils'

const ICON_PEAK_SCALE = 1.38
const ICON_BOUNCE_SPAN = 0.1

export const ICON_BOUNCE_END = GROW_PHASE_END + ICON_BOUNCE_SPAN
export const MODAL_CLOSE_REVEAL_START = GROW_PHASE_END

export type ModalCloseRevealResult = {
  style: CSSProperties
  iconScale: number
  iconVisible: boolean
}

function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

/** Icon grows with blue pulse retract, then bounces to resting size. */
export function computeModalCloseRevealVars(openProgress: number): ModalCloseRevealResult {
  const p = clamp01(openProgress)
  const iconVisible = p >= PULSE_RETRACT_START

  let iconScale = 0
  if (p < PULSE_RETRACT_START) {
    iconScale = 0
  } else if (p < GROW_PHASE_END) {
    const retract = easeOutCubic(phaseRange(p, PULSE_RETRACT_START, GROW_PHASE_END))
    iconScale = retract * ICON_PEAK_SCALE
  } else if (p < ICON_BOUNCE_END) {
    const bounce = easeOutBack(phaseRange(p, GROW_PHASE_END, ICON_BOUNCE_END))
    iconScale = lerp(ICON_PEAK_SCALE, 1, bounce)
  } else {
    iconScale = 1
  }

  return {
    iconScale,
    iconVisible,
    style: {
      '--modal-close-icon-scale': iconScale,
    } as CSSProperties,
  }
}
