import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ALL_NFL_TEAMS } from '../constants'
import { IqTeamContext, type IqTeamContextValue } from './iq-team-context'

const FIRST_TEAM_ID = ALL_NFL_TEAMS[0].id

export function IqTeamProvider({ children }: { children: ReactNode }) {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [teamCentralActivated, setTeamCentralActivated] = useState(false)
  const activateTeamCentral = useCallback(() => {
    setTeamCentralActivated(true)
    const nextId = selectedTeamId ?? FIRST_TEAM_ID
    setSelectedTeamId(nextId)
    return nextId
  }, [selectedTeamId])

  const setSelectedTeam = useCallback((teamId: string | null) => {
    setSelectedTeamId(teamId ? teamId.toUpperCase() : null)
  }, [])

  const selectTeam = useCallback(
    (teamId: string) => {
      setSelectedTeam(teamId)
    },
    [setSelectedTeam],
  )

  const value = useMemo<IqTeamContextValue>(
    () => ({
      selectedTeamId,
      teamCentralActivated,
      selectTeam,
      setSelectedTeam,
      activateTeamCentral,
    }),
    [
      selectedTeamId,
      teamCentralActivated,
      selectTeam,
      setSelectedTeam,
      activateTeamCentral,
    ],
  )

  return <IqTeamContext.Provider value={value}>{children}</IqTeamContext.Provider>
}
