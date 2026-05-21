import { useCallback, useState } from 'react'
import type { OptionASortDirection } from '../components/OptionASortableTh'

export function useOptionATableSort<T extends string>(
  defaultKey: T,
  defaultDirection: OptionASortDirection = 'asc',
) {
  const [sortKey, setSortKey] = useState<T>(defaultKey)
  const [sortDirection, setSortDirection] =
    useState<OptionASortDirection>(defaultDirection)

  const handleSort = useCallback(
    (key: string) => {
      const nextKey = key as T
      if (sortKey === nextKey) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(nextKey)
        setSortDirection('asc')
      }
    },
    [sortKey],
  )

  return { sortKey, sortDirection, handleSort }
}
