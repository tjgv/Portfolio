import { useContext } from 'react'
import { SolutionShowcaseContext } from './solution-showcase-context'

export function useSolutionShowcase() {
  const ctx = useContext(SolutionShowcaseContext)
  if (!ctx) {
    throw new Error('useSolutionShowcase must be used within SolutionShowcaseProvider')
  }
  return ctx
}
