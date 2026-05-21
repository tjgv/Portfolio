import { useSolutionShowcase } from '../context/useSolutionShowcase'
import { DraftCentralHoverPreviewDemo } from '../versions/option-a/draft-central-test/DraftCentralHoverPreviewDemo'
import { getTourFeatureStepForActive } from './solution-tour-state'

export function SolutionTourHoverPreview() {
  const { activeSolutionId, stepIndex } = useSolutionShowcase()

  const step =
    activeSolutionId != null
      ? getTourFeatureStepForActive(activeSolutionId, stepIndex)
      : undefined

  const showHoverPreview = Boolean(step?.showHoverPreview)

  return <DraftCentralHoverPreviewDemo visible={showHoverPreview} />
}
