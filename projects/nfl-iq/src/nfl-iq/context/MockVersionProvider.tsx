import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  isMockVersionId,
  MOCK_VERSION_STORAGE_KEY,
  type MockVersionId,
} from '../mock-version'
import {
  MockVersionContext,
  type MockVersionContextValue,
} from './mock-version-context'

function readStoredVersion(): MockVersionId {
  try {
    const stored = localStorage.getItem(MOCK_VERSION_STORAGE_KEY)
    if (stored && isMockVersionId(stored)) return stored
  } catch {
    /* ignore */
  }
  return 'original'
}

export function MockVersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<MockVersionId>(readStoredVersion)

  const setVersion = useCallback((next: MockVersionId) => {
    setVersionState(next)
    try {
      localStorage.setItem(MOCK_VERSION_STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo<MockVersionContextValue>(
    () => ({ version, setVersion }),
    [version, setVersion],
  )

  return (
    <MockVersionContext.Provider value={value}>
      {children}
    </MockVersionContext.Provider>
  )
}
