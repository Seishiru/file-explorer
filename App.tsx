import React, { useState, useEffect, useRef } from 'react';
import { useFileSystemStore } from './hooks/useFileSystemStore';
import { useHotkeys, HotkeyConfig } from './hooks/useHotkeys';
import path from 'path';
import { FolderPicker } from './components/FolderPicker';
import { IgnoreList } from './components/IgnoreList';
import { SearchBar } from './components/SearchBar';
import { TreeViewer } from './components/TreeViewer';
import { Toolbar } from './components/Toolbar';
import { BookmarkPanel } from './components/BookmarkPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { HelpPanel } from './components/HelpPanel';
import { BuyMeCoffeeButton } from './components/BuyMeCoffeeButton';
import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from './components/ui/resizable';
import { toast } from 'sonner';

import "./styles/index.css"; 
import ReactDOM from 'react-dom/client';

try {
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(<App />);
  console.log("[DEBUG] App.tsx mounted successfully");
} catch (err) {
  console.error("[CRITICAL] Failed to render App.tsx:", err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<pre style="color:red;">Render failed: ${err}</pre>`;
  }
}

export default function App() {
  const {
    rootFolder,
    currentPath,
    ignoreRules,
    bookmarks,
    settings,
    searchQuery,
    searchResults,
    setCurrentPath,
    setRootFolder,
    setIgnoreRules,
    setSettings,
    setSearchQuery,
    toggleFolder,
    expandAll,
    collapseAll,
    addBookmark,
    removeBookmark,
    addTag,
    removeTag,
    refresh,
    exportAsJSON,
    exportAsText
  } = useFileSystemStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Theme & accent color
  useEffect(() => {document.documentElement.classList.toggle('dark', settings.theme === 'dark');}, [settings.theme]);
  useEffect(() => document.documentElement.style.setProperty('--accent-color', settings.accentColor), [settings.accentColor]);

  // ====== HELPER: Map raw folder content to FileSystemItem ======
  const mapToFileSystemItem = (item: any): any => ({
    id: item.path,
    name: item.name,
    path: item.path,
    type: item.type,
    size: item.size,
    modified: item.modified ? new Date(item.modified) : new Date(),
    children: item.children ? item.children.map(mapToFileSystemItem) : [],
    isExpanded: false,
    tags: item.tags || [],
    gitBranch: item.gitBranch,
    isGitRepo: item.isGitRepo,
  });

  // ====== Folder pick / drop handler ======
const handleFolderPick = async (folderPath: string) => {
  setCurrentPath(folderPath);

  try {
    const rawChildren = await window.electronAPI.readFolder(folderPath);

    // Get folder name safely
    const folderName = folderPath.split(/[/\\]/).pop() || folderPath;

    const mapped: any = {
      id: folderPath,
      name: folderName,
      path: folderPath,
      type: 'folder',
      children: rawChildren.map(mapToFileSystemItem),
      isExpanded: true
    };

    setRootFolder(mapped);
    toast.success(`Loaded folder: ${folderPath}`);
  } catch (err) {
    console.error("Failed to read folder:", err);
    toast.error("Failed to load folder");
  }
};


  const handleDrop = async (files: FileList) => {
    if (files.length === 0) return;
    const folderPath = (files[0] as any).path; // Electron provides real path
    if (folderPath) handleFolderPick(folderPath);
  };

  // ====== Bookmark handlers ======
  const handleBookmarkClick = (bookmark: any) => {
    setCurrentPath(bookmark.path);
    toast.info(`Navigated to: ${bookmark.name}`);
  };

  const handleAddBookmark = (item: any) => {
    addBookmark(item);
    toast.success(`Bookmarked: ${item.name}`);
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark(bookmarkId);
    toast.success('Bookmark removed');
  };

  // ====== Tag handlers ======
  const handleAddTag = (itemId: string, tag: string) => {
    addTag(itemId, tag);
    toast.success(`Tag "${tag}" added`);
  };
  const handleRemoveTag = (itemId: string, tag: string) => {
    removeTag(itemId, tag);
    toast.info(`Tag "${tag}" removed`);
  };

  // ====== Other utility handlers ======
  const handleExportJSON = () => { exportAsJSON(); toast.success('Tree exported as JSON'); };
  const handleExportText = () => { exportAsText(); toast.success('Tree exported as text'); };
  const handleToggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'dark';
    setSettings({ ...settings, theme: newTheme });
    toast.info(`Switched to ${newTheme} theme`);
  };

  // ====== HOTKEYS ======
  const hotkeys: HotkeyConfig[] = [
    { key: 'ctrl+r', action: refresh, description: 'Refresh current folder', category: 'Navigation' },
    { key: 'f5', action: refresh, description: 'Refresh current folder', category: 'Navigation' },
    { key: 'ctrl+e', action: expandAll, description: 'Expand all folders', category: 'View' },
    { key: 'ctrl+shift+e', action: collapseAll, description: 'Collapse all folders', category: 'View' },
    { key: 'ctrl+t', action: handleToggleTheme, description: 'Toggle theme', category: 'View' },
  ];
  useHotkeys(hotkeys);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: settings.accentColor }}>
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold">LINE File Explorer</h1>
            <p className="text-xs text-muted-foreground">Desktop-style folder browser</p>
          </div>
        </div>
        <BuyMeCoffeeButton />
      </div>

      {/* Toolbar */}
      <Toolbar
        showFiles={settings.showFiles}
        onShowFilesChange={(show) => setSettings({ ...settings, showFiles: show })}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        onExportJSON={handleExportJSON}
        onExportText={handleExportText}
        onOpenSettings={() => setShowSettings(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
            <div className="h-full bg-card border-r p-4 space-y-4 overflow-y-auto sidebar-scroll">
              <FolderPicker
                currentPath={currentPath}
                onPathChange={handleFolderPick}
                onRefresh={refresh}
                onDrop={handleDrop}
              />
              <IgnoreList ignoreRules={ignoreRules} onIgnoreRulesChange={setIgnoreRules} />
              <BookmarkPanel bookmarks={bookmarks} onBookmarkClick={handleBookmarkClick} onRemoveBookmark={handleRemoveBookmark} />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Main Tree */}
          <ResizablePanel defaultSize={75}>
            <div className="h-full flex flex-col">
              <SearchBar query={searchQuery} onQueryChange={setSearchQuery} results={searchResults} />
              <div className="flex-1 p-4 overflow-y-auto main-content-scroll">
                <TreeViewer
                  rootFolder={rootFolder}
                  onToggleFolder={toggleFolder}
                  onAddBookmark={handleAddBookmark}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <SettingsPanel settings={settings} onSettingsChange={setSettings} open={showSettings} onOpenChange={setShowSettings} />
      <HelpPanel open={showHelp} onOpenChange={setShowHelp} hotkeys={hotkeys} />
    </div>
  );
}
