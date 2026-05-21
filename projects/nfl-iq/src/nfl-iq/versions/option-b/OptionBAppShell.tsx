import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AskIqChat } from '../../components/AskIqChat'
import { IqBottomNav } from '../../components/IqBottomNav'
import { IqSiteFooter } from '../../components/IqSiteFooter'
import { QuicksuiteToolbar } from '../../components/QuicksuiteToolbar'
import { TeamPicker } from '../../components/TeamPicker'
import { IqTeamProvider } from '../../context/IqTeamContext'
import { DraftSubnav } from '../../components/DraftSubnav'
import { DraftCentralPage } from '../../pages/DraftCentralPage'
import { FreeAgencyPage } from '../../pages/FreeAgencyPage'
import { HomePage } from '../../pages/HomePage'
import { PlaceholderPage } from '../../pages/PlaceholderPage'
import { TeamCentralPage } from '../../pages/TeamCentralPage'
import { OptionBSiteNav } from './OptionBSiteNav'
import '../../nfl-iq.css'

export function OptionBAppShell() {
  const { pathname } = useLocation()
  const showDraftSubnav = pathname.startsWith('/draft')
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <IqTeamProvider>
      <div className="nfl-iq" data-mock-version="option-b">
        <a className="iq-skip" href="#main-content">
          Skip to main content
        </a>
        <OptionBSiteNav onAskIq={() => setChatOpen(true)} />
        <QuicksuiteToolbar />
        {showDraftSubnav ? <DraftSubnav /> : null}
        <TeamPicker />

        <div className="iq-layout">
          <main id="main-content" className="iq-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamCentralPage />} />
              <Route path="/free-agency" element={<FreeAgencyPage />} />
              <Route path="/draft" element={<DraftCentralPage />} />
              <Route
                path="/news"
                element={
                  <PlaceholderPage
                    title="News"
                    description="Offseason news and analysis feeds appear here on NFL.com."
                  />
                }
              />
              <Route
                path="/coach"
                element={
                  <PlaceholderPage
                    title="Coach"
                    description="Coaching and scheme insights — coming in a future NFL IQ release."
                  />
                }
              />
            </Routes>
          </main>
        </div>

        <IqSiteFooter />
        <IqBottomNav />
        <AskIqChat open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </IqTeamProvider>
  )
}
