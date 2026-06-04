import { useState, useEffect, useCallback } from 'react'

/**
 * Generic localStorage-backed state hook.
 * Behaves like useState but persists the value under `key`.
 * Returns [value, setValue]. setValue accepts a value or an updater fn.
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored)
      }
    } catch (err) {
      console.warn(`useLocalStorage: failed to read "${key}"`, err)
    }
    return defaultValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorage: failed to write "${key}"`, err)
    }
  }, [key, value])

  const set = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next))
  }, [])

  return [value, set]
}

export default useLocalStorage
