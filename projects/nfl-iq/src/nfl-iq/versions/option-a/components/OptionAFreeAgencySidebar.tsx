import { useState } from 'react'
import { NFL_LOGO } from '../../../constants'
import { FreeAgencySpendingPanel } from './FreeAgencySpendingPanel'
import { OptionAMarketTable } from './OptionAMarketTable'
import { OptionASidebarDraftTable } from './OptionASidebarDraftTable'
import '../../../components/free-agency-board.css'
import './option-a-free-agency-sidebar.css'

type SidebarTab = 'spending' | 'market' | 'draft'

type OptionAFreeAgencySidebarProps = {
  selectedTeamId: string
}

export function OptionAFreeAgencySidebar({
  selectedTeamId,
}: OptionAFreeAgencySidebarProps) {
  const [tab, setTab] = useState<SidebarTab>('spending')

  return (
    <section className="fa-board__card fa-board__card--market fa-board__card--sidebar">
      <header className="fa-board__market-head">
        {tab === 'market' ? (
          <img className="fa-board__market-nfl" src={NFL_LOGO} alt="" width={22} height={22} />
        ) : null}
        <div
          className="fa-board__tabs fa-board__tabs--three"
          role="tablist"
          aria-label="Team sidebar"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'spending'}
            className={
              tab === 'spending'
                ? 'fa-board__tab fa-board__tab--active'
                : 'fa-board__tab'
            }
            onClick={() => setTab('spending')}
          >
            Spending
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'market'}
            className={
              tab === 'market'
                ? 'fa-board__tab fa-board__tab--active'
                : 'fa-board__tab'
            }
            onClick={() => setTab('market')}
          >
            Market
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'draft'}
            className={
              tab === 'draft'
                ? 'fa-board__tab fa-board__tab--active'
                : 'fa-board__tab'
            }
            onClick={() => setTab('draft')}
          >
            Draft Board
          </button>
        </div>
      </header>
      <div
        className={
          tab === 'spending'
            ? 'fa-board__scroll fa-board__scroll--spending'
            : 'fa-board__scroll'
        }
      >
        {tab === 'spending' ? (
          <FreeAgencySpendingPanel teamId={selectedTeamId} />
        ) : tab === 'market' ? (
          <OptionAMarketTable />
        ) : (
          <OptionASidebarDraftTable />
        )}
      </div>
    </section>
  )
}
