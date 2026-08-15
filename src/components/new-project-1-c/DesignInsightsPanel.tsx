import { useState } from 'react'
import AnimatedPieChart from './AnimatedPieChart'
import {
  INSIGHT_DATA,
  INSIGHT_LEGEND,
  INSIGHT_PERSONAS,
  INSIGHT_TABS,
  insightSegment,
  type InsightTabId,
} from './designInsightsData'
import './DesignInsightsPanel.css'

export default function DesignInsightsPanel() {
  const [tab, setTab] = useState<InsightTabId>('sports')
  const set = INSIGHT_DATA[tab]

  return (
    <div className="np1c-insights">
      <header className="np1c-insights__header">
        <h2 className="np1c-insights__title">Labor Distribution</h2>
        <div className="np1c-insights__tabs" role="tablist" aria-label="Venue type">
          {INSIGHT_TABS.map((item) => {
            const selected = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`np1c-insights__tab${selected ? ' np1c-insights__tab--active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <ul className="np1c-insights__legend">
          {INSIGHT_LEGEND.map((id) => {
            const seg = insightSegment(id)
            return (
              <li key={seg.id} className="np1c-insights__legend-item">
                <span className="np1c-insights__swatch" style={{ background: seg.color }} />
                {seg.label}
              </li>
            )
          })}
        </ul>
      </header>

      <div className="np1c-insights__charts">
        <div className="np1c-insights__col np1c-insights__col--left">
          <div className="np1c-insights__aggregate-chart">
            <AnimatedPieChart shares={set.final} size="large" label="Aggregate labor distribution" />
          </div>
          <p className="np1c-insights__aggregate-label">Aggregate</p>
        </div>

        <div className="np1c-insights__col np1c-insights__col--right">
          {INSIGHT_PERSONAS.map((persona) => (
            <article key={persona.id} className="np1c-insights__cell">
              <div className="np1c-insights__cell-chart">
                <AnimatedPieChart
                  shares={set.personas[persona.id]}
                  size="small"
                  label={`${persona.name} labor distribution`}
                />
              </div>
              <div className="np1c-insights__cell-copy">
                <div className="np1c-insights__persona-identity">
                  <h3 className="np1c-insights__persona-name">{persona.name}</h3>
                  <p className="np1c-insights__persona-role">{persona.role}</p>
                </div>
                <p className="np1c-insights__concerns-label">Most Concerned With:</p>
                <ul className="np1c-insights__concerns">
                  {set.concerns[persona.id].map((concern, index) => {
                    const seg = insightSegment(concern.segmentId)
                    return (
                      <li key={`${persona.id}-${concern.segmentId}`} className="np1c-insights__concern">
                        <span
                          className="np1c-insights__concern-rank"
                          style={{ background: seg.color }}
                        >
                          #{index + 1}
                        </span>
                        <span className="np1c-insights__concern-label">{seg.shortLabel}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
