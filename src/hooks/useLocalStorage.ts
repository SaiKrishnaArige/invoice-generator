import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

/**
 * Optional `migrate` normalizes values coming from storage (or from any functional
 * update) so older, differently-shaped saved data keeps working after a schema change.
 */
export function useLocalStorage<T>(key: string, initialValue: T, migrate?: (value: T) => T) {
  const [value, setValue] = useState<T>(() => {
    const stored = readStorage<T>(key, initialValue)
    return migrate ? migrate(stored) : stored
  })

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next
        return migrate ? migrate(resolved) : resolved
      })
    },
    [migrate],
  )

  return [value, update] as const
}
