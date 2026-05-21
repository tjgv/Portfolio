import type { ReactNode } from 'react'
import { publicAsset } from '../lib/app-paths'
import { IqHeaderPartners } from './IqHeaderPartners'
import './iq-header-partners.css'
import './iq-tab-header.css'

const DRAFT_LOGO = publicAsset('/images/nfl-draft.png')

export type IqTabHeaderProps = {
  title: string
  subtitle: string
  /** Replaces NFL IQ / Amazon Quick promo block when provided */
  rightSlot?: ReactNode
}

export function IqTabHeader({ title, subtitle, rightSlot }: IqTabHeaderProps) {
  return (
    <header className="iq-tab-header">
      <div className="iq-tab-header__left">
        <img className="iq-tab-header__draft-logo" src={DRAFT_LOGO} alt="" />
        <div className="iq-tab-header__copy">
          <h1 className="iq-tab-header__title">{title}</h1>
          <p className="iq-tab-header__subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="iq-tab-header__right">
        {rightSlot ?? <IqHeaderPartners />}
      </div>
    </header>
  )
}
