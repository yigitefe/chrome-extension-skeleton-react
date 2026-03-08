import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStorage } from '../hooks/useStorage';

const COLOR_KEY = 'color';
const DEFAULT_COLOR = '#f9f9f9';

const App = () => {
    const {
        error,
        isLoading,
        isSaving,
        save: saveColor,
        setValue: setColor,
        value: color,
    } = useStorage('sync', COLOR_KEY, DEFAULT_COLOR);
    const [status, setStatus] = useState('');
    const statusTimeoutRef = useRef(null);

    useEffect(() => () => {
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }
    }, []);

    useEffect(() => {
        if (!error) {
            return;
        }

        setStatus(error);
    }, [error]);

    const saveOptions = useCallback(async () => {
        try {
            await saveColor(color);
            setStatus('Options saved.');

            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }

            statusTimeoutRef.current = setTimeout(() => setStatus(''), 750);
        } catch {
            // The hook already exposes the error message through `status`.
        }
    }, [color, saveColor]);

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ marginTop: 0 }}>Extension Options</h1>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
                Preferred Color:
                <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    disabled={isLoading || isSaving}
                    style={{ display: 'block', width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="#f9f9f9">Default (Light)</option>
                    <option value="#e0f7fa">Cyan</option>
                    <option value="#fff3e0">Orange</option>
                    <option value="#f3e5f5">Purple</option>
                </select>
            </label>
            <div style={{ height: '1.5rem', color: error ? '#dc2626' : '#10b981', marginBottom: '1rem' }}>
                {isLoading ? 'Loading settings...' : status}
            </div>
            <button onClick={saveOptions} disabled={isLoading || isSaving}>
                {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
        </div>
    );
};

export default App;
