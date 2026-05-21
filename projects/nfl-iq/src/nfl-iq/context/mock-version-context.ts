import { createContext } from 'react'
import type { MockVersionId } from '../mock-version'

export type MockVersionContextValue = {
  version: MockVersionId
  setVersion: (version: MockVersionId) => void
}

export const MockVersionContext = createContext<MockVersionContextValue | null>(
  null,
)
