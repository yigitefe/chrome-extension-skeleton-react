import React from 'react'
import ReactDOM from 'react-dom/client'
import ContentApp from './ContentApp.jsx'

console.log('Content script loaded');

const rootId = 'chrome-extension-react-root';

// Ensure we don't inject twice
if (!document.getElementById(rootId)) {
    const rootDiv = document.createElement('div');
    rootDiv.id = rootId;
    document.body.appendChild(rootDiv);

    // Create shadow DOM for style isolation
    const shadowRoot = rootDiv.attachShadow({ mode: 'open' });

    // Inject styles into shadow DOM if needed (e.g. from a string or fetching text)
    // For now we just mount the app

    // We need a container inside shadow dom for React to attach to
    const appContainer = document.createElement('div');
    shadowRoot.appendChild(appContainer);

    ReactDOM.createRoot(appContainer).render(
        <React.StrictMode>
            <ContentApp />
        </React.StrictMode>
    );
}
