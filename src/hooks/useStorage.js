import { useCallback, useEffect, useState } from 'react'

function getStorageArea(areaName) {
  const area = globalThis.chrome?.storage?.[areaName]

  if (!area) {
    throw new Error(`chrome.storage.${areaName} is not available`)
  }

  return area
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function getRuntimeError() {
  const message = globalThis.chrome?.runtime?.lastError?.message

  return message ? new Error(message) : null
}

function readStorageValue(areaName, key) {
  return new Promise((resolve, reject) => {
    let area

    try {
      area = getStorageArea(areaName)
    } catch (error) {
      reject(error)
      return
    }

    area.get([key], result => {
      const runtimeError = getRuntimeError()

      if (runtimeError) {
        reject(runtimeError)
        return
      }

      resolve(result[key])
    })
  })
}

function writeStorageValue(areaName, key, value) {
  return new Promise((resolve, reject) => {
    let area

    try {
      area = getStorageArea(areaName)
    } catch (error) {
      reject(error)
      return
    }

    area.set({ [key]: value }, () => {
      const runtimeError = getRuntimeError()

      if (runtimeError) {
        reject(runtimeError)
        return
      }

      resolve(value)
    })
  })
}

export function useStorage(areaName, key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    setIsLoading(true)
    setError('')

    readStorageValue(areaName, key)
      .then(storedValue => {
        if (!active) {
          return
        }

        setValue(storedValue ?? initialValue)
        setError('')
      })
      .catch(storageError => {
        if (!active) {
          return
        }

        setError(getErrorMessage(storageError))
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    const handleChange = (changes, changedAreaName) => {
      if (changedAreaName !== areaName || !(key in changes)) {
        return
      }

      setValue(changes[key].newValue ?? initialValue)
    }

    globalThis.chrome?.storage?.onChanged?.addListener(handleChange)

    return () => {
      active = false
      globalThis.chrome?.storage?.onChanged?.removeListener(handleChange)
    }
  }, [areaName, initialValue, key])

  const save = useCallback(
    async nextValue => {
      setIsSaving(true)
      setError('')

      try {
        await writeStorageValue(areaName, key, nextValue)
        setValue(nextValue)
        return nextValue
      } catch (storageError) {
        const message = getErrorMessage(storageError)

        setError(message)
        throw new Error(message)
      } finally {
        setIsSaving(false)
      }
    },
    [areaName, key],
  )

  return {
    disabled: isLoading || isSaving || Boolean(error),
    error,
    isLoading,
    isSaving,
    save,
    setValue,
    value,
  }
}
