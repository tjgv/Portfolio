import { useLayoutEffect } from 'react'
import { useIqTeam } from '../context/useIqTeam'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import { getTourFeatureStepForActive } from './solution-tour-state'

/** Applies tour step teamPrepare on feature steps only (not intro/outro). */
export function SolutionTourTeamPrepare() {
  const { activeSolutionId, stepIndex } = useSolutionShowcase()
  const { setSelectedTeam } = useIqTeam()

  useLayoutEffect(() => {
    if (!activeSolutionId) return

    const step = getTourFeatureStepForActive(activeSolutionId, stepIndex)
    if (!step?.teamPrepare) return

    if (step.teamPrepare === 'deselect') {
      setSelectedTeam(null)
      return
    }

    setSelectedTeam(step.teamPrepare.select)
  }, [activeSolutionId, stepIndex, setSelectedTeam])

  return null
}
