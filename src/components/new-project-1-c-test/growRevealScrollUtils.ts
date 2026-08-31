/** Shared scroll + timing helpers for grow / reveal sections. */

export const OPEN_ANIM_MS = 2080
export const CLOSE_ANIM_MS = 220
export const OPEN_ANIM_DELAY_MS = 200
export const ANIM_SCROLL_TRIGGER = 0.5
export const RETRACT_PREV_SECTION_VISIBLE_VH = 25
export const CONTROLS_READY_PROGRESS = 0.76

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function phaseRange(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0
  return clamp01((progress - start) / (end - start))
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function computeSectionScrollProgress(section: HTMLElement): number {
  const vh = window.innerHeight
  const sectionTop = section.offsetTop
  const sectionHeight = section.offsetHeight
  const scrollY = window.scrollY

  const scrollStart = sectionTop - vh
  const scrollEnd = sectionTop + sectionHeight - vh
  const scrollRange = Math.max(1, scrollEnd - scrollStart)

  return clamp01((scrollY - scrollStart) / scrollRange)
}

export function getPreviousSection(section: HTMLElement): HTMLElement | null {
  let el = section.previousElementSibling
  while (el) {
    if (el instanceof HTMLElement && (el.tagName === 'SECTION' || el.hasAttribute('data-dev-section'))) {
      return el
    }
    el = el.previousElementSibling
  }
  return null
}

function getElementVisibleHeightPx(element: HTMLElement): number {
  const rect = element.getBoundingClientRect()
  const vh = window.innerHeight
  const visibleTop = Math.max(0, rect.top)
  const visibleBottom = Math.min(vh, rect.bottom)
  return Math.max(0, visibleBottom - visibleTop)
}

export function shouldRetractFromScroll(section: HTMLElement): boolean {
  const prevSection = getPreviousSection(section)
  if (!prevSection) return false
  const thresholdPx = (RETRACT_PREV_SECTION_VISIBLE_VH / 100) * window.innerHeight
  return getElementVisibleHeightPx(prevSection) >= thresholdPx
}

export function getDocumentTop(el: HTMLElement): number {
  return el.getBoundingClientRect().top + window.scrollY
}

/** True when any part of the section is visible in the viewport. */
export function isSectionInViewport(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

/** True when the section is fully above or below the viewport. */
export function isSectionOutOfViewport(section: HTMLElement): boolean {
  const rect = section.getBoundingClientRect()
  return rect.bottom <= 0 || rect.top >= window.innerHeight
}
