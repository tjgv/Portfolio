import SideShotSection from './SideShotSection'

const EDIT_SHOW_IMAGE = '/new-project-1/edit-show.png'

export default function EditingSideShot() {
  return (
    <SideShotSection
      title="Building Foundations for a Consumer Experience"
      imageSrc={EDIT_SHOW_IMAGE}
      imageAlt="CX Pro editing view"
      imagePosition="right"
      imageScale={1.15}
      devSection="editing-side-shot"
      ariaLabel="Editing view"
      bodyVariant="body-1"
    >
      <p>
        After initial pitch, we agreed that a Run Show view would come later, and that the MVP for
        external launch would need to be closer to home. So, I needed to identify the largest impact
        items to raise the intuitiveness of the current tool while also ensuring compatibility with a
        future Split View system.
      </p>
    </SideShotSection>
  )
}
