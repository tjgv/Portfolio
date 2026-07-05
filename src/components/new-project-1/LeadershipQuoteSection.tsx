import './LeadershipQuoteSection.css'

const QUOTE_TEXT =
  'This is exactly the direction we needed. Splitting editing from show running finally gives new operators a way in without losing the depth our power users rely on.'
const QUOTE_NAME = 'Marcus T.'
const QUOTE_ROLE = 'Product Director'

export default function LeadershipQuoteSection() {
  return (
    <section
      className="np1-section np1-leadership-quote"
      data-dev-section="leadership-quote"
      aria-label="Leadership quote"
    >
      <div className="np1-section__inner">
        <div className="np1-single-quote-card">
          <blockquote className="np1-single-quote-card__quote">
            <p className="np1-single-quote-card__quote-text">&ldquo;{QUOTE_TEXT}&rdquo;</p>
          </blockquote>

          <div className="np1-single-quote-card__attribution">
            <p className="np1-single-quote-card__name">{QUOTE_NAME}</p>
            <p className="np1-single-quote-card__role">{QUOTE_ROLE}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
