export type MockVersionId = 'original' | 'option-a' | 'option-b'

export type MockVersionOption = {
  id: MockVersionId
  label: string
  badge?: string
}

export const MOCK_VERSION_OPTIONS: MockVersionOption[] = [
  { id: 'original', label: 'Original Mock' },
  { id: 'option-a', label: 'Option A', badge: 'Recommended' },
  { id: 'option-b', label: 'Option B' },
]

export const MOCK_VERSION_STORAGE_KEY = 'nfl-iq-mock-version'

export function isMockVersionId(value: string): value is MockVersionId {
  return MOCK_VERSION_OPTIONS.some((option) => option.id === value)
}
