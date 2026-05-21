import { Fragment, useMemo, useState } from 'react'
import { ALL_NFL_TEAMS, ngsTeamLogoUrl } from '../constants'
import type { Team, TeamNeed } from '../types'
import './team-central-offseason.css'

import { publicAsset } from '../lib/app-paths'

const NFL_IQ_ICON = publicAsset('/images/nfl-iq-icon.png')
const AMAZON_QUICK_ICON = publicAsset('/images/amazon-quick-icon.png')

const DIVISION_ID_SETS: string[][] = [
  ['BUF', 'MIA', 'NE', 'NYJ'],
  ['BAL', 'CIN', 'CLE', 'PIT'],
  ['HOU', 'IND', 'JAX', 'TEN'],
  ['DEN', 'KC', 'LV', 'LAC'],
  ['DAL', 'NYG', 'PHI', 'WAS'],
  ['CHI', 'DET', 'GB', 'MIN'],
  ['ATL', 'CAR', 'NO', 'TB'],
  ['ARI', 'LAR', 'SF', 'SEA'],
]

function getDivisionPeerIds(teamId: string): string[] {
  for (const div of DIVISION_ID_SETS) {
    if (div.includes(teamId)) {
      return [...div]
    }
  }
  return ['HOU', 'IND', 'JAX', 'TEN']
}

function teamShortName(teamId: string): string {
  const meta = ALL_NFL_TEAMS.find((t) => t.id === teamId)
  if (!meta) return teamId
  const last = meta.name.split(' ').pop() ?? meta.name
  return last
}

function formatPosAbbrev(p: string): string {
  if (p === 'EDGE') return 'ED'
  return p
}

type OffseasonTab = 'summary' | 'needs' | 'division'

const TABS: { id: OffseasonTab; label: string }[] = [
  { id: 'summary', label: 'Offseason summary' },
  { id: 'needs', label: 'Team needs' },
  { id: 'division', label: 'Division ranks' },
]

/** Sample copy mirrors the reference layout; swap for API-driven text later. */
const NEED_CARD_CONTENT: {
  pos: string
  badge: 'done' | 'addressed' | 'need'
  accent: 'blue' | 'navy'
  body: string
}[] = [
  {
    pos: 'WR',
    badge: 'done',
    accent: 'blue',
    body:
      "After your club reinforced the room in free agency and the draft, evaluate depth behind the top two targets and red-zone usage when NFL IQ data connects here.",
  },
  {
    pos: 'ED',
    badge: 'done',
    accent: 'navy',
    body:
      'Edge rotation improved with veteran and rookie additions — monitor pass-rush win rate and pressure share as the season approaches.',
  },
  {
    pos: 'RB',
    badge: 'addressed',
    accent: 'blue',
    body:
      'Depth was added late in the draft; top-end explosiveness may still be a question if starters hit the market next cycle.',
  },
  {
    pos: 'OL',
    badge: 'need',
    accent: 'blue',
    body:
      'Interior depth remains a focus after departures — target a plug-and-play guard or swing tackle in camp competition.',
  },
  {
    pos: 'LB',
    badge: 'done',
    accent: 'blue',
    body:
      'Starters return with rookie depth in the room; special teams and sub-package snaps will sort the pecking order.',
  },
]

const DIVISION_METRIC_CHIPS = [
  'Turnover differential',
  'Off success rate (NGS)',
  'Def success rate (NGS)',
  'Pressure rate allowed (NGS)',
  'Pressure rate (NGS)',
]

const AFC_SOUTH_RANK_PRESETS: Record<
  string,
  { rank: number; value: string }[]
> = {
  ppg: [
    { rank: 5, value: '27.9' },
    { rank: 7, value: '27.4' },
    { rank: 12, value: '23.8' },
    { rank: 29, value: '16.7' },
  ],
  ppgAllowed: [
    { rank: 2, value: '17.4' },
    { rank: 8, value: '19.8' },
    { rank: 21, value: '24.2' },
    { rank: 28, value: '28.1' },
  ],
  ypp: [
    { rank: 8, value: '5.8' },
    { rank: 18, value: '5.2' },
    { rank: 24, value: '5.1' },
    { rank: 31, value: '4.4' },
  ],
  yppAllowed: [
    { rank: 5, value: '4.8' },
    { rank: 8, value: '5.0' },
    { rank: 17, value: '5.3' },
    { rank: 28, value: '5.8' },
  ],
}

const SUMMARY_TABLE_TITLES = [
  { key: 'ppg', title: 'Points per game' },
  { key: 'ppgAllowed', title: 'PPG allowed' },
  { key: 'ypp', title: 'Yards per play' },
  { key: 'yppAllowed', title: 'YPP allowed' },
] as const

type TeamCentralOffseasonSectionProps = {
  teamId: string
  team: Team
  needs: TeamNeed[]
}

export function TeamCentralOffseasonSection({
  teamId,
  team,
  needs,
}: TeamCentralOffseasonSectionProps) {
  const [tab, setTab] = useState<OffseasonTab>('summary')

  const peers = useMemo(() => getDivisionPeerIds(teamId), [teamId])

  const topFiveNeeds = useMemo(() => {
    const parts = needs.slice(0, 5).map((n) => formatPosAbbrev(n.position))
    return parts.length > 0 ? parts.join(', ') : 'WR, ED, RB, OL, LB'
  }, [needs])

  const draftPickLine =
    '1-4, 1-31, 2-60, 5-142, 5-165, 6-184, 6-194, 7-225'

  const isAfcSouthPreset =
    peers.length === 4 &&
    new Set(peers).has('HOU') &&
    new Set(peers).has('IND') &&
    new Set(peers).has('JAX') &&
    new Set(peers).has('TEN')

  const orderedForStat = useMemo(() => {
    if (isAfcSouthPreset) {
      return ['JAX', 'IND', 'HOU', 'TEN']
    }
    return [...peers].sort()
  }, [isAfcSouthPreset, peers])

  return (
    <section className="team-central-offseason" aria-label="Offseason overview">
      <div
        className="team-central-offseason__tabs"
        role="tablist"
        aria-label="Offseason sections"
      >
        {TABS.map((item, index) => (
          <Fragment key={item.id}>
            {index > 0 ? (
              <span
                className="team-central-offseason__tab-divider"
                aria-hidden
              />
            ) : null}
            <button
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              id={`tos-tab-${item.id}`}
              aria-controls={`tos-panel-${item.id}`}
              className={
                tab === item.id
                  ? 'team-central-offseason__tab team-central-offseason__tab--active'
                  : 'team-central-offseason__tab'
              }
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          </Fragment>
        ))}
      </div>

      <div className="team-central-offseason__surface">
        {tab === 'summary' && (
          <div
            id="tos-panel-summary"
            role="tabpanel"
            aria-labelledby="tos-tab-summary"
            className="tos-summary"
          >
            <div className="tos-summary__col">
              <div className="tos-summary__brand-row">
                <img
                  className="tos-summary__brand-logo"
                  src={ngsTeamLogoUrl(teamId)}
                  alt=""
                />
                <span className="tos-summary__x" aria-hidden>
                  ×
                </span>
                <div className="tos-summary__iq-marks">
                  <img src={NFL_IQ_ICON} alt="" />
                  <span className="tos-summary__divider-v" aria-hidden />
                  <img src={AMAZON_QUICK_ICON} alt="" />
                </div>
              </div>
              <p className="tos-summary__kicker">Offseason summary</p>
            </div>
            <div className="tos-summary__col">
              <p className="tos-summary__needs-label">Top 5 team needs</p>
              <p className="tos-summary__needs-sub">Entering 2026 NFL Draft</p>
              <p className="tos-summary__needs-value">{topFiveNeeds}</p>
            </div>
            <div className="tos-summary__col">
              <div className="tos-finance__row">
                <span className="tos-finance__label">Cap space</span>
                <div className="tos-finance__line">
                  <span className="tos-finance__value">
                    ${team.capSpace.toFixed(1)}M
                  </span>
                  <div className="tos-finance__meta">
                    <span className="tos-finance__pill">#2</span>
                    <div className="tos-finance__bar-wrap" aria-hidden>
                      <div
                        className="tos-finance__bar"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tos-finance__row">
                <span className="tos-finance__label">Active cap spending</span>
                <div className="tos-finance__line">
                  <span className="tos-finance__value">$262.7M</span>
                  <div className="tos-finance__meta">
                    <span className="tos-finance__pill">#15</span>
                    <div className="tos-finance__bar-wrap" aria-hidden>
                      <div
                        className="tos-finance__bar"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tos-finance__row">
                <span className="tos-finance__label">Dead money</span>
                <div className="tos-finance__line">
                  <span className="tos-finance__value">$25.2M</span>
                  <div className="tos-finance__meta">
                    <span className="tos-finance__pill tos-finance__pill--soft">
                      #14
                    </span>
                    <span className="tos-finance__low">Low</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="tos-summary__col">
              <p className="tos-draft__label">2026 draft picks</p>
              <p className="tos-draft__picks">{draftPickLine}</p>
              <p className="tos-draft__label">2027 draft picks</p>
              <p className="tos-draft__picks">
                1st, 2nd, 3rd, 4th, 5th, 6th, 7th
              </p>
              <div className="tos-draft__aside">
                <span className="tos-draft__shield">NFL Draft</span>
                <span className="tos-draft__cap-rank-label">
                  Draft capital rank
                </span>
                <span className="tos-finance__pill">#8</span>
              </div>
            </div>
          </div>
        )}

        {tab === 'needs' && (
          <div
            id="tos-panel-needs"
            role="tabpanel"
            aria-labelledby="tos-tab-needs"
            className="tos-needs"
          >
            {NEED_CARD_CONTENT.map((card) => (
              <div
                key={card.pos}
                className={
                  card.accent === 'navy'
                    ? 'tos-need-card tos-need-card--navy'
                    : 'tos-need-card'
                }
              >
                <div className="tos-need-card__head">
                  <p className="tos-need-card__pos">{card.pos}</p>
                  <span
                    className={
                      card.badge === 'done'
                        ? 'tos-need-card__badge tos-need-card__badge--done'
                        : card.badge === 'addressed'
                          ? 'tos-need-card__badge tos-need-card__badge--addr'
                          : 'tos-need-card__badge tos-need-card__badge--need'
                    }
                  >
                    {card.badge === 'done'
                      ? 'Done'
                      : card.badge === 'addressed'
                        ? 'Addressed'
                        : 'Need'}
                  </span>
                </div>
                <p className="tos-need-card__text">{card.body}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'division' && (
          <div
            id="tos-panel-division"
            role="tabpanel"
            aria-labelledby="tos-tab-division"
            className="tos-division"
          >
            <div className="tos-division__tables">
              {SUMMARY_TABLE_TITLES.map(({ key, title }) => {
                const preset = AFC_SOUTH_RANK_PRESETS[key]
                const statOffset =
                  key === 'ppg'
                    ? 0
                    : key === 'ppgAllowed'
                      ? 2
                      : key === 'ypp'
                        ? 4
                        : 6
                return (
                  <div key={key} className="tos-mini-table">
                    <p className="tos-mini-table__title">
                      {title}
                      <span> | 2025 reg</span>
                    </p>
                    <table>
                      <tbody>
                        {orderedForStat.map((tid, rowIdx) => {
                          const rowData =
                            isAfcSouthPreset && preset
                              ? (preset[rowIdx] ?? {
                                  rank: 20 + rowIdx,
                                  value: (4 + rowIdx * 0.3).toFixed(1),
                                })
                              : {
                                  rank: 6 + rowIdx * 7 + statOffset,
                                  value: (
                                    30 -
                                    rowIdx * 1.4 -
                                    statOffset * 0.12
                                  ).toFixed(1),
                                }
                          const isSelf = tid === teamId
                          return (
                            <tr
                              key={tid}
                              className={
                                isSelf ? 'tos-mini-table__row--self' : undefined
                              }
                            >
                              <td>
                                <span className="tos-mini-table__rank">
                                  #{rowData.rank}
                                </span>
                              </td>
                              <td>
                                <div className="tos-mini-table__team">
                                  <img
                                    className="tos-mini-table__logo"
                                    src={ngsTeamLogoUrl(tid)}
                                    alt=""
                                  />
                                  <span className="tos-mini-table__name">
                                    {teamShortName(tid)}
                                  </span>
                                </div>
                              </td>
                              <td className="tos-mini-table__val">
                                {rowData.value}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              })}
            </div>
            <div
              className="tos-division__metrics"
              aria-label="Division metric shortcuts"
            >
              {DIVISION_METRIC_CHIPS.map((label) => (
                <span key={label} className="tos-metric-btn" role="note">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="team-central-offseason__foot">
        <span>Powered by</span>
        <img src={AMAZON_QUICK_ICON} alt="" />
        <span>Amazon Quick</span>
      </div>
    </section>
  )
}
