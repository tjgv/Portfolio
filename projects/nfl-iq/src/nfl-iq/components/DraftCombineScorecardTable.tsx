import type { DraftBoardProspect } from '../types'
import { SchoolTableCell } from './SchoolTableCell'
import { TableColCell } from './TableColCell'
import { tierFromNgsScore } from '../utils/draft-score-tier'
import './iq-table-col-cell.css'

function NgsScoreCell({ score }: { score: number }) {
  const tier = tierFromNgsScore(score)
  return (
    <td className="draft-board__td draft-board__td--score draft-board__td--ngs-metric">
      <span className="draft-board__ngs-wrap">
        <span className={`draft-board__ngs-icon draft-board__ngs-icon--${tier}`} aria-hidden />
        <span className="draft-board__ngs-num">{score}</span>
      </span>
    </td>
  )
}

function CombCell({ children }: { children?: string | null }) {
  const empty = children == null || children === ''
  return (
    <td className={empty ? 'draft-board__td draft-board__td--combine-empty' : 'draft-board__td draft-board__td--combine'}>
      {empty ? '—' : children}
    </td>
  )
}

function rawAthCellClass(rawAth: number | null): string {
  if (rawAth == null) return 'draft-board__td draft-board__td--raw-ath-empty'
  if (rawAth >= 8.5) return 'draft-board__td draft-board__td--raw-ath-high'
  return 'draft-board__td draft-board__td--raw-ath-muted'
}

export type DraftCombineScorecardTableProps = {
  rows: DraftBoardProspect[]
}

export function DraftCombineScorecardRows({ rows }: DraftCombineScorecardTableProps) {
  return (
    <>
      {rows.map((p) => (
        <tr key={`${p.name}-${p.djRank ?? 'u'}-${p.position}`}>
          <td className="draft-board__td">{p.djRank != null ? `#${p.djRank}` : '—'}</td>
          <td className="draft-board__td">{p.position}</td>
          <td className="draft-board__td draft-board__td--player">{p.name}</td>
          <SchoolTableCell
            className="draft-board__td draft-board__td--school"
            schoolAbbr={p.schoolAbbr || p.school}
            schoolLogoUrl={p.schoolLogoUrl}
          />
          <CombCell>{p.fortyMph}</CombCell>
          <CombCell>{p.fortyTime}</CombCell>
          <CombCell>{p.tenYd}</CombCell>
          <CombCell>{p.broad}</CombCell>
          <CombCell>{p.vert}</CombCell>
          <CombCell>{p.shuttle}</CombCell>
          <CombCell>{p.cone}</CombCell>
          <CombCell>{p.bench}</CombCell>
          <td className={rawAthCellClass(p.rawAth)}>
            {p.rawAth != null ? p.rawAth.toFixed(1) : '—'}
          </td>
          <NgsScoreCell score={p.athleticism} />
          <NgsScoreCell score={p.production} />
          <NgsScoreCell score={p.overall} />
          <td className="draft-board__td">{p.ht || '—'}</td>
          <td className="draft-board__td">{p.wt || '—'}</td>
          <td className="draft-board__td">{p.hand || '—'}</td>
          <td className="draft-board__td">{p.arm || '—'}</td>
          <td className="draft-board__td">{p.wing || '—'}</td>
        </tr>
      ))}
    </>
  )
}

export function DraftCombineScorecardTable({ rows }: DraftCombineScorecardTableProps) {
  return (
    <table className="draft-board__table">
      <thead>
        <tr>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">DJ</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Pos</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--player-col">
            <TableColCell as="span">Player</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--school">
            <TableColCell as="span" center>
              School
            </TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">40 MPH</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">40 Time</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">10-Yd</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Broad</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Vert</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Shuttle</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Cone</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Bench</TableColCell>
          </th>
          <th scope="col" className="draft-board__th draft-board__th--combine">
            <TableColCell as="span">Raw Ath</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Athleticism</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Production</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Overall</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Ht</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Wt</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Hand</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Arm</TableColCell>
          </th>
          <th scope="col" className="draft-board__th">
            <TableColCell as="span">Wing</TableColCell>
          </th>
        </tr>
      </thead>
      <tbody>
        <DraftCombineScorecardRows rows={rows} />
      </tbody>
    </table>
  )
}
