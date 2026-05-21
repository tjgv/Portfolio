import { MockVersionBar } from './components/MockVersionBar'
import { MockVersionProvider } from './context/MockVersionProvider'
import { useMockVersion } from './context/useMockVersion'
import { MOCK_VERSION_APPS } from './versions'

function MockVersionApp() {
  const { version } = useMockVersion()
  const App = MOCK_VERSION_APPS[version]
  return <App key={version} />
}

export function NflIqApp() {
  return (
    <MockVersionProvider>
      <div className="mock-showcase">
        <MockVersionBar />
        <MockVersionApp />
      </div>
    </MockVersionProvider>
  )
}
