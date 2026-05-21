import { SolutionShowcaseBar } from './components/SolutionShowcaseBar'
import { SolutionTourOverlay } from './components/SolutionTourOverlay'
import { SolutionShowcaseProvider } from './context/SolutionShowcaseProvider'
import { NflIqAppOptionA } from './versions'

export function NflIqApp() {
  return (
    <SolutionShowcaseProvider>
      <div className="mock-showcase">
        <SolutionShowcaseBar />
        <NflIqAppOptionA />
        <SolutionTourOverlay />
      </div>
    </SolutionShowcaseProvider>
  )
}
