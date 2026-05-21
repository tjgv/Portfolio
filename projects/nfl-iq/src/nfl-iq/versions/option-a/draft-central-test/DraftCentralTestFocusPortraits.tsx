import { useMemo } from 'react'
import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { prospectPortraitUrl } from './prospect-portrait'

type DraftCentralTestFocusPortraitsProps = {
  prospects: DraftBoardProspect[]
  focusedKeys: string[]
  onRemoveFocus: (key: string) => void
}

export function DraftCentralTestFocusPortraits({
  prospects,
  focusedKeys,
  onRemoveFocus,
}: DraftCentralTestFocusPortraitsProps) {
  const focusedPlayers = useMemo(() => {
    const byKey = new Map(
      prospects.map((p) => [prospectStableKey(p), p] as const),
    )
    return focusedKeys
      .map((key) => {
        const prospect = byKey.get(key)
        if (!prospect) return null
        return {
          key,
          name: prospect.name,
          portraitUrl: prospectPortraitUrl(key, prospect.name),
        }
      })
      .filter((x): x is NonNullable<typeof x> => x != null)
  }, [focusedKeys, prospects])

  if (focusedKeys.length === 0) return null

  return (
    <div className="draft-test__portraits" aria-label="Focused players">
      {focusedPlayers.map((player, slotIndex) => (
        <div
          key={player.key}
          className={`draft-test__portrait-card draft-test__portrait-card--slot-${slotIndex}`}
        >
          <div className="draft-test__portrait-photo" aria-hidden>
            <img className="draft-test__portrait-img" src={player.portraitUrl} alt="" />
          </div>
          <button
            type="button"
            className="draft-test__portrait-dismiss"
            aria-label={`Remove ${player.name} from focus`}
            onClick={() => onRemoveFocus(player.key)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
