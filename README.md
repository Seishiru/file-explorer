# LINE File Explorer

Desktop-style file explorer built with **React**, **Electron**, and **TypeScript**.  
It allows you to browse, search, and manage folders and files on your local machine with a modern UI.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Hotkeys](#hotkeys)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Browse local folders in a tree view.
- Drag & drop folders to load.
- Search files and folders in real-time.
- Bookmark favorite folders for quick access.
- Toggle light/dark theme.
- Expand/collapse folders and manage tags.
- Export folder structure as JSON or text.
- Customizable ignore rules for files/folders.
- Supports keyboard shortcuts for quick navigation.

---

## Screenshots

*You can add screenshots here after running the app.*

---

## Installation

1. Clone the repository:

```
bash
git clone https://github.com/Seishiru/file-explorer.git
cd file-explorer
```
2. Install dependencies:
```
npm install
```
3. Run the app in development mode:
```
npm run dev
```
4. Build the app for production:
```
npm run build
```

## Usage

Click on "Browse Folders" or drag & drop a folder to explore.

Use the search bar to quickly find files and folders.

Right-click on items to add bookmarks or tags.

Use the toolbar for actions like expand/collapse all folders or export tree structure.

## Folder Structure

```
fe/
├─ src/
│  ├─ components/      # React components
│  ├─ hooks/           # Custom hooks
│  ├─ utils/           # Utility functions
│  ├─ styles/          # CSS/SCSS styles
│  └─ App.tsx          # Main App component
├─ preload.js           # Electron preload script
├─ package.json
└─ ...
```

## Hotkeys
| Shortcut         | Action                            |
|-----------------|------------------------------------|
| Ctrl + R / F5   | Refresh current folder             |
| Ctrl + E        | Expand all folders                 |
| Ctrl + Shift + E| Collapse all folders               |
| Ctrl + H        | Toggle show/hide files             |
| Ctrl + T        | Toggle light/dark theme            |
| Ctrl + F        | Focus search bar                   |
| Ctrl + D        | Bookmark current folder            |
| Ctrl + Shift + J| Export folder tree as JSON         |
| Ctrl + Shift + T| Export folder tree as text         |
| F1              | Show help panel                    |
