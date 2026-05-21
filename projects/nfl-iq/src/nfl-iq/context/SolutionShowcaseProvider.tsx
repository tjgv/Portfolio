import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getSolutionDefinition,
  type SolutionId,
} from '../solution-showcase/solution-definitions'
import {
  getTourOutroStepIndex,
  isTourIntroStep,
  SOLUTION_INTRO_STEP_INDEX,
} from '../solution-showcase/solution-tour-state'
import { SolutionShowcaseContext } from './solution-showcase-context'

export { SOLUTION_INTRO_STEP_INDEX }

export function SolutionShowcaseProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [activeSolutionId, setActiveSolutionId] = useState<SolutionId | null>(
    null,
  )
  const [stepIndex, setStepIndex] = useState(0)

  const goToStep = useCallback(
    (solutionId: SolutionId, index: number) => {
      const def = getSolutionDefinition(solutionId)
      if (index < 0 || index >= def.steps.length) return
      const step = def.steps[index]
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

  const goToOutro = useCallback((solutionId: SolutionId) => {
    const def = getSolutionDefinition(solutionId)
    if (!def.contextIntro) return
    setStepIndex(getTourOutroStepIndex(def))
  }, [])

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

    if (isTourIntroStep(stepIndex)) {
      goToStep(activeSolutionId, 0)
      return
    }

    if (stepIndex >= 0 && stepIndex < def.steps.length - 1) {
      goToStep(activeSolutionId, stepIndex + 1)
      return
    }

    if (stepIndex === def.steps.length - 1 && def.contextIntro) {
      goToOutro(activeSolutionId)
      return
    }

    if (isTourIntroStep(stepIndex) || stepIndex === getTourOutroStepIndex(def)) {
      stopSolution()
      return
    }

    stopSolution()
  }, [activeSolutionId, stepIndex, goToStep, goToOutro, stopSolution])

  const prevStep = useCallback(() => {
    if (!activeSolutionId) return
    const def = getSolutionDefinition(activeSolutionId)
    const outroIndex = getTourOutroStepIndex(def)

    if (stepIndex === outroIndex && def.contextIntro) {
      goToStep(activeSolutionId, def.steps.length - 1)
      return
    }

    if (stepIndex === 0 && def.contextIntro) {
      goToIntro(activeSolutionId)
      return
    }

    if (stepIndex > 0) {
      goToStep(activeSolutionId, stepIndex - 1)
    }
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
