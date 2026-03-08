# Chrome Extension Skeleton (React, Vite + CRXJS)

A modern, production-ready skeleton for building Chrome Extensions using **React**, **Vite**, **CRXJS**, and **Manifest V3**.

## Features

- ⚛️ **React** powered Popup, Options, Side Panel, and Content Scripts.
- ⚡ **Instant HMR** (Hot Module Replacement) for all extension parts.
- 📦 **Manifest V3** compliant.
- 🛠 **Vite** powered build system.
- 🧩 **Examples included**:
  - **Popup**: Counter demo with React State & storage sync.
  - **Options**: Settings page with React forms.
  - **Background**: Service Worker with alarms.
  - **Content Script**: React component injection into Shadow DOM.
  - **Side Panel**: Persistent React view.

## Project Structure

```text
src/
├── action/           # Popup (React Root)
├── options/          # Options Page (React Root)
├── sidepanel/        # Side Panel (React Root)
├── content/          # Content Script (React Injection)
├── background/       # Service Worker (Pure JS)
└── assets/           # Icons
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Mode

```bash
npm run dev
```

This will start the Vite dev server.

- Open Chrome and go to `chrome://extensions`.
- Enable **Developer mode**.
- Load the `dist` folder.
- **CRXJS Note**: Changes to React components will HMR automatically.

### 3. Build for Production

```bash
npm run build
```

Generates a production-ready build in the `dist` folder.

## Demos & Usage

- **Popup**: Click the extension icon. The counter state persists using `chrome.storage` hooks.
- **Options**: Right-click > Options. Change the color preference.
- **Content Script**: Visit any website. A floating "React Extension Active" widget appears in the bottom right.
