import { getTeamSpendingProfile } from '../data/team-spending.mock'
import { TopNeedsTags } from './TopNeedsTags'
import './free-agency-spending-panel.css'
import './option-a-fa-top-needs.css'

type FreeAgencyTopNeedsSectionProps = {
  teamId: string
}

export function FreeAgencyTopNeedsSection({ teamId }: FreeAgencyTopNeedsSectionProps) {
  const profile = getTeamSpendingProfile(teamId)

  return (
    <section
      className="fa-spending__needs fa-spending__needs--fa-roster"
      aria-label="Top needs"
    >
      <div className="fa-spending__needs-header">
        <p className="fa-spending__needs-label">Top Needs</p>
      </div>
      <TopNeedsTags tags={profile.topNeeds} />
    </section>
  )
}
