import React, { useState, useEffect } from 'react'

const App = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Load count
        chrome.storage.sync.get(['count'], (result) => {
            if (result.count) setCount(result.count);
        });

        // Load background color preference
        chrome.storage.sync.get(['color'], (result) => {
            if (result.color) {
                document.body.style.backgroundColor = result.color;
            }
        });
    }, []);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        chrome.storage.sync.set({ count: newCount });
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
