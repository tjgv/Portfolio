import { draftProspectDetailSearch } from '../versions/option-a/draft-central-test/draft-prospect-nav'
import { draftTestFocusSearch } from '../versions/option-a/draft-central-test/draft-test-focus-nav'
import {
  draftBigBoardTeamTourSearch,
  draftCentralTeamTourSearch,
  freeAgencyTeamTourSearch,
  teamTourSearch,
} from './team-tour-nav'

export type SolutionId =
  | 'bridging-context'
  | 'actionable-data'
  | 'value-prop'
  | 'head-to-head'

export type SolutionContextIntro = {
  route?: string
  problemLabel?: string
  problem: string
  users?: string
  audience?: string
  userGoalLabel?: string
  userGoal: string
  /** Final recap modal — how the walkthrough addresses the goal. */
  goalResolution?: string
  note: string
}

export type SolutionDefinition = {
  id: SolutionId
  label: string
  /** Prefix in the showcase bar (defaults to "Solution N:"). */
  showcasePrefix?: string
  contextIntro?: SolutionContextIntro
  steps: SolutionTourStep[]
}

export type SolutionTourPlacement =
  | 'corner'
  | 'centered'
  | 'anchored-above'
  | 'anchored-below'
  | 'anchored-left'

export type SolutionTourStep = {
  route: string
  /** CSS selector for scroll-into-view (and anchor when anchorTarget omitted). */
  target: string
  /** Optional separate element to anchor the modal against. */
  anchorTarget?: string
  title: string
  body?: string
  /** Optional light-grey quote shown below body (one line of spacing). */
  bodyQuote?: string
  /** Optional search string (e.g. ?focus=Player) */
  search?: string
  /** Pin modal above/below target with a pointer toward the feature. */
  placement?: SolutionTourPlacement
  /** How to scroll before anchoring (defaults: center for above, start for below). */
  scrollMode?: 'page-top' | 'target-start' | 'target-center' | 'target-nearest'
  /** Advance only when the user clicks clickTarget (not the footer arrow). */
  requiresClick?: boolean
  clickTarget?: string
  clickHint?: string
  /** Footer action label instead of → (e.g. Done on the final step). */
  nextButtonLabel?: string
  /** Set global team filter when this step becomes active (e.g. deselect for unbiased view). */
  teamPrepare?: 'deselect' | { select: string }
  /** Show the draft scorecard hover-preview screenshot demo over the anchor row. */
  showHoverPreview?: boolean
  /** Force Draft Central test chart comparison (e.g. ath-prod). */
  chartComparison?: 'ath-prod'
  /** Highlight a prospect row + scatter point when this step becomes active. */
  focusProspect?: string
  /** Highlight up to two prospects (shift-click comparison demo). */
  focusProspects?: string[]
  /** Clear table/scatter focus when this step becomes active. */
  clearFocus?: boolean
}

export const SOLUTION_DEFINITIONS: SolutionDefinition[] = [
  {
    id: 'bridging-context',
    label: 'Communicating value prop',
    contextIntro: {
      route: '/',
      problem:
        "NFL IQ doesn't communicate its value to a broader audience. Existing on NFL.com signals a desire of growth in a fan-based audience, but the tool doesn't give a compelling value statement to users.",
      users: 'Casual → Super Fans',
      audience:
        'This solution is geared for users who are already on the casual fan to super fan engagement pipeline. It assumes that the user already knows what happened in draft, and they want to know more about the implications.',
      userGoal:
        'I am a pretty big fan of the Tennessee Titans, and I heard we had a decent draft. I want to learn more about how my team is going to perform.',
      goalResolution:
        'This solution recenters the value proposition (the data offering) around a more precise assessment of stories users care about.',
      note: 'UI is not final. Mocks are intended to demonstrate general direction with a conservative amount of dev resources in mind.',
    },
    steps: [
      {
        route: '/',
        target: '.iq-home-round-recap__title',
        placement: 'anchored-above',
        title: 'Round Recap Deprioritized',
        body:
          "The user type we're focused on already knows what happened in the draft. The Draft Tracker is the highest SEO item for 'NFL Draft' and is geared for casual fans. To reflect this reality, I de-prioritized the round tracker so that I can make room for valuable real-estate that better speaks to the level of fandom that our users are at.",
      },
      {
        route: '/',
        target: '.iq-home-hero',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'Users are motivated by news',
        body:
          "The NFL Draft itself is a news-centered event. Each year, there are key narratives that define the season. Narratives play a key role in NFL IQ. It's what connects a user's fandom to the data. So, I decided to use prime real estate to capitalize on current hype to drive engagement.",
      },
      {
        route: '/',
        target: '[data-solution-tour="value-pick-sonny-styles"]',
        anchorTarget:
          '[data-solution-tour="value-pick-sonny-styles"] .iq-home-value-card__photo-wrap',
        placement: 'anchored-below',
        scrollMode: 'target-center',
        title: 'Emphasizing the tools focus: Rookies',
        body:
          'I chose to place the value picks as the secondary option to reinforce the tools focus on rookie players and statistical outliers. I debated on prioritizing winning and losing teams as the secondary focus because I believe fans have an innate connection to teams, not rookies. However, I settled on keeping the focus on the players, and using interaction design in the hover to maintain some fandom hype.',
      },
      {
        route: '/',
        target: '[data-solution-tour="home-athleticism-boost"]',
        placement: 'anchored-above',
        scrollMode: 'target-nearest',
        title: 'Team Fit',
        body:
          "I chose to reduce the height of the charts to display 4 teams in the viewport to better emphasize the idea of 'winners' (less = more). I also touched on the wording of the data messaging to focus on impact.",
      },
      {
        route: '/teams',
        target: '[data-solution-tour="team-central-summary"]',
        anchorTarget: '[data-solution-tour="team-central-summary"] .tc-summary__nav',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        nextButtonLabel: 'Done',
        title: 'Team / User Identity',
        body:
          'One of the core motivators for the fans is their connection to their favorite teams. The Team Central page had powerful context that was tucked away. I chose to hero that context because I believe it will provide users a more engaging baseline to frame the rest of their experience.',
        bodyQuote:
          '"My team needs these players, my rival division teams are performing better than us right now, what can we pick? Are we doomed? Is there hope?"',
      },
    ],
  },
  {
    id: 'actionable-data',
    label: 'Actionable data',
    contextIntro: {
      route: '/draft',
      problemLabel: 'Core Problem',
      problem:
        "The Product Doesn't Encourage Exploration. One of the largest usability flaws with the tool that can be fixed with relatively low effort is the lack of general navigation utilities. Getting users to where they want to go faster will yield more engagement, and not supporting that will actively deter users.",
      users: 'All Users (Casual, Super Fan, Media & Analysts, Professionals)',
      audience:
        'The lack of routing makes research difficult, exploration a pain, and punishes curiosity. I believe addressing this will yield the highest cost/benefit output.',
      userGoalLabel: 'Use Case',
      userGoal:
        'I am a Super Fan who is looking to find a sleeper pick to place bets on. I am browsing NFL IQ to find leads on such a player.',
      goalResolution:
        'This solution directly addresses the problem by adding navigable elements to the pieces of insight that users have deemed interesting, thus creating a route to funnel user engagement.',
      note: 'UI is not final. Mocks are intended to demonstrate general direction with a conservative amount of dev resources in mind.',
    },
    steps: [
      {
        route: '/',
        target: '.iq-home-value__title',
        anchorTarget: '[data-solution-tour="value-pick-sonny-styles"]',
        placement: 'anchored-left',
        scrollMode: 'target-start',
        requiresClick: true,
        clickTarget: '[data-solution-tour="value-pick-sonny-styles"]',
        clickHint: 'You must click Sonny!',
        title: 'Encourage Exploration',
        body:
          "Generally speaking, I believe the best strategy to strengthen engagement in a data analysis platform is to: Spark Curiosity, and open paths for users to follow.\n\nLet's see where this path goes:",
      },
      {
        route: '/draft',
        search: draftTestFocusSearch('Sonny Styles'),
        target: '[data-solution-tour="draft-scatter-sonny-styles"]',
        anchorTarget: '[data-solution-tour="draft-scatter-sonny-styles"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'Straight to the chase',
        body:
          'Clicking Sonny has taken you straight to the context in the most approachable and engaging way - through the data visualisation. The insight is immediate, and I am wagering it will encourage users to dive a little deeper.',
      },
      {
        route: '/draft',
        search: draftTestFocusSearch('Sonny Styles'),
        target: '[data-solution-tour="draft-library-sonny-styles"]',
        anchorTarget: '[data-solution-tour="draft-library-sonny-styles"]',
        placement: 'anchored-left',
        scrollMode: 'target-nearest',
        requiresClick: true,
        clickTarget: '[data-solution-tour="draft-library-sonny-row-arrow"]',
        clickHint: 'You must click the row arrow!',
        title: 'Continue down the rabit hole!',
      },
      {
        route: '/draft',
        search: draftProspectDetailSearch('Sonny Styles'),
        target: '[data-solution-tour="draft-prospect-back"]',
        anchorTarget: '[data-solution-tour="draft-prospect-back"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'The rabit hole goes on (but not really):',
        body:
          "Theoretically, this page is finished and there's more rabit holes to follow.\n\nThe real point I'm trying to illustrate is that to get users using the tool, the tool needs to encourage inquisitive navigation.\n\nAn interesting data point, player, or teams should take you somewhere.",
      },
    ],
  },
  {
    id: 'value-prop',
    label: 'Bridging contextual data',
    contextIntro: {
      route: '/',
      problemLabel: 'Core Problem',
      problem:
        "The product doesn't communicate it's value prop effectively to users. One of the way this issue manifests is in the fragmentation of data. The data is used to paint a picture, but sometimes I need to look at data from different pages to piece the picture together.",
      users: 'Super Fan, Media & Analysts',
      audience:
        'One of the core motivators of Super Fans is their passion for their favorite team. Lots of the time spent on this tool are for the sake of that fandom.',
      userGoalLabel: 'User Goal',
      userGoal:
        'As a super fan of the Tennessee Titans, I want to view the 2026 draft from the lens of my favorite team so that I can discuss it with my friends.',
      goalResolution:
        'This solution indirectly addresses the problem by expanding the scope of relevant data to users. It is the inverse of landing a bullseye with a dart. Instead, this solution adds more bullseyes to the wall.',
      note: 'UI is not final. Mocks are intended to demonstrate general direction with a conservative amount of dev resources in mind.',
    },
    steps: [
      {
        route: '/teams',
        search: teamTourSearch('TEN'),
        target: '[data-solution-tour="team-filter-ten"]',
        anchorTarget: '[data-solution-tour="team-filter-ten"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'Division Context',
        body:
          "One of the core value props of this tool is that it gives users an expectation/preview for the upcoming season.\n\nIn that sense, I'm not only concerned with the context of my team - but the context of my rivals who might get in the way of my team getting into playoffs.",
      },
      {
        route: '/teams',
        search: teamTourSearch('TEN'),
        target: '[data-solution-tour="team-filter-ind"]',
        anchorTarget: '[data-solution-tour="team-filter-ind"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'Divison Selection',
        body:
          'When I select my team, I am also secondary selecting my teams division rivals.',
      },
      {
        route: '/teams',
        search: teamTourSearch('TEN'),
        target: '[data-solution-tour="team-central-summary"]',
        anchorTarget: '[data-solution-tour="team-summary-peer-jax"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        title: 'Keep an eye on the enemies',
        body:
          'This allows me to not only see how well/poor my team is doing, but also to see how that compares to my rival teams.',
      },
      {
        route: '/draft',
        search: draftBigBoardTeamTourSearch('TEN'),
        target: '[data-solution-tour="big-board-ten-top-cell"]',
        anchorTarget: '[data-solution-tour="big-board-ten-top-cell"]',
        placement: 'anchored-left',
        scrollMode: 'page-top',
        title: 'Data from the lens of my team',
        body:
          'I can leverage the insights from Team Central to transform experiences across the product.\n\nIn this case, I can simulate what the war room may feel like by highlighting which columns my team is interested in, and who my rivals have/are targeting.',
      },
      {
        route: '/draft',
        search: draftCentralTeamTourSearch('TEN'),
        target: '[data-solution-tour="combine-scorecard"]',
        anchorTarget: '[data-solution-tour="draft-scorecard-got-rivals-logo"]',
        placement: 'anchored-left',
        scrollMode: 'target-start',
        title: 'Many ways to utilize',
        body:
          'In this instance, I can inspect which players my rivals teams recieved. If this was pre-draft, this can be replaced with needs / first-round board predictions',
      },
      {
        route: '/free-agency',
        search: freeAgencyTeamTourSearch('TEN'),
        target: '[data-solution-tour="free-agency-roster-panel"]',
        anchorTarget: '[data-solution-tour="free-agency-roster-panel"]',
        placement: 'anchored-above',
        scrollMode: 'page-top',
        teamPrepare: { select: 'TEN' },
        title: 'Compare needs to the pool',
        body:
          'Or I can compare my rosters needs directly against the pool of free agents.',
      },
      {
        route: '/free-agency',
        target: '[data-solution-tour="team-filter-ten"]',
        anchorTarget: '[data-solution-tour="team-filter-ten"]',
        placement: 'anchored-below',
        scrollMode: 'page-top',
        teamPrepare: 'deselect',
        title: 'Return to general view',
        body:
          'To return to general view, I can de-select my team and the pages will appear with unbiased data',
      },
      {
        route: '/teams',
        search: teamTourSearch('DEN'),
        target: '[data-solution-tour="team-central-summary"]',
        placement: 'centered',
        scrollMode: 'page-top',
        teamPrepare: { select: 'DEN' },
        title: 'Pros and Cons',
        body:
          'While I am unsure of the exact value these integrations offer, I do believe there is merit in building an engaging experience by leaning into fandom.\n\nAdditionally, it is lightweight as it utilizes existing assets and modules to transform the data into something more personable.',
      },
    ],
  },
  {
    id: 'head-to-head',
    label: 'Head-to-head comparison',
    showcasePrefix: 'Bonus:',
    contextIntro: {
      route: '/draft',
      problemLabel: 'Core Problem',
      problem:
        "Product usability isn't anchored to actual workflows. The data feels raw.",
      userGoalLabel: 'Use Case',
      userGoal:
        'I am a Media analyst for underrated talent to report on. I want to find talent that is comparable to the popular picks.',
      goalResolution:
        'This solution is a best guess at what an actual user flow looks like for a Media & Analyst. Given the comparative nature of the tool, I can easily imagine this being a workflow that technical analysts do often.\n\nI included this as an example to illustrate what I mean by tailoring a workflow to the data usability.',
      note: 'UI is not final. Mocks are intended to demonstrate general direction with a conservative amount of dev resources in mind.',
    },
    steps: [
      {
        route: '/draft',
        target: '[data-solution-tour="draft-scorecard-hover-row"]',
        placement: 'corner',
        scrollMode: 'target-center',
        showHoverPreview: true,
        title: 'Highly contextual narrative info',
        body:
          "This screenshot of a hover state within the tool caught my interest. It's highly descriptive, and very engaging - but its a fleeting feature that fades away when I move the cursor.",
      },
      {
        route: '/draft',
        search: draftProspectDetailSearch('Jeremiyah Love'),
        target: '[data-solution-tour="prospect-archetype-percentiles"]',
        anchorTarget: '[data-solution-tour="prospect-archetype-percentiles"]',
        placement: 'anchored-left',
        scrollMode: 'target-center',
        title: 'Temporary home for this hover state',
        body:
          'This feature definitely deserved a home where users can interact with it, so I placed it in this (unfinished) player profile page because it is a feature that truly rewards users who are hunting down insights. Unfortunately, this page fell out of scope for this project.',
      },
      {
        route: '/draft',
        target: '[data-solution-tour="chart-comparison-ath-prod-label"]',
        anchorTarget: '[data-solution-tour="chart-comparison-ath-prod-label"]',
        placement: 'anchored-below',
        scrollMode: 'target-start',
        chartComparison: 'ath-prod',
        title: 'Comparative theme',
        body:
          'Another interesting piece of the Draft Central page was the data visualizer, which paired next to a table with 3 different rank columns on it.\n\nSo, the intended workflow was becoming clear: The Draft Central tool is about comparison.',
      },
      {
        route: '/draft',
        search: draftTestFocusSearch('Fernando Mendoza'),
        target: '[data-solution-tour="draft-scatter-focused-bubble"]',
        anchorTarget: '[data-solution-tour="draft-scatter-focused-bubble"]',
        placement: 'anchored-below',
        scrollMode: 'target-center',
        chartComparison: 'ath-prod',
        focusProspect: 'Fernando Mendoza',
        title: 'Interactive table',
        body:
          'So the first thing I did was make the table interactive. Rows can now be highlighted, which would quickly find the relevant data point for the user to find.',
      },
      {
        route: '/draft',
        target: '[data-solution-tour="draft-focus-portraits"]',
        anchorTarget: '[data-solution-tour="draft-focus-portraits"]',
        placement: 'anchored-below',
        scrollMode: 'target-center',
        chartComparison: 'ath-prod',
        focusProspects: ['Fernando Mendoza', 'Jeremiyah Love'],
        title: 'Shift-click comparison',
        body:
          "But, this still wasn't a compelling way to compare data points.\n\nSo, I leaned on the most light-weight and intuitive method to 'select' multiple things - shift click.",
      },
      {
        route: '/draft',
        target: '[data-solution-tour="combine-scorecard"]',
        anchorTarget: '[data-solution-tour="combine-scorecard"]',
        placement: 'anchored-above',
        scrollMode: 'target-start',
        chartComparison: 'ath-prod',
        clearFocus: true,
        title: 'The next problem',
        body:
          'The next problem would be to decide:\n\nCut the bottom scouting table, and fit these extra stats into the combine tracker.\n\nOR\n\nEliminate the combine tracker, and find a way to accomodate the excess data here.',
      },
    ],
  },
]

export function getSolutionDefinition(id: SolutionId): SolutionDefinition {
  const found = SOLUTION_DEFINITIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown solution: ${id}`)
  return found
}
