import React, { useState } from 'react';

const ContentApp = () => {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '8px',
            zIndex: 9999,
            fontSize: '14px',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>React Extension Active</span>
                <button
                    onClick={() => setVisible(false)}
                    style={{
                        background: 'transparent',
                        border: '1px solid white',
                        color: 'white',
                        padding: '2px 6px',
                        fontSize: '10px',
                        cursor: 'pointer'
                    }}
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default ContentApp;
