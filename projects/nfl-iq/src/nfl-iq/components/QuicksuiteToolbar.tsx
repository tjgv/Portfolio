import { useLocation, useNavigate } from 'react-router-dom'
import { NFL_IQ_LOGO, espnTeamLogoUrl } from '../constants'
import { useIqTeam } from '../context/useIqTeam'
import '../quicksuite.css'

type TabId = 'team-central' | 'nfl-draft' | 'free-agency'

const TABS: { id: TabId; label: string; path: string }[] = [
  { id: 'team-central', label: 'Team Central', path: '/teams' },
  { id: 'nfl-draft', label: 'NFL Draft', path: '/draft' },
  { id: 'free-agency', label: 'Free Agency', path: '/free-agency' },
]

function pathToTab(pathname: string): TabId | null {
  if (pathname.startsWith('/teams')) return 'team-central'
  if (pathname.startsWith('/draft')) return 'nfl-draft'
  if (pathname.startsWith('/free-agency')) return 'free-agency'
  return null
}

function isIqHome(pathname: string): boolean {
  return pathname === '/'
}

export function QuicksuiteToolbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { selectedTeamId, teamCentralActivated, activateTeamCentral } = useIqTeam()

  const activeTab = pathToTab(pathname)
  const iqHomeActive = isIqHome(pathname)

  const handleIqHome = () => {
    navigate('/')
  }

  const handleTab = (tab: (typeof TABS)[number]) => {
    if (tab.id === 'team-central') {
      activateTeamCentral()
    }
    navigate(tab.path)
  }

  const showTeamLogo = teamCentralActivated && selectedTeamId != null

  return (
    <div id="quicksuite-toolbar" className="quicksuite-toolbar">
      <div className="iq-page-inner quicksuite-toolbar__inner">
        <div className="toolbar-left">
        <button
          type="button"
          className={`nfl-logo${iqHomeActive ? ' iq-home-active' : ''}`}
          id="home-btn"
          title="NFL IQ"
          aria-label="NFL IQ"
          aria-current={iqHomeActive ? 'page' : undefined}
          onClick={handleIqHome}
        >
          <img src={NFL_IQ_LOGO} alt="NFL IQ" />
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <div
                key={tab.id}
                className={`nav-item${isActive ? ' active' : ''}`}
                data-tab={tab.id}
              >
                <button
                  type="button"
                  className={
                    isActive
                      ? 'nav-tab iq-toolbar-tab iq-toolbar-tab--active'
                      : 'nav-tab iq-toolbar-tab'
                  }
                  data-tab={tab.id}
                  aria-current={isActive ? 'page' : false}
                  onClick={() => handleTab(tab)}
                >
                  {tab.id === 'team-central' && showTeamLogo && (
                    <img
                      src={espnTeamLogoUrl(selectedTeamId)}
                      alt={selectedTeamId}
                      className="nav-team-logo loaded"
                    />
                  )}
                  {tab.label}
                </button>
              </div>
            )
          })}
        </nav>
        </div>
      </div>
    </div>
  )
}
