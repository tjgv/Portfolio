import type { DraftBoardProspect } from '../types'

export type DraftScoreRankMaps = {
  overallRank: Map<string, number>
  athleticismRank: Map<string, number>
  productionRank: Map<string, number>
}

export function prospectStableKey(p: DraftBoardProspect): string {
  return `${p.name}\u001f${String(p.djRank ?? '')}\u001f${p.position}`
}

/** Competitive ranking on full list: ties share rank, next tier skips (1, 1, 3 …). */
function assignRankDesc(sorted: DraftBoardProspect[], score: (p: DraftBoardProspect) => number) {
  const m = new Map<string, number>()
  let i = 0
  while (i < sorted.length) {
    const s = score(sorted[i])
    let j = i
    while (j < sorted.length && score(sorted[j]) === s) j++
    const rank = i + 1
    for (let k = i; k < j; k++) m.set(prospectStableKey(sorted[k]), rank)
    i = j
  }
  return m
}

export function computeDraftScoreRanks(rows: DraftBoardProspect[]): DraftScoreRankMaps {
  const byOverall = [...rows].sort(
    (a, b) => b.overall - a.overall || a.name.localeCompare(b.name),
  )
  const byAth = [...rows].sort(
    (a, b) => b.athleticism - a.athleticism || a.name.localeCompare(b.name),
  )
  const byProd = [...rows].sort(
    (a, b) => b.production - a.production || a.name.localeCompare(b.name),
  )

  return {
    overallRank: assignRankDesc(byOverall, (p) => p.overall),
    athleticismRank: assignRankDesc(byAth, (p) => p.athleticism),
    productionRank: assignRankDesc(byProd, (p) => p.production),
  }
}
