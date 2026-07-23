export type HighlightImageSlide = {
  id: string
  caption: string
  kind: 'image'
  image: string
  imageAlt: string
}

export type HighlightVideoSlide = {
  id: string
  caption: string
  kind: 'video'
  src: string
  ariaLabel: string
  aspectRatio?: string
  objectPosition?: string
  playbackRate?: number
  /** Narrower slide so a taller video matches the default frame height. */
  narrow?: boolean
  /** Drop this many seconds from the end of playback (source file unchanged). */
  endTrimSeconds?: number
}

export type HighlightSlide = HighlightImageSlide | HighlightVideoSlide

export const HIGHLIGHT_SLIDES: HighlightSlide[] = [
  {
    id: 'tablet-ui',
    kind: 'image',
    caption: 'CX Pro on iPad. A touch-first interface built for operators on the move.',
    image: '/new-project-1/intro-tablet.png',
    imageAlt: 'CX Pro interface on iPad in landscape orientation',
  },
  {
    id: 'sports',
    kind: 'image',
    caption: 'Run complex sports shows from the palm of your hand.',
    image: '/new-project-1/use-case-sports.png',
    imageAlt: 'Sports show in the Cosm dome',
  },
  {
    id: 'studio',
    kind: 'image',
    caption: 'Studio workflows, simplified for tablet control.',
    image: '/new-project-1/use-case-studio.png',
    imageAlt: 'Studio show with audience viewing immersive dome content',
  },
  {
    id: 'tool',
    kind: 'image',
    caption: 'Full show management power — scaled to iPad dimensions.',
    image: '/new-project-1/v2.1.png',
    imageAlt: 'CX Pro show management interface',
  },
]

export const AUTOPLAY_MS = 5000
