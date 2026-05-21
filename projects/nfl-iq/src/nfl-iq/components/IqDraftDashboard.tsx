import { IqTabHeader } from './IqTabHeader'
import { IqHomeBiggestWinners } from './IqHomeBiggestWinners'
import { IqHomeHero } from './IqHomeHero'
import { IqHomeRoundRecap } from './IqHomeRoundRecap'
import { IqHomeValuePicks } from './IqHomeValuePicks'
import './iq-home.css'

export function IqDraftDashboard() {
  return (
    <div className="iq-home">
      <IqTabHeader
        title="2026 NFL DRAFT RESULTS"
        subtitle="GO INSIDE THE DRAFT ROOM WITH NFL IQ POWERED BY AMAZON QUICK"
      />

      <IqHomeHero />
      <IqHomeValuePicks />
      <IqHomeBiggestWinners />
      <IqHomeRoundRecap />
    </div>
  )
}
