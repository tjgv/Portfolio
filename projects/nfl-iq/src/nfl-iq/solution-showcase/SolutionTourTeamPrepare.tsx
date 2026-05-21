import { useLayoutEffect } from 'react'
import { useIqTeam } from '../context/useIqTeam'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import { getSolutionDefinition } from './solution-definitions'

/** Applies tour step teamPrepare on every route (including Team Central). */
export function SolutionTourTeamPrepare() {
  const { activeSolutionId, stepIndex } = useSolutionShowcase()
  const { setSelectedTeam } = useIqTeam()

  useLayoutEffect(() => {
    if (!activeSolutionId || stepIndex < 0) return

    const step = getSolutionDefinition(activeSolutionId).steps[stepIndex]
    if (!step?.teamPrepare) return

    if (step.teamPrepare === 'deselect') {
      setSelectedTeam(null)
      return
    }

    setSelectedTeam(step.teamPrepare.select)
  }, [activeSolutionId, stepIndex, setSelectedTeam])

  return null
}
