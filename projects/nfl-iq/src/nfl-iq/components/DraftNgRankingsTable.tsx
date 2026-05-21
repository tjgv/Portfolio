import type { DraftBoardProspect } from '../types'
import type { DraftScoreRankMaps } from '../utils/draft-ng-ranks'
import { prospectStableKey } from '../utils/draft-ng-ranks'
import { SchoolTableCell } from './SchoolTableCell'
import { TableColCell } from './TableColCell'
import './iq-table-col-cell.css'

function overallTone(score: number): 'super' | 'good' | 'avg' | 'low' {
  if (score >= 93) return 'super'
  if (score >= 84) return 'good'
  if (score >= 75) return 'avg'
  return 'low'
}

function athleticsTone(score: number): 'super' | 'good' | 'avg' | 'low' {
  if (score >= 90) return 'super'
  if (score >= 84) return 'good'
  if (score >= 75) return 'avg'
  return 'low'
}

function OverallBadge({ score }: { score: number }) {
  const tone = overallTone(score)
  return (
    <span className="ng-rankings__metric">
      <span className={`ng-rankings__overall-dot ng-rankings__overall-dot--${tone}`} aria-hidden />
      <span className={`ng-rankings__score ng-rankings__score--${tone}`}>{score}</span>
    </span>
  )
}

function AthleticsBadge({ score }: { score: number }) {
  const tone = athleticsTone(score)
  return (
    <span className="ng-rankings__metric">
      <span className={`ng-rankings__ath-diamond ng-rankings__ath-diamond--${tone}`} aria-hidden />
      <span className={`ng-rankings__score ng-rankings__score--${tone}`}>{score}</span>
    </span>
  )
}

export type DraftNgRankingsTableProps = {
  rows: DraftBoardProspect[]
  ranks: DraftScoreRankMaps
}

export function DraftNgRankingsRows({ rows, ranks }: DraftNgRankingsTableProps) {
  return (
    <>
      {rows.map((p) => {
        const pk = prospectStableKey(p)
        const rkO = ranks.overallRank.get(pk) ?? '—'
        const rkA = ranks.athleticismRank.get(pk) ?? '—'
        const rkP = ranks.productionRank.get(pk) ?? '—'
        const athTone = athleticsTone(p.athleticism)
        const athMuted = athTone === 'avg' || athTone === 'low'
        return (
          <tr key={pk}>
            <td className="ng-rankings__td ng-rankings__td--name">{p.name}</td>
            <td className="ng-rankings__td">{p.position}</td>
            <SchoolTableCell
              className="ng-rankings__td ng-rankings__td--school"
              schoolAbbr={p.schoolAbbr || p.school}
              schoolLogoUrl={p.schoolLogoUrl}
            />
            <td className="ng-rankings__td ng-rankings__td--rk">{rkO}</td>
            <td className="ng-rankings__td ng-rankings__td--metric">
              <OverallBadge score={p.overall} />
            </td>
            <td
              className={`ng-rankings__td ng-rankings__td--metric${athMuted ? ' ng-rankings__td--ath-muted' : ''}`}
            >
              <AthleticsBadge score={p.athleticism} />
            </td>
            <td className="ng-rankings__td ng-rankings__td--rk">{rkA}</td>
            <td className="ng-rankings__td ng-rankings__td--rk ng-rankings__td--num">{p.production}</td>
            <td className="ng-rankings__td ng-rankings__td--rk">{rkP}</td>
          </tr>
        )
      })}
    </>
  )
}

export function DraftNgRankingsTable({ rows, ranks }: DraftNgRankingsTableProps) {
  return (
    <table className="ng-rankings__table">
      <thead>
        <tr>
          <th scope="col" className="ng-rankings__th ng-rankings__th--name">
            <TableColCell as="span">Name</TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--short">
            <TableColCell as="span">Pos</TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--school">
            <TableColCell as="span" center>
              School
            </TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--rk">
            <TableColCell as="span" center>
              Rk
            </TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--overall">
            <TableColCell as="span">Overall</TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--metric">
            <TableColCell as="span">Athleticism</TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--rk">
            <TableColCell as="span" center>
              Rk
            </TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--production">
            <TableColCell as="span">Production</TableColCell>
          </th>
          <th scope="col" className="ng-rankings__th ng-rankings__th--rk">
            <TableColCell as="span" center>
              Rk
            </TableColCell>
          </th>
        </tr>
      </thead>
      <tbody>
        <DraftNgRankingsRows rows={rows} ranks={ranks} />
      </tbody>
    </table>
  )
}
