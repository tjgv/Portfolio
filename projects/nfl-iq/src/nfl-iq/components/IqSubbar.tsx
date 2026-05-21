import { MessageCircle } from 'lucide-react'

type IqSubbarProps = {
  onOpenChat: () => void
}

export function IqSubbar({ onOpenChat }: IqSubbarProps) {
  return (
    <div className="iq-subbar">
      <div className="iq-subbar__inner">
        <div className="iq-subbar__brand">
          <span className="iq-subbar__title">2026 NFL IQ</span>
          <span className="iq-subbar__sub">
            Powered by <strong>Amazon Quick</strong>
          </span>
        </div>
        <button type="button" className="iq-subbar__ask" onClick={onOpenChat}>
          <MessageCircle size={16} />
          Ask NFL IQ
        </button>
      </div>
    </div>
  )
}
