import type { CSSProperties } from 'react'
import { GROW_PHASE_END } from './carouselGrowAnimation'
import { clamp01, easeOutCubic, lerp, phaseRange } from './growRevealScrollUtils'
import {
  CAROUSEL_GAP_FINAL,
  CAROUSEL_NAV_CIRCLE,
  CAROUSEL_NAV_FULL,
  PILL_SEED_SIZE,
} from './pillControlSizes'

const SEED_W = PILL_SEED_SIZE
const PLAY_W = PILL_SEED_SIZE
const NAV_CIRCLE = CAROUSEL_NAV_CIRCLE
const NAV_FULL = CAROUSEL_NAV_FULL
const GAP_FINAL = CAROUSEL_GAP_FINAL

const NAV_GROW_START = 0.6
const REVEAL_LAYOUT_END = 0.94

/** Nav + play separation and reveal — carousel only. */
export function computeCarouselRevealVars(openProgress: number): CSSProperties {
  const p = clamp01(openProgress)

  const morph = easeOutCubic(phaseRange(p, GROW_PHASE_END, 0.68))
  const layout = easeOutCubic(phaseRange(p, NAV_GROW_START, REVEAL_LAYOUT_END))
  const gap = lerp(0, GAP_FINAL, layout)
  const navOverlapRight = (SEED_W - NAV_CIRCLE) / 2
  const navWidth = p < NAV_GROW_START ? 0 : lerp(NAV_CIRCLE, NAV_FULL, layout)
  const navRight = p < NAV_GROW_START ? navOverlapRight : lerp(navOverlapRight, PLAY_W + gap, layout)
  const clusterWidth = p < NAV_GROW_START ? SEED_W : Math.max(SEED_W, navWidth + gap + PLAY_W)
  const uiOpacity = easeOutCubic(phaseRange(p, 0.8, 0.86))

  return {
    '--aap-morph': morph,
    '--aap-nav-width': `${navWidth}px`,
    '--aap-cluster-width': `${clusterWidth}px`,
    '--aap-nav-right': `${navRight}px`,
    '--aap-ui-opacity': uiOpacity,
    '--aap-gap': `${gap}px`,
  } as CSSProperties
}
