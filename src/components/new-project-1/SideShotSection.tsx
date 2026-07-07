import { useRef, type CSSProperties, type ReactNode } from 'react'
import InlinePillReveal, { type InlinePillRevealModalConfig } from './InlinePillReveal'
import Pill1 from './Pill1'
import './SideShotSection.css'

export type SideShotSectionProps = {
  title: string
  label?: string
  imageSrc?: string
  imageAlt?: string
  media?: ReactNode
  imagePosition: 'left' | 'right'
  layout?: 'side' | 'stacked'
  imageScale?: number
  devSection: string
  ariaLabel: string
  children: ReactNode
  reveal?: {
    ctaLabel: string
    modal: InlinePillRevealModalConfig
    buttonAriaLabel?: string
    pillAlign?: 'left' | 'center'
    /** `pill1` — scroll grow orb + expanding pill; `inline` — legacy inline pill */
    pill?: 'pill1' | 'inline'
  }
  /** Body copy scale — defaults to Body-2; pass `body-1` for the intro split's Body-1 rhythm. */
  bodyVariant?: 'body-1' | 'body-2'
}

function SideShotFigure({
  media,
  imageSrc,
  imageAlt,
}: {
  media?: ReactNode
  imageSrc?: string
  imageAlt: string
}) {
  return (
    <figure className="np1-side-shot__figure">
      {media ? (
        <div className="np1-side-shot__media">{media}</div>
      ) : (
        <img className="np1-side-shot__image" src={imageSrc} alt={imageAlt} loading="lazy" />
      )}
    </figure>
  )
}

function SideShotCopy({
  label,
  title,
  children,
  stacked = false,
  bodyVariant = 'body-2',
}: {
  label?: string
  title: string
  children: ReactNode
  stacked?: boolean
  bodyVariant?: 'body-1' | 'body-2'
}) {
  const bodyClassName =
    bodyVariant === 'body-1'
      ? 'np1-side-shot__body np1-side-shot__body--body-1'
      : 'np1-side-shot__body'

  return (
    <div className={`np1-side-shot__copy${stacked ? ' np1-side-shot__copy--stacked' : ''}`}>
      {label ? <p className="np1-side-shot__label">{label}</p> : null}
      <h2 className="np1-side-shot__title">{title}</h2>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}

export default function SideShotSection({
  title,
  label,
  imageSrc,
  imageAlt = '',
  media,
  imagePosition,
  layout = 'side',
  imageScale = 1,
  devSection,
  ariaLabel,
  children,
  reveal,
  bodyVariant = 'body-2',
}: SideShotSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isStacked = layout === 'stacked'
  const bodyClassName =
    bodyVariant === 'body-1'
      ? 'np1-side-shot__body np1-side-shot__body--body-1'
      : 'np1-side-shot__body'

  const pillReveal = reveal ? (
    reveal.pill === 'pill1' ? (
      <Pill1
        sectionRef={sectionRef}
        ctaLabel={reveal.ctaLabel}
        modal={reveal.modal}
        buttonAriaLabel={reveal.buttonAriaLabel}
        icon="arrow-up"
        align={reveal.pillAlign ?? (isStacked ? 'center' : 'left')}
      />
    ) : (
      <InlinePillReveal
        sectionRef={sectionRef}
        ctaLabel={reveal.ctaLabel}
        modal={reveal.modal}
        ariaLabel={reveal.buttonAriaLabel}
        align={reveal.pillAlign ?? (isStacked ? 'center' : 'left')}
      />
    )
  ) : null

  const sectionStyle: CSSProperties | undefined =
    imageScale !== 1 ? ({ '--np1-side-shot-image-scale': imageScale } as CSSProperties) : undefined

  return (
    <section
      ref={sectionRef}
      className={`np1-section np1-side-shot np1-side-shot--${isStacked ? 'stacked' : `image-${imagePosition}`}`}
      data-dev-section={devSection}
      aria-label={ariaLabel}
      style={sectionStyle}
    >
      {isStacked ? (
        <div className="np1-side-shot__inner">
          <div className="np1-side-shot__stack">
            <SideShotCopy label={label} title={title} stacked bodyVariant={bodyVariant}>
              {children}
            </SideShotCopy>
            <div className="np1-side-shot__media-block">
              <SideShotFigure media={media} imageSrc={imageSrc} imageAlt={imageAlt} />
            </div>
            {pillReveal}
          </div>
        </div>
      ) : (
        <div className="np1-side-shot__grid">
          <div className="np1-side-shot__copy">
            {label ? <p className="np1-side-shot__label">{label}</p> : null}
            <h2 className="np1-side-shot__title">{title}</h2>
            <div className={bodyClassName}>{children}</div>
            {pillReveal}
          </div>

          <SideShotFigure media={media} imageSrc={imageSrc} imageAlt={imageAlt} />
        </div>
      )}
    </section>
  )
}
