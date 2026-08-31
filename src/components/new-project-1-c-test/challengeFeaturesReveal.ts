import type { CarouselSlide } from './ImageCarousel'

/** Previous Challenge inline image — shown in the fullscreen lightbox. */
const FEATURES_BREAKDOWN_SLIDES: readonly CarouselSlide[] = [
  {
    id: 'features-breakdown',
    type: 'image',
    src: '/new-project-1/hypothesis-analysis.png',
    alt: 'Annotated breakdown of Show Running and Building & Editing features in CX Pro',
    caption: '',
  },
]

export const CHALLENGE_FEATURES_REVEAL = {
  ctaLabel: 'View Features Breakdown',
  buttonAriaLabel: 'Open features breakdown overlay',
  modal: {
    ariaLabel: 'Features breakdown',
    hideHero: true,
    variant: 'lightbox' as const,
    subsections: [
      {
        id: 'features-breakdown',
        carousel: FEATURES_BREAKDOWN_SLIDES,
        carouselAriaLabel: 'Features breakdown image',
      },
    ],
  },
} as const
