import type { CSSProperties } from 'react'
import { NFL_IQ_LOGO, NFL_LOGO, ngsTeamLogoUrl } from '../constants'
import { FREE_AGENCY_HEADLINES } from '../data/free-agency-headlines.mock'
import './free-agency-headlines.css'

import { publicAsset } from '../lib/app-paths'

const AMAZON_QUICK_ICON = publicAsset('/images/amazon-quick-icon.png')

export function FreeAgencyHeadlines() {
  return (
    <div className="fa-headlines-wrap">
      <section className="fa-headlines" aria-label="Offseason headlines">
        <div className="fa-headlines__brand">
          <div className="fa-headlines__logos">
            <img
              className="fa-headlines__nfl-logo"
              src={NFL_LOGO}
              alt=""
              width={32}
              height={32}
            />
            <img
              className="fa-headlines__iq-logo"
              src={NFL_IQ_LOGO}
              alt="NFL IQ"
              height={22}
            />
          </div>
          <h2 className="fa-headlines__title">Offseason Headlines</h2>
        </div>

        {FREE_AGENCY_HEADLINES.map((item) => (
          <article
            key={`${item.teamId}-${item.date}`}
            className="fa-headlines__item"
            style={
              { '--fa-headline-accent': item.accentColor } as CSSProperties
            }
          >
            <img
              className="fa-headlines__team-logo"
              src={ngsTeamLogoUrl(item.teamId)}
              alt=""
              width={28}
              height={28}
            />
            <p className="fa-headlines__text">
              <strong>
                {item.date} | {item.teamName}
              </strong>{' '}
              {item.body}
            </p>
          </article>
        ))}
      </section>

      <p className="fa-headlines__attribution">
        <img src={AMAZON_QUICK_ICON} alt="" width={14} height={14} />
        Powered by Amazon Quick
      </p>
    </div>
  )
}
