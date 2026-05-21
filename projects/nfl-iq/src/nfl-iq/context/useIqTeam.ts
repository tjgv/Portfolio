import { useContext } from 'react'
import { IqTeamContext } from './iq-team-context'

export function useIqTeam() {
  const ctx = useContext(IqTeamContext)
  if (!ctx) {
    throw new Error('useIqTeam must be used within IqTeamProvider')
  }
  return ctx
}
