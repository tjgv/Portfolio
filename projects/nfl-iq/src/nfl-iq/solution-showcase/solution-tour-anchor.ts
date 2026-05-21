import type { SolutionTourPlacement } from './solution-definitions'

const IQ_HOME_PATH = '/'

/** Tour scroll timing — tuned for a calm, deliberate walkthrough pace. */
export const TOUR_SCROLL = {
  durationMs: 1000,
  routeChangePauseMs: 1000,
  settleBufferMs: 200,
  startOffsetPx: 16,
} as const

export type TourScrollMode =
  | 'page-top'
  | 'target-start'
  | 'target-center'
  | 'target-nearest'

export function isIqHomePath(pathname: string): boolean {
  return pathname === IQ_HOME_PATH
}

export function isOnTourStepRoute(pathname: string, route: string): boolean {
  if (route === '/') return pathname === '/'
  return pathname.startsWith(route)
}

export function isAnchoredPlacement(
  placement?: SolutionTourPlacement,
): placement is 'anchored-above' | 'anchored-below' | 'anchored-left' {
  return (
    placement === 'anchored-above' ||
    placement === 'anchored-below' ||
    placement === 'anchored-left'
  )
}

export function waitForElement(
  selector: string,
  maxAttempts = 80,
): Promise<Element | null> {
  return new Promise((resolve) => {
    let attempts = 0
    const tick = () => {
      const el = document.querySelector(selector)
      if (el) {
        resolve(el)
        return
      }
      attempts += 1
      if (attempts >= maxAttempts) {
        resolve(null)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function waitForScrollSettle(
  ms: number = TOUR_SCROLL.settleBufferMs,
): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function scrollPageToTopInstant(): void {
  window.scrollTo(0, 0)
}

export function smoothScrollToY(
  targetY: number,
  durationMs: number = TOUR_SCROLL.durationMs,
): Promise<void> {
  const startY = window.scrollY
  const maxY = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const clampedTarget = Math.max(0, Math.min(targetY, maxY))
  const delta = clampedTarget - startY

  if (Math.abs(delta) < 2) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / durationMs)
      window.scrollTo(0, startY + delta * easeInOutCubic(progress))
      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }

    requestAnimationFrame(tick)
  })
}

export function getScrollTopForElement(
  el: Element,
  block: ScrollLogicalPosition = 'start',
  offsetPx = TOUR_SCROLL.startOffsetPx,
): number {
  const rect = el.getBoundingClientRect()
  const elTop = window.scrollY + rect.top
  const elBottom = elTop + rect.height
  const viewportTop = window.scrollY
  const viewportBottom = viewportTop + window.innerHeight

  if (block === 'center') {
    return Math.max(
      0,
      elTop - window.innerHeight / 2 + rect.height / 2 - offsetPx,
    )
  }

  if (block === 'nearest') {
    if (elTop >= viewportTop + offsetPx && elBottom <= viewportBottom - offsetPx) {
      return viewportTop
    }
    if (elTop < viewportTop + offsetPx) {
      return Math.max(0, elTop - offsetPx)
    }
    return Math.max(0, elBottom - window.innerHeight + offsetPx)
  }

  return Math.max(0, elTop - offsetPx)
}

export async function runTourScrollToElement(
  el: Element,
  scrollMode: TourScrollMode,
  routeChanged: boolean,
): Promise<void> {
  const { durationMs, routeChangePauseMs } = TOUR_SCROLL

  if (scrollMode === 'page-top') {
    scrollPageToTopInstant()
    await waitForScrollSettle(routeChangePauseMs)
    await waitForScrollSettle()
    return
  }

  if (routeChanged) {
    scrollPageToTopInstant()
    await waitForScrollSettle(routeChangePauseMs)

    const block: ScrollLogicalPosition =
      scrollMode === 'target-center' ? 'center' : 'start'
    const targetY = getScrollTopForElement(el, block)
    await smoothScrollToY(targetY, durationMs)
    await waitForScrollSettle()
    return
  }

  if (scrollMode === 'target-nearest') {
    const targetY = getScrollTopForElement(el, 'nearest')
    const delta = Math.abs(targetY - window.scrollY)
    if (delta < 48) {
      await waitForScrollSettle(120)
      return
    }
    await smoothScrollToY(targetY, Math.min(durationMs, 750))
    await waitForScrollSettle()
    return
  }

  const block: ScrollLogicalPosition =
    scrollMode === 'target-start' ? 'start' : 'center'
  const targetY = getScrollTopForElement(el, block)
  await smoothScrollToY(targetY, durationMs)
  await waitForScrollSettle()
}

function hasOverflowScrollParent(el: Element): boolean {
  let parent = el.parentElement
  while (parent) {
    const { overflowY } = getComputedStyle(parent)
    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
      parent.scrollHeight > parent.clientHeight + 1
    ) {
      return true
    }
    parent = parent.parentElement
  }
  return false
}

/** Scroll primary target, then gently bring an anchor element into view if different. */
export async function scrollTourStepIntoView(
  scrollEl: Element,
  anchorEl: Element | null,
  scrollMode: TourScrollMode,
  routeChanged: boolean,
): Promise<void> {
  await runTourScrollToElement(scrollEl, scrollMode, routeChanged)

  const focusEl = anchorEl ?? scrollEl
  if (hasOverflowScrollParent(focusEl)) {
    focusEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
    await waitForScrollSettle(380)
    return
  }

  if (!anchorEl || anchorEl === scrollEl) return

  await waitForScrollSettle(120)
  const anchorY = getScrollTopForElement(anchorEl, 'nearest')
  await smoothScrollToY(anchorY, Math.min(TOUR_SCROLL.durationMs, 750))
  await waitForScrollSettle()
}

export type AnchorPosition = {
  top: number
  left: number
  arrowLeft: number
  /** Narrower width when space to the right of the anchor is limited. */
  width?: number
  /** Vertical offset for a left-pointing arrow (anchored-left). */
  arrowTop?: number
}

const ANCHOR_GAP_PX = 14
const ARROW_SIZE_PX = 10
const VIEWPORT_PAD_PX = 12

function clampArrowOffset(
  targetCenterX: number,
  cardLeft: number,
  cardWidth: number,
): number {
  const arrowOffset = targetCenterX - cardLeft
  return Math.max(
    ARROW_SIZE_PX + 4,
    Math.min(cardWidth - ARROW_SIZE_PX - 4, arrowOffset),
  )
}

export function computeAnchoredAbovePosition(
  target: Element,
  cardWidth: number,
  cardHeight: number,
): AnchorPosition {
  const rect = target.getBoundingClientRect()
  const totalHeight = cardHeight + ARROW_SIZE_PX + ANCHOR_GAP_PX
  let top = rect.top - totalHeight
  let left = rect.left + rect.width / 2 - cardWidth / 2

  const maxLeft = window.innerWidth - cardWidth - VIEWPORT_PAD_PX
  if (left < VIEWPORT_PAD_PX) left = VIEWPORT_PAD_PX
  if (left > maxLeft) left = maxLeft
  if (top < VIEWPORT_PAD_PX) top = VIEWPORT_PAD_PX

  return {
    top,
    left,
    arrowLeft: clampArrowOffset(rect.left + rect.width / 2, left, cardWidth),
  }
}

export function computeAnchoredLeftPosition(
  target: Element,
  cardWidth: number,
  cardHeight: number,
): AnchorPosition {
  const rect = target.getBoundingClientRect()
  const gap = ANCHOR_GAP_PX + ARROW_SIZE_PX
  const pad = VIEWPORT_PAD_PX
  const availableRight = window.innerWidth - rect.right - gap - pad
  const width = Math.min(cardWidth, Math.max(availableRight, 12 * 16))

  const left = rect.right + gap
  let top = rect.top + rect.height / 2 - cardHeight / 2

  const maxTop = window.innerHeight - cardHeight - pad
  if (top < pad) top = pad
  if (top > maxTop) top = maxTop

  const targetCenterY = rect.top + rect.height / 2
  const arrowTop = Math.max(
    ARROW_SIZE_PX + 4,
    Math.min(targetCenterY - top, cardHeight - ARROW_SIZE_PX - 4),
  )

  return {
    top,
    left,
    width,
    arrowLeft: ARROW_SIZE_PX,
    arrowTop,
  }
}

export function computeAnchoredBelowPosition(
  target: Element,
  cardWidth: number,
  _cardHeight: number,
): AnchorPosition {
  const rect = target.getBoundingClientRect()
  const top = rect.bottom + ANCHOR_GAP_PX + ARROW_SIZE_PX
  let left = rect.left + rect.width / 2 - cardWidth / 2

  const maxLeft = window.innerWidth - cardWidth - VIEWPORT_PAD_PX
  if (left < VIEWPORT_PAD_PX) left = VIEWPORT_PAD_PX
  if (left > maxLeft) left = maxLeft

  return {
    top,
    left,
    arrowLeft: clampArrowOffset(rect.left + rect.width / 2, left, cardWidth),
  }
}

export function computeAnchoredPosition(
  target: Element,
  cardWidth: number,
  cardHeight: number,
  placement: 'anchored-above' | 'anchored-below' | 'anchored-left',
): AnchorPosition {
  if (placement === 'anchored-below') {
    return computeAnchoredBelowPosition(target, cardWidth, cardHeight)
  }
  if (placement === 'anchored-left') {
    return computeAnchoredLeftPosition(target, cardWidth, cardHeight)
  }
  return computeAnchoredAbovePosition(target, cardWidth, cardHeight)
}

export function anchoredCardSelector(
  placement: 'anchored-above' | 'anchored-below' | 'anchored-left',
): string {
  return `.solution-tour__card--${placement}`
}

export { ARROW_SIZE_PX, IQ_HOME_PATH }
