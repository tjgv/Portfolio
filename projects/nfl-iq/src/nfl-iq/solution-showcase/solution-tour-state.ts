import type { SolutionDefinition, SolutionId, SolutionTourStep } from './solution-definitions'
import { getSolutionDefinition } from './solution-definitions'

/** Intro modal — not an index into `steps`. */
export const SOLUTION_INTRO_STEP_INDEX = -1

/** Outro modal — one past the last feature step when `contextIntro` exists. */
export function getTourOutroStepIndex(def: SolutionDefinition): number {
  return def.steps.length
}

export function isTourIntroStep(stepIndex: number): boolean {
  return stepIndex === SOLUTION_INTRO_STEP_INDEX
}

export function isTourOutroStep(
  def: SolutionDefinition,
  stepIndex: number,
): boolean {
  return Boolean(def.contextIntro) && stepIndex === getTourOutroStepIndex(def)
}

export function isTourFeatureStepIndex(
  def: SolutionDefinition,
  stepIndex: number,
): boolean {
  return stepIndex >= 0 && stepIndex < def.steps.length
}

export function getTourFeatureStep(
  def: SolutionDefinition,
  stepIndex: number,
): SolutionTourStep | undefined {
  if (!isTourFeatureStepIndex(def, stepIndex)) return undefined
  return def.steps[stepIndex]
}

export function getTourFeatureStepForActive(
  solutionId: SolutionId,
  stepIndex: number,
): SolutionTourStep | undefined {
  const def = getSolutionDefinition(solutionId)
  return getTourFeatureStep(def, stepIndex)
}

export function getTourTotalStages(def: SolutionDefinition): number {
  return def.contextIntro
    ? def.steps.length + 2
    : def.steps.length
}
