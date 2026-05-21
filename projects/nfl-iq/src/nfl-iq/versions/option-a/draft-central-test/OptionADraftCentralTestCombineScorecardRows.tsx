import { useMemo } from 'react'
import type { DraftBoardProspect } from '../../../types'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { SchoolTableCell } from '../../../components/SchoolTableCell'
import { tierFromNgsScore } from '../../../utils/draft-score-tier'
import type { DraftCentralTeamNeedsLayout } from '../data/draft-central-team-needs'
import {
  draftCentralProspectKey,
  findFirstGotOrRivalsLogo,
} from '../data/draft-central-team-needs'
import { DraftCentralTestGotCell } from './DraftCentralTestGotCell'
import { DraftCentralTestRivalsCell } from './DraftCentralTestRivalsCell'
import { DraftTestEmptyDash } from './DraftTestEmptyDash'
import { DRAFT_HOVER_PREVIEW_PLAYER_NAME } from './draft-hover-preview'

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
    <td
      className={
        empty
          ? 'draft-board__td draft-board__td--combine-empty'
          : 'draft-board__td draft-board__td--combine'
      }
    >
      {empty ? <DraftTestEmptyDash /> : children}
    </td>
  )
}

function rawAthCellClass(rawAth: number | null): string {
  if (rawAth == null) return 'draft-board__td draft-board__td--raw-ath-empty'
  if (rawAth >= 8.5) return 'draft-board__td draft-board__td--raw-ath-high'
  return 'draft-board__td draft-board__td--raw-ath-muted'
}

type OptionADraftCentralTestCombineScorecardRowsProps = {
  rows: DraftBoardProspect[]
  teamNeedsLayout: DraftCentralTeamNeedsLayout | null
  focusedKeys: string[]
  onSelectProspect: (key: string, shiftKey: boolean) => void
}

export function OptionADraftCentralTestCombineScorecardRows({
  rows,
  teamNeedsLayout,
  focusedKeys,
  onSelectProspect,
}: OptionADraftCentralTestCombineScorecardRowsProps) {
  const focusedSet = new Set(focusedKeys)
  const firstNeedLogo = useMemo(
    () => findFirstGotOrRivalsLogo(rows, teamNeedsLayout),
    [rows, teamNeedsLayout],
  )

  return (
    <>
      {rows.map((p) => {
        const prospectKey = draftCentralProspectKey(p)
        const rowKey = prospectStableKey(p)
        const isFocused = focusedSet.has(rowKey)
        const gotTeamId =
          teamNeedsLayout?.gotTeamIdByProspectKey.get(prospectKey) ?? null
        const rivalTeamId =
          teamNeedsLayout?.rivalTeamIdByProspectKey.get(prospectKey) ?? null
        const isNeedLogoTourAnchor =
          firstNeedLogo?.prospectKey === prospectKey
        const isHoverPreviewRow = p.name === DRAFT_HOVER_PREVIEW_PLAYER_NAME

        return (
          <tr
            key={rowKey}
            className={
              isFocused
                ? 'draft-test__scorecard-row draft-test__scorecard-row--focused'
                : 'draft-test__scorecard-row'
            }
            {...(isHoverPreviewRow
              ? { 'data-solution-tour': 'draft-scorecard-hover-row' }
              : {})}
            tabIndex={0}
            aria-selected={isFocused}
            onClick={(e) => onSelectProspect(rowKey, e.shiftKey)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelectProspect(rowKey, e.shiftKey)
              }
            }}
          >
            <td className="draft-board__td">
              {p.djRank != null ? `#${p.djRank}` : <DraftTestEmptyDash />}
            </td>
            <td className="draft-board__td">{p.position}</td>
            <td className="draft-board__td draft-board__td--player">{p.name}</td>
            <DraftCentralTestGotCell
              teamId={gotTeamId}
              tourAnchor={
                isNeedLogoTourAnchor && firstNeedLogo?.column === 'got'
              }
            />
            <DraftCentralTestRivalsCell
              teamId={rivalTeamId}
              tourAnchor={
                isNeedLogoTourAnchor && firstNeedLogo?.column === 'rivals'
              }
            />
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
            <td className={rawAthCellClass(p.rawAth)}>
              {p.rawAth != null ? p.rawAth.toFixed(1) : '—'}
            </td>
            <NgsScoreCell score={p.athleticism} />
            <NgsScoreCell score={p.production} />
            <NgsScoreCell score={p.overall} />
            <td className="draft-board__td">{p.ht || <DraftTestEmptyDash />}</td>
            <td className="draft-board__td">{p.wt || <DraftTestEmptyDash />}</td>
            <td className="draft-board__td">{p.hand || <DraftTestEmptyDash />}</td>
            <td className="draft-board__td">{p.arm || <DraftTestEmptyDash />}</td>
            <td className="draft-board__td">{p.wing || <DraftTestEmptyDash />}</td>
          </tr>
        )
      })}
    </>
  )
}
