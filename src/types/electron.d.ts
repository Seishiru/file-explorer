// src/types/electron.d.ts
import type { FileSystemItem } from '../../types/file-system';

export interface ElectronAPI {
  /** Opens a folder picker and resolves to the selected path or null if cancelled. */
  selectFolder: () => Promise<string | null>;

  /** Reads a folder and returns an array of FileSystemItem (synchronous in current preload). */
  readFolder: (folderPath: string) => FileSystemItem[];

  /**
   * Opens a file or folder using the OS. Resolves to an empty string on success,
   * or a non-empty error message string on failure (matches Electron's shell.openPath).
   */
  openPath: (targetPath: string) => Promise<string>;

  /** Shows/reveals an item in the OS file manager. Resolves true if shown. */
  showItemInFolder: (targetPath: string) => Promise<boolean>;

  /** Async prompt exposed by preload: await window.electronAPI.prompt(msg, default). */
  prompt: (message: string, defaultValue?: string) => Promise<string | null>;

  /** Optional debug logger that forwards messages to preload/main logs. */
  debugLog?: (message: string) => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
