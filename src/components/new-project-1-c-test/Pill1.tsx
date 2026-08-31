import { useEffect, useRef, type RefObject } from 'react'
import PopupRevealControl, { type Pill1Icon } from './PopupRevealControl'
import type { InlinePillRevealModalConfig } from './InlinePillReveal'
import { useGrowRevealScrollAnimation } from './useGrowRevealScrollAnimation'
import { usePill1ScrollControl } from './usePill1ScrollControl'
import './Pill1.css'

export type Pill1ModalConfig = InlinePillRevealModalConfig

export type Pill1Props = {
  sectionRef: RefObject<HTMLElement | null>
  ctaLabel: string
  buttonAriaLabel?: string
  icon?: Pill1Icon
  modal?: Pill1ModalConfig
  align?: 'left' | 'center'
  /** Override when the grow animation may start (default: section enters viewport). */
  isInAnimZone?: (section: HTMLElement) => boolean
  /** Override when the grow animation should retract (default: section leaves viewport). */
  shouldRetract?: (section: HTMLElement) => boolean
  /**
   * Pinned float + dock handoff inset from the viewport bottom (default 24).
   * Lower values move the absolute→static handoff down.
   */
  dockBottomInset?: number
}

/** Pill-1 — fixed to viewport bottom until docked, then in-flow at rest position. */
export default function Pill1({
  sectionRef,
  ctaLabel,
  buttonAriaLabel,
  icon = 'arrow-up',
  modal,
  align = 'center',
  isInAnimZone: isInAnimZoneProp,
  shouldRetract: shouldRetractProp,
  dockBottomInset,
}: Pill1Props) {
  const pillDockRef = useRef<HTMLDivElement>(null)

  const { controlsShown, controlsPinned, isInAnimZone, shouldRetract } = usePill1ScrollControl({
    sectionRef,
    dockRef: pillDockRef,
    isInAnimZone: isInAnimZoneProp,
    shouldRetract: shouldRetractProp,
    dockBottomInset,
  })

  const { openProgress, controlsReady, growOrbCssVars } = useGrowRevealScrollAnimation({
    sectionRef,
    isInAnimZone,
    shouldRetract,
    openAnimDelayMs: 0,
    instantRetract: true,
    holdOpenUntilRetract: true,
  })

  const controlsVisible = controlsShown

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div ref={pillDockRef} className="np1c-pill1__dock">
      <div className={`np1c-pill1 np1c-pill1--${align}`}>
        <PopupRevealControl
          visible={controlsVisible}
          pinned={controlsPinned}
          openProgress={openProgress}
          controlsReady={controlsReady}
          growOrbCssVars={growOrbCssVars}
          ctaLabel={ctaLabel}
          buttonAriaLabel={buttonAriaLabel}
          icon={icon}
          modal={modal}
          dockBottomInset={dockBottomInset}
        />
      </div>
    </div>
  )
}
