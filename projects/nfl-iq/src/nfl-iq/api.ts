import type { DepthUnit, DraftBoardProspect, FreeAgent, Team, TeamNeed, Transaction } from './types'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Request failed: ${path}`)
  return res.json() as Promise<T>
}

export function fetchTeams() {
  return getJson<{ teams: Team[] }>('/api/iq/teams')
}

export function fetchTeam(id: string) {
  return getJson<{ team: Team; needs: TeamNeed[]; depthChart: DepthUnit[] }>(
    `/api/iq/teams/${id}`,
  )
}

export function fetchFreeAgency() {
  return getJson<{ agents: FreeAgent[]; transactions: Transaction[] }>('/api/iq/free-agency')
}

export function fetchDraft() {
  return getJson<{ prospects: DraftBoardProspect[] }>('/api/iq/draft')
}

export function fetchChatSuggestions() {
  return getJson<{ suggestions: string[] }>('/api/iq/chat/suggestions')
}

export async function sendChatMessage(message: string) {
  const res = await fetch('/api/iq/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('Chat request failed')
  return res.json() as Promise<{ reply: string }>
}
