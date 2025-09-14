import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronDown, Tag, Bookmark, Copy, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from './ui/context-menu';
import { FileSystemItem } from '../types/file-system';
import { formatFileSize, getFileIcon } from '../utils/mock-file-system';

interface TreeViewerProps {
  rootFolder: FileSystemItem;
  onToggleFolder: (itemId: string) => void;
  onAddBookmark?: (item: FileSystemItem) => void;
  onAddTag?: (itemId: string, tag: string) => void;
  onRemoveTag?: (itemId: string, tag: string) => void;
  searchQuery?: string;
}

interface TreeItemProps {
  item: FileSystemItem;
  level: number;
  onToggleFolder: (itemId: string) => void;
  onAddBookmark?: (item: FileSystemItem) => void;
  onAddTag?: (itemId: string, tag: string) => void;
  onRemoveTag?: (itemId: string, tag: string) => void;
  searchQuery?: string;
}

const TreeItem: React.FC<TreeItemProps> = ({
  item,
  level,
  onToggleFolder,
  onAddBookmark,
  onAddTag,
  onRemoveTag,
  searchQuery
}) => {
  const [showTagInput, setShowTagInput] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (item.type === 'folder') onToggleFolder(item.id);
  };

  // safe helper that prefers electronAPI.prompt and never throws
  async function askPrompt(message: string, defaultValue = ''): Promise<string | null> {
    try {
      // prefer the preload-provided async prompt (if present)
      // @ts-ignore - electronAPI is injected at runtime
      if (typeof window !== 'undefined' && (window as any).electronAPI?.prompt) {
        // @ts-ignore
        return await (window as any).electronAPI.prompt(message, defaultValue);
      }
    } catch (e) {
      // ignore and fall back
      try { (window as any).electronAPI?.debugLog?.(`[askPrompt] electronAPI.prompt error: ${String(e)}`); } catch {}
    }

    // fallback to native prompt if it exists, but guard in try/catch
    try {
      // native prompt might throw in this environment; wrap it
      // eslint-disable-next-line no-alert
      const val = (window as any).prompt ? (window as any).prompt(message, defaultValue) : null;
      return val;
    } catch (e) {
      try { (window as any).electronAPI?.debugLog?.(`[askPrompt] native prompt error: ${String(e)}`); } catch {}
      return null;
    }
  }

  const handleDoubleClick = async () => {
    if (item.type === 'file') {
      try {
        // @ts-ignore
        await (window as any).electronAPI?.openPath?.(item.path);
      } catch (err) {
        console.error('openPath error:', err);
        try { (window as any).electronAPI?.debugLog?.(`openPath error: ${String(err)}`); } catch {}
      }
    }
  };

  const handleCopyPath = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(item.path);
      } else {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = item.path;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch (err) {
      console.error('copyPath error:', err);
    }
  };

  const handleOpenInExplorer = async () => {
    try {
      // If folder, open path; if file, reveal in folder
      // @ts-ignore
      if (item.type === "folder") {
        // @ts-ignore
        await (window as any).electronAPI?.openPath?.(item.path);
      } else {
        // @ts-ignore
        await (window as any).electronAPI?.showItemInFolder?.(item.path);
      }
    } catch (err) {
      console.error('show/open in explorer error:', err);
      try { (window as any).electronAPI?.debugLog?.(`show/open error: ${String(err)}`); } catch {}
    }
  };

  const handleAddTag = async () => {
    // If inline tag input already visible, just focus it; otherwise pop a prompt
    if (showTagInput) {
      setTimeout(() => tagInputRef.current?.focus(), 0);
      return;
    }

    // ask user for tag using safe askPrompt (won't crash if native prompt not supported)
    const tag = (await askPrompt('Add tag', ''))?.trim();
    if (tag && onAddTag) onAddTag(item.id, tag);
  };

  const submitTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const tag = (e.target as HTMLInputElement).value.trim();
      if (tag && onAddTag) {
        onAddTag(item.id, tag);
        setShowTagInput(false);
      }
    } else if (e.key === 'Escape') setShowTagInput(false);
  };

  const isHighlighted = searchQuery &&
    item.name.toLowerCase().includes(searchQuery.toLowerCase());
  const paddingLeft = level * 16 + 8;

  return (
    <TooltipProvider>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`group flex items-center gap-2 px-2 py-1 hover:bg-accent/50 cursor-pointer ${isHighlighted ? 'border-l-2' : ''}`}
            style={{
              paddingLeft,
              ...(isHighlighted ? {
                backgroundColor: 'color-mix(in srgb, var(--accent-color) 10%, transparent)',
                borderLeftColor: 'var(--accent-color)'
              } : {})
            }}
            onClick={handleToggle}
            onDoubleClick={handleDoubleClick}
          >
            {item.type === 'folder' && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-4 w-4 hover:bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle();
                }}
              >
                {item.isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>
            )}

            {item.type === 'file' && <div className="w-4" />}

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base">{getFileIcon(item)}</span>
                  <span className="text-sm truncate">
                    {isHighlighted && searchQuery ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.name.replace(
                            new RegExp(`(${searchQuery})`, 'gi'),
                            '<mark style="background-color: color-mix(in srgb, var(--accent-color) 30%, transparent);" class="px-0.5 rounded">$1</mark>'
                          )
                        }}
                      />
                    ) : item.name}
                  </span>
                  {item.isGitRepo && <Badge variant="secondary" className="text-xs px-1 py-0">git</Badge>}
                  {item.gitBranch && <Badge variant="outline" className="text-xs px-1 py-0">{item.gitBranch}</Badge>}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-64">
                <div className="space-y-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-muted-foreground">{item.path}</div>
                  <div className="text-xs">
                    {item.type === 'file' && item.size && `Size: ${formatFileSize(item.size)}`}<br />
                    Modified: {item.modified.toLocaleDateString()}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.size && <span className="text-xs text-muted-foreground">{formatFileSize(item.size)}</span>}
              {item.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs px-1 py-0 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={(e) => { e.stopPropagation(); onRemoveTag?.(item.id, tag); }}
                >
                  {tag} ×
                </Badge>
              ))}
              {showTagInput && (
                <input
                  ref={tagInputRef}
                  type="text"
                  className="text-xs px-1 py-0 border rounded w-16 bg-background"
                  placeholder="tag"
                  onKeyDown={submitTag}
                  onBlur={() => setShowTagInput(false)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={handleCopyPath}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Path
          </ContextMenuItem>
          <ContextMenuItem onClick={handleOpenInExplorer}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Explorer
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => onAddBookmark?.(item)}>
            <Bookmark className="h-4 w-4 mr-2" />
            Add Bookmark
          </ContextMenuItem>
          <ContextMenuItem onClick={handleAddTag}>
            <Tag className="h-4 w-4 mr-2" />
            Add Tag
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {item.type === 'folder' && item.isExpanded && item.children && (
        <div>
          {item.children.map(child => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onToggleFolder={onToggleFolder}
              onAddBookmark={onAddBookmark}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </TooltipProvider>
  );
};

export const TreeViewer: React.FC<TreeViewerProps> = ({
  rootFolder,
  onToggleFolder,
  onAddBookmark,
  onAddTag,
  onRemoveTag,
  searchQuery
}) => {
  const noFolderSelected = !rootFolder.path || rootFolder.path === '' || rootFolder.name === 'Root';

  if (noFolderSelected) {
    return (
      <div className="h-full flex items-center justify-center border rounded-md bg-card">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <div className="text-6xl mb-4">📂</div>
            <h2 className="text-xl font-medium mb-2">Welcome to LINE File Explorer</h2>
            <p className="text-muted-foreground">Your desktop-style folder browser with LINE's clean aesthetic</p>
          </div>

          <div className="space-y-6 text-left">
            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">🚀</span>
                Get Started
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                <li>• Drag & drop a folder from your file explorer</li>
                <li>
                  • <button
                    onClick={async () => {
                      // @ts-ignore
                      const folderPath = await (window as any).electronAPI?.selectFolder?.();
                      if (folderPath) {
                        console.log('Selected folder:', folderPath);
                        // TODO: update your state / call function to read folder
                      }
                    }}
                    className="text-blue-500 underline hover:text-blue-600"
                  >
                    Browse Folders
                  </button>
                </li>
                <li>• Or type a folder path in the input above</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">🔍</span>
                Powerful Search
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                <li>• Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd> to focus search</li>
                <li>• Search by filename, extension, or path</li>
                <li>• Use ignore rules to filter results</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">⌨️</span>
                Keyboard Shortcuts
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1 pl-6">
                <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">F1</kbd> Show all shortcuts</li>
                <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+T</kbd> Toggle theme</li>
                <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+D</kbd> Bookmark folder</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
            <p>💡 Tip: Right-click on files and folders for context menu options</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto border rounded-md bg-card">
      <div className="sticky top-0 bg-card border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-base">📁</span>
          <span className="font-medium">{rootFolder.name}</span>
          <span className="text-xs text-muted-foreground">{rootFolder.path}</span>
        </div>
      </div>

      <div className="p-2">
        {rootFolder.children && rootFolder.children.length > 0 ? (
          rootFolder.children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={0}
              onToggleFolder={onToggleFolder}
              onAddBookmark={onAddBookmark}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <span className="text-4xl mb-2 block">📂</span>
            <p>No items to display</p>
            <p className="text-xs mt-1">Check your ignore rules or refresh the folder</p>
          </div>
        )}
      </div>
    </div>
  );
};
