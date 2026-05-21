import { useContext } from 'react'
import { MockVersionContext } from './mock-version-context'

export function useMockVersion() {
  const ctx = useContext(MockVersionContext)
  if (!ctx) {
    throw new Error('useMockVersion must be used within MockVersionProvider')
  }
  return ctx
}
