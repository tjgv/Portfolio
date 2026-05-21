import { ngsTeamLogoUrl } from '../../../constants'
import { getDivisionForTeam } from '../data/nfl-divisions'
import { getTeamSpendingProfile } from '../data/team-spending.mock'
import type { SpendingMetric } from '../data/team-spending.mock'
import { TopNeedsTags } from './TopNeedsTags'
import './free-agency-spending-panel.css'

type FreeAgencySpendingPanelProps = {
  teamId: string
}

const RIVAL_COL_COUNT = 3

function RankBadge({ rank, tone }: { rank: number; tone: SpendingMetric['rankTone'] }) {
  return <span className={`fa-spending__rank-badge fa-spending__rank-badge--${tone}`}>#{rank}</span>
}

function SpendingMeter({ level }: { level: number }) {
  const fill = Math.min(100, Math.max(0, level))

  return (
    <div
      className="fa-spending__meter"
      role="img"
      aria-label={`Spending gauge at ${fill} percent`}
    >
      <div className="fa-spending__meter-track">
        <div
          className="fa-spending__meter-fill"
          style={{ height: `${fill}%` }}
        />
      </div>
    </div>
  )
}

function MetricRow({ metric, alignMeter }: { metric: SpendingMetric; alignMeter?: boolean }) {
  const ranks = metric.divisionRanks.slice(0, RIVAL_COL_COUNT)
  while (ranks.length < RIVAL_COL_COUNT) {
    ranks.push(0)
  }

  const hasMeter = metric.meterLevel != null

  return (
    <div className="fa-spending__row" role="row">
      <div className="fa-spending__team-col" role="cell">
        <div className="fa-spending__metric-cell fa-spending__metric-cell--with-meter">
          <div className="fa-spending__metric-body">
            {hasMeter ? (
              <SpendingMeter level={metric.meterLevel!} />
            ) : alignMeter ? (
              <div className="fa-spending__meter fa-spending__meter--spacer" aria-hidden />
            ) : null}
            <div className="fa-spending__metric-content">
              <span className="fa-spending__metric-label">{metric.label}</span>
              <div className="fa-spending__metric-row">
                <span className="fa-spending__metric-value">{metric.value}</span>
                <RankBadge rank={metric.rank} tone={metric.rankTone} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fa-spending__row-gap" aria-hidden />
      <div className="fa-spending__rivals" role="cell">
        {ranks.map((rank, i) => (
          <div key={`${metric.label}-rival-${i}`} className="fa-spending__rival-col">
            <span className="fa-spending__division-rank">#{rank}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function FreeAgencySpendingPanel({ teamId }: FreeAgencySpendingPanelProps) {
  const profile = getTeamSpendingProfile(teamId)
  const divisionPeers = getDivisionForTeam(teamId).filter((id) => id !== teamId)

  return (
    <div className="fa-spending">
      <div className="fa-spending__table" role="table" aria-label="Team spending">
        <header className="fa-spending__head" role="row">
          <div className="fa-spending__head-team" role="columnheader">
            <span className="fa-spending__head-title">Market Capacity</span>
          </div>
          <div className="fa-spending__head-gap" aria-hidden />
          <div className="fa-spending__head-rivals" role="columnheader">
            {divisionPeers.slice(0, RIVAL_COL_COUNT).map((peerId) => (
              <div key={peerId} className="fa-spending__head-rival">
                <img
                  className="fa-spending__header-logo"
                  src={ngsTeamLogoUrl(peerId)}
                  alt=""
                  width={28}
                  height={28}
                />
              </div>
            ))}
            {divisionPeers.length < RIVAL_COL_COUNT
              ? Array.from({ length: RIVAL_COL_COUNT - divisionPeers.length }).map(
                  (_, i) => (
                    <div key={`spacer-${i}`} className="fa-spending__head-rival" aria-hidden />
                  ),
                )
              : null}
          </div>
        </header>

        <MetricRow metric={profile.capSpace} />
        <MetricRow metric={profile.activeCapSpending} />
        <MetricRow metric={profile.deadMoney} alignMeter />
      </div>

      <section className="fa-spending__needs" aria-label="Top needs">
        <p className="fa-spending__needs-label">Top Needs</p>
        <TopNeedsTags tags={profile.topNeeds} />
      </section>
    </div>
  )
}
