import { useMemo, useState } from 'react'
import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'
import {
  getTeamCentralDivisionPeers,
  getTeamCentralDraftSummary,
} from '../data/team-central-summary.mock'
import {
  getTeamCentralProfile,
  getTeamCentralSummaryRecordLine,
} from '../data/team-central-profiles'
import { teamContrastText, teamPrimaryColor } from '../data/team-colors'
import { formatPositionLabel } from '../versions/option-a/data/position-names'
import { getTeamSpendingProfile } from '../versions/option-a/data/team-spending.mock'
import type {
  TopNeedTag,
  TopNeedStatus,
} from '../versions/option-a/data/team-spending.mock'
import type { Team, TeamNeed } from '../types'
import { getTeamDraftClassLevel } from '../data/team-draft-class.mock'
import './team-central-summary.css'

type TeamCentralSummaryPanelProps = {
  teamId: string
  team: Team
  needs: TeamNeed[]
}

type SummaryTabId = 'summary' | 'needs' | 'division'

const SUMMARY_TABS: ReadonlyArray<{ id: SummaryTabId; label: string }> = [
  { id: 'summary', label: 'Team Summary' },
  { id: 'needs', label: 'Team needs' },
  { id: 'division', label: 'Team Division' },
]

function SummaryNav({
  teamId,
  activeTab,
  onTabChange,
}: {
  teamId: string
  activeTab: SummaryTabId
  onTabChange: (tab: SummaryTabId) => void
}) {
  const teamColor = teamPrimaryColor(teamId)
  const navTextColor = teamContrastText(teamColor)

  return (
    <nav
      className="tc-summary__nav"
      aria-label="Team summary views"
      style={
        {
          '--tc-summary-team-color': teamColor,
          '--tc-summary-nav-text': navTextColor,
        } as React.CSSProperties
      }
    >
      <div className="tc-summary__nav-tabs" role="tablist">
        {SUMMARY_TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`tc-summary__nav-tab${isActive ? ' tc-summary__nav-tab--active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function buildNeedChecklist(
  spendingNeeds: TopNeedTag[],
  apiNeeds: TeamNeed[],
): TopNeedTag[] {
  if (spendingNeeds.length >= 5) {
    return spendingNeeds.slice(0, 5)
  }
  if (apiNeeds.length > 0) {
    return apiNeeds.slice(0, 5).map((n) => ({
      pos: n.position === 'EDGE' ? 'ED' : n.position,
      status: apiPriorityToNeedStatus(n.priority),
    }))
  }
  return [
    { pos: 'WR', status: 'need' },
    { pos: 'CB', status: 'partial' },
    { pos: 'ED', status: 'done' },
    { pos: 'OT', status: 'need' },
    { pos: 'QB', status: 'partial' },
  ]
}

function apiPriorityToNeedStatus(
  priority: TeamNeed['priority'],
): TopNeedStatus {
  if (priority === 'High') return 'need'
  if (priority === 'Medium') return 'partial'
  return 'done'
}

function needStatusModifier(
  status: TopNeedStatus,
): 'done' | 'addressed' | 'need' {
  if (status === 'done') return 'done'
  if (status === 'partial') return 'addressed'
  return 'need'
}

/** Official team-need pill — light fill, colored border, position or status label. */
function TeamNeedPill({
  label,
  status,
  role,
}: {
  label: string
  status: TopNeedStatus
  role?: 'listitem'
}) {
  const modifier = needStatusModifier(status)
  return (
    <span
      className={`tc-summary__need-pill tc-summary__need-pill--${modifier}`}
      role={role}
    >
      {label}
    </span>
  )
}

function TeamNeedPills({
  tags,
  keyPrefix = 'need',
}: {
  tags: TopNeedTag[]
  keyPrefix?: string
}) {
  return (
    <div className="tc-summary__need-pills" role="list">
      {tags.map((tag, index) => (
        <TeamNeedPill
          key={`${keyPrefix}-${tag.pos}-${index}`}
          label={formatPositionLabel(
            tag.pos,
            'abbrev',
            tag.status === 'critical',
          )}
          status={tag.status}
          role="listitem"
        />
      ))}
    </div>
  )
}

function BrandColumn({ teamId, team }: { teamId: string; team: Team }) {
  const meta = ALL_NFL_TEAMS.find((t) => t.id === teamId)
  const displayName = (meta?.name ?? team.name).toUpperCase()
  const primaryColor = teamPrimaryColor(teamId)
  const profile = getTeamCentralProfile(teamId, team)
  const recordLine = getTeamCentralSummaryRecordLine(teamId, team)

  return (
    <div className="tc-summary__cell tc-summary__cell--brand">
      <div className="tc-summary__brand-stack">
        <div className="tc-summary__brand-head">
          <img
            className="tc-summary__brand-logo"
            src={ngsTeamLogoUrl(teamId)}
            alt=""
          />
          <div className="tc-summary__brand-intro">
            <h1
              className="tc-summary__team-name"
              style={{ color: primaryColor }}
            >
              {displayName}
            </h1>
            <p className="tc-summary__record-line">{recordLine}</p>
          </div>
        </div>
        <div className="tc-summary__staff-grid" role="list">
          {profile.staff.map((member) => (
            <div
              key={member.roleLabel}
              className="tc-summary__staff-cell"
              role="listitem"
            >
              <span className="tc-summary__title">{member.roleLabel}</span>
              <span className="tc-summary__staff-name">{member.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DraftClassRankTrendIcon() {
  return (
    <span className="tc-summary__trend-up" aria-hidden>
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <path
          d="M1 11L6 6L10 9L17 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2H17V7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

function DraftClassRankSection({
  draftClassRank,
  needTags,
}: {
  draftClassRank: number
  needTags: TopNeedTag[]
}) {
  return (
    <section
      className="tc-summary__cell tc-summary__cell--finance tc-summary__cell--row-1 tc-summary__finance-section tc-summary__finance-section--draft-class"
      aria-labelledby="tc-summary-draft-class-rank"
    >
      <div className="tc-summary__finance-section-head">
        <h2
          id="tc-summary-draft-class-rank"
          className="tc-summary__title tc-summary__finance-heading"
        >
          Draft class rank: #{draftClassRank}
        </h2>
        <DraftClassRankTrendIcon />
      </div>
      <TeamNeedPills tags={needTags} keyPrefix="finance" />
    </section>
  )
}

function CapSpendingSection({
  spending,
}: {
  spending: ReturnType<typeof getTeamSpendingProfile>
}) {
  const capMetrics = [
    spending.capSpace,
    spending.activeCapSpending,
    spending.deadMoney,
  ]

  return (
    <section
      className="tc-summary__cell tc-summary__cell--finance tc-summary__cell--row-2 tc-summary__finance-section tc-summary__finance-section--cap"
      aria-label="Cap and spending"
    >
      <div className="tc-summary__cap-grid">
        {capMetrics.map((metric) => (
          <div key={metric.label} className="tc-summary__cap-cell">
            <span className="tc-summary__title">{metric.label}</span>
            <span className="tc-summary__cap-value">{metric.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function DraftCapitalSection({
  capitalRank,
  picks2026,
}: {
  capitalRank: number
  picks2026: string
}) {
  return (
    <section
      className="tc-summary__cell tc-summary__cell--finance tc-summary__cell--row-3 tc-summary__finance-section tc-summary__finance-section--capital"
      aria-labelledby="tc-summary-draft-capital-rank"
    >
      <h2
        id="tc-summary-draft-capital-rank"
        className="tc-summary__title tc-summary__finance-heading"
      >
        Draft capital rank: #{capitalRank}
      </h2>
      <p className="tc-summary__capital-picks">{picks2026}</p>
    </section>
  )
}

function PeerRow({
  row,
  peerTeamId,
  needTags,
}: {
  row: 1 | 2 | 3
  peerTeamId: string
  needTags: TopNeedTag[]
}) {
  const draftClassLevel = getTeamDraftClassLevel(peerTeamId)

  return (
    <div
      className={`tc-summary__cell tc-summary__cell--peer tc-summary__cell--row-${row} tc-summary__peer-row`}
    >
      <div className="tc-summary__peer-group">
        <div
          className="tc-summary__peer-logo-wrap"
          {...(peerTeamId === 'JAX'
            ? { 'data-solution-tour': 'team-summary-peer-jax' }
            : peerTeamId === 'IND'
              ? { 'data-solution-tour': 'team-summary-peer-ind' }
              : {})}
        >
          <img
            className="tc-summary__peer-logo"
            src={ngsTeamLogoUrl(peerTeamId)}
            alt=""
          />
        </div>
        <div className="tc-summary__peer-aside">
          <div className="tc-summary__peer-info">
            <div className="tc-summary__peer-metrics">
              <div className="tc-summary__draft-metric">
                <span className="tc-summary__title">Draft class level:</span>
                <span
                  className={`tc-summary__ovr tc-summary__ovr--${draftClassLevel.grade}`}
                >
                  {draftClassLevel.level}
                </span>
              </div>
            </div>
            <TeamNeedPills tags={needTags} keyPrefix={peerTeamId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function TeamCentralSummaryPanel({
  teamId,
  team,
  needs,
}: TeamCentralSummaryPanelProps) {
  const spending = getTeamSpendingProfile(teamId)
  const draft = getTeamCentralDraftSummary(teamId)
  const peers = useMemo(() => getTeamCentralDivisionPeers(teamId), [teamId])

  const checklist = useMemo(
    () => buildNeedChecklist(spending.topNeeds, needs),
    [needs, spending.topNeeds],
  )

  const peerRows: Array<1 | 2 | 3> = [1, 2, 3]
  const [activeTab, setActiveTab] = useState<SummaryTabId>('summary')

  return (
    <section
      className="tc-summary"
      data-solution-tour="team-central-summary"
      aria-label="Team overview"
    >
      <div className="tc-summary__shell">
        <SummaryNav
          teamId={teamId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div className="tc-summary__surface" role="tabpanel">
          <div className="tc-summary__grid">
          <BrandColumn teamId={teamId} team={team} />

          <DraftClassRankSection
            draftClassRank={draft.draftClassRank}
            needTags={checklist}
          />
          <CapSpendingSection spending={spending} />
          <DraftCapitalSection
            capitalRank={draft.capitalRank}
            picks2026={draft.picks2026}
          />

          {peerRows.map((row) => {
            const peer = peers[row - 1]
            if (!peer) return null
            return (
              <PeerRow
                key={peer.teamId}
                row={row}
                peerTeamId={peer.teamId}
                needTags={peer.needTags}
              />
            )
          })}
          </div>
        </div>
      </div>
    </section>
  )
}
