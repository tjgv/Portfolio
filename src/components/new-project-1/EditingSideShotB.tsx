import SideShotSection from './SideShotSection'

const EDIT_SHOW_IMAGE = '/new-project-1/edit-show.png'

export default function EditingSideShotB() {
  return (
    <SideShotSection
      label="Defining the MVP"
      title="Evolving the Current Experience First"
      imageSrc={EDIT_SHOW_IMAGE}
      imageAlt="CX Pro editing view"
      imagePosition="right"
      imageScale={1.15}
      devSection="editing-side-shot"
      ariaLabel="Defining the MVP"
      bodyVariant="body-1"
    >
      <p>
        A dedicated Show Running Mode would come later. The MVP focused on improving the existing
        experience while laying the groundwork for future Show Running workflows.
      </p>
    </SideShotSection>
  )
}
