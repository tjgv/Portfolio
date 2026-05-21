/**
 * Reads src/nfl-iq/data/combine_scorecard.json and writes
 * src/nfl-iq/data/draft-board.mock.json in DraftBoardProspect shape.
 *
 * npm run sync:draft
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const inPath = join(root, 'src', 'nfl-iq', 'data', 'combine_scorecard.json')
const outPath = join(root, 'src', 'nfl-iq', 'data', 'draft-board.mock.json')

/** @param {unknown} v */
function combineStr(v) {
  if (v == null || v === '') return null
  if (typeof v === 'number' && Number.isFinite(v)) return String(v)
  return String(v)
}

/** @param {Record<string, unknown>} row */
function mapRow(row) {
  const rank = row.rank
  const djRank =
    typeof rank === 'number' && Number.isFinite(rank)
      ? Math.trunc(rank)
      : typeof rank === 'string' && rank.trim()
        ? parseInt(rank, 10)
        : null

  const athleticism = Number(row.athleticism)
  const production = Number(row.production)
  const overall = Number(row.overall)

  /** @type {number | null} */
  let rawAth = null
  if (row.raw_ath != null && row.raw_ath !== '') {
    const x = typeof row.raw_ath === 'number' ? row.raw_ath : parseFloat(String(row.raw_ath))
    if (Number.isFinite(x)) rawAth = x
  }

  const schoolKey = typeof row.school === 'string' ? row.school : ''
  const schoolDisplay = schoolKey.replace(/_/g, ' ').trim()

  return {
    djRank: Number.isFinite(djRank ?? NaN) ? djRank : null,
    name: String(row.player ?? ''),
    school: schoolDisplay,
    schoolAbbr: schoolDisplay.toUpperCase(),
    schoolLogoUrl: typeof row.school_logo === 'string' ? row.school_logo : null,
    position: String(row.position ?? ''),
    fortyMph: combineStr(row.forty_mph),
    fortyTime: combineStr(row.forty_time),
    tenYd: combineStr(row.ten_yd),
    broad: combineStr(row.broad),
    vert: combineStr(row.vert),
    shuttle: combineStr(row.shuttle),
    cone: combineStr(row.cone),
    bench: combineStr(row.bench),
    rawAth,
    athleticism: Number.isFinite(athleticism) ? Math.round(athleticism) : 0,
    production: Number.isFinite(production) ? Math.round(production) : 0,
    overall: Number.isFinite(overall) ? Math.round(overall) : 0,
    ht: row.height != null ? String(row.height) : '',
    wt: row.weight != null ? String(row.weight) : '',
    hand: combineStr(row.hand),
    arm: combineStr(row.arm),
    wing: combineStr(row.wing),
  }
}

const raw = JSON.parse(readFileSync(inPath, 'utf8'))
if (!Array.isArray(raw)) {
  console.error('combine_scorecard.json must be an array')
  process.exit(1)
}

const prospects = raw.map((row) => mapRow(row))

writeFileSync(outPath, JSON.stringify(prospects, null, 2) + '\n', 'utf8')
console.log(`Wrote ${prospects.length} prospects to draft-board.mock.json`)
