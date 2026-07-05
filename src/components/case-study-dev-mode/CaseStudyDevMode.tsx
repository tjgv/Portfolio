import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import './CaseStudyDevMode.css'

const TEXT_TAGS = new Set([
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'LI', 'LABEL', 'STRONG', 'EM', 'SMALL', 'BLOCKQUOTE', 'FIGCAPTION',
])

const DEV_CLASS_PREFIXES = ['np1-', 'new-project-1-', 'project-', 'cx-pro-']

type TooltipState =
  | { kind: 'text'; x: number; y: number; size: string; weight: string; tracking: string; tag: string }
  | { kind: 'box'; x: number; y: number; width: number; height: number; tag: string }
  | null

type SectionLabel = {
  key: string
  path: string
  classes: string
  top: number
  right: number
  width: number
  height: number
  paddingZones: PaddingZone[]
}

type PaddingZone = {
  top: number
  left: number
  width: number
  height: number
}

function getSectionContentInsets(section: HTMLElement) {
  const outer = section.getBoundingClientRect()
  const sectionStyle = window.getComputedStyle(section)

  let top = outer.top + (parseFloat(sectionStyle.paddingTop) || 0)
  let left = outer.left + (parseFloat(sectionStyle.paddingLeft) || 0)
  let right = outer.right - (parseFloat(sectionStyle.paddingRight) || 0)
  let bottom = outer.bottom - (parseFloat(sectionStyle.paddingBottom) || 0)

  const inner = section.querySelector(
    ':scope > .np1-section__inner, :scope > .np1-side-shot__inner, :scope > .np1-problem__copy',
  )
  if (inner instanceof HTMLElement) {
    const innerStyle = window.getComputedStyle(inner)
    top += parseFloat(innerStyle.paddingTop) || 0
    left += parseFloat(innerStyle.paddingLeft) || 0
    right -= parseFloat(innerStyle.paddingRight) || 0
    bottom -= parseFloat(innerStyle.paddingBottom) || 0
  }

  return { outer, content: { top, left, right, bottom } }
}

function getSectionPaddingZones(section: HTMLElement): PaddingZone[] {
  const { outer, content } = getSectionContentInsets(section)
  const zones: PaddingZone[] = []

  const topHeight = content.top - outer.top
  const bottomHeight = outer.bottom - content.bottom
  const leftWidth = content.left - outer.left
  const rightWidth = outer.right - content.right
  const middleHeight = content.bottom - content.top

  if (topHeight > 0.5) {
    zones.push({ top: outer.top, left: outer.left, width: outer.width, height: topHeight })
  }
  if (bottomHeight > 0.5) {
    zones.push({ top: content.bottom, left: outer.left, width: outer.width, height: bottomHeight })
  }
  if (leftWidth > 0.5 && middleHeight > 0.5) {
    zones.push({ top: content.top, left: outer.left, width: leftWidth, height: middleHeight })
  }
  if (rightWidth > 0.5 && middleHeight > 0.5) {
    zones.push({ top: content.top, left: content.right, width: rightWidth, height: middleHeight })
  }

  return zones
}

function findTextTarget(el: Element | null): Element | null {
  let node = el
  while (node) {
    if (TEXT_TAGS.has(node.tagName)) {
      const text = node.textContent?.trim()
      if (text) return node
    }
    node = node.parentElement
  }
  return null
}

function isDevModeUi(el: Element | null): boolean {
  return Boolean(el?.closest('.case-study-dev-mode'))
}

function formatWeight(weight: string): string {
  const n = Number(weight)
  if (!Number.isNaN(n)) return String(n)
  return weight
}

function formatTracking(letterSpacing: string, fontSize: string): string {
  const size = parseFloat(fontSize)
  const spacing = parseFloat(letterSpacing)
  if (Number.isNaN(size) || Number.isNaN(spacing) || size === 0) return letterSpacing
  const em = spacing / size
  return `${letterSpacing} (${em.toFixed(3)}em)`
}

function getSectionPath(el: Element, scope: HTMLElement): string[] {
  const path: string[] = []
  let node: Element | null = el
  while (node && node !== scope && scope.contains(node)) {
    const name = node.getAttribute('data-dev-section')
    if (name) path.unshift(name)
    node = node.parentElement
  }
  return path
}

function getDevClasses(el: Element): string {
  return Array.from(el.classList)
    .filter((c) => DEV_CLASS_PREFIXES.some((prefix) => c.startsWith(prefix)))
    .join(' ')
}

function isOutermostDevSection(el: Element, scope: HTMLElement): boolean {
  let parent = el.parentElement
  while (parent && parent !== scope) {
    if (parent.hasAttribute('data-dev-section')) return false
    parent = parent.parentElement
  }
  return true
}

interface CaseStudyDevModeProps {
  activeClassName?: string
  scopeRef?: RefObject<HTMLElement | null>
}

export default function CaseStudyDevMode({ activeClassName, scopeRef }: CaseStudyDevModeProps) {
  const [enabled, setEnabled] = useState(false)
  const [tooltip, setTooltip] = useState<TooltipState>(null)
  const [sectionLabels, setSectionLabels] = useState<SectionLabel[]>([])
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const root = scopeRef?.current ?? document.documentElement
    root.classList.toggle(activeClassName ?? 'case-study-dev-mode-active', enabled)
    return () => root.classList.remove(activeClassName ?? 'case-study-dev-mode-active')
  }, [enabled, activeClassName, scopeRef])

  const updateSectionLabels = useCallback(() => {
    const scope = scopeRef?.current
    if (!scope || !enabled) {
      setSectionLabels([])
      return
    }

    const els = scope.querySelectorAll('[data-dev-section]')
    const next: SectionLabel[] = []

    els.forEach((el, index) => {
      if (!isOutermostDevSection(el, scope)) return

      const rect = el.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return

      const pathParts = getSectionPath(el, scope)

      next.push({
        key: `${pathParts.join('/')}-${index}`,
        path: pathParts.join(' / '),
        classes: getDevClasses(el),
        top: rect.top + 4,
        right: rect.right - 4,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        paddingZones: el instanceof HTMLElement ? getSectionPaddingZones(el) : [],
      })
    })

    setSectionLabels(next)
  }, [enabled, scopeRef])

  useEffect(() => {
    if (!enabled) {
      setSectionLabels([])
      return
    }

    updateSectionLabels()

    let labelRafId = 0
    const scheduleLabelUpdate = () => {
      if (labelRafId) return
      labelRafId = requestAnimationFrame(() => {
        labelRafId = 0
        updateSectionLabels()
      })
    }

    window.addEventListener('scroll', scheduleLabelUpdate, { passive: true })
    window.addEventListener('resize', scheduleLabelUpdate)
    return () => {
      window.removeEventListener('scroll', scheduleLabelUpdate)
      window.removeEventListener('resize', scheduleLabelUpdate)
      if (labelRafId) cancelAnimationFrame(labelRafId)
    }
  }, [enabled, updateSectionLabels])

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!enabled) return
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const target = document.elementFromPoint(event.clientX, event.clientY)
        if (!target || isDevModeUi(target)) {
          setTooltip(null)
          return
        }

        const scope = scopeRef?.current
        if (scope && !scope.contains(target)) {
          setTooltip(null)
          return
        }

        const textTarget = findTextTarget(target)
        if (textTarget) {
          const style = window.getComputedStyle(textTarget)
          setTooltip({
            kind: 'text',
            x: event.clientX,
            y: event.clientY,
            size: style.fontSize,
            weight: formatWeight(style.fontWeight),
            tracking: formatTracking(style.letterSpacing, style.fontSize),
            tag: textTarget.tagName.toLowerCase(),
          })
          return
        }

        const box = (target as HTMLElement).getBoundingClientRect()
        setTooltip({
          kind: 'box',
          x: event.clientX,
          y: event.clientY,
          width: Math.round(box.width),
          height: Math.round(box.height),
          tag: target.tagName.toLowerCase(),
        })
      })
    },
    [enabled, scopeRef],
  )

  useEffect(() => {
    if (!enabled) {
      setTooltip(null)
      return
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [enabled, handlePointerMove])

  return (
    <div className="case-study-dev-mode" aria-hidden={!enabled}>
      <button
        type="button"
        className={`case-study-dev-mode__toggle${enabled ? ' case-study-dev-mode__toggle--active' : ''}`}
        onClick={() => setEnabled((v) => !v)}
        aria-pressed={enabled}
      >
        Dev Mode
      </button>
      {enabled &&
        sectionLabels.flatMap((label) =>
          label.paddingZones.map((zone, zoneIndex) => (
            <div
              key={`${label.key}-pad-${zoneIndex}`}
              className="case-study-dev-mode__padding-zone"
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height,
              }}
            />
          )),
        )}
      {enabled &&
        sectionLabels.map((label) => (
          <div
            key={label.key}
            className="case-study-dev-mode__section-label"
            style={{ top: label.top, left: label.right, transform: 'translateX(-100%)' }}
          >
            <span className="case-study-dev-mode__section-label-path">{label.path}</span>
            <span className="case-study-dev-mode__section-label-size">
              {label.width} × {label.height}
            </span>
            {label.classes && (
              <span className="case-study-dev-mode__section-label-classes">{label.classes}</span>
            )}
          </div>
        ))}
      {enabled && tooltip && (
        <div
          className="case-study-dev-mode__tooltip"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          {tooltip.kind === 'text' ? (
            <>
              <span className="case-study-dev-mode__tooltip-tag">{tooltip.tag}</span>
              <span>Size: {tooltip.size}</span>
              <span>Weight: {tooltip.weight}</span>
              <span>Tracking: {tooltip.tracking}</span>
            </>
          ) : (
            <>
              <span className="case-study-dev-mode__tooltip-tag">{tooltip.tag}</span>
              <span>
                {tooltip.width} × {tooltip.height}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
