import { createContext } from 'react'
import type { SolutionId } from '../solution-showcase/solution-definitions'

export type SolutionShowcaseContextValue = {
  activeSolutionId: SolutionId | null
  stepIndex: number
  startSolution: (id: SolutionId) => void
  stopSolution: () => void
  nextStep: () => void
  prevStep: () => void
}

export const SolutionShowcaseContext =
  createContext<SolutionShowcaseContextValue | null>(null)
