import type { ArchetypeSlice } from './prospect-play-style-data'

type DraftProspectArchetypeChartProps = {
  slices: ArchetypeSlice[]
  layout?: 'default' | 'tile'
}

/** Three-circle archetype layout (NFL.com hover style). */
export function DraftProspectArchetypeChart({
  slices,
  layout = 'default',
}: DraftProspectArchetypeChartProps) {
  const [primary, secondary, tertiary] = slices
  const isTile = layout === 'tile'

  return (
    <div
      className={
        isTile
          ? 'draft-prospect-archetype draft-prospect-archetype--tile'
          : 'draft-prospect-archetype'
      }
    >
      <div className="draft-prospect-archetype__venn">
        <svg
          className="draft-prospect-archetype__svg"
          viewBox={isTile ? '0 0 320 200' : '0 0 300 150'}
          role="img"
          aria-label={`Archetype percentiles: ${slices.map((s) => `${s.label} ${s.pct}%`).join(', ')}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {tertiary ? (
            <circle
              cx={isTile ? 218 : 200}
              cy={isTile ? 128 : 98}
              r={isTile ? 36 : 28}
              fill={tertiary.color}
              fillOpacity={0.35}
              stroke={tertiary.color}
              strokeWidth={1.5}
            />
          ) : null}
          {secondary ? (
            <circle
              cx={isTile ? 168 : 155}
              cy={isTile ? 92 : 72}
              r={isTile ? 52 : 40}
              fill={secondary.color}
              fillOpacity={0.4}
              stroke={secondary.color}
              strokeWidth={1.5}
            />
          ) : null}
          {primary ? (
            <circle
              cx={isTile ? 128 : 118}
              cy={isTile ? 100 : 78}
              r={isTile ? 76 : 58}
              fill={primary.color}
              fillOpacity={0.42}
              stroke={primary.color}
              strokeWidth={1.5}
            />
          ) : null}
        </svg>
      </div>
      <ul className="draft-prospect-archetype__labels">
        {slices.map((slice) => (
          <li key={slice.label} className="draft-prospect-archetype__label">
            <span
              className="draft-prospect-archetype__swatch"
              style={{ backgroundColor: slice.color }}
              aria-hidden
            />
            <span className="draft-prospect-archetype__label-text">
              {slice.label}{' '}
              <strong>{slice.pct.toFixed(1)}%</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
