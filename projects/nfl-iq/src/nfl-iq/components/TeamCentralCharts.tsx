import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { TeamCentralDraftClassTile } from './TeamCentralDraftClassTile'
import { TeamCentralRosterTile } from './TeamCentralRosterTile'
import './team-central-charts.css'

type TeamCentralChartsProps = {
  teamId: string
}

export function TeamCentralCharts({ teamId }: TeamCentralChartsProps) {
  const draftAnchorRef = useRef<HTMLDivElement>(null)
  const [draftPanelHeight, setDraftPanelHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = draftAnchorRef.current
    if (!node) return

    const updateHeight = () => {
      setDraftPanelHeight(node.offsetHeight)
    }

    updateHeight()
    const observer = new ResizeObserver(updateHeight)
    observer.observe(node)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [teamId])

  const gridStyle =
    draftPanelHeight != null
      ? ({ '--tc-draft-panel-h': `${draftPanelHeight}px` } as CSSProperties)
      : undefined

  return (
    <section
      className="team-central-charts"
      aria-label="2026 roster and draft analytics"
    >
      <div
        className="team-central-charts__grid team-central-charts__grid--fa-layout"
        style={gridStyle}
      >
        <div ref={draftAnchorRef} className="team-central-charts__draft-anchor">
          <TeamCentralDraftClassTile
            teamId={teamId}
            className="team-central-charts__tile--main"
          />
        </div>
        <TeamCentralRosterTile
          teamId={teamId}
          headerLayout="sidebar"
          className="team-central-charts__tile--sidebar"
        />
      </div>
    </section>
  )
}
