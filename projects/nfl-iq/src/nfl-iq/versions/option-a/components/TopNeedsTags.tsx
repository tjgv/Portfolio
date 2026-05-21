import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { TopNeedTag } from '../data/team-spending.mock'
import { formatPositionLabel } from '../data/position-names'
import './free-agency-spending-panel.css'
import './top-needs-tags.css'

type LabelMode = 'full' | 'abbrev'

type TopNeedsTagsProps = {
  tags: TopNeedTag[]
}

function NeedTag({
  tag,
  mode,
}: {
  tag: TopNeedTag
  mode: LabelMode
}) {
  const critical = tag.status === 'critical'
  const label = formatPositionLabel(tag.pos, mode, critical)
  const icon =
    tag.status === 'done'
      ? '✓'
      : tag.status === 'partial'
        ? '−'
        : tag.status === 'critical'
          ? '!'
          : null

  return (
    <span
      className={`fa-spending__need-tag fa-spending__need-tag--${tag.status}`}
      title={formatPositionLabel(tag.pos, 'full', critical)}
    >
      {icon && tag.status !== 'critical' ? (
        <span className="fa-spending__need-icon" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="fa-spending__need-label">{label}</span>
    </span>
  )
}

export function TopNeedsTags({ tags }: TopNeedsTagsProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<LabelMode>('abbrev')

  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const ruler = measureRef.current
    if (!wrap || !ruler) return

    const available = wrap.clientWidth
    const needed = ruler.scrollWidth
    setMode(needed <= available ? 'full' : 'abbrev')
  }, [tags])

  useLayoutEffect(() => {
    measure()
    const wrap = wrapRef.current
    if (!wrap) return

    const observer = new ResizeObserver(() => measure())
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [measure])

  return (
    <div ref={wrapRef} className="fa-spending__needs-tags-wrap">
      <div
        ref={measureRef}
        className="fa-spending__needs-tags fa-spending__needs-tags--measure"
        aria-hidden
      >
        {tags.map((tag, i) => (
          <NeedTag key={`measure-${tag.pos}-${i}`} tag={tag} mode="full" />
        ))}
      </div>
      <div
        className={`fa-spending__needs-tags fa-spending__needs-tags--${mode}`}
        role="list"
      >
        {tags.map((tag, i) => (
          <NeedTag key={`${tag.pos}-${i}`} tag={tag} mode={mode} />
        ))}
      </div>
    </div>
  )
}
