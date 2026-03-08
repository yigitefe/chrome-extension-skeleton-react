import React, { useEffect, useMemo } from 'react';
import { useStorage } from '../hooks/useStorage';

const COUNT_KEY = 'count';
const COLOR_KEY = 'color';

const App = () => {
    const {
        isLoading: isCountLoading,
        isSaving: isCountSaving,
        loadError: countLoadError,
        save: saveCount,
        saveError: countSaveError,
        value: count,
    } = useStorage('local', COUNT_KEY, 0);
    const {
        isLoading: isColorLoading,
        loadError: colorLoadError,
        value: color,
    } = useStorage('sync', COLOR_KEY);

    const status = useMemo(() => {
        const loadError = countLoadError || colorLoadError;

        if (loadError) {
            return `Unable to load saved data: ${loadError}`;
        }

        if (countSaveError) {
            return `Unable to save count: ${countSaveError}`;
        }

        return '';
    }, [colorLoadError, countLoadError, countSaveError]);

    useEffect(() => {
        if (color) {
            document.body.style.backgroundColor = color;
        }
    }, [color]);

    const increment = async () => {
        try {
            await saveCount(count + 1);
        } catch {
            // The status section renders the storage error message.
        }
    };

    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    };

    const hasLoadError = Boolean(countLoadError || colorLoadError);
    const isBusy = isCountLoading || isColorLoading || isCountSaving;

    return (
        <div style={{ width: '300px', padding: '1rem' }}>
            <h1>Hello React Ext!</h1>
            <p>Count: {count}</p>
            <button onClick={increment} disabled={isBusy || hasLoadError}>
                {isCountSaving ? 'Saving...' : 'Increment'}
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
                {status}
            </p>
            <a href="#" onClick={openOptions} style={{ display: 'block', marginTop: '1rem', color: '#646cff' }}>
                Open Options
            </a>
        </div>
    );
};

export default App;
