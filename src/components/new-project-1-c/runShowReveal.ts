const RUN_SHOW_IMAGE = '/new-project-1/run-show.png'
const RUN_SHOW_MODAL_IMAGE = '/new-project-1/run-show-1.png'
const TRANSITION_SUPPORT_VIDEO = '/new-project-1/feature-transition-support.mp4'
const GUIDED_TRANSITIONS_VIDEO = '/new-project-1/feature-guided-transitions.mp4'
const RUN_OF_SHOW_VIDEO = '/new-project-1/feature-show-management.mp4'
const MENU_PLANNING_VIDEO = '/new-project-1/feature-menu-planning.mp4'

const RUN_SHOW_COMPARE = {
  beforeVideo: TRANSITION_SUPPORT_VIDEO,
  afterVideo: GUIDED_TRANSITIONS_VIDEO,
  beforeAriaLabel: 'CX Pro transition support workflow — current experience',
  afterAriaLabel: 'CX Pro simplified and guided transitions — proposed experience',
  beforePlaybackRate: 1.35,
  afterPlaybackRate: 1.15,
} as const

export const RUN_SHOW_REVEAL = {
  ctaLabel: 'View Interaction Design',
  buttonAriaLabel: 'View design decisions for show running',
  pill: 'pill1' as const,
  modal: {
    ariaLabel: 'Show running mode',
    headline: 'Designing for familiarity and ease',
    heroImage: RUN_SHOW_MODAL_IMAGE,
    heroImageAlt: 'CX Pro run of show view',
    variant: 'compact' as const,
    subsections: [
      {
        id: 'calmer-cues',
        headline: 'Smoothing out transitions',
        body:
          'Transitions were the biggest pain point for operators, requiring multiple engine steps that could fail and needed to be repeatable. Transitions also had to remain individually accessible and available in both Edit and Run Show views.\n\nKeeping transitions in the toolbar would have been simpler and avoided duplication, but I felt the importance of this workflow should be reflected in the UI.\n\nI also pushed engineering to simplify the process, aligning on a near-term goal of combining two transition steps through automation.',
        compare: RUN_SHOW_COMPARE,
      },
      {
        id: 'run-of-show-view',
        headline: 'Show Management Core',
        body:
          'The view is grounded by a library and queue system left/right rails. This allows users to prepare key beats of a show, while still keeping the door open to spontaneous scene switches.\n\nI chose to prioritize scene duration and transition color codes so show runners can plan accordingly.',
        video: RUN_OF_SHOW_VIDEO,
        videoAriaLabel: 'CX Pro show management and run of show view demonstration',
      },
      {
        id: 'menu-planning',
        headline: 'Advanced Workflow Compatibility',
        body:
          'A key requirement for this project was improving the current Run Show experience in Cosm venues.\n\nAs a dome operator, I need to quickly cut to commercial, switch between live feeds, fine-tune media syncing, adjust audio, and more.\n\nThis video shows an operator using a new Quick Cut feature to jump to an unscheduled break, prepare feed changes, and return to the main event with minimal disruption.',
        video: MENU_PLANNING_VIDEO,
        videoAriaLabel: 'CX Pro menu planning demonstration',
      },
    ],
  },
} as const

export { RUN_SHOW_IMAGE }
