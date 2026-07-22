type ModalSectionTextStackProps = {
  sectionId: string
  headline: string
  body: string
}

/** Header-2 + body-2 copy block for modal media sections. */
export default function ModalSectionTextStack({
  sectionId,
  headline,
  body,
}: ModalSectionTextStackProps) {
  return (
    <div className="np1c-modal-text-stack">
      <h3 id={`np1c-modal-section-${sectionId}`} className="np1c-modal-text-stack__headline">
        {headline}
      </h3>
      {body.split('\n\n').map((paragraph, index) => (
        <p key={index} className="np1c-modal-text-stack__body">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
