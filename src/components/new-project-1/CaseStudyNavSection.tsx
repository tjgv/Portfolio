import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ImgWithLoader } from '../MediaLoader'
import {
  getCaseStudyNeighbors,
  type CaseStudySlug,
} from '../../data/caseStudies'
import './CaseStudyNavSection.css'

type CaseStudyNavSectionProps = {
  currentSlug: CaseStudySlug
  theme?: 'dark' | 'light'
}

export default function CaseStudyNavSection({
  currentSlug,
  theme = 'dark',
}: CaseStudyNavSectionProps) {
  const { prev, next } = getCaseStudyNeighbors(currentSlug)

  if (!prev && !next) return null

  return (
    <section
      className={`np1-case-study-nav np1-case-study-nav--${theme}`}
      data-dev-section="case-study-nav"
      aria-label="More case studies"
    >
      <nav className="np1-case-study-nav__row" aria-label="Case study carousel">
        {prev ? (
          <Link
            to={prev.route}
            className="np1-case-study-nav__card np1-case-study-nav__card--prev"
          >
            <ImgWithLoader
              className="np1-case-study-nav__thumb"
              src={prev.thumbnail}
              alt=""
              aria-hidden="true"
            />
            <span className="np1-case-study-nav__copy">
              <span className="np1-case-study-nav__cta-row">
                <ArrowLeft className="np1-case-study-nav__arrow" size={16} strokeWidth={2.25} aria-hidden />
                <span className="np1-case-study-nav__cta">View Previous</span>
              </span>
              <span className="np1-case-study-nav__title">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <div className="np1-case-study-nav__spacer" aria-hidden="true" />
        )}

        {next ? (
          <Link
            to={next.route}
            className="np1-case-study-nav__card np1-case-study-nav__card--next"
          >
            <span className="np1-case-study-nav__copy">
              <span className="np1-case-study-nav__title">{next.title}</span>
              <span className="np1-case-study-nav__cta-row">
                <span className="np1-case-study-nav__cta">View Next</span>
                <ArrowRight className="np1-case-study-nav__arrow" size={16} strokeWidth={2.25} aria-hidden />
              </span>
            </span>
            <ImgWithLoader
              className="np1-case-study-nav__thumb"
              src={next.thumbnail}
              alt=""
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div className="np1-case-study-nav__spacer" aria-hidden="true" />
        )}
      </nav>
    </section>
  )
}
