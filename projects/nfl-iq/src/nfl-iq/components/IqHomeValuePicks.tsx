import { useState, type CSSProperties } from 'react'
import { useNavigate } from 'react-router-dom'
import { ngsTeamLogoUrl } from '../constants'
import { teamPrimaryColor } from '../data/team-colors'
import { draftTestFocusPath } from '../versions/option-a/draft-central-test/draft-test-focus-nav'
import {
  IQ_HOME_VALUE_PICKS_DAY1,
  IQ_HOME_VALUE_PICKS_DAY2,
  type IqHomeValuePick,
} from '../data/iq-home-value-picks'
type DayTab = 'day1' | 'day2'

function ValuePickCard({ pick }: { pick: IqHomeValuePick }) {
  const navigate = useNavigate()
  const teamColor = teamPrimaryColor(pick.teamId)

  return (
    <div className="iq-home-value-card-wrap">
      <button
        type="button"
        className="iq-home-value-card__hit"
        aria-label={`See the stats for ${pick.playerName}`}
        onClick={() => navigate(draftTestFocusPath(pick.playerName))}
      >
        <article
          className="iq-home-value-card"
          style={{ '--iq-value-card-team': teamColor } as CSSProperties}
        >
          <div className="iq-home-value-card__backdrop" aria-hidden />
          <div className="iq-home-value-card__content">
          <div className="iq-home-value-card__head">
            <div className="iq-home-value-card__metrics">
              <p className="iq-home-value-card__score">
                <span className="iq-home-value-card__value">{pick.overall}</span>
                <span className="iq-home-value-card__overall-label">OVERALL</span>
              </p>
              <p className="iq-home-value-card__pick-label">{pick.pickLabel}</p>
            </div>
            <img
              className="iq-home-value-card__logo"
              src={ngsTeamLogoUrl(pick.teamId)}
              alt=""
            />
          </div>
          <div className="iq-home-value-card__photo-wrap">
            <span className="iq-home-stat-cta iq-home-value-card__hover-cta" aria-hidden>
              SEE THE STATS
            </span>
            <img
              className="iq-home-value-card__photo"
              src={pick.playerPhotoUrl}
              alt=""
            />
          </div>
          </div>
        </article>
      </button>
      <div className="iq-home-value-card__footer">
        <span className="iq-home-value-card__caption">
          {pick.playerName} ({pick.position})
        </span>
        <img
          className="iq-home-value-card__school-logo"
          src={pick.schoolLogoUrl}
          alt=""
          title={pick.schoolAbbr}
        />
      </div>
    </div>
  )
}

export function IqHomeValuePicks() {
  const [day, setDay] = useState<DayTab>('day1')

  return (
    <section
      id="iq-home-value-picks"
      className="iq-home-value"
      aria-label="Value picks"
    >
      <div className="iq-home-value__head">
        <h2 className="iq-home-display iq-home-value__title">VALUE PICKS</h2>
        <div className="iq-home-value__tabs" role="tablist" aria-label="Draft day">
          <button
            id="iq-home-value-tab-day1"
            type="button"
            role="tab"
            aria-selected={day === 'day1'}
            aria-controls="iq-home-value-panel-day1"
            className={
              day === 'day1'
                ? 'iq-home-value__tab iq-home-value__tab--active'
                : 'iq-home-value__tab'
            }
            onClick={() => setDay('day1')}
          >
            DAY 1
          </button>
          <button
            id="iq-home-value-tab-day2"
            type="button"
            role="tab"
            aria-selected={day === 'day2'}
            aria-controls="iq-home-value-panel-day2"
            className={
              day === 'day2'
                ? 'iq-home-value__tab iq-home-value__tab--active'
                : 'iq-home-value__tab'
            }
            onClick={() => setDay('day2')}
          >
            DAY 2
          </button>
        </div>
      </div>
      <div className="iq-home-value__grid">
        <div
          id="iq-home-value-panel-day1"
          className="iq-home-value__panel"
          role="tabpanel"
          aria-labelledby="iq-home-value-tab-day1"
          hidden={day !== 'day1'}
        >
          {IQ_HOME_VALUE_PICKS_DAY1.map((pick) => (
            <ValuePickCard key={pick.pickLabel} pick={pick} />
          ))}
        </div>
        <div
          id="iq-home-value-panel-day2"
          className="iq-home-value__panel"
          role="tabpanel"
          aria-labelledby="iq-home-value-tab-day2"
          hidden={day !== 'day2'}
        >
          {IQ_HOME_VALUE_PICKS_DAY2.map((pick) => (
            <ValuePickCard key={pick.pickLabel} pick={pick} />
          ))}
        </div>
      </div>
    </section>
  )
}
