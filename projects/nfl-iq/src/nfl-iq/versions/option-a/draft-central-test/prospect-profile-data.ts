import type { DraftBoardProspect } from '../../../types'
import { ALL_NFL_TEAMS } from '../../../constants'
import { tierFromNgsScore, type DraftScoreTier } from '../../../utils/draft-score-tier'

export type ProspectPageMeta = {
  prospectGrade: string
  gradeLabel: string
  hometown: string
  classYear: string
  combineGroup: string
  productionRank: number
  athleticismRank: number
  totalRank: number
  draftTeamId: string
  draftTeamName: string
  draftRound: number
  draftPick: number
  ngsTier: DraftScoreTier
  ngsTierLabel: string
}

function hashKey(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i += 1) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function combineGroup(position: string): string {
  const pos = position.toUpperCase()
  if (pos === 'EDGE' || pos === 'ED' || pos === 'DL' || pos === 'DT') return 'DE/EDGE'
  if (pos === 'LB') return 'LB'
  if (pos === 'CB' || pos === 'S') return 'DB'
  if (pos === 'QB') return 'QB'
  if (pos === 'RB') return 'RB'
  if (pos === 'WR') return 'WR'
  if (pos === 'TE') return 'TE'
  if (pos === 'OL' || pos === 'G' || pos === 'T' || pos === 'C') return 'OL'
  return pos
}

function gradeLabel(overall: number): string {
  if (overall >= 92) return 'Elite Prospect'
  if (overall >= 85) return 'Year 1 Starter'
  if (overall >= 75) return 'Immediate Contributor'
  if (overall >= 65) return 'Rotational Player'
  return 'Developmental'
}

function ngsTierLabel(tier: DraftScoreTier): string {
  switch (tier) {
    case 'elite':
      return 'Elite'
    case 'good':
      return 'Good'
    case 'average':
      return 'Average'
    default:
      return 'Below Average'
  }
}

const HOMETOWNS = [
  'Miami, FL',
  'Atlanta, GA',
  'Dallas, TX',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
]

const CLASS_YEARS = ['Senior', 'Junior', 'Redshirt Junior', 'Redshirt Senior']

export function buildProspectPageMeta(
  prospect: DraftBoardProspect,
  prospectKey: string,
): ProspectPageMeta {
  const h = hashKey(prospectKey)
  const group = combineGroup(prospect.position)
  const overall = prospect.overall
  const prospectGrade = (overall / 10 + (h % 8) / 100).toFixed(2)
  const ngsTier = tierFromNgsScore(overall)

  const rankBase = prospect.djRank ?? 20
  const productionRank = Math.max(1, rankBase + (h % 5) - 2)
  const athleticismRank = Math.max(1, rankBase + ((h >> 2) % 9))
  const totalRank = Math.max(1, rankBase + ((h >> 4) % 4) - 1)

  const draftTeam = ALL_NFL_TEAMS[h % ALL_NFL_TEAMS.length]
  const draftRound =
    prospect.djRank != null
      ? prospect.djRank <= 32
        ? 1
        : prospect.djRank <= 64
          ? 2
          : prospect.djRank <= 96
            ? 3
            : 4
      : 1 + (h % 3)
  const draftPick = prospect.djRank ?? 1 + (h % 32)

  return {
    prospectGrade,
    gradeLabel: gradeLabel(overall),
    hometown: HOMETOWNS[h % HOMETOWNS.length],
    classYear: CLASS_YEARS[h % CLASS_YEARS.length],
    combineGroup: group,
    productionRank,
    athleticismRank,
    totalRank,
    draftTeamId: draftTeam.id,
    draftTeamName: draftTeam.name.toUpperCase(),
    draftRound,
    draftPick,
    ngsTier,
    ngsTierLabel: ngsTierLabel(ngsTier),
  }
}
