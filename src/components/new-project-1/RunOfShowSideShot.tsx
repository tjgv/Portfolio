import SideShotSection from './SideShotSection'
import { RUN_SHOW_IMAGE, RUN_SHOW_REVEAL } from './runShowReveal'

export default function RunOfShowSideShot() {
  return (
    <SideShotSection
      label="Phase 2"
      title="Run Show View"
      imageSrc={RUN_SHOW_IMAGE}
      imageAlt="CX Pro run of show view"
      layout="stacked"
      imagePosition="left"
      devSection="run-of-show-side-shot"
      ariaLabel="Run of show view"
      reveal={RUN_SHOW_REVEAL}
    >
      <p>
        I designed the Run Show View based on the assumption that this view would be the primary
        touchpoint casual users faced while running CX Pro. I created a baseline show management
        system with familiar UI patterns that scale towards that click-and-go dream, while giving
        the central area workflow flexibility — offering a responsive layout towards the various types
        of workflows that may be needed. View the new features below.
      </p>
    </SideShotSection>
  )
}
