import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useLayoutEffect, lazy, Suspense } from 'react'
import HomePageV2 from './pages/HomePageV2'
import ContactPage from './pages/ContactPage'
import PromptView from './pages/PromptView'
import PromptsPage from './pages/PromptsPage'
import CxProPage from './pages/CxProPage'
import Project2Page from './pages/Project2Page'

// Lazy-load Workflow Builder (isolates @xyflow/react) – no impact on main site
const WorkflowBuilderPage = lazy(() => import('./pages/WorkflowBuilderPage'))

function ScrollToTopOnNavigate() {
  const location = useLocation()
  useLayoutEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0)
      if (document.documentElement) document.documentElement.scrollTop = 0
      if (document.body) document.body.scrollTop = 0
    }
    scrollToTop()
    // Prompts and other late-rendering pages may need a follow-up scroll
    const id = setTimeout(scrollToTop, 0)
    const id2 = setTimeout(scrollToTop, 100)
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop)
    })
    return () => {
      clearTimeout(id)
      clearTimeout(id2)
      cancelAnimationFrame(rafId)
    }
  }, [location.pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTopOnNavigate />
      <Routes>
        <Route path="/" element={<HomePageV2 />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/project1" element={<CxProPage />} />
        <Route path="/project2" element={<Project2Page />} />
        <Route path="/workflow" element={<Suspense fallback={null}><WorkflowBuilderPage /></Suspense>} />
        <Route path="/ai" element={<PromptsPage />} />
        <Route path="/prompts/:slug" element={<PromptView />} />
      </Routes>
    </>
  )
}
