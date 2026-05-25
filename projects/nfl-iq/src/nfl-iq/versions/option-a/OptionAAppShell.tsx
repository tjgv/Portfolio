import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

function DraftTestRedirect() {
  const { search, hash } = useLocation()
  return <Navigate to={`/draft${search}${hash}`} replace />
}
import { AskIqChat } from '../../components/AskIqChat'
import { IqBottomNav } from '../../components/IqBottomNav'
import { IqSiteFooter } from '../../components/IqSiteFooter'
import { QuicksuiteToolbar } from '../../components/QuicksuiteToolbar'
import { SolutionShowcaseBar } from '../../components/SolutionShowcaseBar'
import { TeamPicker } from '../../components/TeamPicker'
import { OptionATeamFilterStrip } from './components/OptionATeamFilterStrip'
import { IqTeamProvider } from '../../context/IqTeamContext'
import { DraftSubnav } from '../../components/DraftSubnav'
import { OptionADraftCentralPage } from './pages/OptionADraftCentralPage'
import { OptionAFreeAgencyPage } from './pages/OptionAFreeAgencyPage'
import { HomePage } from '../../pages/HomePage'
import { PlaceholderPage } from '../../pages/PlaceholderPage'
import { TeamCentralPage } from '../../pages/TeamCentralPage'
import { IqScrollToTop } from '../../components/IqScrollToTop'
import { SolutionTourTeamPrepare } from '../../solution-showcase/SolutionTourTeamPrepare'
import { OptionASiteNav } from './OptionASiteNav'
import '../../nfl-iq.css'
import './option-a-layout.css'
import './option-a-table-headers.css'
import './option-a-table-typography.css'

export function OptionAAppShell() {
  const { pathname } = useLocation()
  const showDraftSubnav = pathname.startsWith('/draft')
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <IqTeamProvider>
      <SolutionTourTeamPrepare />
      <div className="nfl-iq" data-mock-version="option-a">
        <SolutionShowcaseBar />
        <a className="iq-skip" href="#main-content">
          Skip to main content
        </a>
        <OptionASiteNav onAskIq={() => setChatOpen(true)} />
        <QuicksuiteToolbar />
        {showDraftSubnav ? <DraftSubnav /> : null}
        <OptionATeamFilterStrip />
        <TeamPicker />

        <IqScrollToTop />
        <div className="iq-layout">
          <main id="main-content" className="iq-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/teams" element={<TeamCentralPage />} />
              <Route path="/free-agency" element={<OptionAFreeAgencyPage />} />
              <Route path="/draft" element={<OptionADraftCentralPage />} />
              <Route path="/draft-test" element={<DraftTestRedirect />} />
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
