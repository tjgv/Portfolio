import HighlightsCarouselSection from './HighlightsCarouselSection'
import { SOLUTION_VIDEO_SLIDES } from './solutionVideoSlides'

export default function HowItAddressesSection() {
  return (
    <HighlightsCarouselSection
      devSectionId="how-it-addresses"
      ariaLabel="Defining North Star: Isolated Show Running Mode"
      label="Defining North Star: Isolated Show Running Mode"
      headline="A Shorter Path Towards Show Running Mastery."
      body="Most users only need to run shows, not build them. By separating Show Running into its own mode, I created space to better support live operations while giving new users a simpler workflow to master."
      slides={SOLUTION_VIDEO_SLIDES}
    />
  )
}
