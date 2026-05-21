import { MessageCircle } from 'lucide-react'
import { NFL_LOGO } from '../constants'

type IqHeaderProps = {
  onOpenChat: () => void
}

export function IqHeader({ onOpenChat }: IqHeaderProps) {
  return (
    <header className="iq-header">
      <div className="iq-header__inner">
        <div className="iq-header__brand">
          <img className="iq-header__nfl-logo" src={NFL_LOGO} alt="NFL" />
          <div className="iq-header__title">
            <span className="iq-header__title-main">2026 NFL IQ</span>
            <span className="iq-header__title-sub">
              Powered by <strong>Amazon Quick</strong>
            </span>
          </div>
        </div>
        <div className="iq-header__actions">
          <button type="button" className="iq-btn iq-btn--accent" onClick={onOpenChat}>
            <MessageCircle size={16} />
            Ask NFL IQ
          </button>
        </div>
      </div>
    </header>
  )
}
