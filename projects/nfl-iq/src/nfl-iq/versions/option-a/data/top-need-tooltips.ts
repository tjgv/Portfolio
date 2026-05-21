import type { TopNeedTag } from './team-spending.mock'
import { formatPositionLabel } from './position-names'

export function getTopNeedTooltip(tag: TopNeedTag): string {
  const label = formatPositionLabel(tag.pos, 'full', tag.status === 'critical')
  switch (tag.status) {
    case 'done':
      return `${label}: Need addressed — roster depth is sufficient for this position.`
    case 'partial':
      return `${label}: Partially addressed — still building depth or evaluating options.`
    case 'need':
      return `${label}: Open need — priority target in free agency.`
    case 'critical':
      return `${label}: Critical need — high-priority gap to fill before the season.`
  }
}
