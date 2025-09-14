import { useState, useCallback, useEffect } from 'react';
import { FileSystemItem, IgnoreRule, BookmarkedFolder, AppSettings, SearchResult } from '../types/file-system';
import { createMockFileSystem } from '../utils/mock-file-system';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  accentColor: '#06C755',
  showFiles: true,
  showHiddenFiles: false,
  autoRefresh: true,
  treeColumns: {
    name: 60,
    size: 20,
    modified: 20
  }
};

const DEFAULT_IGNORE_RULES: IgnoreRule[] = [
  { name: 'node_modules', pattern: 'node_modules', enabled: true },
  { name: 'git', pattern: '.git', enabled: false },
  { name: 'pycache', pattern: '__pycache__', enabled: true },
  { name: 'dist', pattern: 'dist', enabled: true },
  { name: 'build', pattern: 'build', enabled: true }
];

const createEmptyRoot = (): FileSystemItem => ({
  id: 'empty-root',
  name: 'Root',
  path: '',
  type: 'folder',
  size: 0,
  modified: new Date(),
  isExpanded: false,
  children: []
});

export const useFileSystemStore = () => {
  const [rootFolder, setRootFolder] = useState<FileSystemItem>(() => createEmptyRoot());
  const [currentPath, setCurrentPath] = useState<string>('');
  const [ignoreRules, setIgnoreRules] = useState<IgnoreRule[]>(DEFAULT_IGNORE_RULES);
  const [bookmarks, setBookmarks] = useState<BookmarkedFolder[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Apply ignore rules to filter items
  const shouldIgnoreItem = useCallback((item: FileSystemItem): boolean => {
    return ignoreRules.some(rule => 
      rule.enabled && item.name.includes(rule.pattern)
    );
  }, [ignoreRules]);

  // Recursively filter the tree based on ignore rules and settings
  const filterTree = useCallback((items: FileSystemItem[]): FileSystemItem[] => {
    return items
      .filter(item => {
        if (shouldIgnoreItem(item)) return false;
        if (!settings.showHiddenFiles && item.name.startsWith('.')) return false;
        if (!settings.showFiles && item.type === 'file') return false;
        return true;
      })
      .map(item => ({
        ...item,
        children: item.children ? filterTree(item.children) : undefined
      }));
  }, [shouldIgnoreItem, settings.showFiles, settings.showHiddenFiles]);

  // Get filtered root folder
  const filteredRootFolder = useCallback(() => {
    return {
      ...rootFolder,
      children: rootFolder.children ? filterTree(rootFolder.children) : undefined
    };
  }, [rootFolder, filterTree]);

  // Toggle folder expansion
  const toggleFolder = useCallback((itemId: string) => {
    const toggleInTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded };
        }
        if (item.children) {
          return { ...item, children: toggleInTree(item.children) };
        }
        return item;
      });
    };

    setRootFolder(prev => ({
      ...prev,
      children: prev.children ? toggleInTree(prev.children) : undefined
    }));
  }, []);

  // Expand all folders
  const expandAll = useCallback(() => {
    const expandInTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => ({
        ...item,
        isExpanded: item.type === 'folder',
        children: item.children ? expandInTree(item.children) : undefined
      }));
    };

    setRootFolder(prev => ({
      ...prev,
      isExpanded: true,
      children: prev.children ? expandInTree(prev.children) : undefined
    }));
  }, []);

  // Collapse all folders
  const collapseAll = useCallback(() => {
    const collapseInTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => ({
        ...item,
        isExpanded: false,
        children: item.children ? collapseInTree(item.children) : undefined
      }));
    };

    setRootFolder(prev => ({
      ...prev,
      isExpanded: false,
      children: prev.children ? collapseInTree(prev.children) : undefined
    }));
  }, []);

  // Search functionality
  const searchInTree = useCallback((items: FileSystemItem[], query: string): SearchResult[] => {
    const results: SearchResult[] = [];
    
    const searchRecursive = (items: FileSystemItem[]) => {
      for (const item of items) {
        if (item.name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            item,
            matches: [item.name]
          });
        }
        if (item.children) {
          searchRecursive(item.children);
        }
      }
    };

    searchRecursive(items);
    return results;
  }, []);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchInTree(rootFolder.children || [], searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, rootFolder, searchInTree]);

  // Add bookmark
  const addBookmark = useCallback((item: FileSystemItem) => {
    const bookmark: BookmarkedFolder = {
      id: `bookmark-${Date.now()}`,
      name: item.name,
      path: item.path,
      addedAt: new Date()
    };
    setBookmarks(prev => [...prev, bookmark]);
  }, []);

  // Remove bookmark
  const removeBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  }, []);

  // Add tag to item
  const addTag = useCallback((itemId: string, tag: string) => {
    const addTagInTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          const tags = item.tags || [];
          return { ...item, tags: [...tags, tag] };
        }
        if (item.children) {
          return { ...item, children: addTagInTree(item.children) };
        }
        return item;
      });
    };

    setRootFolder(prev => ({
      ...prev,
      children: prev.children ? addTagInTree(prev.children) : undefined
    }));
  }, []);

  // Remove tag from item
  const removeTag = useCallback((itemId: string, tag: string) => {
    const removeTagInTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === itemId) {
          const tags = (item.tags || []).filter(t => t !== tag);
          return { ...item, tags };
        }
        if (item.children) {
          return { ...item, children: removeTagInTree(item.children) };
        }
        return item;
      });
    };

    setRootFolder(prev => ({
      ...prev,
      children: prev.children ? removeTagInTree(prev.children) : undefined
    }));
  }, []);

  // Refresh the file system (simulate)
  const refresh = useCallback(() => {
    if (currentPath) {
      const mockFolder = createMockFileSystem();
      mockFolder.name = currentPath.split(/[/\\]/).pop() || 'Folder';
      mockFolder.path = currentPath;
      setRootFolder(mockFolder);
    }
  }, [currentPath]);

  // Export tree as JSON
  const exportAsJSON = useCallback(() => {
    const dataStr = JSON.stringify(filteredRootFolder(), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'file-tree.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [filteredRootFolder]);

  // Export tree as text
  const exportAsText = useCallback(() => {
    const generateTextTree = (items: FileSystemItem[], indent = ''): string => {
      return items.map(item => {
        const line = `${indent}${item.type === 'folder' ? '📁' : '📄'} ${item.name}\n`;
        const children = item.children && item.isExpanded 
          ? generateTextTree(item.children, indent + '  ') 
          : '';
        return line + children;
      }).join('');
    };

    const textContent = generateTextTree(filteredRootFolder().children || []);
    const dataUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent);
    const exportFileDefaultName = 'file-tree.txt';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [filteredRootFolder]);

  return {
    rootFolder: filteredRootFolder(),
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
  };
};
