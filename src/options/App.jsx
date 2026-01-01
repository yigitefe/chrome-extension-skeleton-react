import React, { useState, useEffect } from 'react'

const App = () => {
    const [color, setColor] = useState('#f9f9f9');
    const [status, setStatus] = useState('');

    useEffect(() => {
        chrome.storage.sync.get(['color'], (result) => {
            if (result.color) setColor(result.color);
        });
    }, []);

    const saveOptions = () => {
        chrome.storage.sync.set({ color: color }, () => {
            setStatus('Options saved.');
            setTimeout(() => setStatus(''), 750);
        });
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h1 style={{ marginTop: 0 }}>Extension Options</h1>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
                Preferred Color:
                <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ display: 'block', width: '100%', marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="#f9f9f9">Default (Light)</option>
                    <option value="#e0f7fa">Cyan</option>
                    <option value="#fff3e0">Orange</option>
                    <option value="#f3e5f5">Purple</option>
                </select>
            </label>
            <div style={{ height: '1.5rem', color: '#10b981', marginBottom: '1rem' }}>{status}</div>
            <button onClick={saveOptions}>Save Settings</button>
        </div>
    );
};

export default App;
