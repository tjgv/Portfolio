export type TopNeedStatus = 'done' | 'partial' | 'need' | 'critical'

export type TopNeedTag = {
  pos: string
  status: TopNeedStatus
}

export type SpendingMetric = {
  label: string
  value: string
  rank: number
  rankTone: 'gold' | 'green' | 'mint'
  /** Division peer ranks (same order as division, excluding selected team in display) */
  divisionRanks: number[]
  /** 0–100 vertical gauge fill (Cap Space / Active Cap Spending only) */
  meterLevel?: number
}

import { generateTeamTopNeeds } from './team-top-needs.mock'

export type TeamSpendingProfile = {
  teamId: string
  capSpace: SpendingMetric
  activeCapSpending: SpendingMetric
  deadMoney: SpendingMetric
  topNeeds: TopNeedTag[]
}

const DEFAULT_NE: TeamSpendingProfile = {
  teamId: 'NE',
  capSpace: {
    label: 'CAP SPACE',
    value: '$32.6M',
    rank: 9,
    rankTone: 'gold',
    divisionRanks: [4, 8, 7],
    meterLevel: 62,
  },
  activeCapSpending: {
    label: 'ACTIVE CAP SPENDING',
    value: '$32.6M',
    rank: 4,
    rankTone: 'green',
    divisionRanks: [2, 6, 5],
    meterLevel: 78,
  },
  deadMoney: {
    label: 'DEAD MONEY',
    value: '$0.5M',
    rank: 1,
    rankTone: 'mint',
    divisionRanks: [3, 4, 2],
  },
  topNeeds: [],
}

const PROFILES: Record<string, TeamSpendingProfile> = {
  NE: DEFAULT_NE,
  BUF: {
    teamId: 'BUF',
    capSpace: {
      label: 'CAP SPACE',
      value: '$18.2M',
      rank: 14,
      rankTone: 'gold',
      divisionRanks: [9, 7, 8],
      meterLevel: 48,
    },
    activeCapSpending: {
      label: 'ACTIVE CAP SPENDING',
      value: '$241.1M',
      rank: 6,
      rankTone: 'green',
      divisionRanks: [4, 5, 7],
      meterLevel: 85,
    },
    deadMoney: {
      label: 'DEAD MONEY',
      value: '$2.1M',
      rank: 8,
      rankTone: 'mint',
      divisionRanks: [1, 4, 3],
    },
    topNeeds: [],
  },
}

export function getTeamSpendingProfile(teamId: string): TeamSpendingProfile {
  const base = PROFILES[teamId] ?? { ...DEFAULT_NE, teamId }
  return { ...base, teamId, topNeeds: generateTeamTopNeeds(teamId) }
}
