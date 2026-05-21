import { useMemo, useState } from 'react'
import { CombineTrackingPlayerDetail } from '../../../components/CombineTrackingPlayerDetail'
import {
  COMBINE_TRACKING_DATA,
  COMBINE_TRACKING_YEARS,
} from '../../../data/combine-tracking-data'
import type { CombineTrackingData, CombineTrackingPanel } from '../../../types/combine-tracking'
import { OptionACombineTrackingTable } from './OptionACombineTrackingTable'
import '../../../components/combine-tracking.css'
import '../../../components/combine-tracking-player-detail.css'

type OptionACombineTrackingBoardProps = {
  data?: CombineTrackingData
}

function OptionACombineTrackingPanelCard({
  panel,
  yearFilter,
}: {
  panel: CombineTrackingPanel
  yearFilter: string
}) {
  const [metricKey, setMetricKey] = useState(panel.defaultDropdownValue)

  const filteredRows = useMemo(() => {
    return panel.rows.filter((row) => {
      return yearFilter === 'All' || String(row.year) === yearFilter
    })
  }, [panel.rows, yearFilter])

  return (
    <article className="combine-tracking__panel">
      <div className="combine-tracking__panel-head">
        <p className="combine-tracking__view-label">{panel.viewLabel}</p>
        <select
          className="combine-tracking__select"
          value={metricKey}
          onChange={(e) => setMetricKey(e.target.value)}
          aria-label={`${panel.titleBold}${panel.titleRest} metric`}
        >
          {panel.dropdownOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <h3 className="combine-tracking__panel-title">
          <span className="combine-tracking__panel-title--bold">
            {panel.titleBold}
          </span>
          {panel.titleRest}
        </h3>
      </div>
      <OptionACombineTrackingTable panel={panel} rows={filteredRows} />
    </article>
  )
}

export function OptionACombineTrackingBoard({
  data = COMBINE_TRACKING_DATA,
}: OptionACombineTrackingBoardProps) {
  const [yearFilter, setYearFilter] = useState<string>('2026')

  return (
    <div className="combine-tracking">
      <div className="combine-tracking__filters">
        <div className="combine-tracking__filter-group" aria-label="Draft year">
          {COMBINE_TRACKING_YEARS.map((year) => (
            <button
              key={year}
              type="button"
              className={
                yearFilter === year
                  ? 'combine-tracking__filter combine-tracking__filter--active'
                  : 'combine-tracking__filter'
              }
              onClick={() => setYearFilter(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="combine-tracking__panels-wrap">
        <div className="combine-tracking__panels">
          {data.panels.map((panel) => (
            <div key={panel.id} className="combine-tracking__panel-shell">
              <OptionACombineTrackingPanelCard
                panel={panel}
                yearFilter={yearFilter}
              />
            </div>
          ))}
        </div>
      </div>

      <CombineTrackingPlayerDetail />

      <p className="combine-tracking__footnote">
        Speed metrics are shown in miles per hour (MPH), acceleration is shown in
        yards per second squared (y/s/s)
      </p>
    </div>
  )
}
