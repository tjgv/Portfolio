import { BrowserRouter } from 'react-router-dom'
import { NflIqApp } from './nfl-iq/NflIqApp'
import { routerBasename } from './nfl-iq/lib/app-paths'

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <NflIqApp />
    </BrowserRouter>
  )
}
