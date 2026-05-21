import { createContext } from 'react'

export type IqTeamContextValue = {
  selectedTeamId: string | null
  teamCentralActivated: boolean
  selectTeam: (teamId: string) => void
  setSelectedTeam: (teamId: string | null) => void
  activateTeamCentral: () => string
}

export const IqTeamContext = createContext<IqTeamContextValue | null>(null)
