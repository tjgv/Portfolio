import type { Ref } from 'react'
import './HeroQuoteSection.css'
import './LeadershipQuoteSection.css'

const DEFAULT_QUOTE_TEXT =
  'This is exactly the direction we needed. Splitting editing from show running finally gives new operators a way in without losing the depth our power users rely on.'
const DEFAULT_QUOTE_NAME = 'Marcus T.'
const DEFAULT_QUOTE_ROLE = 'Product Director'

type HeroQuoteSectionProps = {
  sectionRef?: Ref<HTMLElement>
  quote?: string
  name?: string
  role?: string
  ariaLabel?: string
  devSectionId?: string
}

export default function HeroQuoteSection({
  sectionRef,
  quote = DEFAULT_QUOTE_TEXT,
  name = DEFAULT_QUOTE_NAME,
  role = DEFAULT_QUOTE_ROLE,
  ariaLabel = 'Leadership quote',
  devSectionId = 'hero-quote',
}: HeroQuoteSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="np1-section np1-hero-quote"
      data-dev-section={devSectionId}
      aria-label={ariaLabel}
    >
      <div className="np1-section__inner np1-hero-quote__inner">
        <div className="np1-single-quote-card">
          <blockquote className="np1-single-quote-card__quote">
            <p className="np1-single-quote-card__quote-text">&ldquo;{quote}&rdquo;</p>
          </blockquote>

          <div className="np1-single-quote-card__attribution">
            <p className="np1-single-quote-card__name">{name}</p>
            <p className="np1-single-quote-card__role">{role}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
