export type HighlightSlide = {
  id: string
  caption: string
  image: string
  imageAlt: string
}

export const HIGHLIGHT_SLIDES: HighlightSlide[] = [
  {
    id: 'tablet-ui',
    caption: 'CX Pro on iPad. A touch-first interface built for operators on the move.',
    image: '/new-project-1/intro-tablet.png',
    imageAlt: 'CX Pro interface on iPad in landscape orientation',
  },
  {
    id: 'sports',
    caption: 'Run complex sports shows from the palm of your hand.',
    image: '/new-project-1/use-case-sports.png',
    imageAlt: 'Sports show in the Cosm dome',
  },
  {
    id: 'studio',
    caption: 'Studio workflows, simplified for tablet control.',
    image: '/new-project-1/use-case-studio.png',
    imageAlt: 'Studio show with audience viewing immersive dome content',
  },
  {
    id: 'tool',
    caption: 'Full show management power — scaled to iPad dimensions.',
    image: '/new-project-1/v2.1.png',
    imageAlt: 'CX Pro show management interface',
  },
]

export const AUTOPLAY_MS = 5000
