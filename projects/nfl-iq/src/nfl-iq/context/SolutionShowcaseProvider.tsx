import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSolutionDefinition,
  type SolutionId,
} from '../solution-showcase/solution-definitions'
import { SolutionShowcaseContext } from './solution-showcase-context'

export const SOLUTION_INTRO_STEP_INDEX = -1

export function SolutionShowcaseProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [activeSolutionId, setActiveSolutionId] = useState<SolutionId | null>(
    null,
  )
  const [stepIndex, setStepIndex] = useState(0)

  const goToStep = useCallback(
    (solutionId: SolutionId, index: number) => {
      const def = getSolutionDefinition(solutionId)
      const step = def.steps[index]
      if (!step) return
      const path = step.search
        ? `${step.route}${step.search.startsWith('?') ? step.search : `?${step.search}`}`
        : step.route
      navigate(path)
      setStepIndex(index)
    },
    [navigate],
  )

  const goToIntro = useCallback(
    (solutionId: SolutionId) => {
      const def = getSolutionDefinition(solutionId)
      if (!def.contextIntro) return
      navigate(def.contextIntro.route ?? '/')
      setStepIndex(SOLUTION_INTRO_STEP_INDEX)
    },
    [navigate],
  )

  const startSolution = useCallback(
    (id: SolutionId) => {
      setActiveSolutionId(id)
      const def = getSolutionDefinition(id)
      if (def.contextIntro) {
        goToIntro(id)
      } else {
        goToStep(id, 0)
      }
    },
    [goToIntro, goToStep],
  )

  const stopSolution = useCallback(() => {
    setActiveSolutionId(null)
    setStepIndex(0)
  }, [])

  const nextStep = useCallback(() => {
    if (!activeSolutionId) return
    const def = getSolutionDefinition(activeSolutionId)

    if (stepIndex === SOLUTION_INTRO_STEP_INDEX) {
      goToStep(activeSolutionId, 0)
      return
    }

    const next = stepIndex + 1
    if (next >= def.steps.length) {
      stopSolution()
      return
    }
    goToStep(activeSolutionId, next)
  }, [activeSolutionId, stepIndex, goToStep, stopSolution])

  const prevStep = useCallback(() => {
    if (!activeSolutionId) return
    const def = getSolutionDefinition(activeSolutionId)

    if (stepIndex === 0 && def.contextIntro) {
      goToIntro(activeSolutionId)
      return
    }

    if (stepIndex <= 0) return
    goToStep(activeSolutionId, stepIndex - 1)
  }, [activeSolutionId, stepIndex, goToIntro, goToStep])

  const value = useMemo(
    () => ({
      activeSolutionId,
      stepIndex,
      startSolution,
      stopSolution,
      nextStep,
      prevStep,
    }),
    [activeSolutionId, stepIndex, startSolution, stopSolution, nextStep, prevStep],
  )

  return (
    <SolutionShowcaseContext.Provider value={value}>
      {children}
    </SolutionShowcaseContext.Provider>
  )
}
