import React, { useState } from 'react'
import { useStorage } from '../hooks/useStorage'

const COLOR_KEY = 'color'
const DEFAULT_COLOR = '#f9f9f9'

const App = () => {
  const colorStorage = useStorage('sync', COLOR_KEY, DEFAULT_COLOR)
  const [status, setStatus] = useState('')
  const message = colorStorage.error || status
  const messageColor = colorStorage.error ? '#dc2626' : '#10b981'

  const handleColorChange = event => {
    colorStorage.setValue(event.target.value)
    setStatus('')
  }

  const saveOptions = async () => {
    try {
      await colorStorage.save(colorStorage.value)
      setStatus('Options saved.')
      setTimeout(() => {
        setStatus('')
      }, 750)
    } catch {
      // The error message comes from the hook.
    }
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Extension Options</h1>
      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Preferred Color:
        <select
          value={colorStorage.value}
          onChange={handleColorChange}
          disabled={colorStorage.disabled}
          style={{
            display: 'block',
            width: '100%',
            marginTop: '0.5rem',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        >
          <option value="#f9f9f9">Default (Light)</option>
          <option value="#e0f7fa">Cyan</option>
          <option value="#fff3e0">Orange</option>
          <option value="#f3e5f5">Purple</option>
        </select>
      </label>
      <div role="status" style={{ minHeight: '1.5rem', color: messageColor, marginBottom: '1rem' }}>
        {message}
      </div>
      <button onClick={saveOptions} disabled={colorStorage.disabled}>
        {colorStorage.isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  )
}

export default App
