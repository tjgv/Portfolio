import type { PlayStyleComp } from './prospect-play-style-data'

type DraftProspectPlayStyleCompsProps = {
  comps: PlayStyleComp[]
}

export function DraftProspectPlayStyleComps({ comps }: DraftProspectPlayStyleCompsProps) {
  return (
    <ul className="draft-prospect-comps__grid">
      {comps.map((comp) => (
        <li key={`${comp.year}-${comp.name}`} className="draft-prospect-comps__cell">
          <p className="draft-prospect-comps__name">
            {comp.year} {comp.name}
          </p>
          <p className="draft-prospect-comps__similarity">{comp.similarity.toFixed(1)}%</p>
          <p className="draft-prospect-comps__prod">
            <span className="draft-prospect-comps__prod-label">NGS PROD</span>{' '}
            <span className="draft-prospect-comps__prod-value">{comp.ngsProd}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
