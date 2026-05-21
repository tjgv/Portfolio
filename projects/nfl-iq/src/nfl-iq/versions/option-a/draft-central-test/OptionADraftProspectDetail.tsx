import { useEffect, useMemo } from 'react'
import type { DraftBoardProspect } from '../../../types'
import { ngsTeamLogoUrl } from '../../../constants'
import { prospectStableKey } from '../../../utils/draft-ng-ranks'
import { prospectPortraitUrl } from './prospect-portrait'
import { DraftProspectArchetypeChart } from './DraftProspectArchetypeChart'
import { DraftProspectPlayStyleComps } from './DraftProspectPlayStyleComps'
import { DraftProspectPlayStyleHomePanel } from './DraftProspectPlayStyleHomePanel'
import { buildProspectPlayStyleProfile } from './prospect-play-style-data'
import { buildProspectPageMeta } from './prospect-profile-data'
import {
  formatProspectArm,
  formatProspectHand,
  formatProspectHeight,
  formatProspectWeight,
} from './format-prospect-measurements'
import '../../../components/draft-central-board.css'
import './option-a-draft-prospect-detail.css'

type OptionADraftProspectDetailProps = {
  prospect: DraftBoardProspect
  onBack: () => void
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="draft-prospect-detail__info-field">
      <dt className="draft-prospect-detail__info-label">{label}</dt>
      <dd className="draft-prospect-detail__info-value">{value}</dd>
    </div>
  )
}

function ordinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

export function OptionADraftProspectDetail({
  prospect,
  onBack,
}: OptionADraftProspectDetailProps) {
  const key = prospectStableKey(prospect)
  const portraitUrl = prospectPortraitUrl(key, prospect.name)
  const displayName = prospect.name.toUpperCase()

  const meta = useMemo(() => buildProspectPageMeta(prospect, key), [prospect, key])
  const playStyle = useMemo(
    () => buildProspectPlayStyleProfile(prospect, key),
    [prospect, key],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [key])

  return (
    <article
      className="draft-prospect-detail"
      aria-label={`${prospect.name} prospect profile`}
    >
      <div className="draft-prospect-detail__toolbar">
        <button
          type="button"
          className="draft-prospect-detail__back"
          data-solution-tour="draft-prospect-back"
          onClick={onBack}
        >
          <svg
            className="draft-prospect-detail__back-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              fill="currentColor"
            />
          </svg>
          Draft Central
        </button>
      </div>

      <div className="draft-prospect-detail__page">
        <div className="draft-prospect-detail__top-grid">
          <section className="draft-prospect-detail__card draft-prospect-detail__card--identity">
            <div className="draft-prospect-detail__identity-photo-wrap">
              <img
                className="draft-prospect-detail__identity-photo"
                src={portraitUrl}
                alt=""
              />
            </div>
            <h1 className="draft-prospect-detail__identity-name">{displayName}</h1>
            <p className="draft-prospect-detail__identity-school">
              {prospect.schoolAbbr || prospect.school}
              <span className="draft-prospect-detail__identity-sep" aria-hidden>
                |
              </span>
              <span className="draft-prospect-detail__position-pill">
                {prospect.position}
              </span>
            </p>
          </section>

          <section className="draft-prospect-detail__card draft-prospect-detail__card--info">
            <h2 className="draft-prospect-detail__card-title">Prospect Info</h2>
            <dl className="draft-prospect-detail__info-grid">
              <InfoField label="College" value={prospect.school} />
              <InfoField label="Hometown" value={meta.hometown} />
              <InfoField label="Class" value={meta.classYear} />
              <InfoField label="Height" value={formatProspectHeight(prospect.ht)} />
              <InfoField label="Weight" value={formatProspectWeight(prospect.wt)} />
              <InfoField label="Arm" value={formatProspectArm(prospect.arm)} />
              <InfoField label="Hand" value={formatProspectHand(prospect.hand)} />
            </dl>
          </section>

          <section className="draft-prospect-detail__card draft-prospect-detail__card--grade">
            <h2 className="draft-prospect-detail__card-title">Prospect Grade</h2>
            <p className="draft-prospect-detail__grade-value">{meta.prospectGrade}</p>
            <p className="draft-prospect-detail__grade-label">
              {meta.gradeLabel}
              <span className="draft-prospect-detail__grade-info" aria-hidden>
                ⓘ
              </span>
            </p>
            <div className="draft-prospect-detail__grade-ngs">
              <span className="fa-board__ngs-logo" aria-hidden>
                <span className="fa-board__ngs-logo-ng">Next Gen </span>
                <span className="fa-board__ngs-logo-stats">Stats</span>
              </span>
              <span className="draft-prospect-detail__grade-ngs-score">
                {prospect.overall}
              </span>
              <span className="draft-prospect-detail__grade-ngs-tier">
                {meta.ngsTierLabel}
              </span>
              <span
                className={`draft-prospect-detail__grade-ngs-bar draft-prospect-detail__grade-ngs-bar--${meta.ngsTier}`}
                aria-hidden
              />
            </div>
            <button type="button" className="draft-prospect-detail__link-btn">
              View All Prospects
            </button>
          </section>

          <section className="draft-prospect-detail__card draft-prospect-detail__card--draft">
            <h2 className="draft-prospect-detail__card-title">2026 Draft Results</h2>
            <div className="draft-prospect-detail__draft-team">
              <img
                className="draft-prospect-detail__draft-logo"
                src={ngsTeamLogoUrl(meta.draftTeamId)}
                alt=""
              />
              <p className="draft-prospect-detail__draft-by">
                Drafted by {meta.draftTeamName}
              </p>
            </div>
            <p className="draft-prospect-detail__draft-pick">
              Round {meta.draftRound} · Pick {meta.draftPick}
            </p>
            <button type="button" className="draft-prospect-detail__link-btn">
              Read More
            </button>
          </section>
        </div>

        <section
          className="draft-prospect-detail__card draft-prospect-detail__card--breakdown"
          aria-label="Next Gen Stats score breakdown"
        >
          <h2 className="draft-prospect-detail__card-title draft-prospect-detail__card-title--breakdown">
            Next Gen Stats Score Breakdown
          </h2>
          <div className="draft-prospect-detail__breakdown-grid">
            <div className="draft-prospect-detail__breakdown-col draft-prospect-detail__breakdown-col--prod">
              <h3 className="draft-prospect-detail__breakdown-label">
                Production Score
              </h3>
              <p className="draft-prospect-detail__breakdown-score">
                {prospect.production}
              </p>
              <p className="draft-prospect-detail__breakdown-rank">
                2026 Combine {meta.combineGroup} Rank: {ordinal(meta.productionRank)}
              </p>
            </div>
            <div className="draft-prospect-detail__breakdown-col draft-prospect-detail__breakdown-col--ath">
              <h3 className="draft-prospect-detail__breakdown-label">
                Athleticism Score <span className="draft-prospect-detail__est">*est</span>
              </h3>
              <p className="draft-prospect-detail__breakdown-score">
                {prospect.athleticism}
              </p>
              <p className="draft-prospect-detail__breakdown-rank">
                2026 Combine {meta.combineGroup} Rank: {ordinal(meta.athleticismRank)}
              </p>
            </div>
            <div className="draft-prospect-detail__breakdown-col draft-prospect-detail__breakdown-col--total">
              <h3 className="draft-prospect-detail__breakdown-label">Total Score</h3>
              <p className="draft-prospect-detail__breakdown-score">
                {prospect.overall}
              </p>
              <p className="draft-prospect-detail__breakdown-rank">
                2026 Combine {meta.combineGroup} Rank: {ordinal(meta.totalRank)}
              </p>
            </div>
          </div>
        </section>

        <div className="draft-prospect-detail__play-style-row">
          <section
            className="draft-prospect-detail__card draft-prospect-detail__card--archetype"
            data-solution-tour="prospect-archetype-percentiles"
            aria-label="Archetype percentiles"
          >
            <h2 className="draft-prospect-detail__card-title">Archetype Percentiles</h2>
            <DraftProspectArchetypeChart slices={playStyle.archetypes} />
          </section>

          <section
            className="draft-prospect-detail__card draft-prospect-detail__card--play-style-home"
            data-solution-tour="prospect-play-style-home"
            aria-label="Play style comparison"
          >
            <DraftProspectPlayStyleHomePanel />
          </section>
        </div>

        <section
          className="draft-prospect-detail__card draft-prospect-detail__card--comps"
          aria-label="Top play style comparisons"
        >
          <h2 className="draft-prospect-detail__card-title">Top Play Style Comps</h2>
          <DraftProspectPlayStyleComps comps={playStyle.comps} />
          <footer className="draft-prospect-detail__nfl-bar">
            NFL.com Comparison: <strong>{playStyle.nflComparison}</strong>
          </footer>
        </section>
      </div>
    </article>
  )
}
