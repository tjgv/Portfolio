import {
  BIG_BOARD_COLUMNS,
  BIG_BOARD_ROWS,
  type BigBoardColumn,
} from '../../../data/big-board-grid'
import { getDivisionForTeam } from './nfl-divisions'

export const BIG_BOARD_HIGHLIGHT_COLUMN_COUNT = 5
export const BIG_BOARD_LOGOS_PER_TEAM = 4

/** One logo per team in rows strictly between these tier labels */
export const BIG_BOARD_LOGO_TIER_BANDS = [
  { startTier: 'Top 5', endTier: '1st-2nd' },
  { startTier: '2nd', endTier: '3rd' },
  { startTier: '3rd', endTier: '4th' },
  { startTier: '4th', endTier: '5th-6th' },
] as const

export type BigBoardCellCoord = {
  rowIndex: number
  col: BigBoardColumn
}

export type BigBoardTeamViewLayout = {
  highlightColumns: Set<BigBoardColumn>
  logosByCell: Map<string, string>
}

export function bigBoardCellKey(rowIndex: number, col: BigBoardColumn): string {
  return `${rowIndex}:${col}`
}

export function getDivisionRivals(teamId: string): string[] {
  return getDivisionForTeam(teamId).filter((id) => id !== teamId)
}

function findTierRowIndex(tierLabel: string): number {
  return BIG_BOARD_ROWS.findIndex((row) => row.tier === tierLabel)
}

export function getRowIndicesBetweenTiers(
  startTier: string,
  endTier: string,
): number[] {
  const startIdx = findTierRowIndex(startTier)
  const endIdx = findTierRowIndex(endTier)
  if (startIdx < 0 || endIdx < 0 || startIdx >= endIdx) return []

  const rowIndices: number[] = []
  for (let i = startIdx + 1; i < endIdx; i++) {
    rowIndices.push(i)
  }
  return rowIndices
}

export function hashTeamSeed(teamId: string): number {
  let h = 2166136261
  for (let i = 0; i < teamId.length; i++) {
    h ^= teamId.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function mulberry32(seed: number) {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffle<T>(items: T[], rng: () => number): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

/** First grid cell (top-to-bottom, left-to-right) that shows a given team logo in team view. */
export function findFirstTeamLogoCell(
  viewingTeamId: string,
  logoTeamId: string,
): BigBoardCellCoord | null {
  const layout = computeBigBoardTeamViewLayout(viewingTeamId)
  const target = logoTeamId.toUpperCase()

  for (let rowIndex = 0; rowIndex < BIG_BOARD_ROWS.length; rowIndex++) {
    for (const col of BIG_BOARD_COLUMNS) {
      const key = bigBoardCellKey(rowIndex, col)
      if (layout.logosByCell.get(key)?.toUpperCase() === target) {
        return { rowIndex, col }
      }
    }
  }
  return null
}

export function computeBigBoardTeamViewLayout(
  teamId: string,
): BigBoardTeamViewLayout {
  const rng = mulberry32(hashTeamSeed(teamId))
  const highlightColumns = new Set(
    shuffle([...BIG_BOARD_COLUMNS], rng).slice(
      0,
      BIG_BOARD_HIGHLIGHT_COLUMN_COUNT,
    ),
  )

  const rivals = getDivisionRivals(teamId)
  const teamsNeedingLogos = [teamId, ...rivals]
  const logosByCell = new Map<string, string>()

  for (const band of BIG_BOARD_LOGO_TIER_BANDS) {
    const rowIndices = getRowIndicesBetweenTiers(band.startTier, band.endTier)
    const pool: BigBoardCellCoord[] = []

    for (const rowIndex of rowIndices) {
      const row = BIG_BOARD_ROWS[rowIndex]
      for (const col of highlightColumns) {
        const players = row?.cells[col]
        if (players?.length) {
          pool.push({ rowIndex, col })
        }
      }
    }

    if (pool.length === 0) continue

    const shuffledCells = shuffle(pool, rng)
    const shuffledTeams = shuffle(teamsNeedingLogos, rng)

    for (let i = 0; i < shuffledTeams.length; i++) {
      const cell = shuffledCells[i]
      if (!cell) break
      const key = bigBoardCellKey(cell.rowIndex, cell.col)
      if (logosByCell.has(key)) continue
      logosByCell.set(key, shuffledTeams[i])
    }
  }

  return { highlightColumns, logosByCell }
}

export function teamColorFill5(color: string): string {
  return `color-mix(in srgb, ${color} 5%, #ffffff 95%)`
}
