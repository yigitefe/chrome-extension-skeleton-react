import React, { useEffect } from 'react';
import { useStorage } from '../hooks/useStorage';

const COUNT_KEY = 'count';
const COLOR_KEY = 'color';

const App = () => {
    const { save: saveCount, value: count } = useStorage('local', COUNT_KEY, 0);
    const { value: color } = useStorage('sync', COLOR_KEY);

    useEffect(() => {
        document.body.style.backgroundColor = color;
    }, [color]);

    const increment = () => {
        saveCount(count + 1);
    };

    const openOptions = () => {
        chrome.runtime.openOptionsPage();
    };

    return (
        <div style={{ width: '300px', padding: '1rem' }}>
            <h1>Hello React Ext!</h1>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <a href="#" onClick={openOptions} style={{ display: 'block', marginTop: '1rem', color: '#646cff' }}>
                Open Options
            </a>
        </div>
    );
};

export default App;
