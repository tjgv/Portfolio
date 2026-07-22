import type { HighlightSlide } from './highlightsSlides'

export const SOLUTION_VIDEO_SLIDES: HighlightSlide[] = [
  {
    id: 'show-management',
    kind: 'video',
    caption:
      'The view is grounded by a library and queue system left/right rails — preparing key beats while keeping spontaneous scene switches available.',
    src: '/new-project-1/feature-show-management.mp4',
    ariaLabel: 'CX Pro show management and run of show view demonstration',
    aspectRatio: '1920 / 1046',
  },
  {
    id: 'guided-transitions',
    kind: 'video',
    caption:
      'Simplified, guided transitions reduce the multi-step engine sequence operators had to memorize for every scene change.',
    src: '/new-project-1/feature-guided-transitions.mp4',
    ariaLabel: 'CX Pro simplified and guided transitions — proposed experience',
    aspectRatio: '1500 / 1046',
    narrow: true,
  },
  {
    id: 'menu-planning',
    kind: 'video',
    caption:
      'Quick Cut lets operators jump to an unscheduled break, prepare feed changes, and return to the main event with minimal disruption.',
    src: '/new-project-1/feature-menu-planning.mp4',
    ariaLabel: 'CX Pro menu planning demonstration',
    aspectRatio: '1920 / 1046',
  },
  {
    id: 'ipad-compat',
    kind: 'video',
    caption:
      'An iPad gives speakers direct control of their shows, lets event staff multitask more freely, and makes the product more accessible.',
    src: '/new-project-1/ipad-trim2.mov',
    ariaLabel: 'CX Pro iPad compatibility demonstration',
    aspectRatio: '1920 / 1472',
    narrow: true,
  },
]
