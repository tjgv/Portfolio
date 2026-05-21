import { Fragment, useMemo, useState } from 'react'
import { ngsTeamLogoUrl } from '../constants'
import { DRAFT_PICKS, type DraftPick } from '../data/draft-data'
import './iq-draft-round-board.css'

const ROUNDS = [1, 2, 3, 4, 5, 6, 7] as const

const COLUMN_RANGES = [
  { min: 1, max: 8 },
  { min: 9, max: 16 },
  { min: 17, max: 24 },
  { min: 25, max: 32 },
] as const

function parsePickLabel(player: string): {
  position: string
  name: string
  school: string
} {
  const match = player.match(/^([A-Z]+(?:\/[A-Z]+)?)\s+(.+),\s*(.+)$/)
  if (match) {
    return { position: match[1], name: match[2], school: match[3] }
  }
  return { position: '', name: player, school: '' }
}

function PickRow({ pick }: { pick: DraftPick }) {
  const { position, name, school } = parsePickLabel(pick.player)
  return (
    <div className="iq-draft-round-row">
      <span className="iq-draft-round-row__num">{pick.pick}</span>
      <span className="iq-draft-round-row__logo">
        <img src={ngsTeamLogoUrl(pick.teamId)} alt="" width={24} height={24} />
      </span>
      <span className="iq-draft-round-row__player">
        {position ? <strong>{position}</strong> : null}
        {position ? ' ' : null}
        {name}
        {school ? `, ${school}` : ''}
      </span>
    </div>
  )
}

export function IqDraftRoundBoard() {
  const [activeRound, setActiveRound] = useState<number>(1)

  const picksForRound = useMemo(() => {
    if (activeRound !== 1) return []
    return [...DRAFT_PICKS].sort((a, b) => a.pick - b.pick)
  }, [activeRound])

  return (
    <div className="iq-draft-widget">
      <div className="iq-draft-round-tabs" role="tablist" aria-label="Draft round">
        {ROUNDS.map((round, index) => (
          <Fragment key={round}>
            {index > 0 ? (
              <span className="iq-draft-round-tabs__divider" aria-hidden />
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={activeRound === round}
              disabled={round > 1}
              className={
                activeRound === round
                  ? 'iq-draft-round-tabs__tab iq-draft-round-tabs__tab--active'
                  : 'iq-draft-round-tabs__tab'
              }
              onClick={() => setActiveRound(round)}
            >
              Round {round}
            </button>
          </Fragment>
        ))}
      </div>

      <div
        className={
          picksForRound.length > 0
            ? 'iq-draft-round-card'
            : 'iq-draft-round-card iq-draft-round-card--empty'
        }
      >
        {picksForRound.length > 0 ? (
          <div className="iq-draft-round-grid">
            {COLUMN_RANGES.map((range) => {
              const columnPicks = picksForRound.filter(
                (p) => p.pick >= range.min && p.pick <= range.max,
              )
              return (
                <div
                  key={`${range.min}-${range.max}`}
                  className="iq-draft-round-col"
                >
                  {columnPicks.map((pick) => (
                    <PickRow key={pick.pick} pick={pick} />
                  ))}
                </div>
              )
            })}
          </div>
        ) : (
          <p className="iq-draft-round-empty">
            Round {activeRound} results will appear here when picks are in.
          </p>
        )}
      </div>
    </div>
  )
}
