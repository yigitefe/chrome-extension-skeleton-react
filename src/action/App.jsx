import React, { useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';

const COUNT_KEY = 'count';
const COLOR_KEY = 'color';

const App = () => {
    const countStorage = useStorage('local', COUNT_KEY, 0);
    const colorStorage = useStorage('sync', COLOR_KEY);
    const error = countStorage.error || colorStorage.error;
    const isDisabled = countStorage.disabled || colorStorage.disabled;

    useEffect(() => {
        document.body.style.backgroundColor = colorStorage.value;
    }, [colorStorage.value]);

    const increment = async () => {
        try {
            await countStorage.save(countStorage.value + 1);
        } catch {
            // The error message is rendered in the status area.
        }
    };

    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    };

    return (
        <div style={{ width: '300px', padding: '1rem' }}>
            <h1>Hello React Ext!</h1>
            <p>Count: {countStorage.value}</p>
            <button onClick={increment} disabled={isDisabled}>
                {countStorage.isSaving ? 'Saving...' : 'Increment'}
            </button>
            <p
                role="status"
                style={{
                    minHeight: '1.25rem',
                    margin: '0.75rem 0 0',
                    color: '#b91c1c',
                    fontSize: '0.875rem',
                }}
            >
                {error ? `Storage error: ${error}` : ''}
            </p>
            <a href="#" onClick={openOptions} style={{ display: 'block', marginTop: '1rem', color: '#646cff' }}>
                Open Options
            </a>
        </div>
    );
};

export default App;
