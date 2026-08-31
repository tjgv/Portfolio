import type { CarouselSlide } from './ImageCarousel'

const JOURNEY_MAPS_SLIDES: readonly CarouselSlide[] = [
  {
    id: 'journey-map-sporting-event',
    type: 'image',
    src: '/new-project-1/journey-map-1.png',
    alt: 'Journey map for a sporting event, from dome setup through post-game monitoring',
    caption:
      'Sporting event — mapping the operator\u2019s actions, touchpoints, and pain points from dome setup through post-game monitoring.',
  },
  {
    id: 'journey-map-studio-event',
    type: 'image',
    src: '/new-project-1/journey-map-2.png',
    alt: 'Journey map for a studio event, from run-of-show setup through post-show monitoring',
    caption:
      'Studio event — the same framework applied to a studio production, surfacing where predictability and error risk differ from live sports.',
  },
]

export const JOURNEY_MAPS_REVEAL = {
  ctaLabel: 'View Journey Maps',
  buttonAriaLabel: 'Open journey maps overlay',
  modal: {
    ariaLabel: 'Journey maps',
    hideHero: true,
    variant: 'lightbox' as const,
    subsections: [
      {
        id: 'journey-maps',
        carousel: JOURNEY_MAPS_SLIDES,
        carouselAriaLabel: 'Journey map slides',
      },
    ],
  },
} as const
