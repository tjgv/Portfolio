import type { DraftBoardProspect } from '../../../types'
import {
  getDivisionRivals,
  hashTeamSeed,
  mulberry32,
  shuffle,
} from './big-board-team-view'

export const DRAFT_CENTRAL_NEED_POSITION_COUNT = 5
export const DRAFT_CENTRAL_NEED_TOP_PER_POSITION = 7

export type DraftCentralTeamNeedsLayout = {
  gotTeamIdByProspectKey: Map<string, string>
  rivalTeamIdByProspectKey: Map<string, string>
}

export function draftCentralProspectKey(p: DraftBoardProspect): string {
  return `${p.name}\u001f${String(p.djRank ?? '')}\u001f${p.position}`
}

export type DraftCentralFirstNeedLogo = {
  column: 'got' | 'rivals'
  prospectKey: string
}

/** First row (in display order) with a logo in the Got or Rivals column. */
export function findFirstGotOrRivalsLogo(
  rows: DraftBoardProspect[],
  layout: DraftCentralTeamNeedsLayout | null,
): DraftCentralFirstNeedLogo | null {
  if (!layout) return null

  for (const p of rows) {
    const prospectKey = draftCentralProspectKey(p)
    if (layout.gotTeamIdByProspectKey.get(prospectKey)) {
      return { column: 'got', prospectKey }
    }
    if (layout.rivalTeamIdByProspectKey.get(prospectKey)) {
      return { column: 'rivals', prospectKey }
    }
  }
  return null
}

function computePositionStarProspects(
  seedKey: string,
  prospects: DraftBoardProspect[],
): Set<string> {
  const starKeys = new Set<string>()

  const positionPool = [
    ...new Set(
      prospects
        .filter((p) => p.djRank != null)
        .map((p) => p.position),
    ),
  ]
  if (positionPool.length === 0) return starKeys

  const rng = mulberry32(hashTeamSeed(seedKey))
  const needPositions = shuffle(positionPool, rng).slice(
    0,
    Math.min(DRAFT_CENTRAL_NEED_POSITION_COUNT, positionPool.length),
  )

  needPositions.forEach((position) => {
    const atPosition = prospects
      .filter((p) => p.position === position && p.djRank != null)
      .sort((a, b) => (a.djRank ?? 999) - (b.djRank ?? 999))
      .slice(0, DRAFT_CENTRAL_NEED_TOP_PER_POSITION)

    if (atPosition.length === 0) return

    const starIndex = Math.floor(rng() * atPosition.length)
    starKeys.add(draftCentralProspectKey(atPosition[starIndex]))
  })

  return starKeys
}

function pickOneRivalTeam(
  ownerTeamId: string,
  prospectKey: string,
  rivalIds: string[],
): string {
  if (rivalIds.length === 1) return rivalIds[0]
  const sorted = [...rivalIds].sort((a, b) => a.localeCompare(b))
  const rng = mulberry32(hashTeamSeed(`dc-rival-pick:${ownerTeamId}:${prospectKey}`))
  return sorted[Math.floor(rng() * sorted.length)]
}

export function computeDraftCentralTeamNeeds(
  teamId: string,
  prospects: DraftBoardProspect[],
): DraftCentralTeamNeedsLayout {
  const gotTeamIdByProspectKey = new Map<string, string>()
  const rivalTeamIdByProspectKey = new Map<string, string>()

  const gotStars = computePositionStarProspects(`dc-needs:${teamId}`, prospects)
  for (const key of gotStars) {
    gotTeamIdByProspectKey.set(key, teamId)
  }

  const rivalCandidates = new Map<string, string[]>()
  for (const rivalId of getDivisionRivals(teamId)) {
    const rivalStars = computePositionStarProspects(
      `dc-rivals:${teamId}:${rivalId}`,
      prospects,
    )
    for (const key of rivalStars) {
      const existing = rivalCandidates.get(key) ?? []
      existing.push(rivalId)
      rivalCandidates.set(key, existing)
    }
  }

  for (const [key, rivalIds] of rivalCandidates) {
    if (gotTeamIdByProspectKey.has(key)) continue
    rivalTeamIdByProspectKey.set(key, pickOneRivalTeam(teamId, key, rivalIds))
  }

  return { gotTeamIdByProspectKey, rivalTeamIdByProspectKey }
}
