import { useSolutionShowcase } from '../context/useSolutionShowcase'
import { DraftCentralHoverPreviewDemo } from '../versions/option-a/draft-central-test/DraftCentralHoverPreviewDemo'
import { getSolutionDefinition } from './solution-definitions'

export function SolutionTourHoverPreview() {
  const { activeSolutionId, stepIndex } = useSolutionShowcase()

  const showHoverPreview =
    activeSolutionId != null &&
    stepIndex >= 0 &&
    Boolean(
      getSolutionDefinition(activeSolutionId).steps[stepIndex]?.showHoverPreview,
    )

  return <DraftCentralHoverPreviewDemo visible={showHoverPreview} />
}
