import { IqDraftRoundBoard } from './IqDraftRoundBoard'
import './iq-draft-round-board.css'

export function IqHomeRoundRecap() {
  return (
    <section
      className="iq-home-round-recap iq-draft-widget-section"
      aria-label="Round recap"
    >
      <h2 className="iq-home-display iq-home-round-recap__title">ROUND RECAP</h2>
      <IqDraftRoundBoard />
    </section>
  )
}
