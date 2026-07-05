import { Link } from 'react-router-dom'
import { ImgWithLoader } from '../MediaLoader'
import './CaseStudyNavSection.css'

const NEXT_CASE_STUDIES = [
  {
    id: 'project1',
    href: '/project1',
    title: 'CX Pro',
    thumbnail: '/project1-cx.png',
    align: 'left',
  },
  {
    id: 'project2',
    href: '/project2',
    title: 'Validus',
    thumbnail: '/project2-events.png',
    align: 'right',
  },
] as const

export default function CaseStudyNavSection() {
  return (
    <section
      className="np1-case-study-nav"
      data-dev-section="case-study-nav"
      aria-label="More case studies"
    >
      <nav className="np1-case-study-nav__row" aria-label="More case studies">
        {NEXT_CASE_STUDIES.map((study) => (
          <Link
            key={study.id}
            to={study.href}
            className={`np1-case-study-nav__card np1-case-study-nav__card--${study.align}`}
          >
            <ImgWithLoader
              className="np1-case-study-nav__thumb"
              src={study.thumbnail}
              alt=""
              aria-hidden="true"
            />
            <span className="np1-case-study-nav__copy">
              <span className="np1-case-study-nav__title">{study.title}</span>
              <span className="np1-case-study-nav__cta">View Case Study</span>
            </span>
          </Link>
        ))}
      </nav>
    </section>
  )
}
