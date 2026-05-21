export type DraftPick = {
  pick: number
  teamId: string
  player: string
}

export type TeamScoreRow = {
  teamId: string
  teamName: string
  score: number
  tier: 'green' | 'yellow'
}

export const DRAFT_PICKS: DraftPick[] = [
  { pick: 1, teamId: 'LV', player: 'QB Fernando Mendoza, Indiana' },
  { pick: 2, teamId: 'NYJ', player: 'ED David Bailey, Texas Tech' },
  { pick: 3, teamId: 'ARI', player: 'RB Jeremiyah Love, Notre Dame' },
  { pick: 4, teamId: 'TEN', player: 'WR Carnell Tate, Ohio St.' },
  { pick: 5, teamId: 'NYG', player: 'ED Arvell Reese, Ohio St.' },
  { pick: 6, teamId: 'KC', player: 'CB Mansoor Delane, LSU' },
  { pick: 7, teamId: 'WAS', player: 'LB Sonny Styles, Ohio St.' },
  { pick: 8, teamId: 'NO', player: 'WR Jordyn Tyson, Arizona St.' },
  { pick: 9, teamId: 'CLE', player: 'T Spencer Fano, Utah' },
  { pick: 10, teamId: 'NYG', player: 'T Francis Mauigoa, Miami (FL)' },
  { pick: 11, teamId: 'DAL', player: 'S Caleb Downs, Ohio St.' },
  { pick: 12, teamId: 'MIA', player: 'T Kadyn Proctor, Alabama' },
  { pick: 13, teamId: 'LAR', player: 'QB Ty Simpson, Alabama' },
  { pick: 14, teamId: 'BAL', player: 'G Olaivavega Ioane, Penn St.' },
  { pick: 15, teamId: 'TB', player: 'ED Rueben Bain Jr., Miami (FL)' },
  { pick: 16, teamId: 'NYJ', player: 'TE Kenyon Sadiq, Oregon' },
  { pick: 17, teamId: 'DET', player: 'T Blake Miller, Clemson' },
  { pick: 18, teamId: 'MIN', player: 'DT Caleb Banks, Florida' },
  { pick: 19, teamId: 'CAR', player: 'T Monroe Freeling, Georgia' },
  { pick: 20, teamId: 'PHI', player: 'WR Makai Lemon, USC' },
  { pick: 21, teamId: 'PIT', player: 'T Max Iheanachor, Arizona St.' },
  { pick: 22, teamId: 'LAC', player: 'ED Akheem Mesidor, Miami (FL)' },
  { pick: 23, teamId: 'DAL', player: 'ED Malachi Lawrence, UCF' },
  { pick: 24, teamId: 'CLE', player: 'WR KC Concepcion, Texas A&M' },
  { pick: 25, teamId: 'CHI', player: 'S Dillon Thieneman, Oregon' },
  { pick: 26, teamId: 'HOU', player: 'G Keylan Rutledge, Georgia Tech' },
  { pick: 27, teamId: 'MIA', player: 'CB Chris Johnson, San Diego St.' },
  { pick: 28, teamId: 'NE', player: 'T Caleb Lomu, Utah' },
  { pick: 29, teamId: 'KC', player: 'DT Peter Woods, Clemson' },
  { pick: 30, teamId: 'NYJ', player: 'WR Omar Cooper Jr., Indiana' },
  { pick: 31, teamId: 'TEN', player: 'ED Keldric Faulk, Auburn' },
  { pick: 32, teamId: 'SEA', player: 'RB Jadarian Price, Notre Dame' },
]

export const NGS_DRAFT_SCORE_RANKINGS: TeamScoreRow[] = [
  { teamId: 'NYJ', teamName: 'Jets', score: 79.5, tier: 'green' },
  { teamId: 'CLE', teamName: 'Browns', score: 76.8, tier: 'green' },
  { teamId: 'PHI', teamName: 'Eagles', score: 76.7, tier: 'green' },
  { teamId: 'WAS', teamName: 'Commanders', score: 75.7, tier: 'green' },
  { teamId: 'ARI', teamName: 'Cardinals', score: 75.6, tier: 'green' },
  { teamId: 'LV', teamName: 'Raiders', score: 75.2, tier: 'green' },
  { teamId: 'TB', teamName: 'Buccaneers', score: 75.2, tier: 'green' },
  { teamId: 'MIA', teamName: 'Dolphins', score: 74.6, tier: 'green' },
  { teamId: 'NO', teamName: 'Saints', score: 74.4, tier: 'yellow' },
  { teamId: 'NYG', teamName: 'Giants', score: 74.3, tier: 'yellow' },
  { teamId: 'BUF', teamName: 'Bills', score: 74.2, tier: 'yellow' },
  { teamId: 'CAR', teamName: 'Panthers', score: 74.1, tier: 'yellow' },
  { teamId: 'BAL', teamName: 'Ravens', score: 73.9, tier: 'yellow' },
  { teamId: 'HOU', teamName: 'Texans', score: 73.6, tier: 'yellow' },
  { teamId: 'IND', teamName: 'Colts', score: 73.6, tier: 'yellow' },
  { teamId: 'CIN', teamName: 'Bengals', score: 73.4, tier: 'yellow' },
  { teamId: 'CHI', teamName: 'Bears', score: 73.2, tier: 'yellow' },
]

export const MOST_ATHLETIC_DRAFT_CLASSES: TeamScoreRow[] = [
  { teamId: 'CHI', teamName: 'Bears', score: 82.5, tier: 'green' },
  { teamId: 'BUF', teamName: 'Bills', score: 80.7, tier: 'green' },
  { teamId: 'LV', teamName: 'Raiders', score: 80.0, tier: 'green' },
  { teamId: 'SF', teamName: '49ers', score: 80.0, tier: 'green' },
  { teamId: 'NO', teamName: 'Saints', score: 79.7, tier: 'green' },
  { teamId: 'GB', teamName: 'Packers', score: 79.7, tier: 'green' },
  { teamId: 'ARI', teamName: 'Cardinals', score: 78.5, tier: 'green' },
  { teamId: 'TEN', teamName: 'Titans', score: 78.3, tier: 'green' },
  { teamId: 'MIA', teamName: 'Dolphins', score: 77.6, tier: 'green' },
  { teamId: 'CLE', teamName: 'Browns', score: 77.6, tier: 'green' },
  { teamId: 'TB', teamName: 'Buccaneers', score: 77.5, tier: 'green' },
  { teamId: 'NE', teamName: 'Patriots', score: 77.1, tier: 'green' },
  { teamId: 'NYJ', teamName: 'Jets', score: 76.8, tier: 'green' },
  { teamId: 'PHI', teamName: 'Eagles', score: 76.3, tier: 'green' },
  { teamId: 'PIT', teamName: 'Steelers', score: 75.9, tier: 'green' },
  { teamId: 'NYG', teamName: 'Giants', score: 75.5, tier: 'green' },
]

export const MOST_PRODUCTIVE_DRAFT_CLASSES: TeamScoreRow[] = [
  { teamId: 'NYJ', teamName: 'Jets', score: 78.4, tier: 'green' },
  { teamId: 'PHI', teamName: 'Eagles', score: 75.6, tier: 'green' },
  { teamId: 'WAS', teamName: 'Commanders', score: 75.2, tier: 'green' },
  { teamId: 'BAL', teamName: 'Ravens', score: 74.3, tier: 'yellow' },
  { teamId: 'ARI', teamName: 'Cardinals', score: 73.2, tier: 'yellow' },
  { teamId: 'CAR', teamName: 'Panthers', score: 72.9, tier: 'yellow' },
  { teamId: 'KC', teamName: 'Chiefs', score: 72.9, tier: 'yellow' },
  { teamId: 'HOU', teamName: 'Texans', score: 71.4, tier: 'yellow' },
  { teamId: 'LAR', teamName: 'Rams', score: 71.0, tier: 'yellow' },
  { teamId: 'LAC', teamName: 'Chargers', score: 70.9, tier: 'yellow' },
  { teamId: 'DEN', teamName: 'Broncos', score: 70.9, tier: 'yellow' },
  { teamId: 'SEA', teamName: 'Seahawks', score: 70.4, tier: 'yellow' },
  { teamId: 'TB', teamName: 'Buccaneers', score: 70.3, tier: 'yellow' },
  { teamId: 'IND', teamName: 'Colts', score: 70.2, tier: 'yellow' },
  { teamId: 'MIA', teamName: 'Dolphins', score: 69.8, tier: 'yellow' },
]

export const DAY1_VALUE_PICKS: { round: string; teamId: string; player: string }[] = [
  { round: '1-5', teamId: 'NYG', player: 'ED Arvell Reese, Ohio St.' },
  { round: '1-7', teamId: 'WAS', player: 'LB Sonny Styles, Ohio St.' },
  { round: '1-20', teamId: 'PHI', player: 'WR Makai Lemon, USC' },
  { round: '1-25', teamId: 'CHI', player: 'S Dillon Thieneman, Oregon' },
  { round: '1-30', teamId: 'NYJ', player: 'WR Omar Cooper Jr., Indiana' },
]

export const DAY2_VALUE_PICKS: { round: string; teamId: string; player: string }[] = [
  { round: '2-37', teamId: 'NYG', player: 'CB Colton Hood, Tennessee' },
  { round: '2-54', teamId: 'PHI', player: 'TE Eli Stowers, Vanderbilt' },
  { round: '2-58', teamId: 'CLE', player: 'S E. McNeil-Warren, Toledo' },
  { round: '2-60', teamId: 'TEN', player: 'LB Anthony Hill Jr., Texas' },
  { round: '3-88', teamId: 'JAX', player: 'G Emmanuel Pregnon, Oregon' },
]

export function filterPicksByRound(picks: DraftPick[], round: string | 'all'): DraftPick[] {
  if (round === 'all') return picks
  const ranges: Record<string, [number, number]> = {
    '1': [1, 8],
    '2': [9, 16],
    '3': [17, 24],
    '4': [25, 32],
  }
  const [min, max] = ranges[round] ?? [1, 32]
  return picks.filter((p) => p.pick >= min && p.pick <= max)
}

export function filterPicksByTeam(picks: DraftPick[], teamId: string | null): DraftPick[] {
  if (!teamId) return picks
  return picks.filter((p) => p.teamId === teamId)
}