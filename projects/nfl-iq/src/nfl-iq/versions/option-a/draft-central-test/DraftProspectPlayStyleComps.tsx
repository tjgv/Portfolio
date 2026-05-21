import type { PlayStyleComp } from './prospect-play-style-data'

type DraftProspectPlayStyleCompsProps = {
  comps: PlayStyleComp[]
  layout?: 'default' | 'tile'
}

export function DraftProspectPlayStyleComps({
  comps,
  layout = 'default',
}: DraftProspectPlayStyleCompsProps) {
  return (
    <ul
      className={
        layout === 'tile'
          ? 'draft-prospect-comps__grid draft-prospect-comps__grid--tile'
          : 'draft-prospect-comps__grid'
      }
    >
      {comps.map((comp) => (
        <li key={`${comp.year}-${comp.name}`} className="draft-prospect-comps__cell">
          <p className="draft-prospect-comps__name">
            {comp.year} {comp.name}
          </p>
          <p className="draft-prospect-comps__similarity">
            <span className="draft-prospect-comps__metric-label">Similarity Score:</span>{' '}
            {comp.similarity.toFixed(1)}%
          </p>
          <p className="draft-prospect-comps__prod">
            <span className="draft-prospect-comps__metric-label">NGS PROD Score:</span>{' '}
            <span className="draft-prospect-comps__prod-value">{comp.ngsProd}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
