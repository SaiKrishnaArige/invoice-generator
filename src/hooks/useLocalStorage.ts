import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage<T>(key, initialValue))

  useEffect(() => {
    writeStorage(key, value)
  }, [key, value])

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === 'function' ? (next as (prev: T) => T)(prev) : next))
  }, [])

  return [value, update] as const
}
