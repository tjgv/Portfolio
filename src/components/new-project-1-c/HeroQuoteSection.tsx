import type { Ref } from 'react'
import QuoteCarousel, { type QuoteSlide } from './QuoteCarousel'
import './HeroQuoteSection.css'

/** Shared by the opening hero quote and the end / results quote. */
export const HERO_QUOTES: readonly QuoteSlide[] = [
  {
    id: 'sarah',
    text: 'If we can stop everything right now and focus on building this, I would be so happy.',
    name: 'Sarah S.',
    role: 'Lead Dome Operator',
  },
  {
    id: 'kimi',
    text: 'I feel like I know what to do just by looking at it. How soon are we going to get this?',
    name: 'Kimi K.',
    role: 'Operator Intern',
  },
  {
    id: 'niel',
    text: 'This would be such a lifesaver. I always dread transitioning, but this makes it feel bulletproof.',
    name: 'Niel J.',
    role: 'Operator New Hire',
  },
] as const

type HeroQuoteSectionProps = {
  sectionRef?: Ref<HTMLElement>
  ariaLabel?: string
  devSectionId?: string
}

export default function HeroQuoteSection({
  sectionRef,
  ariaLabel = 'Leadership quote',
  devSectionId = 'hero-quote',
}: HeroQuoteSectionProps) {
  return (
    <section
      ref={sectionRef}
      className="np1c-section np1c-hero-quote"
      data-dev-section={devSectionId}
      aria-label={ariaLabel}
    >
      <div className="np1c-section__inner np1c-hero-quote__inner">
        <QuoteCarousel quotes={HERO_QUOTES} cardDevSectionId={`${devSectionId}-card`} />
      </div>
    </section>
  )
}
