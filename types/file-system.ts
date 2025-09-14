export interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modified: Date;
  children?: FileSystemItem[];
  isExpanded?: boolean;
  isGitRepo?: boolean;
  gitBranch?: string;
  tags?: string[];
}

export interface IgnoreRule {
  name: string;
  pattern: string;
  enabled: boolean;
}

export interface BookmarkedFolder {
  id: string;
  name: string;
  path: string;
  addedAt: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  accentColor: string;
  showFiles: boolean;
  showHiddenFiles: boolean;
  autoRefresh: boolean;
  treeColumns: {
    name: number;
    size: number;
    modified: number;
  };
}

export interface SearchResult {
  item: FileSystemItem;
  matches: string[];
}
