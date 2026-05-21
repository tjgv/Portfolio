import { IqTabHeader } from '../../../components/IqTabHeader'
import { OptionAFreeAgencyBoard } from '../components/OptionAFreeAgencyBoard'
import { OptionARecentSigningsTable } from '../components/OptionARecentSigningsTable'
import { RECENT_SIGNINGS } from '../data/recent-signings.mock'
import '../../../pages/free-agency.css'
import '../../../components/free-agency-board.css'
import './option-a-free-agency.css'

export function OptionAFreeAgencyPage() {
  return (
    <div className="free-agency-page free-agency-page--option-a">
      <IqTabHeader
        title="2026 FREE AGENCY CENTRAL"
        subtitle="GO INSIDE THE MINDS OF AN NFL PRO SCOUTING DEPARTMENT WITH NFL IQ POWERED BY AMAZON QUICK"
      />

      <section
        className="free-agency-board-section"
        aria-label="Free agency boards"
      >
        <OptionAFreeAgencyBoard />
      </section>

      <section className="free-agency-signings" aria-label="Recent signings">
        <h2 className="free-agency-signings__head">Recent signings</h2>
        <OptionARecentSigningsTable signings={RECENT_SIGNINGS} />
      </section>
    </div>
  )
}
