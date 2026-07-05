/** Grow orb animation — grey seed + blue pulse. Reusable across carousel / learn-more. */

export const GROW_SEED_COLOR = '#3E4555'

/** Hold at pulse peak before retract (fraction of full open progress; ~250ms at 5200ms open anim). */
export const PULSE_HOLD_PROGRESS = 250 / 5200

/** Quick seed zoom + rise from viewport bottom (fraction of open timeline). */
const SEED_GROW_END = 0.09
/** Seed rests this far above cluster center (vh). */
const SEED_Y_END_VH = -2.8
/** Seed starts this far below rest — near viewport bottom. */
const SEED_Y_START_VH = 24

const PULSE_EXPAND_START = SEED_GROW_END
const PULSE_EXPAND_END = PULSE_EXPAND_START + 0.3
const PULSE_EXPAND_DURATION = PULSE_EXPAND_END - PULSE_EXPAND_START
/** Retract runs at 2× the speed of expand (half the progress span). */
const PULSE_RETRACT_DURATION = PULSE_EXPAND_DURATION / 2
export const PULSE_RETRACT_START = PULSE_EXPAND_END + PULSE_HOLD_PROGRESS

/** End of grow phase on the 0→1 open timeline (includes pulse hold). */
export const GROW_PHASE_END = PULSE_RETRACT_START + PULSE_RETRACT_DURATION

/** Progress below which only the grow orb runs (reveal starts at/above this). */
export const REVEAL_PHASE_START = 0.54

export type GrowOrbVars = {
  '--grow-seed-color': string
  '--grow-seed-scale': number
  '--grow-seed-y': string
  '--grow-seed-opacity': number
  '--grow-seed-blur': string
  '--grow-pulse-out-scale': number
  '--grow-pulse-out-opacity': number
  '--grow-pulse-in-scale': number
  '--grow-pulse-in-opacity': number
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function phaseRange(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0
  return clamp01((progress - start) / (end - start))
}

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4
}

/** Heavy ease-out for the seed entrance. */
function easeOutHeavy(t: number): number {
  return 1 - (1 - t) ** 5
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Grow phase (0 → GROW_PHASE_END):
 * 1. Grey seed zooms 0→full scale, rises from viewport bottom — heavy ease-out
 * 2. Blue pulse expands — opacity 35% → 100% at peak
 * 3. Blue pulse holds ~250ms
 * 4. Blue pulse retracts at 2× expand speed
 */
export function computeGrowOrbVars(progress: number): GrowOrbVars {
  const p = clamp01(progress)

  const seedGrow = easeOutHeavy(phaseRange(p, 0, SEED_GROW_END))
  const seedScale = seedGrow
  const seedY = lerp(SEED_Y_START_VH, SEED_Y_END_VH, seedGrow)
  const seedOpacity = seedGrow

  const pulseOut = easeOutQuart(phaseRange(p, PULSE_EXPAND_START, PULSE_EXPAND_END))
  const pulseOutScale = lerp(1, 2.15, pulseOut)
  const pulseOutOpacity = lerp(0.35, 1, pulseOut)

  const pulseIn = easeOutQuart(phaseRange(p, PULSE_RETRACT_START, GROW_PHASE_END))
  const pulseInScale = lerp(2.15, 1, pulseIn)
  const pulseInOpacity = pulseIn > 0 ? 1 : 0

  const showPulseOut = p >= PULSE_EXPAND_START && p < PULSE_RETRACT_START
  const showPulseIn = p >= PULSE_RETRACT_START && p < GROW_PHASE_END

  return {
    '--grow-seed-color': GROW_SEED_COLOR,
    '--grow-seed-scale': seedScale,
    '--grow-seed-y': `${seedY}vh`,
    '--grow-seed-opacity': seedOpacity,
    '--grow-seed-blur': '0px',
    '--grow-pulse-out-scale': pulseOutScale,
    '--grow-pulse-out-opacity': showPulseOut ? pulseOutOpacity : 0,
    '--grow-pulse-in-scale': pulseInScale,
    '--grow-pulse-in-opacity': showPulseIn ? pulseInOpacity : 0,
  }
}

export function growOrbStyle(vars: GrowOrbVars): Record<string, string | number> {
  return vars
}

/** Frozen post-grow orb for close — no pulse reverse, fades via multiplier. */
export function computeGrowOrbClose(fade: number): GrowOrbVars {
  const base = computeGrowOrbVars(GROW_PHASE_END)
  const opacity = (base['--grow-seed-opacity'] as number) * clamp01(fade)
  return {
    ...base,
    '--grow-seed-opacity': opacity,
    '--grow-pulse-out-opacity': 0,
    '--grow-pulse-in-opacity': 0,
  }
}

/** Fade current grow state on early close — pulses hidden, no reverse scrub. */
export function computeGrowOrbFade(progress: number, fade: number): GrowOrbVars {
  const base = computeGrowOrbVars(progress)
  const opacity = (base['--grow-seed-opacity'] as number) * clamp01(fade)
  return {
    ...base,
    '--grow-seed-opacity': opacity,
    '--grow-pulse-out-opacity': 0,
    '--grow-pulse-in-opacity': 0,
  }
}
