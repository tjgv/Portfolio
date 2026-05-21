import { useMemo, useState } from 'react'
import {
  COMBINE_TRACKING_DATA,
  COMBINE_TRACKING_YEARS,
} from '../data/combine-tracking-data'
import type {
  CombineTrackingPanel,
  CombineTrackingRow,
} from '../types/combine-tracking'
import { CombineTrackingPlayerDetail } from './CombineTrackingPlayerDetail'
import { SchoolTableCell } from './SchoolTableCell'
import './combine-tracking.css'
import './combine-tracking-player-detail.css'

type CombineTrackingBoardProps = {
  data?: typeof COMBINE_TRACKING_DATA
}

function CombineTrackingTable({
  panel,
  rows,
}: {
  panel: CombineTrackingPanel
  rows: CombineTrackingRow[]
}) {
  return (
    <div className="combine-tracking__table-scroll">
      <table className="combine-tracking__table">
        <thead>
          <tr>
            <th scope="col" className="combine-tracking__th--player">Player</th>
            <th scope="col">Pos</th>
            <th scope="col">School</th>
            <th scope="col">Year</th>
            <th
              scope="col"
              className="combine-tracking__th combine-tracking__th--metric"
            >
              {panel.metricColumnLabel}
            </th>
            {panel.showTimeColumn ? <th scope="col">Time</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.player}-${row.year}-${row.metric}`}>
              <td className="combine-tracking__td combine-tracking__td--player">
                {row.player}
              </td>
              <td>{row.position}</td>
              <SchoolTableCell
                className="combine-tracking__td combine-tracking__td--school"
                schoolAbbr={row.school}
              />
              <td>{row.year}</td>
              <td className="combine-tracking__td combine-tracking__td--metric">
                {row.metric}
              </td>
              {panel.showTimeColumn ? <td>{row.time ?? '—'}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CombineTrackingPanelCard({
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
      <CombineTrackingTable panel={panel} rows={filteredRows} />
    </article>
  )
}

export function CombineTrackingBoard({
  data = COMBINE_TRACKING_DATA,
}: CombineTrackingBoardProps) {
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
              <CombineTrackingPanelCard
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
