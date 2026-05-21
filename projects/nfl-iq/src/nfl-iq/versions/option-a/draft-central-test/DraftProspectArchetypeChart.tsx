import type { ArchetypeSlice } from './prospect-play-style-data'

type DraftProspectArchetypeChartProps = {
  slices: ArchetypeSlice[]
}

/** Three-circle archetype layout (NFL.com hover style). */
export function DraftProspectArchetypeChart({
  slices,
}: DraftProspectArchetypeChartProps) {
  const [primary, secondary, tertiary] = slices

  return (
    <div className="draft-prospect-archetype">
      <svg
        className="draft-prospect-archetype__svg"
        viewBox="0 0 300 150"
        role="img"
        aria-label={`Archetype percentiles: ${slices.map((s) => `${s.label} ${s.pct}%`).join(', ')}`}
      >
        {tertiary ? (
          <circle
            cx={200}
            cy={98}
            r={28}
            fill={tertiary.color}
            fillOpacity={0.35}
            stroke={tertiary.color}
            strokeWidth={1.5}
          />
        ) : null}
        {secondary ? (
          <circle
            cx={155}
            cy={72}
            r={40}
            fill={secondary.color}
            fillOpacity={0.4}
            stroke={secondary.color}
            strokeWidth={1.5}
          />
        ) : null}
        {primary ? (
          <circle
            cx={118}
            cy={78}
            r={58}
            fill={primary.color}
            fillOpacity={0.42}
            stroke={primary.color}
            strokeWidth={1.5}
          />
        ) : null}
      </svg>
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
