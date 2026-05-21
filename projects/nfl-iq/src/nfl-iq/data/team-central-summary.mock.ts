import { hashTeamSeed } from '../versions/option-a/data/big-board-team-view'
import { getDivisionForTeam } from '../versions/option-a/data/nfl-divisions'
import type { TopNeedTag } from '../versions/option-a/data/team-spending.mock'
import { generateTeamTopNeeds } from '../versions/option-a/data/team-top-needs.mock'

export type TeamCentralDraftSummary = {
  picks2026: string
  picks2027: string
  capitalRank: number
  draftClassRank: number
}

export function getTeamCentralDraftClassRank(teamId: string): number {
  return getTeamCentralDraftSummary(teamId).draftClassRank
}

export type TeamCentralPeerRow = {
  teamId: string
  needTags: TopNeedTag[]
}

const DRAFT_CLASS_RANK_BY_TEAM: Partial<Record<string, number>> = {
  SEA: 6,
}

const CAPITAL_RANK_BY_TEAM: Partial<Record<string, number>> = {
  SEA: 7,
}

const DRAFT_2026_BY_TEAM: Partial<Record<string, string>> = {
  SEA: '1-12, 2-44, 3-76, 4-108, 5-140, 6-165, 7-170',
  NE: '1-4, 1-31, 2-60, 5-142, 5-165, 6-184, 6-194, 7-225',
  KC: '1-31, 3-95, 4-128, 5-161, 6-194, 7-227',
  BUF: '1-30, 2-62, 3-94, 4-126, 5-158, 6-190, 7-222',
}

export function getTeamCentralDraftSummary(teamId: string): TeamCentralDraftSummary {
  const seed = hashTeamSeed(`tc-draft:${teamId}`)
  const capitalRank =
    CAPITAL_RANK_BY_TEAM[teamId] ?? 1 + (seed % 32)
  const draftClassRank =
    DRAFT_CLASS_RANK_BY_TEAM[teamId] ??
    1 + (hashTeamSeed(`tc-draft-class-rank:${teamId}`) % 32)
  return {
    picks2026:
      DRAFT_2026_BY_TEAM[teamId] ??
      '1-12, 2-44, 3-76, 4-108, 5-140, 6-172, 7-204',
    picks2027: '1st, 2nd, 3rd, 4th, 5th, 6th, 7th',
    capitalRank,
    draftClassRank,
  }
}

/** Division peers shown in the summary strip (up to 3). */
export function getTeamCentralDivisionPeers(teamId: string): TeamCentralPeerRow[] {
  return getDivisionForTeam(teamId)
    .filter((id) => id !== teamId)
    .slice(0, 3)
    .map((peerId) => ({
      teamId: peerId,
      needTags: generateTeamTopNeeds(peerId).slice(0, 5),
    }))
}
