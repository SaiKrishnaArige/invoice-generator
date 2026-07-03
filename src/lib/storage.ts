const NAMESPACE = 'the-home-editors:estimator'

export const STORAGE_KEYS = {
  invoices: `${NAMESPACE}:invoices`,
  draft: `${NAMESPACE}:draft`,
  company: `${NAMESPACE}:company`,
  theme: `${NAMESPACE}:theme`,
  sequence: `${NAMESPACE}:sequence`,
} as const

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
