import { TeamCentralDraftClassTile } from './TeamCentralDraftClassTile'
import { TeamCentralRosterTile } from './TeamCentralRosterTile'
import './team-central-charts.css'

type TeamCentralChartsProps = {
  teamId: string
}

export function TeamCentralCharts({ teamId }: TeamCentralChartsProps) {
  return (
    <section
      className="team-central-charts"
      aria-label="2026 roster and draft analytics"
    >
      <div className="team-central-charts__grid team-central-charts__grid--fa-layout">
        <TeamCentralDraftClassTile
          teamId={teamId}
          className="team-central-charts__tile--main"
        />
        <TeamCentralRosterTile
          teamId={teamId}
          headerLayout="sidebar"
          className="team-central-charts__tile--sidebar"
        />
      </div>
    </section>
  )
}
