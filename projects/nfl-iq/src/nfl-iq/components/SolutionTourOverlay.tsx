import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  getSolutionDefinition,
  type SolutionTourStep,
} from '../solution-showcase/solution-definitions'
import {
  getTourFeatureStep,
  getTourTotalStages,
  isTourIntroStep,
  isTourOutroStep,
} from '../solution-showcase/solution-tour-state'
import {
  ARROW_SIZE_PX,
  anchoredCardSelector,
  computeAnchoredPosition,
  isAnchoredPlacement,
  isOnTourStepRoute,
  scrollTourStepIntoView,
  smoothScrollToY,
  waitForElement,
  type AnchorPosition,
  type TourScrollMode,
} from '../solution-showcase/solution-tour-anchor'
import { useSolutionShowcase } from '../context/useSolutionShowcase'
import './solution-tour-overlay.css'

function SolutionContextIntroCard({
  onClose,
  onNext,
  stageLabel,
}: {
  onClose: () => void
  onNext: () => void
  stageLabel: string
}) {
  const { activeSolutionId } = useSolutionShowcase()
  if (!activeSolutionId) return null

  const intro = getSolutionDefinition(activeSolutionId).contextIntro
  if (!intro) return null

  return (
    <div
      className="solution-tour__card solution-tour__card--context"
      role="dialog"
      aria-labelledby="solution-tour-context-problem"
    >
      <div className="solution-tour__card-chrome">
        <span className="solution-tour__stage" aria-live="polite">
          ({stageLabel})
        </span>
        <button
          type="button"
          className="solution-tour__close"
          aria-label="Stop the show"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <h2 id="solution-tour-context-problem" className="solution-tour__context-heading">
        {intro.problemLabel ?? 'Problem'}:
      </h2>
      <p className="solution-tour__body solution-tour__body--spaced">{intro.problem}</p>

      {intro.users ? (
        <div className="solution-tour__users-block">
          <h3 className="solution-tour__context-heading">Users:</h3>
          <p className="solution-tour__body solution-tour__body--users solution-tour__body--spaced">
            {intro.users}
          </p>
        </div>
      ) : null}
      {intro.audience ? (
        <p className="solution-tour__body solution-tour__body--spaced">{intro.audience}</p>
      ) : null}

      <h3 className="solution-tour__context-heading">
        {intro.userGoalLabel ?? 'USER GOAL'}:
      </h3>
      <p className="solution-tour__body solution-tour__body--quote solution-tour__body--spaced">
        {intro.userGoal}
      </p>

      <div className="solution-tour__card-footer solution-tour__card-footer--intro">
        <p className="solution-tour__note">
          <em>
            Note: {intro.note}
          </em>
        </p>
        <button
          type="button"
          className="solution-tour__next solution-tour__next--cta"
          aria-label="Start walkthrough"
          onClick={onNext}
        >
          <span>Let&apos;s go!</span>
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  )
}

function SolutionContextOutroCard({
  onClose,
  onPrev,
  onNext,
  stageLabel,
}: {
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  stageLabel: string
}) {
  const { activeSolutionId } = useSolutionShowcase()
  if (!activeSolutionId) return null

  const intro = getSolutionDefinition(activeSolutionId).contextIntro
  if (!intro) return null

  const goalResolution =
    intro.goalResolution?.trim() ||
    'Copy coming soon.'

  return (
    <div
      className="solution-tour__card solution-tour__card--centered solution-tour__card--outro"
      role="dialog"
      aria-labelledby="solution-tour-outro-problem"
    >
      <div className="solution-tour__card-chrome">
        <span className="solution-tour__stage" aria-live="polite">
          ({stageLabel})
        </span>
        <button
          type="button"
          className="solution-tour__close"
          aria-label="Stop the show"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <h3 id="solution-tour-outro-problem" className="solution-tour__context-heading">
        {intro.problemLabel ?? 'Core Problem'}:
      </h3>
      <p className="solution-tour__body solution-tour__body--quote solution-tour__body--spaced">
        {intro.problem}
      </p>

      <h3 className="solution-tour__context-heading">How this addresses the goal:</h3>
      <p className="solution-tour__body solution-tour__body--spaced">{goalResolution}</p>

      <div className="solution-tour__card-footer solution-tour__card-footer--outro">
        <button
          type="button"
          className="solution-tour__prev"
          aria-label="Back"
          onClick={onPrev}
        >
          Back
        </button>
        <button
          type="button"
          className="solution-tour__next solution-tour__next--cta"
          aria-label="Finish walkthrough"
          onClick={onNext}
        >
          Done
        </button>
      </div>
    </div>
  )
}

const BOUNCE_HINT_MS = 15_000
const BOUNCE_ANIM_MS = 1400

function useBounceHint(active: boolean) {
  const [bouncing, setBouncing] = useState(false)

  useEffect(() => {
    if (!active) {
      setBouncing(false)
      return
    }

    let settleTimer = 0

    const pulse = () => {
      setBouncing(true)
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => setBouncing(false), BOUNCE_ANIM_MS)
    }

    pulse()
    const interval = window.setInterval(pulse, BOUNCE_HINT_MS)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(settleTimer)
      setBouncing(false)
    }
  }, [active])

  return bouncing
}

function SolutionTourStepCard({
  onClose,
  onPrev,
  onNext,
  isFirstStep,
  isLastStep,
  stageLabel,
  title,
  body,
  bodyQuote,
  placement = 'corner',
  anchorPosition,
  requiresClick = false,
  clickHint,
  nextButtonLabel,
}: {
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  stageLabel: string
  title: string
  body?: string
  bodyQuote?: string
  placement?: SolutionTourStep['placement']
  anchorPosition?: AnchorPosition | null
  requiresClick?: boolean
  clickHint?: string
  nextButtonLabel?: string
}) {
  const bounceHint = useBounceHint(requiresClick)
  const isCentered = placement === 'centered'
  const isAnchored = isAnchoredPlacement(placement)
  const anchoredClass =
    placement === 'anchored-below'
      ? 'solution-tour__card--anchored-below'
      : placement === 'anchored-above'
        ? 'solution-tour__card--anchored-above'
        : placement === 'anchored-left'
          ? 'solution-tour__card--anchored-left'
          : ''

  return (
    <div
      className={
        isCentered
          ? 'solution-tour__card solution-tour__card--centered'
          : isAnchored
            ? `solution-tour__card ${anchoredClass}${bounceHint ? ' solution-tour__card--hint-bounce' : ''}`
            : 'solution-tour__card'
      }
      role="dialog"
      aria-labelledby="solution-tour-title"
      aria-describedby={
        body || bodyQuote
          ? [body ? 'solution-tour-body' : null, bodyQuote ? 'solution-tour-body-quote' : null]
              .filter(Boolean)
              .join(' ') || undefined
          : undefined
      }
      style={
        isAnchored && anchorPosition
          ? ({
              top: anchorPosition.top,
              left: anchorPosition.left,
              width: anchorPosition.width,
              visibility: 'visible',
              '--solution-tour-arrow-left': `${anchorPosition.arrowLeft}px`,
              '--solution-tour-arrow-top':
                anchorPosition.arrowTop != null
                  ? `${anchorPosition.arrowTop}px`
                  : undefined,
              '--solution-tour-arrow-size': `${ARROW_SIZE_PX}px`,
            } as CSSProperties)
          : isAnchored
            ? { visibility: 'hidden' }
            : undefined
      }
    >
      <div className="solution-tour__card-chrome">
        <span className="solution-tour__stage" aria-live="polite">
          ({stageLabel})
        </span>
        <button
          type="button"
          className="solution-tour__close"
          aria-label="Stop the show"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <h3 id="solution-tour-title" className="solution-tour__title">
        {title}
      </h3>
      {body ? (
        <p id="solution-tour-body" className="solution-tour__body solution-tour__body--pre-line">
          {body}
        </p>
      ) : null}
      {bodyQuote ? (
        <p
          id="solution-tour-body-quote"
          className="solution-tour__body solution-tour__body-quote"
        >
          {bodyQuote}
        </p>
      ) : null}

      <div
        className={
          requiresClick
            ? 'solution-tour__card-footer solution-tour__card-footer--click-gate'
            : nextButtonLabel
              ? 'solution-tour__card-footer solution-tour__card-footer--intro'
              : 'solution-tour__card-footer'
        }
      >
        <button
          type="button"
          className="solution-tour__prev"
          aria-label="Back"
          disabled={isFirstStep}
          onClick={onPrev}
        >
          Back
        </button>
        {requiresClick ? (
          <p className="solution-tour__click-hint">{clickHint ?? 'Click to continue'}</p>
        ) : nextButtonLabel ? (
          <button
            type="button"
            className="solution-tour__next solution-tour__next--cta"
            aria-label={isLastStep ? 'Finish walkthrough' : 'Next feature'}
            onClick={onNext}
          >
            {nextButtonLabel}
          </button>
        ) : (
          <button
            type="button"
            className="solution-tour__next solution-tour__next--cta"
            aria-label="Next"
            onClick={onNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

function tourStepPath(step: SolutionTourStep): string {
  if (!step.search) return step.route
  return `${step.route}${step.search.startsWith('?') ? step.search : `?${step.search}`}`
}

function useAnchoredTourStep(step: SolutionTourStep | null, enabled: boolean) {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const prevStepRouteRef = useRef<string | null>(null)
  const [anchorReady, setAnchorReady] = useState(false)
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition | null>(
    null,
  )
  const placement = step?.placement

  const measureAndPlace = useCallback(() => {
    if (!step?.target || !isAnchoredPlacement(placement)) return
    const anchorSelector = step.anchorTarget ?? step.target
    const anchorEl = document.querySelector(anchorSelector)
    const card = document.querySelector(
      anchoredCardSelector(placement),
    ) as HTMLElement | null
    if (!anchorEl || !card) return
    setAnchorPosition(
      computeAnchoredPosition(
        anchorEl,
        card.offsetWidth,
        card.offsetHeight,
        placement,
      ),
    )
  }, [step?.target, step?.anchorTarget, placement])

  useEffect(() => {
    if (!enabled || !step || !isAnchoredPlacement(step.placement)) {
      setAnchorReady(true)
      setAnchorPosition(null)
      return
    }

    let cancelled = false
    setAnchorReady(false)
    setAnchorPosition(null)

    const stepPath = tourStepPath(step)
    if (!isOnTourStepRoute(pathname, step.route)) {
      navigate(stepPath)
      return () => {
        cancelled = true
      }
    }

    const prepare = async () => {
      const scrollEl = await waitForElement(step.target)
      if (cancelled || !scrollEl) {
        if (!cancelled) setAnchorReady(true)
        return
      }

      const anchorSelector = step.anchorTarget ?? step.target
      const anchorEl =
        anchorSelector === step.target
          ? scrollEl
          : await waitForElement(anchorSelector)

      const scrollMode: TourScrollMode =
        step.scrollMode ??
        (step.placement === 'anchored-below' || step.placement === 'anchored-left'
          ? 'target-start'
          : 'target-center')

      const routeChanged =
        prevStepRouteRef.current != null &&
        prevStepRouteRef.current !== step.route

      await scrollTourStepIntoView(
        scrollEl,
        anchorEl,
        scrollMode,
        routeChanged,
      )
      if (cancelled) return

      prevStepRouteRef.current = step.route
      requestAnimationFrame(() => {
        if (!cancelled) setAnchorReady(true)
      })
    }

    void prepare()
    return () => {
      cancelled = true
    }
  }, [enabled, step, pathname, search, navigate])

  useEffect(() => {
    if (!enabled) {
      prevStepRouteRef.current = null
    }
  }, [enabled])

  useLayoutEffect(() => {
    if (!anchorReady || !step || !isAnchoredPlacement(step.placement)) return
    measureAndPlace()
    const raf = requestAnimationFrame(() => measureAndPlace())
    return () => cancelAnimationFrame(raf)
  }, [anchorReady, step, measureAndPlace, step?.title, step?.body, step?.bodyQuote])

  useEffect(() => {
    if (!anchorReady || !isAnchoredPlacement(step?.placement)) return
    const onReflow = () => measureAndPlace()
    window.addEventListener('resize', onReflow)
    window.addEventListener('scroll', onReflow, true)
    return () => {
      window.removeEventListener('resize', onReflow)
      window.removeEventListener('scroll', onReflow, true)
    }
  }, [anchorReady, step?.placement, measureAndPlace])

  return { anchorReady, anchorPosition }
}

function resolveTourClickElement(root: Element): HTMLElement {
  const interactive = root.querySelector<HTMLElement>(
    'button, a, [role="button"], input[type="button"], input[type="submit"]',
  )
  if (interactive) return interactive
  if (root instanceof HTMLElement) return root
  return root as HTMLElement
}

function useTourClickGate(
  step: SolutionTourStep | null,
  enabled: boolean,
  onAdvance: () => void,
) {
  useEffect(() => {
    if (!enabled || !step?.requiresClick) return

    const selector = step.clickTarget ?? step.target
    const root = document.querySelector(selector)
    if (!root) return

    root.classList.add('solution-tour__click-target--pulse')
    const clickable = resolveTourClickElement(root)

    const onAdvanceClick = () => {
      queueMicrotask(() => onAdvance())
    }

    clickable.addEventListener('click', onAdvanceClick)

    const onRootClick =
      root !== clickable
        ? (e: Event) => {
            const target = e.target as Node
            if (clickable.contains(target)) return
            clickable.click()
          }
        : null

    if (onRootClick) {
      root.addEventListener('click', onRootClick)
    }

    return () => {
      root.classList.remove('solution-tour__click-target--pulse')
      clickable.removeEventListener('click', onAdvanceClick)
      if (onRootClick) root.removeEventListener('click', onRootClick)
    }
  }, [enabled, step, onAdvance])
}

export function SolutionTourOverlay() {
  const { activeSolutionId, stepIndex, stopSolution, nextStep, prevStep } =
    useSolutionShowcase()
  const definition =
    activeSolutionId != null
      ? getSolutionDefinition(activeSolutionId)
      : null
  const isIntro = isTourIntroStep(stepIndex)
  const hasContextIntro = Boolean(definition?.contextIntro)
  const isOutro = definition ? isTourOutroStep(definition, stepIndex) : false
  const step =
    definition && !isIntro && !isOutro
      ? (getTourFeatureStep(definition, stepIndex) ?? null)
      : null
  const totalStages = definition ? getTourTotalStages(definition) : 0
  const canGoBackFromTourStep =
    stepIndex > 0 || (stepIndex === 0 && hasContextIntro)
  const isAnchoredStep = isAnchoredPlacement(step?.placement)

  const { anchorReady, anchorPosition } = useAnchoredTourStep(
    step,
    Boolean(activeSolutionId && !isIntro && !isOutro && isAnchoredStep),
  )

  useTourClickGate(
    step,
    Boolean(activeSolutionId && !isIntro && !isOutro && step?.requiresClick),
    nextStep,
  )

  useEffect(() => {
    if (!activeSolutionId || isIntro || isOutro || step?.placement !== 'centered') return
    if (step.scrollMode === 'page-top') void smoothScrollToY(0)
  }, [activeSolutionId, isIntro, isOutro, step])

  useEffect(() => {
    if (!activeSolutionId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stopSolution()
      if (e.key === 'ArrowRight' && (isOutro || !step?.requiresClick)) nextStep()
      if (e.key === 'ArrowLeft') {
        if (isIntro) return
        if (isOutro || canGoBackFromTourStep) prevStep()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [
    activeSolutionId,
    stopSolution,
    nextStep,
    prevStep,
    isIntro,
    canGoBackFromTourStep,
    step?.requiresClick,
    isOutro,
  ])

  if (!activeSolutionId || !definition) return null
  if (!isIntro && !isOutro && !step) return null

  if (isIntro && definition.contextIntro) {
    const introStageLabel = `1/${totalStages}`
    return createPortal(
      <SolutionContextIntroCard
        onClose={stopSolution}
        onNext={nextStep}
        stageLabel={introStageLabel}
      />,
      document.body,
    )
  }

  if (isOutro && definition.contextIntro) {
    const outroStageLabel = `${totalStages}/${totalStages}`
    return createPortal(
      <SolutionContextOutroCard
        onClose={stopSolution}
        onPrev={prevStep}
        onNext={stopSolution}
        stageLabel={outroStageLabel}
      />,
      document.body,
    )
  }

  if (isAnchoredStep && !anchorReady) {
    return null
  }

  const stageNumber = hasContextIntro ? stepIndex + 2 : stepIndex + 1
  const stageLabel = `${stageNumber}/${totalStages}`

  return createPortal(
    <SolutionTourStepCard
      onClose={stopSolution}
      onPrev={prevStep}
      onNext={nextStep}
      isFirstStep={!canGoBackFromTourStep}
      isLastStep={false}
      stageLabel={stageLabel}
      title={step!.title}
      body={step!.body}
      bodyQuote={step!.bodyQuote}
      placement={step!.placement}
      anchorPosition={isAnchoredStep ? anchorPosition : null}
      requiresClick={step!.requiresClick}
      clickHint={step!.clickHint}
      nextButtonLabel={step!.nextButtonLabel}
    />,
    document.body,
  )
}
